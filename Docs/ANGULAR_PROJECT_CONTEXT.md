# Angular Project Context - MedPal UI

## Project Overview
- **Location:** `F:\PersonalProjects\SchedulingApp\UI\SchedulingAppUI\scheduling.ui`
- **Framework:** Angular (latest version based on package.json)
- **Architecture:** Multi-layered with NgRx state management
- **Build Tool:** Angular CLI with webpack
- **Status:** Active development with comprehensive documentation

## Project Structure

```
src/app/
├── components/
│   ├── appointments/       - Appointment management UI
│   ├── calendar/           - Calendar view component
│   ├── clinics/            - Clinic management
│   ├── home/               - Home/dashboard
│   ├── medical-history/    - Medical records display
│   ├── patients/           - Patient management (WILL BE EXCLUDED FOR MOBILE APP)
│   ├── prescriptions/      - Prescription management
│   ├── public/             - Public pages (login, signup)
│   ├── quickaction-menu/   - Quick action menu
│   └── user/               - User management & profile
├── services/               - HTTP services & business logic
├── guards/                 - Route guards & authorization
├── interceptors/           - HTTP interceptors
├── store/                  - NgRx state management
│   ├── actions/
│   ├── effects/
│   ├── reducers/
│   └── selectors/
├── entities/               - TypeScript models/interfaces
├── conf/                   - Configuration files
├── shared/                 - Shared components & utilities
│   ├── edit-modal/
│   ├── menu/
│   ├── styles/
│   └── utils/
└── utils/                  - Utility functions
    └── session/            - Session management
```

## Entities (Data Models)

### Current Entities
- `IUser.ts` - User interface
- `IRole.ts` - Role interface
- `IClinic.ts` - Clinic interface
- `IPatient.ts` - Patient interface (TO BE EXCLUDED)
- `IMedicalHistory.ts` - Medical history interface (TO BE EXCLUDED)
- `IAppointment.ts` - Appointment interface
- `IPrescription.ts` - Prescription interface
- `IInputData.ts` - Generic input data interface
- `IAudit-data.ts` - Audit data interface
- `AppointmentModel.ts` - Appointment model class
- `medical-history.model.ts` - Medical history model (TO BE EXCLUDED)
- `specialty-templates.model.ts` - Specialty templates model

### New Entities to Add (Admin/Clinic Level)
- `IPatientConsent.ts` - Patient consent record
- `IMedicalRecordAccessLog.ts` - Audit log for access
- `IConsentScope.ts` - Enum for consent types
- `IAuditableEntity.ts` - Base interface for auditable records

## Architecture Patterns

### State Management
- **Implementation:** NgRx Store
- **Structure:** Actions → Effects → Reducers → Selectors
- **Location:** `src/app/store/`

### Service Layer
- Separate services for each domain
- HTTP client service pattern
- Base service for common operations
- Business logic encapsulation

### Guards
- Route protection
- Authorization checks
- Authentication validation

### Interceptors
- JWT token injection
- Error handling
- Request/response transformation

### Components
- Feature-based organization
- Smart components (container) + Dumb components (presentational)
- Reactive forms with validation
- Angular Material integration

## Authentication & Authorization

### Current Implementation
- JWT-based authentication
- Role-based access control (RBAC)
- Claims-based authorization
- Token stored in localStorage
- Guards for protected routes

### Authorization Policies (Backend)
- 8 authorization policies already implemented:
  - User management policies
  - Clinic management policies
  - Medical record access policies
  - Role-based access control

## Dependencies
Based on package.json analysis:
- Angular Core, Common, Forms, Router
- RxJS for reactive programming
- NgRx for state management
- Angular Material for UI components
- TypeScript strict mode enabled

## Documentation Available
- `DESIGN_SYSTEM.md` - UI/UX guidelines
- `COMPONENT_LIBRARY.md` - Component catalog
- `IMPLEMENTATION_STANDARDS.md` - Code standards
- `DASHBOARD_REFACTORING_PLAN.md` - Recent refactoring
- `LOGIN_COMPONENT_CHECKLIST.md` - Auth components
- `SIGNUP_COMPONENT_CHECKLIST.md` - Registration flow
- `USER_ME_ENDPOINT_IMPLEMENTATION.md` - User profile

