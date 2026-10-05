# SALESTORM Architectural Decision Records (ADRs)

---

## ADR-001: Optimistic Concurrency Control with Row Versioning for Inventory Management

### Context
High-concurrency electronics flash sales can generate over 10,000 requests per minute targeting scarce inventory (e.g., 100 units). Pessimistic table locks (`SELECT FOR UPDATE`) cause severe thread pool starvation, database deadlocks, and latency degradation under heavy load.

### Decision
We adopt **Optimistic Concurrency Control (OCC)** using a monotonic `version` integer column on the `store_inventory` table. Inventory decrement statements execute conditionally:
```sql
UPDATE store_inventory 
SET available_quantity = available_quantity - :qty, version = version + 1
WHERE store_id = :storeId AND product_id = :productId AND available_quantity >= :qty AND version = :expectedVersion;
```

### Consequences
- **Positive**: High read performance, zero deadlocks, scale-out read availability.
- **Positive**: 0% overselling guarantee under high concurrency.
- **Negative**: Retries required on version conflicts under extreme peak contention.

---

## ADR-002: Modular Monolith Architecture with Microservices Extraction Strategy

### Context
Building a distributed microservices platform for an MVP increases deployment complexity, distributed tracing overhead, and operational friction during hackathon iteration.

### Decision
We implement a **Modular Monolith** using Next.js 14 App Router. Domain logic is strictly encapsulated inside decoupled services in `lib/services/` (`InventoryService`, `CheckoutService`, `LocationService`, `PaymentService`, `CancellationService`).

### Consequences
- **Positive**: Single deployable artifact, fast local development, simplified transaction boundaries.
- **Positive**: Clear service boundaries enable seamless future microservice extraction into independent serverless containers.

---

## ADR-003: Physical Store Location Indexing & Haversine Distance Proximity Queries

### Context
SALESTORM connects users to local physical stores. Products must be sorted based on real-time distance from the customer's coordinates.

### Decision
We use the **Haversine formula** for computing spherical distance between user coordinates `(lat1, lng1)` and store locations `(lat2, lng2)`. Store results are categorized into distance tiers (`< 5 km`, `5 - 15 km`, `> 15 km`) to determine express local delivery fees.

### Consequences
- **Positive**: Fast mathematical calculation executable in-memory or directly via PostgreSQL spatial indexes (`PostGIS` / `earthdistance`).
- **Negative**: Approximation does not account for real-time traffic or road topology (acceptable for MVP distance estimation).

---

## ADR-004: Multi-Store Order Splitting & Independent Checkout Orchestration

### Context
A customer cart can contain items from multiple distinct physical stores owned by different companies.

### Decision
During checkout processing, the system groups cart items by `store_id` and creates separate `orders` rows with unique IDs (e.g., `ORD-1001-A` and `ORD-1001-B`). Inventory reservations across stores execute in parallel via `Promise.allSettled()`.

### Consequences
- **Positive**: Clear store-specific order management, independent fulfillment tracking, and isolated cancellations per store.
- **Positive**: Store managers only see orders relevant to their physical branch.

---

## ADR-005: Idempotency Keys for Reservation, Payment, and Order Creation

### Context
Unstable mobile network connections can lead to duplicate HTTP POST requests for checkout or inventory reservations.

### Decision
All state-mutating API calls require an `X-Idempotency-Key` or body `idempotency_key`. The `InventoryService` checks for existing active reservations matching the key before creating new entries.

### Consequences
- **Positive**: Eliminates accidental double-charges and double-reservations.
- **Positive**: Retrying failed requests returns the existing successful payload safely.

---

## ADR-006: Automated Background Cancellation & Stock Expiry Scheduler

### Context
Unpaid reservations or uncollected Cash-on-Delivery (COD) orders hold store inventory hostage, depriving other customers of purchase opportunities.

### Decision
We establish a background cancellation job with two automated triggers:
1. **Unpaid Reservation Expiry**: 15-minute TTL. Unpaid reservations are auto-cancelled and stock restored.
2. **COD Store Pickup Expiry**: 24-hour TTL. Uncollected COD orders auto-cancel and inventory returns to live stock.

### Consequences
- **Positive**: Prevents artificial stock depletion and maximizes store inventory turnover.
- **Positive**: Fully automated without requiring manual intervention from store managers.
