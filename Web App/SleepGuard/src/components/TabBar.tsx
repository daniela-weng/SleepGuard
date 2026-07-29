export type Tab = "sleep" | "treatment" | "settings";

const TABS: { id: Tab; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    id: "sleep",
    label: "Sleep",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
          stroke={active ? "#16a34a" : "#94a3b8"}
          strokeWidth={2}
          strokeLinejoin="round"
          fill={active ? "#16a34a" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    id: "treatment",
    label: "Treatment",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M12 21s-7.5-4.6-9.5-9C1 8.2 2.8 5 6 5c2 0 3.3 1.1 4 2 .7-.9 2-2 4-2 3.2 0 5 3.2 3.5 7-2 4.4-9.5 9-9.5 9Z"
          stroke={active ? "#16a34a" : "#94a3b8"}
          strokeWidth={2}
          strokeLinejoin="round"
          fill={active ? "#16a34a" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <circle cx="12" cy="12" r="3" stroke={active ? "#16a34a" : "#94a3b8"} strokeWidth={2} />
        <path
          d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 6.14 8.5a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1-1.55V2.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V8.5a1.7 1.7 0 0 0 1.55 1H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"
          stroke={active ? "#16a34a" : "#94a3b8"}
          strokeWidth={1.4}
          strokeLinejoin="round"
          fill={active ? "#16a34a" : "none"}
          fillOpacity={active ? 0.1 : 0}
        />
      </svg>
    ),
  },
];

export default function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="flex border-t border-slate-200 bg-white/95 backdrop-blur">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 pb-1"
            aria-current={isActive ? "page" : undefined}
          >
            {tab.icon(isActive)}
            <span
              className={`text-sm font-medium ${
                isActive ? "text-apneaGreen" : "text-slate-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
