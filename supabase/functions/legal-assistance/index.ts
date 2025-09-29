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

    const prompt = `You are a US Justice Bot, an AI legal assistant providing educational information about ${legalSection} law in ${state}. 

Please respond in ${language === 'es' ? 'Spanish' : 'English'}.

IMPORTANT DISCLAIMERS TO ALWAYS INCLUDE:
- This is educational information only, not legal advice
- Always recommend consulting with a qualified attorney
- Laws vary by jurisdiction and change over time

User's question: ${message}

Context from previous messages: ${context?.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'None'}

Please provide a helpful, informative response about ${legalSection} law in ${state}, but always emphasize that this is general information and not legal advice. Be specific about ${state} law when possible.`

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
            content: message
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