# 09 - Microservices Migration & Service Decomposition Diagram

```mermaid
graph LR
    subgraph Modular Monolith (Phase 1 MVP)
        Monolith[Next.js Unified Monolith Container]
    end

    subgraph Extracted Microservices (Phase 2 Target)
        AuthSvc[Auth & User Service<br/>Port 4001]
        CatSvc[Catalog Service<br/>Port 4002]
        InvSvc[Multi-Store Inventory OCC Service<br/>Port 4003]
        OrdSvc[Order & Checkout Orchestrator<br/>Port 4004]
        PaySvc[Payment Gateway Service<br/>Port 4005]
        LocSvc[Location & Distance Service<br/>Port 4006]
        NotifSvc[Notification Service<br/>Port 4007]
        ChatSvc[Chat Service<br/>Port 4008]
    end

    Monolith -.->|Domain Event Bus / Kafka| Extracted Microservices
```
