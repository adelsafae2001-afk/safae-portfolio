# One Line. Endless Stories.

Safae Adel’s bilingual portfolio, built with React, TypeScript and Vite. This is a local review version; nothing has been published.

## Run and preview

Requires Node.js 20.19+ (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. For production verification:

```sh
npm run build
npm run preview
```

The build is in `dist/`. Preview at desktop, tablet and mobile widths. External Google Fonts are optional; system fallbacks keep the site usable offline.

## Content editing

`src/content.ts` contains the original English/French site dictionary and contact links. `src/galleryContent.ts` contains bilingual gallery and case-study interface text; `src/data/projects.ts` contains the nine project records. Default language is English. The navigation switch translates the entire interface, case studies and accessibility labels. Keep both language values in sync when editing. No client names, job titles or achievements have been invented.

### Projects

Edit `projects` in `src/data/projects.ts`. Each record has a stable `id` and `slug`, bilingual `title` and `categoryLabel`, a filter category, `collection` (`selected` or `playground`), numeric `order`, and a decorative card `treatment`/`tone`. These nine records use only supplied project names/categories. All frames are clearly labelled neutral placeholders, not claimed project artwork. Project IDs remain internal data keys only; cards, placeholders and case-study pages display no project numbering.

Standard projects use `kind: 'case-study'`. Add bilingual `concept`, `role`, and `process` fields only when supplied. Add `cover` and `images` with `{ src: '/assets/projects/example.webp', alt: { en: 'Describe the image', fr: 'Décrire l’image' }, caption: { en: 'Optional caption', fr: 'Légende facultative' } }`. Put optimized, approved artwork in `public/assets/projects/`. Images are displayed without cropping; cards load lazily. Never put confidential files anywhere in `public/` because Vite copies that entire directory to the build.

My Mood Box is `kind: 'research-preview'`. Its reusable public layout contains only the research question, objectives and approved early explorations. The schema deliberately has no general cover, process or final-artwork fields for research previews. Set `researchQuestion` and `objectives` to supplied bilingual copy. Only approved early-exploration images may be added to `explorations`, and each must have `approved: true` after explicit content review. Both thumbnail and page rendering use the same allowlist; My Mood Box’s stable slug also enforces this restriction even if imported data is misclassified. Do not upload final prototype imagery or physical-component/assembly images to the public folder at all. No prototype imagery is included in this version.

### Project routes and review

Each card opens its own accessible page at `#/projects/<slug>`, for example `/#/projects/poms` and `/#/projects/my-mood-box`. Hash routing works with Vite, Codespaces and static hosting without rewrite rules. Direct links and refreshes work; browser Back/Forward and the page’s return/previous/next links navigate between projects. The EN/FR switch stays available and keeps the current project open. Unknown project links show a bilingual missing-project view. A shared case-study layout lives in `src/components/ProjectCaseStudy.tsx`; gallery/card components are in `src/components/ProjectGallery.tsx`, with scoped styles in `src/gallery.css`.

The homepage stays mounted while a project page is open, preserving mascot state. Its original SVG, animation code, line-tracking hook and original stylesheet have not been changed for this gallery update. Returning to the gallery restores keyboard focus to the relevant card.

Run `npm test` (Node 22.18+ recommended) for project ordering, bilingual metadata, route resolution, neutral imagery and research-image allowlist checks. Run `npm run build` for TypeScript and production verification. Manually review both collections at desktop/tablet/mobile widths, filter buttons, keyboard focus, reduced motion, direct project URLs, Back/Forward, and My Mood Box’s research-only page in both languages.

### Original character

The final illustration is `public/Asset 2.svg`, used directly by `src/components/Character.tsx` through Vite’s raw import. The uploaded SVG file remains byte-for-byte unchanged. There are no alternative expressions, eye overlays or pointer-tracking facial effects.

Inspection found nine sibling groups inside `#Layer_1-2 > g`: neck, head/hair/face, pencil arm, pen-nib arm, left leg, right leg, lower clothing, flowing clothing, and torso. The component adds `data-limb` attributes only to the four existing limb groups after validating their path prefixes. It never splits, redraws, recolours or reorders paths. Clipping paths stay attached to their original artwork. If the expected structure changes, animation fails safely to a still illustration.

The existing entrance step (opposing leg rotations of ±2° over 1.8 seconds) and storyline drawing are preserved. After entrance, a subtle idle loop floats her up to 4px, sketches with the pencil arm, occasionally sways the pen-nib arm, and balances her legs with very small alternating rotations. The loops use different smooth periods (3.7–7.4 seconds), all starting and ending at neutral. Hover, tap or keyboard activation plays a single 1.05-second sequence: anticipation at 94% uniform scale, a pop to 108% with a 12px upward jump, an enthusiastic pencil swing (up to −12°/+8°), pen-nib wave (+10°/−7°), opposing leg kicks (±10°), and a spring-like settling sequence back to the original pose. A separate, decorative curved doodle and two small sparkles draw near the pencil tip and fade away during the jump. Nothing is added to the original SVG file.

Only the rendered illustration SVG scales and translates, so the button’s hit area stays stationary and cursor movement does not retrigger it during the jump. Overflow remains visible. The doodle is a separate, hidden-from-assistive-technology SVG and never intercepts pointer input. All gesture animations share one CSS duration; completion is signalled by the overall pop animation rather than a limb.

The illustration is a native button, preserving its dimensions and placement. Tap it on touchscreens, or focus it with Tab and press Enter/Space. Its action label is translated in EN/FR, and a pointer cursor indicates interactivity. Pointer entry triggers once; moving inside never restarts the gesture. Leaving and re-entering can play it again once it finishes. Activations during a gesture are ignored; an activation during entrance is queued until the entrance step finishes. An idle activation samples the current pose and uses a brief 180ms Web Animations handoff to neutral before the unchanged 1.05-second pop. Idle CSS transforms are removed during this handoff and playback, preventing competing transforms. After the pop lands at neutral, idle restarts smoothly at its neutral first frame. Handoff animations are cancelled on Motion Off, reduced motion, or unmount. Idle and character gestures remain CSS animations; no additional animation library is used. Mouse clicks do not double-trigger the hover gesture.

Only complete limb groups rotate independently; whole-character scaling is uniform and the head, torso and facial features have no independent animation. There is no stretching or morphing. The existing storytelling line is now driven by `src/components/useStoryline.ts`. A single animation-frame loop maps the pencil group’s `getScreenCTM()` through the inverse line SVG screen matrix. This includes body scale/translation, arm rotation, responsive sizing, scroll and the 180ms handoff, so the line’s start stays just inside the original graphite tip. Only the existing path’s `d` attribute changes; its thin ink colour, tail anchor and overall curve are preserved. Light damped tension and a sub-unit idle flow flex its control points. A small travelling ripple reads the approved pop’s actual CSS animation progress, then fades on landing. The loop does no React state updates and suspends when offscreen or in a hidden tab. Motion Off/reduced motion cancels it and restores a stable connected resting path. The original character SVG and all character keyframes remain unchanged. Both Motion Off and the operating system’s reduced-motion preference disable animation and clear queued gestures, including when changed during playback. Turning motion back on resumes the gentle idle loop.

To adjust placement, edit the character-specific CSS, not the SVG paths or colours. The SVG is imported inline so its original limb groups can be addressed without a library. Its XML prolog alone is omitted for HTML embedding. Treat this as trusted, repository-owned artwork; do not inject untrusted remote SVG markup.

### Contact and CV

Set `contactLinks.email` to an email address, and `linkedin`/`behance` to verified full HTTPS URLs. Put the supplied PDF under `public/assets/` and set `cv` to its path. Until supplied, these appear as clearly unavailable text rather than fake links. Never add a residential address, age or personal phone number.

### Experience

The timeline is in `src/main.tsx`; all display strings are in `src/content.ts`. Confirm roles at Orange Creative and MADP, dates/details for other experiences, and add only verified information. Confirm the wording of degrees and doctoral research before publication.

## Preview in GitHub Codespaces

Open a Codespace on `feat/one-line-portfolio`. If you already have one, stop its running server with Ctrl+C, then run in its terminal:

```sh
git switch feat/one-line-portfolio
git pull --ff-only origin feat/one-line-portfolio
npm ci
npm run dev
```

Click **Open in Browser**, or open the **Ports** tab and click the globe beside **5173**. Keep port visibility **Private**. Check desktop and narrow/mobile widths, EN/FR, mouse hover, tap, Tab then Enter/Space, and the Motion toggle. With motion off, the exact original pose should remain visible. This is a development preview, not a deployment.

## Review before merging

Work is isolated on `feat/one-line-portfolio`. Review with `git diff main...feat/one-line-portfolio` (use the actual default branch if different). Run the build and inspect both languages, filters, each project page, Back/Forward, keyboard navigation, mobile layout and reduced motion. Push the feature branch and open a pull request when ready; merge only after review. No deployment configuration or publishing action is included.

## Still needed

- Optional original flowing-line motif (the final character is integrated; no alternative expressions are needed).
- Approved imagery and bilingual case-study briefs, roles, process documentation and captions for the nine named projects. My Mood Box needs only its research question, objectives and approved early explorations.
- Verified professional details for timeline entries.
- Email, LinkedIn, Behance and downloadable CV PDF.

## Implementation

Reusable character, gallery, card and project-page components; route focus management; semantic landmarks; visible focus; touch-friendly controls; reduced motion; scroll reveals and subtle limb-only character animation. The palette is ivory `#F6F4F0`, ink `#171717`, cobalt `#1646B7` and sparing vermilion `#E34B37`. Layout graphics are inline SVG, and no image-generation service was used.
