import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, handleCors, requireUser } from "../_shared/auth.ts";
import { successResponse, errorResponse } from "../_shared/errors.ts";
import { createAdminClient } from "../_shared/db.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Optional authentication - allow guest analysis but don't save to DB
    let userId: string | null = null;
    let userEmail: string | null = null;
    let userClient: any = null;
    
    try {
      const authResult = await requireUser(req);
      userId = authResult.userId;
      userEmail = authResult.email || null;
      userClient = authResult.userClient;
    } catch (authError) {
      console.log('Running as guest (unauthenticated) - results will not be saved');
    }
    
    // Use admin client to bypass RLS for inserting case records
    const supabaseClient = createAdminClient();

    const { caseData, uploadedFiles } = await req.json();
    
    console.log('Summarizing case:', { state: caseData?.state, legalArea: caseData?.legalArea, files: uploadedFiles?.length || 0 });

    // Fetch the names and descriptions of the user's uploads
    let documentContents = '';
    if (userId && userClient && uploadedFiles && uploadedFiles.length > 0) {
      console.log('Fetching uploaded documents for analysis...');
      for (const file of uploadedFiles) {
        try {
          // Use the user client so RLS enforces ownership
          const { data, error } = await userClient
            .from('case_files')
            .select('file_name, file_type, description')
            .eq('id', file.id)
            .single();
          
          if (!error && data) {
            documentContents += `\n\nDocument: ${data.file_name} (${data.file_type})`;
            if (data.description) {
              documentContents += `\nDescription: ${data.description}`;
            }
          }
        } catch (err) {
          console.error('Error fetching document:', err);
        }
      }
    }

    // Plain-language summary only. Founder decision (Oct 2026): no merit score,
    // success rate, dollar or time estimate, legal strategy or defenses, and no
    // choosing or ordering of court forms for the user. Choosing forms and
    // strategy is off-limits even for a registered CA legal document assistant
    // (Bus. & Prof. Code 6400(g), 6411(e)) and falls under NY Judiciary Law
    // 495(1)(e); invented scores and estimates are also untrue claims.
    const aiPrompt = `Write a neutral, plain-language summary of what this person told us about their legal situation.

WHAT THE PERSON TOLD US:
Title: ${caseData.title}
Description: ${caseData.description}
State: ${caseData.state}
County: ${caseData.county || 'Not specified'}
Area they picked: ${caseData.legalArea}

DOCUMENTS THEY UPLOADED (names and their own descriptions only):
${documentContents || 'None'}

WHAT TO WRITE:
1. "summary": restate, in 2-4 short sentences and in the second person ("You said..."), only the facts the person gave. Do not add facts, judge them, or say what they mean for the person.
2. "legalCategory": the general area of law this falls under (for example "Housing / eviction", "Family law", "Small claims", "Employment", "Criminal"). A short label, not an offense or claim.
3. "generalInfo": 3-6 short points of general information about how matters in this area usually work in ${caseData.state}, the way a court self-help center describes it to anyone. Same information for everyone with this kind of matter; do not tailor it to these facts. Include that free legal aid may be available and that the person can talk to a lawyer.
4. "officialSources": up to 5 official sources for ${caseData.state} on this area (state court self-help pages, the state legislature's code site, state agencies, or recognized free legal aid organizations). Only include a URL you are confident is correct; otherwise leave the item out.

YOU MUST NOT:
- Give any score, rating, grade, percentage, probability, chance of success, likely outcome, or say whether the person has a good or strong case.
- Estimate any amount of money (settlement, damages, award, fees, costs, bail, fines) or how long anything will take.
- Suggest a strategy, argument, claim, defense, motion, plea, or what the person should say or do in their case.
- Choose, recommend, list as required, or put in order any court forms for this person.
- Apply case law or statutes to these facts.

Return only valid JSON with exactly this structure:
{
  "summary": "string",
  "legalCategory": "string",
  "generalInfo": ["string"],
  "officialSources": [{"name": "string", "url": "https://..."}]
}`;

    console.log('Calling Lovable AI for plain-language case summary...');
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',  // Use faster model for quicker responses
        messages: [
          {
            role: 'system',
            content: `You write neutral legal information in plain language for people in the United States who are handling a legal matter on their own. You are not a lawyer and you do not give legal advice. You summarize what the person said, name the general area of law, and give the same general information a court self-help center gives everyone. You never give scores, probabilities, likely outcomes, money or time estimates, strategy or defenses, and you never choose or order court forms for anyone. Respond with valid JSON only.`
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Content:', aiContent);
      throw new Error('Failed to parse AI analysis response');
    }

    // Keep only the fields we allow. Anything else the model returns (a score,
    // an estimate, a strategy, a form list) is dropped here, never stored or sent.
    const summary = typeof analysis.summary === 'string' ? analysis.summary.trim() : '';
    const legalCategory = typeof analysis.legalCategory === 'string' && analysis.legalCategory.trim()
      ? analysis.legalCategory.trim()
      : caseData.legalArea || null;
    const generalInfo: string[] = Array.isArray(analysis.generalInfo)
      ? analysis.generalInfo.filter((item: unknown): item is string => typeof item === 'string' && item.trim() !== '')
      : [];
    const officialSources: { name: string; url: string }[] = Array.isArray(analysis.officialSources)
      ? analysis.officialSources
          .filter((src: { name?: unknown; url?: unknown } | null): src is { name: string; url: string } =>
            !!src && typeof src.name === 'string' && typeof src.url === 'string' && /^https?:\/\//.test(src.url))
          .map((src: { name: string; url: string }) => ({ name: src.name, url: src.url }))
      : [];

    // Only save to database if user is authenticated
    let caseRecord = null;
    
    if (userId) {
      // Save what the user told us and their own uploads. No score, estimate,
      // strategy or form list is written (merit_score keeps its DB default).
      const { data: savedCase, error: insertError } = await supabaseClient
        .from('case_merit_scores')
        .insert({
          user_id: userId,
          session_id: caseData.sessionId,
          case_title: caseData.title,
          case_description: caseData.description,
          state: caseData.state,
          county: caseData.county,
          legal_area: legalCategory,
          supporting_evidence: uploadedFiles || [],
          status: 'analyzed'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting case record:', insertError);
        // Don't throw - return the summary without a saved case
      } else {
        caseRecord = savedCase;
      }
    } else {
      console.log('Guest user - summary not saved to database');
    }

    // Link any uploaded files to this case for better organization
    if (caseRecord && uploadedFiles && uploadedFiles.length > 0) {
      const fileIds = uploadedFiles.map((f: any) => f.id).filter(Boolean);
      if (fileIds.length > 0) {
        const { error: linkError } = await supabaseClient
          .from('case_files')
          .update({ case_id: caseRecord.id })
          .in('id', fileIds)
          .eq('user_id', userId)
          // Never move a file that already belongs to another case.
          .is('case_id', null);
        
        if (linkError) {
          console.error('Error linking files to case:', linkError);
          // Don't throw - case was created successfully, file linking is secondary
        } else {
          console.log(`Linked ${fileIds.length} files to case ${caseRecord.id}`);
        }
      }
    }

    console.log('Case summary completed successfully', userId ? '(authenticated)' : '(guest)');

    return successResponse({
      success: true,
      summary,
      legalCategory,
      generalInfo,
      officialSources,
      isGuest: !userId,
      caseId: caseRecord?.id || null
    });

  } catch (error) {
    console.error("Error summarizing case:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return errorResponse("INTERNAL_ERROR", errorMessage);
  }
});