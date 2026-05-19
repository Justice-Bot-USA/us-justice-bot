import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse, handleError } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";
import { SWEEP_SYSTEM_PROMPT, getEvidenceIndexPrompt } from "../_shared/sweepPrompts.ts";
import { startSweep, completeSweep, failSweep, updateSweepProgress } from "../_shared/sweepDb.ts";

const SWEEP_NAME = 'evidenceIndex';

// Sweep 1: Evidence Indexing
Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { userId } = await requireUser(req);

    const { fileIds, caseId } = await req.json();
    
    console.log("Running Sweep 1: Evidence Indexing", { fileIds });

    // Mark sweep as running
    if (caseId && userId) {
      await startSweep(caseId, SWEEP_NAME, userId);
    }

    // If no files, return empty index
    if (!fileIds || fileIds.length === 0) {
      const emptyResult = {
        items: [],
        totalDocuments: 0,
        strongestEvidence: [],
        gapsIdentified: ['No documents uploaded - consider adding supporting evidence'],
        indexedAt: new Date().toISOString()
      };

      if (caseId && userId) {
        await completeSweep(caseId, SWEEP_NAME, userId, emptyResult);
      }

      return successResponse({
        sweep: 'evidenceIndex',
        data: emptyResult
      });
    }

    const supabase = createAdminClient();
    
    // Fetch file metadata
    const { data: files, error: filesError } = await supabase
      .from('case_files')
      .select('id, file_name, file_type, description')
      .in('id', fileIds);

    if (filesError) {
      console.error('Error fetching files:', filesError);
      if (caseId && userId) {
        await failSweep(caseId, SWEEP_NAME, userId, filesError.message);
      }
      throw filesError;
    }

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 30);
    }

    const documents = (files || []).map(f => ({
      id: f.id,
      filename: f.file_name,
      fileType: f.file_type,
      text: f.description || '' // Use description as text for now
    }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = getEvidenceIndexPrompt(documents);

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 50);
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SWEEP_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 6000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      if (caseId && userId) {
        await failSweep(caseId, SWEEP_NAME, userId, `AI API error: ${aiResponse.status}`);
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    if (caseId && userId) {
      await updateSweepProgress(caseId, SWEEP_NAME, userId, 80);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || '';
    
    // Clean up JSON
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (content.includes('```')) {
      content = content.replace(/```\n?/g, '');
    }
    
    const evidenceIndex = JSON.parse(content.trim());
    evidenceIndex.indexedAt = new Date().toISOString();
    
    console.log("Sweep 1 complete:", { totalDocuments: evidenceIndex.totalDocuments });

    // Mark sweep as done
    if (caseId && userId) {
      await completeSweep(caseId, SWEEP_NAME, userId, evidenceIndex);
    }

    return successResponse({
      sweep: 'evidenceIndex',
      data: evidenceIndex
    });
  } catch (error) {
    console.error("Sweep 1 error:", error);
    return handleError(error);
  }
});
