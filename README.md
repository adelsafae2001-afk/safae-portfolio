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

Place transparent SVG or WebP files in `public/assets/character/`. Set `characterAssets.main`, `.curious`, `.playful`, and `.motif` to their asset paths. No generic character has been substituted: the initial abstract line reserves the space for Safae’s drawing. Hover selects the curious asset; tapping/clicking selects playful. The component falls back to the main artwork if a variant is absent. Optional eye overlay is enabled with `eyes: true`; adapt its coordinates in `src/components/Character.tsx` to the supplied face. That overlay supports blinking and pointer tracking. A motif asset slot is prepared; integrate it with the narrative SVG when delivered. Expression changes convey no essential information, so the figure stays outside keyboard tab order. The visible motion control and OS reduced-motion preference disable reactions and movement.

### Contact and CV

Set `contactLinks.email` to an email address, and `linkedin`/`behance` to verified full HTTPS URLs. Put the supplied PDF under `public/assets/` and set `cv` to its path. Until supplied, these appear as clearly unavailable text rather than fake links. Never add a residential address, age or personal phone number.

### Experience

The timeline is in `src/main.tsx`; all display strings are in `src/content.ts`. Confirm roles at Orange Creative and MADP, dates/details for other experiences, and add only verified information. Confirm the wording of degrees and doctoral research before publication.

## Review before merging

Work is isolated on `feat/one-line-portfolio`. Review with `git diff main...feat/one-line-portfolio` (use the actual default branch if different). Run the build and inspect both languages, filters, each project dialog, Escape to close, keyboard navigation, mobile layout and reduced motion. Push the feature branch and open a pull request when ready; merge only after review. No deployment configuration or publishing action is included.

## Still needed

- Main original character, curious/playful expressions and flowing-line motif.
- Six real project titles, categories, briefs, roles, process documentation, covers, final artwork and alt text, in English and French.
- Verified professional details for timeline entries.
- Email, LinkedIn, Behance and downloadable CV PDF.

## Implementation

Reusable character, artwork and dialog components; native modal focus management; semantic landmarks; visible focus; touch-friendly controls; reduced motion; scroll reveals and subtle hero parallax. The palette is ivory `#F6F4F0`, ink `#171717`, cobalt `#1646B7` and sparing vermilion `#E34B37`. Layout graphics are inline SVG, and no image-generation service was used.
