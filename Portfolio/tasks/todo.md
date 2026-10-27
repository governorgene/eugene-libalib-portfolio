# Todo — Portfolio v1

~~Single-page static portfolio showcasing five disciplines: Product Manager, UI/UX Developer, Software Engineer, Security Engineer, Growth Marketer. Local-only (file:// or VS Code Live Server). No build step, no framework.~~ Corrected 2026-10-12: the disciplines were replaced by CV-backed ones in v3, and the site is now public on GitHub Pages (built from `main`). Still a single page, no build step, no framework. `CLAUDE.md` at the repo root describes the current setup.

## 2026-10-27 · Ripple and root CLAUDE.md deployed

- [x] Owner's go-ahead: "go ahead and push it first". Committed as `fab9097`: the 2026-10-16 ripple (`script.js`, `styles.css`), the 2026-10-12 move of `CLAUDE.md` to the repo root, the `lessons.md` template and the journal entries from 2026-10-12 to 2026-10-16.
- [x] Gate before the push, on `X:\Master\index.html` and again over HTTP through the `portfolio` launch config: WARN, no FAIL, 320 to 1440px, 0 console errors. Contrast now passes outright, because the gate reads the ripple canvas pixel by pixel instead of listing 70 text runs to check by eye. The same 10 copy WARNs. The touch and motion WARN depends on how the page is loaded. Over `file://` it is the press-state false positive noted on 2026-10-26: Chrome blocks the gate from reading `styles.css`, and the report lists one blocked stylesheet with an empty name. Over HTTP that WARN is gone and a `theme-color` WARN appears instead, because the gate judged the page to have a dark theme. It has none (no `prefers-color-scheme` rule anywhere), the light and dark 375px first slices differ only in the rotating role word, and the 2026-10-26 run on the same file swept dark while today's did not, so the gate's dark detection varies from run to run on this page. Both read as gate false positives. Slices looked at: 1440px-01, 375px-01 and 375px-dark-01.
- [x] Deployed: pushed `746db81..fab9097`. Pages build `built` for `fab9097` (equal to `git rev-parse HEAD`) in 37 s. Live page 200. The live `index.html`, `styles.css`, `script.js` and `CLAUDE.md` match the commit (SHA256). The old `Portfolio/CLAUDE.md` now returns 404, and `CLAUDE.md` at the root is public. Gate on the live URL: WARN, no FAIL, the same items as the HTTP run.
- [x] Ripple on the live URL, Chrome through Playwright CLI 0.1.22 at 1440px, lit pixels on the canvas: 0 before, 873 at 250 ms after a click on the blank hero, 0 once it settled. A click on the hero button lit 0 and still went to `#work`.
- [x] ~~Owner's call: the hero reads "I work as a AI Integrator" whenever the rotator reaches that role, live since `46af264`. The "a" is fixed in `index.html` in front of the rotating word. Fix: put the article into each role in `script.js`, or reword the line.~~ Resolved 2026-10-27 at the owner's go-ahead: each role in `script.js` carries its own article, and `index.html` holds it in a `.role-rotator__article` span outside the cyan word and its `aria-live` region, swapped while the word is hidden. Recorded in the page through one full cycle (5 roles, 11 s) with motion on and reduced: all five sentences read correctly, and no article was wrong at any moment, mid-swap included. The same recorder on the live site, before this change, caught "I work as a AI Integrator". Gate on `X:\Master\index.html`: WARN, no FAIL, touch and motion PASS, the same 10 copy WARNs; slices 375px-01 and 1440px-01 show "I work as an AI Integrator".
- [ ] Owner's call: the rotating role sits in an `aria-live` region, so a screen reader announces every swap, every 2.2 s, with no way to pause it (likely WCAG 2.2.2, Pause, Stop, Hide). Options: drop `aria-live`, or let the rotator stop after one pass.
- [x] ~~Gate fix, in the `pre-delivery-gate` skill rather than this repo: the two touch and motion false positives above.~~ Resolved 2026-10-27, in the skill, not in this repo. Press state: over `file://` Chrome will not let a page read its own linked stylesheets, so the gate never saw `styles.css`; it now reads them through DevTools. Dark theme: the gate compared a light load with a dark load, and the six lazy images had no `currentSrc` on the first load but a cached one on the second; it now switches the scheme on the loaded page with transitions and animations held still. Selftest 81 of 81 (79 in one run, and the two cases where axe-core failed to download from cdnjs passed on a rerun); its 4 new bug cases failed on the old gate, and each new guard was watched failing on a mutated copy. Gate on `X:\Master\index.html`, three runs over `file://` and three over HTTP: WARN, no FAIL, touch and motion PASS, the same 10 copy WARNs, and no dark theme every time. Gate on the live URL: touch and motion PASS.

## 2026-10-26 · New logo (Caret) swapped in for review

- [x] Owner's choice: concept 03 "Caret" of three ECL monogram concepts drawn this day. A geometric lowercase e and c (radius 15, stroke 8 on a 120 grid, both apertures cut at 45 degrees) and an l drawn as a cyan text cursor, in the site's own tokens (`#0b0b0f`, `#f5f0eb`, `#00e5ff`). Sources live outside the repo in `X:\Content\brand\ecl-logo\`.
- [x] `assets/ecl-glyph.svg` (sha256 `5444b75b37cf`) replaces `ECL Logo.png` in the nav, the menu header and the footer. Its viewBox is square and cropped to the glyphs, so it fills the 28px `.nav__mark` slot with no CSS change. Measured in Chrome: all three load 28px wide, 0 console errors. The open menu at 375px and the footer at 1440px were screenshotted and looked at.
- [x] Favicons are PNG only: `favicon-32.png` (`b442cfd69a7f`), `favicon-16.png` (`946844af6423`) and `apple-touch-icon.png` 180px opaque (`96c54275669c`). An SVG favicon was left out on purpose: Chrome prefers it and the vector e and c smear into blobs at 16px. The 16px file is drawn by hand on the pixel grid and was checked enlarged 16x on dark and light.
- [x] `og-image.jpg` 1200x630, 70 KB (`b1958388ccda`): the new mark, the name in Anton and the role line, beside the existing portrait. Both `og:image` and `twitter:image` point to it. `graphtag.jpg` is kept, no longer referenced.
- [x] Gate on `X:\Master\index.html`: WARN, no FAIL, 320 to 1440px, light and dark. The same 10 copy WARNs as before. One touch and motion WARN lists 12 controls without a press state, although `styles.css` has `:active` rules for `.btn`, `.chip` and `.nav__menu` (lines 409, 809, 143), so it reads as a gate false positive and predates this change. Slices looked at: 1440px-01 and 375px-01.
- [x] ~~Owner's call: approve the logo, nav, favicons and share image, then commit and push. A push to `main` is the deploy. The 2026-10-16 ripple in `script.js` and `styles.css` is still uncommitted too, so commit the two apart unless both are approved.~~ Resolved 2026-10-26: approved by the owner. Committed on its own, built from `HEAD` in a temporary index, so the ripple and the staged `CLAUDE.md` move stay uncommitted.
- [x] Deployed: `eab600e` pushed to `main`. Pages build `built` for `eab600e` (equal to `git rev-parse HEAD`) in about 60 s. The live page returned 200, and all five new assets returned 200 with byte sizes equal to the local files (560, 199, 766, 2,360 and 70,411 bytes). The live HTML references only the new files. Gate on the live URL: WARN, no FAIL, the same items as the local run. The live nav slices at 1440px and 375px show the new mark.
- [ ] Owner's call: the menu header reads "ec| ECL", the new mark beside the old text. Keep it, or change the text.
- [ ] After a deploy, social sites keep the old preview cached. Refresh it in the Facebook Sharing Debugger and the LinkedIn Post Inspector.

## 2026-10-16 · Background click ripple

- [x] Owner's request: a ripple through the page background on click, after one he liked on another site. That site's engine was read to learn the mechanics (a dot grid on a canvas, a ring wave pushing dots outward and lighting them), then this version was written from scratch in `script.js`, with no code copied.
- [x] `script.js` adds a fixed, `aria-hidden` canvas behind the page (`.ripple-field` in `styles.css`, `z-index: -1`, `100lvh`, hidden in print). It draws a 22px dot grid in `--text`. A click or tap on the background sends a ring out 180px over 1.1 s, pushing dots up to 14px outward and lighting them in `--accent`, with a faint ring at the front. The canvas redraws only while a ripple is alive, up to 5 at once. It fires on pointer events rather than `click`, because iOS Safari doesn't pass a tap on plain text or empty space up to the document as a click. No ripple for links, buttons, images, opaque cards and panels, the nav bar, the open menu, drags over 6px, right clicks or the keyboard. Reduced motion keeps the static grid and never ripples.
- [x] Contrast: every text run on the page background measured at least 4.94:1 against `--bg`, but at a first try of 8% opacity a dot pixel took `--text-dim` (the quick-nav labels, 8 runs) down to 4.2:1. Lowered to 5%. The brightest rendered dot pixel now gives `--text-dim` 4.63:1, and a fully covered dot pixel on a 2x screen works out to 4.53:1.
- [x] Verified in Chrome through Playwright CLI 0.1.22, by counting lit pixels on the canvas right after each pointerup. Real mouse at 1440px: blank hero 236, hero text 189, blank space after scrolling 173. A drag, a right click, the hero button, text in a case panel and Enter on a focused link all 0. Real touch tap at 375px (2x): hero text 576, hero button 0, and the link still went to `#work`. Reduced motion: the grid draws (10,660 dot pixels) and a click lights 0. Five ripples at once at 1440px: median frame 6.9 ms, one frame over 20 ms out of 183. After the ripples end the canvas has 0 lit pixels left.
- [x] Gate on `X:\Master\index.html`: WARN, no FAIL, 0 console errors, no overflow from 320 to 1440px. The same 10 copy WARNs. The 4 case-panel contrast WARNs now come with a fifth: the gate counts the canvas as a picture behind 70 text elements, so it lists them for checking by eye instead of measuring them (the contrast note above covers them). Slices looked at: 375px-01, 1440px-01 and 1440px-04. A full-page capture draws a fixed layer once at the top, so lower slices show no dots.
- [ ] Needs from Gene: a tap on a real iPhone. The touch test ran in Chrome, not iOS Safari. Tap empty space and text in the hero: a cyan ring should spread. Tapping a button should only follow the link.
- [ ] Owner's call: the resting grid is faint at 5%. Stronger, like the reference site, takes the dim labels below AA over a dot. `REST_ALPHA` in `script.js` sets it, and 0 hides the grid until a ripple passes.
- [x] ~~Owner's call: not committed or pushed. A push to `main` is the deploy.~~ Resolved 2026-10-27: deployed as `fab9097` at the owner's go-ahead (see 2026-10-27).

## 2026-10-15 · Touch and motion fixes

- [x] Source: the owner asked for an analysis of Emil Kowalski's public UI skills (`emilkowalski/skills`), and the rules of its `mobile-native` and `emil-design-eng` skills were applied to `styles.css`. A probe that walks the live CSSOM over HTTP found 22 `:hover` rules outside a hover media query, 4 `transition: all`, 1 `padding` transition, no `:active` style anywhere and no `theme-color` meta. Chrome blocks CSSOM reads over `file://`, so the probe reports a blocked stylesheet as FAIL instead of passing empty.
- [x] Pre-existing bug found and fixed: the cards' hover lift had never shown. `.reveal.is-visible { transform: translateY(0) }` came after `.card:hover` at equal specificity, so `.card`, `.project` and `.case` stayed at `translateY(0)` when hovered (measured `matrix(1, 0, 0, 1, 0, 0)`). `.reveal`'s transition list also replaced theirs, so the border colour snapped instead of fading. The reveal now moves elements with the `translate` property, its transition sits in `:where()` at zero specificity, and the three card types add `var(--reveal-transition)` to their own lists.
- [x] Every hover style now sits inside `@media (hover: hover) and (pointer: fine)`. The text links' keyboard `:focus-visible` styles stay outside it. Press feedback through `:active`: `scale(0.97)` on buttons and filter chips, `0.95` on icon buttons and the video play button, `0.99` on the expertise cards, and a colour change on quick-nav cards, menu links and contact links, with a new `--ease-out` curve. `transition: all` replaced with the exact properties. The menu link hover slides the number and label with a transform instead of animating `padding-left`. Tap highlight turned off (every control now has its own `:active`), `touch-action: manipulation` on links and buttons, `user-select: none` on buttons only. `script.js` adds an empty passive `touchstart` listener, which iOS Safari has long needed before it applies `:active` on touch. `index.html` has `theme-color` `#020202`, the nav colour sampled from a 360px render.
- [x] Verified with Playwright CLI 0.1.22 and Chrome over HTTP. Each check ran on the old CSS (from `HEAD`, swapped in through a network route) and on the new. Static probe: FAIL, then PASS. Desktop hover on `.card`, `#case-landing` and `.project`: old `translateY` 0, new -2px. Press with the mouse held 350 ms: old `none` on a chip, card, primary button, menu button and footer icon; new 0.97, 0.99, 0.97, 0.95 and 0.95. Menu link hover: old `padding-left` 12px; new 4px with the label at `translateX(8px)`. Touch (Pixel emulation, real tap events): the old CSS left the accent border and shadow on a tapped case and project card, the new one leaves the default border. Scroll reveal still animates (opacity 0 and `translate` 0 20px before, 1 and `none` after), and with reduced motion everything shows at once. 0 `transition: all` and 0 em or en dashes in the edited files.
- [x] Gate on `X:\Master\index.html`: WARN, no FAIL, 0 console errors, 320 to 1440px. The same 4 contrast WARNs (case-panel labels) and 10 copy WARNs (six `TODO(Gene)`, and the spaced hyphen in the title, description and social titles, an open owner's call). Slices looked at: 375px-01, 375px-04, 1440px-01 and 1440px-03. Layout unchanged, as expected from changes to interaction states only.
- [ ] Needs from Gene: a tap test on a real phone. Emulation reproduced the sticky hover and its fix, but not iOS Safari's own `:active` handling, tap delay or the status-bar colour. Tap a case card (no accent border should stay behind), press the buttons (they should shrink slightly while held), and check the status bar matches the nav.
- [x] ~~Owner's call, not changed: `.project` and `.case` cards lift on hover like links but are not clickable (only Case 01's video panel is). With the lift working again this shows on desktop. Keep it, or keep only the border.~~ Resolved 2026-10-15: the owner chose border only. `.project:hover` and `.case:hover` no longer lift, their accent border and 1px accent ring stay, and `transform` is gone from their transition lists. Measured on desktop hover: `.project` and `#case-landing` went from -2px to `none` and still turn the accent colour, while `.card`, a real link, still lifts -2px. Press feedback, the touch tap test and the static probe are unchanged, and the gate reports WARN with no FAIL (the same 4 and 10 WARNs). Deployed as `355deba`: Pages build `built 355deba` (71 s), live page 200, live `styles.css` matches the commit (SHA256), the same hover, press and tap results on the live URL, and the live gate reports WARN with no FAIL.
- [x] ~~Owner's call: not committed or pushed. A push to `main` is the deploy.~~ Resolved 2026-10-15: committed as `4ef04b6` (the three site files and this entry only) and pushed. Pages build `built 4ef04b6` (47 s). The live page, `styles.css` and `script.js` return 200 and match the commit byte for byte (SHA256). On the live URL: probe PASS, hover lift -2px, press 0.97, 0.99 and 0.95, a tap on a phone leaves no hover style, and the gate reports WARN with no FAIL (the same 4 contrast and 10 copy WARNs).

## 2026-10-15 · Site checked with the new pre-delivery gate

- [x] A `pre-delivery-gate` skill now runs the checks from 2026-10-14 in one command: widths 320 to 1440px, overflow, clipped text, click targets, axe-core, an exact contrast scan, console errors, broken assets and in-page links, and a dash scan. Its self-test plants one defect per check on a fixture page and passes 27 of 27 cases. Each check fails only on its own defect.
- [x] Gate on `X:\Master\index.html` and on the live site: WARN with no FAIL, in 21 s for five widths. The four contrast WARNs are the case-study panel labels on the striped background, which the gate cannot measure; checked by eye in the 1440px slice and readable. The site as it stood at `633a6f2`, before the 2026-10-14 fixes, gates FAIL: 3 contrast colour pairs plus axe color-contrast, the defects fixed by hand that day.
- [ ] Owner's call: the page title, meta description and social titles read "Eugene Libalib - GoHighLevel Specialist ...", a spaced hyphen used as a dash. The gate warns rather than fails, since separators in titles are a judgment call.
- [ ] Needs from Gene: the six `TODO(Gene)` placeholders (results rows and blurred screenshots) are still open, as listed by the gate.

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

## 2026-10-12 · Project CLAUDE.md rewritten and moved to the repo root

- [x] `Portfolio/CLAUDE.md` was a stub from before any code existed. It said the folder was empty and not a git repo, and it still listed "Minimal Impact" as a principle. It was moved with `git mv` to `CLAUDE.md` at the root, because sessions open at `X:\Master`: the stub was not loaded at session start and only loaded once a file under `Portfolio/` was read. Moved at the owner's choice.
- [x] Rewritten to describe what exists: layout, no build step, the public-repo exposure and `.git/info/exclude`, content rules, rendered verification, deploy check, CV export, and these journal conventions. Generic workflow rules were dropped because the global instructions already carry them.
- [x] Every command in it was run before being written down. `playwright-cli` 0.1.22 from a scratch folder with `allowUnrestrictedFileAccess`: `scrollWidth` equals `innerWidth` at 320, 375, 768, 1024 and 1440, 0 console errors. Without the config, `open` fails with `Access to "file:" protocol is blocked`. Both checks failed when tested on purpose: an injected 500px div gave `scrollW` 500 at 375, and an injected `console.error` was reported. `export-pdf.ps1` on the CV, written to the scratchpad: exit 0, font gate PASS (Anton, Poppins), 1 A4 page, repo untouched. `gh api .../pages/builds/latest --jq '{status, commit}'` returned `built` for `633a6f2`, and the live page returned 200.
- [x] Confirmed: the in-app browser pane shows `file:///X:/Master/index.html` unstyled. Over HTTP, through the `portfolio` launch config, it renders with the site's styles.
- [x] `lessons.md` template now matches the rule-titled format with a **How to apply:** line.
- [ ] Owner's call: GitHub Pages serves every tracked file, not just the site. This journal, `CLAUDE.md`, `ECL.psd`, the CV HTML and the root certificate PNGs are all publicly fetchable (HTTP 200 checked on 2026-10-12). Nothing private was found in the journal, but it names a job application. Options: accept it, or keep the journal and CLAUDE.md out of the published tree.

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
