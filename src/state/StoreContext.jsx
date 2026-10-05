import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "./reducer.js";
import { AuthProvider } from "./AuthContext.jsx";
import { WishlistProvider } from "./WishlistContext.jsx";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: "EXPIRE_RESERVATIONS" }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <AuthProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </AuthProvider>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}