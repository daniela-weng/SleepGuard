import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Luna } from "./MascotGallery";
import SettingsScreen, { type EmergencyContact } from "./SettingsScreen";
import SleepDetailScreen from "./SleepDetailScreen";
import {
  AhiRing,
  AlertBanner,
  ALERT_ACCENT,
  BODY_FONT,
  DayCircle,
  getSeverity,
  HEADING_FONT,
  HEADLINE,
  MONTH,
  MonthGrid,
  MonthTrends,
  PRIMARY,
  PRIMARY_SHADOW,
  SectionHeading,
  SleepRating,
  SUMMARY,
  ViewToggle,
  WEEK,
} from "./shared";

const MONTH_NAME = "July 2026";

function TrackingMoment({ mode, onClose }: { mode: "start" | "stop"; onClose: () => void }) {
  const isStarting = mode === "start";

  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3400);
    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex h-full flex-col items-center justify-center bg-white px-8 text-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-moment-title"
    >
      <div className="relative h-52 w-56">
        {isStarting ? (
          <>
            <span className="absolute -right-1 top-2 text-3xl text-amber-400 tracking-zzz">Z</span>
            <span className="absolute right-7 top-9 text-xl text-amber-400 tracking-zzz tracking-zzz-delayed">z</span>
          </>
        ) : (
          <svg viewBox="0 0 180 180" className="absolute inset-0 h-full w-full tracking-sun-rays" aria-hidden="true">
            <path d="M90 9v20M90 151v20M9 90h20M151 90h20M33 33l14 14M133 133l14 14M33 147l14-14M133 47l14-14" stroke="#d99a3f" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
        <div className="absolute inset-7 z-10">
          <Luna mood={isStarting ? "okay" : "good"} />
        </div>
      </div>

      <h1 id="tracking-moment-title" className="mt-5 text-2xl font-semibold text-amber-950" style={HEADING_FONT}>
        {isStarting ? "Good night, Celena" : "Rise and shine!"}
      </h1>
    </div>
  );
}

