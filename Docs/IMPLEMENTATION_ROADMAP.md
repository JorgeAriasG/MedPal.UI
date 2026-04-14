# Medical Scheduling App - Implementation Roadmap & Action Plan

**Last Updated:** 2026-02-11  
**Current Status:** 65% Complete  
**Estimated Time to Completion:** 48-60 hours

---

## 📋 QUICK REFERENCE - What to Build Next

### 🔴 CRITICAL PATH (Start Here)

#### Week 1: Audit Log Foundation (22 hours)

**1.1 Audit Log Service** (8 hours)
```typescript
// File: src/app/services/audit-log.service.ts
// Endpoint: GET /api/audit-logs

Required Methods:
- getAccessLogs(filter: AuditLogFilter): Observable<PagedResult<IMedicalRecordAccessLog>>
- getAccessLogById(id: number): Observable<IMedicalRecordAccessLog>
- generateReport(params: ReportParams): Observable<AuditReport>
- exportLogs(filter: AuditLogFilter): Observable<Blob>

Reference Pattern:
  → Look at: src/app/components/patients/services/patients.service.ts
  → Copy the HTTP pattern, adapt for audit endpoint
```

**1.2 Audit NgRx Store** (6 hours)
```typescript
// Files in: src/app/store/audit/

Files to Implement:
- audit.state.ts         (State interface + initial state)
- audit.actions.ts       (Action creators)
- audit.reducer.ts       (State mutations)
- audit.effects.ts       (HTTP side effects)
- audit.selectors.ts     (Memoized state selectors)

Required State:
  audit: {
    logs: IMedicalRecordAccessLog[]
    filter: AuditLogFilter
    loading: boolean
    error: string | null
    pagination: PaginationInfo
  }

Reference Pattern:
  → Look at: src/app/store/auth/
  → Same structure, adapted for audit logs
```

**1.3 Audit Components - Container** (4 hours)
```typescript
// File: src/app/components/audit-logs/audit-logs-page/audit-logs-page.component.ts

Smart Component:
- Dispatch load action on init
- Select logs$ from store
- Handle filter changes
- Pagination controls
- Skeleton/loading state

Template:
- Sort/search header
- Filter sidebar
- Table with logs
- Pagination controls
- Detail modal trigger
```

**1.4 Audit Components - UI** (4 hours)
```typescript
// Files:
- src/app/components/audit-logs/audit-log-filters/
- src/app/components/audit-logs/audit-log-table/

Filters Component:
- Reactive form with date ranges
- User selector
- Clinic selector
- Consent status filter
- Reset button

Table Component:
- Display access records
- Sortable columns
- Click to detail
- Highlight consent status
```

---

### 🟠 HIGH PRIORITY (Week 1-2)

#### 2.1 Complete Route Guards (4 hours)
```typescript
// Files to Complete:

src/app/guards/audit-access.guard.ts
  → Check: permission='ViewAuditLogs', clinic context match

src/app/guards/audit-admin.guard.ts
  → Check: role='Admin' or 'AccountAdmin'

src/app/guards/consent-access.guard.ts
  → Check: consent management permissions

Reference:
  → Look at: src/app/guards/auth.guard.ts
  → Follow same pattern with permission.service checks
```

**Checklist:**
- [ ] `audit-access.guard.ts` - 2 hours
- [ ] `audit-admin.guard.ts` - 1 hour
- [ ] `consent-access.guard.ts` - 1 hour

#### 2.2 User Service Enhancement (3 hours)
```typescript
// File: src/app/components/user/services/user.service.ts
// Add these methods:

getMe(): Observable<IUser> {
  return this.apiService.get<IUser>('users/me');
}

getRoleById(roleId: number): Observable<IRole> {
  return this.apiService.get<IRole>(`roles/${roleId}`);
}

assignRole(userId: number, roleId: number): Observable<IUser> {
  return this.apiService.put<IUser>(`users/${userId}/role`, { roleId });
}

getByRole(role: string): Observable<IUser[]> {
  return this.apiService.get<IUser[]>(`users?role=${role}`);
}
```

#### 2.3 Dashboard Widgets (5 hours)
```typescript
// File: src/app/components/home/home.component.ts
// Add these sections:

Components to Create:
- StatisticsCardComponent (appointments today, patients, etc.)
- RecentActivityComponent (latest appointments, new patients)
- QuickStatsComponent (wait times, clinic load)
- ClinicContextComponent (current clinic display)

Use Store:
- Select auth clinic from store
- Filter data by current clinic
- Unsubscribe with takeUntil(destroy$)
```

