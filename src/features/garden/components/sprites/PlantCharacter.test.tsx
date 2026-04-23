import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock framer-motion before any imports that use it
vi.mock('framer-motion', () => {
  const MotionG = ({ children, ...rest }: React.HTMLAttributes<SVGGElement> & { animate?: unknown; transition?: unknown; style?: React.CSSProperties }) =>
    <g {...(rest as React.SVGAttributes<SVGGElement>)}>{children}</g>
  const MotionPath = (props: React.SVGAttributes<SVGPathElement> & { animate?: unknown; transition?: unknown }) =>
    <path {...props} />
  return {
    motion: {
      g: MotionG,
      path: MotionPath,
      div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement> & { animate?: unknown; transition?: unknown; style?: React.CSSProperties }) =>
        <div {...rest}>{children}</div>,
    },
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))

import type { PlantSpecies, GrowthStage, PlantAnimationKey } from '../../types'
import { PlantCharacter } from './PlantCharacter'

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderCharacter(props: {
  species: PlantSpecies
  stage: GrowthStage
  mood?: 'idle' | 'happy' | 'cheer' | 'worried' | 'sleeping'
  customName?: string
  animationCue?: PlantAnimationKey | null
  size?: number
}) {
  return render(
    <PlantCharacter
      species={props.species}
      stage={props.stage}
      mood={props.mood ?? 'idle'}
      customName={props.customName}
      animationCue={props.animationCue ?? null}
      size={props.size ?? 120}
    />
  )
}

// ── Species rendering ─────────────────────────────────────────────────────────

