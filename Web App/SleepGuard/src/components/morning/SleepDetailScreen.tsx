import { useState } from "react";
import { Droplet, Moon, Wind } from "lucide-react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { AhiRing, BODY_FONT, type DaySummary, getSeverity, HEADING_FONT, HEADLINE, PRIMARY, PRIMARY_SHADOW, SectionHeading, SUMMARY } from "./shared";

type Tab = "breathing" | "oxygen" | "sleep";
type Row = { label: string; sub?: string; value: string; color: string };

export function BreathingIcon() { return <Wind className="h-4 w-4" strokeWidth={1.8} />; }
export function OxygenIcon() { return <Droplet className="h-4 w-4" strokeWidth={1.8} />; }
export function SleepQualityIcon() { return <Moon className="h-4 w-4" strokeWidth={1.8} />; }

const PAGE_BG = "#ffffff";
const DARK = PRIMARY_SHADOW;
const ACCENT = "#b45309";
const TEXT = "#451d13";
const CHART = PRIMARY;
const MUTED = "rgba(69,29,19,0.55)";
const events = [
  { type: "Obstructive Apnea", time: "11:52 PM", dur: 10 },
  { type: "Hypopnea", time: "1:14 AM", dur: 17 },
  { type: "Obstructive Apnea", time: "2:40 AM", dur: 24 },
];
const oxygenData = [
  ["10 PM", 97], ["", 97], ["", 97], ["", 96], ["12 AM", 97], ["", 93], ["", 97], ["", 97],
  ["2 AM", 96], ["", 97], ["", 94], ["", 97], ["4 AM", 97], ["", 92], ["", 97], ["6 AM", 97],
].map(([time, value]) => ({ time: String(time), value: Number(value) }));
const stages = [
  { label: "Deep Sleep", sub: "Most restorative", value: "1h 8m", color: DARK },
  { label: "REM Sleep", sub: "Memory & mood", value: "1h 23m", color: CHART },
  { label: "Light Sleep", sub: "Transition stage", value: "4h 19m", color: `${CHART}70` },
  { label: "Awake", sub: "Disruptions", value: "52m", color: `${DARK}28` },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[12px] bg-white p-4 ring-1 ring-[#dbe9f5] ${className}`}>{children}</div>;
}

function ArcRing({ pct, value }: { pct: number; value: string }) {
  const r = 23;
  const circle = 2 * Math.PI * r;
  return (
    <div className="relative h-14 w-14 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke={`${DARK}22`} strokeWidth="6" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={DARK} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${circle * pct} ${circle}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-semibold" style={{ color: DARK }}>{value}</span>
    </div>
  );
}

function Rows({ rows }: { rows: Row[] }) {
  return <div>{rows.map((row, i) => <div key={`${row.label}-${i}`} className={`flex items-center gap-3 py-3 ${i ? "border-t border-[#dbe9f5]" : "pt-0"} ${i === rows.length - 1 ? "pb-0" : ""}`}>
    <span className="h-3 w-3 flex-shrink-0 rounded-[12px]" style={{ backgroundColor: row.color }} />
    <div className="min-w-0 flex-1"><p className="text-base font-semibold" style={{ color: TEXT }}>{row.label}</p>{row.sub && <p className="text-base" style={{ color: MUTED }}>{row.sub}</p>}</div>
    <span className="text-base font-semibold" style={{ color: TEXT }}>{row.value}</span>
  </div>)}</div>;
}

function DarkHero({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded-[12px] px-4 py-[18px] ring-1 ring-[#dbe9f5]" style={{ backgroundColor: DARK }}>
    <p className="text-base font-semibold uppercase tracking-[0.06em] text-white/55">{label}</p>
    <p className="mt-1 text-[40px] font-semibold leading-none text-white">{value}</p>
    <p className="mt-1 text-base text-white/50">{sub}</p>
  </div>;
}

function BreathingTab() {
  return <div className="flex flex-col gap-2">
    <DarkHero label="Breathing Pauses" value="14s" sub="Longest pause · 3 total pauses detected" />
    <Card>{events.map((event, index) => <div key={event.time} className={`flex items-center gap-3.5 py-3 ${index ? "border-t border-[#dbe9f5]" : "pt-0"} ${index === events.length - 1 ? "pb-0" : ""}`}><ArcRing pct={event.dur / 30} value={`${event.dur}s`} /><div><p className="text-base font-semibold" style={{ color: TEXT }}>{event.type}</p><p className="mt-1 text-base" style={{ color: ACCENT }}>{event.time}</p></div></div>)}</Card>
  </div>;
}

function OxygenTab() {
  return <div className="flex flex-col gap-2">
    <DarkHero label="Lowest SpO₂ Reading" value="92%" sub="Lowest oxygen level recorded overnight" />
    <div className="flex gap-2"><Card className="flex-1"><p className="text-3xl font-semibold leading-none" style={{ color: TEXT }}>96%</p><p className="mt-1 text-base" style={{ color: MUTED }}>Average SpO₂</p></Card><Card className="flex-1"><p className="text-3xl font-semibold leading-none" style={{ color: TEXT }}>0m</p><p className="mt-1 text-base" style={{ color: MUTED }}>Below 90%</p></Card></div>
    <div className="flex flex-col gap-1">
      <SectionHeading>Oxygen Level Overnight</SectionHeading>
      <Card><ResponsiveContainer width="100%" height={132}><LineChart data={oxygenData} margin={{ top: 18, right: 16, left: 0, bottom: 4 }} style={{ outline: "none" }}><XAxis dataKey="time" tick={{ fontSize: 16, fill: MUTED }} axisLine={false} tickLine={false} interval="preserveStartEnd" /><YAxis domain={[88, 100]} hide /><ReferenceLine y={90} stroke={ACCENT} strokeDasharray="5 4" label={{ value: "90% threshold", position: "insideBottomLeft", fontSize: 16, fill: ACCENT }} /><Line type="monotone" dataKey="value" stroke={CHART} strokeWidth={2.5} dot={false} activeDot={false} /></LineChart></ResponsiveContainer><p className="mt-2 text-base font-semibold" style={{ color: TEXT }}>Time in Range</p><div className="mt-1.5 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: "#dbe9f5" }}><div className="h-full w-full rounded-full" style={{ backgroundColor: CHART }} /></div><div className="mt-1.5 flex justify-between text-base"><span style={{ color: CHART }}>Normal ≥90% — 100%</span><span style={{ color: MUTED }}>Below 90% — 0%</span></div></Card>
    </div>
    <Card><Rows rows={[{ label: "SpO₂ Dip", sub: "11:52 PM", value: "93%", color: CHART }, { label: "SpO₂ Dip", sub: "1:14 AM", value: "94%", color: CHART }, { label: "SpO₂ Dip", sub: "2:40 AM", value: "92%", color: CHART }]} /></Card>
  </div>;
}

function SleepTab() {
  return <div className="flex flex-col gap-2"><div className="grid grid-cols-2 gap-2"><div className="col-span-2"><DarkHero label="Total Sleep" value="7h 42m" sub="Quality: Restless" /></div><Card><p className="text-base font-semibold uppercase tracking-[0.05em]" style={{ color: MUTED }}>Deep Sleep</p><p className="mt-1 text-3xl font-semibold leading-none" style={{ color: TEXT }}>1h 8m</p><p className="mt-1 text-base" style={{ color: ACCENT }}>Most restorative</p></Card><Card><p className="text-base font-semibold uppercase tracking-[0.05em]" style={{ color: MUTED }}>Woke Up</p><p className="mt-1 text-3xl font-semibold leading-none" style={{ color: TEXT }}>3×</p><p className="mt-1 text-base" style={{ color: ACCENT }}>During the night</p></Card></div><div className="flex flex-col gap-1"><SectionHeading>Sleep Stage Breakdown</SectionHeading><Card><Rows rows={stages} /></Card></div></div>;
}

function DoctorQuestionsCard() {
  const [draft, setDraft] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const addQuestion = () => {
    const question = draft.trim();
    if (!question) return;
    setQuestions((current) => [...current, question]);
    setDraft("");
  };

  return <Card><p className="text-base font-semibold" style={{ color: TEXT }}>Questions for your doctor</p><p className="mt-1 text-base" style={{ color: MUTED }}>Save a question to bring to your next appointment.</p><div className="mt-3 flex flex-col gap-2"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a question" rows={3} className="w-full resize-none rounded-[12px] border border-[#dbe9f5] px-3 py-3 text-base outline-none focus:border-[#4f7ea3]" style={{ color: TEXT }} /><button type="button" onClick={addQuestion} className="w-full rounded-[12px] px-4 py-3 text-base font-semibold text-white" style={{ backgroundColor: PRIMARY_SHADOW }}>Add</button></div>{questions.length > 0 && <ul className="mt-3 flex flex-col gap-2">{questions.map((question) => <li key={question} className="flex gap-2 text-base" style={{ color: TEXT }}><span style={{ color: ACCENT }}>•</span>{question}</li>)}</ul>}</Card>;
}

export default function SleepDetailScreen({ day, onBack }: { day: DaySummary; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("sleep");
  const severity = getSeverity(day.ahi);
  const tabs: { key: Tab; label: string; Icon: typeof Wind }[] = [{ key: "breathing", label: "Breathing", Icon: Wind }, { key: "oxygen", label: "Oxygen", Icon: Droplet }, { key: "sleep", label: "Sleep", Icon: Moon }];
  const activeTabIndex = tabs.findIndex((item) => item.key === tab);
  return <div className="flex h-full flex-col overflow-y-auto overscroll-y-none" style={{ fontFamily: BODY_FONT, backgroundColor: PAGE_BG }}>
    <div className="flex items-center gap-3 rounded-b-[28px] px-5 pb-[20px] pt-14" style={{ backgroundColor: PRIMARY_SHADOW }}><button type="button" onClick={onBack} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg text-white">←</button><p className="text-xl font-semibold text-white" style={HEADING_FONT}>Sleep Details</p></div>
    <div className="flex flex-col gap-3 px-5 py-4"><div className="flex items-center gap-4 rounded-[12px] bg-white p-4"><AhiRing ahi={day.ahi} size={72} /><div><p className="text-lg font-semibold text-amber-950" style={HEADING_FONT}>{HEADLINE[severity]}</p><p className="mt-1 text-base leading-snug text-amber-900/80">{SUMMARY[severity]}</p></div></div>
      <div className="relative flex gap-0.5 overflow-hidden rounded-[12px] p-0.5" style={{ backgroundColor: "#dbe9f5" }}>
        <span
          className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-[12px] transition-transform duration-300 ease-out"
          style={{ width: "calc((100% - 4px) / 3)", backgroundColor: DARK, transform: `translateX(${activeTabIndex * 100}%)` }}
        />
        {tabs.map(({ key, label, Icon }) => <button key={key} type="button" onClick={() => setTab(key)} className="relative z-10 flex flex-1 flex-col items-center gap-1 rounded-[12px] px-1 py-3 text-base font-semibold" style={{ color: tab === key ? "#fff" : MUTED }}><Icon size={22} strokeWidth={1.8} />{label}</button>)}
      </div>
      {tab === "breathing" && <BreathingTab />}{tab === "oxygen" && <OxygenTab />}{tab === "sleep" && <SleepTab />}
      <DoctorQuestionsCard />
    </div>
  </div>;
}