## Implementation Phases

### Phase 1: Base Structure & Models (Entities & DTOs)
**Status:** Ready to start  
**Scope:** Define data models matching backend implementation  
**Duration:** ~4-6 hours

#### Files to Create:
```
src/app/entities/
├── IPatientConsent.ts          - Patient consent interface
├── IMedicalRecordAccessLog.ts  - Access audit log interface  
├── IAuditableEntity.ts         - Base auditable interface
├── IConsentScope.ts            - Consent type enum
└── IUserAccount.ts             - Account/tenant context

src/app/store/audit/
├── audit.state.ts              - State interface
├── audit.actions.ts            - Actions
├── audit.reducer.ts            - Reducer
├── audit.effects.ts            - Effects (empty initially)
└── audit.selectors.ts          - Selectors

src/app/store/consent/
├── consent.state.ts            - State interface (mobile features)
├── consent.actions.ts          - Actions (mobile features)
├── consent.reducer.ts          - Reducer (mobile features)
├── consent.effects.ts          - Effects (mobile features)
└── consent.selectors.ts        - Selectors (mobile features)
```

#### Implementation Details:
- Define TypeScript interfaces matching backend DTOs
- Follow existing entity patterns (e.g., IAppointment.ts)
- Add NgRx state management structure
- Update app.config.ts or app.module.ts to register new store slices
- No components or services yet; data model setup only

#### Models Structure:
```typescript
// IMedicalRecordAccessLog.ts
export interface IMedicalRecordAccessLog {
  id: number;
  userId: number;
  medicalHistoryId: number;
  patientDetailsId: number;
  accessTime: Date;
  purpose: string;
  accessingClinicId: number;
  medicalRecordOwnerClinicId: number;
  hadValidConsent: boolean;
  reason?: string;
  ipAddress: string;
  sessionId: string;
}

// IPatientConsent.ts (Mobile app feature)
export interface IPatientConsent {
  id: number;
  patientDetailsId: number;
  requestingClinicId: number;
  ownerClinicId: number;
  consentScope: ConsentScope;
  isApproved: boolean;
  consentDate: Date;
  expiryDate?: Date;
  approvedByUserId?: number;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConsentScope {
  FULL_ACCESS = 'FULL_ACCESS',
  LIMITED_ACCESS = 'LIMITED_ACCESS',
  EMERGENCY_ONLY = 'EMERGENCY_ONLY'
}
```

---

### Phase 2: Control de Acceso (Authorization & Guards)
**Status:** Depends on Phase 1  
**Scope:** Implement authorization policies for audit access  
**Duration:** ~6-8 hours

#### Files to Create:
```
src/app/guards/
├── audit-access.guard.ts       - Verify audit log viewing permissions
├── consent-access.guard.ts     - Consent management permissions (mobile)
└── clinic-data-access.guard.ts - Clinic-level data access control

src/app/services/
├── auth.service.ts             - UPDATE existing or create if missing
├── permission.service.ts       - Check permission policies
└── tenant-context.service.ts   - Get current account/clinic context
```

#### Implementation Details:

1. **Permission Service** (maps backend policies):
   - `canViewAuditLogs(clinicId)` - Check if user can view clinic's logs
   - `canViewConsent(consentId)` - Check consent access (mobile)
   - `canGrantConsent()` - Check if can approve consent (mobile)
   - `canManageMedicalRecords()` - Check medical record access
   - Cache permissions from JWT claims

2. **Audit Access Guard**:
   - Verify user role/permission
   - Check clinic context
   - Redirect to unauthorized page if denied
   - Match backend authorization policies

3. **Tenant Context Service**:
   - Extract from JWT claims: `account_id`, `clinic_id`, `user_id`, `role`
   - Provide current clinic/account to components
   - Update whenever token changes

#### Authorization Policies Implemented:
- ✅ `AuditLogViewer` - View access logs
- ✅ `AuditLogReporter` - Generate reports
- ✅ `ConsentApprover` - Approve/reject consent (mobile)
- ✅ `ConsentRevoker` - Revoke consent (mobile)
- ✅ `ClinicDataManager` - Manage clinic data

