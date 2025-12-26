import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, state, legalSection, language, context } = await req.json()

    // Input validation
    if (!message || typeof message !== 'string' || message.length > 2000) {
      throw new Error('Invalid message')
    }
    if (!state || typeof state !== 'string' || state.length > 50) {
      throw new Error('Invalid state')
    }
    if (!legalSection || typeof legalSection !== 'string' || legalSection.length > 100) {
      throw new Error('Invalid legal section')
    }
    if (!['en', 'es'].includes(language)) {
      throw new Error('Invalid language')
    }

    // Sanitize inputs
    const sanitizedMessage = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<[^>]*>/g, '').trim()
    const sanitizedState = state.replace(/[^a-zA-Z\s]/g, '').trim()
    const sanitizedLegalSection = legalSection.replace(/[^a-zA-Z\s]/g, '').trim()

    const prompt = `You are US Justice Bot, an expert AI legal assistant with comprehensive knowledge of US federal law and all 50 state legal systems.

STATE: ${sanitizedState}
LEGAL AREA: ${sanitizedLegalSection}
LANGUAGE: ${language === 'es' ? 'Spanish' : 'English'}

YOUR EXPERTISE INCLUDES:
- Federal law (US Constitution, federal statutes, federal court procedures)
- State-specific statutes, codes, and regulations for ${sanitizedState}
- State court systems, filing procedures, and deadlines
- Criminal law: state penal codes, sentencing guidelines, bail schedules, expungement eligibility
- Civil law: family law, housing/eviction, employment, small claims, personal injury
- Correct court forms and filing fees for ${sanitizedState}
- Statute of limitations for ${sanitizedState}
- Local court rules and procedures

RESPONSE REQUIREMENTS:
1. Be specific to ${sanitizedState} law - cite actual statutes when relevant (e.g., "Under California Penal Code 1203.4..." or "Texas Family Code Section...")
2. Provide actionable steps with specific forms, courts, and procedures
3. Include relevant deadlines and filing fees when applicable
4. Mention if federal law applies vs state law
5. Always end with: "This is educational information, not legal advice. Consult a licensed ${sanitizedState} attorney for your specific situation."

User's question: ${sanitizedMessage}

Previous context: ${context?.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'None'}

Provide a detailed, ${sanitizedState}-specific response:`

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured')
    }

    console.log('Calling Lovable AI for legal assistance...')

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: sanitizedMessage
          }
        ],
      }),
    })

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const errorText = await response.text()
      console.error('AI gateway error:', response.status, errorText)
      throw new Error('AI gateway error')
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    console.log('Legal assistance response generated successfully')

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
