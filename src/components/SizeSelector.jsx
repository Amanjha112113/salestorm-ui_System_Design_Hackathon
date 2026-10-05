export default function SizeSelector({ sizes, value, onChange }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest text-ink-500 mb-2">
        SELECT SIZE
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`min-w-[48px] px-3 py-2 rounded-lg text-xs font-mono tracking-wider transition-colors border ${
              value === s
                ? "bg-flame-500 text-ink-950 border-flame-500 font-bold"
                : "bg-ink-900 text-cream-50 border-ink-700 hover:border-flame-500"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}