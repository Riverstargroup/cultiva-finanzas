import type { GameCategory } from '../types';

type ChipValue = GameCategory | 'Todos';

interface CategoryChipsProps {
  categories: GameCategory[];
  selected: ChipValue;
  onChange: (value: ChipValue) => void;
}

export function CategoryChips({ categories, selected, onChange }: CategoryChipsProps) {
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
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className="shrink-0 min-h-[44px] px-4 rounded-full text-sm font-semibold transition-colors"
            style={{
              background: isActive ? '#ffffff' : 'transparent',
              border: `1.5px solid ${
                isActive ? 'var(--leaf-bright)' : 'var(--clay-soft)'
              }`,
              color: isActive ? 'var(--forest-deep)' : 'var(--leaf-muted)',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
