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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

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