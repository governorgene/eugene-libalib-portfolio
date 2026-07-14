# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

This directory is currently empty — no source files, build config, or git history exist yet. When a project is added here, replace the sections below with real content. Until then, do not invent commands or architecture; ask the user what belongs here.

## Environment

- Windows 11, PowerShell is the primary shell. Use PowerShell-native syntax (`$env:VAR`, `$null`, backtick line continuation) — not bash equivalents. Bash is available via the Bash tool for POSIX scripts when needed.
- Not a git repository. If version control is wanted here, confirm with the user before running `git init`.

## To be filled in once code exists

- **Build / run / test commands** — including how to run a single test.
- **Architecture** — the cross-file "big picture" that isn't obvious from any single file.
- **Project-specific conventions** — anything that would surprise a new contributor.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately — don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

### 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern.
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until mistake rate drops.
- Review `tasks/lessons.md` at session start for relevant project context.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

## Task Management

1. **Plan First** — write plan to `tasks/todo.md` with checkable items.
2. **Verify Plan** — check in before starting implementation.
3. **Track Progress** — mark items complete as you go.
4. **Explain Changes** — high-level summary at each step.
5. **Document Results** — add a review section to `tasks/todo.md`.
6. **Capture Lessons** — update `tasks/lessons.md` after corrections.

## Core Principles

- **Simplicity First** — make every change as simple as possible. Impact minimal code.
- **No Laziness** — find root causes. No temporary fixes. Senior-developer standards.
- **Minimal Impact** — changes should only touch what's necessary. Avoid introducing bugs.
