import { useState } from "react";
import Toggle from "./Toggle";

const BIOMETRICS = [
  { key: "heartRate", label: "Heart rate", detail: "Continuous, resting & during sleep" },
  { key: "spo2", label: "Blood oxygen (SpO₂)", detail: "Overnight saturation & dips below 90%" },
  { key: "breathingRate", label: "Breathing rate", detail: "Breaths per minute while asleep" },
  { key: "sleepStages", label: "Sleep stages", detail: "Light, deep, and REM sleep" },
  { key: "movement", label: "Movement", detail: "Restlessness and position changes" },
];

type Frequency = "off" | "daily" | "weekly";

export default function SettingsView() {
  const [fitbitConnected, setFitbitConnected] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BIOMETRICS.map((b) => [b.key, true]))
  );
  const [caretakerName, setCaretakerName] = useState("");
  const [caretakerPhone, setCaretakerPhone] = useState("");
  const [digestFrequency, setDigestFrequency] = useState<Frequency>("daily");
  const [emergencyCallEnabled, setEmergencyCallEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveCaretaker = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-16">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
      </header>

      {/* Fitbit connection */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Device</h2>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 flex-shrink-0 rounded-full ${
                fitbitConnected ? "bg-apneaGreen" : "bg-slate-300"
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900">Fitbit</p>
              <p className="text-base text-slate-600">
                {fitbitConnected ? "Connected · synced 6 min ago" : "Not connected"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFitbitConnected((v) => !v)}
            className={`min-h-[48px] rounded-xl px-4 text-base font-semibold ${
              fitbitConnected
                ? "bg-slate-200 text-slate-700"
                : "bg-apneaGreen text-white"
            }`}
          >
            {fitbitConnected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </section>

      {/* Biometrics recorded */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">What We Track</h2>
        <p className="text-base text-slate-600">
          Turn off anything you'd rather we not record. Your privacy is yours to control.
        </p>
        <div className="flex flex-col divide-y divide-slate-200 rounded-2xl bg-slate-50 p-4">
          {BIOMETRICS.map((b) => (
            <div key={b.key} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-lg font-semibold text-slate-900">{b.label}</p>
                <p className="text-base text-slate-600">{b.detail}</p>
              </div>
              <Toggle
                checked={biometricsEnabled[b.key]}
                onChange={(v) => setBiometricsEnabled((prev) => ({ ...prev, [b.key]: v }))}
                label={`Track ${b.label}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Caretaker */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Caregiver</h2>
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4">
          <label className="flex flex-col gap-1">
            <span className="text-base font-medium text-slate-700">Caregiver name</span>
            <input
              type="text"
              value={caretakerName}
              onChange={(e) => setCaretakerName(e.target.value)}
              placeholder="e.g. Jamie Rivera"
              className="min-h-[52px] rounded-xl border border-slate-300 px-4 text-lg text-slate-900 focus:border-apneaGreen focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-base font-medium text-slate-700">Caregiver phone number</span>
            <input
              type="tel"
              value={caretakerPhone}
              onChange={(e) => setCaretakerPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="min-h-[52px] rounded-xl border border-slate-300 px-4 text-lg text-slate-900 focus:border-apneaGreen focus:outline-none"
            />
          </label>

          {/* SMS digest frequency */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium text-slate-700">Text message updates</span>
            <div className="flex gap-2">
              {(["off", "daily", "weekly"] as Frequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setDigestFrequency(freq)}
                  className={`min-h-[48px] flex-1 rounded-xl text-base font-semibold capitalize ${
                    digestFrequency === freq
                      ? "bg-apneaGreen text-white"
                      : "bg-white text-slate-600 border border-slate-300"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              {digestFrequency === "off"
                ? "No text updates will be sent."
                : `A summary of sleep numbers will be texted ${digestFrequency}.`}
            </p>
          </div>

          {/* Emergency call */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-slate-900">Emergency call</p>
              <p className="text-base text-slate-600">
                Automatically call the caregiver during a severe breathing event
              </p>
            </div>
            <Toggle
              checked={emergencyCallEnabled}
              onChange={setEmergencyCallEnabled}
              label="Emergency call toggle"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveCaretaker}
            disabled={!caretakerPhone}
            className="min-h-[56px] rounded-2xl bg-apneaGreen text-xl font-semibold text-white disabled:bg-slate-300"
          >
            {saved ? "Saved ✓" : "Save Caregiver Info"}
          </button>
        </div>
      </section>
    </div>
  );
}
