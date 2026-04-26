import { FormEvent, useMemo, useState } from 'react'
import { BookOpen, Gamepad2, HelpCircle, Loader2, MessageCircle, Send, Sparkles } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'
import nopalitoCelebrating from '@/assets/pixel/optimized/plantamigo-nopalito-celebrating.webp'

interface NopalitoGuideProps {
  totalMastery: number
  onOpenCourses: () => void
  onOpenGames: () => void
  onOpenFlashcards: () => void
}

interface GuideAction {
  id: string
  label: string
  icon: typeof HelpCircle
  reply: string
  cta: string
  onClick: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function NopalitoGuide({
  totalMastery,
  onOpenCourses,
  onOpenGames,
  onOpenFlashcards,
}: NopalitoGuideProps) {
  const [activeId, setActiveId] = useState('next')
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hola, viajero. Preguntame de finanzas, del jardin o del siguiente paso. Yo cuido el camino contigo.',
    },
  ])
  const [isAsking, setIsAsking] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  const masteryLabel = totalMastery >= 70 ? 'fuerte' : totalMastery >= 35 ? 'despertando' : 'recien brotando'

  const actions = useMemo<GuideAction[]>(
    () => [
      {
        id: 'next',
        label: 'Que hago ahora',
        icon: MessageCircle,
        reply:
          'Primero vamos al invernadero. Completa una semilla, toma decisiones y trae energia al jardin. Cada escenario te deja una pista para tu vida real.',
        cta: 'Ir a cursos',
        onClick: onOpenCourses,
      },
      {
        id: 'boss',
        label: 'Derrotar al Gasto Hormiga',
        icon: Sparkles,
        reply:
          'El Gasto Hormiga vive de fugas pequenas: compras impulsivas, suscripciones olvidadas y antojos repetidos. Cursos, repasos y rachas le bajan poder.',
        cta: 'Practicar',
        onClick: onOpenFlashcards,
      },
      {
        id: 'games',
        label: 'Entrenar plantamigos',
        icon: Gamepad2,
        reply:
          'Los juegos son entrenamiento corto. Sirven para subir confianza antes de volver al camino principal y enfrentar enemigos mas fuertes.',
        cta: 'Abrir juegos',
        onClick: onOpenGames,
      },
      {
        id: 'score',
        label: 'Leer mi progreso',
        icon: BookOpen,
        reply: `Tu dominio esta ${masteryLabel}. No mide perfeccion: mide cuantas decisiones ya practicaste y que tan listo esta tu jardin para la siguiente ruta.`,
        cta: 'Repasar',
        onClick: onOpenFlashcards,
      },
    ],
    [masteryLabel, onOpenCourses, onOpenFlashcards, onOpenGames],
  )

  const active = actions.find((action) => action.id === activeId) ?? actions[0]

  const askNopalito = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = question.trim()
    if (message.length < 2 || isAsking) return

    const nextHistory: ChatMessage[] = [...history, { role: 'user', content: message }]
    setHistory(nextHistory)
    setQuestion('')
    setIsAsking(true)
    setChatError(null)

    const { data, error } = await supabase.functions.invoke('nopalito-chat', {
      body: {
        message,
        history: history.slice(-6),
        context: {
          totalMastery,
          currentArea: 'jardin',
        },
      },
    })

    setIsAsking(false)

    if (error || !data?.reply) {
      setChatError('Nopalito no pudo responder ahora. Puedes usar las pistas rapidas mientras vuelve la senal.')
      setHistory([
        ...nextHistory,
        {
          role: 'assistant',
          content:
            'Se me movieron las hojitas de la senal. Mientras vuelvo, completa una semilla o repasa tarjetas para bajar el poder del Gasto Hormiga.',
        },
      ])
      return
    }

    setHistory([...nextHistory, { role: 'assistant', content: String(data.reply) }])
  }

  return (
    <section
      className="overflow-hidden rounded-lg border"
      style={{
        borderColor: 'color-mix(in srgb, var(--leaf-bright) 34%, var(--clay-soft))',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(239,232,214,0.86)), radial-gradient(circle at 12% 24%, rgba(245,194,66,0.22), transparent 34%)',
        boxShadow: '0 18px 46px rgba(43,79,53,0.14)',
      }}
      aria-label="Guia de Nopalito"
    >
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex items-center gap-4 border-b p-4 lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--clay-soft)' }}>
          <div className="relative h-24 w-24 shrink-0">
            <img
              src={active.id === 'boss' ? nopalitoCelebrating : nopalitoIdle}
              alt="Nopalito"
              className="h-full w-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <span
              className="absolute -right-1 bottom-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase"
              style={{
                borderColor: 'var(--gold-primary)',
                background: 'rgba(255,248,216,0.95)',
                color: 'var(--forest-deep)',
              }}
            >
              Guia
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
              Nopalito esta contigo
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold" style={{ color: 'var(--forest-deep)' }}>
              El mundo ya empezo. Escoge una pista.
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--leaf-muted)' }}>
              Por ahora soy guia del jardin. Despues puedo convertirme en asistente financiero con memoria del progreso y reglas de seguridad.
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon
              const selected = active.id === action.id
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setActiveId(action.id)}
                  className="flex min-h-[48px] items-center gap-2 rounded-md border px-3 text-left text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: selected ? 'var(--leaf-bright)' : 'var(--clay-soft)',
                    background: selected ? 'rgba(112, 181, 91, 0.16)' : 'rgba(255,255,255,0.62)',
                    color: 'var(--forest-deep)',
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>

          <div
            className="mt-4 rounded-lg border p-4"
            style={{
              borderColor: 'var(--clay-soft)',
              background: 'rgba(255,255,255,0.68)',
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
              Nopalito responde
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--forest-deep)' }}>
              {active.reply}
            </p>
            <button type="button" onClick={active.onClick} className="vibrant-btn mt-4">
              {active.cta}
            </button>
          </div>

          <div
            className="mt-4 rounded-lg border p-4"
            style={{
              borderColor: 'var(--clay-soft)',
              background: 'rgba(255,255,255,0.72)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                Preguntale a Nopalito
              </p>
              {isAsking && <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--leaf-muted)' }} />}
            </div>

            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
              {history.slice(-5).map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                  className="rounded-md px-3 py-2 text-sm leading-relaxed"
                  style={{
                    marginLeft: message.role === 'user' ? '2rem' : 0,
                    marginRight: message.role === 'assistant' ? '2rem' : 0,
                    background: message.role === 'user' ? 'rgba(112,181,91,0.14)' : 'rgba(245,194,66,0.14)',
                    color: 'var(--forest-deep)',
                  }}
                >
                  {message.content}
                </div>
              ))}
            </div>

            {chatError && (
              <p className="mt-2 text-xs" style={{ color: 'var(--terra)' }}>
                {chatError}
              </p>
            )}

            <form onSubmit={askNopalito} className="mt-3 flex gap-2">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={300}
                placeholder="Ej. Como empiezo a ahorrar?"
                className="min-h-[44px] flex-1 rounded-md border bg-white/80 px-3 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--clay-soft)',
                  color: 'var(--forest-deep)',
                }}
              />
              <button
                type="submit"
                disabled={isAsking || question.trim().length < 2}
                className="flex min-h-[44px] w-12 items-center justify-center rounded-md border transition-opacity disabled:opacity-50"
                style={{
                  borderColor: 'var(--leaf-bright)',
                  background: 'var(--leaf-bright)',
                  color: 'white',
                }}
                aria-label="Enviar pregunta a Nopalito"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
