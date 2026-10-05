# SALESTORM — High-Concurrency Location-Aware Electronics Marketplace
## System Design & Technical Architecture Document

---

## 1. Executive Summary & Architectural Overview

SALESTORM is an enterprise-grade, high-concurrency location-aware electronics marketplace connecting physical retail stores (businesses) with nearby and distant customers. Unlike traditional second-hand consumer-to-consumer portals, SALESTORM empowers multi-branch electronics companies to manage branch-specific inventory, enable express local pickup, calculate Haversine distance-based delivery tiers, and execute high-concurrency flash sales with a **0% overselling guarantee**.

The platform is designed as a **Modular Monolith** using **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**. This architecture ensures high operational agility for MVP deployment while establishing clear domain boundaries for future microservices extraction.

---

## 2. High-Concurrency Inventory Engine & OCC Design

### 2.1 The 10,000 Concurrent User Problem
During high-demand electronics launches (e.g., PS5 Pro, iPhone release), thousands of simultaneous checkout requests compete for limited store inventory (e.g., 100 units). Standard database reads and updates without strict concurrency controls suffer from lost updates and negative stock anomalies (overselling).

### 2.2 Optimistic Concurrency Control (OCC) Solution
SALESTORM implements atomic optimistic locking at the PostgreSQL row level via a monotonic `version` integer column.

#### PostgreSQL Conditional Update Procedure:
```sql
UPDATE store_inventory
SET 
  available_quantity = available_quantity - p_quantity,
  reserved_quantity = reserved_quantity + p_quantity,
  version = version + 1,
  updated_at = NOW()
WHERE store_id = p_store_id
  AND product_id = p_productId
  AND available_quantity >= p_quantity;
```

#### Why OCC over Heavy Row Locks:
1. **High Read Throughput**: Readers (customers browsing stock) never block writers or suffer lock contention.
2. **Zero Deadlocks**: Transactions are atomic single-statement updates executed in PostgreSQL's query engine.
3. **Idempotency Guarantee**: Every reservation requires a unique `idempotency_key`. Re-requests within the 15-minute reservation TTL return the original reservation record without re-decrementing stock.

---

## 3. Microservices Migration & Decomposition Strategy

While the MVP is built as a unified codebase for optimal developer velocity, all business logic is isolated into clean domain services inside `lib/services/`.

```
                    ┌────────────────────────────────────────┐
                    │       API Gateway / CDN (Cloudflare)   │
                    └───────────────────┬────────────────────┘
                                        │
                    ┌───────────────────┴────────────────────┐
                    │     SALESTORM API Router (Next.js)      │
                    └─┬──────┬──────┬──────┬──────┬──────┬───┘
                      │      │      │      │      │      │
     ┌────────────────┘      │      │      │      │      └────────────────┐
     ▼                       ▼      ▼      ▼      ▼                       ▼
┌──────────────┐   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────────┐
│ Auth & User  │   │ Catalog  │ │Inventory │ │ Order &  │ │ Location &   │ │ Chat & Msg  │
│ Service      │   │ Service  │ │ Service  │ │ Checkout │ │ Distance Svc │ │ Service     │
└──────────────┘   └──────────┘ └──────────┘ └──────────┘ └──────────────┘ └─────────────┘
```

### Decomposed Service Specifications:
1. **Auth & Identity Service**: Manages Customer, Business Retailer, and Admin authentication, JWT claims, and RLS policies.
2. **Catalog Service**: Product specifications, SKU hierarchy, categories, and brand metadata.
3. **Multi-Store Inventory Service**: Branch stock state, OCC reservations, versioning, and auto-release timers.
4. **Order & Checkout Service**: Multi-store cart splitting, order state machine (`PENDING` → `RESERVED` → `READY_FOR_PICKUP` → `COMPLETED`).
5. **Payment Service**: Mock payment gateway with webhooks, idempotency key verification, and refund orchestration.
6. **Location & Proximity Service**: Haversine distance computations, store geolocation indexing, and delivery fee tier assignment.
7. **Notification Service**: Real-time push notifications, store pickup code generation, and SMS/WhatsApp integration.
8. **Chat & Communication Service**: Direct customer-to-store messaging linked to specific products and orders.

---

## 4. Multi-Store Cart Splitting & Checkout Pipeline

When a customer adds products from multiple stores into a single cart (e.g., iPhone from *TechZone Tirunelveli* and Headphones from *Digital World Palayamkottai*):
1. **Cart Grouping**: The checkout engine partitions cart items by `store_id`.
2. **Atomic Parallel Reservations**: Reservations execute concurrently across both stores using `Promise.allSettled()`.
3. **Order Partitioning**: If all reservations succeed, separate orders (`ORD-1001-A`, `ORD-1001-B`) are created, each linked to their respective store branch for fulfillment.
4. **Transaction Rollback**: If Store B fails due to stock depletion, Store A's reservation is automatically rolled back, ensuring all-or-nothing checkout integrity.

---

## 5. Automated Cancellation Engine & Pickup Expiry Scheduler

To prevent inventory lockup caused by abandoned reservations or uncollected Cash-on-Delivery (COD) orders:
- **Unpaid Reservation Expiry**: 15 minutes TTL. Unpaid reservations are released automatically by background cron/scheduler back into `available_quantity`.
- **COD Pickup Expiry**: 24 hours TTL. Uncollected COD orders transition to `CANCELLED` and stock is restored to store inventory.

---

## 6. Resilience, Rate Limiting & Failure Modes

1. **Idempotent Requests**: All critical mutation endpoints require `X-Idempotency-Key` or body key to prevent duplicate processing during network retries.
2. **Circuit Breaking**: Database pool connections degrade gracefully under load spikes by rejecting excess requests with `429 Too Many Requests` rather than crashing DB connections.
3. **Graceful Fallbacks**: If GPS location services fail, the system falls back to default store hubs (Tirunelveli/Madurai) without breaking user experience.
