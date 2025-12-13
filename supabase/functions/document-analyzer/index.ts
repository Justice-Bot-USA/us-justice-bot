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
    const { documentText, documentType, analysisType } = await req.json();

    if (!documentText || typeof documentText !== 'string') {
      throw new Error('Document text is required');
    }

    console.log('Analyzing document with AI:', { documentType, analysisType, textLength: documentText.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert legal document analyzer. Your job is to analyze legal documents and provide clear, actionable insights.

For each document, you should:
1. Identify the type of document (contract, agreement, letter, etc.)
2. Extract key terms, dates, and obligations
3. Identify potential risks or red flags
4. Provide a plain English summary
5. List any action items or deadlines

IMPORTANT: Always emphasize that this is educational analysis only, not legal advice. Recommend consulting with a qualified attorney for specific legal matters.`;

    const userPrompt = `Please analyze the following ${documentType || 'legal'} document:

---
${documentText.slice(0, 15000)}
---

Provide your analysis in the following JSON format:
{
  "documentType": "Identified document type",
  "summary": "Plain English summary of the document (2-3 paragraphs)",
  "keyTerms": [
    {"term": "Term name", "definition": "What it means", "importance": "high/medium/low"}
  ],
  "parties": ["List of parties involved"],
  "keyDates": [
    {"date": "Date or timeframe", "significance": "What happens on this date"}
  ],
  "obligations": [
    {"party": "Who", "obligation": "Must do what", "deadline": "By when"}
  ],
  "risks": [
    {"risk": "Description of risk", "severity": "high/medium/low", "mitigation": "How to address"}
  ],
  "actionItems": [
    {"action": "What needs to be done", "priority": "high/medium/low", "deadline": "When"}
  ],
  "recommendations": ["List of recommendations for the reader"],
  "legalDisclaimer": "Standard disclaimer about this being educational analysis only"
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
      // Return the raw response if parsing fails
      analysis = {
        summary: aiContent,
        keyTerms: [],
        risks: [],
        actionItems: [],
        legalDisclaimer: "This is educational analysis only, not legal advice. Please consult with a qualified attorney."
      };
    }

    console.log('Document analysis completed successfully');

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
