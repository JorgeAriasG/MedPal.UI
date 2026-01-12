/**
 * Audit Logs Page Component
 * Smart (container) component for audit log management
 *
 * Responsibilities:
 * - Load audit logs on component init
 * - Handle filter changes from filter component
 * - Handle pagination changes from table component
 * - Display loading and error states
 * - Dispatch actions to audit store
 */

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  IMedicalRecordAccessLog,
  AuditLogFilter,
} from '../../../entities';
import * as AuditActions from '../../../store/audit/audit.actions';
import {
  selectAuditLogs,
  selectAuditPagination,
  selectAuditFilter,
  selectAuditLoading,
  selectAuditError,
} from '../../../store/audit/audit.selectors';
import { AuditLogFiltersComponent } from '../audit-log-filters/audit-log-filters.component';
import { AuditLogTableComponent } from '../audit-log-table/audit-log-table.component';

/**
 * Audit Logs Page Component
 * Container component for audit log management UI
 */
@Component({
  selector: 'app-audit-logs-page',
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    AuditLogFiltersComponent,
    AuditLogTableComponent,
  ],
})
export class AuditLogsPageComponent implements OnInit, OnDestroy {
  /**
   * Observable streams from store
   */
  logs$: Observable<IMedicalRecordAccessLog[]>;
  pagination$: Observable<any>;
  currentFilter$: Observable<AuditLogFilter | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  /**
   * For cleanup on destroy
   */
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    // Select observables from store
    this.logs$ = this.store.select(selectAuditLogs);
    this.pagination$ = this.store.select(selectAuditPagination);
    this.currentFilter$ = this.store.select(selectAuditFilter);
    this.loading$ = this.store.select(selectAuditLoading);
    this.error$ = this.store.select(selectAuditError);
  }

  /**
   * Component lifecycle: Initialize
   * Load initial audit logs on component creation
   */
  ngOnInit(): void {
    // Load default audit logs (first page, no filters)
    this.store.dispatch(
      AuditActions.loadAuditLogs({
        filter: {
          page: 1,
          pageSize: 25,
        },
      })
    );
  }

  /**
   * Component lifecycle: Destroy
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle filter change event from filter component
   * Resets to page 1 and loads logs with new filter
   *
   * @param filter New filter criteria from user input
   */
  onFilterApply(filter: AuditLogFilter): void {
    // Reset to page 1 when filtering
    const filterWithPagination: AuditLogFilter = {
      ...filter,
      page: 1,
      pageSize: 25,
    };

    this.store.dispatch(
      AuditActions.loadAuditLogs({
        filter: filterWithPagination,
      })
    );
  }

  /**
   * Handle filter reset event from filter component
   * Clears all filters and loads default audit logs
   */
  onFilterReset(): void {
    this.store.dispatch(AuditActions.setAuditFilter({ filter: undefined as any }));
    this.store.dispatch(
      AuditActions.loadAuditLogs({
        filter: {
          page: 1,
          pageSize: 25,
        },
      })
    );
  }

  /**
   * Handle pagination change event from table component
   * Loads logs for requested page
   *
   * @param page New page number (1-indexed)
   */
  onPageChange(page: number): void {
    this.currentFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentFilter) => {
        const filterWithPage: AuditLogFilter = {
          ...currentFilter,
          page,
          pageSize: 25,
        };

        this.store.dispatch(
          AuditActions.loadAuditLogs({
            filter: filterWithPage,
          })
        );
      });
  }

  /**
   * Handle row selection/detail view (optional)
   * Loads full detail for selected audit log
   *
   * @param log Selected audit log
   */
  onRowSelect(log: IMedicalRecordAccessLog): void {
    this.store.dispatch(
      AuditActions.selectAuditLog({ log })
    );
    // In Phase 3b, open detail modal here
    // this.matDialog.open(AuditLogDetailComponent, { data: log });
  }

  /**
   * Close error message and clear error state
   */
  closeError(): void {
    // Error state is automatically cleared on next successful load
  }
}
