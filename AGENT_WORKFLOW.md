#  Agent Workflow

This document explains the overall workflow and architecture used in the **Fuel EU Maritime System** project.

---

## 1. System Overview

The project consists of two main components:
- **Backend (Node.js + TypeScript + Express)**  
  Handles business logic, compliance rules, and data persistence (MongoDB).
- **Frontend (React + TypeScript + Vite)**  
  Provides the user interface for compliance management, ship data entry, and visualization.

---

## 2. Workflow Description

### 2.1. Data Flow
1. **User Interaction (Frontend)**  
   - Users interact via UI components (Routes, Compare, Banking, Pooling modules).  
   - Frontend calls backend APIs through centralized API service.

2. **Request Handling (Backend)**  
   - The backend receives requests through REST endpoints.  
   - Controllers pass data to use-cases in the **core/application** layer.

3. **Business Logic (Use Cases)**  
   - Each use case (e.g., `BankSurplus`, `SetBaseline`, `AddRoute`) contains domain-specific logic.
   - Use cases interact only with interfaces (ports), ensuring clean architecture.

4. **Data Persistence (Repositories)**  
   - Repositories in **adapters/infra** implement persistence (MongoDB, Redis, etc.).
   - Compliance and Banking repositories store operational and transactional data.

5. **Response**  
   - Processed data is returned to the frontend for visualization.

---

## 3. Domain-Driven Design Layers

core/
├── domain/ # Entities and models (pure logic)
├── application/ # Use cases and services
├── ports/ # Interfaces (inbound/outbound)
└── adapters/ # Implementations (infra, UI)


---

## 4. Example Workflow (BankSurplus)

1. `POST /api/banking/surplus` → triggered by frontend.  
2. Controller validates input and calls `BankSurplus.execute()`.  
3. Use case verifies compliance balance and banks the surplus.  
4. Repository updates compliance record and stores surplus transaction.  
5. Success response returned to frontend.

---

## 5. Automation & Testing

- **Unit Tests**: Jest for backend use cases.  
- **Integration Tests**: Mock repositories simulate I/O.  
- **Type Safety**: Full TypeScript coverage across layers.

---

## 6. Future Enhancements

- Add background job queue for compliance recalculations.  
- Introduce caching for performance optimization.  
- Add role-based authentication using Clerk or Auth0.

---

## Summary

This workflow ensures:
- **Separation of concerns**
- **High testability**
- **Scalability across modules**
- **Strict type safety**
