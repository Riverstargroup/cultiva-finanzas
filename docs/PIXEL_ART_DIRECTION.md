# Cultiva Finanzas - Pixel Art Direction

## Decision

Cultiva uses **cozy premium pixel art** for characters, enemies, world objects and map UI.

The goal is to avoid the generic AI-rendered look and make the product feel like an intentional game world. Pixel art also makes animation cheaper: idle bounces, blinks, reactions and weakened states can be done with small sprite variants or CSS transforms.

## Visual Principles

- Pixel art, not smooth illustration.
- Clear silhouettes at small mobile sizes.
- Limited palette with botanical warmth.
- 1-2 px dark outline for readability.
- Expressive eyes and posture carry personality.
- No painterly airbrush, no 3D render, no fuzzy soft shadows.
- No copied style from existing game IP.

## Sprite Specs

| Asset type | Canvas | Production display |
| --- | ---: | ---: |
| Plantamigo | 128x128 | 64-112 px |
| Enemy | 128x128 | 72-128 px |
| POI building | 256x256 | 96-180 px |
| Map node | 64x64 | 40-64 px |
| Coin/icon | 32x32 or 64x64 | 16-32 px |

## Required MVP Assets

1. `plantamigo-nopalito-idle.png`
2. `plantamigo-nopalito-celebrating.png`
3. `plantamigo-nopalito-curious.png`
4. `plantamigo-nopalito-worried.png`
5. `plantamigo-helecho-sabio-idle.png`
6. `plantamigo-lirio-guardian-idle.png`
7. `plantamigo-gira-compas-idle.png`
8. `plantamigo-brotin-dorado-idle.png`
9. `enemy-gasto-hormiga-idle.png`
10. `enemy-gasto-hormiga-weakened.png`
11. `poi-course-greenhouse.png`
12. `poi-shop-gate.png`
13. `poi-garden-home.png`
14. `ui-coin-sprout.png`

## Integration Plan

- Store source PNGs in `src/assets/pixel/`.
- Convert production variants to WebP when the final set lands.
- Add a small `PixelSprite` component with fixed image-rendering rules:
  - `image-rendering: pixelated`
  - stable width/height
  - alt text per character/POI
- Replace vector placeholder plantamigos in the adventure map first.
- Keep existing SVG plant rig as fallback until the asset set is complete.
