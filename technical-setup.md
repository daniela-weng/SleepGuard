# Technical Setup

## Web App — SleepGuard (React)

**Platform:** React 18 + TypeScript + Vite, Tailwind CSS v4, shadcn/ui
**Location:** `Web App/SleepGuard/`
**Run:** `cd "Web App/SleepGuard" && npm install && npm run dev` — Vite picks an open port (printed in the terminal)
**Typecheck:** `npx tsc` from `Web App/SleepGuard/` before considering a change done

This is the only active platform — the earlier iOS/SwiftUI track has been dropped.

### Screen Variants
`App.tsx` renders a single `PhoneFrame` (390×844) with a pill switcher for 4 design variants. **H is the actively-developed variant** — J/K are earlier alternate-layout explorations kept for comparison, not maintained in lockstep with H.

| Variant | File | Status |
|---------|------|--------|
| H | `components/morning/MorningSummarySunrise.tsx` | Primary — week/month sleep summary, ratings, drill-down |
| J | `components/morning/MorningSummaryMetric.tsx` | Alternate layout exploration |
| K | `components/morning/MorningSummaryCare.tsx` | Alternate layout exploration |
| M | `components/morning/MascotGallery.tsx` | Mascot mood/expression gallery |

### File Map
```
components/
  PhoneFrame.tsx               — device chrome; scrollable 390×844 frame + toolbar slot
  morning/
    shared.tsx                 — design tokens + shared pieces: AhiRing, DayCircle, MonthGrid,
                                  SleepRating, ViewToggle, MonthTrends (incl. "Doctor's Notes")
    MorningSummarySunrise.tsx  — H: week/month toggle, day ratings, AHI ring, "See details" entry
    SleepDetailScreen.tsx      — drill-down: Breathing / Oxygen Level / Sleep Quality tabs,
                                  hypnogram, event log, "Questions for Your Doctor"
    MascotGallery.tsx          — Wink / Sunny / Breezy / Luna / Pip, mood-reactive expressions
    MorningSummaryMetric.tsx, MorningSummaryCare.tsx — J/K alternate layouts
  ui/                          — shadcn/ui primitives (button, card, badge, avatar, progress, separator)
```

### Orphaned files (still on disk, not imported by `App.tsx`)
Leftover from an earlier tabbed-app draft, before the pivot to the "Morning Summary" variant exploration — don't build on these without checking with the user first, since no decision has been made to delete vs. revive them:
`components/TabBar.tsx`, `TreatmentView.tsx`, `SettingsView.tsx`, `ChatWidget.tsx`, `Toggle.tsx`, `SleepSummary.tsx`, `SpO2Chart.tsx`, `data/sleepData.ts`.
