# ⚡ Salestorm — Hyper-Local Electronics Marketplace

> **Scalable. Location-Aware. Zero Overselling.**  
> *Empowering physical retail with high-concurrency digital reservations and express local discovery.*

---

## 🌟 Executive Summary

**Salestorm** bridges the gap between digital convenience and physical retail. By instantly connecting buyers to nearby multi-branch electronics stores, it transforms how local inventory is discovered and reserved. Powered by an advanced **Optimistic Concurrency Control (OCC) engine**, Salestorm guarantees **0% overselling**—even when 10,000 concurrent users compete for 100 high-demand items. With built-in Haversine-based delivery routing and real-time branch-level stock management, Salestorm delivers a seamless, highly scalable omnichannel experience.

---

## 🚀 Key Features & Highlights

- 🏪 **Store-First & Product-First Shopping**: Browse products near your GPS location or explore physical store branches directly.
- ⚡ **10,000 User High-Concurrency OCC Engine**: PostgreSQL atomic conditional updates using monotonic `version` locking (`0% Overselling Guarantee`).
- 🛒 **Multi-Store Cart Splitting**: Group cart items by physical store; automatically split orders per branch with parallel atomic reservations.
- 📍 **Haversine Proximity Sorting**: Geolocation distance calculation sorting stores and assigning express local delivery fee tiers (< 5km, 5-15km, > 15km).
- ⌛ **Automated Cancellation Scheduler**: 15-minute unpaid reservation expiry & 24-hour COD pickup timeout engine.
- 💬 **Real-Time Customer ↔ Business Chat**: Direct store communication linked to specific products and orders.
- 🛡️ **Idempotent Transactions**: Unique idempotency keys for reservation, payment, and checkout requests.
- 📊 **Interactive Benchmark Panel**: Test 10,000 concurrent requests live at `/demo/concurrency`.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router, Server Actions, API Routes)
- **Language**: TypeScript (Strict type safety across domain logic)
- **Styling**: Tailwind CSS, Vanilla CSS Design System (`app/globals.css`)
- **Database**: Supabase (PostgreSQL with RLS policies, indexes, procedures)
- **Icons**: Lucide React
- **Architecture**: Modular Monolith with clean service boundaries for Microservices extraction.

---

## ⚙️ Configuration Options

SALESTORM supports several configurable options to customize its behavior:
- **Mock Payments**: Toggle between mock gateways and real integrations via `NEXT_PUBLIC_PAYMENT_MODE`.
- **Cancellation Timeout**: Modify the unpaid reservation timeout (default 15 minutes) in the environment settings.
- **Delivery Radii**: Adjust the distance tiers (default: 5km, 15km) for local delivery fee calculations.

---

## ☁️ Deployment Options

SALESTORM can be deployed using various strategies:
- **Vercel**: One-click deployment for the Next.js frontend and serverless API routes.
- **Docker**: Containerized deployment for the complete stack, enabling orchestration via Kubernetes or Docker Swarm.
- **Supabase Cloud**: Hosted database solution, handling PostgreSQL, RLS, and Edge Functions.

---

## ⚡ Quick Start & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 High-Concurrency Benchmark Simulation

To run the 10,000 concurrent user purchase simulation against 100 inventory units:

1. Navigate to **[http://localhost:3000/demo/concurrency](http://localhost:3000/demo/concurrency)** in the web UI.
2. Set **Total Concurrent Requests**: `10000` and **Available Stock**: `100`.
3. Click **[ LAUNCH 10,000 USER BENCHMARK SIMULATION ]**.
4. Observe the results:
   - Total Requests: `10,000`
   - Successful Reservations: `100` (🟢)
   - Failed Requests: `9,900` (🔴)
   - Overselling Count: `0` (🛡️ **0% Overselling Guaranteed**)

---

## 📐 Documentation & System Design Architecture

Comprehensive design records are available in `/docs`:
- [`/docs/architecture.md`](./docs/architecture.md): Microservices strategy, Resilience, and Circuit Breaking.
- [`/docs/ADR.md`](./docs/ADR.md): Architectural Decision Records (ADR-001 through ADR-006).
- [`/docs/diagrams/`](./docs/diagrams/): 12 renderable Mermaid diagrams covering ERD, Checkout Sequence, OCC Lock Flow, and Cancellation Engine.

---

## 📜 License & Acknowledgements

Built for Hackathon Demonstration. Powered by Next.js, Supabase PostgreSQL, and Tailwind CSS.
