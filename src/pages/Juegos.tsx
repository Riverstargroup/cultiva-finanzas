import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gamepad2, Clock, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import BotanicalPage from '@/components/layout/BotanicalPage';
import { PresupuestoRapido } from '@/features/minigames/games/PresupuestoRapido';
import { InflacionChallenge } from '@/features/minigames/components/InflacionChallenge';
import {
  PresupuestoRapidoIllustration,
  InflacionChallengeIllustration,
} from '@/features/minigames/assets';
import type { GameId, GameCard } from '@/features/minigames/types';

const GAME_CARDS: GameCard[] = [
  {
    id: 'presupuesto-rapido',
    title: 'Presupuesto Rápido',
    description: 'Clasifica 8 gastos como Necesidad, Deseo o Ahorro antes de que se acabe el tiempo.',
    icon: <PresupuestoRapidoIllustration className="w-full h-full" />,
    duration: '60 seg',
    difficulty: 'Fácil',
  },
  {
    id: 'inflacion-challenge',
    title: 'Reto Inflación',
    description: 'Adivina el precio actual de productos mexicanos. ¿Sabes cuánto ha subido todo?',
    icon: <InflacionChallengeIllustration className="w-full h-full" />,
    duration: '~3 min',
    difficulty: 'Medio',
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: 'var(--leaf-bright)',
  Medio: 'var(--clay-soft)',
  Difícil: '#ef4444',
};

type View = 'lobby' | GameId;

export default function Juegos() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [activeView, setActiveView] = useState<View>('lobby');
  const [gameKey, setGameKey] = useState(0);

  const handlePlay = (id: GameId) => setActiveView(id);

  const handleRestart = () => {
    setGameKey((k) => k + 1);
  };

  const handleBackToLobby = () => {
    setActiveView('lobby');
    setGameKey((k) => k + 1);
  };

  const activeGame = GAME_CARDS.find((g) => g.id === activeView);

  return (
    <BotanicalPage title="Mini-Juegos" subtitle="Aprende jugando">
      <AnimatePresence mode="wait">
        {activeView === 'lobby' ? (
          <motion.div
            key="lobby"
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-semibold min-h-[44px] transition-colors"
              style={{ color: 'var(--leaf-muted)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Mi Jardín
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              {GAME_CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={reduced ? undefined : { scale: 1.01 }}
                  className="organic-card p-5 space-y-3 cursor-pointer"
                  onClick={() => handlePlay(card.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="w-24 h-20 shrink-0 rounded-xl overflow-hidden"
                      style={{ background: 'color-mix(in srgb, var(--clay-soft) 20%, transparent)' }}
                    >
                      {card.icon}
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: DIFFICULTY_COLOR[card.difficulty],
                        background: `color-mix(in srgb, ${DIFFICULTY_COLOR[card.difficulty]} 15%, transparent)`,
                      }}
                    >
                      {card.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-heading font-bold text-lg leading-tight"
                      style={{ color: 'var(--forest-deep)' }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--leaf-muted)' }}>
                      {card.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--leaf-muted)' }}>
                      <Clock className="h-3.5 w-3.5" />
                      {card.duration}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--leaf-muted)' }}>
                      <BarChart2 className="h-3.5 w-3.5" />
                      {card.difficulty}
                    </div>
                  </div>

                  <button
                    className="vibrant-btn w-full justify-center min-h-[44px] font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(card.id);
                    }}
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Jugar
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`game-${activeView}`}
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <button
              onClick={handleBackToLobby}
              className="flex items-center gap-2 text-sm font-semibold min-h-[44px] transition-colors"
              style={{ color: 'var(--leaf-muted)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              {activeGame?.title ?? 'Juegos'}
            </button>

            <div className="organic-card p-5 md:p-6">
              {activeView === 'presupuesto-rapido' && (
                <PresupuestoRapido key={gameKey} onBack={handleBackToLobby} />
              )}
              {activeView === 'inflacion-challenge' && (
                <InflacionChallenge key={gameKey} onRestart={handleRestart} />
              )}
            </div>

            <button
              onClick={handleBackToLobby}
              className="flex items-center gap-2 text-sm font-medium min-h-[44px] w-full justify-center transition-colors rounded-xl"
              style={{
                color: 'var(--leaf-muted)',
                background: 'color-mix(in srgb, var(--forest-deep) 5%, transparent)',
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Elegir otro juego
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </BotanicalPage>
  );
}
