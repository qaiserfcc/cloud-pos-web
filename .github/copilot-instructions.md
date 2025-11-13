````instructions
# Cloud POS Web — AI Agent Instructions (React + TypeScript Frontend)

## 🎯 Objective
Generate a complete, production-ready React + TypeScript frontend (`cloud-pos-web`) that provides full feature parity with the Cloud POS backend API. The frontend must integrate seamlessly with the comprehensive multi-tenant POS system, implementing all backend capabilities including hierarchical tenant→store management, dynamic RBAC, POS operations, offline synchronization, audit logging, approval workflows, and advanced reporting.

## 📋 Core System Architecture

### Multi-Tenant Hierarchy
- **Tenants**: Top-level organizational units with global settings
- **Stores**: Child entities under tenants with location-specific operations
- **Users**: Scoped to tenants/stores with role-based access control
- **Superadmin**: Global access bypassing tenant/store restrictions

### Authentication & Security
- JWT-based authentication with bearer tokens
- Automatic token refresh on 401 responses
- Multi-tenant headers: `X-Tenant-ID` and `X-Store-ID`
- Dynamic RBAC with granular permissions system

### Key Business Domains
1. **POS Operations**: Sales, payments, refunds, cart management
2. **Inventory Management**: Products, categories, stock levels, transfers, automated reordering
3. **Customer Management**: CRM, loyalty programs, transaction history
4. **User Management**: Users, roles, permissions, authentication
5. **Reporting & Analytics**: Dynamic dashboards, widgets, export capabilities
6. **Audit & Compliance**: Complete audit trails, approval workflows
7. **Offline Synchronization**: Local queuing, conflict resolution, sync management

## 🔧 Technical Requirements

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6 with protected routes
- **State Management**: Redux Toolkit + RTK Query for API state
- **Forms**: React Hook Form + Yup validation
- **UI Components**: Modern component library (shadcn/ui recommended)
- **Charts**: Recharts for data visualization
- **Offline Storage**: IndexedDB/localForage for offline queue
- **HTTP Client**: Axios with interceptors for auth/tenant headers
- **Toast Notifications**: Global toast system for messages and errors with copy details button
- **Logging**: Global logger saving all errors to 'server_log' file with complete error information

### Global Features
- **Toast System**: Implement global toast notifications for success/error messages with copy details button for errors
- **Error Handling**: All errors display complete information globally with user-friendly copy functionality
- **Logging System**: Comprehensive logger that saves all errors to 'server_log' file with timestamps and full context

### API Integration
- **Base URL**: `/api/v1` endpoints
- **Authentication**: Bearer token in Authorization header
- **Multi-tenancy**: X-Tenant-ID and X-Store-ID headers
- **Error Handling**: Consistent error responses with success/error structure
- **Pagination**: Standard pagination with limit/offset
- **Filtering**: Query parameters for advanced filtering

## 📚 Backend API Reference (Key Endpoints)

### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Current user profile

### Multi-Tenant Management
- `GET /tenants` - List tenants (superadmin only)
- `GET /stores` - List stores (scoped to tenant)
- `GET /users` - List users with roles
- `GET /roles` - Dynamic roles and permissions

### POS Operations
- `POST /sales` - Create new sale
- `PUT /sales/{id}/pay` - Process payment
- `PUT /sales/{id}/complete` - Complete sale
- `PUT /sales/{id}/cancel` - Cancel sale
- `PUT /sales/{id}/refund` - Process refund
- `GET /sales` - List sales with filtering

### Inventory Management
- `GET /products` - Product catalog
- `GET /inventory` - Stock levels by store
- `POST /inventory/transfers` - Create inventory transfers
- `POST /inventory/bulk-transfers` - Bulk transfer operations
- `GET /inventory/regions` - Regional inventory management

### Customer Management
- `GET /customers` - Customer list with loyalty data
- `GET /customers/{id}/transactions` - Transaction history

### Reporting & Analytics
- `GET /dashboard/widgets` - Dynamic dashboard widgets
- `GET /reports/sales` - Sales analytics
- `GET /reports/inventory` - Inventory reports
- `GET /reports/customers` - Customer analytics

### Audit & Approvals
- `GET /audit-logs` - Complete audit trail
- `GET /approvals` - Approval requests and workflows
- `PUT /approvals/{id}/approve` - Approve requests

### Offline Synchronization
- `GET /sync/download` - Download changes for offline sync
- `POST /sync/upload` - Upload offline changes

