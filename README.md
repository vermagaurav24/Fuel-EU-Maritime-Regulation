# Fuel EU Maritime

A TypeScript full-stack repository for modelling and testing maritime fuel & emissions compliance (frontend + backend). This README explains the project purpose, structure, how to run it, common pitfalls you may encounter (TypeScript config-related), and where to look for the important code pieces.

---

## Quick summary
This project models route emissions, compliance balances, banking of surplus GCO2e, pooling, and related domain logic. It includes:
- Frontend (UI / DTOs / domain models)
- Backend (use-cases, repositories, unit tests)
- Domain-first design: entities, DTOs, ports (interfaces), use-cases

---

## Table of contents
- Getting started
- Run & test
- Project structure (high level)
- Key files (what to inspect first)
- Common issues & fixes (TypeScript settings)
- Contributing & code style
- Useful commands

---

## Getting started (Windows)
Prerequisites:
- Node.js 18+ (LTS)
- npm (or pnpm/yarn)
- VS Code recommended

Install and run:
1. Open a PowerShell / cmd in repository root:
   ```
   cd e:\fuel-eu-maritime
   ```
2. Backend
   ```
   cd backend
   npm install
   npm run dev   # or `npm start` — check backend/package.json scripts
   ```
3. Frontend
   ```
   cd ..\frontend
   npm install
   npm run dev   # or `npm start` — check frontend/package.json scripts
   ```

Run tests (unit tests use Jest):
```
cd e:\fuel-eu-maritime\backend
npm test      # or `npx jest` / `npm run test` depending on package.json
```
Tip: In VS Code install the Jest extension (or run tests from terminal).

---

## Project structure (important folders)
- frontend/
  - src/core/domain/entities — domain entities (Route, BankEntry, ComplianceBalance, Pool)
  - src/core/application/dto — DTO definitions (RouteDTO, ComparisonDTO, BankingDTO, ...)
  - src/core/ports/outbound — outbound ports interfaces (IBankingRepository, ...)
- backend/
  - src/use-cases — business logic implementations (e.g., BankSurplus)
  - tests/unit — unit tests (Jest)
- docs/ or scripts/ — supporting documentation / tooling (if present)

---

## Key files to review
- frontend/src/core/domain/entities/Route.ts — Route entity and domain logic
- frontend/src/core/domain/entities/BankEntry.ts — Banked surplus entity
- frontend/src/core/domain/entities/ComplianceBalance.ts — Compliance balance logic
- frontend/src/core/domain/entities/Pool.ts — Pool entity & validation
- frontend/src/core/application/dto/RouteDTO.ts — route DTOs
- frontend/src/core/application/dto/ComparisonDTO.ts — comparison DTOs (imports RouteDTO)
- frontend/src/core/ports/outbound/IBankingRepository.ts — banking outbound interface
- backend/tests/unit/use-cases/BankSurplus.test.ts — sample unit tests for banking use-case

---


Folder Structure:-

fueleu-maritime/
│
├── backend/ # Backend application
│ ├── src/
│ │ ├── core/ # Domain layer (business logic)
│ │ │ ├── domain/
│ │ │ │ ├── entities/ # Domain entities
│ │ │ │ │ ├── Route.ts
│ │ │ │ │ ├── ShipCompliance.ts
│ │ │ │ │ ├── BankEntry.ts
│ │ │ │ │ └── Pool.ts
│ │ │ │ └── value-objects/
│ │ │ │ ├── ComplianceBalance.ts
│ │ │ │ └── GhgIntensity.ts
│ │ │ ├── ports/ # Interfaces (contracts)
│ │ │ │ ├── inbound/ # Use case interfaces
│ │ │ │ └── outbound/ # Repository interfaces
│ │ │ └── use-cases/ # Business logic orchestration
│ │ │ ├── routes/
│ │ │ ├── compliance/
│ │ │ ├── banking/
│ │ │ └── pooling/
│ │ │
│ │ ├── adapters/ # Infrastructure layer
│ │ │ ├── inbound/
│ │ │ │ └── http/ # HTTP controllers
│ │ │ └── outbound/
│ │ │ └── persistence/ # Database repositories
│ │ │
│ │ ├── config/ # Configuration
│ │ └── app.ts # Application entry point
│ │
│ ├── prisma/
│ │ ├── schema.prisma # Database schema
│ │ └── seed.ts # Sample data
│ │
│ ├── tests/ # Test suites
│ │ ├── unit/
│ │ └── integration/
│ │
│ └── package.json
│
├── frontend/ # Frontend application
│ ├── src/
│ │ ├── core/ # Domain layer (no React deps)
│ │ │ ├── domain/
│ │ │ │ └── entities/
│ │ │ ├── application/
│ │ │ │ ├── use-cases/
│ │ │ │ └── dto/
│ │ │ └── ports/
│ │ │ ├── inbound/
│ │ │ └── outbound/
│ │ │
│ │ ├── adapters/
│ │ │ ├── ui/ # React components
│ │ │ │ ├── components/
│ │ │ │ │ ├── layout/
│ │ │ │ │ ├── common/
│ │ │ │ │ ├── routes/
│ │ │ │ │ ├── compare/
│ │ │ │ │ ├── banking/
│ │ │ │ │ └── pooling/
│ │ │ │ ├── hooks/
│ │ │ │ └── pages/
│ │ │ └── infrastructure/ # API clients
│ │ │ ├── api/
│ │ │ └── repositories/
│ │ │
│ │ ├── shared/ # Utilities & constants
│ │ ├── App.tsx
│ │ └── main.tsx
│ │
│ └── package.json
│
├── AGENT_WORKFLOW.md # AI agent usage documentation
├── REFLECTION.md # Development reflection
└── README.md # This file