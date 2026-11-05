import type { Localized } from "../content";
export type Category =
  "packaging" | "education" | "branding" | "illustration" | "animation";
export type Collection = "selected" | "playground";
export interface ProjectImage {
  src: string;
  alt: Localized;
  caption?: Localized;
}
interface ProjectBase {
  id: string;
  slug: string;
  title: Localized;
  category: Category;
  categoryLabel: Localized;
  collection: Collection;
  order: number;
  treatment:
    | "offset"
    | "frame"
    | "orbit"
    | "underline"
    | "panels"
    | "sequence"
    | "fold"
    | "grid"
    | "ribbon";
  tone: "cobalt" | "ivory" | "ink";
}
export interface StandardProject extends ProjectBase {
  kind: "case-study";
  cover?: ProjectImage;
  concept?: Localized;
  role?: Localized;
  process?: Localized;
  images?: ProjectImage[];
  recognition?: { description: Localized; image: ProjectImage };
}
// Research previews deliberately have no cover, final artwork, mockup or general
// image fields. Only specifically approved early explorations may be rendered.
export interface ResearchProject extends ProjectBase {
  kind: "research-preview";
  researchQuestion?: Localized;
  objectives?: Localized;
  explorations?: (ProjectImage & { approved: true })[];
}
export type Project = StandardProject | ResearchProject;
export const projects: Project[] = [
  {
    id: "01",
    slug: "poms",
    title: { en: "POMS", fr: "POMS" },
    cover: {
      src: "/assets/projects/poms-cover.png",
      alt: {
        en: "POMS apple sparkling drink can with an illustrated red apple character and condensation, on a white background",
        fr: "Canette de boisson pétillante POMS à la pomme, avec un personnage de pomme rouge illustré et des gouttelettes, sur fond blanc",
      },
    },
    recognition: {
      description: {
        en: "First Prize Winner in Morocco — Visual Packaging category, Arab Student StarPack 2024.",
        fr: "Premier prix au Maroc — catégorie « Visual Packaging », Arab Student StarPack 2024.",
      },
      image: {
        src: "/assets/projects/poms-award.png",
        alt: {
          en: "POMS recognition: First Prize Winner in Morocco, Visual Packaging category, Arab Student StarPack 2024",
          fr: "Distinction POMS : premier prix au Maroc, catégorie Visual Packaging, Arab Student StarPack 2024",
        },
      },
    },
    category: "packaging",
    categoryLabel: { en: "Packaging Redesign", fr: "Refonte de packaging" },
    collection: "selected",
    order: 1,
    treatment: "offset",
    tone: "cobalt",
    kind: "case-study",
  },
  {
    id: "02",
    slug: "my-mood-box",
    title: { en: "My Mood Box", fr: "My Mood Box" },
    category: "education",
    categoryLabel: {
      en: "Inclusive Educational Design",
      fr: "Design pédagogique inclusif",
    },
    collection: "selected",
    order: 2,
    treatment: "frame",
    tone: "ivory",
    kind: "research-preview",
  },
  {
    id: "03",
    slug: "artisanat-du-maroc",
    title: { en: "Artisanat du Maroc", fr: "Artisanat du Maroc" },
    category: "branding",
    categoryLabel: {
      en: "Cultural Brand Identity",
      fr: "Identité de marque culturelle",
    },
    collection: "selected",
    order: 3,
    treatment: "orbit",
    tone: "ivory",
    kind: "case-study",
  },
  {
    id: "04",
    slug: "pulsecom",
    title: { en: "PulseCom", fr: "PulseCom" },
    category: "branding",
    categoryLabel: {
      en: "Communication Agency Branding",
      fr: "Identité d’une agence de communication",
    },
    collection: "selected",
    order: 4,
    treatment: "underline",
    tone: "ink",
    kind: "case-study",
  },
  {
    id: "05",
    slug: "the-tale-of-the-lost-princess",
    title: {
      en: "The Tale of the Lost Princess",
      fr: "Le Conte de la Princesse Perdue",
    },
    category: "illustration",
    categoryLabel: {
      en: "Comic Illustration",
      fr: "Illustration de bande dessinée",
    },
    collection: "selected",
    order: 5,
    treatment: "panels",
    tone: "ivory",
    kind: "case-study",
  },
  {
    id: "06",
    slug: "claymation-stop-motion",
    title: {
      en: "Claymation & Stop-Motion",
      fr: "Animation en pâte à modeler & stop motion",
    },
    category: "animation",
    categoryLabel: { en: "Animation", fr: "Animation" },
    collection: "selected",
    order: 6,
    treatment: "sequence",
    tone: "cobalt",
    kind: "case-study",
  },
  {
    id: "07",
    slug: "abla",
    title: { en: "Abla", fr: "Abla" },
    category: "packaging",
    categoryLabel: {
      en: "Pasta Packaging & Illustration",
      fr: "Packaging de pâtes & illustration",
    },
    collection: "playground",
    order: 1,
    treatment: "fold",
    tone: "ivory",
    kind: "case-study",
  },
  {
    id: "08",
    slug: "mood-master",
    title: { en: "Mood Master", fr: "Mood Master" },
    category: "illustration",
    categoryLabel: {
      en: "Illustrated Mood-Tracking Calendar",
      fr: "Calendrier illustré de suivi de l’humeur",
    },
    collection: "playground",
    order: 2,
    treatment: "grid",
    tone: "cobalt",
    kind: "case-study",
  },
  {
    id: "09",
    slug: "rapido",
    title: { en: "Rapido", fr: "Rapido" },
    category: "illustration",
    categoryLabel: {
      en: "Illustrated Advertising Campaign",
      fr: "Campagne publicitaire illustrée",
    },
    collection: "playground",
    order: 3,
    treatment: "ribbon",
    tone: "ivory",
    kind: "case-study",
  },
];
export const collectionProjects = (collection: Collection) =>
  projects
    .filter((p) => p.collection === collection)
    .sort((a, b) => a.order - b.order);
export const orderedProjects = () => [
  ...collectionProjects("selected"),
  ...collectionProjects("playground"),
];
export const projectHref = (project: Project) => `#/projects/${project.slug}`;
export function resolveProjectRoute(
  hash: string,
):
  | { page: "home" }
  | { page: "project"; project: Project }
  | { page: "missing" } {
  if (!hash.startsWith("#/")) return { page: "home" };
  const project = projects.find((p) => hash === projectHref(p));
  return project ? { page: "project", project } : { page: "missing" };
}
// The named prototype stays restricted even if imported data is misclassified.
export function isResearchPreview(
  project: Project,
): project is ResearchProject {
  return project.slug === "my-mood-box" || project.kind === "research-preview";
}
// This allowlist is also applied at render time, even if data is later imported.
export function publicProjectImages(project: Project): ProjectImage[] {
  return isResearchPreview(project)
    ? (project.explorations ?? []).filter((image) => image.approved === true)
    : (project.images ?? []);
}
export function publicProjectCover(project: Project) {
  return isResearchPreview(project)
    ? publicProjectImages(project)[0]
    : project.cover;
}
