import { useEffect, useRef, useState } from "react";
import originalCharacter from "../../public/Asset 2.svg?raw";
import { content, type Lang } from "../content";
import { restingStoryline, useStoryline } from "./useStoryline";

// Use the uploaded SVG verbatim. Only the XML prolog is omitted for inline HTML.
const artwork = originalCharacter.replace(/<\?xml[^?]*\?>\s*/, "");

export function Character({ lang, motion }: { lang: Lang; motion: boolean }) {
  const illustration = useRef<HTMLButtonElement>(null);
  const storyline = useRef<SVGPathElement>(null);
  type Phase = "entrance" | "idle" | "settle" | "play";
  const [phase, setPhase] = useState<Phase>(() =>
    motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "entrance"
      : "idle",
  );
  const phaseRef = useRef(phase);
  const pendingGesture = useRef(false);
  const pointerType = useRef("mouse");
  const handoff = useRef<Animation[]>([]);
  const handoffVersion = useRef(0);
  const cancelHandoff = () => {
    handoffVersion.current += 1;
    handoff.current.forEach((animation) => animation.cancel());
    handoff.current = [];
  };
  const changePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const requestGesture = () => {
    if (
      !motion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    if (phaseRef.current === "entrance") {
      pendingGesture.current = true;
    } else if (phaseRef.current === "idle") {
      // Sample the current idle pose before removing its CSS animations. A brief
      // handoff returns it to neutral without modifying the approved pop frames.
      const elements = illustration.current?.querySelectorAll<SVGElement>(
        ":scope > svg, [data-limb]",
      );
      if (
        !elements ||
        !Array.from(elements).every(
          (element) => typeof element.animate === "function",
        )
      ) {
        changePhase("play");
        return;
      }
      const poses = Array.from(elements, (element) => ({
        element,
        transform: window.getComputedStyle(element).transform,
      }));
      const version = ++handoffVersion.current;
      changePhase("settle");
      handoff.current = poses.map(({ element, transform }) =>
        element.animate([{ transform }, { transform: "none" }], {
          duration: 180,
          easing: "ease-out",
          fill: "both",
        }),
      );
      void Promise.all(
        handoff.current.map((animation) => animation.finished),
      ).then(
        () => {
          if (
            version !== handoffVersion.current ||
            phaseRef.current !== "settle"
          )
            return;
          handoff.current.forEach((animation) => animation.cancel());
          handoff.current = [];
          changePhase("play");
        },
        () => {
          /* Cancellation is expected when motion is disabled. */
        },
      );
    }
  };

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (!motion || preference.matches) {
        pendingGesture.current = false;
        cancelHandoff();
        phaseRef.current = "idle";
        setPhase("idle");
      }
    };
    stop();
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, [motion]);
  useEffect(() => () => cancelHandoff(), []);
  const c = content[lang];

  useEffect(() => {
    // Illustrator already exported each complete limb as a separate sibling.
    // Keep their paths, clipping, colours, order and all non-limb groups intact.
    const parts =
      illustration.current?.querySelector("#Layer_1-2 > g")?.children;
    if (!parts || parts.length !== 9) return; // Fail still if the asset changes.
    const limbs = [
      [2, "pencil", "M106.42,129.4"],
      [3, "nib", "M2.89,228.94"],
      [4, "left-leg", "M85.45,207.6"],
      [5, "right-leg", "M93.11,201.74"],
    ] as const;
    const valid = limbs.every(([index, , prefix]) =>
      parts[index].querySelector("path")?.getAttribute("d")?.startsWith(prefix),
    );
    if (!valid) return;
    limbs.forEach(([index, name]) =>
      parts[index].setAttribute("data-limb", name),
    );
    return () =>
      limbs.forEach(([index]) => parts[index].removeAttribute("data-limb"));
  }, []);

  useStoryline(illustration, storyline, phaseRef, motion);

  return (
    <figure
      className={`character ${motion ? "animated" : ""} character-${phase}`}
    >
      <div className="character-art">
        <svg
          className="character-storyline"
          viewBox="0 0 174.91 319.02"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={storyline}
            className="draw-line"
            d={restingStoryline}
            stroke="#171717"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
        </svg>
        <button
          type="button"
          className="character-illustration"
          ref={illustration}
          aria-label={`${c.characterAction}. ${c.characterAlt}`}
          aria-disabled={!motion}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") requestGesture();
          }}
          onPointerDown={(event) => {
            pointerType.current = event.pointerType;
          }}
          onClick={(event) => {
            // Native button clicks cover Enter, Space and assistive technology.
            // Mouse hover already triggers the gesture; suppress its extra click.
            if (event.detail === 0 || pointerType.current !== "mouse")
              requestGesture();
          }}
          onAnimationEnd={(event) => {
            // The body pop completes the gesture; entrance still waits for its last leg.
            if (
              event.animationName === "right-step" &&
              phaseRef.current === "entrance"
            ) {
              const play = pendingGesture.current;
              pendingGesture.current = false;
              changePhase(play ? "play" : "idle");
            } else if (
              event.animationName === "character-pop" &&
              phaseRef.current === "play"
            ) {
              changePhase("idle");
            }
          }}
          dangerouslySetInnerHTML={{ __html: artwork }}
        />
        <svg
          className="character-doodle"
          viewBox="0 0 174.91 319.02"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M181 54 C188 34 213 32 207 45 C202 54 192 46 200 38" />
          <path d="M218 47 V55 M214 51 H222 M187 27 V33 M184 30 H190" />
        </svg>
      </div>
      <figcaption>
        <span className="tiny-star" aria-hidden="true">
          ✳
        </span>{" "}
        {c.character}
      </figcaption>
    </figure>
  );
}
