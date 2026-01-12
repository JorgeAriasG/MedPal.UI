# Angular Implementation Checklist

Follow this checklist to ensure each phase is complete and meets project standards.

## Phase 1: Base Structure & Models

### Entities Created
- [ ] `src/app/entities/IMedicalRecordAccessLog.ts`
  - [ ] Interface with all 11 properties
  - [ ] Proper typing (Date, number, string, boolean)
  - [ ] No `any` types
  
- [ ] `src/app/entities/IPatientConsent.ts` (for mobile reference)
  - [ ] Interface with all 11 properties
  - [ ] ConsentScope enum defined
  - [ ] Marked as "Mobile feature"
  
- [ ] `src/app/entities/IAuditableEntity.ts`
  - [ ] Base interface for audit properties
  - [ ] createdAt, updatedAt, createdBy optional
  
- [ ] `src/app/entities/index.ts`
  - [ ] Exports all new entities
  - [ ] Exports enums

### Store Setup
- [ ] `src/app/store/audit/audit.state.ts`
  - [ ] AuditState interface
  - [ ] PaginationInfo interface
  - [ ] AuditFilter interface
  - [ ] initialAuditState constant
  
- [ ] `src/app/store/audit/audit.actions.ts`
  - [ ] loadAuditLogs action
  - [ ] loadAuditLogsSuccess action
  - [ ] loadAuditLogsFailure action
  - [ ] setAuditFilter action
  - [ ] selectAuditLog action (optional for detail)
  
- [ ] `src/app/store/audit/audit.reducer.ts`
  - [ ] auditReducer created
  - [ ] All handlers implemented
  - [ ] Initial state properly spread
  - [ ] Loading/error states handled
  
- [ ] `src/app/store/audit/audit.selectors.ts`
  - [ ] selectAuditState feature selector
  - [ ] selectAuditLogs selector
  - [ ] selectAuditLoading selector
  - [ ] selectAuditError selector
  - [ ] selectAuditFilter selector
  - [ ] selectAuditPagination selector
  
- [ ] `src/app/store/audit/audit.effects.ts`
  - [ ] Placeholder/empty (ready for Phase 3a)
  - [ ] Properly structured for later population

### Store Registration
- [ ] StoreModule imported with auditReducer in app module/config
- [ ] Store selectors tested manually (Redux DevTools or logging)
- [ ] TypeScript compiles without errors

### Consent Store (Mobile Features)
- [ ] `src/app/store/consent/consent.state.ts`
  - [ ] ConsentState interface
  - [ ] initialConsentState
  - [ ] Marked as "Mobile feature"
  
- [ ] `src/app/store/consent/consent.actions.ts`
  - [ ] Consent-related actions
  - [ ] Marked as "Mobile feature"
  
- [ ] `src/app/store/consent/consent.reducer.ts`
  - [ ] consentReducer created
  - [ ] Marked as "Mobile feature"
  
- [ ] `src/app/store/consent/consent.selectors.ts`
  - [ ] Consent selectors
  - [ ] Marked as "Mobile feature"

### Code Quality - Phase 1
- [ ] All files compile without errors
- [ ] No TypeScript warnings (strict mode)
- [ ] No `any` types used
- [ ] Proper JSDoc comments on interfaces
- [ ] Consistent naming conventions
- [ ] All files follow project style guide

### Testing - Phase 1
- [ ] Unit tests for all selectors
- [ ] Reducer tests for all actions
- [ ] State immutability verified

---

## Phase 2: Control de Acceso (Authorization & Guards)

### Permission Service
- [ ] `src/app/services/permission.service.ts` created
  - [ ] `canViewAuditLogs(clinicId?: number): boolean`
  - [ ] `canManageAuditLogs(): boolean`
  - [ ] `canViewConsent(): boolean`
  - [ ] `canApproveConsent(): boolean`
  - [ ] `canRevokeConsent(): boolean`
  - [ ] Cache permissions from JWT claims
  - [ ] Handle missing claims gracefully
  
- [ ] Permission service extracted claims from token
  - [ ] Get claims from localStorage/sessionStorage
  - [ ] Parse JWT payload
  - [ ] Handle expired tokens

