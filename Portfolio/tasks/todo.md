# Todo — Portfolio v1

Single-page static portfolio showcasing five disciplines: Product Manager, UI/UX Developer, Software Engineer, Security Engineer, Growth Marketer. Local-only (file:// or VS Code Live Server). No build step, no framework.

## 2026-10-15 · Touch and motion fixes

- [x] Source: the owner asked for an analysis of Emil Kowalski's public UI skills (`emilkowalski/skills`), and the rules of its `mobile-native` and `emil-design-eng` skills were applied to `styles.css`. A probe that walks the live CSSOM over HTTP found 22 `:hover` rules outside a hover media query, 4 `transition: all`, 1 `padding` transition, no `:active` style anywhere and no `theme-color` meta. Chrome blocks CSSOM reads over `file://`, so the probe reports a blocked stylesheet as FAIL instead of passing empty.
- [x] Pre-existing bug found and fixed: the cards' hover lift had never shown. `.reveal.is-visible { transform: translateY(0) }` came after `.card:hover` at equal specificity, so `.card`, `.project` and `.case` stayed at `translateY(0)` when hovered (measured `matrix(1, 0, 0, 1, 0, 0)`). `.reveal`'s transition list also replaced theirs, so the border colour snapped instead of fading. The reveal now moves elements with the `translate` property, its transition sits in `:where()` at zero specificity, and the three card types add `var(--reveal-transition)` to their own lists.
- [x] Every hover style now sits inside `@media (hover: hover) and (pointer: fine)`. The text links' keyboard `:focus-visible` styles stay outside it. Press feedback through `:active`: `scale(0.97)` on buttons and filter chips, `0.95` on icon buttons and the video play button, `0.99` on the expertise cards, and a colour change on quick-nav cards, menu links and contact links, with a new `--ease-out` curve. `transition: all` replaced with the exact properties. The menu link hover slides the number and label with a transform instead of animating `padding-left`. Tap highlight turned off (every control now has its own `:active`), `touch-action: manipulation` on links and buttons, `user-select: none` on buttons only. `script.js` adds an empty passive `touchstart` listener, which iOS Safari has long needed before it applies `:active` on touch. `index.html` has `theme-color` `#020202`, the nav colour sampled from a 360px render.
- [x] Verified with Playwright CLI 0.1.22 and Chrome over HTTP. Each check ran on the old CSS (from `HEAD`, swapped in through a network route) and on the new. Static probe: FAIL, then PASS. Desktop hover on `.card`, `#case-landing` and `.project`: old `translateY` 0, new -2px. Press with the mouse held 350 ms: old `none` on a chip, card, primary button, menu button and footer icon; new 0.97, 0.99, 0.97, 0.95 and 0.95. Menu link hover: old `padding-left` 12px; new 4px with the label at `translateX(8px)`. Touch (Pixel emulation, real tap events): the old CSS left the accent border and shadow on a tapped case and project card, the new one leaves the default border. Scroll reveal still animates (opacity 0 and `translate` 0 20px before, 1 and `none` after), and with reduced motion everything shows at once. 0 `transition: all` and 0 em or en dashes in the edited files.
- [x] Gate on `X:\Master\index.html`: WARN, no FAIL, 0 console errors, 320 to 1440px. The same 4 contrast WARNs (case-panel labels) and 10 copy WARNs (six `TODO(Gene)`, and the spaced hyphen in the title, description and social titles, an open owner's call). Slices looked at: 375px-01, 375px-04, 1440px-01 and 1440px-03. Layout unchanged, as expected from changes to interaction states only.
- [ ] Needs from Gene: a tap test on a real phone. Emulation reproduced the sticky hover and its fix, but not iOS Safari's own `:active` handling, tap delay or the status-bar colour. Tap a case card (no accent border should stay behind), press the buttons (they should shrink slightly while held), and check the status bar matches the nav.
- [ ] Owner's call, not changed: `.project` and `.case` cards lift on hover like links but are not clickable (only Case 01's video panel is). With the lift working again this shows on desktop. Keep it, or keep only the border.
- [ ] Owner's call: not committed or pushed. A push to `main` is the deploy.

## 2026-10-14 · Accessibility fixes from an axe-core scan

- [x] axe-core 4.10.2, loaded from cdnjs into a Playwright CLI session at 1440px, reported 2 violations. **color-contrast** (serious): the case-study client line was `--text-dim` `#5a5550` on `--bg-card`, 2.49:1. **aria-allowed-role** (minor): `script.js` gave the 5 expertise cards `role="link"` on an `<article>`, so each card's whole text became one link name. axe also left 74 contrast checks undecided because of the body's background gradient, and flagged the menu's `<aside role="dialog">` as not allowed once open.
- [x] Because axe could not see past the gradient, a second script measured every visible text element against its nearest solid background. It found 5 failing kinds, all from the two dim tokens: quick-nav labels, the photo label and the footer (2.67:1 on `--bg`), the case client line (2.49:1), and the decorative `/////////` slashes (1.59:1).
- [x] Contrast fixed at the token: `--text-dim` is now `#877e76`, measured 4.61:1 on `--bg-card`, 4.73:1 on `--bg-elevated` and 4.94:1 on `--bg`. The slashes are now `aria-hidden="true"`, since they are pure decoration.
- [x] Each expertise card's title is now a real link (`<a class="card__link" href="#work">`), stretched over the whole card with `::after`, so the card is still one click target. The link names are just the titles (Playwright snapshot), Tab and Enter work natively, and without JS the link still reaches `#work`. `script.js` now only applies the matching filter. The menu is now a `<div role="dialog">`; no CSS or JS selected the `aside` tag.
- [x] Regression caught before finishing: the skill list items are `position: relative` for their bullets, so they painted over the overlay and clicks on the lower half of a card did nothing (`elementFromPoint` returned the `li`). The overlay now has `z-index: 1`. A hit test of 25 points per card, on all 5 cards at 375 and 1440px, gives 25/25 each. With the `z-index` removed, the same test reports misses on the `li`, so it can fail.
- [x] Verified: axe reports 0 violations with the menu closed and open. The exact contrast scan reports 0 failures in both states. A real mouse click on a card's skill list applied the "ai" filter (1 project shown) and scrolled `#work` to the top. Tab moves card to card with a 2px accent ring on the whole card, and Enter applied the "web" filter (2 projects). `scrollWidth` equals the viewport width at 320, 375, 768, 1024 and 1440px. 0 console errors on a clean load; the 4 errors seen only while axe ran are axe re-fetching `styles.css` over `file://`. Before and after screenshots looked at for the quick nav, the cards, a case study and the footer.
- [x] ~~Owner's call: not committed or pushed. A push to `main` is the deploy.~~ Resolved 2026-10-14: committed as `baf7af4` and pushed. Pages build `built baf7af4` (43 s), live page 200, live CSS has `--text-dim: #877e76`, and axe on the live URL reports 0 violations (42 passes) with 0 console errors.

## 2026-10-14 · Hero and contact secondary buttons turned into text links

- [x] Owner's request: one primary button in the hero, with the secondary actions as text links, so the visual weight sits on "See my experience". The idea came from a design reel listing five tells of AI-made landing pages. The hero already avoided the other four (no gradient headline, no generic "Get started / Learn more", no vague user counts, no three-icon feature row).
- [x] "Get in touch" and "Download CV" changed from outlined `btn--ghost` boxes to `btn--link`: muted text, no border, with the hover and keyboard-focus underline and arrow nudge in the accent colour. The arrows sit after the label in `aria-hidden` spans, so the accessible name is "GET IN TOUCH" without "right arrow" (checked in the Playwright snapshot). The links keep the button's 48px height as their hit area. ~~The contact section's buttons are unchanged.~~ Corrected 2026-10-14: the contact section got the same treatment at the owner's request, see below.
- [x] Two layout defects found by the sweep and fixed before finishing. At 375px the wrapped links sat 12px in from the left edge, so side padding was dropped and the space moved into the row's `gap`. Between about 380 and 510px (390, 414 and 430 checked), "Download CV" was stranded alone on its own row, so the two links now sit in `.hero__cta-links` and wrap together.
- [x] Checked in headless Chrome (Playwright CLI 0.1.22) at 320, 375, 390, 414, 430, 480, 510, 520, 600, 768, 1024 and 1440px. `scrollWidth` equals the viewport width at every width, with 0 console errors. The button sits alone above both links up to 510px, and everything is on one row from 520px. Link text lines up with the pitch paragraph's left edge. Resting text contrast measured 6.28:1 against the page background (AA), 12.77:1 on hover. Hover and Tab focus both measured as switching to the accent colour with the underline and the 3px arrow shift. Screenshots looked at for 320, 375, 390, 414, 1440 and the hover state.
- [x] Contact section, at the owner's request: "Download CV" is now a `btn--link` under the email button, with its arrow after the label. The email button's arrow moved into an `aria-hidden` span, so its accessible name is "libeugca@gmail.com" (Playwright snapshot); its width is unchanged at 210px. `.btn--ghost` had no users left, so its two rules were removed (grep of the site HTML, CSS and JS).
- [x] Contact checked at 320, 375, 390, 414, 768, 1024 and 1440px: `scrollWidth` equals the viewport width at every width, 0 console errors, and the link's centre matches the button's centre at every width (720px at 1440). Hover measured as accent colour, underline and the 3px arrow drop. The hero CTA positions at 375 and 1440 are identical to the earlier sweep after the `.btn--ghost` removal. Before and after screenshots looked at for 320, 375 and 1440.
- [ ] Owner's call, not changed: at 320px the contact line wraps with its `·` separator left hanging after "LinkedIn". This is how it was before today.
- [x] ~~Owner's call: not committed or pushed. A push to `main` is the deploy.~~ Resolved 2026-10-14: committed as `0520649`, pushed together with `baf7af4`. Pages build `built baf7af4`, live page 200, and the live HTML has the 3 `btn--link` links.

## 2026-10-12 · Hero name no longer runs off phone screens

- [x] Found while trialling Playwright CLI: `.hero__title` was `white-space: nowrap` with a 36px font-size floor, so "HI, I'M EUGENE LIBALIB" needed 410px and was cut off at "LIBA" on every width from 320 to 414px (iPhone SE through Pixel). Measured: `h1.scrollWidth` 410 vs `clientWidth` 335 at 375px, no animation running.
- [x] Fix: the name sits in `<span class="hero__name">` with `nowrap`, and the title itself may wrap, so where the line does not fit it breaks once, before the name ("HI, I'M" / "EUGENE LIBALIB"). A `max-width: 340px` step drops the title to 2rem, because at 36px the name ran 2px into the gutter at 320px.
- [x] Checked in headless Chrome (Playwright CLI) at 320, 340, 341, 360, 375, 414, 450, 480, 600, 768, 1024 and 1440px: name inside the gutter at every width, 2 lines up to 450px, 1 line from 480px. The same check flagged 320 to 414px as clipped on the old code. Page `scrollWidth` at 375px went from 430 to 375. No console errors.
- [x] Wider layouts unchanged by eye: the h1 renders at the same size at 480, 600, 768, 1024 and 1440px. At 480, 768 and 1440 about 125 to 360 pixels around the "A" in LIBALIB differ by edge smoothing (the name is now its own text run). Two renders of the new code match pixel for pixel, so this is real but invisible at 2x zoom.
- [ ] Owner's call, not changed: the role rotator includes "Network Operations Engineer", so the hero can read "I work as a Network Operations Engineer" while the CV title is Lead Automation Engineer.

## 2026-10-12 · Case 04 shipped, Claude-model claim softened

- [x] Case 04 (`aab4e0a`) had been sitting unmerged on `claude/magical-albattani-oz9ckt`. Fast-forwarded into `main` at the owner's word, pushed, Pages build `built aab4e0a`, and the live page contains `id="case-receptionist"`. Both stray `claude/*` branches were then deleted from GitHub. Rollback SHAs: `aab4e0a` (magical-albattani), `b93645f` (wizardly-brahmagupta, already on `main`).
- [x] The voice-agent claim is softened, as the owner chose, because no source shows which model the agents run on. Hero, About and AI card now say "AI voice agents (built) in GoHighLevel"; the AI card skill "Claude Code & Claude models" is now "Claude Code". CV summary is now "I build AI voice agents in GoHighLevel". The Claude Code setup line stays, because it is true.
- [x] The generic cover letter still said "integrated the Anthropic Claude API to power AI-driven response agents", the same unsupported line the CV dropped on 2026-09-18. Now it reads "build AI voice agents in GoHighLevel". Its two em dashes were replaced as well.
- [x] CV and cover letter PDFs re-exported (playwright-core + system Chrome, `document.fonts.ready`): each is still 1 A4 page; pypdf shows 0 "Anthropic", 0 "Claude models", 0 dashes, and no doubled text. `assets/Eugene_Libalib_CV.pdf` is byte-identical to `CV/Eugene_Libalib_CV.pdf`. The CV render was checked by eye; the site at 1440px shows 0 matches, no console errors and no horizontal scroll.
- [ ] Left as is, owner's call: the CV skill "Claude AI Integration" and the meta description's "Claude AI integration". They make no claim about which model runs, but a reader may take them to mean Claude is built into client systems.
- [ ] `redesign/control-room` still carries the old Claude-model copy; it has to pick up this change along with Cases 01 to 04 before it ships.

## 2026-10-02 · Case 04: bilingual AI phone receptionist

- [x] Added `#case-receptionist`: the Voice AI receptionist rebuilt for a windows and doors client, kept anonymous (no client or persona name, per Gene). Facts come from the client's project repo, the live GoHighLevel account (read-only), and Teams/Outlook, then checked against primary sources by a separate fact pass and a confidentiality pass.
- [x] Wording follows what the sources support: "took over ... rebuilt" (an earlier agent existed before March 2026); the platform is GoHighLevel Voice AI; booking-detail gathering is described as the design, not a guarantee; metrics are call-log counts (288 calls Jul 3 to Oct 1 incl. a few internal tests, 104 live transfers, 49 voice-booked appointments Jul to Sep). No before/after claims, because no pre-agent baseline exists.
- [x] Section lede now lists the receptionist. Checked in headless Chrome at 1440, 1000, 700 and 375px: no console errors, no new overflow, 0 em or en dashes, no client name, persona name or phone number in the page.
- [x] ~~Open question for Gene: the hero, About and AI cards (and the CV) say the voice agents run "on Anthropic's Claude models". No source supports that for this agent (only "GHL Voice AI"); Claude shows up as the build assistant. Confirm the model or soften the wording.~~ Resolved 2026-10-12: softened (see the entry above).
- [ ] Optional: blurred screenshot of the agent config or call flow for the media panel.

## 2026-10-01 · Case studies section

Added for the Aspire Media Marketing (Media Manager) application, which asked for a walkthrough of a campaign, a landing page, and a CRM, or an updated portfolio.

- [x] New `#case-studies` section between Expertise and Experience, with three cases: 01 the Missed Call pipeline turnaround (links to the 3-minute Drive walkthrough), 02 custom HTML websites and landing pages, 03 SMS and email follow-up campaigns. All copy uses facts already in the CV, the site, or the August video; no metrics are invented.
- [x] Renumbered sections to `0X / 05`, and added Case Studies to the quick-nav (5 cards: 3 + 2 rows under 1080px, 2 + 2 + 1 under 720px, one column under 440px) and to the menu drawer (now 01 to 06). The menu tracker and scroll reveal both cover the new section.
- [x] Checked in headless Chrome at 1440, 1000, 700 and 375px: no console errors, no quick-nav label overflow, and the nav counter and menu both mark Case Studies while it is in view. ~~The 375px `scrollWidth` of 423 comes from the off-canvas menu and is the same on the previous commit.~~ Corrected 2026-10-12: the overflow was the hero headline, which was cut off at every phone width. With the headline fixed, `scrollWidth` at 375px is 375. See the 2026-10-12 hero entry. 0 em dashes and 0 en dashes.
- [ ] Needs from Gene, marked by `TODO(Gene)` comments in `index.html`: blurred screenshots for cases 02 and 03 (drop in `assets/` and add an `<img>` inside `.case__media`), before/after numbers for the 78 Missed Call opportunities, campaign stats, and which client names may be shown.
- [ ] Confirm the Drive video is shared as "Anyone with the link".
- [ ] Merge to `main` so GitHub Pages publishes it.

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
