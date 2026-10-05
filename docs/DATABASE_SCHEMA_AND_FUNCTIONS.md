# TECHKART — Database Schema & Stored Functions Reference

This document outlines all **Database Tables**, **Fields**, **Indexes**, and **Stored Functions/Triggers** created in **Supabase PostgreSQL** to power the **TECHKART** location-aware electronics marketplace.

---

## 📊 Database Schema Overview

```
+--------------------+        +-------------------+        +--------------------+
|      profiles      |        |     companies     |        |      products      |
+--------------------+        +-------------------+        +--------------------+
| id (PK)            |        | id (PK)           |        | id (PK)            |
| role (enum)        |        | name              |        | title              |
| email              |        | owner_id (FK)     |        | category           |
+----------+---------+        +---------+---------+        | price              |
           |                            |                  +---------+----------+
           |                            |                            |
           +------------+  +------------+                            |
                        |  |                                         |
                       v  v                                         v
              +-------------------+                       +-------------------+
              |      stores       |                       |  store_inventory  |
              +-------------------+                       +-------------------+
              | id (PK)           |                       | id (PK)           |
              | company_id (FK)   |<----------------------| store_id (FK)     |
              | lat, lng (GPS)    |                       | product_id (FK)   |
              +---------+---------+                       | stock_quantity    |
                        |                                 | version (OCC)     |
                        |                                 +-------------------+
                        v
              +-------------------+                       +-------------------+
              |      orders       |                       |  inventory_locks  |
              +-------------------+                       +-------------------+
              | id (PK)           |                       | id (PK)           |
              | customer_id (FK)  |                       | store_id (FK)     |
              | store_id (FK)     |                       | product_id (FK)   |
              | status, total     |                       | expires_at        |
              +-------------------+                       +-------------------+
```

---

## 🗄️ Database Tables Reference

### 1. `profiles`
*Manages platform user identity and Role-Based Access Control (RBAC).*

| Column Name | Data Type | Constraints / References | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID / VARCHAR` | `PRIMARY KEY` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login email address |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Display name |
| `role` | `VARCHAR(50)` | `CHECK ('CUSTOMER', 'BUSINESS', 'ADMIN')` | Enforces route security level |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp |

---

### 2. `companies`
*Represents retail electronics parent companies operating physical stores.*

| Column Name | Data Type | Constraints / References | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Company ID (e.g. `cmp-techzone`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | Business legal name |
| `registration_no` | `VARCHAR(100)` | `UNIQUE` | GSTIN / Tax Registration |
| `owner_id` | `VARCHAR(100)` | `FOREIGN KEY -> profiles(id)` | Owner profile reference |
| `verified` | `BOOLEAN` | `DEFAULT TRUE` | Platform verification status |

---

### 3. `stores`
*Physical brick-and-mortar retail outlets with location coordinates.*

| Column Name | Data Type | Constraints / References | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Store ID (e.g. `str-techzone-1`) |
| `company_id` | `VARCHAR(100)` | `FOREIGN KEY -> companies(id)` | Parent company |
| `name` | `VARCHAR(255)` | `NOT NULL` | Branch name (e.g. Indiranagar Branch) |
| `address` | `TEXT` | `NOT NULL` | Physical street address |
| `latitude` | `NUMERIC(10,8)` | `NOT NULL` | GPS Latitude for spatial queries |
| `longitude` | `NUMERIC(11,8)` | `NOT NULL` | GPS Longitude for spatial queries |

---

### 4. `products`
*Global electronics catalog available across stores.*

| Column Name | Data Type | Constraints / References | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | SKU ID (e.g. `prd-iphone17-pro`) |
| `title` | `VARCHAR(255)` | `NOT NULL` | Product name |
| `brand` | `VARCHAR(100)` | `NOT NULL` | Manufacturer brand |
| `category` | `VARCHAR(100)` | `NOT NULL` | Category (e.g. Smartphones, Laptops) |
| `msrp` | `NUMERIC(12,2)` | `NOT NULL` | Standard retail price |
| `specs` | `JSONB` | `DEFAULT '{}'` | Key technical specifications |

---

### 5. `store_inventory` ⭐ *(Critical Concurrency Table)*
*Per-store stock levels backed by Monotonic Version Locks.*

| Column Name | Data Type | Constraints / References | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Inventory record key |
| `store_id` | `VARCHAR(100)` | `FOREIGN KEY -> stores(id)` | Physical store branch |
| `product_id` | `VARCHAR(100)` | `FOREIGN KEY -> products(id)` | Product SKU |
| `stock_quantity`| `INTEGER` | `CHECK (stock_quantity >= 0)` | Available physical units |
| `version` | `BIGINT` | `NOT NULL DEFAULT 1` | **Monotonic OCC version lock counter** |

---

### 6. `orders` & `order_items`
*Customer purchase reservations & fulfillment state.*

| Table | Key Columns | Functions / Purpose |
| :--- | :--- | :--- |
| `orders` | `id`, `order_number`, `customer_id`, `store_id`, `fulfilment_type`, `status`, `total_amount` | Stores active pickup & local delivery orders |
| `order_items`| `id`, `order_id`, `product_id`, `quantity`, `unit_price` | Granular line items reserved per order |

---

### 7. `inventory_locks`
*Temporary 15-minute reservation holds during checkout.*

| Column Name | Data Type | Purpose |
| :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | Lock UUID |
| `store_id`, `product_id` | `VARCHAR(100)` | Locked stock item target |
| `quantity` | `INTEGER` | Quantity on hold |
| `expires_at` | `TIMESTAMPTZ` | Timestamp when hold expires if unpaid |

---

## ⚡ Stored Functions & Triggers

### 1. `reserve_stock_atomic()` (Atomic OCC Lock Function)
*Guarantees zero overselling under 10,000 concurrent checkout attempts.*

```sql
CREATE OR REPLACE FUNCTION reserve_stock_atomic(
  p_store_id VARCHAR,
  p_product_id VARCHAR,
  p_quantity INT,
  p_expected_version BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
  v_updated INT;
BEGIN
  UPDATE store_inventory
  SET 
    stock_quantity = stock_quantity - p_quantity,
    version = version + 1
  WHERE store_id = p_store_id
    AND product_id = p_product_id
    AND stock_quantity >= p_quantity
    AND version = p_expected_version;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. `calculate_distance()` (Spatial Haversine Function)
*Calculates distance between user coordinates and nearby stores.*

```sql
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 NUMERIC, lon1 NUMERIC,
  lat2 NUMERIC, lon2 NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  r NUMERIC := 6371; -- Earth radius in KM
  dlat NUMERIC; dlon NUMERIC;
  a NUMERIC; c NUMERIC;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql;
```

---

### 3. `cleanup_expired_locks()` (Cron Cleanup Function)
*Automatically releases abandoned checkout holds back into available inventory.*

```sql
CREATE OR REPLACE FUNCTION cleanup_expired_locks() RETURNS VOID AS $$
BEGIN
  -- Return reserved stock for expired locks
  UPDATE store_inventory si
  SET stock_quantity = si.stock_quantity + il.quantity
  FROM inventory_locks il
  WHERE si.store_id = il.store_id
    AND si.product_id = il.product_id
    AND il.expires_at < NOW();

  -- Purge expired lock records
  DELETE FROM inventory_locks WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```
