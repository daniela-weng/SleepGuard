import { useEffect, useState } from "react";
import { BreathingIcon, OxygenIcon, SleepQualityIcon } from "./SleepDetailScreen";
import { BODY_FONT, HEADING_FONT, PRIMARY, PRIMARY_SHADOW, SectionHeading, TRACK } from "./shared";

export type EmergencyContact = { name: string; category: string; phone: string; notes: string };
type Device = { name: string; battery: number };

function MovementIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <circle cx="12" cy="4.5" r="1.8" fill="currentColor" />
      <path
        d="M8 21l2.5-6-2-2 1-5 4 1.5 2 3h3M10.5 15l3 1.5-1 4.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M7 7l10 10-5 4V3l5 4L7 17"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BatteryIcon({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 26 14" className="h-3.5 w-6" fill="none">
      <rect x="1" y="1" width="21" height="12" rx="2.5" stroke={PRIMARY_SHADOW} strokeWidth={1.2} />
      <rect x="23" y="4.5" width="2" height="5" rx="1" fill={PRIMARY_SHADOW} />
      <rect x="2.5" y="2.5" width={17 * (level / 100)} height="9" rx="1.5" fill={PRIMARY_SHADOW} />
    </svg>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full p-0.5 transition-colors ${
        checked ? "justify-end" : "justify-start"
      }`}
      style={{ backgroundColor: checked ? PRIMARY : "#c7ccd1" }}
    >
      <span className="inline-block h-6 w-6 rounded-full bg-white shadow" />
    </button>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-shrink-0 gap-1 rounded-[12px] bg-white p-1 ring-1 ring-[#dbe9f5]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-[12px] px-2.5 py-1 text-base font-semibold transition-colors"
          style={{
            backgroundColor: value === opt.value ? PRIMARY_SHADOW : undefined,
            color: value === opt.value ? "#ffffff" : PRIMARY_SHADOW,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] bg-white p-4 ring-1 ring-[#dbe9f5]">{children}</div>
  );
}

// Slide-up-from-bottom sheet: fades a backdrop in, slides content up from
// translate-y-full, and reverses both before calling onClose — so the
// caller (SettingsScreen) always has ~250ms to know a close is in flight.
function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setEntered(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end transition-colors duration-300"
      style={{ backgroundColor: entered ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)" }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90%] flex-col gap-4 overflow-y-auto rounded-t-[12px] bg-white p-5 pb-8 transition-transform duration-300 ease-out ${
          entered ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto h-1.5 w-12 flex-shrink-0 rounded-full bg-amber-800/60" />
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-amber-950" style={HEADING_FONT}>
            {title}
          </p>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg text-amber-800"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const METRICS = [
  {
    name: "Breathing Rate",
    why: "Pauses overnight",
    Icon: BreathingIcon,
    enabled: true,
  },
  {
    name: "Blood Oxygen (SpO₂)",
    why: "Apnea signals",
    Icon: OxygenIcon,
    enabled: true,
  },
  {
    name: "Sleep Stages",
    why: "Deep & REM",
    Icon: SleepQualityIcon,
    enabled: true,
  },
  {
    name: "Movement",
    why: "Awake vs asleep",
    Icon: MovementIcon,
    enabled: false,
  },
];

const AVAILABLE_DEVICES: Device[] = [
  { name: "Fitbit Sense", battery: 82 },
  { name: "Fitbit Versa 4", battery: 65 },
  { name: "Fitbit Charge 6", battery: 91 },
];

const CATEGORIES = ["Family", "Friend", "Neighbor", "Doctor", "Other"];

function ContactModal({
  initial,
  onClose,
  onSave,
}: {
  initial: EmergencyContact | null;
  onClose: () => void;
  onSave: (c: EmergencyContact) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const fieldClass =
    "min-w-0 rounded-[12px] border border-[#dbe9f5] px-3 py-2 text-base text-amber-950 outline-none focus:border-[#4f7ea3]";

  return (
    <BottomSheet title="Add Emergency Contact" onClose={onClose}>
      <label className="flex flex-col gap-1">
        <span className="text-base font-semibold text-amber-950">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contact name"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-base font-semibold text-amber-950">Category</span>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass} w-full appearance-none pr-9`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-800"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-base font-semibold text-amber-950">Phone number</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-base font-semibold text-amber-950">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional information"
          rows={3}
          className={fieldClass}
        />
      </label>

      <button
        type="button"
        onClick={() => {
          if (!name.trim() || !phone.trim()) return;
          onSave({ name: name.trim(), category, phone: phone.trim(), notes: notes.trim() });
        }}
        className="min-h-14 w-full flex-shrink-0 rounded-[12px] p-4 text-lg font-semibold text-white"
        style={{ backgroundColor: PRIMARY_SHADOW }}
      >
        Save Contact
      </button>
    </BottomSheet>
  );
}