export default function MorningSummarySunrise() {
  const [dayIndex, setDayIndex] = useState(WEEK.length - 1);
  const [view, setView] = useState<"week" | "month">("week");
  const [tracking, setTracking] = useState(false);
  const [trackingMoment, setTrackingMoment] = useState<"start" | "stop" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [dayRatings, setDayRatings] = useState<Record<string, number>>({});
  const [detailsMounted, setDetailsMounted] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [settingsMounted, setSettingsMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null);
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverContact, setCaregiverContact] = useState("");
  const [caregiverIsEmergencyContact, setCaregiverIsEmergencyContact] = useState(false);

  const day = WEEK[dayIndex];
  const severity = getSeverity(day.ahi);
  const isToday = dayIndex === WEEK.length - 1;

  const handleRate = (value: number) => {
    setRating(value);
    setDayRatings((prev) => ({ ...prev, [day.date]: value }));
  };

  const openSettings = () => {
    setSettingsMounted(true);
    requestAnimationFrame(() => setSettingsOpen(true));
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setTimeout(() => setSettingsMounted(false), 300);
  };

  const openDetails = () => {
    setDetailsMounted(true);
    requestAnimationFrame(() => setDetailsOpen(true));
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setTimeout(() => setDetailsMounted(false), 300);
  };

  const toggleTracking = () => {
    const nextMode = tracking ? "stop" : "start";
    setTracking(!tracking);
    setTrackingMoment(nextMode);
  };

  const overriddenByCaregiver = caregiverIsEmergencyContact && caregiverContact.trim().length > 0;
  const effectiveContact = overriddenByCaregiver
    ? { name: caregiverName || "Caregiver", phone: caregiverContact }
    : emergencyContact;
  const callLabel = effectiveContact ? `Call ${effectiveContact.name}` : "Call 911";
  const callDigits = effectiveContact ? effectiveContact.phone.replace(/[^\d+]/g, "") : "911";

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`h-full transition-transform duration-300 ease-out ${
          settingsOpen || detailsOpen ? "-translate-x-1/4" : "translate-x-0"
        }`}
      >
        <div
          className="relative flex h-full flex-col overflow-hidden"
          style={{ fontFamily: BODY_FONT, backgroundColor: "#ffffff" }}
        >
      <div
        className="flex items-center justify-between gap-4 rounded-b-[28px] px-5 pb-[20px] pt-14"
        style={{ backgroundColor: PRIMARY_SHADOW }}
      >
        <div>
          <p className="text-base font-medium text-white/90">Good morning,</p>
          <p className="text-3xl font-semibold text-white" style={HEADING_FONT}>
            Celena!
          </p>
        </div>
        <button
          type="button"
          onClick={openSettings}
          aria-label="Settings"
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-md"
        >
          <Luna mood={severity === "Severe" ? "worried" : severity === "Moderate" ? "okay" : "good"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <div className="flex items-center justify-between">
          <SectionHeading>Monitor Your Sleep</SectionHeading>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {view === "week" ? (
          <>
            <div className="flex justify-between">
              {WEEK.map((d, i) => (
                <DayCircle
                  key={d.date}
                  day={d}
                  active={i === dayIndex}
                  onClick={() => setDayIndex(i)}
                  score={dayRatings[d.date]}
                />
              ))}
            </div>

            {severity === "Severe" && <AlertBanner />}

            <div className="mt-4 flex flex-col gap-1.5">
              <h1 className="text-xl font-semibold leading-tight text-amber-950" style={HEADING_FONT}>
                <span className="mr-1 text-base font-medium text-amber-700">
                  {isToday ? "Last night —" : `${day.date} —`}
                </span>
                {HEADLINE[severity]}
              </h1>

              <div className="mt-2.5 flex justify-center">
                <AhiRing ahi={day.ahi} size={144} />
              </div>

              <p className="text-base leading-snug text-amber-900/80">{SUMMARY[severity]}</p>
              <button
                type="button"
                onClick={openDetails}
                className="self-start text-base font-semibold"
                style={{ color: PRIMARY_SHADOW }}
              >
                See details →
              </button>
            </div>

            <div className="mt-4">
              <SleepRating value={rating} onChange={handleRate} />
            </div>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-amber-950" style={HEADING_FONT}>
              {MONTH_NAME}
            </p>
            <MonthGrid data={MONTH} todayRating={dayRatings[WEEK[WEEK.length - 1].date]} />
            <div className="mt-3">
              <MonthTrends data={MONTH} />
            </div>
          </>
        )}

        <div className="-mx-5 mt-auto bg-white px-5 pb-6 pt-3">
          <Button
            onClick={toggleTracking}
            className="min-h-14 w-full rounded-[12px] p-4 text-xl font-semibold text-white"
            style={{
              backgroundColor: PRIMARY,
              boxShadow: `2px 2px 8px ${PRIMARY_SHADOW}80`,
            }}
          >
            {tracking ? "Stop Tracking" : "Start Tonight's Tracking"}
          </Button>
        </div>
      </div>

      <a
        href={`tel:${callDigits}`}
        aria-label={callLabel}
        title={callLabel}
        className="absolute bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ backgroundColor: ALERT_ACCENT }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 7a2 2 0 0 1 1-4Z"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
        </div>
      </div>

      {settingsMounted && (
        <div
          className={`absolute inset-0 z-30 h-full transition-transform duration-300 ease-out ${
            settingsOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SettingsScreen
            onBack={closeSettings}
            emergencyContact={emergencyContact}
            onSaveEmergencyContact={setEmergencyContact}
            caregiverName={caregiverName}
            onCaregiverNameChange={setCaregiverName}
            caregiverContact={caregiverContact}
            onCaregiverContactChange={setCaregiverContact}
            caregiverIsEmergencyContact={caregiverIsEmergencyContact}
            onCaregiverIsEmergencyContactChange={setCaregiverIsEmergencyContact}
          />
        </div>
      )}

      {detailsMounted && (
        <div
          className={`absolute inset-0 z-40 h-full overflow-hidden bg-white transition-transform duration-300 ease-out ${
            detailsOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SleepDetailScreen day={day} onBack={closeDetails} />
        </div>
      )}

      {trackingMoment && <TrackingMoment mode={trackingMoment} onClose={() => setTrackingMoment(null)} />}
    </div>
  );
}
