import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { GameCategory } from '../types';

type ChipValue = GameCategory | 'Todos';

interface CategoryChipsProps {
  categories: GameCategory[];
  selected: ChipValue;
  onChange: (value: ChipValue) => void;
}

export function CategoryChips({ categories, selected, onChange }: CategoryChipsProps) {
  const reduced = useReducedMotion();
  const options: ChipValue[] = ['Todos', ...categories];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      role="tablist"
      aria-label="Filtrar juegos por categoría"
      style={{ scrollbarWidth: 'thin' }}
    >
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <motion.button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            className="shrink-0 min-h-[44px] px-4 rounded-full text-sm font-semibold"
            style={{
              background: isActive ? 'var(--forest-deep)' : 'transparent',
              border: `1.5px solid ${isActive ? 'var(--forest-deep)' : 'var(--clay-soft)'}`,
              color: isActive ? '#ffffff' : 'var(--leaf-muted)',
              boxShadow: isActive
                ? '0 2px 8px color-mix(in srgb, var(--forest-deep) 20%, transparent)'
                : 'none',
              transition: 'background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s',
            }}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}