**Checklist:**
- [ ] Stats card component (2 hours)
- [ ] Recent activity (2 hours)
- [ ] Quick stats display (1 hour)

---

### 🟡 MEDIUM PRIORITY (Week 2-3)

#### 3.1 Calendar Component (6 hours)
```typescript
// File: src/app/components/calendar/
// Create full calendar view

Component:
- Uses calendar-utils library (already installed)
- Display appointments as events
- Color-code by status
- Click to detail modal
- Create appointment from date

Template:
- Calendar grid
- Event display
- Date navigation
- Today button
```

**Reference:**
- Appointment component already converts to CalendarEvent
- See: `src/app/components/appointments/appointment/appointment.component.ts`

#### 3.2 Prescription Management (8 hours)
```typescript
// New Components:

src/app/components/prescriptions/prescription-list/
  → List all prescriptions
  → Search/filter by patient
  → Filter by status
  → Pagination

src/app/components/prescriptions/prescription-validate/
  → Scan/enter unique code
  → Display prescription details
  → Show medication info

src/app/components/prescriptions/prescription-detail/
  → Already exists, enhance with:
  → QR code display
  → Status tracking
  → Refill options

Service Enhancement:
  → Add pagination support
  → Add search/filter methods
  → Add status update methods
```

#### 3.3 Medical History Enhancements (4 hours)
```typescript
// Current: Form-based entry

Add:
- List view component (show past entries)
- Edit capability (update existing entries)
- Timeline improvements (date-sorted display)
- Allergy section (separate display)
- Condition tracking (searchable)

Service Enhancement:
  → Add update() method
  → Add delete() method  
  → Add search() method
  → Add getById() method
```

---

### 🟢 LOW PRIORITY (Week 3-4)

#### 4.1 Store Migration (12 hours)
> **Optional:** Only if performance issues with large datasets

Move to NgRx:
- Appointments → `store/appointments/`
- Patients → `store/patients/`
- Clinics → `store/clinics/`
- Prescriptions → `store/prescriptions/`

Benefits:
- Caching between navigations
- Better filtering/searching
- Unified state management
- Easier testing

#### 4.2 Advanced Features (10 hours)

Optional:
- Prescription refill workflow
- QR code generation
- PDF export for prescriptions
- CSV export for audit logs
- Advanced analytics dashboard
- Search across features
- Notification system (WebSocket)

---

## 🎯 DAILY CHECKLIST - First 5 Days

### Day 1: Project Setup & Planning (2 hours)
- [ ] Read full [PROJECT_ANALYSIS_REPORT.md](./PROJECT_ANALYSIS_REPORT.md)
- [ ] Review [ANGULAR_PROJECT_CONTEXT.md](./Docs/ANGULAR_PROJECT_CONTEXT.md)
- [ ] Run `npm start` and verify app loads
- [ ] Review existing patterns in `/components/` and `/services/`
- [ ] Check network tab in DevTools - verify API calls work

### Day 2: Audit Service Implementation (8 hours)

**2a. Audit Log Service** (4 hours)
```bash
# Strategy: Copy from existing service, adapt
# Reference: src/app/components/patients/services/patients.service.ts
```

Steps:
1. Create `src/app/services/audit-log.service.ts`
2. Implement `getAccessLogs()` with filtering
3. Implement `getAccessLogById()`
4. Implement `generateReport()`
5. Implement `exportLogs()`
6. Write unit tests
7. Test API calls in browser Network tab

**2b. Service Tests** (2 hours)
```bash
# Create: src/app/services/audit-log.service.spec.ts
# Test all methods with mock HttpClient
```

**2c. Audit State File** (2 hours)
```bash
# Create: src/app/store/audit/audit.state.ts
# Define TypeScript interfaces for state
```

### Day 3: Audit Store Implementation (8 hours)

**3a. Actions, Reducer, Selectors** (4 hours)
```bash
# Files to complete:
# - src/app/store/audit/audit.actions.ts
# - src/app/store/audit/audit.reducer.ts
# - src/app/store/audit/audit.selectors.ts
```

**3b. Effects** (2 hours)
```bash
# File: src/app/store/audit/audit.effects.ts
# Wire HTTP calls to store actions
```

