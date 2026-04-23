import type { ReactNode } from 'react';

export type GameId =
  | 'presupuesto-rapido'
  | 'inflacion-challenge'
  | 'semillas-credito'
  | 'memoria-mercado'
  | 'ahorra-cosecha';

export type GameCategory = 'Presupuesto' | 'Crédito' | 'Ahorro' | 'Inversión' | 'Inflación';

export type GameState = 'idle' | 'playing' | 'finished';

// PresupuestoRapido types
export type ExpenseCategory = 'Necesidad' | 'Deseo' | 'Ahorro';

export interface Expense {
  id: number;
  name: string;
  amount: number;
  correctCategory: ExpenseCategory;
}

export interface PresupuestoAnswer {
  expense: Expense;
  selectedCategory: ExpenseCategory;
  isCorrect: boolean;
}

export interface PresupuestoResult {
  score: number;
  total: number;
  answers: PresupuestoAnswer[];
}

// InflacionChallenge types
export interface InflacionProduct {
  id: number;
  name: string;
  baseYear: number;
  basePrice: number;
  currentPrice: number;
  options: number[];
  unit: string;
}

export interface InflacionAnswer {
  product: InflacionProduct;
  selectedPrice: number;
  isCorrect: boolean;
}

export interface InflacionResult {
  score: number;
  total: number;
  answers: InflacionAnswer[];
}

// Game card for the lobby
export interface GameCard {
  id: GameId;
  title: string;
  description: string;
  /** React node — use an SVG illustration component rather than an emoji string. */
  icon: ReactNode;
  duration: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  category: GameCategory;
  concept: string;
  relatedCourseTag?: string;
}

/**
 * Convert a GameId (kebab-case) into the snake_case activity_type
 * stored in `user_activity_attempts.activity_type`.
 */
export function gameIdToActivityType(id: GameId): string {
  return id.replace(/-/g, '_');
}
