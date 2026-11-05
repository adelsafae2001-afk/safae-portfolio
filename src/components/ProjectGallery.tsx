import { useState } from "react";
import type { Lang } from "../content";
import { galleryContent } from "../galleryContent";
import {
  collectionProjects,
  projectHref,
  publicProjectCover,
  isResearchPreview,
  type Category,
  type Collection,
  type Project,
} from "../data/projects";

export function ProjectPreview({
  project,
  lang,
  priority = false,
}: {
  project: Project;
  lang: Lang;
  priority?: boolean;
}) {
  const c = galleryContent[lang];
  const image = publicProjectCover(project);
  return (
    <div
      className={`gallery-preview treatment-${project.treatment} tone-${project.tone}`}
    >
      {image ? (
        <img
          src={image.src}
          alt={image.alt[lang]}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <>
          <span className="preview-frame" aria-hidden="true" />
          <span className="preview-placeholder">
            {c.imagePlaceholder}
            <small>{c.imageNote}</small>
          </span>
        </>
      )}
      <span className="preview-arrow" aria-hidden="true">
        ↗
      </span>
    </div>
  );
}
export function ProjectGallery({
  lang,
  collection,
}: {
  lang: Lang;
  collection: Collection;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const c = galleryContent[lang];
  const selected = collection === "selected";
  const list = collectionProjects(collection);
  const categories = [...new Set(list.map((p) => p.category))];
  return (
    <section
      id={selected ? "work" : "playground"}
      className={`portfolio-gallery section ${selected ? "work" : "playground"}`}
      aria-labelledby={`${collection}-title`}
    >
      <div className="section-top">
        <p className="eyebrow">{selected ? c.selected : c.playground}</p>
        <span aria-hidden="true">↘</span>
      </div>
      <div className="section-heading">
        <h2 id={`${collection}-title`} tabIndex={-1}>
          {selected ? c.selected : c.playground}
          <span className="red-dot">.</span>
        </h2>
        <p>{selected ? c.selectedIntro : c.playgroundIntro}</p>
      </div>
      <div className="work-toolbar">
        <p>{selected ? c.selectedNote : c.playgroundNote}</p>
        {selected && (
          <div className="filters" role="group" aria-label={c.filter}>
            {(["all", ...categories] as const).map((category) => (
              <button
                key={category}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category === "all" ? c.all : c.categories[category]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        className={`gallery-grid ${selected ? "selected-grid" : "playground-grid"}`}
      >
        {list
          .filter((p) => filter === "all" || p.category === filter)
          .map((p) => (
            <a
              className={`gallery-card card-${p.treatment}`}
              href={projectHref(p)}
              key={p.id}
              aria-label={`${c.view} — ${p.title[lang]}`}
            >
              <ProjectPreview project={p} lang={lang} />
              <div className="gallery-card-meta">
                <div>
                  <h3>{p.title[lang]}</h3>
                  <p>{p.categoryLabel[lang]}</p>
                  {isResearchPreview(p) && (
                    <span className="research-badge">{c.researchBadge}</span>
                  )}
                </div>
                <span className="gallery-card-action" aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          ))}
      </div>
      {selected && (
        <a href="#playground" className="gallery-bridge" aria-label={c.jump}>
          <svg viewBox="0 0 500 120" fill="none" aria-hidden="true">
            <path
              d="M20 10C100 5 90 110 190 75S270 20 320 65S400 110 475 90"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M466 82L475 90L464 96" stroke="currentColor" />
          </svg>
          <span>{c.continue} ↓</span>
        </a>
      )}
    </section>
  );
}
