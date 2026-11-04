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

`src/content.ts` contains the English/French dictionaries, six placeholder projects, character configuration and contact links. Default language is English. The navigation switch translates the entire interface, case studies and accessibility labels. Keep both language values in sync when editing. No client names, job titles or achievements have been invented.

### Projects

Edit `projects` in `src/content.ts`. Each item has a unique ID, category index (0 illustration, 1 branding, 2 graphic design) and a visual theme. Add bilingual `title`, `concept`, `role`, and `process` fields, e.g. `title: { en: 'Real title', fr: 'Titre réel' }`. Add images as `images: [{ src: '/assets/projects/example.webp', alt: { en: 'Describe the image', fr: 'Décrire l’image' } }]`. Put optimized artwork in `public/assets/projects/`. The case-study dialog automatically displays the real text and images. Replace the abstract thumbnail in `Artwork` in `src/main.tsx` with a supplied cover when ready. Current numbered visuals are layout placeholders, not claimed portfolio work.

### Original character

The final illustration is `public/Asset 2.svg`, used directly by `src/components/Character.tsx` through Vite’s raw import. The uploaded SVG file remains byte-for-byte unchanged. There are no alternative expressions, eye overlays or pointer-tracking facial effects.

Inspection found nine sibling groups inside `#Layer_1-2 > g`: neck, head/hair/face, pencil arm, pen-nib arm, left leg, right leg, lower clothing, flowing clothing, and torso. The component adds `data-limb` attributes only to the four existing limb groups after validating their path prefixes. It never splits, redraws, recolours or reorders paths. Clipping paths stay attached to their original artwork. If the expected structure changes, animation fails safely to a still illustration.

The existing entrance step (opposing leg rotations of ±2° over 1.8 seconds) and storyline drawing are preserved. After entrance, the character rests in her original pose. Hovering the character with a mouse triggers one 1.4-second gesture: a small pencil-arm drawing/wave (−3° to +2°), a gentle pen-nib wave (+3° to −2°), and tiny opposing leg kicks (up to ±3°). Every limb smoothly finishes at 0°. The old continuous arm loops are replaced by this deliberate interaction.

The illustration is a native button, preserving its dimensions and placement. Tap it on touchscreens, or focus it with Tab and press Enter/Space. Its action label is translated in EN/FR, and a pointer cursor indicates interactivity. Pointer entry triggers once; moving inside never restarts the gesture. Leaving and re-entering can play it again once it finishes. Activations during a gesture are ignored; an activation during entrance is queued until the entrance step finishes. Mouse clicks do not double-trigger the hover gesture.

Only complete limb groups rotate; no scaling, stretching, morphing or head/torso movement is applied. The separate decorative line still meets the pencil tip at its resting position. Both Motion Off and the operating system’s reduced-motion preference disable animation and clear queued gestures, including when changed during playback. Turning motion back on leaves the character still until the next interaction.

To adjust placement, edit the character-specific CSS, not the SVG paths or colours. The SVG is imported inline so its original limb groups can be addressed without a library. Its XML prolog alone is omitted for HTML embedding. Treat this as trusted, repository-owned artwork; do not inject untrusted remote SVG markup.

### Contact and CV

Set `contactLinks.email` to an email address, and `linkedin`/`behance` to verified full HTTPS URLs. Put the supplied PDF under `public/assets/` and set `cv` to its path. Until supplied, these appear as clearly unavailable text rather than fake links. Never add a residential address, age or personal phone number.

### Experience

The timeline is in `src/main.tsx`; all display strings are in `src/content.ts`. Confirm roles at Orange Creative and MADP, dates/details for other experiences, and add only verified information. Confirm the wording of degrees and doctoral research before publication.

## Preview the character in GitHub Codespaces

Open a Codespace on `feat/one-line-portfolio`. If you already have one, stop its running server with Ctrl+C, then run in its terminal:

```sh
git switch feat/one-line-portfolio
git pull --ff-only origin feat/one-line-portfolio
npm ci
npm run dev
```

Click **Open in Browser**, or open the **Ports** tab and click the globe beside **5173**. Keep port visibility **Private**. Check desktop and narrow/mobile widths, EN/FR, mouse hover, tap, Tab then Enter/Space, and the Motion toggle. With motion off, the exact original pose should remain visible. This is a development preview, not a deployment.

## Review before merging

Work is isolated on `feat/one-line-portfolio`. Review with `git diff main...feat/one-line-portfolio` (use the actual default branch if different). Run the build and inspect both languages, filters, each project dialog, Escape to close, keyboard navigation, mobile layout and reduced motion. Push the feature branch and open a pull request when ready; merge only after review. No deployment configuration or publishing action is included.

## Still needed

- Optional original flowing-line motif (the final character is integrated; no alternative expressions are needed).
- Six real project titles, categories, briefs, roles, process documentation, covers, final artwork and alt text, in English and French.
- Verified professional details for timeline entries.
- Email, LinkedIn, Behance and downloadable CV PDF.

## Implementation

Reusable character, artwork and dialog components; native modal focus management; semantic landmarks; visible focus; touch-friendly controls; reduced motion; scroll reveals and subtle limb-only character animation. The palette is ivory `#F6F4F0`, ink `#171717`, cobalt `#1646B7` and sparing vermilion `#E34B37`. Layout graphics are inline SVG, and no image-generation service was used.
