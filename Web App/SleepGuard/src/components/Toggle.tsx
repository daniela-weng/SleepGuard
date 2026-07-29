export default function Toggle({
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
      className={`inline-flex h-9 w-16 flex-shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-apneaGreen" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}
