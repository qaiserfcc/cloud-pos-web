````instructions
# Cloud POS Web — AI Agent Instructions (React frontend)

## Objective
Generate a complete, production-ready React + TypeScript frontend (repository: `cloud-pos-web`) that integrates with the Cloud POS backend (`https://github.com/qaiserfcc/cloud-pos-api`) and matches the design in `https://github.com/qaiserfcc/cloud-pos`.

Implement full feature parity with the backend: multi-tenant tenant→store hierarchy, dynamic RBAC, POS operations, offline sync with desktop SQLite, audit logs, reporting, and dynamic dashboards.

## Functional & Design Requirements (from cloud-pos-api)

- Multi-tenant architecture: hierarchical Tenant → Store; Superadmin has global access, tenant/store users are scoped.
- RBAC: Users, Roles, Permissions are dynamic; Superadmin bypasses restrictions.
- POS operations: Sales, Payments, Returns; Product catalog and inventory management; sync with offline/desktop SQLite.
- Audit logging: All create/update/delete actions recorded in `audit_logs`; changes staged in `change_queue` for sync.
- Sync & offline: `/sync/download` and `/sync/upload` endpoints; cloud-authoritative or timestamp-based conflict resolution.
- Reports & Widgets: Sales, Inventory, CRM, Loyalty reports; widgets displayed dynamically based on permissions.
- API: RESTful `/api/v1` endpoints, JWT auth, consistent validation, error handling, and security policies.
- UI: Modern responsive dashboard, consistent theme, reusable components, role-based dynamic rendering.

## AI Agent – Task Instructions (high-level)

Task: Autonomously scaffold and implement the React frontend to satisfy the requirements above. Follow the phased plan below and run tests/lints before commits.

### Phase 1 — Project setup
- Create project: `npx create-react-app cloud-pos-web --template typescript` or equivalent scaffold.
- Install runtime deps: `react-router-dom axios @reduxjs/toolkit react-redux @tanstack/react-query react-hook-form yup dayjs recharts`.
- Install dev tools: `eslint prettier jest @testing-library/react msw storybook typedoc`.
- Create folder structure:
  ```
  src/
  ├── components/
  ├── pages/
  ├── layouts/
  ├── services/
  ├── hooks/
  ├── store/
  ├── utils/
  └── App.tsx
  ```

### Phase 2 — API client & services
- Read backend OpenAPI/Swagger (from `cloud-pos-api`) and generate typed client (e.g., `openapi-typescript` → `src/api-types/`).
- Create `src/services/*` modules: `auth`, `tenants`, `stores`, `users`, `roles`, `pos`, `inventory`, `crm`, `reports`, `auditLogs`, `sync`.
- Provide a central HTTP client (Axios) with interceptors to:
  - attach `Authorization: Bearer <JWT>`
  - attach `X-Tenant-ID` and `X-Store-ID` headers
  - handle 401 → refresh token flow
  - uniform error mapping to UI-friendly errors

### Phase 3 — Auth & RBAC
- Implement `authSlice`, `tenantSlice`, `permissionSlice` (Redux Toolkit) or equivalent contexts.
- After login fetch the user's roles & permissions and cache them in state.
- Components:
  - `ProtectedRoute` — redirects unauthenticated users.
  - `RequirePermission` — wraps UI blocks and pages to show/hide by permission.

### Phase 4 — Page & component scaffolding
Generate pages and reusable components for each module. Minimal list:

Auth: `Login`, `ForgotPassword`

Dashboard: role-based widgets that query allowed widgets from API

Tenants & Stores: `TenantList`, `StoreList`, `CreateEdit` forms

Users & Roles: `UserList`, `RoleList`, `PermissionManagement`

POS: `ProductCatalog`, `Cart`, `SalesHistory` (supports offline queuing)

Inventory: `ProductList`, `StockAdjustments`, low-stock alerts

CRM & Loyalty: `CustomerList`, `CustomerDetail`, `TransactionHistory`

Reports: `SalesReport`, `InventoryReport` (export CSV/Excel, charts via Recharts)

Audit: `AuditLogTable` with date/user/action filters and pagination

Sync: `OfflineBanner`, `SyncStatusPanel`, pending change list

Common primitives: `Form`, `Table`, `Modal`, `Widget`, `Pagination`, `DataLoader`

### Phase 5 — Offline & sync behavior
- Detect offline (API unreachable) and show persistent offline banner.
- Implement calls to `/sync/download` and `/sync/upload` via `sync` service.
- Persist pending POST/PUT/DELETE operations locally (IndexedDB or localForage) and replay when online.
- Show last sync time, pending changes count, and conflict notifications.

### Phase 6 — UI consistency & reusability
- Implement a theme system (MUI/AntD tokens) that matches `cloud-pos` reference.
- Create responsive layouts for dashboard & POS (desktop-first, tablet friendly).
- Centralize form validation using `react-hook-form + yup`.

### Phase 7 — Testing & documentation
- Unit tests with Jest + React Testing Library for components and hooks.
- Integration tests for services using `msw` to mock API.
- Storybook for interactive component docs.
- Generate TypeScript API types and produce `typedoc` docs for service modules.

### Phase 8 — Build & deployment
- Use `.env` for `REACT_APP_API_URL` and other envs.
- Provide `Dockerfile` for frontend build image (static assets) to serve via Nginx alongside backend.
- Provide `npm run build` and verify production bundle size is acceptable.

## Execution flow (AI agent runtime checklist)
1. Read backend OpenAPI → generate typed types & API client.
2. Scaffold project and folder structure.
3. Implement Axios client and `auth` + `permission` flows.
4. Scaffold pages and generate CRUD UIs using typed service methods.
5. Add RBAC checks to page routes and components.
6. Implement offline queue + `/sync` UI and replay logic.
7. Add audit log viewer and reports pages.
8. Write tests (unit + integration) and Storybook stories.
9. Run lint, tests, and build; commit artifacts.

## Deliverables
- A runnable React + TypeScript project `cloud-pos-web` with:
  - typed API client and services
  - auth, multi-tenant, RBAC enforcement in UI
  - POS flows with offline queueing and sync panels
  - audit log viewer, reports, and role-driven dashboard widgets
  - tests, Storybook, and typed documentation

## Quick dev commands (examples)
```bash
# scaffold (one-time)
npx create-react-app cloud-pos-web --template typescript

# install deps (example)
npm install react-router-dom axios @reduxjs/toolkit react-redux @tanstack/react-query react-hook-form yup dayjs recharts localforage

# dev
npm start

# test
npm test

# build
npm run build
```

---

Follow this file strictly as the authoritative checklist for any AI agent building the frontend; update it when the backend API or design reference changes.
````
