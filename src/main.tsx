import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  content,
  projects,
  contactLinks,
  type Lang,
  type Project,
} from "./content";
import { Character } from "./components/Character";
import "./style.css";
const anchors = ["home", "work", "about", "experience", "contact"];
function Artwork({ project, label }: { project: Project; label: string }) {
  return (
    <div className={`artwork ${project.theme}`} aria-hidden="true">
      <span className="art-number">{project.id}</span>
      <svg viewBox="0 0 600 450" fill="none">
        <path
          d={
            project.category === 0
              ? "M-40 310C80 180 134 410 260 280S250 100 190 150S280 360 410 230S550 100 650 160"
              : project.category === 1
                ? "M160 345V110H350C475 110 475 255 350 255H160M350 255L450 345"
                : "M90 320L220 100L350 320L480 100M85 345H500"
          }
          stroke="currentColor"
          strokeWidth={project.category === 1 ? 2 : 3}
        />
        <circle
          cx="420"
          cy="130"
          r="48"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <span className="art-label">{label}</span>
      <span className="art-plus">↗</span>
    </div>
  );
}
function CaseStudy({
  project,
  lang,
  onClose,
}: {
  project: Project;
  lang: Lang;
  onClose: () => void;
}) {
  const d = useRef<HTMLDialogElement>(null);
  const c = content[lang];
  useEffect(() => {
    d.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={d}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === d.current) onClose();
      }}
      aria-labelledby="case-title"
    >
      <div className="case-inner">
        <button className="close" onClick={onClose} aria-label={c.close}>
          ×
        </button>
        <p className="eyebrow">{c.caseNote}</p>
        <h2 id="case-title">
          {project.title?.[lang] || `${c.project} ${project.id}`}
        </h2>
        <p>{c.filters[project.category]}</p>
        <Artwork project={project} label={c.artwork} />
        <div className="case-grid">
          {[
            [c.concept, project.concept?.[lang] || c.conceptPlaceholder],
            [c.role, project.role?.[lang] || c.rolePlaceholder],
            [c.process, project.process?.[lang] || c.processPlaceholder],
            [c.final, c.finalPlaceholder],
          ].map(([title, body]) => (
            <section key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </section>
          ))}
        </div>
        {project.images?.map((im) => (
          <img
            className="case-image"
            key={im.src}
            src={im.src}
            alt={im.alt[lang]}
            loading="lazy"
          />
        ))}
        <button className="text-link" onClick={onClose}>
          {c.close} ↗
        </button>
      </div>
    </dialog>
  );
}
function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [motion, setMotion] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [filter, setFilter] = useState(-1);
  const [selected, setSelected] = useState<Project | null>(null);
  const [active, setActive] = useState("home");
  const c = content[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "en"
        ? "Safae Adel — One Line. Endless Stories."
        : "Safae Adel — Une ligne. Des histoires sans fin.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", c.subtitle + " " + c.about);
  }, [lang, c]);
  useEffect(() => {
    document.documentElement.dataset.motion = String(motion);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setMotion(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, [motion]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            if (e.target.id) setActive(e.target.id);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("main > section, .reveal")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!motion) return;
    let frame = 0;
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        document.documentElement.style.setProperty(
          "--parallax",
          `${Math.min(window.scrollY * 0.06, 60)}px`,
        ),
      );
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      document.documentElement.style.setProperty("--parallax", "0px");
    };
  }, [motion]);
  return (
    <>
      <a className="skip" href="#main">
        {c.skip}
      </a>
      <header>
        <a className="wordmark" href="#home" aria-label="Safae Adel">
          safae adel<span>®</span>
        </a>
        <nav
          aria-label={
            lang === "en" ? "Main navigation" : "Navigation principale"
          }
        >
          {c.nav.map((n, i) => (
            <a
              key={anchors[i]}
              href={`#${anchors[i]}`}
              aria-current={active === anchors[i] ? "location" : undefined}
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="languages" role="group" aria-label={c.language}>
          {(["en", "fr"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              lang={l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-top">
            <p className="eyebrow">{c.eyebrow}</p>
            <span className="edition">PORTFOLIO — 2026</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                {c.title.map((line, i) => (
                  <span key={i} className={i === 1 ? "outline" : ""}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="hero-sub">{c.subtitle}</p>
              <a className="pill" href="#work">
                {c.explore}
                <span>↗</span>
              </a>
            </div>
            <div className="hero-visual">
              <span className="handnote">
                {c.intro}
                <svg viewBox="0 0 90 70" aria-hidden="true">
                  <path d="M10 5Q85 0 55 60M45 48L55 60L68 49" />
                </svg>
              </span>
              <Character lang={lang} motion={motion} />
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#work">
              ↓ <span>{c.scroll}</span>
            </a>
            <span>{c.chapter}</span>
            <button
              className="motion-toggle"
              onClick={() => setMotion(!motion)}
              aria-pressed={motion}
            >
              {c.motion} <span>{motion ? c.on : c.off}</span>
            </button>
          </div>
        </section>
        <section id="work" className="work section">
          <div className="section-top">
            <p className="eyebrow">01 / {c.nav[1]}</p>
            <span>↘</span>
          </div>
          <div className="section-heading">
            <h2>
              {c.work}
              <span className="red-dot">.</span>
            </h2>
            <p>{c.workIntro}</p>
          </div>
          <div className="work-toolbar">
            <p>{c.workNote}</p>
            <div
              className="filters"
              role="group"
              aria-label={
                lang === "en" ? "Filter projects" : "Filtrer les projets"
              }
            >
              {[c.all, ...c.filters].map((f, i) => (
                <button
                  key={f}
                  aria-pressed={filter === i - 1}
                  onClick={() => setFilter(i - 1)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="projects">
            {projects
              .filter((p) => filter === -1 || p.category === filter)
              .map((p) => (
                <button
                  className="project-card"
                  key={p.id}
                  onClick={() => setSelected(p)}
                  aria-label={`${c.open} — ${p.title?.[lang] || `${c.project} ${p.id}`}`}
                >
                  <Artwork project={p} label={c.artwork} />
                  <div className="project-meta">
                    <div>
                      <h3>{p.title?.[lang] || `${c.project} ${p.id}`}</h3>
                      <p>{c.filters[p.category]}</p>
                    </div>
                    <span>{c.soon} ↗</span>
                  </div>
                </button>
              ))}
          </div>
        </section>
        <section id="about" className="about section">
          <p className="eyebrow">02 / {c.aboutLabel}</p>
          <div className="about-grid">
            <div>
              <h2>
                {c.aboutTitle[0]}
                <br />
                <em>{c.aboutTitle[1]}</em>
              </h2>
              <svg
                className="about-line"
                viewBox="0 0 450 220"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M-10 165C80 70 100 240 210 150S130 20 150 100S390 220 440 40"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="440" cy="40" r="7" fill="#E34B37" />
              </svg>
            </div>
            <div className="about-text">
              <p className="lead">{c.about}</p>
              <p>{c.about2}</p>
              <div className="disciplines">
                {c.disciplines.map((d, i) => (
                  <span key={d}>
                    <small>0{i + 1}</small>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="experience" className="section journey">
          <p className="eyebrow">03 / {c.nav[3]}</p>
          <div className="section-heading">
            <h2>
              {c.journey}
              <span className="red-dot">.</span>
            </h2>
            <p>{c.journeyIntro}</p>
          </div>
          <div className="timeline-grid">
            <div>
              <h3 className="timeline-label">{c.professional}</h3>
              {[
                ["2025–2026", "Orange Creative", c.experienceNote],
                ["2025", "MADP", c.experienceNote],
                [c.otherDate, c.other, c.experienceNote],
              ].map(([date, name, detail]) => (
                <article className="timeline-entry" key={name}>
                  <span>{date}</span>
                  <div>
                    <h4>{name}</h4>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <div>
              <h3 className="timeline-label">{c.education}</h3>
              {[
                [c.present, "Université Ibn Tofaïl", c.phd],
                [c.completed, "Art’Com Sup Rabat", c.master],
              ].map(([date, name, detail]) => (
                <article className="timeline-entry" key={name}>
                  <span>{date}</span>
                  <div>
                    <h4>{name}</h4>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact section">
          <p className="eyebrow">04 / {c.contactLabel}</p>
          <h2>
            {c.contact[0]}
            <br />
            <em>{c.contact[1]}</em>
            <span className="contact-star">✳</span>
          </h2>
          <p>{c.contactIntro}</p>
          <div className="contact-links">
            {[
              ["Email", contactLinks.email],
              ["LinkedIn", contactLinks.linkedin],
              ["Behance", contactLinks.behance],
              [c.cv, contactLinks.cv],
            ].map(([label, url], i) =>
              url ? (
                <a
                  key={label}
                  href={i === 0 ? `mailto:${url}` : url}
                  download={i === 3 || undefined}
                >
                  {label} ↗
                </a>
              ) : (
                <span key={label} className="unavailable">
                  {label}
                  <small>{i === 3 ? c.cvMissing : c.missing}</small>
                </span>
              ),
            )}
          </div>
          <footer>
            <span>{c.rights}</span>
            <span>{c.footer}</span>
            <a href="#home">{c.back} ↑</a>
          </footer>
        </section>
      </main>
      {selected && (
        <CaseStudy
          project={selected}
          lang={lang}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
