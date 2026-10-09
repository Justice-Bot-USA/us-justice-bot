import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse } from "../_shared/errors.ts";
import { getServiceClient, startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";
import { 
  SWEEP_SYSTEM_PROMPT, 
  getIntakePrompt, 
  getClassificationPrompt,
  getVenuePrompt,
  getTimelinePrompt,
  getAuthorityPrompt,
  getAnalysisPrompt,
  pickPlainSummary
} from "../_shared/sweepPrompts.ts";

// Sweep order - runs sequentially
const SWEEP_ORDER = [
  'intake',
  'evidenceIndex',
  'classification',
  'venue',
  'timeline',
  'authority',
  'analysis'
] as const;

interface Job {
  id: number;
  case_id: string;
  user_id: string;
}

interface CaseData {
  case_description: string;
  state: string;
  county?: string;
}

// deno-lint-ignore no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

/**
 * Claim a job from the jobs table
 */
async function claimJob(client: AnySupabaseClient): Promise<Job | null> {
  const { data, error } = await client
    .from('jobs')
    .select('id, payload')
    .eq('status', 'queued')
    .eq('type', 'RUN_SWEEPS')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) {
    console.log('No queued jobs found');
    return null;
  }

  // Mark as running
  const { error: updateError } = await client
    .from('jobs')
    .update({ 
      status: 'running', 
      started_at: new Date().toISOString() 
    })
    .eq('id', data.id)
    .eq('status', 'queued');

  if (updateError) {
    console.log('Failed to claim job (possibly claimed by another worker)');
    return null;
  }

  const payload = data.payload as { case_id: string; user_id: string };
  
  return {
    id: data.id,
    case_id: payload.case_id,
    user_id: payload.user_id,
  };
}

/**
 * Mark job as completed or failed
 */
async function finishJob(
  client: AnySupabaseClient,
  jobId: number, 
  status: 'done' | 'error',
  errorMsg?: string
): Promise<void> {
  await client
    .from('jobs')
    .update({ 
      status, 
      error: errorMsg || null,
      completed_at: new Date().toISOString() 
    })
    .eq('id', jobId);
}

/**
 * Get case data from case_merit_scores
 */
async function getCaseData(
  client: AnySupabaseClient,
  caseId: string
): Promise<CaseData | null> {
  const { data, error } = await client
    .from('case_merit_scores')
    .select('case_description, state, county')
    .eq('id', caseId)
    .single();

  if (error || !data) {
    console.error('Failed to get case data:', error);
    return null;
  }

  return data as CaseData;
}

/**
 * Get sweep outputs from previous sweeps
 */
async function getSweepOutputs(
  client: AnySupabaseClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await client
    .from('case_sweeps')
    .select('sweep_name, output, status')
    .eq('case_id', caseId);

  if (error) {
    console.error('Failed to get sweep outputs:', error);
    return {};
  }

  const outputs: Record<string, unknown> = {};
  // deno-lint-ignore no-explicit-any
  (data || []).forEach((row: any) => {
    if (row.status === 'done' && row.output) {
      outputs[row.sweep_name] = row.output;
    }
  });
  return outputs;
}

/**
 * Call AI API with prompt
 */