### Tenant Context Service
- [ ] `src/app/services/tenant-context.service.ts` created
  - [ ] `getAccountId(): number | null`
  - [ ] `getClinicId(): number | null`
  - [ ] `getUserId(): number | null`
  - [ ] `getRole(): string | null`
  - [ ] `getAllClinics(): number[] | null`
  - [ ] Extract from JWT claims
  - [ ] Cache current values
  - [ ] Update on token refresh
  
- [ ] Integrated with existing auth service
  - [ ] Updates when user logs in/out
  - [ ] Provides context to other services

### Guards
- [ ] `src/app/guards/audit-access.guard.ts` created
  - [ ] Implements CanActivate
  - [ ] Checks permission via PermissionService
  - [ ] Redirects to unauthorized page if denied
  - [ ] Handles clinicId from route params
  
- [ ] `src/app/guards/audit-admin.guard.ts` created
  - [ ] Requires admin-level permissions
  - [ ] Used for report generation/export
  
- [ ] All guards properly providedIn: 'root'

### HTTP Interceptor (Optional)
- [ ] `src/app/interceptors/audit-context.interceptor.ts`
  - [ ] Adds tenant context headers (optional)
  - [ ] Handles 403 responses (no permission)
  - [ ] Provided in app module

### Code Quality - Phase 2
- [ ] All services inject properly (no circular dependencies)
- [ ] All guards implement required interfaces
- [ ] Error messages user-friendly
- [ ] Proper handling of null/undefined claims
- [ ] TypeScript strict mode compliance

### Testing - Phase 2
- [ ] Unit tests for PermissionService
- [ ] Unit tests for TenantContextService
- [ ] Unit tests for all guards
- [ ] Mock JWT tokens for testing

### Routing Updates
- [ ] Routes protected with AuditAccessGuard
- [ ] Route guards applied consistently
- [ ] Unauthorized route exists and displays message

---

## Phase 3a: Audit Log Management UI

### Components Created

#### Audit Logs Container
- [ ] `src/app/components/audit-logs/audit-logs-page/audit-logs-page.component.ts`
  - [ ] Smart component (container)
  - [ ] Imports audit store/selectors
  - [ ] Loads data on init
  - [ ] Handles filter changes
  - [ ] OnPush change detection
  - [ ] OnDestroy with destroy$ cleanup
  
- [ ] `src/app/components/audit-logs/audit-logs-page/audit-logs-page.component.html`
  - [ ] Displays filters (dumb component)
  - [ ] Displays table (dumb component)
  - [ ] Shows loading spinner
  - [ ] Shows error messages
  - [ ] Uses async pipe for observables
  
- [ ] `src/app/components/audit-logs/audit-logs-page/audit-logs-page.component.scss`
  - [ ] Follows project style guide
  - [ ] Uses SCSS variables from shared styles
  - [ ] No hardcoded colors

#### Audit Filters Component
- [ ] `src/app/components/audit-logs/audit-log-filters/audit-log-filters.component.ts`
  - [ ] Dumb component (presentational)
  - [ ] Reactive form with FormBuilder
  - [ ] Validators for date fields (optional)
  - [ ] @Input isLoading
  - [ ] @Output filterApply
  - [ ] @Output filterReset
  - [ ] OnPush change detection
  
- [ ] `src/app/components/audit-logs/audit-log-filters/audit-log-filters.component.html`
  - [ ] Form controls for each filter
  - [ ] Date pickers for date range
  - [ ] Dropdown for userId/clinicId
  - [ ] Text input for search
  - [ ] Submit and Reset buttons
  - [ ] Disabled state while loading
  
- [ ] Form controls properly bound
  - [ ] formGroupName usage correct
  - [ ] Two-way binding via formControl
  - [ ] Validation messages displayed

#### Audit Log Table
- [ ] `src/app/components/audit-logs/audit-log-table/audit-log-table.component.ts`
  - [ ] Dumb component (presentational)
  - [ ] @Input logs: IMedicalRecordAccessLog[]
  - [ ] @Input loading: boolean
  - [ ] @Input pagination: PaginationInfo
  - [ ] @Output pageChange: EventEmitter
  - [ ] @Output rowSelect: EventEmitter (optional)
  - [ ] OnPush change detection
  
