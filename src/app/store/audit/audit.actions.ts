/**
 * Audit Store Actions
 * Actions for managing audit log state
 */

import { createAction, props } from '@ngrx/store';
import { IMedicalRecordAccessLog, AuditLogFilter, AuditReport } from '../../entities';

// Load Audit Logs
export const loadAuditLogs = createAction(
  '[Audit] Load Audit Logs',
  props<{ filter: AuditLogFilter }>()
);

export const loadAuditLogsSuccess = createAction(
  '[Audit] Load Audit Logs Success',
  props<{
    logs: IMedicalRecordAccessLog[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }>()
);

export const loadAuditLogsFailure = createAction(
  '[Audit] Load Audit Logs Failure',
  props<{ error: string }>()
);

// Set Audit Filter
export const setAuditFilter = createAction(
  '[Audit] Set Audit Filter',
  props<{ filter: AuditLogFilter }>()
);

// Select Audit Log Detail
export const selectAuditLog = createAction(
  '[Audit] Select Audit Log',
  props<{ log: IMedicalRecordAccessLog }>()
);

export const clearSelectedAuditLog = createAction(
  '[Audit] Clear Selected Audit Log'
);

// Load Single Audit Log Detail
export const loadAuditLogDetail = createAction(
  '[Audit] Load Audit Log Detail',
  props<{ id: number }>()
);

export const loadAuditLogDetailSuccess = createAction(
  '[Audit] Load Audit Log Detail Success',
  props<{ log: IMedicalRecordAccessLog }>()
);

export const loadAuditLogDetailFailure = createAction(
  '[Audit] Load Audit Log Detail Failure',
  props<{ error: string }>()
);

// Generate Report
export const generateAuditReport = createAction(
  '[Audit] Generate Report',
  props<{ filter: AuditLogFilter }>()
);

export const generateAuditReportSuccess = createAction(
  '[Audit] Generate Report Success',
  props<{ report: AuditReport }>()
);

export const generateAuditReportFailure = createAction(
  '[Audit] Generate Report Failure',
  props<{ error: string }>()
);

// Export Logs
export const exportAuditLogs = createAction(
  '[Audit] Export Audit Logs',
  props<{ filter: AuditLogFilter }>()
);

export const exportAuditLogsSuccess = createAction(
  '[Audit] Export Audit Logs Success',
  props<{ blob: Blob }>()
);

export const exportAuditLogsFailure = createAction(
  '[Audit] Export Audit Logs Failure',
  props<{ error: string }>()
);

// Reset Audit State
export const resetAuditState = createAction(
  '[Audit] Reset Audit State'
);
