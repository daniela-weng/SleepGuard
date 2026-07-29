import { useState } from "react";
import {
  AhiRing,
  AlertBanner,
  BODY_FONT,
  DayCircle,
  FaceRating,
  getSeverity,
  HEADING_FONT,
  MONTH,
  MonthGrid,
  PAGE_BG,
  PRIMARY,
  SUMMARY,
  ViewToggle,
  WEEK,
} from "./shared";

export default function MorningSummaryCare() {
  const [dayIndex, setDayIndex] = useState(WEEK.length - 1);
  const [view, setView] = useState<"week" | "month">("week");
  const [tracking, setTracking] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const day = WEEK[dayIndex];
  const severity = getSeverity(day.ahi);
  const history = [...WEEK].reverse().slice(1); // past days, most recent first, excluding today

  return (
    <div
      className="flex h-full flex-col overflow-y-auto pb-8"
      style={{ fontFamily: BODY_FONT, backgroundColor: PAGE_BG }}
    >
      {/* Flat blue hero — no gradient */}
      <div className="rounded-b-[12px] px-5 pb-6 pt-16" style={{ backgroundColor: PRIMARY }}>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-white" style={HEADING_FONT}>
            Good morning, Celena!
          </p>
          <span
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            aria-hidden="true"
          >
            ✓
          </span>
        </div>

        <button
          type="button"
          onClick={() => setTracking((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] bg-white py-3.5 text-base font-semibold"
          style={{ color: PRIMARY }}
        >
          {tracking ? "Stop Tracking" : "Start Tonight's Tracking"}
        </button>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-amber-950" style={HEADING_FONT}>
            This Week
          </p>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {view === "week" ? (
          <div className="flex justify-between">
            {WEEK.map((d, i) => (
              <DayCircle key={d.date} day={d} active={i === dayIndex} onClick={() => setDayIndex(i)} />
            ))}
          </div>
        ) : (
          <MonthGrid data={MONTH} />
        )}

        {severity === "Severe" && <AlertBanner />}

        {/* "Last Night" — appointment-card style row */}
        <div className="flex items-center gap-3 rounded-[12px] bg-white p-4 ring-1 ring-amber-100">
          <AhiRing ahi={day.ahi} size={64} />
          <div className="flex flex-col">
            <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
              Last Night
            </p>
            <p className="text-base text-amber-800/70">{SUMMARY[severity]}</p>
          </div>
        </div>

        {/* History list — "Top Doctors" style rows */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
            History
          </p>
          {history.map((d) => {
            const s = getSeverity(d.ahi);
            return (
              <div
                key={d.date}
                className="flex items-center justify-between rounded-[12px] bg-white p-3 ring-1 ring-amber-100"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: s === "Severe" ? "#c0402a" : PRIMARY }}
                  />
                  <span className="text-base font-medium text-amber-950">{d.date}</span>
                </div>
                <span className="text-base text-amber-800/70">
                  {d.ahi} events/hr · {s}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-[12px] bg-white p-4 ring-1 ring-amber-100">
          <FaceRating value={rating} onChange={setRating} />
        </div>

        {/* Decorative bottom nav, matching the reference's floating bar */}
        <div className="mt-2 flex justify-around rounded-[12px] bg-white py-3 ring-1 ring-amber-100">
          {["🌙", "📊", "⚙️"].map((icon, i) => (
            <span key={i} className="text-lg opacity-60" aria-hidden="true">
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