- [ ] `src/app/components/audit-logs/audit-log-table/audit-log-table.component.html`
  - [ ] Table with columns: Date, User, Clinic, Patient, Purpose, HasConsent
  - [ ] Pagination controls
  - [ ] Sorting headers (click to sort)
  - [ ] Click row to view detail (optional)
  - [ ] Empty state message
  - [ ] Loading skeleton (optional)

#### Audit Detail Modal (Optional)
- [ ] `src/app/components/audit-logs/audit-log-detail/audit-log-detail.component.ts`
  - [ ] Modal/Dialog component
  - [ ] @Input log: IMedicalRecordAccessLog
  - [ ] @Output close: EventEmitter
  - [ ] Displays all log properties
  
- [ ] `src/app/components/audit-logs/audit-log-detail/audit-log-detail.component.html`
  - [ ] Shows log details in readable format
  - [ ] IP address, session ID visible
  - [ ] Timestamps formatted properly

#### Reports Component (Optional)
- [ ] `src/app/components/audit-logs/audit-reports/audit-reports.component.ts`
  - [ ] Smart component
  - [ ] Calculates summary stats
  - [ ] Triggers report export
  - [ ] Uses ReportService
  
- [ ] `src/app/components/audit-logs/audit-reports/audit-reports.component.html`
  - [ ] Summary statistics cards
  - [ ] Chart display (optional)
  - [ ] Export button

### Services Created

#### Audit Log Service
- [ ] `src/app/services/audit-log.service.ts` created
  - [ ] getAccessLogs(filter): Observable<PagedResult<IMedicalRecordAccessLog>>
  - [ ] getAccessLogDetail(id): Observable<IMedicalRecordAccessLog>
  - [ ] generateReport(filter): Observable<AuditReport>
  - [ ] exportLogs(filter): Observable<Blob>
  - [ ] Proper error handling
  - [ ] HTTP parameters built correctly
  
- [ ] Service properly injectable
  - [ ] providedIn: 'root'
  - [ ] HttpClient injected
  - [ ] No circular dependencies

#### Report Service (Optional)
- [ ] `src/app/services/audit-report.service.ts` created
  - [ ] generateReport(data): AuditReport
  - [ ] calculateStats(logs): Statistics
  - [ ] formatData for charts
  - [ ] downloadAsCSV(data)

### Store Effects
- [ ] `src/app/store/audit/audit.effects.ts` populated
  - [ ] @Effect() loadAuditLogs$
    - [ ] Dispatches loadAuditLogs action
    - [ ] Calls AuditLogService.getAccessLogs()
    - [ ] Dispatches success/failure action
    - [ ] Proper error handling
  
  - [ ] @Effect() selectAuditLog$
    - [ ] Loads single log detail
    - [ ] Optional implementation
  
  - [ ] @Effect() generateReport$
    - [ ] Calls service to generate
    - [ ] Handles success/failure
    - [ ] Optional implementation

### Module Created
- [ ] `src/app/components/audit-logs/audit-logs.module.ts`
  - [ ] Declares all components
  - [ ] Imports required modules (CommonModule, ReactiveFormsModule, StoreModule, etc.)
  - [ ] Provides services (or providedIn: 'root')
  - [ ] Routes defined (if lazy-loaded)
  - [ ] StoreModule.forFeature('audit', auditReducer) registered

### Routing
- [ ] Route added to main routing module
  - [ ] Path: `/audit-logs` or `/medical-records/audit-logs`
  - [ ] Guard: AuditAccessGuard
  - [ ] Component: AuditLogsPageComponent
  - [ ] Lazy-loaded (optional)
  
- [ ] Navigation menu updated
  - [ ] Audit Logs menu item added
  - [ ] Only shows to authorized users
  - [ ] Uses routerLink

### Styling
- [ ] SCSS files created for each component
  - [ ] No hardcoded colors (use SCSS variables)
  - [ ] Uses project's design system
  - [ ] Responsive design (mobile-friendly)
  - [ ] Accessible (proper contrast, font sizes)
  
- [ ] Material Design components used
  - [ ] Tables, buttons, modals from Material
  - [ ] Form controls properly styled
  - [ ] Consistent with existing components

