import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SECTION_ORDER = [
  "/dashboard",
  "/cursos",
  "/calculadora",
  "/logros",
  "/perfil",
] as const;

export type SectionPath = (typeof SECTION_ORDER)[number];

export function useSectionNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentIndex = useMemo(() => {
    const idx = SECTION_ORDER.findIndex((p) => pathname.startsWith(p));
    return idx === -1 ? 0 : idx;
  }, [pathname]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < SECTION_ORDER.length - 1;

  const goNext = useCallback(() => {
    if (canGoNext) navigate(SECTION_ORDER[currentIndex + 1]);
  }, [canGoNext, currentIndex, navigate]);

  const goPrev = useCallback(() => {
    if (canGoPrev) navigate(SECTION_ORDER[currentIndex - 1]);
  }, [canGoPrev, currentIndex, navigate]);

  const goTo = useCallback(
    (path: string) => navigate(path),
    [navigate]
  );

  return { currentIndex, canGoNext, canGoPrev, goNext, goPrev, goTo };
}
