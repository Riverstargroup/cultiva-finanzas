import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { InflacionChallengeIllustration } from '../assets';
import type { InflacionProduct, InflacionAnswer, InflacionResult } from '../types';

const PRODUCTS: InflacionProduct[] = [
  {
    id: 1,
    name: 'Tortilla',
    unit: '1 kg',
    baseYear: 2010,
    basePrice: 8.5,
    currentPrice: 22,
    options: [12, 17, 22, 30],
  },
  {
    id: 2,
    name: 'Huevo',
    unit: '1 kg',
    baseYear: 2015,
    basePrice: 22,
    currentPrice: 38,
    options: [28, 32, 38, 45],
  },
  {
    id: 3,
    name: 'Gasolina Magna',
    unit: 'por litro',
    baseYear: 2016,
    basePrice: 13.98,
    currentPrice: 24.5,
    options: [18, 21.5, 24.5, 28],
  },
  {
    id: 4,
    name: 'Salario mínimo diario',
    unit: 'por día',
    baseYear: 2019,
    basePrice: 102.68,
    currentPrice: 278.8,
    options: [180, 220, 278.8, 320],
  },
  {
    id: 5,
    name: '$100 pesos en 2010',
    unit: 'inflación acumulada',
    baseYear: 2010,
    basePrice: 100,
    currentPrice: 220,
    options: [150, 180, 220, 260],
  },
];

const formatPrice = (price: number) =>
  price % 1 === 0
    ? `$${price.toLocaleString('es-MX')}`
    : `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  onRestart: () => void;
}

export function InflacionChallenge({ onRestart }: Props) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<InflacionAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleSelect = (option: number) => {
    if (showFeedback || gameOver) return;

    const product = PRODUCTS[currentIndex];
    const isCorrect = option === product.currentPrice;
    setSelectedOption(option);
    setShowFeedback(true);

    const newAnswer: InflacionAnswer = { product, selectedPrice: option, isCorrect };

    setTimeout(() => {
      const updatedAnswers = [...answers, newAnswer];
      if (currentIndex + 1 >= PRODUCTS.length) {
        setAnswers(updatedAnswers);
        setGameOver(true);
      } else {
        setAnswers(updatedAnswers);
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 1000);
  };

  const result: InflacionResult = {
    score: answers.filter((a) => a.isCorrect).length,
    total: PRODUCTS.length,
    answers,
  };

  if (gameOver) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="text-center space-y-2">
          <InflacionChallengeIllustration className="w-20 h-16 mx-auto" />
          <div
            className="organic-border h-16 w-16 mx-auto flex items-center justify-center text-2xl font-black"
            style={{ background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)' }}
          >
            {result.score}/{result.total}
          </div>
          <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--forest-deep)' }}>
            {result.score === 5
              ? '¡Economista experto!'
              : result.score >= 3
              ? '¡Buen conocimiento!'
              : '¡La inflación sorprende!'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
            Acertaste {result.score} de {result.total} precios actuales
          </p>
        </div>

        <div className="space-y-3">
          {result.answers.map((answer, idx) => {
            const inflationPct = Math.round(
              ((answer.product.currentPrice - answer.product.basePrice) / answer.product.basePrice) * 100
            );
            return (
              <div
                key={idx}
                className="rounded-xl px-4 py-3 space-y-1"
                style={{
                  background: answer.isCorrect
                    ? 'color-mix(in srgb, var(--leaf-bright) 10%, transparent)'
                    : 'color-mix(in srgb, #ef4444 10%, transparent)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <span className="text-sm font-semibold" style={{ color: 'var(--forest-deep)' }}>
                      {answer.product.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: 'var(--leaf-bright)',
                      background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)',
                    }}
                  >
                    +{inflationPct}%
                  </span>
                </div>
                <div className="flex gap-3 text-xs" style={{ color: 'var(--leaf-muted)' }}>
                  <span>
                    {answer.product.baseYear}: {formatPrice(answer.product.basePrice)}
                  </span>
                  <span>→</span>
                  <span className="font-semibold" style={{ color: 'var(--forest-deep)' }}>
                    Hoy: {formatPrice(answer.product.currentPrice)}
                  </span>
                  {!answer.isCorrect && (
                    <span className="line-through">(elegiste {formatPrice(answer.selectedPrice)})</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onRestart} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
          <RotateCcw className="mr-2 h-4 w-4" />
          Jugar de nuevo
        </button>
      </motion.div>
    );
  }

  const product = PRODUCTS[currentIndex];
  const inflationPct = Math.round(
    ((product.currentPrice - product.basePrice) / product.basePrice) * 100
  );

  return (
    <div className="space-y-5">
      {/* Game illustration */}
      <InflacionChallengeIllustration className="w-20 h-16 mx-auto" />

      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          Producto {currentIndex + 1} de {PRODUCTS.length}
        </span>
        <div className="flex gap-1">
          {PRODUCTS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-6 rounded-full transition-all"
              style={{
                background:
                  i < currentIndex
                    ? 'var(--leaf-bright)'
                    : i === currentIndex
                    ? 'var(--leaf-dark)'
                    : 'color-mix(in srgb, var(--leaf-muted) 30%, transparent)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Product card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={reduced ? undefined : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -30 }}
          transition={{ duration: 0.22 }}
          className="organic-card p-6 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
                {product.unit}
              </p>
              <h2 className="font-heading font-black text-2xl md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
                {product.name}
              </h2>
            </div>
            <TrendingUp className="h-6 w-6 shrink-0 mt-1" style={{ color: 'var(--clay-soft)' }} />
          </div>

          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'color-mix(in srgb, var(--forest-deep) 7%, transparent)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--leaf-muted)' }}>
              Precio en {product.baseYear}
            </span>
            <span className="font-bold text-lg" style={{ color: 'var(--forest-deep)' }}>
              {formatPrice(product.basePrice)}
            </span>
          </div>

          <p className="text-sm font-semibold text-center" style={{ color: 'var(--leaf-muted)' }}>
            ¿Cuánto cuesta hoy?
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {product.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = showFeedback && option === product.currentPrice;
          const isWrong = showFeedback && isSelected && option !== product.currentPrice;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={showFeedback}
              className="organic-border min-h-[44px] rounded-xl px-4 py-3 text-base font-bold transition-all active:scale-95"
              style={{
                background: isCorrect
                  ? 'color-mix(in srgb, var(--leaf-bright) 20%, transparent)'
                  : isWrong
                  ? 'color-mix(in srgb, #ef4444 15%, transparent)'
                  : 'color-mix(in srgb, var(--forest-deep) 5%, transparent)',
                color: isCorrect
                  ? 'var(--forest-deep)'
                  : isWrong
                  ? '#ef4444'
                  : 'var(--forest-deep)',
                borderColor: isCorrect ? 'var(--leaf-bright)' : isWrong ? '#ef4444' : 'transparent',
                outline: 'none',
              }}
            >
              {formatPrice(option)}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs font-medium"
          style={{ color: 'var(--leaf-muted)' }}
        >
          La inflación acumulada fue del {inflationPct}%
        </motion.p>
      )}
    </div>
  );
}
