import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PresupuestoRapidoIllustration } from '../assets';
import type { Expense, ExpenseCategory, PresupuestoAnswer, PresupuestoResult } from '../types';

const EXPENSES: Expense[] = [
  { id: 1, name: 'Renta CDMX', amount: 9500, correctCategory: 'Necesidad' },
  { id: 2, name: 'Netflix', amount: 219, correctCategory: 'Deseo' },
  { id: 3, name: 'IMSS aportación', amount: 850, correctCategory: 'Necesidad' },
  { id: 4, name: 'Cena restaurante', amount: 650, correctCategory: 'Deseo' },
  { id: 5, name: 'Fondo de emergencia', amount: 2000, correctCategory: 'Ahorro' },
  { id: 6, name: 'Camión/Metro', amount: 800, correctCategory: 'Necesidad' },
  { id: 7, name: 'Zapatos nuevos', amount: 1200, correctCategory: 'Deseo' },
  { id: 8, name: 'AFORE voluntaria', amount: 500, correctCategory: 'Ahorro' },
];

const CATEGORIES: ExpenseCategory[] = ['Necesidad', 'Deseo', 'Ahorro'];
const TOTAL_TIME = 60;

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Necesidad: 'var(--forest-deep)',
  Deseo: 'var(--clay-soft)',
  Ahorro: 'var(--leaf-bright)',
};

const CATEGORY_BG: Record<ExpenseCategory, string> = {
  Necesidad: 'color-mix(in srgb, var(--forest-deep) 12%, transparent)',
  Deseo: 'color-mix(in srgb, var(--clay-soft) 12%, transparent)',
  Ahorro: 'color-mix(in srgb, var(--leaf-bright) 12%, transparent)',
};

interface Props {
  onRestart: () => void;
  onGameComplete?: (score: number, total: number) => void;
}

export function PresupuestoRapido({ onRestart, onGameComplete }: Props) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answers, setAnswers] = useState<PresupuestoAnswer[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const finishGame = useCallback((finalAnswers: PresupuestoAnswer[]) => {
    setAnswers(finalAnswers);
    setGameOver(true);
    const score = finalAnswers.filter((a) => a.isCorrect).length;
    onGameComplete?.(score, EXPENSES.length);
  }, [onGameComplete]);

  useEffect(() => {
    if (gameOver || showFeedback) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, showFeedback, answers, finishGame]);

  const handleCategorySelect = (category: ExpenseCategory) => {
    if (showFeedback || gameOver) return;

    const expense = EXPENSES[currentIndex];
    const isCorrect = category === expense.correctCategory;
    setSelectedCategory(category);
    setShowFeedback(true);

    const newAnswer: PresupuestoAnswer = { expense, selectedCategory: category, isCorrect };

    setTimeout(() => {
      const updatedAnswers = [...answers, newAnswer];
      if (currentIndex + 1 >= EXPENSES.length) {
        finishGame(updatedAnswers);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedCategory(null);
        setShowFeedback(false);
      }
    }, 800);
  };

  const result: PresupuestoResult = {
    score: answers.filter((a) => a.isCorrect).length,
    total: EXPENSES.length,
    answers,
  };

  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const timerColor =
    timeLeft > 30 ? 'var(--leaf-bright)' : timeLeft > 10 ? 'var(--clay-soft)' : '#ef4444';

  if (gameOver) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="text-center space-y-2">
          <PresupuestoRapidoIllustration className="w-20 h-16 mx-auto" />
          <div
            className="organic-border h-16 w-16 mx-auto flex items-center justify-center text-2xl font-black"
            style={{ background: 'color-mix(in srgb, var(--leaf-bright) 15%, transparent)' }}
          >
            {result.score}/{result.total}
          </div>
          <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--forest-deep)' }}>
            {result.score >= 7 ? '¡Excelente!' : result.score >= 5 ? '¡Bien hecho!' : '¡Sigue practicando!'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
            Clasificaste correctamente {result.score} de {result.total} gastos
          </p>
        </div>

        <div className="space-y-2">
          {result.answers.map((answer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: answer.isCorrect
                  ? 'color-mix(in srgb, var(--leaf-bright) 10%, transparent)'
                  : 'color-mix(in srgb, #ef4444 10%, transparent)',
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {answer.isCorrect ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                )}
                <span className="text-sm font-medium truncate" style={{ color: 'var(--forest-deep)' }}>
                  {answer.expense.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {!answer.isCorrect && (
                  <span className="text-xs line-through" style={{ color: 'var(--leaf-muted)' }}>
                    {answer.selectedCategory}
                  </span>
                )}
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: CATEGORY_COLORS[answer.expense.correctCategory],
                    background: CATEGORY_BG[answer.expense.correctCategory],
                  }}
                >
                  {answer.expense.correctCategory}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onRestart} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
          <RotateCcw className="mr-2 h-4 w-4" />
          Jugar de nuevo
        </button>
      </motion.div>
    );
  }

  const currentExpense = EXPENSES[currentIndex];

  return (
    <div className="space-y-5">
      {/* Game illustration */}
      <PresupuestoRapidoIllustration className="w-20 h-16 mx-auto" />

      {/* Timer + progress header */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
          Gasto {currentIndex + 1} de {EXPENSES.length}
        </span>
        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4" style={{ color: timerColor }} />
          <span
            className="text-xl font-black tabular-nums"
            style={{ color: timerColor, minWidth: '2ch' }}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--leaf-muted) 20%, transparent)' }}>
        <motion.div
          className="h-full rounded-full transition-colors"
          style={{ width: `${timerPercent}%`, background: timerColor }}
          animate={reduced ? undefined : { width: `${timerPercent}%` }}
        />
      </div>

      {/* Expense card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExpense.id}
          initial={reduced ? undefined : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="organic-card p-6 text-center space-y-1"
        >
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--leaf-muted)' }}>
            ¿Es una...?
          </p>
          <h2 className="font-heading font-black text-2xl md:text-3xl" style={{ color: 'var(--forest-deep)' }}>
            {currentExpense.name}
          </h2>
          <p className="text-lg font-bold" style={{ color: 'var(--leaf-bright)' }}>
            ${currentExpense.amount.toLocaleString('es-MX')} MXN
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Category buttons */}
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const isCorrect = showFeedback && cat === currentExpense.correctCategory;
          const isWrong = showFeedback && isSelected && cat !== currentExpense.correctCategory;

          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              disabled={showFeedback}
              className="organic-border min-h-[44px] rounded-xl px-2 py-3 text-sm font-bold transition-all active:scale-95"
              style={{
                background: isCorrect
                  ? 'color-mix(in srgb, var(--leaf-bright) 20%, transparent)'
                  : isWrong
                  ? 'color-mix(in srgb, #ef4444 15%, transparent)'
                  : isSelected
                  ? CATEGORY_BG[cat]
                  : 'color-mix(in srgb, var(--forest-deep) 5%, transparent)',
                color: CATEGORY_COLORS[cat],
                borderColor: isCorrect
                  ? 'var(--leaf-bright)'
                  : isWrong
                  ? '#ef4444'
                  : 'transparent',
                outline: 'none',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
