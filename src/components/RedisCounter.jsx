import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";

export default function RedisCounter() {
  const { state } = useStore();
  const inv = state.inventory["hp-01"];

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500">
          <Database size={12} />
          REDIS · hp-01
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-acid-400 pulse-dot" />
      </div>

      <div className="mt-4 space-y-3">
        <Bar label="available" value={inv.available} total={inv.total} color="bg-flame-500" />
        <Bar label="reserved" value={inv.reserved} total={inv.total} color="bg-acid-400" />
        <Bar label="sold" value={inv.sold} total={inv.total} color="bg-cream-50" />
      </div>

      <div className="mt-4 pt-4 border-t border-ink-800 font-mono text-[10px] text-ink-500 space-y-1">
        <div className="flex justify-between">
          <span>LUA script</span>
          <span className="text-acid-400">atomic ✓</span>
        </div>
        <div className="flex justify-between">
          <span>invariant</span>
          <span className="text-cream-50">
            {inv.available + inv.reserved + inv.sold} = {inv.total}
          </span>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value, total, color }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
        <span className="text-ink-500">{label}</span>
        <span className="text-cream-50">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}