/**
 * Audit Store Effects
 * Handles side effects for audit operations (API calls, etc.)
 *
 * Implements effects for:
 * - Loading audit logs with filters and pagination
 * - Loading single audit log details
 * - Generating audit reports
 * - Exporting audit logs
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AuditActions from './audit.actions';
import { AuditLogService } from '../../services/audit-log.service';
import { selectAuditFilter } from './audit.selectors';

/**
 * Audit Effects
 * Manages side effects for audit store actions
 */
@Injectable()
export class AuditEffects {
  /**
   * Load Audit Logs Effect
   * Triggered by loadAuditLogs action
   * Calls AuditLogService to fetch logs with current filter and pagination
   */
  loadAuditLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditActions.loadAuditLogs),
      switchMap(({ filter }) =>
        this.auditLogService.getAccessLogs(filter).pipe(
          map((result) =>
            AuditActions.loadAuditLogsSuccess({
              logs: result.data,
              pagination: result.pagination,
            })
          ),
          catchError((error) =>
            of(
              AuditActions.loadAuditLogsFailure({
                error: error.message || 'Failed to load audit logs',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Load Audit Log Detail Effect
   * Triggered by loadAuditLogDetail action
   * Fetches details for a specific audit log
   */
  loadAuditLogDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditActions.loadAuditLogDetail),
      switchMap((action) =>
        this.auditLogService.getAccessLogDetail(action.id).pipe(
          map((log) =>
            AuditActions.loadAuditLogDetailSuccess({ log })
          ),
          catchError((error) =>
            of(
              AuditActions.loadAuditLogDetailFailure({
                error: error.message || 'Failed to load audit log detail',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Generate Audit Report Effect
   * Triggered by generateAuditReport action
   * Calls service to generate comprehensive audit report
   */
  generateAuditReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditActions.generateAuditReport),
      switchMap(({ filter }) =>
        this.auditLogService.generateReport(filter).pipe(
          map((report) =>
            AuditActions.generateAuditReportSuccess({ report })
          ),
          catchError((error) =>
            of(
              AuditActions.generateAuditReportFailure({
                error: error.message || 'Failed to generate audit report',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Export Audit Logs Effect
   * Triggered by exportAuditLogs action
   * Exports logs as file and triggers download
   */
  exportAuditLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditActions.exportAuditLogs),
      switchMap((action) =>
        this.auditLogService.exportLogs(action.filter).pipe(
          tap((blob) => {
            // Trigger file download
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `audit-logs-${timestamp}.csv`;
            this.auditLogService.downloadFile(blob, filename);
          }),
          map((blob) => AuditActions.exportAuditLogsSuccess({ blob })),
          catchError((error) =>
            of(
              AuditActions.exportAuditLogsFailure({
                error: error.message || 'Failed to export audit logs',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Debug effect for development
   * Logs successful operations to console
   */
  auditLogsLoaded$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuditActions.loadAuditLogsSuccess),
        tap((action) =>
          console.debug('[Audit Effect] Logs loaded:', action.logs.length)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private auditLogService: AuditLogService,
    private store: Store
  ) {}
}