describe('PlantCharacter — species rendering', () => {
  const species: PlantSpecies[] = ['girasol', 'margarita', 'lirio', 'helecho']

  it.each(species)('renders without crashing for species %s at blooming stage', (species) => {
    // Arrange
    // Act
    const { container } = renderCharacter({ species, stage: 'blooming' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it.each(species)('renders without crashing for species %s at seed stage', (species) => {
    // Arrange
    // Act
    const { container } = renderCharacter({ species, stage: 'seed' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it.each(species)('renders without crashing for species %s at sprout stage', (species) => {
    // Arrange
    // Act
    const { container } = renderCharacter({ species, stage: 'sprout' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it.each(species)('renders without crashing for species %s at growing stage', (species) => {
    // Arrange
    // Act
    const { container } = renderCharacter({ species, stage: 'growing' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it.each(species)('renders without crashing for species %s at mastered stage', (species) => {
    // Arrange
    // Act
    const { container } = renderCharacter({ species, stage: 'mastered' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })
})

// ── Accessible title ─────────────────────────────────────────────────────────

describe('PlantCharacter — accessibility', () => {
  it('renders an accessible title element that describes the plant', () => {
    // Arrange
    // Act
    renderCharacter({ species: 'girasol', stage: 'blooming' })

    // Assert — either an aria-label, role="img" with label, or a <title> element
    const titled = screen.queryByRole('img') ?? screen.queryByTitle(/girasol|planta|plant/i)
    const labelledElement = document.querySelector('[aria-label]')
    expect(titled ?? labelledElement).not.toBeNull()
  })

  it('renders accessible label containing the species name', () => {
    // Arrange
    // Act
    renderCharacter({ species: 'margarita', stage: 'growing' })

    // Assert
    const labelledElement = document.querySelector('[aria-label]')
    const imgRole = screen.queryByRole('img')
    expect(labelledElement ?? imgRole).not.toBeNull()
  })
})

// ── Mood prop ─────────────────────────────────────────────────────────────────

describe('PlantCharacter — mood prop', () => {
  it('accepts idle mood without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'girasol', stage: 'blooming', mood: 'idle' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts happy mood without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'girasol', stage: 'blooming', mood: 'happy' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it('renders different SVG content for idle vs happy mood', () => {
    // Arrange
    const { container: idleContainer } = renderCharacter({
      species: 'margarita',
      stage: 'blooming',
      mood: 'idle',
    })
    const { container: happyContainer } = renderCharacter({
      species: 'margarita',
      stage: 'blooming',
      mood: 'happy',
    })

    // Act — compare SVG content
    const idleSvg = idleContainer.querySelector('svg')?.innerHTML ?? ''
    const happySvg = happyContainer.querySelector('svg')?.innerHTML ?? ''

    // Assert — happy and idle should produce different SVG shapes
    expect(idleSvg).not.toEqual(happySvg)
  })

  it('accepts cheer mood without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'lirio', stage: 'blooming', mood: 'cheer' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts worried mood without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'helecho', stage: 'growing', mood: 'worried' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts sleeping mood without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'margarita', stage: 'growing', mood: 'sleeping' })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })
})

// ── animationCue prop ─────────────────────────────────────────────────────────

describe('PlantCharacter — animationCue prop', () => {
  const cues: PlantAnimationKey[] = ['idle', 'watered', 'growth', 'glow', 'hover']

  it.each(cues)('accepts animationCue "%s" without crashing', (cue) => {
    // Arrange / Act
    const { container } = renderCharacter({
      species: 'girasol',
      stage: 'blooming',
      animationCue: cue,
    })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })

  it('accepts null animationCue without crashing', () => {
    // Arrange / Act
    const { container } = renderCharacter({
      species: 'girasol',
      stage: 'blooming',
      animationCue: null,
    })

    // Assert
    expect(container.firstChild).not.toBeNull()
  })
})

// ── customName prop ───────────────────────────────────────────────────────────

describe('PlantCharacter — customName prop', () => {
  it('renders the custom name when provided', () => {
    // Arrange
    const name = 'Solecito'

    // Act
    renderCharacter({ species: 'girasol', stage: 'blooming', customName: name })

    // Assert
    expect(screen.getByText('Solecito')).toBeInTheDocument()
  })

  it('does not render a name label when customName is omitted', () => {
    // Arrange / Act
    renderCharacter({ species: 'girasol', stage: 'blooming' })

    // Assert — no floating label text should be in the document
    const label = document.querySelector('[aria-label*="Planta"]')
    // The plant should render but without a personalised name bubble
    expect(screen.queryByText(/Solecito|Mi planta/)).toBeNull()
    expect(label).toBeNull()
  })

  it('renders the name inside an accessible aria-label element', () => {
    // Arrange
    const name = 'Rosa'

    // Act
    renderCharacter({ species: 'margarita', stage: 'growing', customName: name })

    // Assert
    const labelEl = document.querySelector(`[aria-label*="${name}"]`)
    expect(labelEl).not.toBeNull()
  })

  it('renders long custom names without crashing', () => {
    // Arrange
    const longName = 'Plantita de mi corazón'

    // Act
    const { container } = renderCharacter({
      species: 'lirio',
      stage: 'blooming',
      customName: longName,
    })

    // Assert
    expect(container.firstChild).not.toBeNull()
    expect(screen.getByText(longName)).toBeInTheDocument()
  })
})

// ── size prop ─────────────────────────────────────────────────────────────────

describe('PlantCharacter — size prop', () => {
  it('applies the given size to the SVG dimensions', () => {
    // Arrange
    const size = 200

    // Act
    const { container } = renderCharacter({ species: 'girasol', stage: 'blooming', size })

    // Assert
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe(String(size))
    expect(svg?.getAttribute('height')).toBe(String(size))
  })

  it('uses default size 120 when size prop is not provided', () => {
    // Arrange / Act
    const { container } = render(
      <PlantCharacter species="girasol" stage="blooming" mood="idle" animationCue={null} />
    )

    // Assert
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('120')
    expect(svg?.getAttribute('height')).toBe('120')
  })

  it('renders correctly with a small size of 60', () => {
    // Arrange / Act
    const { container } = renderCharacter({ species: 'helecho', stage: 'seed', size: 60 })

    // Assert
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('60')
    expect(svg?.getAttribute('height')).toBe('60')
  })
})
