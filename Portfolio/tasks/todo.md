# Todo — Portfolio v1

Single-page static portfolio showcasing five disciplines: Product Manager, UI/UX Developer, Software Engineer, Security Engineer, Growth Marketer. Local-only (file:// or VS Code Live Server). No build step, no framework.

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
