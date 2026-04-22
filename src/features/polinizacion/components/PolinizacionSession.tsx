import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { SkillDomain } from '../types'

// ---- Domain tips (hardcoded) -----------------------------------

const DOMAIN_TIPS: Record<SkillDomain, string[]> = {
  control: [
    '¿Sabías que el 63% de mexicanos no tiene presupuesto? (ENIF 2021)',
    'La regla de las 24 horas: espera un día antes de cualquier compra de +$500',
    'Los gastos hormiga pueden sumar hasta $3,000 al mes sin que te des cuenta',
  ],
  credito: [
    'Tu score en Buró se calcula con: pago puntual (35%), saldo usado (30%), antigüedad (15%)',
    'Pagar solo el mínimo en tarjeta puede triplicar tu deuda en 3 años',
    'Tener más de una tarjeta activa con buen historial mejora tu score',
  ],
  proteccion: [
    'El IMSS solo cubre gastos médicos si cotizas activamente',
    'Un fondo de emergencia de 3 meses protege del 89% de crisis personales',
    'El seguro de gastos médicos mayores puede salvarte de perder todo tu patrimonio',
  ],
  crecimiento: [
    'Los CETES al 10.1% superan la inflación actual del 4.5%',
    'Invertir $1,000/mes por 20 años a 8% = $589,000 (vs $240,000 guardado)',
    'La diversificación reduce el riesgo sin sacrificar rendimiento a largo plazo',
  ],
}

const DOMAIN_EMOJI: Record<SkillDomain, string> = {
  control: '💰',
  credito: '💳',
  proteccion: '🛡️',
  crecimiento: '🌱',
}

const DOMAIN_LABEL: Record<SkillDomain, string> = {
  control: 'Control',
  credito: 'Crédito',
  proteccion: 'Protección',
  crecimiento: 'Crecimiento',
}

const DOMAIN_COLOR: Record<SkillDomain, string> = {
  control: 'var(--leaf-bright)',
  credito: '#C2185B',
  proteccion: 'var(--forest-deep)',
  crecimiento: 'var(--leaf-dark)',
}

const ALL_DOMAINS: SkillDomain[] = ['control', 'credito', 'proteccion', 'crecimiento']

// Pick a deterministic tip index based on today's date
function getTipForDomain(domain: SkillDomain): string {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const tips = DOMAIN_TIPS[domain]
  return tips[dayOfYear % tips.length]
}

// ---- Component -------------------------------------------------

interface PolinizacionSessionProps {
  onSubmit: (domain: SkillDomain, insight: string) => void
  isPending?: boolean
}

export function PolinizacionSession({ onSubmit, isPending }: PolinizacionSessionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedDomain, setSelectedDomain] = useState<SkillDomain | null>(null)
  const [insight, setInsight] = useState('')

  const isInsightValid = insight.trim().length >= 20

  function handleSubmit() {
    if (!selectedDomain || !isInsightValid) return
    onSubmit(selectedDomain, insight.trim())
  }

  return (
    <div className="space-y-6">
      {/* Concept header */}
      <div className="organic-card p-4 space-y-1">
        <p className="text-sm font-bold" style={{ color: 'var(--forest-deep)' }}>
          🐝 Hoy aprende algo de un área diferente a la tuya
        </p>
        <p className="text-xs text-muted-foreground">
          Elige un dominio, lee el dato del día, y escribe una reflexión breve
        </p>
      </div>

      {/* Domain cards */}
      <div className="grid grid-cols-2 gap-3">
        {ALL_DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain
          const tip = getTipForDomain(domain)

          return (
            <motion.button
              key={domain}
              className="text-left p-3 rounded-2xl border-2 transition-colors space-y-2"
              style={{
                borderColor: isSelected ? DOMAIN_COLOR[domain] : 'var(--garden-plot-border)',
                backgroundColor: isSelected ? DOMAIN_COLOR[domain] + '11' : 'var(--garden-plot-surface)',
              }}
              onClick={() => setSelectedDomain(domain)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{DOMAIN_EMOJI[domain]}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: isSelected ? DOMAIN_COLOR[domain] : 'var(--forest-deep)' }}
                >
                  {DOMAIN_LABEL[domain]}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--leaf-muted)' }}>
                {tip}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* Reflection input */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            key="reflection"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold" style={{ color: 'var(--forest-deep)' }}>
              Tu reflexión sobre {DOMAIN_EMOJI[selectedDomain]} {DOMAIN_LABEL[selectedDomain]}
            </label>
            <textarea
              className="w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 min-h-[100px]"
              style={{
                borderColor: 'var(--garden-plot-border)',
                backgroundColor: 'var(--garden-plot-surface)',
                color: 'var(--forest-deep)',
              }}
              placeholder="¿Qué aprendiste? ¿Cómo aplicarías esto en tu vida? (mín. 20 caracteres)"
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              maxLength={500}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{insight.trim().length}/500 caracteres</span>
              {insight.trim().length < 20 && insight.length > 0 && (
                <span className="text-orange-500">Mínimo 20 caracteres</span>
              )}
            </div>

            <button
              className="vibrant-btn w-full min-h-[44px] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!isInsightValid || isPending}
            >
              {isPending ? 'Guardando...' : 'Completar polinización 🐝'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
