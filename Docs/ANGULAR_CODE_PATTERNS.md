# Angular Code Patterns & Examples

This document provides specific code examples following the project's existing patterns.

## 1. Entity/Interface Pattern

### Example: Medical Record Access Log Interface
```typescript
// src/app/entities/IMedicalRecordAccessLog.ts
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

// Filter DTO
export interface AuditLogFilter {
  dateFrom?: Date;
  dateTo?: Date;
  userId?: number;
  clinicId?: number;
  patientId?: number;
  hasConsent?: boolean;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

// Report DTO
export interface AuditReport {
  totalAccesses: number;
  accessesByUser: AccessByUserReport[];
  accessesByClinic: AccessByClinicReport[];
  accessesByDate: AccessByDateReport[];
  consentViolations: number;
  generatedAt: Date;
}
```

### Example: Patient Consent Interface (Mobile)
```typescript
// src/app/entities/IPatientConsent.ts
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

## 2. Service Pattern

### Example: Audit Log Service
```typescript
// src/app/services/audit-log.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IMedicalRecordAccessLog, AuditLogFilter, AuditReport } from '../entities';

export interface PagedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly apiUrl = '/api/audit-logs';

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of access logs
   */
  getAccessLogs(filter?: AuditLogFilter): Observable<PagedResult<IMedicalRecordAccessLog>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom.toISOString());
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo.toISOString());
      if (filter.userId) params = params.set('userId', filter.userId.toString());
      if (filter.clinicId) params = params.set('clinicId', filter.clinicId.toString());
      if (filter.hasConsent !== undefined) params = params.set('hasConsent', filter.hasConsent.toString());
      if (filter.searchTerm) params = params.set('search', filter.searchTerm);
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<PagedResult<IMedicalRecordAccessLog>>(this.apiUrl, { params }).pipe(
      tap(result => console.debug('Audit logs loaded:', result)),
      catchError(err => this.handleError('Failed to load audit logs', err))
    );
  }

  /**
   * Get single access log detail
   */
  getAccessLogDetail(id: number): Observable<IMedicalRecordAccessLog> {
    return this.http.get<IMedicalRecordAccessLog>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.handleError('Failed to load log detail', err))
    );
  }

  /**
   * Generate audit report
   */
  generateReport(filter: AuditLogFilter): Observable<AuditReport> {
    return this.http.post<AuditReport>(`${this.apiUrl}/report`, filter).pipe(
      tap(report => console.debug('Report generated:', report)),
      catchError(err => this.handleError('Failed to generate report', err))
    );
  }

  /**
   * Export logs as CSV
   */
  exportLogs(filter: AuditLogFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, filter, {
      responseType: 'blob',
      headers: { 'Accept': 'text/csv' }
    }).pipe(
      catchError(err => this.handleError('Failed to export logs', err))
    );
  }

  private handleError(message: string, error: any): Observable<never> {
    console.error(`${message}:`, error);
    throw new Error(`${message}: ${error.message}`);
  }
}
```

## 3. NgRx Store Pattern

### Example: Audit Log Store

```typescript
// src/app/store/audit/audit.state.ts
import { IMedicalRecordAccessLog } from '../../entities';

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AuditFilter {
  dateFrom?: Date;
  dateTo?: Date;
  userId?: number;
  clinicId?: number;
  hasConsent?: boolean;
}

export interface AuditState {
  logs: IMedicalRecordAccessLog[];
  loading: boolean;
  error: string | null;
  filter: AuditFilter;
  pagination: PaginationInfo;
  selectedLog: IMedicalRecordAccessLog | null;
}

export const initialAuditState: AuditState = {
  logs: [],
  loading: false,
  error: null,
  filter: {},
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  },
  selectedLog: null
};
```

```typescript
// src/app/store/audit/audit.actions.ts
import { createAction, props } from '@ngrx/store';
import { IMedicalRecordAccessLog, AuditLogFilter } from '../../entities';
import { PaginationInfo } from './audit.state';

// Load Logs
export const loadAuditLogs = createAction(
  '[Audit Logs] Load',
  props<{ filter?: AuditLogFilter }>()
);

export const loadAuditLogsSuccess = createAction(
  '[Audit Logs] Load Success',
  props<{ 
    logs: IMedicalRecordAccessLog[];
    pagination: PaginationInfo;
  }>()
);

export const loadAuditLogsFailure = createAction(
  '[Audit Logs] Load Failure',
  props<{ error: string }>()
);

// Filter
export const setAuditFilter = createAction(
  '[Audit Logs] Set Filter',
  props<{ filter: AuditLogFilter }>()
);

// Get Detail
export const selectAuditLog = createAction(
  '[Audit Logs] Select Log',
  props<{ id: number }>()
);

export const selectAuditLogSuccess = createAction(
  '[Audit Logs] Select Log Success',
  props<{ log: IMedicalRecordAccessLog }>()
);

// Generate Report
export const generateAuditReport = createAction(
  '[Audit Logs] Generate Report',
  props<{ filter: AuditLogFilter }>()
);

export const generateAuditReportSuccess = createAction(
  '[Audit Logs] Generate Report Success',
  props<{ report: any }>()
);
```

```typescript
// src/app/store/audit/audit.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuditActions from './audit.actions';
import { AuditState, initialAuditState } from './audit.state';

