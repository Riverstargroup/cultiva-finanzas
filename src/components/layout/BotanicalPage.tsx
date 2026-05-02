import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import { Map, Sprout } from "lucide-react";

interface BotanicalPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  eyebrow?: string;
  zoneLabel?: string;
  zoneHint?: string;
  zoneItems?: readonly string[];
}

export default function BotanicalPage({
  title,
  subtitle,
  children,
  eyebrow = "Sendero Semilla",
  zoneLabel,
  zoneHint,
  zoneItems = [],
}: BotanicalPageProps) {
  return (
    <PageTransition>
      <div className="dashboard-skin world-shell -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-0 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
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
          {(zoneLabel || zoneItems.length > 0) && (
            <section className="zone-compass" aria-label="Zona actual del Sendero">
              <div className="zone-compass-main">
                <span className="zone-compass-mark" aria-hidden="true">
                  <Map className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  {zoneLabel && <p className="zone-compass-label">{zoneLabel}</p>}
                  {zoneHint && <p className="zone-compass-hint">{zoneHint}</p>}
                </div>
              </div>
              {zoneItems.length > 0 && (
                <div className="zone-compass-steps" aria-hidden="true">
                  {zoneItems.map((item, index) => (
                    <span key={`${item}-${index}`} className={index === 0 ? "is-active" : ""}>
                      <Sprout className="h-3.5 w-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
