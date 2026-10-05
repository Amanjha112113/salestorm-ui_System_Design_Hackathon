import { motion } from "framer-motion";
import { useStore } from "../state/StoreContext.jsx";

export default function RequestFunnel() {
  const { state } = useStore();
  const s = state.stats;

  const stages = [
    { label: "Incoming", value: 10000, color: "bg-flame-500" },
    { label: "Admitted", value: Math.max(s.admitted, 100), color: "bg-acid-400" },
    { label: "Reserved", value: Math.max(s.admitted, 100), color: "bg-flame-500" },
    { label: "Paid", value: Math.max(s.paymentSuccess, 95), color: "bg-acid-400" },
  ];

  const max = stages[0].value;

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono tracking-widest text-ink-500">
          REQUEST FUNNEL
        </div>
        <div className="text-[10px] font-mono text-ink-600">live · last 60s</div>
      </div>

      <div className="mt-5 space-y-4">
        {stages.map((st, i) => (
          <div key={st.label}>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-ink-400">{st.label}</span>
              <span className="text-cream-50">{st.value.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(st.value / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`h-full ${st.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Pill label="BLOCKED" value={s.duplicatesBlocked} accent="text-flame-500" />
        <Pill label="OUT OF STOCK" value={s.outOfStock} accent="text-flame-500" />
        <Pill label="PAID" value={s.paymentSuccess} accent="text-acid-400" />
      </div>
    </div>
  );
}

function Pill({ label, value, accent }) {
  return (
    <div className="rounded-lg bg-ink-950/60 border border-ink-800 py-2">
      <div className={`font-mono text-lg font-bold ${accent}`}>{value}</div>
      <div className="text-[9px] font-mono tracking-widest text-ink-600 mt-0.5">
        {label}
      </div>
    </div>
  );
}