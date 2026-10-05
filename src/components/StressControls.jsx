import { useState } from "react";
import { Zap, RotateCcw, Users, Play } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";
import { PRODUCTS } from "../data/products.js";

export default function StressControls() {
  const { dispatch } = useStore();
  const [replaying, setReplaying] = useState(false);

  const fireOne = (productId) => {
    const key = `burst-${Date.now()}-${Math.random()}`;
    dispatch({
      type: "RESERVE",
      payload: { productId, idempotencyKey: key, qty: 1 },
    });
  };

  const simulateBurst = (count) => {
    for (let i = 0; i < count; i++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      setTimeout(() => fireOne(product.id), i * 2);
    }
  };

  const replayLastBurst = () => {
    if (replaying) return;
    setReplaying(true);
    const total = 120;
    for (let i = 0; i < total; i++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      // Slower: 60ms apart = ~10x slower than real burst
      setTimeout(() => {
        fireOne(product.id);
        if (i === total - 1) setReplaying(false);
      }, i * 60);
    }
  };

  const reset = () => dispatch({ type: "RESET" });

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="text-[10px] font-mono tracking-widest text-ink-500">
        STRESS CONTROLS
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => simulateBurst(100)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-flame-500/10 border border-flame-500/40 text-flame-500 text-[10px] font-mono font-bold tracking-wider hover:bg-flame-500/20 transition-colors"
        >
          <Zap size={12} />
          +100 REQ
        </button>
        <button
          onClick={() => simulateBurst(1000)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-acid-400/10 border border-acid-400/40 text-acid-400 text-[10px] font-mono font-bold tracking-wider hover:bg-acid-400/20 transition-colors"
        >
          <Users size={12} />
          +1000 REQ
        </button>
        <button
          onClick={() => simulateBurst(10000)}
          className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-flame-500/10 border border-flame-500/40 text-flame-500 text-[10px] font-mono font-bold tracking-wider hover:bg-flame-500/20 transition-colors"
        >
          <Zap size={12} />
          SIMULATE 10,000 CONCURRENT REQUESTS
        </button>

        <button
          onClick={replayLastBurst}
          disabled={replaying}
          className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cream-50/5 border border-cream-50/30 text-cream-50 text-[10px] font-mono font-bold tracking-wider hover:bg-cream-50/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          <Play size={12} />
          {replaying ? "REPLAYING IN SLOW MOTION…" : "REPLAY LAST BURST (10× SLOW)"}
        </button>

        <button
          onClick={reset}
          className="col-span-2 flex items-center justify-center gap-2 py-2 rounded-lg border border-ink-700 text-ink-400 text-[10px] font-mono hover:bg-ink-800 transition-colors"
        >
          <RotateCcw size={12} />
          RESET SIMULATION
        </button>
      </div>

      <div className="mt-3 text-[10px] text-ink-600 leading-relaxed">
        Live requests fire 2ms apart. Replay runs the same sequence 60ms apart
        so you can narrate each step: reservation → admission → Redis decrement
        → event log.
      </div>
    </div>
  );
}