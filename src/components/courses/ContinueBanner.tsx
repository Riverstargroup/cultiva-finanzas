import { ArrowRight } from 'lucide-react';

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
      className="organic-card sticky top-0 z-10 p-4 flex items-center gap-3 flex-wrap sm:flex-nowrap"
      style={{ borderLeft: '4px solid var(--leaf-bright)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--leaf-muted)' }}>
          Sigue tu curso
        </div>
        <div className="font-heading font-bold text-sm truncate" style={{ color: 'var(--forest-deep)' }}>
          {courseTitle}
        </div>
        {nextScenarioTitle && (
          <div className="text-xs truncate" style={{ color: 'var(--text-warm)' }}>
            Siguiente: {nextScenarioTitle}
          </div>
        )}
        <div className="text-xs mt-1" style={{ color: 'var(--leaf-muted)' }}>
          {progressPct}% completado
        </div>
      </div>
      <button
        onClick={onContinue}
        className="vibrant-btn min-h-[44px] font-bold flex items-center"
      >
        Continuar <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}
