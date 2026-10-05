import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import {
  ArrowLeft,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import { useStore } from "../state/StoreContext.jsx";
import { useWishlist } from "../state/WishlistContext.jsx";
import WhyTooltip from "../components/WhyTooltip.jsx";
import SizeSelector from "../components/SizeSelector.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, dispatch } = useStore();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();

  const product = PRODUCTS.find((p) => p.id === id);
  const inv = state.inventory[id];

  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState("idle");
  const [reservation, setReservation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [duplicateFlash, setDuplicateFlash] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const idemKeyRef = useRef(uuid());

  // Default size = middle option if product has sizes
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes ? product.sizes[Math.floor(product.sizes.length / 2)] : null
  );

  // Reservation countdown
  useEffect(() => {
    if (stage !== "reserved" || !reservation) return;
    const t = setInterval(() => {
      const r = Math.max(
        0,
        Math.floor((reservation.expiresAt - Date.now()) / 1000)
      );
      setTimeLeft(r);
      if (r === 0) setStage("failed");
    }, 1000);
    return () => clearInterval(t);
  }, [stage, reservation]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-ink-500 font-mono text-xs tracking-widest">
            PRODUCT NOT FOUND
          </div>
          <button
            onClick={() => nav("/")}
            className="mt-4 text-flame-500 text-sm font-bold hover:underline"
          >
            ← Back to drop
          </button>
        </div>
      </div>
    );
  }

  const left = inv?.available ?? 0;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const liked = inWishlist(product.id);

  const handleReserve = () => {
    // If product has sizes, require a selection
    if (product.sizes && !selectedSize) {
      setSizeWarning(true);
      setTimeout(() => setSizeWarning(false), 1500);
      return;
    }

    const rid = uuid();
    const key = uuid();
    idemKeyRef.current = key;

    dispatch({
      type: "RESERVE",
      payload: { productId: id, idempotencyKey: key, qty: 1, reservationId: rid },
    });

    const now = Date.now();
    setReservation({
      id: rid,
      productId: id,
      qty: 1,
      size: selectedSize,
      status: "RESERVED",
      expiresAt: now + 10 * 60 * 1000,
      createdAt: now,
      idempotencyKey: key,
    });
    setTimeLeft(600);
    setStage("reserved");
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      setSizeWarning(true);
      setTimeout(() => setSizeWarning(false), 1500);
      return;
    }

    dispatch({
      type: "CART_ADD",
      payload: { productId: id, size: selectedSize, qty: 1 },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleDuplicateTest = () => {
    dispatch({
      type: "RESERVE",
      payload: {
        productId: id,
        idempotencyKey: idemKeyRef.current,
        qty: 1,
      },
    });
    setDuplicateFlash(true);
    setTimeout(() => setDuplicateFlash(false), 1200);
  };

  const handlePay = () => {
    if (!reservation) return;
    setStage("paying");
    setTimeout(() => {
      const success = Math.random() < 0.95;
      dispatch({
        type: "PAYMENT_RESULT",
        payload: {
          reservationId: reservation.id,
          success,
          paymentId: uuid(),
          productId: reservation.productId,
          qty: reservation.qty,
        },
      });
      setStage(success ? "success" : "failed");
      if (success) {
        setTimeout(() => {
          setModalOpen(false);
          nav("/order/latest");
        }, 1400);
      }
    }, 2000);
  };

  const copyReservationId = () => {
    if (!reservation) return;
    navigator.clipboard.writeText(reservation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen">
      <button
        onClick={() => nav(-1)}
        className="fixed top-20 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-ink-900/80 backdrop-blur border border-ink-800 text-[10px] font-mono tracking-widest text-cream-50 hover:border-flame-500 transition-colors"
      >
        <ArrowLeft size={14} />
        BACK TO DROP
      </button>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* ───── IMAGE SIDE ───── */}
        <div className="relative bg-ink-900 overflow-hidden min-h-[60vh] lg:min-h-screen">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/80 backdrop-blur border border-ink-700">
            <span className="w-1.5 h-1.5 rounded-full bg-flame-500 pulse-dot" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-cream-50">
              {product.tag}
            </span>
          </div>
        </div>

        {/* ───── INFO SIDE ───── */}
        <div className="flex items-center px-6 md:px-16 py-32 lg:py-20 bg-ink-950">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono tracking-[0.3em] text-flame-500">
                {product.brand}
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className={`text-[10px] font-mono tracking-widest transition-colors ${
                  liked ? "text-flame-500" : "text-ink-500 hover:text-flame-500"
                }`}
              >
                {liked ? "♥ SAVED" : "♡ SAVE"}
              </button>
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-black text-cream-50 leading-[1.05] tracking-tight">
              {product.name}
            </h1>

            <p className="mt-6 text-ink-400 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-10 flex items-baseline gap-4">
              <span className="font-mono text-5xl font-black text-cream-50">
                ₹{product.price.toLocaleString()}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-sm text-ink-600 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-black tracking-tight text-acid-400">
                  SAVE {discount}%
                </span>
              </div>
            </div>

            {/* Inventory bar */}
            <div className="mt-10">
              <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                <span className="text-ink-500 tracking-widest">
                  {left === 0 ? "SOLD OUT" : `${left} OF ${inv.total} LEFT`}
                </span>
                {left > 0 && left <= 15 && (
                  <span className="text-flame-500 tracking-widest">
                    ⚡ ALMOST GONE
                  </span>
                )}
              </div>
              <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${((inv.sold + inv.reserved) / inv.total) * 100}%`,
                  }}
                  className="h-full bg-gradient-to-r from-flame-700 to-flame-500"
                />
              </div>
            </div>

            {/* Size selector */}
            {product.sizes && (
              <div className="mt-8">
                <SizeSelector
                  sizes={product.sizes}
                  value={selectedSize}
                  onChange={setSelectedSize}
                />
                {sizeWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-[10px] font-mono tracking-widest text-flame-500"
                  >
                    ⚠ PLEASE SELECT A SIZE
                  </motion.div>
                )}
              </div>
            )}

            {/* Reserve */}
            <button
              onClick={handleReserve}
              disabled={left === 0}
              className="mt-8 w-full group flex items-center justify-between px-6 py-5 rounded-full bg-cream-50 text-ink-950 font-black text-sm tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all disabled:bg-ink-800 disabled:text-ink-600 disabled:cursor-not-allowed"
            >
              <span>{left === 0 ? "SOLD OUT" : "RESERVE NOW"}</span>
              <span className="flex items-center gap-2">
                <Zap size={14} />
                <span className="text-[10px] font-mono">1-CLICK</span>
              </span>
            </button>

            {/* Add to bag */}
            <button
              onClick={handleAddToCart}
              disabled={left === 0}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-4 rounded-full border font-black text-xs tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                addedToCart
                  ? "border-acid-400 bg-acid-400/10 text-acid-400"
                  : "border-ink-700 text-cream-50 hover:border-flame-500 hover:text-flame-500"
              }`}
            >
              <ShoppingBag size={14} />
              {addedToCart ? "ADDED TO BAG ✓" : "ADD TO BAG"}
            </button>

            {/* Duplicate test */}
            {stage === "reserved" && (
              <button
                onClick={handleDuplicateTest}
                className={`mt-3 w-full py-3 rounded-full border text-[10px] font-mono tracking-widest transition-all ${
                  duplicateFlash
                    ? "border-flame-500 bg-flame-500/20 text-flame-500"
                    : "border-ink-700 text-ink-400 hover:border-flame-500 hover:text-flame-500"
                }`}
              >
                {duplicateFlash
                  ? "⚡ DUPLICATE BLOCKED BY IDEMPOTENCY KEY"
                  : "TEST DUPLICATE REQUEST (IDEMPOTENCY DEMO)"}
              </button>
            )}

            {/* Trust row */}
            <div className="mt-6 flex items-center gap-6 text-[10px] font-mono tracking-widest text-ink-600">
              <span className="flex items-center gap-2">
                <ShieldCheck size={12} />
                ATOMIC RESERVATION
              </span>
              <span className="flex items-center gap-2">
                <Clock size={12} />
                10-MIN HOLD
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── MODAL ───── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => stage !== "paying" && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden my-8"
            >
              <div
                className={`h-1 ${
                  stage === "reserved"
                    ? "bg-acid-400"
                    : stage === "success"
                    ? "bg-acid-400"
                    : stage === "failed"
                    ? "bg-flame-500"
                    : "bg-ink-700"
                }`}
              />

              <div className="p-8 space-y-4">
                {stage === "reserved" && (
                  <>
                    <div className="flex items-center gap-2 text-acid-400">
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-mono tracking-widest font-bold">
                        UNIT RESERVED
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-cream-50 tracking-tight">
                      You have 10 minutes.
                    </h3>
                    <p className="text-sm text-ink-400">
                      Complete payment to lock this unit. After that, it goes
                      back to the drop.
                    </p>

                    {/* Size reminder */}
                    {reservation?.size && (
                      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-ink-500 pt-1">
                        <span>SIZE</span>
                        <span className="text-cream-50">
                          {reservation.size}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-center py-6 rounded-lg bg-ink-950 border border-ink-800">
                      <div className="font-mono text-4xl font-black text-flame-500 tabular-nums">
                        {mm}:{ss}
                      </div>
                    </div>

                    <WhyTooltip />

                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-600 tracking-widest pt-2">
                      <span>RESERVATION ID</span>
                      <button
                        onClick={copyReservationId}
                        className="flex items-center gap-1.5 text-cream-50 hover:text-flame-500 transition-colors"
                      >
                        {reservation?.id.slice(0, 8).toUpperCase()}
                        {copied ? (
                          <Check size={10} className="text-acid-400" />
                        ) : (
                          <Copy size={10} />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handlePay}
                      className="w-full py-4 rounded-full bg-cream-50 text-ink-950 font-black text-sm tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all"
                    >
                      PAY ₹{product.price.toLocaleString()} NOW
                    </button>

                    <button
                      onClick={() => setModalOpen(false)}
                      className="w-full py-2 text-[10px] font-mono tracking-widest text-ink-600 hover:text-cream-50 transition-colors"
                    >
                      RELEASE RESERVATION
                    </button>
                  </>
                )}

                {stage === "paying" && (
                  <div className="py-12 text-center">
                    <Loader2 size={32} className="mx-auto text-acid-400 animate-spin" />
                    <div className="mt-6 text-[10px] font-mono tracking-widest text-ink-500">
                      PROCESSING PAYMENT
                    </div>
                    <div className="mt-2 text-xs font-mono text-ink-600">
                      idempotency key · {idemKeyRef.current.slice(0, 8)}…
                    </div>
                  </div>
                )}

                {stage === "success" && (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-acid-400 flex items-center justify-center">
                      <CheckCircle size={28} className="text-ink-950" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black text-cream-50 tracking-tight">
                      Order confirmed.
                    </h3>
                    <p className="mt-2 text-sm text-ink-400">
                      Redirecting to your order…
                    </p>
                  </div>
                )}

                {stage === "failed" && (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-flame-500/20 border border-flame-500 flex items-center justify-center">
                      <XCircle size={28} className="text-flame-500" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black text-cream-50 tracking-tight">
                      Payment failed.
                    </h3>
                    <p className="mt-2 text-sm text-ink-400">
                      The unit has been released back to the drop.
                    </p>
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        setStage("idle");
                        setReservation(null);
                      }}
                      className="mt-6 w-full py-3 rounded-full border border-ink-700 text-cream-50 text-xs font-mono tracking-widest hover:border-flame-500 transition-colors"
                    >
                      CLOSE
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}