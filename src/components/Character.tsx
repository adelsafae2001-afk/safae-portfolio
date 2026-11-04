import { useEffect, useRef } from "react";
import originalCharacter from "../../public/Asset 2.svg?raw";
import { content, type Lang } from "../content";

// Use the uploaded SVG verbatim. Only the XML prolog is omitted for inline HTML.
const artwork = originalCharacter.replace(/<\?xml[^?]*\?>\s*/, "");

export function Character({ lang, motion }: { lang: Lang; motion: boolean }) {
  const illustration = useRef<HTMLDivElement>(null);
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

  return (
    <figure className={`character ${motion ? "animated" : ""}`}>
      <div className="character-art" role="img" aria-label={c.characterAlt}>
        <svg
          className="character-storyline"
          viewBox="0 0 174.91 319.02"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="draw-line"
            d="M174.2 72.6 C218 48 222 173 202 224 C181 278 130 285 91 268 C40 245 0 254 -66 299"
            stroke="#171717"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
        </svg>
        <div
          className="character-illustration"
          ref={illustration}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: artwork }}
        />
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
