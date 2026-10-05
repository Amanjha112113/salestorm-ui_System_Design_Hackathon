import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Truck, Gift, Megaphone } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";

const FAKE_NOTIFICATIONS = [
  { id: "n1", type: "drop", title: "Flash Drop live now", body: "75 pieces across 10 categories. 10-minute window.", minutesAgo: 1, icon: Zap },
  { id: "n2", type: "shipping", title: "Free shipping today", body: "All orders above ₹999 ship free during this drop.", minutesAgo: 4, icon: Truck },
  { id: "n3", type: "offer", title: "Extra 10% off on prepaid", body: "Use code STORM10 at checkout. Ends in 2 hours.", minutesAgo: 12, icon: Gift },
  { id: "n4", type: "system", title: "Price drop alert", body: "Aether Phone 16 Pro just dropped to ₹79,999.", minutesAgo: 28, icon: Zap },
  { id: "n5", type: "announce", title: "24×7 support is live", body: "Chat or call us anytime for order help.", minutesAgo: 60, icon: Megaphone },
];

export default function NotificationCenter() {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);

  // Combine fake notifications + real system events
  const systemEvents = state.events.slice(0, 3).map((e) => ({
    id: e.id,
    type: "system",
    title: e.type.replace(/_/g, " "),
    body: e.message,
    minutesAgo: Math.floor((Date.now() - e.timestamp) / 60000),
    icon: Zap,
  }));

  const items = [...systemEvents, ...FAKE_NOTIFICATIONS];

  const toggle = () => {
    setOpen((v) => !v);
    setRead(true);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-full text-cream-50 hover:bg-ink-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {!read && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-flame-500 pulse-dot" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-3 w-[360px] bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden z-40 shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
                <div className="text-[10px] font-mono tracking-widest text-flame-500">
                  NOTIFICATIONS
                </div>
                <span className="text-[10px] font-mono text-ink-500">
                  {items.length}
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {items.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="px-5 py-3 hover:bg-ink-800/50 transition-colors border-b border-ink-800/60 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-flame-500/10 border border-flame-500/30 flex items-center justify-center text-flame-500">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-cream-50">
                            {n.title}
                          </div>
                          <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">
                            {n.body}
                          </div>
                          <div className="text-[10px] font-mono text-ink-600 mt-1">
                            {n.minutesAgo === 0
                              ? "just now"
                              : `${n.minutesAgo}m ago`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t border-ink-800 bg-ink-950/40 text-center">
                <button className="text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500">
                  MARK ALL AS READ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}