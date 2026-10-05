import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, PRICE_BANDS } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../state/StoreContext.jsx";

export default function Landing() {
  const { state, dispatch } = useStore();
  const [time, setTime] = useState(2847);
  const [category, setCategory] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("demand");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(time / 3600)).padStart(2, "0");
  const mm = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  const filtered = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === priceBand);
    let list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (band && band.min !== undefined) {
        if (p.price < band.min || p.price > band.max) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "discount")
      list = [...list].sort(
        (a, b) =>
          (b.originalPrice - b.price) / b.originalPrice -
          (a.originalPrice - a.price) / a.originalPrice
      );
    else if (sort === "demand")
      list = [...list].sort((a, b) => {
        const ia = state.inventory[a.id];
        const ib = state.inventory[b.id];
        const pa = ia ? (ia.sold + ia.reserved) / ia.total : 0;
        const pb = ib ? (ib.sold + ib.reserved) / ib.total : 0;
        return pb - pa;
      });

    return list;
  }, [category, priceBand, search, sort, state.inventory]);

  const totalUnits = Object.values(state.inventory).reduce((s, i) => s + i.total, 0);
  const totalSold = Object.values(state.inventory).reduce((s, i) => s + i.sold, 0);
  const pctClaimed = Math.round((totalSold / totalUnits) * 100);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (priceBand !== "all" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearFilters = () => {
    setCategory("all");
    setPriceBand("all");
    setSearch("");
  };

  return (
    <div>
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&q=80"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-end w-full">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-flame-500/40 bg-flame-500/10 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-flame-500 pulse-dot" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-flame-500">
                LIVE DROP · DAY 01
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl lg:text-8xl font-black text-cream-50 leading-[0.95] tracking-tight"
            >
              When 10,000
              <br />
              <span className="serif italic font-normal text-flame-500">
                compete
              </span>{" "}
              for 100.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base md:text-lg text-ink-400 max-w-xl leading-relaxed"
            >
              50 pieces. 8 sections. One reserved unit per person. When it's
              gone, it's gone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <div className="flex items-baseline gap-2 font-mono">
                <TimeBlock value={hh} label="HRS" />
                <span className="text-2xl text-ink-600">:</span>
                <TimeBlock value={mm} label="MIN" />
                <span className="text-2xl text-ink-600">:</span>
                <TimeBlock value={ss} label="SEC" />
              </div>

              <a
                href="#drop"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-cream-50 text-ink-950 font-bold text-sm tracking-wide hover:bg-flame-500 hover:text-cream-50 transition-all"
              >
                SHOP THE DROP
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 max-w-md"
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-ink-500 tracking-widest">{pctClaimed}% CLAIMED</span>
                <span className="text-flame-500">{totalUnits - totalSold} UNITS LEFT</span>
              </div>
              <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pctClaimed}%` }}
                  className="h-full bg-gradient-to-r from-flame-700 via-flame-500 to-acid-400"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 space-y-3"
          >
            <SideStat icon={<TrendingUp size={14} />} label="LIVE SHOPPERS" value="10,284" />
            <SideStat icon={<Zap size={14} />} label="REQUESTS / SEC" value="482K" />
            <SideStat icon={<Clock size={14} />} label="AVG RESERVE TIME" value="1.2s" />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-ink-800 bg-ink-950/80 backdrop-blur-sm overflow-hidden">
          <div className="flex ticker whitespace-nowrap py-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-8 text-xs font-mono text-ink-500">
                <span>⚡ AETHER PRO HEADPHONES · 94% CLAIMED</span>
                <span>🔥 KINETIC RUNNER V2 · ALMOST GONE</span>
                <span>💎 VOYAGE WEEKENDER · 12 LEFT</span>
                <span>⚡ MONOLITH HEADPHONES · SELLING FAST</span>
                <span>🔥 TERRA MUG SET · LAST CHANCE</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="drop" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-flame-500">
              TODAY'S DROP
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
              {CATEGORIES.find((c) => c.id === category)?.label || "All"}{" "}
              <span className="serif italic font-normal text-ink-500">
                · {filtered.length} pieces
              </span>
            </h2>
          </div>
        </div>

        <div className="sticky top-16 z-20 -mx-6 px-6 py-4 bg-ink-950/95 backdrop-blur-xl border-y border-ink-800/60 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[220px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="w-full pl-11 pr-10 py-3 rounded-full bg-ink-900 border border-ink-800 text-sm text-cream-50 placeholder:text-ink-600 focus:outline-none focus:border-flame-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-flame-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-mono tracking-widest transition-colors ${
                filtersOpen || activeFilterCount > 0
                  ? "border-flame-500 text-flame-500"
                  : "border-ink-800 text-cream-50 hover:border-ink-600"
              }`}
            >
              <SlidersHorizontal size={14} />
              FILTERS
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-flame-500 text-ink-950 text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 rounded-full bg-ink-900 border border-ink-800 text-xs font-mono tracking-widest text-cream-50 focus:outline-none focus:border-flame-500 cursor-pointer"
            >
              <option value="demand">SORT: DEMAND</option>
              <option value="discount">SORT: DISCOUNT</option>
              <option value="price-asc">PRICE: LOW → HIGH</option>
              <option value="price-desc">PRICE: HIGH → LOW</option>
            </select>
          </div>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-ink-500 mb-3">
                      CATEGORY
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCategory(c.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors ${
                            category === c.id
                              ? "bg-flame-500 text-ink-950 font-bold"
                              : "bg-ink-900 text-ink-400 hover:bg-ink-800"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-ink-500 mb-3">
                      PRICE
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_BANDS.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setPriceBand(b.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors ${
                            priceBand === b.id
                              ? "bg-flame-500 text-ink-950 font-bold"
                              : "bg-ink-900 text-ink-400 hover:bg-ink-800"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="text-xs font-mono tracking-widest text-flame-500 hover:underline"
                    >
                      CLEAR ALL FILTERS
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-ink-500 text-sm">No products match your filters.</div>
            <button
              onClick={clearFilters}
              className="mt-4 text-flame-500 text-sm font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="masonry">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-ink-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-ink-600 font-mono">
            SALESTORM © 2026 · A CONCURRENCY-SAFE FLASH SALE PLATFORM
          </div>
          <button
            onClick={() => dispatch({ type: "SET_MODE", payload: "system" })}
            className="text-xs font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors"
          >
            VIEW SYSTEM ARCHITECTURE →
          </button>
        </div>
      </footer>
    </div>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-bold text-cream-50 tabular-nums">
        {value}
      </div>
      <div className="text-[9px] tracking-[0.2em] text-ink-600 mt-1">{label}</div>
    </div>
  );
}

function SideStat({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-lg border border-ink-800 bg-ink-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-flame-500">{icon}</span>
        <span className="text-[10px] font-mono tracking-widest text-ink-500">
          {label}
        </span>
      </div>
      <span className="font-mono text-sm font-bold text-cream-50">{value}</span>
    </div>
  );
}