---

### Phase 3: Consentimiento y Auditoría (Consent & Audit Features)

#### Phase 3a: Audit Log Management (WEB - Admin/Clinic Staff)
**Status:** Depends on Phase 2  
**Scope:** Clinic staff view/report on medical record access  
**Duration:** ~10-12 hours

##### Files to Create:
```
src/app/components/audit-logs/
├── audit-log-list/
│   ├── audit-log-list.component.ts
│   ├── audit-log-list.component.html
│   ├── audit-log-list.component.scss
│   └── audit-log-list.component.spec.ts
├── audit-log-filters/
│   ├── audit-log-filters.component.ts
│   ├── audit-log-filters.component.html
│   ├── audit-log-filters.component.scss
│   └── audit-log-filters.component.spec.ts
├── audit-log-detail/
│   ├── audit-log-detail.component.ts
│   ├── audit-log-detail.component.html
│   ├── audit-log-detail.component.scss
│   └── audit-log-detail.component.spec.ts
├── audit-reports/
│   ├── audit-reports.component.ts
│   ├── audit-reports.component.html
│   ├── audit-reports.component.scss
│   └── audit-reports.component.spec.ts
└── audit-logs.module.ts

src/app/services/
├── audit-log.service.ts        - HTTP API calls
└── audit-report.service.ts     - Report aggregation
```

##### Component Details:

1. **audit-log-list** (Smart Component):
   - Display paginated table of access logs
   - Connect to NgRx store
   - Load data on init
   - Dispatch filter actions
   - Handle pagination/sorting

2. **audit-log-filters** (Dumb Component):
   - Reactive form for filters
   - Date range picker
   - User selector
   - Patient/Clinic selector
   - Consent status filter
   - Search field
   - Reset button

3. **audit-log-detail** (Modal/Page):
   - Show full log entry details
   - Display related information
   - IP address, session info
   - Consent status at time of access

4. **audit-reports** (Smart Component):
   - Summary statistics
   - Access trends chart
   - Most accessed records
   - Compliance metrics
   - Export to CSV

##### Service Methods:

```typescript
// AuditLogService
getAccessLogs(filter: AuditLogFilter): Observable<PagedResult<IMedicalRecordAccessLog>>
getAccessLogDetail(id: number): Observable<IMedicalRecordAccessLog>
generateReport(params: ReportParams): Observable<AuditReport>
exportLogs(filter: AuditLogFilter): Observable<Blob>
```

---

#### Phase 3b: Consent Management (MOBILE APP - NOT in Web Angular)
**Status:** Skip for web; implement in cross-platform app  
**Scope:** Patient-facing consent workflows  
**Duration:** Mobile team implementation

##### Mobile Features (Android/iOS):
- Patient consent approval dashboard
- Grant/revoke consent workflows
- Consent history view
- Clinic access management
- Push notifications for access events

##### Backend APIs Ready for Mobile:
- `POST /api/consent` - Grant consent
- `DELETE /api/consent/{id}` - Revoke consent
- `GET /api/consent/patient/{patientId}` - Get consents
- `GET /api/consent/active` - Active consents
- `GET /api/medical-records/access-log` - Personal access log

##### Web Angular Approach:
- Admin can **view** consent records (read-only)
- Admin can **see** consent status impact on access logs
- Admin cannot create/modify patient consents
- Patient consent actions happen only in mobile app

##### Optional: Web Consent Admin Panel (Phase 3c+):
If needed for clinic admins to manage patient consents:
```
src/app/components/consent-management/
├── consent-list/
├── consent-requests/
├── consent-admin-panel/
└── consent-management.module.ts
```
**Decision:** Implement only if business requires it; otherwise mobile app handles all patient-facing consent

---

### Phase 3c: Database & Integration
**Status:** Backend complete; Angular just consumes  
**Scope:** Verify API endpoints, create HTTP interceptors  
**Duration:** ~2-3 hours

