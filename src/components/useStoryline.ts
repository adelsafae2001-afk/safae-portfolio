import { useEffect, type RefObject } from "react";

// Slightly inside the existing graphite tip so the thin stroke meets the ink.
export const pencilTip = { x: 173.6, y: 73 };
export const restingStoryline = `M${pencilTip.x} ${pencilTip.y} C218 48 222 173 202 224 C181 278 130 285 91 268 C40 245 0 254 -66 299`;
type Matrix = Pick<DOMMatrix, "a" | "b" | "c" | "d" | "e" | "f">;

// Convert the actual limb coordinates through screen space into the line SVG.
// Both matrices include ancestor CSS transforms, responsive sizing and scroll.
export function tipInLineSpace(pencil: Matrix, line: Matrix) {
  const x = pencil.a * pencilTip.x + pencil.c * pencilTip.y + pencil.e - line.e;
  const y = pencil.b * pencilTip.x + pencil.d * pencilTip.y + pencil.f - line.f;
  const determinant = line.a * line.d - line.b * line.c;
  if (Math.abs(determinant) < 1e-10) return null;
  return {
    x: (line.d * x - line.c * y) / determinant,
    y: (line.a * y - line.b * x) / determinant,
  };
}

export function useStoryline(
  illustration: RefObject<HTMLButtonElement | null>,
  path: RefObject<SVGPathElement | null>,
  phase: RefObject<string>,
  motion: boolean,
) {
  useEffect(() => {
    const stroke = path.current;
    const line = stroke?.ownerSVGElement;
    const pencil = illustration.current?.querySelector<SVGGElement>(
      '[data-limb="pencil"]',
    );
    const body = illustration.current?.querySelector("svg");
    if (
      !stroke ||
      !line ||
      !pencil ||
      !body ||
      typeof pencil.getScreenCTM !== "function"
    )
      return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    let springX = 0,
      springY = 0,
      velocityX = 0,
      velocityY = 0;
    let flow = 0;
    let previousPhase = "";
    let pop: Animation | undefined;
    const reset = () => {
      stroke.setAttribute("d", restingStoryline);
      springX = springY = velocityX = velocityY = flow = 0;
    };
    const canRun = () =>
      motion && !preference.matches && visible && !document.hidden;
    const update = (time: number) => {
      frame = 0;
      if (!canRun()) return;
      const pencilMatrix = pencil.getScreenCTM();
      const lineMatrix = line.getScreenCTM();
      if (pencilMatrix && lineMatrix) {
        const tip = tipInLineSpace(pencilMatrix, lineMatrix);
        if (tip) {
          const dt = Math.min((time - (lastTime || time - 16)) / 1000, 1 / 30);
          const dx = tip.x - pencilTip.x,
            dy = tip.y - pencilTip.y;
          // Damped tension affects the middle of the curve, never its attachment.
          velocityX += ((dx - springX) * 85 - velocityX * 16) * dt;
          velocityY += ((dy - springY) * 85 - velocityY * 16) * dt;
          springX += velocityX * dt;
          springY += velocityY * dt;
          flow +=
            ((phase.current === "idle" ? 0.8 : 0) - flow) *
            (1 - Math.exp(-dt * 5));
          if (
            phase.current !== previousPhase ||
            (phase.current === "play" && !pop)
          ) {
            previousPhase = phase.current;
            pop =
              phase.current === "play"
                ? body
                    .getAnimations()
                    .find(
                      (animation) =>
                        "animationName" in animation &&
                        animation.animationName === "character-pop",
                    )
                : undefined;
          }
          // Read the existing CSS timeline rather than recreating its timing.
          const progress = pop?.effect?.getComputedTiming().progress ?? 0;
          const ripple =
            phase.current === "play"
              ? Math.sin(Math.PI * progress) ** 2 * 3
              : 0;
          const wave = (distance: number) =>
            Math.sin(Math.PI * distance) *
            (flow * Math.sin(time / 1600 - distance * 6) +
              ripple * Math.sin(progress * Math.PI * 2 - distance * 9));
          const n = (value: number) => value.toFixed(3);
          stroke.setAttribute(
            "d",
            `M${n(tip.x)} ${n(tip.y)} C${n(218 + dx * 0.8)} ${n(48 + dy * 0.8)} ${n(222 + springX * 0.45)} ${n(173 + springY * 0.45 + wave(0.24))} ${n(202 + springX * 0.2)} ${n(224 + springY * 0.2 + wave(0.38))} C${n(181 + springX * 0.15)} ${n(278 + springY * 0.15 + wave(0.5))} ${n(130 + springX * 0.08)} ${n(285 + springY * 0.08 + wave(0.62))} 91 ${n(268 + wave(0.72))} C40 ${n(245 + wave(0.82))} 0 ${n(254 + wave(0.92))} -66 299`,
          );
        }
      }
      lastTime = time;
      frame = requestAnimationFrame(update);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (canRun()) frame = requestAnimationFrame(update);
      else if (!motion || preference.matches) reset();
    };
    // Suspend frame work when the hero is offscreen or the tab is hidden.
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            refresh();
          })
        : null;
    observer?.observe(illustration.current!);
    preference.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      preference.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      reset();
    };
  }, [illustration, path, phase, motion]);
}