async function callAI(prompt: string, systemPrompt: string = SWEEP_SYSTEM_PROMPT): Promise<unknown> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  
  // Clean up JSON if wrapped in markdown
  if (content.includes('```json')) {
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }
  if (content.includes('```')) {
    content = content.replace(/```\n?/g, '');
  }
  
  return JSON.parse(content.trim());
}

/**
 * Run a single sweep
 */
async function runSweep(
  client: AnySupabaseClient,
  caseId: string,
  userId: string,
  sweepName: string,
  caseData: CaseData,
  outputs: Record<string, unknown>
): Promise<unknown> {
  console.log(`Starting sweep: ${sweepName}`);
  
  await startSweep(caseId, sweepName, userId);

  try {
    let result: unknown;

    switch (sweepName) {
      case 'intake': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        const prompt = getIntakePrompt(caseData.case_description || '', []);
        result = await callAI(prompt);
        (result as Record<string, unknown>).normalizedAt = new Date().toISOString();
        break;
      }

      case 'evidenceIndex': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        // For now, return empty evidence index - would integrate with case_files
        result = {
          items: [],
          totalDocuments: 0,
          indexedAt: new Date().toISOString(),
        };
        break;
      }

      case 'classification': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        const intake = outputs['intake'];
        const intakeStr = intake ? JSON.stringify(intake) : 'No intake data';
        const prompt = getClassificationPrompt(intakeStr, 'No evidence text');
        result = await callAI(prompt);
        (result as Record<string, unknown>).classifiedAt = new Date().toISOString();
        break;
      }

      case 'venue': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        const intake = outputs['intake'];
        const classification = outputs['classification'];
        const intakeStr = intake ? JSON.stringify(intake) : 'No intake data';
        const classStr = classification ? JSON.stringify(classification) : 'No classification data';
        const prompt = getVenuePrompt(intakeStr, classStr, caseData.state || 'US', caseData.county);
        result = await callAI(prompt);
        (result as Record<string, unknown>).resolvedAt = new Date().toISOString();
        break;
      }

      case 'timeline': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        const intake = outputs['intake'];
        const evidenceIndex = outputs['evidenceIndex'];
        const intakeStr = intake ? JSON.stringify(intake) : 'No intake data';
        const evidenceStr = evidenceIndex ? JSON.stringify(evidenceIndex) : 'No evidence data';
        const prompt = getTimelinePrompt(intakeStr, evidenceStr);
        result = await callAI(prompt);
        (result as Record<string, unknown>).builtAt = new Date().toISOString();
        break;
      }

      case 'authority': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        const classification = outputs['classification'];
        const venue = outputs['venue'];
        const timeline = outputs['timeline'];
        const classStr = classification ? JSON.stringify(classification) : 'No classification';
        const venueStr = venue ? JSON.stringify(venue) : 'No venue';
        const timelineStr = timeline ? JSON.stringify(timeline) : 'No timeline';
        const prompt = getAuthorityPrompt(classStr, venueStr, timelineStr, caseData.state || 'US');
        result = await callAI(prompt);
        (result as Record<string, unknown>).sweptAt = new Date().toISOString();
        (result as Record<string, unknown>).source = 'live_search';
        break;
      }

      case 'analysis': {
        await updateSweepProgress(caseId, sweepName, userId, 30);
        // Build full case profile from outputs
        const caseProfile = {
          caseId,
          userStory: caseData.case_description,
          intake: outputs['intake'],
          evidenceIndex: outputs['evidenceIndex'],
          classification: outputs['classification'],
          venue: outputs['venue'],
          timeline: outputs['timeline'],
          authoritySweep: outputs['authority'],
        };
        const prompt = getAnalysisPrompt(JSON.stringify(caseProfile));
        // Plain-language summary only; no score, estimate, strategy or form list.
        result = pickPlainSummary(await callAI(prompt));
        
        await client
          .from('case_merit_scores')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseId);
        break;
      }

      default:
        throw new Error(`Unknown sweep: ${sweepName}`);
    }

    await updateSweepProgress(caseId, sweepName, userId, 80);
    await completeSweep(caseId, sweepName, userId, result as Record<string, unknown>);
    
    console.log(`Completed sweep: ${sweepName}`);
    return result;
  } catch (error) {
    console.error(`Sweep ${sweepName} failed:`, error);
    await failSweep(caseId, sweepName, userId, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Check if a sweep needs to be run
 */
async function shouldRunSweep(
  client: AnySupabaseClient,
  caseId: string,
  sweepName: string
): Promise<boolean> {
  const { data } = await client
    .from('case_sweeps')
    .select('status')
    .eq('case_id', caseId)
    .eq('sweep_name', sweepName)
    .single();

  // Run if no row exists, or if status is queued/error
  if (!data) return true;
  const status = (data as { status: string }).status;
  return status === 'queued' || status === 'error';
}

/**
 * Run all sweeps for a case sequentially
 */
async function runAllSweeps(
  client: AnySupabaseClient,
  caseId: string,
  userId: string
): Promise<void> {
  const caseData = await getCaseData(client, caseId);
  if (!caseData) {
    throw new Error(`Case not found: ${caseId}`);
  }

  const outputs: Record<string, unknown> = {};

  // Load existing outputs first
  const existingOutputs = await getSweepOutputs(client, caseId);
  Object.assign(outputs, existingOutputs);

  for (const sweepName of SWEEP_ORDER) {
    // Check if sweep needs to run
    const shouldRun = await shouldRunSweep(client, caseId, sweepName);
    
    if (!shouldRun) {
      console.log(`Sweep ${sweepName} already done, skipping`);
      continue;
    }

    try {
      const result = await runSweep(client, caseId, userId, sweepName, caseData, outputs);
      outputs[sweepName] = result;
    } catch (error) {
      console.error(`Sweep ${sweepName} failed, continuing with remaining sweeps:`, error);
      // Continue with other sweeps even if one fails
    }
  }
}

// Main worker handler
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Require authentication - sweep worker is triggered by authenticated users
    await requireUser(req);

    const client = getServiceClient();
    
    // Claim a job
    const job = await claimJob(client);
    
    if (!job) {
      return successResponse({ 
        message: 'No jobs to process',
        processed: 0 
      });
    }

    console.log(`Processing job ${job.id} for case ${job.case_id}`);

    try {
      // Run all sweeps
      await runAllSweeps(client, job.case_id, job.user_id);
      
      // Mark job as done
      await finishJob(client, job.id, 'done');
      
      console.log(`Job ${job.id} completed successfully`);
      
      return successResponse({ 
        message: 'Job completed',
        jobId: job.id,
        caseId: job.case_id,
        processed: 1 
      });
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      await finishJob(client, job.id, 'error', error instanceof Error ? error.message : 'Unknown error');
      
      return errorResponse(
        "INTERNAL_ERROR",
        `Job processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    console.error("Worker error:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : 'Worker error'
    );
  }
});
