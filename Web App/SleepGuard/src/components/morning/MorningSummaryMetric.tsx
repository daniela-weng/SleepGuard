import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ALERT_ACCENT,
  AlertBanner,
  BODY_FONT,
  FaceRating,
  getSeverity,
  HEADING_FONT,
  MONTH,
  MonthGrid,
  PAGE_BG,
  PRIMARY,
  PRIMARY_SHADOW,
  ViewToggle,
  WEEK,
} from "./shared";

export default function MorningSummaryMetric() {
  const [dayIndex, setDayIndex] = useState(WEEK.length - 1);
  const [view, setView] = useState<"week" | "month">("week");
  const [tracking, setTracking] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const day = WEEK[dayIndex];
  const severity = getSeverity(day.ahi);
  const weekAvg = Math.round(WEEK.reduce((sum, d) => sum + d.ahi, 0) / WEEK.length);
  const bestNight = Math.min(...WEEK.map((d) => d.ahi));

  return (
    <div
      className="flex h-full flex-col gap-4 overflow-y-auto px-5 pb-8 pt-16"
      style={{ fontFamily: BODY_FONT, backgroundColor: PAGE_BG }}
    >
      {/* Date text tabs */}
      <div className="flex justify-between">
        {WEEK.map((d, i) => {
          const active = i === dayIndex;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setDayIndex(i)}
              className="flex flex-col items-center gap-0.5"
            >
              <span className={`text-base ${active ? "text-amber-900" : "text-amber-700/60"}`}>
                {d.label}
              </span>
              <span
                className={`text-base ${active ? "font-semibold text-amber-950" : "text-amber-700/60"}`}
              >
                {d.date.split(" ")[1]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "month" ? (
        <MonthGrid data={MONTH} />
      ) : (
        <>
          {severity === "Severe" && <AlertBanner />}

          {/* Giant number hero, flat card (no gradient) */}
          <div className="rounded-[12px] bg-amber-50 p-6 text-center ring-1 ring-amber-100">
            <p className="text-base text-amber-800">AHI (Apnea-Hypopnea Index)</p>
            <p
              className="text-7xl font-semibold leading-none"
              style={{ ...HEADING_FONT, color: severity === "Severe" ? ALERT_ACCENT : "#3E2E12" }}
            >
              {day.ahi}
            </p>
            <p className="mt-1 text-base text-amber-800">events/hr · {severity}</p>
          </div>

          {/* 3 stat pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[12px] bg-white p-3 text-center ring-1 ring-amber-100">
              <p className="text-base text-amber-700">Last night</p>
              <p className="text-xl font-semibold text-amber-950">{day.ahi}</p>
            </div>
            <div className="rounded-[12px] bg-white p-3 text-center ring-1 ring-amber-100">
              <p className="text-base text-amber-700">Week avg</p>
              <p className="text-xl font-semibold text-amber-950">{weekAvg}</p>
            </div>
            <div className="rounded-[12px] bg-white p-3 text-center ring-1 ring-amber-100">
              <p className="text-base text-amber-700">Best night</p>
              <p className="text-xl font-semibold text-amber-950">{bestNight}</p>
            </div>
          </div>

          {/* Detail card, in place of a gradient progress bar */}
          <div className="rounded-[12px] bg-white p-4 ring-1 ring-amber-100">
            <FaceRating value={rating} onChange={setRating} />
          </div>
        </>
      )}

      <Button
        onClick={() => setTracking((v) => !v)}
        className="mt-auto min-h-14 rounded-[12px] p-4 text-lg font-medium text-white"
        style={{ backgroundColor: PRIMARY, boxShadow: `2px 2px 8px ${PRIMARY_SHADOW}80` }}
      >
        {tracking ? "Stop Tracking" : "Start Tonight's Tracking"}
      </Button>
    </div>
  );
}
