# Todo — Portfolio v1

Single-page static portfolio showcasing five disciplines: Product Manager, UI/UX Developer, Software Engineer, Security Engineer, Growth Marketer. Local-only (file:// or VS Code Live Server). No build step, no framework.

## 2026-10-12 · Redesign parked on its branch, work resumes on `main`

The owner asked to commit everything and start again from `main`. The redesign (Option A in `index.html` / `styles.css` / `script.js`, Option B as `editorial.*`, the three website-build clips and posters) is committed and pushed to `redesign/control-room`, NOT merged. The Plan items in the entry below are still unticked because none of them was verified here.

- [x] Private files kept out of the public repo with a new root `.gitignore`: the compensation review, KPI draft, Brill response, job-application answers, employer-specific cover letters and `Prospecting/` (prospect contact data). They stay on disk only. The repo is public, so a pushed copy would be readable on GitHub even on a branch.
- [x] `CV/portrait.png` showed as deleted, but `CV/Gene Catolico.png` had the same SHA256 (5f7e223f…). It was a rename, so it is renamed back and `CV/Eugene_Libalib_CV.html` loads its photo again.
- [ ] Merge risk: `origin/main` got `b93645f` "Add case studies section" (2026-10-01, cloud session), which edits the same four files this branch rewrites. Merging the redesign into `main` later will conflict; the case-studies section has to be carried into the new markup by hand.

## 2026-09-19 · Build Option A "Control Room" into the real site

Owner chose Option A. Work happens on branch `redesign/control-room`; `main` (which deploys to GitHub Pages) is untouched until the owner says to ship. Git is the backup: `index.html`, `styles.css`, `script.js` were clean at 14d45b4 before the rewrite.

Plan
- [ ] Rewrite `index.html`, `styles.css`, `script.js` from the approved artboard: inline styles to token-driven classes, real asset paths, CV links restored, dynamic year, `<head>` meta preserved.
- [ ] Responsive below 1440 (the artboard only covers desktop): fluid display type, rack 5 to 3+2 to 2 to 1 columns, stacked ledger, drawer nav under 900px.
- [ ] Keep every behaviour of the current `script.js`: role rotator, experience filter, expertise module to filter, scroll reveal, menu drawer with focus handling.
- [ ] New: videos play only in view, pause control per video (WCAG 2.2.2), reduced-motion respected, overscan crop hides the recorder overlay and scrollbar baked into the clips.
- [ ] Gate: `site-check.js` PASS at 375 / 768 / 1440 (copy, links, head regressions, horizontal scroll, overflow, contrast, tap targets, console errors, filter counts, drawer, rotator, video play and pause), then a human-eyes pass on the tiles at all three widths.
- [ ] Ship only on the owner's word: commit, merge to `main`, push, confirm the Pages build and the live URL.

Added same day: the owner also wants Option B "Editorial" built as a real page. It lives beside A as `editorial.html` + `editorial.css` + `editorial.js` (new files, same `assets/`), so both can be compared live. It carries `noindex` and a canonical link to the main page so it does not compete with `index.html` in search. Promoting B later is a rename plus removing those two lines.
- [ ] Build `editorial.*` from the approved Option B artboard; gate is `site-check-b.js` PASS at 375 / 768 / 1440 plus an eyes-on pass. In B the role "rotator" is the cyan highlight stepping down the visible five-role list.
- [ ] OPEN, owner's call: on the canvas the ABOUT title of Option A was dragged out of its header (now `position: absolute; left: -751px; top: -60px`). Rendered, it is clipped at the left page edge (x = -19px) and overlaps the top of the portrait. Treated as accidental and NOT carried into the build unless the owner says it was deliberate.
- [ ] Canvas limit learned: artboard frames cap at 8000px tall. A (8831) and B (10083) were clamped to 8000 in canvas view, so their contact sections are cut off there; Play mode scrolls the full page.

Found while proving the checker on the OLD site (it must fail before it is trusted; it did, 9 static + 5 render failures):
- ~~The 375px `scrollWidth` of 430 comes from the off-canvas menu~~ (claim in the entry below). Measured 2026-09-19: the hero `<h1>` overflows, 410px of text in a 335px box, and that is what widens the page. A real live mobile bug; the rewrite fixes it.
- No `<img>` on the live site carries `width`/`height`, so every image causes layout shift.
- `.card__open` arrow fails contrast (2.49:1).

## 2026-09-19 · Two redesign samples on the design canvas (not built into the site yet)

Design-only session. `index.html`, `styles.css` and `script.js` are untouched; `git status` after the session is identical to before it. The samples live on a private claude.ai design canvas: https://claude.ai/artifact/FJMhzFVdytvXN3n2dT2YoD

- [x] Option A "Control Room" (dark, Archivo Expanded + JetBrains Mono, five-module expertise rack, solid cyan contact block). Artboard 1440x8831. Own checker run: PASS, 0 missing copy, 0 contrast / overflow / tap-target failures.
- [x] Option B "Editorial" (light paper, Instrument Serif + Geist, ledger tables, cyan as highlighter only, one dark band for the videos). Artboard 1440x10083. Own checker run: PASS.
- [x] New section 03 "Website Builds" in both, between Expertise and Experience, holding the three new clips (HyBar, Sanpete School of the Performing Arts, Brill Hernández Media). Counters became `NN / 05`. In-viewport capture confirmed all three videos at `readyState 4`, playing, painted.
- [x] Copy fidelity is machine-checked: every string and href from `index.html` plus the five rotator roles from `script.js` must appear verbatim (case-insensitive). The checker was first watched failing on a deliberately broken page (clipping, overflow, contrast 1.88, 10px text, 20px target, missing alt, em dash, 120 missing strings).
- [ ] NOT verified: the live canvas runtime. Hover, focus, the role rotator animation, the accent retint tweak and video autoplay were checked in a faithful local preview and from source, never seen running inside the canvas itself.
- [ ] Owner decision: pick A, B, or a mix. Nothing gets built into the real site until then.
- [ ] If either ships: restore `href="assets/Eugene_Libalib_CV.pdf"` with the `download` attribute on both DOWNLOAD CV links (the artboards use `#`), and add a pause control for the looping videos (WCAG 2.2.2).
- [ ] Source clips carry recording artefacts: the screen recorder's mic/camera overlay bottom-right and the browser scrollbar at the right edge in all three, plus a mouse pointer mid-frame in the Sanpete clip. Option B hides the first two with a 16px / 10px overscan crop; Option A shows the clips uncropped. A clean re-export fixes it properly.

## 2026-09-19 · Site copy and CV alignment

Deploys from `main` via GitHub Pages: https://governorgene.github.io/eugene-libalib-portfolio/ . The CV linked from the site is a separate copy at `assets/Eugene_Libalib_CV.pdf`, so it must be replaced whenever `CV/Eugene_Libalib_CV.pdf` is re-exported.

- [x] Aligned the site copy with the corrected CV. The Claude wording now describes GoHighLevel voice agents on Claude models and the Claude Code setup. The Brill Hernandez Media start year is now 2025. Em dashes are replaced with plain punctuation. Commit e42dbba; the Pages build shows `built`; the live page returns HTTP 200 with 0 em dashes and 0 en dashes.
- [x] Replaced the downloadable CV. The live `assets/Eugene_Libalib_CV.pdf` returns HTTP 200, and its SHA256 `6e20c40c…8a50` matches `CV/Eugene_Libalib_CV.pdf`.
- [x] Checked rendering in headless Chrome at 1440px and 375px: no console errors and no sideways scroll. The 375px `scrollWidth` of 430 comes from the off-canvas menu and was the same before this change.

## Plan

### Structure
- [x] `index.html` — single page with sections: Hero · About · Expertise (5 roles) · Selected Work · Contact
- [x] `styles.css` — dark theme, modern type, responsive (mobile → desktop), no framework
- [x] `script.js` — smooth scroll, animated role rotator in hero, scroll-reveal, filterable project grid by role
- [x] `assets/` — folder for future images (empty for now, with `.gitkeep`)

### Design decisions
- **Hero pitch:** name + rotating role tagline ("Product Manager → UI/UX Developer → Software Engineer → Security Engineer → Growth Marketer") to communicate the multi-hat positioning at a glance.
- **Expertise section:** 5-card grid, one per discipline. Each card lists 3–5 skills/tools. Clicking a card scrolls to filtered work below.
- **Selected Work:** project cards tagged by discipline. Filter chips at top (`All` + 5 role chips). Placeholder projects so the layout is real; you swap in real ones.
- **Contact:** email + social links. No form (would need a backend).
- **Style:** dark background, single accent color, generous whitespace, system font stack for zero load time.

### Placeholders to fill in later
- Your name, tagline, photo (optional), real project entries, social URLs, contact email.

### Verification
- [ ] Open `index.html` directly in browser — all sections render, no console errors
- [ ] Resize window 320px → 1920px — layout holds at every width
- [ ] Click each role chip — work grid filters correctly
- [ ] Hero rotator cycles smoothly through all 5 roles

## Redesign pass — match bossROD reference

Reference style: pure monochrome (true black bg, white text, no color accent), monospace section labels with numbering ("01 / 04 ///////"), ALL-CAPS bold sans headlines, thin 1px borders, slash/hash decorative dividers, quick-nav card grid under hero, newsletter-style closing block.

- [x] Restructure `index.html`: monogram logo + breadcrumb + hamburger nav; hero with eyebrow + headline + pitch + CTAs; 4 quick-nav cards (About / Expertise / Work / Contact); 4 numbered sections; "STAY IN THE LOOP" style closing.
- [x] Rewrite `styles.css`: monochrome palette, mono eyebrow labels, all-caps headlines, slash-divider component, card style matching reference.
- [x] Update `script.js`: keep role rotator + filter + expertise→work link; add scroll-driven breadcrumb counter in nav.
- [x] Preserve all original content (name, pitch, bio, 5 expertise cards with skills, 6 project placeholders, contact).

## Pick up here next session

- [ ] **Save the portrait** to `X:\Master\assets\portrait.jpg` (right-click the image from chat → Save as). Layout already expects it; refresh once it's on disk.
- [ ] Decide if crimson `#E63946` is right or if you want a darker/brighter red, or a different photo-derived color
- [ ] Replace any remaining placeholder copy in expertise cards (the 1-line descriptions per discipline) with sharper Eugene-voice rewrites if desired
- [ ] Optional: real project thumbnails for the Experience section (currently abstract diagonal-line patterns)

Files in current state: `index.html`, `styles.css`, `script.js`, `assets/.gitkeep` — all under `X:\Master\`. Open `index.html` directly or via VS Code Live Server.

## Review (v5 — crimson theme drawn from portrait)

Swapped accent from electric cyan (`#00e5ff`) to crimson (`#e63946`), pulled from the maroon background of `assets/portrait.jpg`. Same accent applies everywhere — labels, indicators, hover borders, buttons, glow — but the mood shifts from tech to editorial/personal.

Implementation: only `:root` accent variables changed plus one hardcoded `#001318` replaced with a new `--on-accent: #1a0507` token (very dark wine for the dark-text-on-accent-bg combinations like primary button, active filter chip, open hamburger). Body radial-glow gradient updated to red tint.

## Review (v4 — electric cyan accent + portrait)

**Cyan applied as a true accent (`#00e5ff`), not a flood:**
- Eyebrow + section kicker labels: cyan
- Hero role rotator: cyan
- Nav: monogram (◢), section counter number, hamburger hover/open state
- Quick-nav card numbers (01–04)
- Card numbers (01–05), `↗` icon on hover, skill bullets (`▸`), hover border + glow
- Project card hover border + glow, project meta dates
- Filter chip active state (cyan bg, dark text)
- Tags: cyan text on cyan-dim bg
- Badges: `▸` prefix added via CSS `::before` in cyan
- Menu drawer: counter number, active dot indicator (with glow), social hover, active link number
- Primary button: cyan bg + glow on hover
- Ghost button: cyan text/border on hover
- Body: subtle cyan radial glow from top + bottom-right
- Text selection: cyan highlight

**About section also gained:**
- Two-column split (text left, portrait right)
- Sticky portrait on desktop, stacked on mobile (<820px)
- 4:5 aspect ratio frame with caption row ("PHOTO · EUGENE LIBALIB")
- Awaits `assets/portrait.jpg` from user

## Review (v3 — real content from CV)

**Discipline reshape (CV-honest):**
- ❌ Removed: Product Manager, UI/UX Developer, Software Engineer, Security Engineer (not backed by CV)
- ✅ New 5 disciplines: GoHighLevel Specialist · Marketing Automation · Web Developer · AI Integration · Network Ops &amp; Support

**Content populated from CV:**
- Hero pitch: real automation/CRM positioning, A2P 10DLC + TCPA + CAN-SPAM callouts
- About: 2 paragraphs adapted from CV summary, web-voice not resume-voice
- Expertise cards: rewritten per discipline with skills lifted from CV "Technical Skills" + work descriptions
- Selected Experience (renamed from Selected Work): 5 real engagements — ArisECRM/multi-client (2024–26), Carabao Clouds NOC (2023–24), Zero hardware (2020–present), Guavatek web dev (2019–21), Dell support (2017–19). Each tagged by discipline.
- Filter chips updated: All · GHL/CRM · Growth · Web Dev · AI · Network Ops
- Contact: real email (governorgene02@gmail.com), real LinkedIn (linkedin.com/in/genelibalib), location (Quezon Province, PH)
- Footer: real links, no fake X/Twitter placeholder
- Role rotator: matches new 5 disciplines
- New `.project__meta` line per experience entry showing dates + title

**Kept private per user preference:** phone number (+63...), full address.

**Remaining placeholders:** none. Every bracketed slot has been replaced with CV-backed content.

## Review (v2 — bossROD-style redesign)

**Redesign moves:**
- Pure monochrome (true black bg, white text). Cyan accent removed.
- Section numbering ("01 / 04 ////////") with mono eyebrow + kicker + ALL-CAPS bold headline.
- Sticky top nav: triangle monogram (◢ ecl) · live section counter (01/04) · decorative hamburger.
- Hero: eyebrow → headline → role rotator → pitch → two CTAs → 4-card quick-nav grid (About / Expertise / Work / Contact) with mono labels and thin dividers.
- About: bio + 5 role badges (▸ PRODUCT MANAGER, etc.) in mono caps.
- Expertise: 5 cards with numbered headers (01–05), top-border, ↗ open icon on hover.
- Work: filter chips restyled as mono pills, project thumbs as subtle diagonal-line pattern (no color).
- Contact restyled as "STAY IN THE LOOP" transmission block, centered.
- Footer: monogram left · centered copyright · social initials right.
- Reduced-motion respected throughout.

## Review (v1 — original)

**Built:** `index.html`, `styles.css`, `script.js`, `assets/.gitkeep` (4 files, zero dependencies, no build step).

**What works:**
- Sticky nav with section anchors.
- Hero with rotating role tagline (PM → UI/UX → SWE → Security → Growth, 2.2s cycle, fades on transition, honors `prefers-reduced-motion`).
- About + 5-card Expertise grid. Clicking an expertise card jumps to Work filtered to that role.
- Selected Work with 6 placeholder projects, filterable by 5 role chips + `All`.
- Contact section with `mailto:` + 3 social slots.
- Cyan accent (#00E5FF) on dark bg, ambient gradient glows, fluid type via `clamp()`, responsive 320px → 1920px.
- Scroll-reveal via `IntersectionObserver` with graceful fallback.

**Verification still owed (you do this):**
- Open `index.html` in browser (or use VS Code's Live Server) — confirm all 5 sections render and console is clean.
- Resize narrow → wide, check layout holds.
- Click each role chip — confirm work grid filters.
- Click an expertise card — confirm it jumps to Work + activates the matching chip.

**To customize:** replace every `[BRACKETED]` slot in `index.html` (name, pitch, bio, project titles/descriptions, email, social URLs). Add real images to `assets/` and reference them inside `.project__thumb` divs to swap the gradient placeholders.

**Not built (out of scope for v1):** contact form (needs backend), blog/case studies (would need MDX or separate HTML pages), light theme toggle, real images.
