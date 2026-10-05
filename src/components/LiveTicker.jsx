import { useStore } from "../state/StoreContext.jsx";
import { PRODUCTS } from "../data/products.js";

export default function LiveTicker() {
  const { state } = useStore();

  // Build ticker items from recent events + live product stats
  const recentEvents = state.events.slice(0, 6).map((e) => {
    const icon =
      e.type === "RESERVATION_CREATED"
        ? "⚡"
        : e.type === "PAYMENT_SUCCEEDED"
        ? "💎"
        : e.type === "OUT_OF_STOCK"
        ? "🔥"
        : e.type === "DUPLICATE_BLOCKED"
        ? "🛡️"
        : "·";
    return `${icon} ${e.type.replace(/_/g, " ")}`;
  });

  // Add live product stats
  const liveStats = PRODUCTS.slice(0, 8)
    .map((p) => {
      const inv = state.inventory[p.id];
      if (!inv) return null;
      const pct = Math.round(((inv.sold + inv.reserved) / inv.total) * 100);
      const label =
        inv.available === 0
          ? "SOLD OUT"
          : inv.available <= 15
          ? "ALMOST GONE"
          : pct >= 60
          ? "SELLING FAST"
          : "LIVE";
      return `${p.name.split(" ").slice(0, 3).join(" ").toUpperCase()} · ${pct}% · ${label}`;
    })
    .filter(Boolean);

  const items = [...recentEvents, ...liveStats];
  const repeated = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-ink-800 bg-ink-950/80 backdrop-blur-sm overflow-hidden">
      <div className="flex ticker whitespace-nowrap py-3">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center px-8 text-xs font-mono text-ink-500"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}