### Code Quality - Phase 3a
- [ ] All components OnPush change detection
- [ ] All observables use async pipe or takeUntil
- [ ] No memory leaks
- [ ] Error handling in all services
- [ ] Loading states visible
- [ ] Empty states handled
- [ ] TypeScript strict mode compliance
- [ ] No console.log in production code

### Testing - Phase 3a
- [ ] Unit tests for AuditLogService
  - [ ] Mock HttpClient
  - [ ] Test success responses
  - [ ] Test error responses
  - [ ] Test parameter building
  
- [ ] Unit tests for effects
  - [ ] Mock service calls
  - [ ] Test action dispatching
  - [ ] Test success/failure flows
  
- [ ] Component integration tests
  - [ ] Test filter input → action dispatch
  - [ ] Test pagination changes
  - [ ] Test table data display
  - [ ] Test loading states
  
- [ ] E2E tests (optional)
  - [ ] Full workflow: filter → load → display → export
  - [ ] Authorization check
  - [ ] Error handling

---

## Phase 3b: Consent Management (MOBILE - SKIP)

### Verification
- [ ] No patient-facing consent UI in Angular web
- [ ] No patient consent approval forms
- [ ] No consent revocation UI
- [ ] Admin can view consent status (read-only) only in Phase 3a+ if needed
- [ ] All consent modifications left for mobile app

---

## Phase 3c: Integration & Testing

### API Integration
- [ ] All endpoints tested with backend running
  - [ ] GET /api/audit-logs works
  - [ ] Pagination works
  - [ ] Filtering works
  - [ ] Authorization 403 handled
  - [ ] 401 token refresh works
  
- [ ] Error responses handled
  - [ ] 403 → "No permission" message
  - [ ] 422 → Validation errors displayed
  - [ ] 500 → Generic error message
  - [ ] Network errors → Retry option
  
- [ ] Response data properly mapped to interfaces
  - [ ] Date strings parsed to Date objects
  - [ ] Pagination info extracted
  - [ ] No undefined properties

### Performance
- [ ] Table pagination works (no loading all records)
- [ ] Filter does not spam API (debounce if needed)
- [ ] Large datasets handled smoothly
- [ ] Memory usage acceptable (no leaks)
- [ ] Change detection not running excessively

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
- [ ] Form labels proper
- [ ] Focus management correct
- [ ] ARIA attributes where needed

### Cross-Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (if applicable)
- [ ] Works in Edge

### Documentation
- [ ] Component README created
- [ ] Service JSDoc comments
- [ ] Usage examples provided
- [ ] API integration documented
- [ ] Redux DevTools showing correct state

---

## Pre-Deployment Checklist

### Build & Compilation
- [ ] `ng build` completes without errors
- [ ] `ng build --prod` succeeds
- [ ] No TypeScript compilation errors
- [ ] No linting errors (eslint/tslint)
- [ ] No console errors in DevTools

### Security
- [ ] No sensitive data in console logs
- [ ] JWT tokens handled securely
- [ ] XSS protection in place (Angular default)
- [ ] CSRF tokens if needed
- [ ] No hardcoded API keys
- [ ] Environment variables used correctly

### Performance
- [ ] Bundle size reasonable
- [ ] No unused imports
- [ ] Tree-shaking enabled
- [ ] Lazy loading configured
- [ ] Change detection optimized
- [ ] Load time < 3s (reasonable)

### Functionality
- [ ] All features work as specified
- [ ] Edge cases handled
- [ ] Error messages helpful
- [ ] Loading states visible
- [ ] Empty states handled
- [ ] Authorization working

### Code Standards
- [ ] Code review passed
- [ ] Tests > 70% coverage
- [ ] All TypeScript strict checks pass
- [ ] No deprecated API usage
- [ ] Consistent formatting
- [ ] Comments explain "why" not "what"

---

## Sign-Off

**Phase 1 Complete:** __________ Date: __________  
**Phase 2 Complete:** __________ Date: __________  
**Phase 3a Complete:** __________ Date: __________  
**Phase 3c Complete:** __________ Date: __________  
**Ready for Production:** __________ Date: __________  

---

Use this checklist to track progress. Mark items as you complete them.
Each phase should be fully complete before moving to the next.
