import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { content, contactLinks, type Lang } from "./content";
import { Character } from "./components/Character";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectCaseStudy } from "./components/ProjectCaseStudy";
import { resolveProjectRoute } from "./data/projects";
import "./style.css";
import "./gallery.css";
const anchors = ["home", "work", "about", "experience", "contact"];
function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [motion, setMotion] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hash, setHash] = useState(() => window.location.hash);
  const route = resolveProjectRoute(hash);
  const project = route.page === "project" ? route.project : undefined;
  const previousProject = useRef<{
    slug: string;
    collection: "selected" | "playground";
  } | null>(null);
  useEffect(() => {
    if (project) {
      previousProject.current = {
        slug: project.slug,
        collection: project.collection,
      };
      return;
    }
    if (
      route.page === "home" &&
      previousProject.current &&
      (hash === "" || hash === "#work" || hash === "#playground")
    ) {
      const target =
        document.querySelector<HTMLAnchorElement>(
          `a[href="#/projects/${previousProject.current.slug}"]`,
        ) ??
        document.getElementById(`${previousProject.current.collection}-title`);
      target?.focus({ preventScroll: true });
      if (hash === "") target?.scrollIntoView({ block: "center" });
      previousProject.current = null;
    }
  }, [project, route.page, hash]);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (route.page !== "home" || !hash.startsWith("#")) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, route.page]);
  const [active, setActive] = useState("home");
  const c = content[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "en"
        ? "Safae Adel — One Line. Endless Stories."
        : "Safae Adel — Une ligne. Des histoires sans fin.";
    if (project) document.title = `${project.title[lang]} — Safae Adel`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        project
          ? `${project.title[lang]} — ${project.categoryLabel[lang]}`
          : c.subtitle + " " + c.about,
      );
  }, [lang, c, project]);
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
  return (
    <>
      <a
        className="skip"
        href={route.page === "home" ? "#main" : "#case-main"}
        onClick={(event) => {
          event.preventDefault();
          document
            .getElementById(route.page === "home" ? "main" : "case-main")
            ?.focus();
        }}
      >
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
              aria-current={
                route.page === "home" && active === anchors[i]
                  ? "location"
                  : undefined
              }
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
      <main id="main" tabIndex={-1} hidden={route.page !== "home"}>
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
        <ProjectGallery lang={lang} collection="selected" />
        <ProjectGallery lang={lang} collection="playground" />
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
      {route.page !== "home" && (
        <ProjectCaseStudy
          project={project}
          lang={lang}
          motion={motion}
          onMotion={() => setMotion(!motion)}
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
