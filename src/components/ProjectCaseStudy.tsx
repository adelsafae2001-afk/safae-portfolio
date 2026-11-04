import { useEffect, useRef } from "react";
import { content, type Lang } from "../content";
import { galleryContent } from "../galleryContent";
import {
  orderedProjects,
  projectHref,
  publicProjectImages,
  isResearchPreview,
  type Project,
} from "../data/projects";
import { ProjectPreview } from "./ProjectGallery";

export function ProjectCaseStudy({
  project,
  lang,
  motion,
  onMotion,
}: {
  project?: Project;
  lang: Lang;
  motion: boolean;
  onMotion: () => void;
}) {
  const c = galleryContent[lang];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [project?.slug]);
  const all = orderedProjects();
  const index = project ? all.findIndex((p) => p.slug === project.slug) : -1;
  const previous = index > 0 ? all[index - 1] : undefined;
  const next =
    index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;
  const images = project ? publicProjectImages(project) : [];
  const back = project?.collection === "playground" ? "#playground" : "#work";
  return (
    <main id="case-main" className="case-page" tabIndex={-1}>
      <div className="case-toolbar">
        <a className="text-link" href={back}>
          ← {c.back}
        </a>
        <button
          className="motion-toggle"
          aria-pressed={motion}
          onClick={onMotion}
        >
          {content[lang].motion}{" "}
          <span>{motion ? content[lang].on : content[lang].off}</span>
        </button>
      </div>
      <article>
        <p className="eyebrow">
          {project
            ? `${project.id} / ${isResearchPreview(project) ? c.researchNote : c.caseNote}`
            : "404"}
        </p>
        <h1 className="case-page-title" ref={heading} tabIndex={-1}>
          {project?.title[lang] ?? c.notFound}
        </h1>
        <p className="case-category">
          {project?.categoryLabel[lang] ?? c.notFoundText}
        </p>
        {project && (
          <>
            {isResearchPreview(project) ? (
              <>
                <p className="research-scope">{c.researchScope}</p>
                <div className="case-sections">
                  <section>
                    <h2>{c.question}</h2>
                    <p>
                      {project.researchQuestion?.[lang] ??
                        c.questionPlaceholder}
                    </p>
                  </section>
                  <section>
                    <h2>{c.objectives}</h2>
                    <p>
                      {project.objectives?.[lang] ?? c.objectivesPlaceholder}
                    </p>
                  </section>
                </div>
                <section className="case-artworks">
                  <h2>{c.explorations}</h2>
                  {images.length === 0 && (
                    <div className="research-empty">
                      <p>{c.explorationsPlaceholder}</p>
                      <span>{c.imagePlaceholder}</span>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <>
                <ProjectPreview project={project} lang={lang} priority />
                <div className="case-sections">
                  {[
                    [
                      c.concept,
                      project.concept?.[lang] ?? c.conceptPlaceholder,
                    ],
                    [c.role, project.role?.[lang] ?? c.rolePlaceholder],
                    [
                      c.process,
                      project.process?.[lang] ?? c.processPlaceholder,
                    ],
                  ].map(([title, text]) => (
                    <section key={title}>
                      <h2>{title}</h2>
                      <p>{text}</p>
                    </section>
                  ))}
                </div>
                <section className="case-artworks">
                  <h2>{c.final}</h2>
                  {images.length === 0 && <p>{c.finalPlaceholder}</p>}
                </section>
              </>
            )}
            {images.map((image) => (
              <figure className="case-artwork" key={image.src}>
                <img
                  src={image.src}
                  alt={image.alt[lang]}
                  loading="lazy"
                  decoding="async"
                />
                {image.caption && (
                  <figcaption>{image.caption[lang]}</figcaption>
                )}
              </figure>
            ))}
          </>
        )}
      </article>
      {project && (
        <nav className="case-pagination" aria-label={c.projectNavigation}>
          {previous ? (
            <a href={projectHref(previous)}>
              <small>← {c.previous}</small>
              {previous.title[lang]}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={projectHref(next)}>
              <small>{c.next} →</small>
              {next.title[lang]}
            </a>
          )}
        </nav>
      )}
      <a className="text-link" href={back}>
        ← {c.back}
      </a>
    </main>
  );
}
