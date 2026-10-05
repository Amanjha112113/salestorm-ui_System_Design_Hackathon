import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../state/StoreContext.jsx";

const LEVEL_COLOR = {
  info: "text-ink-400 border-ink-700",
  success: "text-acid-400 border-acid-400/40",
  warn: "text-flame-500 border-flame-500/40",
  error: "text-flame-500 border-flame-500/40",
};

export default function EventStream() {
  const { state } = useStore();

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono tracking-widest text-ink-500">
          EVENT STREAM · KAFKA
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-flame-500 pulse-dot" />
      </div>

      <div className="mt-4 h-72 overflow-y-auto space-y-1.5 pr-1">
        <AnimatePresence initial={false}>
          {state.events.length === 0 && (
            <div className="text-xs text-ink-600 font-mono text-center py-8">
              Waiting for events…
            </div>
          )}
          {state.events.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-2 px-2 py-1.5 rounded border-l-2 bg-ink-950/40 ${LEVEL_COLOR[e.level]}`}
            >
              <span className="font-mono text-[10px] text-ink-600 mt-0.5">
                {new Date(e.timestamp).toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] font-bold tracking-wider">
                  {e.type}
                </div>
                <div className="text-[11px] text-ink-400 truncate">
                  {e.message}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}