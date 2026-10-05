import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";
import { PRODUCTS } from "../data/products.js";

const STEPS = [
  { key: "CREATED", label: "Order Created" },
  { key: "PAYMENT_PENDING", label: "Payment Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderTracker() {
  const { id } = useParams();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id) || state.orders[0];

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-ink-500 font-mono text-xs tracking-widest">
            NO ORDER YET
          </div>
          <Link
            to="/"
            className="mt-4 inline-block text-flame-500 text-sm font-bold hover:underline"
          >
            ← Back to drop
          </Link>
        </div>
      </div>
    );
  }

  const product = PRODUCTS.find((p) => p.id === order.productId);
  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO DROP
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-acid-400" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-acid-400 font-bold">
              ORDER CONFIRMED
            </span>
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
            You got it.
          </h1>
          <p className="mt-3 text-ink-400">
            Order{" "}
            <span className="font-mono text-cream-50">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>{" "}
            is confirmed. We'll notify you the moment it ships.
          </p>
        </motion.div>

        {product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-10 flex items-center gap-5 p-5 rounded-2xl border border-ink-800 bg-ink-900/40"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="text-[10px] font-mono tracking-widest text-ink-500">
                {product.brand}
              </div>
              <div className="mt-1 text-base font-semibold text-cream-50">
                {product.name}
              </div>
              <div className="mt-1 font-mono text-sm text-ink-500">
                ₹{product.price.toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="text-[10px] font-mono tracking-[0.3em] text-ink-500 mb-5">
            LIFECYCLE
          </div>
          <div className="space-y-1">
            {STEPS.map((s, idx) => {
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      done ? "bg-acid-400 border-acid-400" : "bg-transparent border-ink-700"
                    } ${active ? "ring-4 ring-acid-400/20" : ""}`}
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="text-ink-950" />
                    ) : (
                      <Circle size={10} className="text-ink-600" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between py-3">
                    <span
                      className={`text-sm ${
                        done ? "text-cream-50 font-medium" : "text-ink-500"
                      }`}
                    >
                      {s.label}
                    </span>
                    {active && (
                      <span className="text-[9px] font-mono tracking-widest text-acid-400 font-bold">
                        NOW
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 p-5 rounded-2xl border border-ink-800 bg-ink-900/40"
        >
          <div className="text-[10px] font-mono tracking-widest text-ink-500">
            WHAT HAPPENS NEXT
          </div>
          <p className="mt-3 text-sm text-ink-400 leading-relaxed">
            Your payment was processed idempotently. The order will be picked up
            by our fulfilment service, dispatched within 24 hours, and you'll
            receive SMS + email updates at every step.
          </p>
        </motion.div>
      </div>
    </div>
  );
}