**3c. Store Integration** (2 hours)
```bash
# Register store in: src/app/app.module.ts or app.config.ts
# Import StoreModule.forFeature('audit', auditReducer)
# Import EffectsModule.forFeature([AuditEffects])
```

### Day 4: Audit Components (8 hours)

**4a. Container Component** (2 hours)
```bash
# File: src/app/components/audit-logs/audit-logs-page/
# Smart component that dispatches store actions
```

**4b. Filters Component** (2 hours)
```bash
# File: src/app/components/audit-logs/audit-log-filters/
# Reactive form with date ranges, user selector, etc.
```

**4c. Table Component** (2 hours)
```bash
# File: src/app/components/audit-logs/audit-log-table/
# Display paginated table with sortable columns
```

**4d. Router Setup** (2 hours)
```bash
# Add to: src/app/app-routing.module.ts
# Route: /admin/audit-logs → AuditLogsPageComponent
# Guard: [AuditAccessGuard]
```

### Day 5: Testing & Guards (8 hours)

**5a. Component Tests** (3 hours)
```bash
# Add test files:
# - audit-logs-page.spec.ts (with store mock)
# - audit-log-filters.spec.ts (form testing)
# - audit-log-table.spec.ts (data display)
```

**5b. Guard Implementation** (3 hours)
```bash
# Implement:
# - src/app/guards/audit-access.guard.ts
# - src/app/guards/audit-admin.guard.ts
# - src/app/guards/consent-access.guard.ts

# Check: permission.service.hasPermission()
```

**5c. Integration Testing** (2 hours)
```bash
# Test full flow:
# 1. Login → Redirect to login if not authenticated
# 2. Navigate to /admin/audit-logs
# 3. See permission denied if no ViewAuditLogs permission
# 4. See audit logs if authorized
# 5. Filter and see results update
# 6. Click log entry → See detail modal
```

---

## 📊 IMPLEMENTATION TEMPLATES

### Template 1: Service Implementation
```typescript
// Location: src/app/services/[feature].service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class [Feature]Service {
  private endpoint = '[feature]';

  constructor(private apiService: ApiService) {}

  getAll(params?: any): Observable<[IModel][]> {
    return this.apiService.get<[IModel][]>(this.endpoint, params);
  }

  getById(id: number): Observable<[IModel]> {
    return this.apiService.get<[IModel]>(`${this.endpoint}/${id}`);
  }

  create(data: [IModel]): Observable<[IModel]> {
    return this.apiService.post<[IModel]>(this.endpoint, data);
  }

  update(id: number, data: Partial<[IModel]>): Observable<[IModel]> {
    return this.apiService.put<[IModel]>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

### Template 2: Smart Component
```typescript
// Location: src/app/components/[feature]/[feature].component.ts

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select[Feature]Logs, select[Feature]Loading } from '../../store/selectors/[feature].selectors';
import { load[Feature]s } from '../../store/actions/[feature].actions';

