import { useRef, useCallback, useEffect, type ReactNode, type TouchEvent } from "react";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

interface SwipeNavigatorProps {
  children: ReactNode;
}

/** Walk up the DOM checking for horizontal scroll containers or .no-swipe */
function isInExclusionZone(el: HTMLElement | null): boolean {
  let node = el;
  while (node) {
    if (node.classList?.contains("no-swipe")) return true;
    const tag = node.tagName?.toLowerCase();
    if (tag === "input" && (node as HTMLInputElement).type === "range") return true;
    // Has actual horizontal scroll content
    if (node.scrollWidth > node.clientWidth + 4) {
      const overflow = getComputedStyle(node).overflowX;
      if (overflow === "auto" || overflow === "scroll") return true;
    }
    node = node.parentElement;
  }
  return false;
}

export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
  const { goNext, goPrev, canGoNext, canGoPrev } = useSectionNavigation();
  const startX = useRef(0);
  const startY = useRef(0);
  const excluded = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    excluded.current = isInExclusionZone(e.target as HTMLElement);
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (excluded.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      if (Math.abs(deltaX) < 60) return;
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

      if (deltaX < -60 && canGoNext) goNext();
      else if (deltaX > 60 && canGoPrev) goPrev();
    },
    [goNext, goPrev, canGoNext, canGoPrev]
  );

  // Keyboard shortcuts: Alt + Arrow
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" && canGoNext) {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" && canGoPrev) {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, canGoNext, canGoPrev]);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
    >
      {children}
    </div>
  );
}
