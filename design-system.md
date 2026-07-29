# Design System

Tokens and component conventions for the SleepGuard web app (`Web App/SleepGuard/src/components/morning/shared.tsx` unless noted). Written for a 65+ audience — legibility and touch-target size take priority over density.

## Color

| Token | Hex | Use |
|-------|-----|-----|
| `PRIMARY` | `#4f7ea3` | Blue accent — rings, chart lines/bars, active states |
| `PRIMARY_SHADOW` | `#2f5169` | Darkest blue — headers, button shadows, and any surface that needs to carry normal-size text (see Accessibility below) |
| `MODERATE_ACCENT` | `#d99a3f` | Moderate-severity marker (gold) — reserved for AHI severity only |
| `ALERT_ACCENT` | `#c0402a` | Severe-severity marker (red) — reserved for AHI severity, plus the one deliberate exception below |
| `TRACK` | `#dbe9f5` | Lightest blue — ring tracks, dashed reference lines, card strokes |

Charts (breathing rate, SpO₂, event bars, sleep-stage hypnogram) are blue-only — no amber/red — except the AHI severity system itself, which is the one place gold/red are allowed to appear.

Card strokes are light blue (`ring-1 ring-[#dbe9f5]`), not gold — this was corrected during the accessibility pass; if you see `ring-amber-100` on a card, it's stale.

**Exception:** the landing page's "Call Emergency Contact" button uses `ALERT_ACCENT` red decoratively — a deliberate, considered break from the "AHI-severity-only" rule, since a life-safety call action benefits from the universally-recognized urgent/danger color more than it benefits from strict token discipline.

## Typography
- Headings: Sora, `HEADING_FONT` token
- Body: Manrope, `BODY_FONT` token
- **Minimum font size is 16px everywhere** — no exceptions, including captions and chart labels
- Card headings: Sora semibold, 20px (`text-[20px]`)
- Card body/bullets: Manrope regular, 16px

## Spacing & Shape
- Corner radius is fixed at `12px` (`rounded-[12px]`) for cards, buttons, inputs, segmented controls, and sheets. Circular icons and toggles remain circular.
- Card recipe: `rounded-[12px] bg-white p-4 ring-1 ring-[#dbe9f5]` (16px padding on all sides)
- Spacing follows a loose 4px grid (`gap-1`/`gap-2`/`gap-3`, `p-3`/`p-4`)

## Component Species
Three distinct button patterns are in use — don't blend them:
1. **Primary filled CTA** — solid `PRIMARY` background, white text, drop shadow (e.g. "Start Tonight's Tracking")
2. **Toggle / segmented control** — Week/Month, the Sleep Details tabs; active segment fills solid, inactive is text-only
3. **Plain text link** — "See details," "Doctor's Notes," "Save"; no fill, just colored text

Circular icon buttons (day circles, sleep-rating faces) are ≥48px — keep touch targets generous; 44px is the practical minimum for anything interactive, 24×24 is the hard WCAG floor.

## Accessibility (WCAG 2.1 AA)
Verified live against rendered colors (canvas-resolved, not assumed) — worth re-checking with the same method after any color change, since a couple of non-obvious failures turned up:
- **Normal text needs 4.5:1, large text (≥24px, or ≥~18.66px bold) needs 3:1.** The common "18px/14px bold" shorthand under-counts the true pt→px conversion — verify against the stricter threshold.
- **Plain `PRIMARY` on white (or white on `PRIMARY`) tops out at 4.33:1** — it will never clear 4.5:1 no matter the opacity. Any normal-size text using `PRIMARY` as a foreground or background must either switch to `PRIMARY_SHADOW` (8.39:1, plenty of margin) or be sized/weighted to legitimately qualify as large text.
- **Opacity-modified text is a common silent failure** — `text-amber-800/70` measured 3.7:1 (fails); bumped to `/90` to pass. Check any new `/NN` opacity text color against its actual background, not just the base color.
- **Light-colored chart fills need dark text, not white** — e.g. the sleep-stage bars: white text on the light blue "REM"/"Awake" fills measured 1.4–2.2:1. Pick text color per-background, not uniformly.
- **Don't rely on hover alone for information.** The month-view severity dots originally exposed AHI/rating only via a hover tooltip on a non-focusable `<div>` — invisible to keyboard, screen reader, and touch-only users. Fixed by making them real `<button>`s with a full `aria-label`, a `focus-visible` ring, and tap-to-toggle in addition to hover.
