import type { Variants } from 'framer-motion'

export const idleVariants: Variants = {
  idle: {
    rotate: [-1.2, 1.2, -1.2],
    scaleY: [1, 1.015, 1],
    transition: {
      rotate: {
        duration: 4.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      },
      scaleY: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      },
    },
  },
}

export const growthVariants: Variants = {
  from: { scale: 0.75, y: 12, opacity: 0.6 },
  to: {
    scale: [0.75, 1.15, 1],
    y: [12, -4, 0],
    opacity: [0.6, 1, 1],
    transition: {
      duration: 1.2,
      times: [0, 0.55, 1],
      ease: [0.34, 1.56, 0.64, 1] as unknown as string,
    },
  },
}

export const wateredVariants: Variants = {
  initial: { scale: 1, filter: 'brightness(1) saturate(1)' },
  watered: {
    scale: [1, 1.05, 0.98, 1.02, 1],
    filter: [
      'brightness(1) saturate(1)',
      'brightness(1.12) saturate(1.25)',
      'brightness(1.08) saturate(1.2)',
      'brightness(1.04) saturate(1.1)',
      'brightness(1) saturate(1)',
    ],
    transition: {
      duration: 0.9,
      ease: 'easeOut',
      times: [0, 0.2, 0.45, 0.7, 1],
    },
  },
}

export const glowVariants: Variants = {
  glow: {
    filter: [
      'drop-shadow(0 0 4px rgba(255,193,7,0.35))',
      'drop-shadow(0 0 14px rgba(255,193,7,0.65))',
      'drop-shadow(0 0 4px rgba(255,193,7,0.35))',
    ],
    transition: {
      duration: 2.8,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}

export const hoverVariants: Variants = {
  rest: { scale: 1, rotate: 0, y: 0 },
  hover: {
    scale: 1.04,
    rotate: -2,
    y: -3,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] as unknown as string },
  },
  tap: {
    scale: 0.97,
    rotate: 0,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
}
