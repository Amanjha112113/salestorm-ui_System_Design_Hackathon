import { useStore } from "../state/StoreContext.jsx";

const SERVICES = [
  { name: "API Gateway", key: "gateway" },
  { name: "Inventory", key: "inventory" },
  { name: "Payment", key: "payment" },
  { name: "Order", key: "order" },
  { name: "Fulfilment", key: "fulfilment" },
  { name: "Notification", key: "notification" },
];

export default function ServiceStatusGrid() {
  const { state } = useStore();

  const getStatus = (key) => {
    if (key === "inventory") {
      const inv = state.inventory["hp-01"];
      if (inv && inv.available === 0) return "saturated";
    }
    if (key === "payment" && state.stats.paymentFailed > 3) return "degraded";
    return "healthy";
  };

  const color = {
    healthy: "bg-acid-400",
    degraded: "bg-flame-500",
    saturated: "bg-flame-700",
  };

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="text-[10px] font-mono tracking-widest text-ink-500">
        SERVICE HEALTH
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {SERVICES.map((s) => {
          const st = getStatus(s.key);
          return (
            <div
              key={s.key}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-950/60 border border-ink-800"
            >
              <span className="text-[11px] text-cream-50">{s.name}</span>
              <span className={`w-2 h-2 rounded-full ${color[st]} pulse-dot`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}