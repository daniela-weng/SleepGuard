import { useState } from "react";
import SpO2Chart from "./SpO2Chart";
import {
  AHI,
  AVG_HEART_RATE,
  SEVERITY,
  SEVERITY_META,
  SLEEP_DURATION,
  SPO2_NADIR,
} from "../data/sleepData";

function MetricCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-base text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${accent ?? "text-slate-900"}`}>
        {value}
        {unit && <span className="ml-1 text-lg font-normal text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}

export default function SleepSummary() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const meta = SEVERITY_META[SEVERITY];

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-16">
      <header>
        <p className="text-lg text-slate-500">Good morning</p>
        <h1 className="text-3xl font-semibold text-slate-900">Last Night's Sleep</h1>
      </header>

      {/* Severity alert banner */}
      <div className={`flex items-center gap-3 rounded-2xl p-4 ${meta.bg} bg-opacity-10`}>
        <span className={`h-4 w-4 flex-shrink-0 rounded-full ${meta.bg}`} aria-hidden="true" />
        <div>
          <p className={`text-lg font-semibold ${meta.color}`}>{meta.label} sleep apnea signs</p>
          <p className="text-base text-slate-600">{meta.description}</p>
        </div>
      </div>

      {/* 2x2 metric grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Breathing pauses" value={String(AHI)} unit="/ hr" accent={meta.color} />
        <MetricCard label="Lowest oxygen" value={String(SPO2_NADIR)} unit="%" accent="text-apneaRed" />
        <MetricCard label="Time asleep" value={SLEEP_DURATION} />
        <MetricCard label="Heart rate" value={String(AVG_HEART_RATE)} unit="bpm" />
      </div>

      {/* SpO2 chart */}
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 text-lg font-semibold text-slate-900">Oxygen levels overnight</p>
        <SpO2Chart />
      </div>

      {/* Live monitoring control */}
      <button
        type="button"
        onClick={() => setIsMonitoring((v) => !v)}
        className={`min-h-[56px] rounded-2xl text-xl font-semibold text-white transition-colors ${
          isMonitoring ? "bg-apneaRed" : "bg-apneaGreen"
        }`}
      >
        {isMonitoring ? "Stop Monitoring" : "Start Tonight's Monitoring"}
      </button>
    </div>
  );
}
