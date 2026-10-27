# CLAUDE.md

Master's public portfolio site, plus the HTML sources of his CV. The global instructions (`~/.claude/CLAUDE.md`, which loads `X:\_claude\global-instructions.md`) apply here too. This file covers only what is specific to this repo. Every fact below was checked against disk, git and GitHub on 2026-10-12.

## This repo is public, and so is everything in it

- `governorgene/eugene-libalib-portfolio` is a public GitHub repo, and GitHub Pages publishes **every tracked file**, not just the site. On 2026-10-12 the old `Portfolio/CLAUDE.md`, `Portfolio/tasks/todo.md`, `CV/Eugene_Libalib_CV.html` and `ECL.psd` all returned HTTP 200 from the live site. Never write anything private in this file, in the journal or in a commit.
- Private documents stay on disk but out of git through `.git/info/exclude`. That file belongs to this clone only and is never pushed, so it is the only record of what must never be committed. Read it before staging anything new, run `git status --short --ignored` to see what it holds back, and never `git add -f` a path it excludes.
- There is no `.gitignore`.

## Layout (no build step)

The site is plain HTML, CSS and vanilla JS. There is no package.json and no framework, and nothing needs installing or building: edit a file and reload.

| Path | What it is |
|---|---|
| `index.html`, `styles.css`, `script.js` | The whole site, a single page. |
| `assets/` | Logo and favicon (`ECL Logo.png`), OG image (`graphtag.jpg`), portrait, project thumbnails, and `Eugene_Libalib_CV.pdf`, which both Download CV buttons link to. |
| `CV/Eugene_Libalib_CV.html` | CV source. Anton and Poppins are embedded as base64 in `CV/fonts_embedded.css`, the portrait is `CV/portrait.png`, and the PDF sits next to the HTML. |
| `CV/Eugene_Libalib_Cover_Letter.html` | Generic cover letter source, with its PDF next to it. The site doesn't link to it. |
| `Portfolio/tasks/todo.md` | The work journal (see below). |
| `Portfolio/tasks/lessons.md` | Lessons from Master's corrections. |
| `.claude/launch.json` | Local only (excluded from git). Its `portfolio` config serves this folder at `http://127.0.0.1:8765`. |

`ECL.psd`, `ECL - Cover Letter.pdf`, the two Kaseya certificate PNGs and `cv_preview_page1.png` sit at the root. They are tracked but not linked from the site, so anyone with the URL can still download them.

The `redesign/control-room` branch (local and on origin) holds an unmerged redesign. It is older than the case studies and the softened voice-agent wording on `main`, so it has to take both in before it ships.

## Content rules for the site and CV

- Every claim must trace back to a source: the CV, a client repo, or a live system. Metrics are counts from real logs, never estimates. Make no before/after claim without a baseline.
- Don't say which model the GoHighLevel voice agents run on. No source shows it, so on 2026-10-12 the wording became "AI voice agents in GoHighLevel".
- Case studies stay anonymous unless Master clears a name: no client name, agent persona name or phone number.
- No em dashes or en dashes in site or CV copy. Grep `index.html`, `styles.css`, `script.js` and the CV HTML for `—` and `–` after any copy edit.
- `TODO(Gene)` comments in `index.html` mark content waiting on Master, such as screenshots and result numbers. Grep for them, and never fill them with invented content.

## Verify rendered output, not source

Before calling a change done, run the `pre-delivery-gate` skill on `X:\Master\index.html` (and on the live URL after a deploy). One command runs the width sweep below plus axe-core, an exact contrast scan, click-target and clipped-text checks, console errors, broken assets and in-page links, and a dash scan, and saves screenshots with readable slices to `$env:TEMP`. It must report no FAIL. On 2026-10-15 the site gated WARN only: the striped case-panel labels need checking by eye, and the copy WARNs are the six `TODO(Gene)` markers and the spaced hyphen in the page title, the meta description, `og:title` and `twitter:title` (10 in all). The gate never presses or hovers, so it cannot see touch states: sticky hover was checked by hand on 2026-10-15 (see the journal). The manual steps below are still how to look at one thing quickly.

Use `playwright-cli`, installed globally and pinned at 0.1.22 (confirm with `playwright-cli --version`). Run it from a scratch folder, never from `X:\Master`. Without an `outputDir` it writes a `.playwright-cli/` snapshot folder into the current directory. `file://` pages also need a config that sets `allowUnrestrictedFileAccess`. Without it, `open` fails with `Access to "file:" protocol is blocked`.

