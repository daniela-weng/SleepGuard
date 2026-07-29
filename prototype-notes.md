# Prototype Notes

Everything here describes variant **H**, the actively-maintained screen. This is a front-end mockup — no real device, backend, or persistence (see `technical-setup.md` for what's mocked vs. wired up).

## Screen Flow
```
Good morning header (greeting + mood-linked mascot badge)
  └─ Week / Month toggle
       ├─ Week view
       │    ├─ 7 day-circles (tap to select a day)
       │    ├─ headline + plain-language summary for the selected day
       │    ├─ "See details" ──▶ Sleep Details screen
       │    │     ├─ Breathing tab
       │    │     ├─ Oxygen Level tab
       │    │     └─ Sleep Quality tab
       │    │     (back arrow returns to Week view)
       │    └─ "Rate last night's sleep" (0–10 faces)
       └─ Month view
            ├─ severity-dot calendar (tap/hover a dot for AHI + rating)
            └─ "Observed trends" card ──▶ "Doctor's Notes" reveals the clinical-language version
  └─ "Start Tonight's Tracking" CTA (Week/Month views only, not on Sleep Details)
```

## Key Interactions
- Tap a day circle → switches the selected day's headline/summary/ring below it
- Rate last night's sleep (0–10 scale, 5 faces) → the score appears inside today's day-circle and in the month view's hover tooltip for today
- Week/Month toggle → swaps the whole content area below the header
- Month-view dot → tap **or** hover reveals an AHI + rating tooltip; it's keyboard-focusable, not hover-only
- "See details" → opens the Sleep Details screen for whichever day is currently selected
- Sleep Details tabs → switch between Breathing / Oxygen Level / Sleep Quality without leaving the screen
- "Questions for Your Doctor" → free-text input + Save, appends to a running list, each entry removable

## Mockup Feedback Log
Notable feedback that shaped the current design (full build history in `iteration-progress.md`):
- Mascot faces went through several rounds — "the eyes are scary" led to a simplified plain-dot-eye design; Luna's beak orientation was flipped, flipped back, then locked to always point down after testing showed the flipped version read as unclear
- "Take out AHI" — the acronym was removed from the primary Week view entirely; it now only surfaces inside the month view's "Doctor's Notes" clinical translation
- A full pill-shaped button/toggle redesign was built to spec, then explicitly scratched and reverted — noted here so it doesn't get accidentally reintroduced as "the design system"
- The landing page has a hard **no-scroll** requirement — every later addition (ratings, buttons, badges) had to fit inside the existing viewport without pushing the page into scroll

## Next Steps / Open Items
- J's CTA button doesn't yet use the sticky-bottom pattern established in H
- Month-view tooltip clips against the phone frame's right edge for dots in the rightmost column (cosmetic — the underlying `aria-label` still carries full info)
- Orphaned files (`technical-setup.md`) haven't been triaged — no decision yet on delete vs. revive
- No real device/backend integration has been started