function DevicePickerModal({ onClose, onSelect }: { onClose: () => void; onSelect: (d: Device) => void }) {
  return (
    <BottomSheet title="Connect a Device" onClose={onClose}>
      <p className="text-base text-amber-800/90">Nearby devices</p>
      <div className="flex flex-col">
        {AVAILABLE_DEVICES.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect(d)}
            className="flex items-center gap-3 border-b border-[#dbe9f5] py-3 text-left last:border-0"
          >
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: TRACK, color: PRIMARY_SHADOW }}
            >
              <BluetoothIcon />
            </span>
            <span className="flex-1 text-base font-semibold text-amber-950">{d.name}</span>
            <span className="flex-shrink-0 text-lg text-amber-400">›</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

export default function SettingsScreen({
  onBack,
  emergencyContact,
  onSaveEmergencyContact,
  caregiverName,
  onCaregiverNameChange,
  caregiverContact,
  onCaregiverContactChange,
  caregiverIsEmergencyContact,
  onCaregiverIsEmergencyContactChange,
}: {
  onBack: () => void;
  emergencyContact: EmergencyContact | null;
  onSaveEmergencyContact: (c: EmergencyContact) => void;
  caregiverName: string;
  onCaregiverNameChange: (v: string) => void;
  caregiverContact: string;
  onCaregiverContactChange: (v: string) => void;
  caregiverIsEmergencyContact: boolean;
  onCaregiverIsEmergencyContactChange: (v: boolean) => void;
}) {
  const [metrics, setMetrics] = useState(METRICS);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [device, setDevice] = useState<Device | null>({ name: "Fitbit Sense", battery: 82 });
  const [deviceExpanded, setDeviceExpanded] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [frequency, setFrequency] = useState<"off" | "daily" | "weekly">("weekly");
  const [reportRange, setReportRange] = useState<"7" | "30">("7");

  const sheetOpen = showContactModal || showDevicePicker;

  const toggleMetric = (name: string) => {
    setMetrics((prev) => prev.map((m) => (m.name === name ? { ...m, enabled: !m.enabled } : m)));
  };

  const disconnectDevice = () => {
    setDevice(null);
    setDeviceExpanded(false);
  };

  const overriddenByCaregiver = caregiverIsEmergencyContact && caregiverContact.trim().length > 0;
  const displayedContact = overriddenByCaregiver
    ? { name: caregiverName || "Caregiver", category: "Caregiver", phone: caregiverContact, notes: "" }
    : emergencyContact;

  return (
    <div
      className="relative flex h-full flex-col"
      style={{ fontFamily: BODY_FONT, backgroundColor: "#ffffff" }}
    >
      <div className={`flex flex-1 flex-col ${sheetOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
        <div
          className="flex items-center gap-3 rounded-b-[28px] px-5 pb-[20px] pt-14"
          style={{ backgroundColor: PRIMARY_SHADOW }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-lg text-white"
          >
            ←
          </button>
          <p className="text-xl font-semibold text-white" style={HEADING_FONT}>
            Settings
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <section className="flex flex-col gap-[4px]">
            {/* Device & Privacy */}
            <SectionHeading>Device &amp; Privacy</SectionHeading>

            <div className="flex flex-col gap-2">
              <Card>
            {device ? (
              <>
                <button
                  type="button"
                  onClick={() => setDeviceExpanded((v) => !v)}
                  className="flex items-center gap-3 text-left"
                >
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: TRACK, color: PRIMARY_SHADOW }}
                  >
                    <BluetoothIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-amber-950">{device.name}</span>
                    <span className="block text-base font-semibold" style={{ color: PRIMARY }}>
                      Connected
                    </span>
                  </span>
                  <span className="flex flex-shrink-0 items-center gap-1.5">
                    <BatteryIcon level={device.battery} />
                    <span className="text-base text-amber-800/90">{device.battery}%</span>
                  </span>
                  <span className="flex h-9 w-7 flex-shrink-0 items-center justify-center text-amber-400">
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-5 w-5 ${deviceExpanded ? "rotate-90" : ""}`}
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="m7.5 5 5 5-5 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {deviceExpanded && (
                  <div className="flex flex-col gap-1 border-t border-[#dbe9f5] pt-3">
                    <button
                      type="button"
                      onClick={disconnectDevice}
                      className="self-start text-base font-semibold"
                      style={{ color: PRIMARY_SHADOW }}
                    >
                      Disconnect
                    </button>
                    <button
                      type="button"
                      onClick={disconnectDevice}
                      className="self-start text-base font-semibold text-[#c0402a]"
                    >
                      Forget This Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDevicePicker(true)}
                      className="self-start text-base font-semibold"
                      style={{ color: PRIMARY_SHADOW }}
                    >
                      Connect a Different Device
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-amber-950">No device connected</p>
                  <p className="text-base text-amber-800/90">Connect a Fitbit to start tracking</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDevicePicker(true)}
                  className="flex-shrink-0 text-base font-semibold"
                  style={{ color: PRIMARY_SHADOW }}
                >
                  Connect
                </button>
              </div>
            )}
              </Card>

              <Card>
              <p className="text-base font-semibold text-amber-950">Emergency Contact</p>
              {displayedContact ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-amber-950">{displayedContact.name}</p>
                    <p className="text-base text-amber-700">
                      {displayedContact.category ? `${displayedContact.category} · ` : ""}
                      {displayedContact.phone}
                    </p>
                  </div>
                  {!overriddenByCaregiver && (
                    <button
                      type="button"
                      onClick={() => setShowContactModal(true)}
                      className="flex-shrink-0 text-base font-semibold"
                      style={{ color: PRIMARY_SHADOW }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-base leading-snug text-amber-800/90">
                    No emergency contact added. If something concerning is detected, <span className="font-semibold">911</span>{" "}
                    will be called automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="self-start text-base font-semibold"
                    style={{ color: PRIMARY_SHADOW }}
                  >
                    + Add Emergency Contact
                  </button>
                </div>
              )}
              </Card>
            </div>
          </section>

          <section className="flex flex-col gap-1">
            <SectionHeading>What We Track</SectionHeading>

            <div className="overflow-hidden rounded-[12px] bg-white px-4 ring-1 ring-[#dbe9f5]">
            {metrics.map((m, index) => {
              const isExpanded = expandedMetric === m.name;
              const metricColor = m.enabled ? PRIMARY_SHADOW : "#a7adb7";

              return (
                <div key={m.name} className={index > 0 ? "border-t border-[#e7edf2]" : ""}>
                  <div className={`flex items-center gap-3 pt-4 ${isExpanded ? "pb-2" : "pb-4"}`}>
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: m.enabled ? TRACK : "#f0f1f3", color: metricColor }}
                    >
                      <m.Icon />
                    </span>
                    <p className="min-w-0 flex-1 text-lg font-semibold" style={{ color: m.enabled ? "#451d13" : metricColor }}>
                      {m.name}
                    </p>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Show"} details for ${m.name}`}
                      onClick={() => setExpandedMetric((current) => (current === m.name ? null : m.name))}
                      className="flex h-9 w-7 flex-shrink-0 items-center justify-center text-amber-400"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-5 w-5 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <Switch checked={m.enabled} onChange={() => toggleMetric(m.name)} label={`Track ${m.name}`} />
                  </div>
                  {isExpanded && (
                    <p className="ml-[52px] w-[calc(100%-52px)] pb-4 text-base leading-snug text-amber-700">{m.why}</p>
                  )}
                </div>
              );
            })}
            </div>
          </section>

          {/* Physician Report */}
          <section className="flex flex-col gap-1">
            <SectionHeading>Physician Report</SectionHeading>

            <Card>
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-semibold text-amber-950">Date range</p>
              <SegmentedControl
                options={[
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                ]}
                value={reportRange}
                onChange={setReportRange}
              />
            </div>

            <div className="rounded-[12px] p-3" style={{ backgroundColor: TRACK }}>
              <p className="text-base font-semibold" style={{ color: PRIMARY_SHADOW }}>
                This is not a diagnosis — bring this to your doctor.
              </p>
            </div>

            <div className="flex gap-4">
              <button type="button" className="text-base font-semibold" style={{ color: PRIMARY_SHADOW }}>
                View
              </button>
              <button type="button" className="text-base font-semibold" style={{ color: PRIMARY_SHADOW }}>
                Share
              </button>
              <button type="button" className="text-base font-semibold" style={{ color: PRIMARY_SHADOW }}>
                Download
              </button>
            </div>
            </Card>
          </section>

          {/* Caregiver Updates */}
          <section className="flex flex-col gap-1">
            <SectionHeading>Caregiver Updates</SectionHeading>

            <Card>
            <input
              value={caregiverName}
              onChange={(e) => onCaregiverNameChange(e.target.value)}
              placeholder="Caregiver name"
              className="min-w-0 rounded-[12px] border border-[#dbe9f5] px-3 py-2 text-base text-amber-950 outline-none focus:border-[#4f7ea3]"
            />
            <input
              value={caregiverContact}
              onChange={(e) => onCaregiverContactChange(e.target.value)}
              placeholder="Phone"
              className="min-w-0 rounded-[12px] border border-[#dbe9f5] px-3 py-2 text-base text-amber-950 outline-none focus:border-[#4f7ea3]"
            />

            <div className="flex items-center justify-between gap-2">
              <p className="whitespace-nowrap text-base font-semibold text-amber-950">SMS frequency</p>
              <SegmentedControl
                options={[
                  { value: "off", label: "Off" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                ]}
                value={frequency}
                onChange={setFrequency}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="whitespace-nowrap text-base font-semibold text-amber-950">Emergency contact</p>
              </div>
              <Switch
                checked={caregiverIsEmergencyContact}
                onChange={onCaregiverIsEmergencyContactChange}
                label="Make caregiver the emergency contact"
              />
            </div>
            </Card>
          </section>
        </div>
      </div>

      {showContactModal && (
        <ContactModal
          initial={emergencyContact}
          onClose={() => setShowContactModal(false)}
          onSave={(c) => {
            onSaveEmergencyContact(c);
            setShowContactModal(false);
          }}
        />
      )}

      {showDevicePicker && (
        <DevicePickerModal
          onClose={() => setShowDevicePicker(false)}
          onSelect={(d) => {
            setDevice(d);
            setShowDevicePicker(false);
          }}
        />
      )}
    </div>
  );
}
