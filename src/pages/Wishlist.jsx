import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useWishlist } from "../state/WishlistContext.jsx";

export default function Wishlist() {
  const { ids } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors"
        >
          <ArrowLeft size={12} />
          BACK TO DROP
        </Link>

        <div className="mt-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-flame-500">
              WISHLIST
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
              Saved for later{" "}
              <span className="serif italic font-normal text-ink-500">
                · {items.length}
              </span>
            </h1>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 text-center">
            <Heart size={40} className="mx-auto text-ink-700" />
            <div className="mt-4 text-sm text-ink-400">
              Nothing saved yet. Tap the heart on any product.
            </div>
            <Link
              to="/"
              className="mt-6 inline-block text-flame-500 text-xs font-mono tracking-widest hover:underline"
            >
              BROWSE THE DROP →
            </Link>
          </div>
        ) : (
          <div className="mt-10 masonry">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}