export const auditReducer = createReducer(
  initialAuditState,
  
  // Load Logs
  on(AuditActions.loadAuditLogs, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuditActions.loadAuditLogsSuccess, (state, { logs, pagination }) => ({
    ...state,
    logs,
    pagination,
    loading: false
  })),
  
  on(AuditActions.loadAuditLogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Filter
  on(AuditActions.setAuditFilter, (state, { filter }) => ({
    ...state,
    filter,
    pagination: { ...state.pagination, page: 1 }
  })),
  
  // Select Detail
  on(AuditActions.selectAuditLogSuccess, (state, { log }) => ({
    ...state,
    selectedLog: log
  }))
);
```

```typescript
// src/app/store/audit/audit.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuditState } from './audit.state';

export const selectAuditState = createFeatureSelector<AuditState>('audit');

export const selectAuditLogs = createSelector(
  selectAuditState,
  (state: AuditState) => state.logs
);

export const selectAuditLoading = createSelector(
  selectAuditState,
  (state: AuditState) => state.loading
);

export const selectAuditError = createSelector(
  selectAuditState,
  (state: AuditState) => state.error
);

export const selectAuditFilter = createSelector(
  selectAuditState,
  (state: AuditState) => state.filter
);

export const selectAuditPagination = createSelector(
  selectAuditState,
  (state: AuditState) => state.pagination
);

export const selectSelectedAuditLog = createSelector(
  selectAuditState,
  (state: AuditState) => state.selectedLog
);
```

## 4. Guard Pattern

### Example: Audit Access Guard

```typescript
// src/app/guards/audit-access.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuditAccessGuard implements CanActivate {
  
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const clinicId = route.params['clinicId'];
    
    if (this.permissionService.canViewAuditLogs(clinicId)) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
```

## 5. Component Pattern

### Example: Smart Component (Container)

```typescript
// src/app/components/audit-logs/audit-logs-page/audit-logs-page.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuditActions from '../../../store/audit/audit.actions';
import * as AuditSelectors from '../../../store/audit/audit.selectors';
import { AuditLogFilter } from '../../../entities';

@Component({
  selector: 'app-audit-logs-page',
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogsPageComponent implements OnInit, OnDestroy {
  
  // Observables from store
  auditLogs$ = this.store.select(AuditSelectors.selectAuditLogs);
  loading$ = this.store.select(AuditSelectors.selectAuditLoading);
  error$ = this.store.select(AuditSelectors.selectAuditError);
  pagination$ = this.store.select(AuditSelectors.selectAuditPagination);
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(AuditActions.loadAuditLogs({}));
  }

  onFilterChange(filter: AuditLogFilter): void {
    this.store.dispatch(AuditActions.setAuditFilter({ filter }));
    this.store.dispatch(AuditActions.loadAuditLogs({ filter }));
  }

  onPageChange(page: number): void {
    const filter = { ...this.getCurrentFilter(), page };
    this.store.dispatch(AuditActions.loadAuditLogs({ filter }));
  }

  onExport(): void {
    // Export logic
  }

  private getCurrentFilter(): AuditLogFilter {
    let filter: AuditLogFilter = {};
    this.store.select(AuditSelectors.selectAuditFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(f => filter = f);
    return filter;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Example: Dumb Component (Presentational)

```typescript
// src/app/components/audit-logs/audit-log-filters/audit-log-filters.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditLogFilter } from '../../../entities';

@Component({
  selector: 'app-audit-log-filters',
  templateUrl: './audit-log-filters.component.html',
  styleUrls: ['./audit-log-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogFiltersComponent {
  
  @Input() isLoading = false;
  @Output() filterApply = new EventEmitter<AuditLogFilter>();
  @Output() filterReset = new EventEmitter<void>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      userId: [''],
      clinicId: [''],
      hasConsent: [''],
      searchTerm: ['']
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      const filter = this.filterForm.value as AuditLogFilter;
      this.filterApply.emit(filter);
    }
  }

  onReset(): void {
    this.filterForm.reset();
    this.filterReset.emit();
  }
}
```

## 6. HTTP Interceptor Pattern

### Example: Audit Logging Interceptor (Optional)

```typescript
// src/app/interceptors/audit-logging.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditLoggingInterceptor implements HttpInterceptor {
  
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // Log request
    console.debug(`[Audit API] ${request.method} ${request.url}`);
    
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            console.debug(`[Audit API] Response ${event.status}`, event.body);
          }
        },
        error => {
          console.error(`[Audit API] Error ${error.status}`, error);
        }
      )
    );
  }
}
```

## 7. Routing Pattern

### Example: Audit Module Routing

```typescript
// src/app/components/audit-logs/audit-logs.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { auditReducer } from '../../store/audit/audit.reducer';
import { AuditAccessGuard } from '../../guards/audit-access.guard';

import { AuditLogsPageComponent } from './audit-logs-page/audit-logs-page.component';
import { AuditLogFiltersComponent } from './audit-log-filters/audit-log-filters.component';
import { AuditLogTableComponent } from './audit-log-table/audit-log-table.component';

const routes: Routes = [
  {
    path: '',
    component: AuditLogsPageComponent,
    canActivate: [AuditAccessGuard],
    data: { title: 'Audit Logs' }
  }
];

@NgModule({
  declarations: [
    AuditLogsPageComponent,
    AuditLogFiltersComponent,
    AuditLogTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('audit', auditReducer)
  ]
})
export class AuditLogsModule { }
```

---

## Key Patterns Summary

1. **Entities:** Simple interfaces, readonly properties, enums for constants
2. **Services:** Single responsibility, HTTP + business logic, error handling
3. **NgRx:** Actions → Reducer → Selectors, Features in separate files
4. **Components:** Smart (container) + Dumb (presentational), OnPush strategy
5. **Guards:** Check permissions, redirect if unauthorized
6. **Forms:** ReactiveFormBuilder, validation in form group
7. **RxJS:** takeUntil for memory management, proper error handling

Use these patterns for all audit/consent feature implementation.
