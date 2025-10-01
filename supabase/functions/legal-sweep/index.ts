import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reputable legal websites to sweep
const LEGAL_SOURCES = [
  'https://www.law.cornell.edu',
  'https://www.justia.com',
  'https://www.findlaw.com',
  'https://www.nolo.com',
  'https://supreme.justia.com'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { sweepId, searchTerms, state, legalArea } = await req.json();
    
    console.log('Starting legal sweep:', { sweepId, searchTerms, state, legalArea });

    // Update sweep status to running
    await supabaseClient
      .from('legal_sweeps')
      .update({ 
        status: 'running',
        last_run: new Date().toISOString()
      })
      .eq('id', sweepId);

    const results = [];
    let totalResults = 0;

    // Simulate sweeping legal sites for relevant laws
    // In production, this would use actual web scraping or legal APIs
    for (const source of LEGAL_SOURCES) {
      for (const term of searchTerms) {
        // Simulate finding relevant legal documents
        const mockResults = [
          {
            source_url: `${source}/statute/${state}/${term}`,
            title: `${state} ${legalArea} - ${term}`,
            content: `This is a ${state} statute regarding ${term} in the area of ${legalArea}. The statute provides guidelines and requirements for...`,
            law_type: 'statute',
            jurisdiction: state,
            relevance_score: Math.random() * 100,
            keywords: [term, state, legalArea],
            extracted_data: {
              effective_date: '2023-01-01',
              last_amended: '2024-01-15',
              statutory_citation: `${state} Rev. Stat. § ${Math.floor(Math.random() * 1000)}`
            }
          },
          {
            source_url: `${source}/forms/${state}/${legalArea}`,
            title: `Standard ${legalArea} Form - ${state}`,
            content: `Official legal form for ${legalArea} matters in ${state}. This form must be completed and filed with...`,
            law_type: 'form',
            jurisdiction: state,
            relevance_score: Math.random() * 100,
            keywords: [term, state, 'form', legalArea],
            extracted_data: {
              form_number: `${state}-${Math.floor(Math.random() * 100)}`,
              required_signatures: ['Petitioner', 'Notary'],
              filing_fee: Math.floor(Math.random() * 500) + 50
            }
          }
        ];

        for (const result of mockResults) {
          // Insert result into database
          const { data, error } = await supabaseClient
            .from('legal_sweep_results')
            .insert({
              sweep_id: sweepId,
              ...result
            })
            .select()
            .single();

          if (!error) {
            results.push(data);
            totalResults++;
          }
        }
      }
    }

    // Update sweep with results
    await supabaseClient
      .from('legal_sweeps')
      .update({ 
        status: 'completed',
        results_count: totalResults,
        last_run: new Date().toISOString()
      })
      .eq('id', sweepId);

    console.log('Legal sweep completed:', { totalResults });

    return new Response(
      JSON.stringify({
        success: true,
        resultsCount: totalResults,
        results: results.slice(0, 10) // Return first 10 results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in legal sweep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});