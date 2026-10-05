import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import OrderTracker from "./pages/OrderTracker.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Support from "./pages/Support.jsx";
import SystemOverlay from "./pages/SystemOverlay.jsx";
import SocialProofToast from "./components/SocialProofToast.jsx";
import { useStore } from "./state/StoreContext.jsx";

export default function App() {
  const { state } = useStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-ink-950 text-cream-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {state.mode === "system" ? (
            <motion.div
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SystemOverlay />
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/order/:id" element={<OrderTracker />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={<Landing />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {state.mode === "shop" && <Footer />}
      {state.mode === "shop" && <SocialProofToast />}
    </div>
  );
}