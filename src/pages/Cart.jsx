import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import { useStore } from "../state/StoreContext.jsx";

export default function Cart() {
  const { state, dispatch } = useStore();
  const nav = useNavigate();

  const lines = state.cart
    .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const savings = lines.reduce(
    (s, l) => s + (l.product.originalPrice - l.product.price) * l.qty,
    0
  );

  if (lines.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={40} className="mx-auto text-ink-700" />
          <div className="mt-4 text-sm text-ink-400">Your bag is empty.</div>
          <Link
            to="/"
            className="mt-6 inline-block text-flame-500 text-xs font-mono tracking-widest hover:underline"
          >
            BROWSE THE DROP →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors"
        >
          <ArrowLeft size={12} />
          CONTINUE SHOPPING
        </Link>

        <h1 className="mt-6 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
          Your bag
        </h1>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          {/* Lines */}
          <div className="lg:col-span-2 space-y-3">
            {lines.map((l) => (
              <div
                key={l.lineId}
                className="flex items-center gap-4 p-4 rounded-2xl border border-ink-800 bg-ink-900/40"
              >
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono tracking-widest text-ink-500">
                    {l.product.brand}
                  </div>
                  <div className="text-sm font-semibold text-cream-50 truncate mt-0.5">
                    {l.product.name}
                  </div>
                  {l.size && (
                    <div className="text-[11px] font-mono text-ink-400 mt-1">
                      SIZE · {l.size}
                    </div>
                  )}
                  <div className="font-mono text-sm text-cream-50 mt-1">
                    ₹{l.product.price.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() =>
                      dispatch({ type: "CART_REMOVE", payload: { lineId: l.lineId } })
                    }
                    className="p-1.5 text-ink-600 hover:text-flame-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "CART_UPDATE_QTY",
                          payload: { lineId: l.lineId, qty: l.qty - 1 },
                        })
                      }
                      className="w-7 h-7 rounded border border-ink-700 text-ink-400 hover:text-cream-50 hover:border-flame-500 text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-mono text-cream-50">
                      {l.qty}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "CART_UPDATE_QTY",
                          payload: { lineId: l.lineId, qty: l.qty + 1 },
                        })
                      }
                      className="w-7 h-7 rounded border border-ink-700 text-ink-400 hover:text-cream-50 hover:border-flame-500 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl border border-ink-800 bg-ink-900/40">
            <div className="text-[10px] font-mono tracking-widest text-ink-500">
              SUMMARY
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-400">Subtotal</span>
                <span className="font-mono text-cream-50">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">You save</span>
                <span className="font-mono text-acid-400">
                  −₹{savings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">Shipping</span>
                <span className="font-mono text-acid-400">FREE</span>
              </div>
              <div className="pt-3 border-t border-ink-800 flex justify-between">
                <span className="font-semibold text-cream-50">Total</span>
                <span className="font-mono font-bold text-cream-50">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => nav("/checkout")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-cream-50 text-ink-950 font-black text-xs tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all"
            >
              RESERVE & CHECKOUT
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}