#### Backend Tables Already Created:
- ✅ `PatientConsents` - Patient consent records
- ✅ `MedicalRecordAccessLogs` - Immutable audit logs
- ✅ Query filters for multi-tenancy
- ✅ 8 authorization policies

#### Angular Integration:
- Create HTTP interceptor for audit log requests
- Add error handling for 403 (no permission)
- Implement loading states
- Handle pagination in API responses
- Cache appropriate data in NgRx store

## Important Constraints & Scope

### Out of Scope for Angular Web (Mobile App Only)
1. **Patient consent workflows** - Patient grants/revokes consent to clinics
2. **Patient consent UI** - Consent approval interface for patients
3. **Patient medical record access control** - Patient manages own access
4. **Personal access history** - Patients view who accessed their records
5. **Consent notifications** - Access request notifications to patient

### In Scope for Angular Web (Admin/Clinic Staff)
1. **View audit logs** - Read-only access to clinic's access logs
2. **Filter & search logs** - Find specific access events
3. **Generate reports** - Analytics on record access
4. **Export logs** - CSV/PDF export for compliance
5. **View consent status** - See which consents impact access

### Angular Web Can See But Not Modify:
- Consent records (display only)
- Patient consent history (read-only)
- Consent approval status (informational)

### Implementation Split:
```
┌─────────────────────────────────────────────────────────┐
│              MedPal Multi-Platform System               │
├──────────────────────┬──────────────────────────────────┤
│  Web Angular App     │   Mobile App (Future)            │
│  (Admin/Clinic)      │   (Patient-Facing)              │
├──────────────────────┼──────────────────────────────────┤
│ Audit Logs View      │ Consent Approval Workflows       │
│ Reports & Analytics  │ Consent History (Patient)        │
│ Access Monitoring    │ Access Notifications             │
│ Compliance Checks    │ Revoke Consent to Clinics       │
│ Consent Status (RO)  │ Emergency Access Requests        │
└──────────────────────┴──────────────────────────────────┘
```

## Backend API Endpoints (Already Implemented)
- `GET /api/audit-logs` - Fetch access logs
- `GET /api/audit-logs/{id}` - Get single log
- `GET /api/audit-logs/patient/{patientId}` - Patient access history
- `GET /api/audit-logs/clinic/{clinicId}` - Clinic access history
- `POST /api/audit-logs/report` - Generate reports

### Consent Endpoints (Mobile App will consume)
- `POST /api/consent` - Grant consent
- `DELETE /api/consent/{id}` - Revoke consent
- `GET /api/consent/patient/{patientId}` - Get patient consents
- `GET /api/consent/active` - Get active consents

## Development Approach

### Phase Implementation Order
1. **Phase 1:** Create all TypeScript interfaces and NgRx store structure
2. **Phase 2:** Implement authorization guards and permission checks
3. **Phase 3a:** Build audit log viewing and reporting components
4. **Phase 3b:** Skip patient consent UI (reserve for mobile app)
5. **Phase 3c:** API integration and testing

### Code Standards & Patterns

#### Component Structure (Smart/Dumb Pattern):
```typescript
// Smart Component (Container)
@Component({
  selector: 'app-audit-logs-page',
  templateUrl: './audit-logs-page.component.html'
})
export class AuditLogsPageComponent implements OnInit {
  auditLogs$ = this.store.select(selectAuditLogs);
  loading$ = this.store.select(selectLoading);
  
  constructor(private store: Store) {}
  
  ngOnInit() {
    this.store.dispatch(loadAuditLogs());
  }
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-audit-log-table',
  templateUrl: './audit-log-table.component.html',
  inputs: ['logs', 'loading'],
  outputs: ['filterChange', 'pageChange']
})
export class AuditLogTableComponent {
  @Input() logs: IMedicalRecordAccessLog[] = [];
  @Input() loading = false;
  @Output() filterChange = new EventEmitter<AuditLogFilter>();
}
```

#### Service Pattern (HTTP + Business Logic):
```typescript
@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly apiUrl = '/api/audit-logs';
  
  constructor(private http: HttpClient) {}
  
  getAccessLogs(filter: AuditLogFilter): Observable<PagedResult<IMedicalRecordAccessLog>> {
    return this.http.get<PagedResult<IMedicalRecordAccessLog>>(this.apiUrl, {
      params: this.buildParams(filter)
    }).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
```

