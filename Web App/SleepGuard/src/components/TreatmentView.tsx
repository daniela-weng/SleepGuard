import { SEVERITY, SEVERITY_META } from "../data/sleepData";

type RecStatus = "good" | "warning" | "avoid";

const STATUS_META: Record<RecStatus, { icon: string; color: string; bg: string }> = {
  good: { icon: "✓", color: "text-apneaGreen", bg: "bg-apneaGreen" },
  warning: { icon: "⚠", color: "text-apneaYellow", bg: "bg-apneaYellow" },
  avoid: { icon: "✗", color: "text-apneaRed", bg: "bg-apneaRed" },
};

const RECOMMENDATIONS: { status: RecStatus; title: string; detail: string }[] = [
  {
    status: "good",
    title: "Sleep on your side",
    detail: "Side-sleeping keeps your airway more open than sleeping on your back.",
  },
  {
    status: "good",
    title: "Keep a consistent bedtime",
    detail: "Going to sleep and waking at the same time helps stabilize breathing patterns.",
  },
  {
    status: "warning",
    title: "Limit alcohol before bed",
    detail: "Alcohol relaxes throat muscles and can make breathing pauses worse.",
  },
  {
    status: "warning",
    title: "Work toward a healthy weight",
    detail: "Extra weight around the neck can narrow the airway during sleep.",
  },
  {
    status: "avoid",
    title: "Avoid sedatives without your doctor's approval",
    detail: "Sleep aids and muscle relaxants can suppress breathing further.",
  },
];

const SPECIALISTS = [
  {
    name: "Dr. Sarah Chen",
    role: "Sleep Medicine Specialist",
    location: "Riverside Sleep Clinic",
    phone: "5551234567",
    phoneDisplay: "(555) 123-4567",
  },
  {
    name: "Dr. Miguel Alvarez",
    role: "Pulmonologist",
    location: "Bayview Medical Group",
    phone: "5559876543",
    phoneDisplay: "(555) 987-6543",
  },
];

const ARTICLES = [
  {
    title: "Understanding Your AHI Score",
    source: "American Sleep Association",
    summary: "What the Apnea-Hypopnea Index means and how it's used to gauge severity.",
  },
  {
    title: "CPAP Alternatives for Older Adults",
    source: "National Council on Aging",
    summary: "Options to discuss with your doctor if a CPAP mask isn't comfortable.",
  },
  {
    title: "Sleep Apnea and Heart Health",
    source: "American Heart Association",
    summary: "Why untreated breathing pauses raise cardiovascular risk over time.",
  },
];

export default function TreatmentView() {
  const meta = SEVERITY_META[SEVERITY];

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-16">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Treatment</h1>
      </header>

      {/* Severity alert */}
      <div className={`flex items-center gap-3 rounded-2xl p-4 ${meta.bg} bg-opacity-10`}>
        <span className={`h-4 w-4 flex-shrink-0 rounded-full ${meta.bg}`} aria-hidden="true" />
        <div>
          <p className={`text-lg font-semibold ${meta.color}`}>{meta.label} sleep apnea signs</p>
          <p className="text-base text-slate-600">{meta.description}</p>
        </div>
      </div>

      {/* Recommendations */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Recommendations</h2>
        {RECOMMENDATIONS.map((rec) => {
          const rm = STATUS_META[rec.status];
          return (
            <div key={rec.title} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${rm.bg}`}
                aria-hidden="true"
              >
                {rm.icon}
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-900">{rec.title}</p>
                <p className="text-base text-slate-600">{rec.detail}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Specialist contacts */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Talk to a Specialist</h2>
        {SPECIALISTS.map((doc) => (
          <a
            key={doc.phone}
            href={`tel:${doc.phone}`}
            className="flex min-h-[64px] items-center justify-between rounded-2xl bg-slate-50 p-4 active:bg-slate-100"
          >
            <div>
              <p className="text-lg font-semibold text-slate-900">{doc.name}</p>
              <p className="text-base text-slate-600">
                {doc.role} · {doc.location}
              </p>
              <p className="text-base font-medium text-apneaGreen">{doc.phoneDisplay}</p>
            </div>
            <span
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-apneaGreen text-white"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"
                  fill="white"
                />
              </svg>
            </span>
          </a>
        ))}
      </section>

      {/* Articles */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Learn More</h2>
        {ARTICLES.map((article) => (
          <div key={article.title} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-900">{article.title}</p>
            <p className="text-sm text-slate-500">{article.source}</p>
            <p className="mt-1 text-base text-slate-600">{article.summary}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
