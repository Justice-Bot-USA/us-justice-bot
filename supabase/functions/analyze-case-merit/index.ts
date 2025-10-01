import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { caseData, uploadedFiles } = await req.json();
    
    console.log('Analyzing case merit:', { caseData, uploadedFiles });

    // Analyze case factors
    const strengthFactors = [];
    const weaknessFactors = [];
    const relevantLaws = [];

    // Analyze based on case description
    if (caseData.description) {
      const description = caseData.description.toLowerCase();
      
      // Analyze strengths
      if (description.includes('documented') || description.includes('evidence')) {
        strengthFactors.push({
          factor: 'Strong Documentation',
          weight: 0.8,
          description: 'Case has documented evidence'
        });
      }
      
      if (description.includes('witness') || description.includes('witnesses')) {
        strengthFactors.push({
          factor: 'Witness Testimony Available',
          weight: 0.7,
          description: 'Multiple witnesses can corroborate claims'
        });
      }

      // Analyze weaknesses
      if (description.includes('no evidence') || description.includes('no proof')) {
        weaknessFactors.push({
          factor: 'Lack of Evidence',
          weight: 0.9,
          description: 'Limited physical evidence'
        });
      }
      
      if (description.includes('verbal agreement') || description.includes('no contract')) {
        weaknessFactors.push({
          factor: 'Verbal Agreement',
          weight: 0.6,
          description: 'No written contract'
        });
      }
    }

    // Add points for uploaded evidence
    if (uploadedFiles && uploadedFiles.length > 0) {
      strengthFactors.push({
        factor: 'Physical Evidence Uploaded',
        weight: 0.85,
        description: `${uploadedFiles.length} evidence file(s) uploaded`
      });
    }

    // Get state and county specific laws (simplified for now)
    relevantLaws.push({
      title: `${caseData.state} ${caseData.legalArea} Statute`,
      citation: `${caseData.state} Rev. Stat. § XXX`,
      relevance: 0.9,
      summary: `Key statute governing ${caseData.legalArea} in ${caseData.state}`
    });

    if (caseData.county) {
      relevantLaws.push({
        title: `${caseData.county} County Local Ordinance`,
        citation: `${caseData.county} County Code § XXX`,
        relevance: 0.7,
        summary: `Local regulations for ${caseData.county} County`
      });
    }

    // Calculate merit score
    let meritScore = 50.0; // Base score
    
    strengthFactors.forEach(factor => {
      meritScore += factor.weight * 10;
    });
    
    weaknessFactors.forEach(factor => {
      meritScore -= factor.weight * 8;
    });

    // Adjust based on evidence count
    if (uploadedFiles) {
      meritScore += Math.min(uploadedFiles.length * 3, 20);
    }

    // Ensure score is between 0 and 100
    meritScore = Math.max(0, Math.min(100, meritScore));

    // Calculate success rate and settlement range
    const estimatedSuccessRate = meritScore * 0.8;
    const baseSettlement = 10000;
    const settlementRangeMin = baseSettlement * (meritScore / 100);
    const settlementRangeMax = baseSettlement * (meritScore / 100) * 3;

    // Estimate time to resolution based on complexity
    const complexityScore = weaknessFactors.length + strengthFactors.length;
    const timeToResolutionMonths = Math.min(
      6 + (complexityScore * 2),
      36
    );

    // Create case merit score record
    const { data: caseRecord, error: insertError } = await supabaseClient
      .from('case_merit_scores')
      .insert({
        user_id: caseData.userId,
        session_id: caseData.sessionId,
        case_title: caseData.title,
        case_description: caseData.description,
        state: caseData.state,
        county: caseData.county,
        legal_area: caseData.legalArea,
        merit_score: meritScore,
        strength_factors: strengthFactors,
        weakness_factors: weaknessFactors,
        relevant_laws: relevantLaws,
        supporting_evidence: uploadedFiles || [],
        estimated_success_rate: estimatedSuccessRate,
        settlement_range_min: settlementRangeMin,
        settlement_range_max: settlementRangeMax,
        time_to_resolution_months: timeToResolutionMonths,
        complexity_score: complexityScore,
        status: 'analyzed'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting case merit score:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        meritScore: meritScore.toFixed(2),
        analysis: {
          strengthFactors,
          weaknessFactors,
          relevantLaws,
          estimatedSuccessRate: estimatedSuccessRate.toFixed(2),
          settlementRange: {
            min: settlementRangeMin.toFixed(2),
            max: settlementRangeMax.toFixed(2)
          },
          timeToResolutionMonths,
          complexityScore
        },
        caseId: caseRecord.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing case merit:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});