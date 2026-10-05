import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import { Loader2, CheckCircle, XCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import { useStore } from "../state/StoreContext.jsx";

export default function Checkout() {
  const nav = useNavigate();
  const { state, dispatch } = useStore();
  const [stage, setStage] = useState("idle");
  const batchKey = useRef(uuid());

  const lines = state.cart
    .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.productId) }))
    .filter((l) => l.product);

  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  if (lines.length === 0 && stage === "idle") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-ink-400">Nothing to checkout.</div>
          <Link to="/" className="mt-4 inline-block text-flame-500 text-xs font-mono tracking-widest hover:underline">
            BROWSE THE DROP →
          </Link>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    setStage("processing");

    // Step 1: reserve all lines
    const reservations = lines.map((l) => {
      const rid = uuid();
      const key = `${batchKey.current}-${l.lineId}`;
      dispatch({
        type: "RESERVE",
        payload: { productId: l.productId, idempotencyKey: key, qty: l.qty, reservationId: rid },
      });
      return { rid, productId: l.productId, qty: l.qty };
    });

    // Step 2: simulate payment
    setTimeout(() => {
      const success = Math.random() < 0.95;
      reservations.forEach((r) => {
        dispatch({
          type: "PAYMENT_RESULT",
          payload: {
            reservationId: r.rid,
            success,
            paymentId: uuid(),
            productId: r.productId,
            qty: r.qty,
          },
        });
      });

      if (success) {
        dispatch({ type: "CART_CLEAR" });
        setStage("success");
        setTimeout(() => nav("/order/latest"), 1400);
      } else {
        setStage("failed");
      }
    }, 2200);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO BAG
        </Link>

        <h1 className="mt-6 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
          Checkout
        </h1>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl border border-ink-800 bg-ink-900/40">
              <div className="text-[10px] font-mono tracking-widest text-ink-500">
                ORDER
              </div>
              <div className="mt-4 space-y-3">
                {lines.map((l) => (
                  <div key={l.lineId} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <div className="text-cream-50 truncate">{l.product.name}</div>
                      <div className="text-[11px] font-mono text-ink-500 mt-0.5">
                        QTY {l.qty}
                        {l.size ? ` · SIZE ${l.size}` : ""}
                      </div>
                    </div>
                    <div className="font-mono text-cream-50 shrink-0 ml-3">
                      ₹{(l.product.price * l.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-amber-glow/30 bg-amber-glow/5">
              <div className="text-[10px] font-mono tracking-widest text-amber-glow">
                IDEMPOTENCY KEY
              </div>
              <div className="mt-1 font-mono text-xs text-cream-50 break-all">
                {batchKey.current}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl border border-ink-800 bg-ink-900/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-400">Total</span>
              <span className="font-mono text-xl font-bold text-cream-50">
                ₹{total.toLocaleString()}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {stage === "idle" && (
                <motion.button
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handlePay}
                  className="mt-5 w-full py-3 rounded-full bg-cream-50 text-ink-950 font-black text-xs tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all"
                >
                  PAY ₹{total.toLocaleString()}
                </motion.button>
              )}
              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 flex items-center justify-center gap-2 py-3 rounded-full bg-ink-800 text-ink-400 text-xs"
                >
                  <Loader2 size={14} className="animate-spin" />
                  PROCESSING…
                </motion.div>
              )}
              {stage === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 flex items-center justify-center gap-2 py-3 rounded-full bg-acid-400/10 text-acid-400 text-xs font-black tracking-widest"
                >
                  <CheckCircle size={14} />
                  SUCCESS
                </motion.div>
              )}
              {stage === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-5 space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 py-3 rounded-full bg-flame-500/10 text-flame-500 text-xs font-black tracking-widest">
                    <XCircle size={14} />
                    PAYMENT FAILED
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full py-2 rounded-full border border-ink-700 text-cream-50 text-xs font-mono tracking-widest hover:border-flame-500"
                  >
                    RETRY
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-600">
              <ShieldCheck size={12} className="text-acid-400" />
              IDEMPOTENT · ATOMIC · TRACEABLE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}