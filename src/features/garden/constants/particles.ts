import type { ParticleConfig } from '../types'

export const coinEarnedConfig: ParticleConfig = {
  count: 5,
  duration: 900,
  origin: 'center',
  pattern: 'burst-arc',
  size: { min: 6, max: 10 },
  color: ['#FFC107', '#FFEB82', '#FFD54F'],
  shape: 'star4',
  velocity: { min: 60, max: 120, angleDeg: { min: -120, max: -60 } },
  gravity: 380,
  opacity: { from: 1, to: 0 },
  rotation: { from: 0, to: 720 },
}

export const plantWateredConfig: ParticleConfig = {
  count: 8,
  duration: 700,
  origin: 'top-center',
  pattern: 'rain',
  size: { min: 4, max: 7 },
  color: ['#6BB8E8', '#4A9FD1', '#A3D4F0'],
  shape: 'droplet',
  velocity: { min: 80, max: 140, angleDeg: 90 },
  gravity: 500,
  opacity: { from: 0.9, to: 0, fadeStart: 0.7 },
  spawnJitter: { x: 24, y: 0 },
  stagger: 40,
}

export const stageUpgradeConfig: ParticleConfig = {
  count: 14,
  duration: 1400,
  origin: 'center',
  pattern: 'burst-radial',
  size: { min: 5, max: 11 },
  color: ['#F5C43A', '#78A94B', '#D4633D', '#E91E63', '#4CAF50'],
  shape: 'ribbon',
  velocity: { min: 140, max: 220, angleDeg: { min: -180, max: 0 } },
  gravity: 280,
  opacity: { from: 1, to: 0, fadeStart: 0.6 },
  rotation: { from: 0, to: 540, randomDir: true },
}

export const masteredAmbientConfig: ParticleConfig = {
  count: 6,
  continuous: true,
  spawnInterval: 800,
  origin: 'random-within-bounds',
  pattern: 'drift-up',
  size: { min: 3, max: 6 },
  color: ['#FEF3C7', '#FFEB82', '#FFE89A'],
  shape: 'circle',
  velocity: { min: 20, max: 40, angleDeg: { min: -110, max: -70 } },
  gravity: -8,
  opacity: { from: 0, peak: 0.8, to: 0, curve: 'bell' },
  lifespan: 2400,
  blur: 1,
}
