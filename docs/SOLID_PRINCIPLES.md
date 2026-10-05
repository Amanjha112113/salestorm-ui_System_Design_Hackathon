# TECHKART — SOLID Software Design Principles Architecture Mapping

This document highlights how the **5 SOLID Principles of Object-Oriented Software Design** are strictly applied across the **TECHKART** full-stack modular monolith platform.

---

## 🏛️ Executive Architectural Summary

| SOLID Principle | Core Concept | TECHKART Implementation Files |
| :--- | :--- | :--- |
| **S** — Single Responsibility | Each service has one dedicated reason to change | [`lib/services/auth.ts`](file:///d:/SD-Hahathon/lib/services/auth.ts), [`lib/services/inventory.ts`](file:///d:/SD-Hahathon/lib/services/inventory.ts), [`lib/services/location.ts`](file:///d:/SD-Hahathon/lib/services/location.ts) |
| **O** — Open / Closed | Open for extension, closed for modification | [`lib/services/fulfilment.ts`](file:///d:/SD-Hahathon/lib/services/fulfilment.ts), [`lib/services/events.ts`](file:///d:/SD-Hahathon/lib/services/events.ts) |
| **L** — Liskov Substitution | Subtypes must be substitutable for base contracts | [`lib/services/cache.ts`](file:///d:/SD-Hahathon/lib/services/cache.ts), [`lib/db/store.ts`](file:///d:/SD-Hahathon/lib/db/store.ts) |
| **I** — Interface Segregation | Granular interfaces over monolithic interfaces | [`lib/types.ts`](file:///d:/SD-Hahathon/lib/types.ts), [`lib/services/inventory.ts`](file:///d:/SD-Hahathon/lib/services/inventory.ts) |
| **D** — Dependency Inversion | High-level modules depend on abstractions | [`lib/services/checkout.ts`](file:///d:/SD-Hahathon/lib/services/checkout.ts), [`lib/services/integrations.ts`](file:///d:/SD-Hahathon/lib/services/integrations.ts) |

---

## 1. 🎯 Single Responsibility Principle (SRP)
> *"A class or module should have one, and only one, reason to change."*

### How it is applied in TECHKART:
Rather than building a monolithic database file or monolithic API controller, domain responsibilities are decoupled into single-purpose singleton services in `lib/services/`:

1. **`AuthService`** ([`lib/services/auth.ts`](file:///d:/SD-Hahathon/lib/services/auth.ts)):
   - **Single Responsibility**: Handles user session verification, JWT validation, and Role-Based Access Control (`CUSTOMER`, `BUSINESS`, `ADMIN`).
   - Does *not* handle stock calculations, checkout logic, or payments.

2. **`InventoryService`** ([`lib/services/inventory.ts`](file:///d:/SD-Hahathon/lib/services/inventory.ts)):
   - **Single Responsibility**: Handles atomic stock reservation locks, version monotonicity (`version += 1`), and inventory release.
   - Does *not* handle user authentication or order fulfilment.

3. **`LocationService`** ([`lib/services/location.ts`](file:///d:/SD-Hahathon/lib/services/location.ts)):
   - **Single Responsibility**: Handles spatial distance calculations (Haversine formula), coordinate sorting, and delivery charge tiering based on distance.

---

## 2. 🔌 Open / Closed Principle (OCP)
> *"Software entities should be open for extension, but closed for modification."*

### How it is applied in TECHKART:

1. **Strategy Pattern for Fulfilment Charges** ([`lib/services/fulfilment.ts`](file:///d:/SD-Hahathon/lib/services/fulfilment.ts)):
   - The `FulfilmentService` uses a extensible strategy calculation method for `PICKUP`, `LOCAL_DELIVERY`, and `SHIPPING`. Adding a new delivery method (e.g. `EXPRESS_HYPERLOCAL`) requires adding a strategy handler without modifying existing pickup logic.

2. **Asynchronous Event Bus (`MessageQueueBus`)** ([`lib/services/events.ts`](file:///d:/SD-Hahathon/lib/services/events.ts)):
   - `MessageQueueBus` provides a pub-sub subscription system (`subscribe`, `publish`).
   - New event listeners (e.g., SMS alerts, analytics trackers) can be subscribed without modifying the core domain services publishing events like `ORDER_CREATED` or `PAYMENT_SUCCESS`.

---

## 3. 🔄 Liskov Substitution Principle (LSP)
> *"Objects of a superclass should be replaceable with objects of its subclasses without affecting program correctness."*

### How it is applied in TECHKART:

1. **Pluggable Data Storage Layer** ([`lib/db/store.ts`](file:///d:/SD-Hahathon/lib/db/store.ts) vs [`lib/db/supabase-client.ts`](file:///d:/SD-Hahathon/lib/db/supabase-client.ts)):
   - Both the in-memory state engine `DatabaseStore` and the live Supabase PostgreSQL client adhere to identical data contracts (`getProducts`, `getOrders`, `reserveStockAtomic`).
   - High-level application services interact with `db` abstract methods seamlessly whether running in local mock mode or connected to live Supabase PostgreSQL.

2. **Cache Adapter Abstraction** ([`lib/services/cache.ts`](file:///d:/SD-Hahathon/lib/services/cache.ts)):
   - `RedisCacheAdapter` implements uniform `get<T>()`, `set()`, and `checkRateLimit()` signatures, allowing in-memory LRU cache to be substituted with a distributed Redis cluster without breaking caller code.

---

## 4. ✂️ Interface Segregation Principle (ISP)
> *"No client should be forced to depend on methods it does not use."*

### How it is applied in TECHKART:

1. **Granular Domain Data Interfaces** ([`lib/types.ts`](file:///d:/SD-Hahathon/lib/types.ts)):
   - Interfaces are partitioned into distinct domain models (`Profile`, `Company`, `Store`, `Product`, `StoreInventory`, `Order`, `Message`, `Notification`) rather than one bloated `AppObject`.

2. **Focused Parameter Objects** ([`lib/services/inventory.ts`](file:///d:/SD-Hahathon/lib/services/inventory.ts)):
   - `ReserveRequest` interface specifies only the exact fields necessary for locking stock (`storeId`, `productId`, `quantity`, `customerId`, `idempotencyKey`). Clients calling reservation are not forced to supply full customer profile or store address payloads.

---

## 5. 🏗️ Dependency Inversion Principle (DIP)
> *"High-level modules should not depend on low-level modules. Both should depend on abstractions."*

### How it is applied in TECHKART:

1. **Checkout Service Orchestration** ([`lib/services/checkout.ts`](file:///d:/SD-Hahathon/lib/services/checkout.ts)):
   - `CheckoutService` orchestrates checkout workflows by depending on abstract service contracts (`InventoryService`, `OrderService`, `PaymentService`) rather than executing low-level SQL queries directly inside the route handler.

2. **External Gateway Adapters** ([`lib/services/integrations.ts`](file:///d:/SD-Hahathon/lib/services/integrations.ts)):
   - Third-party external services (Maps/Geocoding, Courier/Shipping Partner, Email/SMS Gateway) are wrapped behind `ExternalIntegrationsAdapter`.
   - The application code calls `externalIntegrations.geocodeAddress()` or `createShipment()`, decoupling the platform logic from specific provider SDKs (e.g. Twilio, Google Maps, BlueDart).