#### NgRx Store Pattern (consistent with existing):
```typescript
// State
export interface AuditState {
  logs: IMedicalRecordAccessLog[];
  filter: AuditLogFilter;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

// Actions
export const loadAuditLogs = createAction('[Audit Logs] Load');
export const loadAuditLogsSuccess = createAction(
  '[Audit Logs] Load Success',
  props<{ logs: IMedicalRecordAccessLog[] }>()
);

// Reducer
export const auditReducer = createReducer(
  initialState,
  on(loadAuditLogs, (state) => ({ ...state, loading: true })),
  on(loadAuditLogsSuccess, (state, { logs }) => ({
    ...state,
    logs,
    loading: false
  }))
);

// Selectors
export const selectAuditLogs = createSelector(
  selectAuditState,
  (state: AuditState) => state.logs
);
```

#### Reactive Forms Pattern:
```typescript
@Component({
  selector: 'app-audit-filters',
  templateUrl: './audit-filters.component.html'
})
export class AuditFiltersComponent {
  filterForm = this.fb.group({
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    userId: [''],
    clinicId: [''],
    hasConsent: [''],
    searchTerm: ['']
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit() {
    if (this.filterForm.valid) {
      this.filterChange.emit(this.filterForm.value);
    }
  }
}
```

#### Change Detection (OnPush for performance):
```typescript
@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsComponent {
  constructor(private cdr: ChangeDetectorRef) {}
}
```

#### RxJS Memory Management (takeUntil pattern):
```typescript
export class AuditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.store.select(selectAuditLogs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(logs => { /* ... */ });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Code Quality Requirements
- ✅ Strict TypeScript (`strict: true` in tsconfig)
- ✅ No `any` types unless absolutely necessary
- ✅ Proper error handling with user feedback
- ✅ Loading states for all async operations
- ✅ Proper unsubscribe patterns (takeUntil/async pipe)
- ✅ Unit tests for services and components
- ✅ Component docstrings with @Component metadata
- ✅ Consistent naming: `<feature>.service.ts`, `<feature>.component.ts`
- ✅ Organize by feature: `/components/<feature>/`, `/services/<feature>/`

### Project Standards to Follow
1. **Styling:** Material Design + SCSS variables (check `shared/styles/`)
2. **Icons:** Material Icons (check `MATERIAL_ICONS_SETUP.md`)
3. **Forms:** Reactive Forms only, no Template Forms
4. **HTTP:** HttpClient with proper error handling
5. **Routing:** Lazy-loaded modules where applicable
6. **State:** NgRx for shared state, component state for local forms
7. **Testing:** Jasmine + Karma with reasonable coverage (>70%)

---

## Next Steps for Implementation

### Immediate Actions:
1. ✅ **Create Phase 1 files** (interfaces, NgRx store structure)
2. ✅ **Review existing patterns** in project (check service/component examples)
3. ✅ **Set up route guards** for audit access
4. ✅ **Create AuditLogService** HTTP layer
5. ✅ **Build list component** with table display
6. ✅ **Add filter component** with reactive form
7. ✅ **Implement report generator**
8. ✅ **Write tests** (services first, then components)
9. ✅ **Document components** (JSDoc + README)

### Validation Checklist:
- [ ] All components follow Smart/Dumb pattern
- [ ] All services follow HttpClient + business logic pattern
- [ ] NgRx store follows existing project patterns
- [ ] Change detection OnPush enabled
- [ ] Proper error handling in all API calls
- [ ] Loading states visible to users
- [ ] Authorization checks before rendering
- [ ] Mobile app features clearly marked
- [ ] Unit tests cover happy path + error cases
- [ ] TypeScript strict mode compliance

## Backend Status & API Ready

### Phase 1: ✅ COMPLETE (Base Structure)
- ✅ Account model with multi-tenancy
- ✅ System role enum (Admin, Doctor, Nurse, Receptionist, Patient)
- ✅ User, Clinic, Patient models updated
- ✅ Database migration applied

### Phase 2: ✅ COMPLETE (Control de Acceso)
- ✅ ITenantContextService for clinic/account context
- ✅ Query filters for automatic multi-tenancy isolation
- ✅ 8 authorization policies implemented:
  - User management (create, read, update, delete)
  - Clinic management (read, update)
  - Medical record access (view, audit)
  - Role-based access control
- ✅ JWT claims include: `account_id`, `clinic_id`, `user_id`, `role`
- ✅ All controllers updated with `[Authorize]` attributes
- ✅ Application running on localhost:5126 ✅

### Phase 3: ✅ COMPLETE (Consent & Audit)
- ✅ PatientConsent model with soft delete
- ✅ MedicalRecordAccessLog model (immutable per NOM-004)
- ✅ IPatientConsentService interface (8 methods)
- ✅ ConsentService implementation (323 lines)
- ✅ Database migration `20260112160853_Phase3_ConsentAndAudit` applied
- ✅ Multi-tenancy isolation in queries
- ✅ Circular dependency resolved (factory pattern)
- ✅ Compliance: NOM-004, NOM-024, LSSI-PC implemented

### API Endpoints Available (Ready for Angular)

#### Audit Logs (Web - implemented)
```
GET    /api/audit-logs                          - List all logs (paginated)
GET    /api/audit-logs/{id}                     - Get single log
GET    /api/audit-logs/patient/{patientId}     - Logs for patient
GET    /api/audit-logs/clinic/{clinicId}       - Logs for clinic
POST   /api/audit-logs/report                   - Generate report
GET    /api/audit-logs/export                   - CSV/PDF export
```

#### Patient Consent (Mobile - implemented on backend)
```
POST   /api/consent                             - Grant consent
DELETE /api/consent/{id}                        - Revoke consent
GET    /api/consent/patient/{patientId}         - Patient consents
GET    /api/consent/active                      - Active consents
GET    /api/consent/by-clinic                   - Clinic's received consents
```

#### Optional: Admin Consent View (if needed)
```
GET    /api/consent/clinic/{clinicId}          - All consents for clinic
GET    /api/consent/report                      - Consent analytics
```

### HTTP Response Format
```json
{
  "data": { /* response body */ },
  "message": "Success",
  "success": true,
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}

