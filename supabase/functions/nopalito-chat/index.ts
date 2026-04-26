const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface NopalitoRequest {
  message?: string
  history?: ChatMessage[]
  context?: {
    totalMastery?: number
    coins?: number
    streakDays?: number
    currentArea?: string
  }
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const PRIMARY_MODEL = Deno.env.get('NOPALITO_MODEL') ?? 'openai/gpt-oss-120b:free'
const FALLBACK_MODEL = Deno.env.get('NOPALITO_FALLBACK_MODEL') ?? 'nvidia/nemotron-3-nano-30b-a3b:free'

const SYSTEM_PROMPT = `Eres Nopalito, el guia del jardin de Cultiva Finanzas.
Hablas en espanol mexicano, de forma calida, breve y practica.
Tu funcion es ayudar a estudiantes a aprender finanzas personales y moverse dentro de la app.
Usa la metafora del jardin solo cuando ayude: semillas, rutas, plantamigos, Gasto Hormiga.
No eres asesor financiero, fiscal, legal ni de inversiones.
No recomiendes acciones, cripto, brokers, prestamos o productos financieros especificos.
No pidas datos sensibles como contrasenas, claves privadas, numeros completos de cuenta o documentos oficiales.
Si el usuario pide una decision financiera personalizada, explica criterios generales y sugiere consultar a un profesional calificado.
Responde en maximo 120 palabras, con un siguiente paso concreto cuando sea posible.`

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function buildContext(context: NopalitoRequest['context']) {
  if (!context) return 'Sin contexto de progreso disponible.'

  return [
    `Dominio total: ${Math.round(context.totalMastery ?? 0)}%`,
    `Monedas: ${Math.round(context.coins ?? 0)}`,
    `Racha: ${Math.round(context.streakDays ?? 0)} dias`,
    `Area actual: ${cleanText(context.currentArea, 40) || 'jardin'}`,
  ].join('\n')
}

async function callOpenRouter(model: string, apiKey: string, request: NopalitoRequest, userMessage: string) {
  const history = Array.isArray(request.history)
    ? request.history
        .slice(-6)
        .map((message) => ({
          role: message.role,
          content: cleanText(message.content, 600),
        }))
        .filter((message) => message.content.length > 0)
    : []

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cultiva-finanzas.app',
      'X-Title': 'Cultiva Finanzas - Nopalito',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Contexto del estudiante:\n${buildContext(request.context)}`,
        },
        ...history,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.55,
      max_tokens: 260,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter ${response.status}: ${errorText.slice(0, 240)}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('OpenRouter returned an empty response')
  }

  return content.trim()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const primaryApiKey = Deno.env.get('OPENROUTER_API_KEY')
  const fallbackApiKey = Deno.env.get('OPENROUTER_API_KEY2') ?? primaryApiKey
  if (!primaryApiKey) {
    return jsonResponse({ error: 'Missing OPENROUTER_API_KEY secret' }, 500)
  }

  let request: NopalitoRequest
  try {
    request = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const userMessage = cleanText(request.message, 900)
  if (userMessage.length < 2) {
    return jsonResponse({ error: 'Message is required' }, 400)
  }

  try {
    const reply = await callOpenRouter(PRIMARY_MODEL, primaryApiKey, request, userMessage)
    return jsonResponse({ reply, model: PRIMARY_MODEL })
  } catch (primaryError) {
    try {
      const reply = await callOpenRouter(FALLBACK_MODEL, fallbackApiKey, request, userMessage)
      return jsonResponse({ reply, model: FALLBACK_MODEL })
    } catch (fallbackError) {
      console.error('Nopalito chat failed', {
        primary: primaryError instanceof Error ? primaryError.message : String(primaryError),
        fallback: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
      })
      return jsonResponse(
        {
          error: 'Nopalito no pudo responder ahora. Intenta otra vez en un momento.',
        },
        502,
      )
    }
  }
})
