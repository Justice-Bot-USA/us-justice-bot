import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseType, state, description, damages, factors } = await req.json();

    if (!caseType || !state || !description) {
      throw new Error('Case type, state, and description are required');
    }

    console.log('Calculating settlement estimate:', { caseType, state });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert legal settlement analyst with deep knowledge of US case law, jury verdicts, and settlement trends across all states. You analyze case details to provide realistic settlement range estimates based on:

1. Historical jury verdicts and settlements in similar cases
2. State-specific case law and damage caps
3. The strength of evidence and liability factors
4. Economic and non-economic damages
5. Comparative fault considerations
6. Insurance policy limits and defendant's ability to pay

IMPORTANT: Always emphasize that these are estimates for educational purposes only. Actual settlements vary greatly based on specific case facts, evidence quality, and negotiation skills.`;

    const userPrompt = `Analyze this case and provide a settlement estimate:

CASE TYPE: ${caseType}
STATE: ${state}
DESCRIPTION: ${description}
CLAIMED DAMAGES: ${damages || 'Not specified'}
ADDITIONAL FACTORS: ${factors || 'None provided'}

Provide your analysis in the following JSON format:
{
  "settlementRange": {
    "low": number,
    "mid": number,
    "high": number,
    "currency": "USD"
  },
  "confidenceLevel": "high/medium/low",
  "methodology": "Explanation of how the estimate was calculated",
  "comparableCases": [
    {
      "caseDescription": "Brief description",
      "outcome": "Settlement or verdict amount",
      "year": number,
      "state": "State",
      "relevance": "Why this case is comparable"
    }
  ],
  "damageBreakdown": {
    "economicDamages": {
      "amount": number,
      "components": ["List of economic damage types"]
    },
    "nonEconomicDamages": {
      "amount": number,
      "components": ["List of non-economic damage types"]
    },
    "punitiveDamages": {
      "likelihood": "high/medium/low/none",
      "potentialAmount": number,
      "basis": "Why punitive damages may apply"
    }
  },
  "strengthFactors": ["Factors that increase settlement value"],
  "weaknessFactors": ["Factors that decrease settlement value"],
  "negotiationTips": ["Tips for maximizing settlement"],
  "timelineEstimate": "Expected time to settlement",
  "stateSpecificNotes": "Important ${state}-specific laws, caps, or considerations",
  "disclaimer": "Standard disclaimer about estimates being for educational purposes only"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;

    // Parse AI response
    let analysis;
    try {
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = {
        settlementRange: { low: 0, mid: 0, high: 0, currency: 'USD' },
        methodology: aiContent,
        disclaimer: "This is an educational estimate only. Consult with a qualified attorney for case-specific advice."
      };
    }

    console.log('Settlement calculation completed successfully');

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating settlement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
