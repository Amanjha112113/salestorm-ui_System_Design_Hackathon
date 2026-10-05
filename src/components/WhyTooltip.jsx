import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Shield, Clock, Users } from "lucide-react";

export default function WhyTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-ink-800 bg-ink-950/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-ink-900/40 transition-colors"
        aria-expanded={open}
        aria-label="Why 10 minutes explainer"
      >
        <span className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-400">
          <HelpCircle size={12} />
          WHY 10 MINUTES?
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-ink-500"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <Row
                icon={<Shield size={12} />}
                title="Temporary hold"
                text="Your reservation is a short-lived lock on one unit — not a purchase."
              />
              <Row
                icon={<Clock size={12} />}
                title="Auto-release"
                text="If payment isn't completed in 10 minutes, the unit returns to the pool automatically."
              />
              <Row
                icon={<Users size={12} />}
                title="Fair for everyone"
                text="Other shoppers can claim the unit the moment your window closes."
              />
              <div className="pt-2 border-t border-ink-800 text-[10px] font-mono text-ink-600 leading-relaxed">
                You will never be charged for a reservation you didn't pay for.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-6 h-6 rounded-full bg-flame-500/10 border border-flame-500/30 flex items-center justify-center text-flame-500 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-cream-50">{title}</div>
        <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">{text}</div>
      </div>
    </div>
  );
}