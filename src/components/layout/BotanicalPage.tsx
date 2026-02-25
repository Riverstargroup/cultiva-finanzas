import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";

interface BotanicalPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function BotanicalPage({ title, subtitle, children }: BotanicalPageProps) {
  return (
    <PageTransition>
      <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1
              className="font-heading text-2xl font-black md:text-3xl"
              style={{ color: "var(--forest-deep)" }}
            >
              {title}
            </h1>
            <p
              className="mt-1.5 text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--leaf-muted)" }}
            >
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
