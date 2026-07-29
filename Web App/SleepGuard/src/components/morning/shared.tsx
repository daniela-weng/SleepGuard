import { useState } from "react";

export const HEADING_FONT = { fontFamily: "'Sora', sans-serif" };
export const BODY_FONT = "'Manrope', sans-serif";

// Ring + CTA stay blue (fixed, per design system); everything else is warm amber.
export const PRIMARY = "#4f7ea3";
export const PRIMARY_SHADOW = "#2f5169";
export const TRACK = "#dbe9f5";

export const PAGE_BG = "#FAF6EC";

// Alert is a third color — only ever shown when AHI is severe.
export const ALERT_BG = "#fbe2dc";
export const ALERT_TEXT = "#7a2410";
export const ALERT_ACCENT = "#c0402a";

// Moderate gets its own gold/amber marker, distinct from the severe red.
export const MODERATE_ACCENT = "#d99a3f";

export type Severity = "Normal" | "Mild" | "Moderate" | "Severe";

export function getSeverity(ahi: number): Severity {
  if (ahi < 5) return "Normal";
  if (ahi < 15) return "Mild";
  if (ahi < 30) return "Moderate";
  return "Severe";
}

export const HEADLINE: Record<Severity, string> = {
  Normal: "Good Night",
  Mild: "Mostly Good",
  Moderate: "Fair Night",
  Severe: "Rough Night",
};

export const SUMMARY: Record<Severity, string> = {
  Normal: "Breathing stayed steady all night.",
  Mild: "A few pauses — nothing urgent.",
  Moderate: "More pauses than usual — worth watching.",
  Severe: "Breathing paused often — call your doctor.",
};

export type DaySummary = { label: string; date: string; ahi: number };

// Up to a week of history — last entry is today.
export const WEEK: DaySummary[] = [
  { label: "M", date: "Jul 15", ahi: 4 },
  { label: "T", date: "Jul 16", ahi: 9 },
  { label: "W", date: "Jul 17", ahi: 22 },
  { label: "T", date: "Jul 18", ahi: 34 },
  { label: "F", date: "Jul 19", ahi: 12 },
  { label: "S", date: "Jul 20", ahi: 7 },
  { label: "S", date: "Jul 21", ahi: 18 },
];

// A month of AHI history, oldest first, for the calendar-style overview.
export const MONTH: number[] = [
  6, 9, 14, 3, 18, 25, 4, 7, 12, 29, 5, 16, 20, 8, 11, 34, 6, 9, 15, 22, 3, 13, 7, 10, 28, 5, 17,
  9, 4, 18,
];

