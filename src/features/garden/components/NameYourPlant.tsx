import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { SUGGESTED_PLANT_NAMES } from '../constants/plantNames'
import { SPECIES_EMOJI, type PlantSpecies } from '../types'

// ────────────────────────────────────────────────────────────────
// NameYourPlant — onboarding modal shown the first time a user
// plants a new species. Parent controls mount/unmount visibility.
// ────────────────────────────────────────────────────────────────

const MAX_NAME_LENGTH = 20

export interface NameYourPlantProps {
  species: PlantSpecies
  onConfirm: (name: string) => void
  onSkip: () => void
}

const SPECIES_LABEL: Readonly<Record<PlantSpecies, string>> = {
  girasol: 'Girasol',
  margarita: 'Margarita',
  lirio: 'Lirio',
  helecho: 'Helecho',
} as const

export function NameYourPlant({ species, onConfirm, onSkip }: NameYourPlantProps) {
  const [name, setName] = useState('')
  const suggestions = SUGGESTED_PLANT_NAMES[species] ?? []
  const trimmed = name.trim()
  const canConfirm = trimmed.length > 0

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm(trimmed)
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onSkip() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            <span aria-hidden="true" style={{ marginRight: 8 }}>{SPECIES_EMOJI[species]}</span>
            ¡Nombra tu {SPECIES_LABEL[species]}!
          </DialogTitle>
          <DialogDescription>
            Darle un nombre a tu planta la convierte en tu compañera de finanzas.
            Escribe uno o elige una sugerencia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Por ejemplo: Solecito"
            aria-label="Nombre de tu planta"
            autoFocus
          />

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setName(s)}
                className="px-3 py-1.5 rounded-full text-sm bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-right">
            {trimmed.length}/{MAX_NAME_LENGTH}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Saltar por ahora
          </Button>
          <Button type="button" disabled={!canConfirm} onClick={handleConfirm}>
            Confirmar nombre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NameYourPlant
