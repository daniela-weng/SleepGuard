import { useState } from "react";
import { ALERT_ACCENT, BODY_FONT, HEADING_FONT, MODERATE_ACCENT, PRIMARY, TRACK } from "./shared";

export type Mood = "great" | "good" | "okay" | "worried";
const MOODS: Mood[] = ["great", "good", "okay", "worried"];
const MOOD_LABELS: Record<Mood, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  worried: "Worried",
};

function MoodSwitcher({ mood, onChange }: { mood: Mood; onChange: (m: Mood) => void }) {
  return (
    <div className="flex gap-1 rounded-[12px] bg-white p-1 ring-1 ring-amber-100">
      {MOODS.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 rounded-[12px] px-2 py-1.5 text-xs font-semibold transition-colors ${
            mood === m ? "bg-amber-800 text-white" : "text-amber-800"
          }`}
        >
          {MOOD_LABELS[m]}
        </button>
      ))}
    </div>
  );
}

function ViewSwitcher({
  view,
  onChange,
}: {
  view: "icons" | "detailed";
  onChange: (v: "icons" | "detailed") => void;
}) {
  return (
    <div className="flex gap-1 rounded-[12px] bg-white p-1 ring-1 ring-amber-100">
      {(["icons", "detailed"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 rounded-[12px] px-2 py-1.5 text-xs font-semibold capitalize transition-colors ${
            view === v ? "bg-amber-800 text-white" : "text-amber-800"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function MascotCard({
  name,
  tagline,
  size = "h-24 w-24",
  children,
}: {
  name: string;
  tagline: string;
  size?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[12px] bg-white p-4 text-center ring-1 ring-amber-100">
      <div className={`flex items-center justify-center ${size}`}>{children}</div>
      <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
        {name}
      </p>
      <p className="text-xs leading-snug text-amber-800/70">{tagline}</p>
    </div>
  );
}

// --- Wink: sleepy crescent moon ---
const WINK_EYES: Record<Mood, string> = {
  great: "M42 46c2.5-3 6-3 8.5 0M56 46c2.5-3 6-3 8.5 0", // happy arcs (open up)
  good: "M42 46c2.5 2 6 2 8.5 0M56 46c2.5 2 6 2 8.5 0", // closed content
  okay: "M46.2 46a2.2 2.2 0 1 0 0.1 0M60.2 46a2.2 2.2 0 1 0 0.1 0", // simple dots
  worried: "M42 44.5c2.5 2.5 6 2.5 8.5 0M56 44.5c2.5 2.5 6 2.5 8.5 0", // tilted
};
const WINK_MOUTH: Record<Mood, string> = {
  great: "M44 57q6 8 16 0",
  good: "M46 58q7 6 14 0",
  okay: "M47 59h10",
  worried: "M47 61q7-5 14 0",
};

function Wink({ mood }: { mood: Mood }) {
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          d="M68 15A38 38 0 1 0 68 85A30 30 0 0 1 68 15Z"
          fill="#dbe9f5"
          stroke={PRIMARY}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d={WINK_EYES[mood]} stroke={PRIMARY} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <path d={WINK_MOUTH[mood]} stroke={PRIMARY} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <g className="mascot-twinkle">
          <path
            d="M35 22c4-4 11-5 15-2"
            stroke={MODERATE_ACCENT}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

function WinkDetailed({ mood }: { mood: Mood }) {
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <defs>
          <radialGradient id="winkGrad" cx="38%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#f2f7fb" />
            <stop offset="55%" stopColor="#dbe9f5" />
            <stop offset="100%" stopColor="#b9d3e8" />
          </radialGradient>
        </defs>

        {/* extra scattered stars */}
        <g className="mascot-twinkle" style={{ animationDelay: "0.3s" }}>
          <path d="M108 32l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" fill={MODERATE_ACCENT} />
        </g>
        <g className="mascot-twinkle" style={{ animationDelay: "1s" }}>
          <path d="M116 56l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" fill={MODERATE_ACCENT} />
        </g>

        {/* moon body */}
        <path
          d="M94 24A50 50 0 1 0 94 116A40 40 0 0 1 94 24Z"
          fill="url(#winkGrad)"
          stroke={PRIMARY}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />

        {/* craters for texture */}
        <circle cx="52" cy="34" r="4.5" fill={PRIMARY} opacity={0.08} />
        <circle cx="38" cy="80" r="6" fill={PRIMARY} opacity={0.08} />
        <circle cx="62" cy="96" r="3.5" fill={PRIMARY} opacity={0.08} />

        {/* blush */}
        <ellipse cx="34" cy="70" rx="6" ry="3.5" fill={MODERATE_ACCENT} opacity={0.35} />
        <ellipse cx="66" cy="70" rx="6" ry="3.5" fill={MODERATE_ACCENT} opacity={0.35} />

        {/* face, scaled up from the 100-vb paths */}
        <g transform="translate(6 8) scale(1.28)">
          <path d={WINK_EYES[mood]} stroke={PRIMARY} strokeWidth={2.6} strokeLinecap="round" fill="none" />
          <path d={WINK_MOUTH[mood]} stroke={PRIMARY} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        </g>

        {/* knit nightcap */}
        <path
          d="M46 20C50 4 78 2 88 16L48 28Z"
          fill={MODERATE_ACCENT}
          stroke={PRIMARY}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <circle cx="88" cy="15" r="6" fill="#fff" stroke={PRIMARY} strokeWidth={2.5} />
      </svg>
    </div>
  );
}

// --- Sunny: sunrise cloud ---
const SUNNY_EYES: Record<Mood, string> = {
  great: "eyes-open",
  good: "eyes-dot",
  okay: "eyes-dot",
  worried: "eyes-worried",
};
const SUNNY_MOUTH: Record<Mood, string> = {
  great: "M35 60q10 8 20 0",
  good: "M37 60q8 6 16 0",
  okay: "M38 61h14",
  worried: "M38 63q8-5 16 0",
};

function Sunny({ mood }: { mood: Mood }) {
  const rayOpacity = mood === "worried" ? 0.25 : mood === "okay" ? 0.6 : 1;
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <g className="mascot-rays" style={{ opacity: rayOpacity }}>
          <circle cx="66" cy="30" r="16" fill="none" stroke={MODERATE_ACCENT} strokeWidth={3} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1={66 + 22 * Math.cos((deg * Math.PI) / 180)}
              y1={30 + 22 * Math.sin((deg * Math.PI) / 180)}
              x2={66 + 27 * Math.cos((deg * Math.PI) / 180)}
              y2={30 + 27 * Math.sin((deg * Math.PI) / 180)}
              stroke={MODERATE_ACCENT}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
        </g>
        <path
          d="M20 60a16 16 0 0 1 4-31 20 20 0 0 1 38 6 15 15 0 0 1-2 30H24a14 14 0 0 1-4-5Z"
          fill="#eaf1f8"
          stroke={PRIMARY}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {mood === "worried" ? (
          <path d="M35 47l6 2M55 47l-6 2" stroke={PRIMARY} strokeWidth={2} strokeLinecap="round" />
        ) : null}
        {SUNNY_EYES[mood] === "eyes-open" ? (
          <>
            <circle cx="38" cy="52" r="4" fill="none" stroke={PRIMARY} strokeWidth={2} />
            <circle cx="52" cy="52" r="4" fill="none" stroke={PRIMARY} strokeWidth={2} />
          </>
        ) : SUNNY_EYES[mood] === "eyes-worried" ? (
          <>
            <circle cx="38" cy="53" r="2.6" fill={PRIMARY} />
            <circle cx="52" cy="53" r="2.6" fill={PRIMARY} />
          </>
        ) : (
          <>
            <circle cx="38" cy="52" r="2.6" fill={PRIMARY} />
            <circle cx="52" cy="52" r="2.6" fill={PRIMARY} />
          </>
        )}
        <path d={SUNNY_MOUTH[mood]} stroke={PRIMARY} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

// --- Breezy: drifting feather (no face — mood conveyed through motion) ---
const BREEZY_ANIM: Record<Mood, string> = {
  great: "mascot-sway",
  good: "mascot-sway",
  okay: "mascot-sway",
  worried: "mascot-sway-fast",
};
const BREEZY_TILT: Record<Mood, number> = { great: -12, good: -18, okay: -20, worried: -14 };

function Breezy({ mood }: { mood: Mood }) {
  return (
    <div className={`${BREEZY_ANIM[mood]} h-full w-full`}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <g transform={`rotate(${BREEZY_TILT[mood]} 50 50)`}>
          <path
            d="M50 12C65 22 68 45 60 68C56 80 50 88 50 88C50 88 44 80 40 68C32 45 35 22 50 12Z"
            fill="#dbe9f5"
            stroke={PRIMARY}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d="M50 16V86" stroke={PRIMARY} strokeWidth={2} strokeLinecap="round" />
          <path
            d="M50 30L38 24M50 42L36 38M50 54L38 52M50 66L40 66"
            stroke={PRIMARY}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <path
            d="M50 30L62 24M50 42L64 38M50 54L62 52M50 66L60 66"
            stroke={PRIMARY}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </g>
        {mood !== "worried" && (
          <path
            d="M70 66c2 2 2 5 0 7M76 62c3 3 3 8 0 11"
            stroke={MODERATE_ACCENT}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
}

// --- Luna: sleepy owl ---
// An original blue owl with ear tufts, separate wings, and a soft belly patch.
const LUNA_BEAK = "M44 61L56 61L50 75Z";

function LunaFace({ beakColor }: { beakColor: string }) {
  return (
    <>
      <g className="mascot-blink">
        <circle cx="39" cy="50" r="12" fill="white" stroke={PRIMARY} strokeWidth={3} />
        <circle cx="39" cy="50" r="6.5" fill={PRIMARY} />
      </g>
      <circle cx="61" cy="50" r="12" fill="white" stroke={PRIMARY} strokeWidth={3} />
      <circle cx="61" cy="50" r="6.5" fill={PRIMARY} />

      <path d={LUNA_BEAK} fill={beakColor} stroke={beakColor} strokeWidth={1} strokeLinejoin="round" />
    </>
  );
}

export function Luna({ mood }: { mood: Mood }) {
  const beakColor = mood === "worried" ? ALERT_ACCENT : MODERATE_ACCENT;
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d="M32 18l8 10M68 18l-8 10" stroke={PRIMARY} strokeWidth={3} strokeLinecap="round" />
        <ellipse cx="50" cy="55" rx="32" ry="30" fill="#dbe9f5" stroke={PRIMARY} strokeWidth={3} />

        <ellipse cx="26" cy="62" rx="5.5" ry="3.4" fill={MODERATE_ACCENT} opacity={0.4} />
        <ellipse cx="74" cy="62" rx="5.5" ry="3.4" fill={MODERATE_ACCENT} opacity={0.4} />

        <LunaFace beakColor={beakColor} />
      </svg>
    </div>
  );
}

export function LunaFullBody({ mood, pose = "awake" }: { mood: Mood; pose?: "sleeping" | "awake" }) {
  const beakColor = mood === "worried" ? ALERT_ACCENT : MODERATE_ACCENT;

  if (pose === "sleeping") {
    return (
      <svg viewBox="0 0 180 140" className="h-full w-full">
        <defs>
          <linearGradient id="lunaSleepGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c7dcee" />
            <stop offset="100%" stopColor="#8fb4cf" />
          </linearGradient>
        </defs>
        <path d="M42 62 31 47l20 7M128 62l11-15-20 7" fill={PRIMARY} />
        <path
          d="M34 88c-13-18-5-38 14-43l8-17 14 11c12-5 27-5 39 0l15-11 7 18c18 8 24 27 13 43-12 18-39 27-66 22-20-3-37-12-44-23Z"
          fill="url(#lunaSleepGrad)"
          stroke={PRIMARY}
          strokeWidth={3.5}
        />
        <path d="M47 76c-16 4-21 15-13 27 13-2 22-10 27-23M127 76c16 4 21 15 13 27-13-2-22-10-27-23" fill="#b9d3e8" stroke={PRIMARY} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M58 77c7-11 34-15 55-4 3 15-10 27-29 27-17 0-29-8-26-23Z" fill="#f5eeda" opacity={0.9} />
        <path d="M60 65q9 10 18 0M100 65q9 10 18 0" fill="none" stroke={PRIMARY} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M83 73h14l-7 9Z" fill={beakColor} />
        <path d="M69 93l4 5 4-5M83 97l4 5 4-5M97 93l4 5 4-5" stroke={PRIMARY} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.45} />
      </svg>
    );
  }

  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <defs>
          <linearGradient id="lunaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c7dcee" />
            <stop offset="100%" stopColor="#a9c9e2" />
          </linearGradient>
        </defs>

        {/* ear tufts */}
        <path d="M42 22l-4-14 10 8Z" fill={PRIMARY} />
        <path d="M98 22l4-14-10 8Z" fill={PRIMARY} />

        {/* wide, folded wings */}
        <path
          d="M37 61C18 63 13 80 21 96c13-2 24-13 29-28Z"
          fill="#b9d3e8"
          stroke={PRIMARY}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        <path
          d="M103 61c19 2 24 19 16 35-13-2-24-13-29-28Z"
          fill="#b9d3e8"
          stroke={PRIMARY}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />

        {/* feet */}
        <path d="M60 118v10M64 118v11M80 118v10M76 118v11" stroke={PRIMARY} strokeWidth={2.4} strokeLinecap="round" />

        {/* distinct head-and-torso silhouette */}
        <path d="M36 108V64c0-23 9-39 24-45l10-11 10 11c16 6 24 22 24 45v44c0 15-13 24-34 24s-34-9-34-24Z" fill="url(#lunaGrad)" stroke={PRIMARY} strokeWidth={3.5} />

        {/* feather chevrons */}
        <path
          d="M50 96l4 6 4-6M62 100l4 6 4-6M74 100l4 6 4-6M86 96l4 6 4-6"
          stroke={PRIMARY}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.45}
        />

        {/* cream belly patch */}
        <path d="M50 88c3-19 12-28 20-28s17 9 20 28c1 17-8 28-20 28s-21-11-20-28Z" fill="#f5eeda" opacity={0.9} />

        {/* blush */}
        <ellipse cx="44" cy="78" rx="7" ry="4.2" fill={MODERATE_ACCENT} opacity={0.4} />
        <ellipse cx="96" cy="78" rx="7" ry="4.2" fill={MODERATE_ACCENT} opacity={0.4} />

        {/* awake face */}
        <g transform="translate(7.5 0.75) scale(1.25)">
          <LunaFace beakColor={beakColor} />
        </g>
      </svg>
    </div>
  );
}

// --- Pip: the AHI ring, personified ---
const PIP_FILL: Record<Mood, number> = { great: 0.9, good: 0.65, okay: 0.45, worried: 0.15 };
const PIP_MOUTH: Record<Mood, string> = {
  great: "M40 56q10 8 20 0",
  good: "M42 56q8 5 16 0",
  okay: "M43 57h14",
  worried: "M43 59q8-5 14 0",
};

function Pip({ mood }: { mood: Mood }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - PIP_FILL[mood]);
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke={TRACK} strokeWidth={12} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={mood === "worried" ? "#c0402a" : PRIMARY}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <g transform="rotate(90 50 50)">
          <circle cx="42" cy="48" r="2.6" fill={PRIMARY} />
          <circle cx="58" cy="48" r="2.6" fill={PRIMARY} />
          <path d={PIP_MOUTH[mood]} stroke={PRIMARY} strokeWidth={2.2} strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}

function PipDetailed({ mood }: { mood: Mood }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - PIP_FILL[mood]);
  const ringColor = mood === "worried" ? "#c0402a" : PRIMARY;
  return (
    <div className="mascot-float h-full w-full">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <defs>
          <linearGradient id="pipGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ringColor} stopOpacity={0.75} />
            <stop offset="100%" stopColor={ringColor} />
          </linearGradient>
        </defs>

        {/* arms */}
        <path d="M18 70c-8-4-12-14-8-22" stroke={PRIMARY} strokeWidth={4} strokeLinecap="round" fill="none" />
        <circle cx="9" cy="46" r="5" fill="#dbe9f5" stroke={PRIMARY} strokeWidth={2.4} />
        <path d="M122 70c8-4 12-14 8-22" stroke={PRIMARY} strokeWidth={4} strokeLinecap="round" fill="none" />
        <circle cx="131" cy="46" r="5" fill="#dbe9f5" stroke={PRIMARY} strokeWidth={2.4} />

        {/* feet */}
        <ellipse cx="55" cy="130" rx="7" ry="4.5" fill={PRIMARY} />
        <ellipse cx="85" cy="130" rx="7" ry="4.5" fill={PRIMARY} />

        <g transform="translate(70 70)">
          <g className="-rotate-90">
            <circle r={r} fill="none" stroke={TRACK} strokeWidth={16} />
            <circle
              r={r}
              fill="none"
              stroke="url(#pipGrad)"
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
            />
            {/* glossy highlight */}
            <circle
              r={r}
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${c * 0.08} ${c}`}
              strokeDashoffset={c * 0.02}
              opacity={0.6}
            />
          </g>

          {/* blush */}
          <ellipse cx="-14" cy="6" rx="5" ry="3" fill={MODERATE_ACCENT} opacity={0.4} />
          <ellipse cx="14" cy="6" rx="5" ry="3" fill={MODERATE_ACCENT} opacity={0.4} />

          <g transform="translate(-50 -50)">
            <circle cx="42" cy="48" r="3.2" fill={PRIMARY} />
            <circle cx="58" cy="48" r="3.2" fill={PRIMARY} />
            <path d={PIP_MOUTH[mood]} stroke={PRIMARY} strokeWidth={2.6} strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function MascotGallery() {
  const [mood, setMood] = useState<Mood>("good");
  const [view, setView] = useState<"icons" | "detailed">("icons");

  return (
    <div
      className="flex h-full flex-col gap-4 overflow-y-auto bg-white px-5 pb-8 pt-16"
      style={{ fontFamily: BODY_FONT }}
    >
      <p className="text-2xl font-semibold text-amber-950" style={HEADING_FONT}>
        Mascot Options
      </p>

      <div className="flex gap-2">
        <MoodSwitcher mood={mood} onChange={setMood} />
        <ViewSwitcher view={view} onChange={setView} />
      </div>

      {view === "icons" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <MascotCard name="Wink" tagline="Sleepy crescent moon — reuses the app's existing moon icon">
              <Wink mood={mood} />
            </MascotCard>
            <MascotCard name="Sunny" tagline="Sunrise cloud — embodies the blue-to-gold brand gradient">
              <Sunny mood={mood} />
            </MascotCard>
            <MascotCard name="Breezy" tagline="Drifting feather — mood shown through motion, not a face">
              <Breezy mood={mood} />
            </MascotCard>
            <MascotCard name="Luna" tagline="Sleepy owl — wise and calm, not childish">
              <Luna mood={mood} />
            </MascotCard>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MascotCard name="Pip" tagline="Personifies the AHI ring itself">
              <Pip mood={mood} />
            </MascotCard>
            <div />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <MascotCard
            name="Wink"
            tagline="Nightcap, multiple twinkling stars, subtle craters and blush for warmth"
            size="h-40 w-40"
          >
            <WinkDetailed mood={mood} />
          </MascotCard>
          <MascotCard
            name="Luna"
            tagline="Two-tone feathers, folded wings, ear tufts, perched on a branch"
            size="h-40 w-40"
          >
            <LunaFullBody mood={mood} />
          </MascotCard>
          <MascotCard
            name="Pip"
            tagline="Glossy gradient ring with a highlight streak, small arms and feet"
            size="h-40 w-40"
          >
            <PipDetailed mood={mood} />
          </MascotCard>
        </div>
      )}
    </div>
  );
}
