import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gamepad2, Clock, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import BotanicalPage from '@/components/layout/BotanicalPage';
import { PresupuestoRapido } from '@/features/minigames/games/PresupuestoRapido';
import { InflacionChallenge } from '@/features/minigames/components/InflacionChallenge';
import { SemillasCredito } from '@/features/minigames/games/SemillasCredito';
import { MemoriaMercado } from '@/features/minigames/games/MemoriaMercado';
import { AhorraCosecha } from '@/features/minigames/games/AhorraCosecha';
import {
  PresupuestoRapidoIllustration,
  InflacionChallengeIllustration,
  SemillasCreditoIllustration,
  MemoriaMercadoIllustration,
  AhorraCosechaIllustration,
} from '@/features/minigames/assets';
import { CategoryChips } from '@/features/minigames/components/CategoryChips';
import { GameStatRow } from '@/features/minigames/components/GameStatRow';
import { useGameStats } from '@/features/minigames/hooks/useGameStats';
import type { GameId, GameCard, GameCategory } from '@/features/minigames/types';

const GAME_CARDS: GameCard[] = [
  {
    id: 'presupuesto-rapido',
    title: 'Presupuesto Rápido',
    description: 'Clasifica 8 gastos como Necesidad, Deseo o Ahorro antes de que se acabe el tiempo.',
    icon: <PresupuestoRapidoIllustration className="w-full h-full" />,
    duration: '60 seg',
    difficulty: 'Fácil',
    category: 'Presupuesto',
    concept: 'Clasifica gastos en 4 categorías',
  },
  {
    id: 'inflacion-challenge',
    title: 'Reto Inflación',
    description: 'Adivina el precio actual de productos mexicanos. ¿Sabes cuánto ha subido todo?',
    icon: <InflacionChallengeIllustration className="w-full h-full" />,
    duration: '~3 min',
    difficulty: 'Medio',
    category: 'Inflación',
    concept: 'Estima el impacto de la inflación',
  },
  {
    id: 'semillas-credito',
    title: 'Semillas de Crédito',
    description: 'Desliza acciones de crédito a la izquierda o derecha para construir o dañar tu historial.',
    icon: <SemillasCreditoIllustration className="w-full h-full" />,
    duration: '~2 min',
    difficulty: 'Medio',
    category: 'Crédito',
    concept: 'Construye o daña tu historial crediticio',
  },
  {
    id: 'memoria-mercado',
    title: 'Memoria del Mercado',
    description: 'Empareja instrumentos de inversión mexicanos. ¿Conoces los CETES, FIBRAS y la AFORE?',
    icon: <MemoriaMercadoIllustration className="w-full h-full" />,
    duration: '90 seg',
    difficulty: 'Medio',
    category: 'Inversión',
    concept: 'Reconoce instrumentos de inversión',
  },
  {
    id: 'ahorra-cosecha',
    title: 'Ahorra la Cosecha',
    description: 'Detén el péndulo en la zona de ahorro ideal. ¡Cada quincena cuenta!',
    icon: <AhorraCosechaIllustration className="w-full h-full" />,
    duration: '~2 min',
    difficulty: 'Fácil',
    category: 'Ahorro',
    concept: 'Aprende a ahorrar consistentemente',
  },
];
// GAME_REGISTRY_INSERTION_POINT — Wave 3 games append here

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: 'var(--leaf-bright)',
  Medio: 'var(--clay-soft)',
  Difícil: '#ef4444',
};

type View = 'lobby' | GameId;
type CategoryFilter = GameCategory | 'Todos';

export default function Juegos() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [activeView, setActiveView] = useState<View>('lobby');
  const [gameKey, setGameKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos');
  const stats = useGameStats();

  const availableCategories = useMemo<GameCategory[]>(() => {
    const seen = new Set<GameCategory>();
    for (const card of GAME_CARDS) seen.add(card.category);
    return Array.from(seen);
  }, []);

  const visibleCards = useMemo(() => {
    if (selectedCategory === 'Todos') return GAME_CARDS;
    return GAME_CARDS.filter((card) => card.category === selectedCategory);
  }, [selectedCategory]);

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

            <CategoryChips
              categories={availableCategories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={reduced ? undefined : { scale: 1.02, y: -2 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  className="organic-card overflow-hidden cursor-pointer"
                  style={{ padding: 0 }}
                  onClick={() => handlePlay(card.id)}
                >
                  {/* Full-width illustration banner */}
                  <div className="relative w-full h-28 overflow-hidden">
                    <div
                      className="w-full h-full"
                      style={{ background: 'color-mix(in srgb, var(--clay-soft) 30%, var(--soil-warm, #e8dcc4))' }}
                    >
                      {card.icon}
                    </div>
                    {/* Difficulty badge — absolute top-right */}
                    <span
                      className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: DIFFICULTY_COLOR[card.difficulty],
                        background: `color-mix(in srgb, ${DIFFICULTY_COLOR[card.difficulty]} 18%, white)`,
                      }}
                    >
                      {card.difficulty}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
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

                    <GameStatRow stat={stats[card.id]} />

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
                  </div>
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
              {activeView === 'semillas-credito' && (
                <SemillasCredito key={gameKey} onBack={handleBackToLobby} />
              )}
              {activeView === 'memoria-mercado' && (
                <MemoriaMercado key={gameKey} onBack={handleBackToLobby} />
              )}
              {activeView === 'ahorra-cosecha' && (
                <AhorraCosecha key={gameKey} onBack={handleBackToLobby} />
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
