# Claude Wearable Project

An AI-driven wearable + companion app concept for monitoring breathing/sleep patterns in seniors with sleep apnea. This file holds only the standing rules Claude must follow while working in this repo — everything else (product spec, design tokens, build info, iteration history) lives in the linked docs.

- [project-brief.md](project-brief.md) — product goal, target user, core problem, why a wearable, AI's role, product boundaries
- [technical-setup.md](technical-setup.md) — platform, file map, run/typecheck commands
- [design-system.md](design-system.md) — colors, typography, spacing, component/button/card/chart conventions
- [prototype-notes.md](prototype-notes.md) — screen flow, key interactions, feedback log, open next steps
- [iteration-progress.md](iteration-progress.md) — what changed each version and why, which versions are kept for comparison

## Writing Style
- User-facing copy: plain language, no unexplained jargon or acronyms in the primary view (e.g. say "breathing pauses," not "AHI" — the acronym only appears in the month view's "Doctor's Notes" clinical translation, by design)
- Health-status tone: warm but honest — never falsely reassuring, never alarmist. Match the existing severity ladder (`Normal → Mild → Moderate → Severe`, headlines "Good Night" → "Rough Night", escalating to "worth watching" → "call your doctor")
- Minimum 16px text everywhere, short sentences — this is a 65+ audience; don't write or approve dense paragraphs

## Product Boundaries (what Claude must never imply this product does)
- Never present any AI-generated output as a diagnosis. This concept observes and flags patterns; a doctor makes the call — keep that framing in any copy or feature you add.
- Never fabricate clinical statistics, studies, or regulatory claims (FDA clearance, clinical validation, etc.) that weren't explicitly provided by the user.
- Don't invent new severity language ad hoc — reuse the Normal/Mild/Moderate/Severe system already defined in `shared.tsx`.
- This is a prototype/mockup (see `prototype-notes.md`). Don't write code or copy implying a real device connection, real data persistence, or regulatory compliance unless the user explicitly says otherwise.

## Healthcare Safety
- Don't add or suggest features that could delay a real medical response (e.g., never imply this app is a substitute for calling emergency services).
- Keep "call your doctor"-style escalation copy clearly visible — don't bury or remove it for aesthetic reasons.
- Don't soften or remove severity alerting to make a screen "look nicer" unless the user explicitly asks for that trade-off, and flag the safety implication if they do.

## Repo Scope Discipline
- Stay scoped to the file(s) the request is actually about. Variant **H** (`components/morning/MorningSummarySunrise.tsx`) is the only actively-maintained screen — don't touch J/K/M or the orphaned files (see `technical-setup.md`) unless explicitly asked.
- Never delete or move files without confirming first.
- Always typecheck (`npx tsc` from `Web App/SleepGuard/`) and verify in the browser preview before considering a change done.
