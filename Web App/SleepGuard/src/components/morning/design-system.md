# Design System — Morning Summary (Sunrise)

Source of truth: [`MorningSummarySunrise.tsx`](./MorningSummarySunrise.tsx). This doc describes what's actually implemented there as of this export — if the component changes, re-export rather than hand-editing this file out of sync.

## Fixed vs. themeable

Two elements are locked to blue and never change: the **restfulness ring** (track + progress arc) and the **primary CTA button**. Everything else — hero background, cards, badges, text — uses the warm amber palette. This split is intentional: blue marks the two "focal" elements (the data visualization and the action), amber carries the ambient/supporting surface.

## Typography

| Role | Font | Notes |
|---|---|---|
| Headings | **Sora** (600/700) | Greeting label is body font, not heading — see Color table |
| Body | **Manrope** | Applied at the screen root, inherited everywhere except headings |

Loaded via Google Fonts `<link>` in `index.html` (not a Tailwind theme token — set inline via `HEADING_FONT`/`BODY_FONT` constants).

### Type scale in use
`text-4xl` (36px) ring score → `text-3xl` (30px) headline → `text-lg` (18px) section title ("Last night") → `text-base` (16px) greeting/card titles → `text-sm` (14px) everything else (summary message, badge notes, row labels/values).

## Color

### Fixed (blue) — never themed
| Token | Value | Used for |
|---|---|---|
| `PRIMARY` | `#4f7ea3` | Ring progress arc, CTA button background |
| `PRIMARY_SHADOW` | `#2f5169` | CTA button drop shadow (at 50% opacity) |
| `TRACK` | `#dbe9f5` | Ring's unfilled track |
| Ring inner text | Tailwind `sky-950` / `sky-700` | Score number / "restful" label |
| Greeting text | Tailwind `sky-800` | "Good morning" — sits on the blue top of the hero gradient |

### Warm (amber) — everything else
| Token | Value | Used for |
|---|---|---|
| `HERO_TOP_BLUE` | `#E3EEF7` | Hero gradient, 0% stop (blue, top edge) |
| `HERO_MID` | `#FBF3E2` | Hero gradient, 55% stop (cream, transition) |
| `HERO_TO` | `#F0DCA0` | Hero gradient, 100% stop (gold, bottom edge) |
| Page background | `#FAF6EC` | Screen background, inline arbitrary value |
| `BADGE_BG` / `BADGE_TEXT` | `#f5eeda` / `#5f4a1f` | Neutral badges (Breathing, Oxygen) |
| `SECONDARY_BG` / `SECONDARY_TEXT` | `#f5e8cf` / `#5a3f14` | "Good" badge (Sleep → Restful) |
| Headline/title/value text | Tailwind `amber-950` | Headline, stat titles, "Last night" title, row values |
| Muted/label text | Tailwind `amber-800`, `amber-800/70`, `amber-900/80` | Summary message, row labels |
| Card border | Tailwind `ring-amber-100` | All card outlines |
| Separator | Tailwind `bg-amber-100` | Divider in "Last night" card |
| Card fill | white | All cards |

**Hero gradient**: `linear-gradient(180deg, ${HERO_TOP_BLUE} 0%, ${HERO_MID} 55%, ${HERO_TO} 100%)` — vertical "sunrise": blue sky at the top, fading through cream, to gold at the bottom.

### Contrast (WCAG)
Both badge pairs verified against real computed styles in-browser:
- Neutral badge (`BADGE_BG`/`BADGE_TEXT`): **7.29:1** — AAA
- Good badge (`SECONDARY_BG`/`SECONDARY_TEXT`): **8.04:1** — AAA

Amber/gold was chosen as the secondary hue specifically because it sits on the blue-yellow axis, which stays distinguishable under the most common (red-green) color vision deficiencies — safer than a green or purple secondary would have been.

## Spacing

**4px grid, no exceptions** — every padding value in the component is a multiple of 4px (audited: 16 padded elements, 0 violations).

| Element | Value | Pixels |
|---|---|---|
| Screen container | `px-5 pt-16 pb-8` | 20 / 64 / 32 |
| Hero | `p-6` | 24 |
| Stat/detail cards | `py-4` (+ shadcn's built-in 16px `CardContent` padding) | 16 |
| Badges | `px-3 py-1` | 12 / 4 |
| CTA button | `p-4` | 16 |
| Section gaps | `gap-4` / `gap-3` / `gap-1.5` / `gap-2` | 16 / 12 / 6 / 8 |

## Shape

- **Corner radius**: uniform `12px` (`rounded-[12px]`) on rectangular app surfaces, controls, and sheets. Icons, toggles, and other intentionally circular elements remain circular.
- **Shadows**: cards use Tailwind `shadow-sm`; the CTA button uses a custom shadow (`2px 2px 8px`, `PRIMARY_SHADOW` at 50% opacity) rather than a Tailwind preset.

## Components

Built on shadcn/ui primitives, restyled per-instance via inline `style` (not Tailwind theme tokens, since this palette is specific to this screen, not the whole app):
- `Card` / `CardContent`
- `Badge`
- `Button`
- `Separator`

## Layout structure

1. Full-bleed sunrise-gradient hero: greeting → headline → summary sentence → 144px radial ring (hand-rolled SVG, not a charting library)
2. 3-column stat row (Breathing / Oxygen / Sleep), each a `Card` with a title + colored `Badge`
3. "Last night" detail card (`Card` + `Separator` + label/value rows)
4. Full-width CTA `Button`, pinned to the bottom via `mt-auto`

## Data source

Copy and sample values come from [`data.ts`](./data.ts) in this folder — shared across all three Morning Summary variants (Serene, Sunrise, Minimal Trust) so content stays identical when comparing visual treatments.
