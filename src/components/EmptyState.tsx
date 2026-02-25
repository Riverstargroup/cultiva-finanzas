import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="organic-card p-8">
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div
          className="organic-border h-14 w-14 flex items-center justify-center mb-4"
          style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)" }}
        >
          <Icon className="h-7 w-7" style={{ color: "var(--leaf-bright)" }} />
        </div>
        <h3 className="font-heading font-bold text-lg mb-1" style={{ color: "var(--forest-deep)" }}>
          {title}
        </h3>
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-warm)" }}>
          {description}
        </p>
        {actionLabel && onAction && (
          <button onClick={onAction} className="vibrant-btn mt-6 min-h-[44px] px-6">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