@Component({
  selector: 'app-[feature]',
  templateUrl: './[feature].component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Feature]Component implements OnInit, OnDestroy {
  data$: Observable<any[]>;
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.data$ = this.store.select(select[Feature]Logs);
    this.loading$ = this.store.select(select[Feature]Loading);
    this.store.dispatch(load[Feature]s());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Template 3: NgRx Store
```typescript
// State: src/app/store/[feature]/[feature].state.ts
export interface [Feature]State {
  items: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: [Feature]State = {
  items: [],
  loading: false,
  error: null
};

// Actions: src/app/store/[feature]/[feature].actions.ts
export const load[Feature]s = createAction(
  '[Feature] Load Items'
);

export const load[Feature]sSuccess = createAction(
  '[Feature] Load Items Success',
  props<{ items: any[] }>()
);

// Reducer: src/app/store/[feature]/[feature].reducer.ts
export const [feature]Reducer = createReducer(
  initialState,
  on(load[Feature]s, (state) => ({ ...state, loading: true })),
  on(load[Feature]sSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  }))
);

// Effects: src/app/store/[feature]/[feature].effects.ts
@Effect()
load[Feature]$ = this.actions$.pipe(
  ofType(load[Feature]s),
  switchMap(() =>
    this.service.getAll().pipe(
      map((items) => load[Feature]sSuccess({ items })),
      catchError((error) => of(load[Feature]sFailure({ error: error.message })))
    )
  )
);

// Selectors: src/app/store/[feature]/[feature].selectors.ts
export const select[Feature]State = (state: AppState) => state.[feature];

export const select[Feature]s = createSelector(
  select[Feature]State,
  (state: [Feature]State) => state.items
);
```

### Template 4: Form with Reactive Forms
```typescript
// Component with form

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class [Feature]FormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      field1: ['', [Validators.required]],
      field2: ['', [Validators.required, Validators.email]],
      field3: ['', [Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Handle form submission
      const data = this.form.value;
      this.service.create(data).subscribe(
        (result) => console.log('Success', result),
        (error) => console.error('Error', error)
      );
    }
  }
}
```

---

## 🧪 TESTING STRATEGY

### Unit Tests
```bash
# Run: npm test

# Test structure:
src/app/services/*.spec.ts           # Service logic
src/app/store/**/*.spec.ts           # Reducer, actions, selectors
src/app/components/**/*.spec.ts      # Component logic
src/app/guards/*.spec.ts             # Guard logic
```

### Coverage Goals
- Services: 85%+ (critical paths)
- Reducers: 95%+ (state changes)
- Selectors: 80%+
- Components: 70%+ (happy path + errors)

### Integration Testing
```bash
# Scenarios to test:
1. User logs in → Sees dashboard
2. Navigate to audit logs → Sees permission denied if no access
3. User with permission → Sees audit logs list
4. Filter audit logs → Results update
5. Click log entry → Detail modal opens
6. Create new item → Store updates, API called
```

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All critical components complete
- [ ] 85%+ unit test coverage
- [ ] No console errors in DevTools
- [ ] API calls verified in Network tab
- [ ] Authorization checks working
- [ ] Error handling for API failures
- [ ] Loading states for all async operations
- [ ] Mobile responsive (test on 320px, 768px, 1920px)
- [ ] Accessibility check (Lighthouse)
- [ ] TypeScript strict mode: 0 errors
- [ ] No memory leaks (unsubscribe patterns verified)
- [ ] Performance: LCP < 2.5s, FID < 100ms

---

## 📞 COMMON ISSUES & SOLUTIONS

### Issue: Store selector returns undefined
**Solution:** Ensure feature is registered in app.module.ts:
```typescript
StoreModule.forFeature('audit', auditReducer)
```

### Issue: Component doesn't update when state changes
**Solution:** Add `OnPush` change detection and use Observable pipes:
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
data$ = this.store.select(selectData); // Template: {{ data$ | async }}
```

### Issue: Memory leak - unsubscribe warning
**Solution:** Use takeUntil pattern:
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.observable.pipe(takeUntil(this.destroy$)).subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Issue: API calls not being made
**Solutions:**
1. Check Network tab in DevTools
2. Verify base URL in api.service.ts (`http://localhost:5126/api/`)
3. Check that token interceptor is working
4. Verify CORS headers from backend
5. Check Authorization header is present

### Issue: Guard not protecting route
**Solution:** Ensure guard is registered in routing module:
```typescript
{
  path: 'audit-logs',
  component: AuditLogsComponent,
  canActivate: [AuditAccessGuard]
}
```

---

## 📚 KEY REFERENCES

**Files to Study:**
1. `src/app/components/patients/` - Complete CRUD example
2. `src/app/store/auth/` - Complete store example
3. `src/app/guards/auth.guard.ts` - Guard pattern
4. `src/app/interceptors/authInterceptor.ts` - Interceptor pattern
5. `src/app/conf/form-config.ts` - Form configuration pattern

**Documentation Files:**
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI colors, spacing, fonts
- [IMPLEMENTATION_STANDARDS.md](./IMPLEMENTATION_STANDARDS.md) - Code standards
- [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) - Component examples
- [copilot-instructions.md](./.github/copilot-instructions.md) - AI assistant guide

---

## ✅ SUCCESS CRITERIA

### Phase Complete When:
- ✅ All critical services have HTTP methods implemented
- ✅ NgRx store is connected to components
- ✅ Guards prevent unauthorized access
- ✅ Components display data from store
- ✅ Tests cover 80%+ of code
- ✅ No console errors
- ✅ All API calls verified
- ✅ Loading/error states visible

---

**Next Step:** Start with Day 1 planning and Audit Service implementation.  
**Questions?** Check [PROJECT_ANALYSIS_REPORT.md](./PROJECT_ANALYSIS_REPORT.md) for details.
