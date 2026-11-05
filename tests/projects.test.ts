import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  collectionProjects,
  isResearchPreview,
  orderedProjects,
  projects,
  projectHref,
  publicProjectCover,
  publicProjectImages,
  resolveProjectRoute,
  type Project,
} from "../src/data/projects.ts";

test("nine named projects stay in their requested collections and order", () => {
  assert.deepEqual(
    collectionProjects("selected").map((p) => p.slug),
    [
      "poms",
      "my-mood-box",
      "artisanat-du-maroc",
      "pulsecom",
      "the-tale-of-the-lost-princess",
      "claymation-stop-motion",
    ],
  );
  assert.deepEqual(
    collectionProjects("playground").map((p) => p.slug),
    ["abla", "mood-master", "rapido"],
  );
  assert.equal(orderedProjects().length, 9);
  assert.equal(new Set(projects.map((p) => p.slug)).size, 9);
  assert.equal(new Set(projects.map((p) => p.id)).size, 9);
});
test("every project has English/French names and category labels", () => {
  for (const project of projects)
    for (const lang of ["en", "fr"] as const) {
      assert.ok(project.title[lang].trim());
      assert.ok(project.categoryLabel[lang].trim());
    }
});
test("all nine routes resolve and invalid project routes show a missing page", () => {
  for (const project of projects)
    assert.deepEqual(resolveProjectRoute(projectHref(project)), {
      page: "project",
      project,
    });
  assert.deepEqual(resolveProjectRoute("#work"), { page: "home" });
  assert.deepEqual(resolveProjectRoute("#playground"), { page: "home" });
  assert.deepEqual(resolveProjectRoute("#/projects/unknown"), {
    page: "missing",
  });
});
test("missing imagery falls back without manufactured image URLs", () => {
  const standard = {
    ...projects.find((p) => p.kind === "case-study")!,
    cover: undefined,
    images: undefined,
  } as Project;
  const research = {
    ...projects.find((p) => p.kind === "research-preview")!,
    explorations: undefined,
  } as Project;
  for (const project of [standard, research]) {
    assert.equal(publicProjectCover(project), undefined);
    assert.deepEqual(publicProjectImages(project), []);
  }
});

test("My Mood Box ignores general cover/final imagery even if imported data is misclassified", () => {
  const original = projects.find((p) => p.slug === "my-mood-box")!;
  const image = (src: string) => ({
    src,
    alt: { en: "Test image", fr: "Image de test" },
  });
  const imported = {
    ...original,
    kind: "case-study",
    cover: image("/private-cover.webp"),
    images: [image("/private-final.webp")],
    explorations: [
      { ...image("/approved-exploration.webp"), approved: true },
      { ...image("/unapproved-exploration.webp"), approved: false },
      image("/missing-approval.webp"),
    ],
  } as unknown as Project;
  assert.ok(isResearchPreview(imported));
  assert.deepEqual(
    publicProjectImages(imported).map((im) => im.src),
    ["/approved-exploration.webp"],
  );
  assert.equal(publicProjectCover(imported)?.src, "/approved-exploration.webp");
});
test("an unreleased prototype without explicit approvals renders no images", () => {
  const original = projects.find((p) => p.slug === "my-mood-box")!;
  const imported = {
    ...original,
    images: [{ src: "/not-approved.webp" }],
    explorations: [{ src: "/unapproved.webp", approved: false }],
  } as unknown as Project;
  assert.equal(publicProjectCover(imported), undefined);
  assert.deepEqual(publicProjectImages(imported), []);
});

test("the completed comic uses the five unchanged original pages in reading order", () => {
  const comic = projects.find(
    (project) => project.slug === "the-tale-of-the-lost-princess",
  )!;
  assert.ok(comic.kind === "case-study");
  assert.equal(comic.presentation, "comic");
  assert.equal(comic.completed, true);
  const pages = publicProjectImages(comic);
  assert.equal(pages.length, 5);
  assert.equal(publicProjectCover(comic), pages[0]);
  pages.forEach((image, index) => {
    assert.equal(image.src, `/assets/projects/Artboard ${index + 1}.png`);
    const bytes = readFileSync(
      new URL(`../public${image.src}`, import.meta.url),
    );
    assert.equal(bytes.readUInt32BE(16), image.width);
    assert.equal(bytes.readUInt32BE(20), image.height);
    assert.ok(image.alt.en && image.alt.fr);
  });
});
