import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  PresupuestoRapidoIllustration,
  InflacionChallengeIllustration,
  SemillasCreditoIllustration,
  MemoriaMercadoIllustration,
  AhorraCosechaIllustration,
} from '../assets';
import type { GameId } from '../types';

interface GameMeta {
  title: string;
  description: string;
}

const GAME_META: Record<GameId, GameMeta> = {
  'presupuesto-rapido': {
    title: 'Presupuesto Rápido',
    description: 'Clasifica gastos como Necesidad, Deseo o Ahorro antes de que se acabe el tiempo.',
  },
  'inflacion-challenge': {
    title: 'Reto Inflación',
    description: 'Adivina el precio actual de productos mexicanos. ¿Sabes cuánto ha subido todo?',
  },
  'semillas-credito': {
    title: 'Semillas de Crédito',
    description: 'Desliza acciones de crédito para construir o dañar tu historial crediticio.',
  },
  'memoria-mercado': {
    title: 'Memoria del Mercado',
    description: 'Empareja instrumentos de inversión mexicanos: CETES, FIBRAS y más.',
  },
  'ahorra-cosecha': {
    title: 'Ahorra la Cosecha',
    description: 'Detén el péndulo en la zona de ahorro ideal. ¡Cada quincena cuenta!',
  },
};

function GameIllustration({ gameId }: { gameId: GameId }) {
  const cls = 'w-10 h-10 shrink-0';
  switch (gameId) {
    case 'presupuesto-rapido':
      return <PresupuestoRapidoIllustration className={cls} />;
    case 'inflacion-challenge':
      return <InflacionChallengeIllustration className={cls} />;
    case 'semillas-credito':
      return <SemillasCreditoIllustration className={cls} />;
    case 'memoria-mercado':
      return <MemoriaMercadoIllustration className={cls} />;
    case 'ahorra-cosecha':
      return <AhorraCosechaIllustration className={cls} />;
  }
}

interface Props {
  gameId: GameId;
  onPlay: () => void;
  onDismiss: () => void;
}

export function BonusGamePrompt({ gameId, onPlay, onDismiss }: Props) {
  const reduced = useReducedMotion();
  const meta = GAME_META[gameId];

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="organic-card p-4 relative"
    >
      {/* BONUS pill badge */}
      <span
        className="absolute top-3 left-4 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{
          color: 'var(--forest-deep)',
          background: 'color-mix(in srgb, var(--leaf-bright) 35%, transparent)',
        }}
      >
        BONUS
      </span>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        aria-label="Cerrar bonus"
        className="absolute top-0 right-0 flex items-center justify-center rounded-tr-2xl rounded-bl-2xl"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          color: 'var(--leaf-muted)',
        }}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Content row */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <GameIllustration gameId={gameId} />
        <div className="min-w-0">
          <p
            className="font-heading font-bold text-sm leading-tight"
            style={{ color: 'var(--forest-deep)' }}
          >
            {meta.title}
          </p>
          <p
            className="text-xs mt-0.5 leading-snug"
            style={{ color: 'var(--leaf-muted)' }}
          >
            {meta.description}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onPlay}
        className="vibrant-btn w-full justify-center min-h-[44px] font-bold text-sm"
      >
        ¡Jugar bonus! 🎮
      </button>
    </motion.div>
  );
}
