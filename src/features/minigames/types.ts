import type { ReactNode } from 'react';

export type GameId = 'presupuesto-rapido' | 'inflacion-challenge';

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
}