## 🚀 Implementation Phases

### Phase 1: Project Foundation
**Goal**: Establish development environment and core architecture

**Tasks**:
1. Initialize Next.js project with TypeScript and Tailwind CSS
2. Configure ESLint, Prettier, and Husky for code quality
3. Set up folder structure:
   ```
   src/
   ├── app/                    # Next.js app router
   ├── components/             # Reusable UI components
   │   ├── ui/                # Base UI components (shadcn/ui)
   │   ├── forms/             # Form components
   │   └── layout/            # Layout components
   ├── lib/                   # Utilities and configurations
   │   ├── api/               # API client and services
   │   ├── auth/              # Authentication utilities
   │   ├── stores/            # Redux store
   │   ├── logger/            # Global logging system
   │   └── utils/             # Helper functions
   ├── hooks/                 # Custom React hooks
   ├── types/                 # TypeScript type definitions
   ├── providers/             # Context providers (Toast, etc.)
   └── middleware.ts          # Next.js middleware
   ```
4. Generate TypeScript types from OpenAPI spec
5. Configure environment variables and constants
6. **Implement Global Toast System**: Create toast provider with copy details functionality for errors
7. **Implement Global Logger**: Set up logger that saves all errors to 'server_log' file with complete information

### Phase 2: Authentication & Multi-Tenant Setup
**Goal**: Implement secure authentication and tenant context management

**Tasks**:
1. Create authentication service with login/logout/refresh
2. Implement JWT token management with automatic refresh
3. Set up Redux store for auth state and tenant context
4. Create tenant/store selection components
5. Implement protected route guards with RBAC checks
6. Add middleware for automatic header injection (X-Tenant-ID, X-Store-ID)
7. **Integrate Global Error Handling**: Configure API client to use global toast system for all errors with copy details functionality
8. **Integrate Global Logging**: Ensure all API errors and authentication failures are logged to 'server_log' file

### Phase 3: Core API Integration
**Goal**: Build comprehensive API client and service layer

**Tasks**:
1. Create Axios instance with interceptors for:
   - JWT token attachment
   - Tenant/store header injection
   - Automatic token refresh
   - Error handling and user-friendly messages
2. Implement service modules for each domain:
   - `authService.ts` - Authentication operations
   - `tenantService.ts` - Tenant management
   - `storeService.ts` - Store operations
   - `userService.ts` - User CRUD and role management
   - `posService.ts` - Sales, payments, refunds
   - `inventoryService.ts` - Product and stock management
   - `customerService.ts` - CRM operations
   - `reportService.ts` - Analytics and reporting
   - `auditService.ts` - Audit log access
   - `syncService.ts` - Offline synchronization
3. Add RTK Query for efficient API state management
4. Implement optimistic updates for better UX

### Phase 4: POS System Implementation
**Goal**: Build complete point-of-sale functionality

**Tasks**:
1. Create product catalog with search and filtering
2. Implement shopping cart with real-time inventory checks
3. Build payment processing interface (cash, card, digital wallet)
4. Add sale completion, cancellation, and refund workflows
5. Implement receipt generation and printing
6. Add offline sale queuing for network disruptions
7. Create sales history with advanced filtering

### Phase 5: Inventory Management
**Goal**: Implement comprehensive inventory control

**Tasks**:
1. Product management (CRUD operations)
2. Real-time stock level monitoring
3. Inventory transfer system (single and bulk)
4. Automated reorder alerts and rules
5. Regional inventory management
6. Stock adjustment workflows with approvals
7. Inventory reporting and analytics

### Phase 6: User & Access Management
**Goal**: Build complete user administration system

**Tasks**:
1. User CRUD operations with role assignment
2. Dynamic role and permission management
3. Store-specific user scoping
4. Password management and security policies
5. User activity monitoring and audit trails
6. Bulk user operations and imports

### Phase 7: Dashboard & Reporting
**Goal**: Create dynamic, role-based analytics dashboard

**Tasks**:
1. Dynamic widget system based on user permissions
2. Real-time sales and inventory metrics
3. Customer analytics and loyalty tracking
4. Financial reporting with export capabilities
5. Custom report builder
6. Chart visualizations using Recharts
7. Dashboard customization and layout management

### Phase 8: Audit & Compliance
**Goal**: Implement comprehensive audit and approval systems

