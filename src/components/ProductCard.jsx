import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Flame, Eye, Zap } from "lucide-react";
import { useStore } from "../state/StoreContext.jsx";
import { useWishlist } from "../state/WishlistContext.jsx";

const SIZE_CLASS = {
  sm: "aspect-[4/5]",
  md: "aspect-[3/4]",
  lg: "aspect-[3/4]",
};

export default function ProductCard({ product, index = 0 }) {
  const { state } = useStore();
  const { toggle, has } = useWishlist();
  const inv = state.inventory[product.id];
  const claimed = inv ? (inv.sold + inv.reserved) / inv.total : 0;
  const pct = Math.round(claimed * 100);
  const left = inv ? inv.available : 0;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const seed = product.id.charCodeAt(2) + product.id.charCodeAt(3);
  const viewers = 40 + ((seed * 7) % 180);
  const velocity = 1 + ((seed * 3) % 9);
  const isHot = pct >= 70 && left > 0;
  const liked = has(product.id);

  const urgency =
    left === 0
      ? { label: "SOLD OUT", color: "text-ink-500" }
      : left <= 15
      ? { label: "ALMOST GONE", color: "text-flame-500" }
      : left <= 40
      ? { label: "SELLING FAST", color: "text-acid-400" }
      : { label: "LIVE", color: "text-cream-50" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg bg-ink-900">
        <Link to={`/product/${product.id}`}>
          <div className={`relative ${SIZE_CLASS[product.size] || SIZE_CLASS.md}`}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />

            {/* Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-ink-950/80 backdrop-blur-sm border border-ink-700">
              <span className={`w-1.5 h-1.5 rounded-full ${left === 0 ? "bg-ink-600" : "bg-flame-500"} pulse-dot`} />
              <span className="text-[9px] font-mono font-bold tracking-widest text-cream-50">
                {product.tag}
              </span>
            </div>

            {/* Discount */}
            {left > 0 && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-acid-400 text-ink-950 text-[10px] font-black tracking-tight">
                −{discount}%
              </div>
            )}

            {/* Live viewers */}
            {left > 0 && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-ink-950/80 backdrop-blur-sm border border-ink-700">
                <Eye size={10} className="text-cream-50" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-cream-50">
                  {viewers} VIEWING
                </span>
              </div>
            )}

            {/* Hot badge */}
            {isHot && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-flame-500 text-ink-950 border border-flame-700"
              >
                <Flame size={10} />
                <span className="text-[9px] font-mono font-black tracking-widest">HOT</span>
              </motion.div>
            )}
          </div>
        </Link>

        {/* Wishlist toggle (outside Link) */}
        <button
          onClick={() => toggle(product.id)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
            liked
              ? "bg-flame-500 border-flame-500 text-ink-950"
              : "bg-ink-950/80 border-ink-700 text-cream-50 hover:border-flame-500 hover:text-flame-500"
          }`}
          style={{ right: left > 0 ? undefined : "12px" }}
        >
          <Heart size={13} fill={liked ? "currentColor" : "none"} />
        </button>

        <Link to={`/product/${product.id}`} className="block p-4">
          <div className="text-[9px] font-mono tracking-[0.2em] text-ink-500">
            {product.brand}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold text-cream-50 leading-snug line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-cream-50">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="font-mono text-[11px] text-ink-600 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-ink-500">
                <Zap size={10} className={isHot ? "text-flame-500" : "text-ink-600"} />
                {velocity}/SEC
              </span>
              <span className={left <= 15 ? "text-flame-500" : "text-ink-500"}>
                {left} LEFT
              </span>
            </div>

            <div className="relative h-1 bg-ink-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-y-0 left-0 ${
                  left === 0 ? "bg-ink-600" : left <= 15 ? "bg-flame-500" : "bg-acid-400"
                }`}
              />
              {isHot && (
                <motion.div
                  animate={{ x: ["-100%", "400%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-flame-500/60 to-transparent"
                />
              )}
            </div>

            <div className="mt-1.5 text-[9px] font-mono tracking-widest text-ink-600">
              {pct}% CLAIMED
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}