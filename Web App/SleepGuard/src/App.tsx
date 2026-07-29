import { useState } from "react";
import PhoneFrame from "./components/PhoneFrame";
import MorningSummarySunrise from "./components/morning/MorningSummarySunrise";
import MorningSummaryMetric from "./components/morning/MorningSummaryMetric";
import MorningSummaryCare from "./components/morning/MorningSummaryCare";
import MascotGallery from "./components/morning/MascotGallery";

type Variant = "H" | "J" | "K" | "M";
const ALL_VARIANTS: Variant[] = ["H", "J", "K", "M"];

const SCREENS: Record<Variant, () => JSX.Element> = {
  H: MorningSummarySunrise,
  J: MorningSummaryMetric,
  K: MorningSummaryCare,
  M: MascotGallery,
};

function VariantSwitcher({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-white p-1 shadow-lg ring-1 ring-slate-200">
      {ALL_VARIANTS.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
            variant === v ? "bg-apneaGreen text-white" : "text-slate-500"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [variant, setVariant] = useState<Variant>("H");
  const Screen = SCREENS[variant];

  return (
    <PhoneFrame
      width={390}
      height={844}
      toolbar={<VariantSwitcher variant={variant} onChange={setVariant} />}
    >
      <Screen />
    </PhoneFrame>
  );
}
