import { useState } from "react";
import { characterAssets, content, type Lang } from "../content";
export function Character({ lang, motion }: { lang: Lang; motion: boolean }) {
  const [expression, setExpression] = useState<"main" | "curious" | "playful">(
    "main",
  );
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const c = content[lang];
  const src = characterAssets[expression] || characterAssets.main;
  return (
    <figure
      className={`character ${motion ? "animated" : ""}`}
      onPointerMove={(e) => {
        if (!motion) return;
        const r = e.currentTarget.getBoundingClientRect();
        setEye({
          x: (e.clientX - r.left - r.width / 2) / 40,
          y: (e.clientY - r.top - r.height / 2) / 40,
        });
      }}
      onPointerEnter={() => motion && setExpression("curious")}
      onPointerLeave={() => {
        setExpression("main");
        setEye({ x: 0, y: 0 });
      }}
      onClick={() =>
        motion && setExpression(expression === "playful" ? "main" : "playful")
      }
    >
      <div className="character-art" role="img" aria-label={c.characterAlt}>
        {src ? (
          <>
            <img src={src} alt="" />
            {characterAssets.eyes && (
              <svg className="eyes" viewBox="0 0 500 500" aria-hidden="true">
                <g style={{ transform: `translate(${eye.x}px,${eye.y}px)` }}>
                  <ellipse cx="240" cy="200" rx="2" ry="5" />
                  <ellipse cx="260" cy="200" rx="2" ry="5" />
                </g>
              </svg>
            )}
          </>
        ) : (
          <svg viewBox="0 0 500 500" fill="none" aria-hidden="true">
            <path
              className="draw-line"
              d="M-30 360 C30 350 55 420 120 395 C190 365 140 260 220 268 C295 276 205 410 300 385 C405 357 285 229 280 166 C274 80 390 68 408 145 C429 236 281 242 244 184 C200 115 290 43 345 88 C380 118 355 175 310 162 C255 146 330 115 354 196 C375 274 403 329 511 275"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <circle cx="125" cy="395" r="5" fill="#E34B37" stroke="none" />
          </svg>
        )}
      </div>
      <figcaption>
        <span className="tiny-star">✳</span> {c.placeholder}
        <small>{c.character}</small>
      </figcaption>
    </figure>
  );
}