// Error response
{
  "message": "Unauthorized to view this audit log",
  "success": false,
  "errors": { "audit": ["Access denied"] }
}
```

### Authorization Policies (Backend - check JWT claims)
| Policy | Required Role | Check | Notes |
|--------|---|---|---|
| `ViewAuditLogs` | Admin, Doctor, Nurse | `clinic_id` match | Per-clinic isolation |
| `ManageAuditLogs` | Admin | Account level | Full account access |
| `ViewConsent` | Any authenticated | Patient or Clinic context | Mobile app primary user |
| `ApproveConsent` | Patient | Self-owned consent | Mobile app patient approval |
| `RevokeConsent` | Patient, Admin | Self-owned or clinic admin | Mobile/Web |
| `ViewMedicalHistory` | Doctor, Nurse, Patient | Consent + clinic context | Complex logic |
| `CreateUser` | Admin | Account level | Clinic staff creation |
| `ManageRoles` | Admin | Account level | Role assignment |

---

## Technical Integration Details

### JWT Token Structure (from backend)
```json
{
  "sub": 1,              // userId
  "email": "user@clinic.com",
  "role": "Doctor",
  "account_id": 5,       // Account/tenant ID
  "clinic_id": 12,       // Primary clinic
  "clinics": [12, 15],   // All associated clinics
  "permissions": ["ViewAuditLogs", "ViewMedicalHistory"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Multi-Tenancy Flow
1. User logs in → Backend generates JWT with `account_id` + `clinic_id`
2. Angular stores token in localStorage
3. HTTP interceptor adds token to all requests
4. Backend filters data by `account_id` automatically
5. Authorization policies check `clinic_id` for resource access
6. Frontend displays only data backend returns (double security)

### Error Handling Strategy
```typescript
// Common error codes from backend
401 - Unauthorized (token invalid/expired)
403 - Forbidden (no permission for resource)
404 - Not found
422 - Validation error (review validation errors array)
500 - Server error

// Angular should:
1. Intercept 401 → redirect to login
2. Display 403 → "You don't have permission to view this"
3. Show validation errors from 422 response
4. Show generic message for 500
```

### Circular Dependency Fix (for context)
Backend resolved a circular dependency:
- AppDbContext needed ITenantContextService for query filters
- ITenantContextService needed AppDbContext for queries
- **Solution:** Lazy-load service via IServiceProvider instead of constructor injection
- **Frontend impact:** None - just know backend is robust

---

## Ready for Copilot Implementation

### What Copilot Should Do:
1. **Review** existing component patterns in `/components/`
2. **Review** existing service patterns in `/services/`
3. **Review** existing NgRx patterns in `/store/`
4. **Follow** exact same patterns for audit/consent features
5. **Respect** Component Library standards (`COMPONENT_LIBRARY.md`)
6. **Use** Design System (`DESIGN_SYSTEM.md`)
7. **Match** code formatting and naming conventions
8. **Ensure** OnPush change detection
9. **Implement** proper error handling
10. **Write** unit tests for all services

### What NOT to Do:
1. ❌ Create patient-facing consent UIs (mobile app)
2. ❌ Allow patients to revoke consent from web (mobile only)
3. ❌ Store sensitive data in localStorage (backend secure)
4. ❌ Use `any` types without justification
5. ❌ Subscribe without unsubscribe patterns
6. ❌ Create components with side effects
7. ❌ Skip error handling for API calls
8. ❌ Hardcode API URLs (use environment config)
9. ❌ Create duplicate services (reuse existing patterns)
10. ❌ Ignore TypeScript strict mode

### Current Application Status:
- ✅ Backend: Phase 1-3 complete, running, tested
- ✅ Database: 58+ migrations applied
- ✅ API: All endpoints ready
- ✅ Auth: JWT + role-based access working
- 🔄 Frontend: Ready to start Phase 1
- 📋 Mobile: Future (Android/iOS multi-platform)

---

## Document Summary

**Purpose:** Complete context for Angular frontend implementation using Claude Haiku 4.5

**Backend Status:** ✅ Phase 1-3 fully implemented and production-ready
**Frontend Status:** 🔄 Phase 1-3 ready to start with clear specifications
**Mobile Status:** 📋 APIs ready for future mobile app implementation

**Key Implementation Files to Create:**

Phase 1 (Models):
- `src/app/entities/I*.ts` (5-7 interfaces)
- `src/app/store/audit/*.ts` (5 store files)
- `src/app/store/consent/*.ts` (5 store files - mobile features)

Phase 2 (Authorization):
- `src/app/guards/*.ts` (3 guard files)
- `src/app/services/permission.service.ts`
- `src/app/services/tenant-context.service.ts`

Phase 3a (Audit UI):
- `src/app/components/audit-logs/` (4 components)
- `src/app/services/audit-log.service.ts`
- `src/app/services/audit-report.service.ts`

**Estimated Total Duration:** 25-35 hours
- Phase 1: 4-6 hours
- Phase 2: 6-8 hours  
- Phase 3a: 10-12 hours
- Phase 3b: Skip (mobile app)
- Phase 3c: 2-3 hours
- Testing & Documentation: 3-5 hours

**Critical Success Factors:**
1. Follow existing component/service/store patterns exactly
2. Use OnPush change detection everywhere
3. Implement proper error handling and loading states
4. Write unit tests for all services
5. Respect multi-tenancy (don't filter - backend does it)
6. Keep patient consent UI out of web app (mobile only)
7. Use reactive forms for all user input
8. Maintain TypeScript strict mode

**Ready to Share with Copilot:** ✅
Copy this entire document to your Angular project chat and Copilot will have complete context to implement all phases efficiently.

---

**Last Updated:** 2026-01-12  
**Backend Ready:** Yes ✅  
**Frontend Ready:** Yes ✅  
**Mobile Ready:** APIs ready, app pending
