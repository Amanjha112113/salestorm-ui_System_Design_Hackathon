import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { useStore } from "../state/StoreContext.jsx";

export default function CartDrawer({ open, onClose }) {
  const { state, dispatch } = useStore();
  const nav = useNavigate();

  const lines = state.cart.map((l) => ({
    ...l,
    product: PRODUCTS.find((p) => p.id === l.productId),
  })).filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const savings = lines.reduce(
    (s, l) => s + (l.product.originalPrice - l.product.price) * l.qty,
    0
  );

  const updateQty = (lineId, qty) =>
    dispatch({ type: "CART_UPDATE_QTY", payload: { lineId, qty } });
  const remove = (lineId) =>
    dispatch({ type: "CART_REMOVE", payload: { lineId } });

  const checkout = () => {
    onClose();
    nav("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-ink-900 border-l border-ink-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink-800 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-flame-500" />
                <span className="text-sm font-black tracking-tight text-cream-50">
                  YOUR BAG
                </span>
                <span className="text-[10px] font-mono text-ink-500">
                  ({lines.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-ink-500 hover:text-cream-50 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={40} className="text-ink-700" />
                  <div className="mt-4 text-sm text-ink-400">
                    Your bag is empty.
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-4 text-flame-500 text-xs font-mono tracking-widest hover:underline"
                  >
                    CONTINUE SHOPPING →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lines.map((l) => (
                    <div
                      key={l.lineId}
                      className="flex gap-3 p-3 rounded-xl border border-ink-800 bg-ink-950/40"
                    >
                      <img
                        src={l.product.image}
                        alt={l.product.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-mono tracking-widest text-ink-500">
                          {l.product.brand}
                        </div>
                        <div className="text-xs font-semibold text-cream-50 truncate mt-0.5">
                          {l.product.name}
                        </div>
                        {l.size && (
                          <div className="text-[10px] font-mono text-ink-400 mt-0.5">
                            SIZE {l.size}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQty(l.lineId, l.qty - 1)}
                              className="w-6 h-6 rounded border border-ink-700 text-ink-400 hover:text-cream-50 hover:border-flame-500 text-xs"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-mono text-cream-50">
                              {l.qty}
                            </span>
                            <button
                              onClick={() => updateQty(l.lineId, l.qty + 1)}
                              className="w-6 h-6 rounded border border-ink-700 text-ink-400 hover:text-cream-50 hover:border-flame-500 text-xs"
                            >
                              +
                            </button>
                          </div>
                          <div className="font-mono text-xs text-cream-50">
                            ₹{(l.product.price * l.qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(l.lineId)}
                        className="p-1.5 self-start text-ink-600 hover:text-flame-500 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-ink-800 px-6 py-4 shrink-0 bg-ink-950/60">
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-cream-50">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-400 mt-2">
                  <span>You save</span>
                  <span className="font-mono text-acid-400">
                    −₹{savings.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-ink-800">
                  <span className="font-semibold text-cream-50">Total</span>
                  <span className="font-mono font-bold text-cream-50">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={checkout}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-cream-50 text-ink-950 font-black text-xs tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all"
                >
                  CHECKOUT
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}