import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";

interface BotanicalPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  eyebrow?: string;
}

export default function BotanicalPage({
  title,
  subtitle,
  children,
  eyebrow = "Sendero Semilla",
}: BotanicalPageProps) {
  return (
    <PageTransition>
      <div className="dashboard-skin world-shell -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-32 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="world-shell-content mx-auto max-w-4xl space-y-6">
          <header className="world-page-header">
            <p className="world-page-kicker">
              {eyebrow}
            </p>
            <h1
              className="font-heading text-2xl font-black md:text-3xl"
              style={{ color: "var(--forest-deep)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-1.5 text-sm font-semibold leading-relaxed"
                style={{ color: "var(--leaf-muted)" }}
              >
                {subtitle}
              </p>
            )}
          </header>
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