Save this as `cli.config.json` in the scratch folder:

```json
{
  "browser": { "browserName": "chromium", "launchOptions": { "channel": "chrome" } },
  "allowUnrestrictedFileAccess": true
}
```

Then run, from that folder:

```bash
playwright-cli -s=site open "file:///X:/Master/index.html" --config=cli.config.json
playwright-cli -s=site resize 375 900
playwright-cli -s=site --raw eval "JSON.stringify({vw: innerWidth, scrollW: document.documentElement.scrollWidth})"
playwright-cli -s=site console error
playwright-cli -s=site screenshot --filename=375.png
playwright-cli -s=site close
```

Repeat the resize, eval and screenshot at 320, 375, 768, 1024 and 1440 at minimum, plus any width near a breakpoint you touched. The check passes when `scrollW` equals `vw` at every width, `console error` reports 0 errors, and you have looked at the screenshots. For hero changes, also compare the `scrollWidth` of `.hero__title` against its `clientWidth`. Both the overflow check and the console check were seen failing on deliberately broken pages on 2026-10-12. Always finish with `close`. After that, `playwright-cli list` should show `(no browsers)`.

The in-app browser pane is **not** a valid check for `file://` pages, because it renders them as an unstyled static snapshot. Over HTTP, through the `portfolio` launch config, it renders correctly. That is fine for a quick look, but it does not replace the width sweep.

## Deploy

Pages builds from `main` at path `/` (legacy build). A push to `main` is the deploy, so commit and push only when Master asks. After a push, confirm the build:

```bash
gh api repos/governorgene/eugene-libalib-portfolio/pages/builds/latest --jq '{status, commit}'
```

The output must show `"status":"built"` and a `commit` equal to `git rev-parse HEAD`. A build took about 75 seconds on 2026-10-12. If it is still building, check again. If it errored, read `error.message` in the full response. Then confirm the live page returns 200:

```bash
curl -s -o /dev/null -w "%{http_code}" https://governorgene.github.io/eugene-libalib-portfolio/
```

## CV PDF export

Edit `CV/Eugene_Libalib_CV.html`, then:

```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.claude\skills\branded-pdf-report\scripts\export-pdf.ps1" -Html X:\Master\CV\Eugene_Libalib_CV.html
Copy-Item X:\Master\CV\Eugene_Libalib_CV.pdf X:\Master\assets\Eugene_Libalib_CV.pdf
```

- With no `-Pdf`, the script writes `CV/Eugene_Libalib_CV.pdf` next to the HTML. It waits for fonts and prints A4 with backgrounds. If a stylesheet or font request fails, or the font gate (Anton, Poppins) fails, it refuses to print and leaves the old PDF in place. Success is exit code 0 plus `PASS: every expected web font is embedded.`
- Don't skip the copy step. The site serves `assets/Eugene_Libalib_CV.pdf`, which is a separate file. After copying, the two files must have the same SHA256 (`Get-FileHash`).
- The CV must stay a single A4 page, and its text must extract as clean sentences (check with pypdf, because Canva-era exports doubled characters).
- Re-exporting an unchanged HTML file changes only timestamp bytes, so don't commit a re-export unless the source changed.
- Run the same command with `-Html X:\Master\CV\Eugene_Libalib_Cover_Letter.html` for the generic cover letter. It isn't copied to `assets/`.
- Never use a bare `chrome --print-to-pdf` or `playwright-cli pdf`. The first can print before the web fonts load, and the second prints US Letter without backgrounds.

## The journal: `Portfolio/tasks/todo.md`

The journal is append-only and reverse-chronological. It is not a checklist.

- Each session adds a `## YYYY-MM-DD · Short title` section directly below the file's header, above earlier entries. Nothing gets deleted.
- Checkboxes sit flat at column 0. A ticked `- [x]` carries its proof inline, such as a commit SHA, the Pages build status and commit, a live HTTP status, a SHA256, or the widths measured and what was measured. Never just "done".
- An open `- [ ]` names who owes it ("Owner's call", "Needs from Gene").
- When a statement is superseded, strike it through with `~~...~~` and follow it with `Corrected YYYY-MM-DD:` or `Resolved YYYY-MM-DD:` and the replacement fact.
- Everything from `## Plan` down is the original v1 build history (plan, redesign pass, reviews v1 to v5). Leave it as it is.
- The journal is public on the live site, so write it with that in mind.

`Portfolio/tasks/lessons.md` gets one entry per correction from Master. Title each entry with the rule itself and end it with a **How to apply:** line. Read it at the start of a session.
