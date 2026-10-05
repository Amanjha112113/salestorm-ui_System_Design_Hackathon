import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";

export default function Navbar() {
  const { state, dispatch } = useStore();

  const toggle = () => dispatch({ type: "TOGGLE_MODE" });

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-ink-800/60 bg-ink-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => state.mode === "system" && dispatch({ type: "SET_MODE", payload: "shop" })}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-flame-500 flex items-center justify-center">
            <span className="text-ink-950 font-black text-sm">S</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black tracking-tight text-cream-50">
              SALESTORM
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-ink-600 -mt-0.5">
              DROP 01 · 2026
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500">
            <span className="w-1.5 h-1.5 rounded-full bg-flame-500 pulse-dot" />
            LIVE NOW
          </div>
          <button
            onClick={toggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-mono tracking-widest transition-colors ${
              state.mode === "system"
                ? "border-flame-500 text-flame-500 bg-flame-500/10"
                : "border-ink-700 text-cream-50 hover:border-flame-500 hover:text-flame-500"
            }`}
          >
            <Activity size={12} />
            {state.mode === "shop" ? "SYSTEM" : "SHOP"}
          </button>
        </div>
      </div>
    </nav>
  );
}