export function AhiRing({ ahi, size = 144 }: { ahi: number; size?: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  // Fuller ring = better night (lower AHI), consistent across the app.
  const pct = Math.max(0, 1 - Math.min(ahi, 40) / 40);
  const offset = circumference * (1 - pct);
  const scoreSize = size >= 120 ? "text-4xl" : size >= 80 ? "text-2xl" : "text-lg";
  const showLabel = size >= 80;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke={TRACK} strokeWidth={12} />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={PRIMARY}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${scoreSize} font-semibold text-sky-950`}>{ahi}</span>
        {showLabel && <span className="text-base text-sky-700">events/hr</span>}
      </div>
    </div>
  );
}

export function AlertBanner() {
  return (
    <div className="flex items-center gap-3 rounded-[12px] p-4" style={{ backgroundColor: ALERT_BG }}>
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
        style={{ backgroundColor: ALERT_ACCENT }}
        aria-hidden="true"
      >
        !
      </span>
      <p className="text-base font-medium" style={{ color: ALERT_TEXT }}>
        This night stood out — worth a call to your doctor soon.
      </p>
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg font-semibold text-amber-950" style={HEADING_FONT}>
      {children}
    </p>
  );
}

export function DayCircle({
  day,
  active,
  onClick,
  score,
}: {
  day: DaySummary;
  active: boolean;
  onClick: () => void;
  score?: number;
}) {
  const severity = getSeverity(day.ahi);
  const isAlert = severity === "Severe";
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, 1 - Math.min(day.ahi, 40) / 40);
  const offset = circumference * (1 - pct);
  const color = isAlert ? ALERT_ACCENT : PRIMARY;
  const dim = 48;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      aria-label={day.date}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg
          viewBox="0 0 44 44"
          className="-rotate-90"
          style={{ width: dim, height: dim, opacity: active || score !== undefined ? 1 : 0.3 }}
        >
          <circle cx={22} cy={22} r={radius} fill="none" stroke={TRACK} strokeWidth={active ? 5 : 4} />
          <circle
            cx={22}
            cy={22}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={active ? 5 : 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {score !== undefined && (
          <span className="absolute text-base font-semibold text-amber-900">{score}</span>
        )}
      </div>
      <span className={`text-base font-semibold ${active ? "text-amber-900" : "text-amber-700"}`}>
        {day.label}
      </span>
    </button>
  );
}

const FACE_MOUTHS = [
  "M8 16.3c1.1-1.7 2.7-2.3 4-2.3s2.9.6 4 2.3", // bad
  "M8 15.2c1.1-.8 2.7-1 4-1s2.9.2 4 1", // meh
  "M8 15h8", // neutral
  "M8 14.2c1.1 1.1 2.7 1.5 4 1.5s2.9-.4 4-1.5", // good
  "M8 13.5c1.1 1.7 2.7 2.3 4 2.3s2.9-.6 4-2.3", // great
];

export function FaceRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
        Rate last night's sleep
      </p>
      <div className="flex justify-between">
        {FACE_MOUTHS.map((mouth, i) => {
          const selected = value === i;
          const stroke = selected ? "#ffffff" : "#8a651f";
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              aria-pressed={selected}
              aria-label={["Bad", "Meh", "Okay", "Good", "Great"][i]}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                selected ? "bg-amber-800" : "bg-white ring-1 ring-amber-100"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth={1.6} />
                <circle cx="8.5" cy="10" r="1.1" fill={stroke} />
                <circle cx="15.5" cy="10" r="1.1" fill={stroke} />
                <path d={mouth} stroke={stroke} strokeWidth={1.6} strokeLinecap="round" fill="none" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Faces on a 0–10 scale, used in place of FaceRating where a finer-grained
// score is wanted.
const SLEEP_RATING_VALUES = [0, 2, 5, 8, 10];
const SLEEP_RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Great"];
const SLEEP_RATING_MOUTHS = [
  "M8 16.3c1.1-1.7 2.7-2.3 4-2.3s2.9.6 4 2.3", // 0
  "M8 15.2c1.1-.8 2.7-1 4-1s2.9.2 4 1", // 2
  "M8 15h8", // 5
  "M8 14.2c1.1 1.1 2.7 1.5 4 1.5s2.9-.4 4-1.5", // 8
  "M8 13.5c1.1 1.7 2.7 2.3 4 2.3s2.9-.6 4-2.3", // 10
];

export function SleepRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
        Rate last night's sleep
      </p>
      <div className="flex justify-between">
        {SLEEP_RATING_VALUES.map((n, i) => {
          const selected = value === n;
          const stroke = selected ? "#ffffff" : "#8a651f";
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={selected}
              aria-label={`${SLEEP_RATING_LABELS[i]} (${n} out of 10)`}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                selected ? "bg-amber-800" : "bg-white ring-1 ring-amber-100"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth={1.6} />
                <circle cx="8.5" cy="10" r="1.1" fill={stroke} />
                <circle cx="15.5" cy="10" r="1.1" fill={stroke} />
                <path d={SLEEP_RATING_MOUTHS[i]} stroke={stroke} strokeWidth={1.6} strokeLinecap="round" fill="none" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: "week" | "month";
  onChange: (v: "week" | "month") => void;
}) {
  return (
    <div className="flex w-fit flex-shrink-0 gap-1 rounded-[12px] bg-white p-1 ring-1 ring-amber-100">
      {(["week", "month"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-[12px] px-3 py-1 text-base font-semibold capitalize transition-colors ${
            view === v ? "bg-amber-800 text-white" : "text-amber-800"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function MonthTrends({ data }: { data: number[] }) {
  const avg = Math.round(data.reduce((sum, ahi) => sum + ahi, 0) / data.length);
  const severeCount = data.filter((ahi) => getSeverity(ahi) === "Severe").length;
  const moderateCount = data.filter((ahi) => getSeverity(ahi) === "Moderate").length;
  const best = Math.min(...data);

  const bullets = [
    `Average: ${avg} events/hr`,
    severeCount > 0
      ? `${severeCount} night${severeCount > 1 ? "s" : ""} stood out as severe`
      : "No severe nights this month",
    `${moderateCount} night${moderateCount !== 1 ? "s" : ""} were moderate`,
    `Best night: ${best} events/hr`,
  ];

  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-4 ring-1 ring-amber-100">
      <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
        Observed trends
      </p>
      <ul className="flex flex-col gap-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-base text-amber-900/80">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: PRIMARY }}
            />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MonthGrid({ data, todayRating }: { data: number[]; todayRating?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 text-center text-base font-semibold text-amber-700">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-3">
        {data.map((ahi, i) => {
          const severity = getSeverity(ahi);
          const color =
            severity === "Severe" ? ALERT_ACCENT : severity === "Moderate" ? MODERATE_ACCENT : PRIMARY;
          // Only the last dot (today) has a rating tied to it — the rest of
          // this month's history was never rated in this mock.
          const rating = i === data.length - 1 ? todayRating : undefined;
          const open = openIndex === i;
          const ratingText = rating !== undefined ? `Rated ${rating} out of 10.` : "Not rated.";

          return (
            <button
              key={i}
              type="button"
              className="group relative flex h-6 w-full min-w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#4f7ea3] focus-visible:ring-offset-1"
              aria-label={`${ahi} events per hour, ${severity}. ${ratingText}`}
              onClick={() => setOpenIndex((prev) => (prev === i ? null : i))}
              onBlur={() => setOpenIndex((prev) => (prev === i ? null : prev))}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-[12px] px-3 py-2 text-center shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundColor: PRIMARY_SHADOW }}
              >
                <p className="text-base font-semibold text-white">{ahi} events/hr</p>
                <p className="text-base text-white/80">{rating !== undefined ? `Rated ${rating}/10` : "Not rated"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
