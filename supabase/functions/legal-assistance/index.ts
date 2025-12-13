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

    const prompt = `You are a US Justice Bot, an AI legal assistant providing educational information about ${sanitizedLegalSection} law in ${sanitizedState}.

Please respond in ${language === 'es' ? 'Spanish' : 'English'}.

IMPORTANT DISCLAIMERS TO ALWAYS INCLUDE:
- This is educational information only, not legal advice
- Always recommend consulting with a qualified attorney
- Laws vary by jurisdiction and change over time

User's question: ${sanitizedMessage}

Context from previous messages: ${context?.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'None'}

Please provide a helpful, informative response about ${sanitizedLegalSection} law in ${sanitizedState}, but always emphasize that this is general information and not legal advice. Be specific about ${sanitizedState} law when possible.`

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
