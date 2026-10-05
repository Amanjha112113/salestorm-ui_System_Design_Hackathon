import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PRODUCTS } from "../data/products.js";

const NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Arjun", "Kavya",
  "Aditya", "Isha", "Karan", "Meera", "Rahul", "Tanvi", "Nikhil", "Riya",
  "Siddharth", "Pooja", "Vivek", "Neha",
];

const CITIES = [
  "Mumbai", "Bengaluru", "Delhi", "Hyderabad", "Pune", "Chennai",
  "Kolkata", "Jaipur", "Ahmedabad", "Kochi",
];

const ACTIONS = [
  "just reserved",
  "just paid for",
  "just locked in",
  "just bought",
];

export default function SocialProofToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timeoutId;

    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 15000; // 15-30s
      timeoutId = setTimeout(() => {
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        const secondsAgo = Math.floor(Math.random() * 45) + 3;

        setToast({
          id: Date.now(),
          name,
          city,
          action,
          product,
          secondsAgo,
        });

        // Hide after 5 seconds
        setTimeout(() => setToast(null), 5000);

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-900/95 backdrop-blur-xl border border-ink-700 shadow-2xl max-w-sm"
          >
            {/* Product thumbnail */}
            <div className="relative shrink-0">
              <img
                src={toast.product.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-acid-400 flex items-center justify-center border-2 border-ink-900">
                <CheckCircle2 size={10} className="text-ink-950" />
              </div>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="text-xs text-cream-50 leading-tight">
                <span className="font-semibold">{toast.name}</span>{" "}
                <span className="text-ink-400">from {toast.city}</span>{" "}
                {toast.action}
              </div>
              <div className="text-[11px] text-ink-500 truncate mt-0.5">
                {toast.product.name}
              </div>
              <div className="text-[10px] font-mono text-ink-600 mt-0.5">
                {toast.secondsAgo}s ago
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}