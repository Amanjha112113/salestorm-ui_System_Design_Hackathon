import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn } from "lucide-react";
import { useAuth } from "../state/AuthContext.jsx";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name);
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden"
          >
            <div className="h-1 bg-flame-500" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono tracking-widest text-flame-500">
                  SIGN IN
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-ink-500 hover:text-cream-50"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <h2 className="mt-3 text-2xl font-black text-cream-50 tracking-tight">
                What should we call you?
              </h2>
              <p className="mt-2 text-xs text-ink-400">
                No password. No email. Just your name for this session.
              </p>

              <form onSubmit={submit} className="mt-6">
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl bg-ink-950 border border-ink-800 text-sm text-cream-50 placeholder:text-ink-600 focus:outline-none focus:border-flame-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-cream-50 text-ink-950 font-black text-xs tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <LogIn size={14} />
                  CONTINUE
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}