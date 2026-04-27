import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import pathNode from '@/assets/pixel/optimized/ui-path-node.webp';
import coinSprout from '@/assets/pixel/optimized/ui-coin-sprout.webp';

interface ContinueBannerProps {
  courseId: string;
  courseTitle: string;
  progressPct: number;
  nextScenarioTitle?: string;
  onContinue: () => void;
}

export default function ContinueBanner({
  courseTitle,
  progressPct,
  nextScenarioTitle,
  onContinue,
}: ContinueBannerProps) {
  return (
    <div
      className="continue-node sticky top-0 z-10"
      style={{ '--continue-progress': `${progressPct}%` } as CSSProperties}
    >
      <div className="continue-node-token" aria-hidden="true">
        <img src={pathNode} alt="" />
        <img src={coinSprout} alt="" className="continue-node-coin" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="continue-node-kicker">Siguiente nodo</div>
        <div className="font-heading font-bold text-base truncate" style={{ color: 'var(--forest-deep)' }}>
          {courseTitle}
        </div>
        {nextScenarioTitle && (
          <div className="text-xs truncate" style={{ color: 'var(--text-warm)' }}>
            Siguiente: {nextScenarioTitle}
          </div>
        )}
        <div className="continue-node-rail" aria-label={`${progressPct}% completado`}>
          <span />
        </div>
      </div>
      <button
        onClick={onContinue}
        className="vibrant-btn min-h-[44px] font-bold flex items-center shrink-0"
      >
        Continuar <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}
