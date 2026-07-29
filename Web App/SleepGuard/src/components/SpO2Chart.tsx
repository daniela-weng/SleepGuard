const SPO2_THRESHOLD = 90;

// Simulated overnight SpO2 readings (%), one per ~20 min, with two desaturation dips.
const READINGS = [
  97, 96, 97, 96, 95, 94, 92, 89, 87, 88, 91, 94, 96, 97, 96, 95, 96, 97, 96,
  94, 91, 88, 86, 88, 92, 95, 96, 97, 96, 95, 97, 96,
];

const WIDTH = 320;
const HEIGHT = 140;
const MIN = 82;
const MAX = 100;

function toPoint(i: number, value: number) {
  const x = (i / (READINGS.length - 1)) * WIDTH;
  const y = HEIGHT - ((value - MIN) / (MAX - MIN)) * HEIGHT;
  return { x, y };
}

export default function SpO2Chart() {
  const points = READINGS.map((v, i) => toPoint(i, v));
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const thresholdY = toPoint(0, SPO2_THRESHOLD).y;

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Overnight blood oxygen chart, dipping below 90 percent twice"
      >
        {/* Danger zone below 90% */}
        <rect
          x={0}
          y={thresholdY}
          width={WIDTH}
          height={HEIGHT - thresholdY}
          fill="#dc2626"
          fillOpacity={0.08}
        />
        <line
          x1={0}
          y1={thresholdY}
          x2={WIDTH}
          y2={thresholdY}
          stroke="#dc2626"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <path d={linePath} fill="none" stroke="#16a34a" strokeWidth={3} />
        {points.map((p, i) => {
          const isLow = READINGS[i] < SPO2_THRESHOLD;
          return isLow ? (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill="#dc2626" />
          ) : null;
        })}
      </svg>
      <div className="mt-1 flex justify-between text-sm text-slate-500">
        <span>10:00 PM</span>
        <span>6:00 AM</span>
      </div>
    </div>
  );
}
