import { v4 as uuid } from "uuid";
import { PRODUCTS } from "../data/products.js";

export const RESERVATION_TTL_MS = 10 * 60 * 1000;

const seedInventory = () => {
  const inv = {};
  PRODUCTS.forEach((p) => {
    inv[p.id] = { available: p.stock, reserved: 0, sold: 0, total: p.stock };
  });
  return inv;
};

export const initialState = {
  inventory: seedInventory(),
  cart: [], // { lineId, productId, size, qty }
  reservations: [],
  payments: [],
  orders: [],
  events: [],
  idempotency: {},
  stats: {
    totalRequests: 0,
    admitted: 0,
    rejected: 0,
    outOfStock: 0,
    duplicatesBlocked: 0,
    paymentSuccess: 0,
    paymentFailed: 0,
  },
  customerId: uuid(),
  mode: "shop",
};

export function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_MODE":
      return { ...state, mode: state.mode === "shop" ? "system" : "shop" };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    // ─── CART ───
    case "CART_ADD": {
      const { productId, size = null, qty = 1 } = action.payload;
      const existing = state.cart.find(
        (l) => l.productId === productId && l.size === size
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l.lineId === existing.lineId ? { ...l, qty: l.qty + qty } : l
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { lineId: uuid(), productId, size, qty },
        ],
      };
    }

    case "CART_REMOVE":
      return {
        ...state,
        cart: state.cart.filter((l) => l.lineId !== action.payload.lineId),
      };

    case "CART_UPDATE_QTY": {
      const { lineId, qty } = action.payload;
      if (qty <= 0) {
        return { ...state, cart: state.cart.filter((l) => l.lineId !== lineId) };
      }
      return {
        ...state,
        cart: state.cart.map((l) => (l.lineId === lineId ? { ...l, qty } : l)),
      };
    }

    case "CART_CLEAR":
      return { ...state, cart: [] };

    // ─── RESERVE ───
    case "RESERVE": {
      const { productId, idempotencyKey, qty = 1, reservationId: rid } = action.payload;

      if (state.idempotency[idempotencyKey]) {
        return {
          ...state,
          stats: { ...state.stats, duplicatesBlocked: state.stats.duplicatesBlocked + 1 },
          events: [
            {
              id: uuid(),
              type: "DUPLICATE_BLOCKED",
              message: `Duplicate blocked (${idempotencyKey.slice(0, 8)}…)`,
              level: "warn",
              timestamp: Date.now(),
            },
            ...state.events,
          ].slice(0, 80),
        };
      }

      const inv = state.inventory[productId];
      const stats = { ...state.stats, totalRequests: state.stats.totalRequests + 1 };

      if (!inv || inv.available < qty) {
        return {
          ...state,
          stats: { ...stats, outOfStock: stats.outOfStock + 1, rejected: stats.rejected + 1 },
          events: [
            {
              id: uuid(),
              type: "OUT_OF_STOCK",
              message: `Rejected ${productId} — no stock`,
              level: "error",
              timestamp: Date.now(),
            },
            ...state.events,
          ].slice(0, 80),
        };
      }

      const reservationId = rid || uuid();
      const expiresAt = Date.now() + RESERVATION_TTL_MS;

      return {
        ...state,
        inventory: {
          ...state.inventory,
          [productId]: {
            ...inv,
            available: inv.available - qty,
            reserved: inv.reserved + qty,
          },
        },
        reservations: [
          {
            id: reservationId,
            productId,
            customerId: state.customerId,
            qty,
            status: "RESERVED",
            expiresAt,
            createdAt: Date.now(),
            idempotencyKey,
          },
          ...state.reservations,
        ],
        idempotency: {
          ...state.idempotency,
          [idempotencyKey]: { reservationId, status: "RESERVED" },
        },
        stats: { ...stats, admitted: stats.admitted + 1 },
        events: [
          {
            id: uuid(),
            type: "RESERVATION_CREATED",
            message: `Reserved ${qty} × ${productId}`,
            level: "success",
            timestamp: Date.now(),
          },
          ...state.events,
        ].slice(0, 80),
      };
    }

    case "PAYMENT_RESULT": {
      const { reservationId, success, paymentId, productId: pid, qty } = action.payload;
      const reservation =
        state.reservations.find((r) => r.id === reservationId) ||
        (pid && { productId: pid, qty: qty || 1 });
      if (!reservation) return state;
      const inv = state.inventory[reservation.productId];

      if (success) {
        const payment = {
          id: paymentId,
          reservationId,
          productId: reservation.productId,
          status: "PAID",
          providerTxnId: `txn_${uuid().slice(0, 12)}`,
          createdAt: Date.now(),
        };
        const order = {
          id: uuid(),
          paymentId,
          reservationId,
          productId: reservation.productId,
          customerId: reservation.customerId,
          qty: reservation.qty,
          status: "CONFIRMED",
          createdAt: Date.now(),
        };
        return {
          ...state,
          inventory: {
            ...state.inventory,
            [reservation.productId]: {
              ...inv,
              reserved: inv.reserved - reservation.qty,
              sold: inv.sold + reservation.qty,
            },
          },
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, status: "CONFIRMED" } : r
          ),
          payments: [payment, ...state.payments],
          orders: [order, ...state.orders],
          stats: { ...state.stats, paymentSuccess: state.stats.paymentSuccess + 1 },
          events: [
            {
              id: uuid(),
              type: "PAYMENT_SUCCEEDED",
              message: `Paid · order ${order.id.slice(0, 8)}`,
              level: "success",
              timestamp: Date.now(),
            },
            ...state.events,
          ].slice(0, 80),
        };
      }

      return {
        ...state,
        inventory: {
          ...state.inventory,
          [reservation.productId]: {
            ...inv,
            reserved: inv.reserved - reservation.qty,
            available: inv.available + reservation.qty,
          },
        },
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "RELEASED" } : r
        ),
        stats: { ...state.stats, paymentFailed: state.stats.paymentFailed + 1 },
        events: [
          {
            id: uuid(),
            type: "PAYMENT_FAILED",
            message: `Payment failed — stock released`,
            level: "error",
            timestamp: Date.now(),
          },
          ...state.events,
        ].slice(0, 80),
      };
    }

    case "EXPIRE_RESERVATIONS": {
      const now = Date.now();
      const expired = state.reservations.filter(
        (r) => r.status === "RESERVED" && r.expiresAt <= now
      );
      if (expired.length === 0) return state;

      const inventory = { ...state.inventory };
      const events = [];

      expired.forEach((r) => {
        const inv = inventory[r.productId];
        if (!inv) return;
        inventory[r.productId] = {
          ...inv,
          reserved: inv.reserved - r.qty,
          available: inv.available + r.qty,
        };
        events.push({
          id: uuid(),
          type: "RESERVATION_EXPIRED",
          message: `Reservation expired — stock released`,
          level: "warn",
          timestamp: now,
        });
      });

      return {
        ...state,
        inventory,
        reservations: state.reservations.map((r) =>
          expired.find((e) => e.id === r.id) ? { ...r, status: "RELEASED" } : r
        ),
        events: [...events, ...state.events].slice(0, 80),
      };
    }

    case "RESET":
      return {
        ...initialState,
        customerId: uuid(),
        inventory: seedInventory(),
        mode: "shop",
      };

    default:
      return state;
  }
}