**Tasks**:
1. Audit log viewer with advanced filtering
2. Approval workflow management
3. Change tracking for all operations
4. Compliance reporting and exports
5. Data retention and archival policies

### Phase 9: Offline Synchronization
**Goal**: Enable full offline functionality with cloud sync

**Tasks**:
1. Implement offline detection and UI indicators
2. Create local storage system for pending operations
3. Build sync queue with conflict resolution
4. Add background sync when connection restored
5. Implement data versioning and merge strategies
6. Create sync status dashboard and error handling

### Phase 10: UI/UX Polish & Testing
**Goal**: Ensure production-ready user experience

**Tasks**:
1. Implement responsive design for all screen sizes
2. Add loading states, error boundaries, and empty states
3. Create comprehensive test suite (unit, integration, E2E)
4. Implement accessibility features (WCAG compliance)
5. Add internationalization support
6. Performance optimization and bundle analysis
7. Documentation generation and deployment setup

## 🔒 Security & Best Practices

### Authentication Security
- Secure token storage (httpOnly cookies for refresh tokens)
- Automatic logout on token expiration
- CSRF protection for state-changing operations
- Rate limiting for authentication endpoints

### Data Protection
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- XSS protection with proper content escaping
- Sensitive data encryption at rest and in transit

### Multi-Tenant Isolation
- Strict tenant context enforcement
- Data access scoped to user's tenant/store permissions
- Audit logging for all cross-tenant operations
- Secure tenant switching mechanisms

### API Security
- Request signing for critical operations
- API versioning and deprecation policies
- Rate limiting and abuse prevention
- Comprehensive input validation schemas

## 🧪 Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom render utilities
- Service layer testing with mocked API responses
- Utility function testing

### Integration Testing
- API integration tests with MSW for mocking
- Redux store integration tests
- Form submission and validation tests
- Authentication flow tests

### End-to-End Testing
- Critical user journeys (login → POS → payment → receipt)
- Offline → online sync scenarios
- Multi-tenant switching and RBAC enforcement
- Cross-browser compatibility testing

## 📊 Performance Optimization

### Frontend Performance
- Code splitting and lazy loading
- Image optimization and CDN usage
- Bundle size monitoring and optimization
- Memory leak prevention in long-running sessions

### API Performance
- Efficient pagination and filtering
- Caching strategies for static data
- Optimistic updates for better perceived performance
- Background sync for non-critical operations

### Offline Performance
- Minimal local storage usage
- Efficient sync algorithms
- Conflict resolution without data loss
- Graceful degradation during network issues

## 🚀 Deployment & DevOps

### Environment Configuration
- Development, staging, and production environments
- Environment-specific API endpoints
- Feature flags for gradual rollouts
- Configuration management with proper secrets handling

### Build & Deployment
- Automated CI/CD pipelines
- Docker containerization for consistent deployments
- Static asset optimization and CDN integration
- Health checks and monitoring integration

### Monitoring & Analytics
- Error tracking and alerting
- Performance monitoring and APM
- User analytics and behavior tracking
- Business metrics and KPI dashboards

## 📚 Development Workflow

### Code Quality
- Pre-commit hooks for linting and formatting
- Automated testing on PR creation
- Code review guidelines and checklists
- Documentation requirements for new features

### Version Control
- Git flow with feature branches
- Semantic versioning for releases
- Automated changelog generation
- Tag-based deployments

### Collaboration
- Clear coding standards and conventions
- API contract documentation
- Design system documentation
- Onboarding guides for new developers

## 🎯 Success Criteria

### Functional Completeness
- ✅ Full feature parity with backend API
- ✅ Complete POS workflow from product selection to receipt
- ✅ Comprehensive inventory management
- ✅ Advanced reporting and analytics
- ✅ Offline functionality with reliable sync
- ✅ Multi-tenant isolation and RBAC

### Technical Excellence
- ✅ TypeScript coverage >95%
- ✅ Test coverage >80%
- ✅ Performance benchmarks met
- ✅ Accessibility WCAG AA compliance
- ✅ Cross-browser compatibility
- ✅ Mobile-responsive design

### Production Readiness
- ✅ Comprehensive error handling
- ✅ Security audit passed
- ✅ Performance optimization complete
- ✅ Documentation complete
- ✅ Deployment pipeline configured
- ✅ Monitoring and alerting in place

---

**Follow this comprehensive guide as the authoritative reference for building the Cloud POS frontend. Update this document when backend APIs or business requirements change.**
````
