export type Severity = "none" | "mild" | "moderate" | "severe";

export const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; bg: string; description: string }
> = {
  none: {
    label: "Normal",
    color: "text-apneaGreen",
    bg: "bg-apneaGreen",
    description: "Fewer than 5 breathing pauses per hour.",
  },
  mild: {
    label: "Mild",
    color: "text-apneaYellow",
    bg: "bg-apneaYellow",
    description: "5–15 breathing pauses per hour.",
  },
  moderate: {
    label: "Moderate",
    color: "text-apneaYellow",
    bg: "bg-apneaYellow",
    description: "15–30 breathing pauses per hour. Worth discussing with your doctor.",
  },
  severe: {
    label: "Severe",
    color: "text-apneaRed",
    bg: "bg-apneaRed",
    description: "More than 30 breathing pauses per hour.",
  },
};

// Sample last-night results, shared across tabs.
export const AHI = 18;
export const SEVERITY: Severity = "moderate";
export const SPO2_NADIR = 86;
export const SLEEP_DURATION = "7h 12m";
export const AVG_HEART_RATE = 68;
