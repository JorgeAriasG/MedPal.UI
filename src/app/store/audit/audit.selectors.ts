/**
 * Audit Store Selectors
 * Selectors for accessing audit state
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuditState } from './audit.state';

/**
 * Feature selector for audit state
 */
export const selectAuditState = createFeatureSelector<AuditState>('audit');

/**
 * Select audit logs array
 */
export const selectAuditLogs = createSelector(
  selectAuditState,
  (state: AuditState) => state.logs
);

/**
 * Select audit logs with proper count for empty states
 */
export const selectAuditLogsCount = createSelector(
  selectAuditLogs,
  (logs) => logs.length
);

/**
 * Select pagination info
 */
export const selectAuditPagination = createSelector(
  selectAuditState,
  (state: AuditState) => state.pagination
);

/**
 * Select current filter criteria
 */
export const selectAuditFilter = createSelector(
  selectAuditState,
  (state: AuditState) => state.filter
);

/**
 * Select loading state
 */
export const selectAuditLoading = createSelector(
  selectAuditState,
  (state: AuditState) => state.loading
);

/**
 * Select error message
 */
export const selectAuditError = createSelector(
  selectAuditState,
  (state: AuditState) => state.error
);

/**
 * Select selected log detail
 */
export const selectSelectedAuditLog = createSelector(
  selectAuditState,
  (state: AuditState) => state.selectedLog
);

/**
 * Select report loading state
 */
export const selectAuditReportLoading = createSelector(
  selectAuditState,
  (state: AuditState) => state.reportLoading
);

/**
 * Select report error message
 */
export const selectAuditReportError = createSelector(
  selectAuditState,
  (state: AuditState) => state.reportError
);

/**
 * Select combined loading state (logs or report)
 */
export const selectAuditIsLoading = createSelector(
  selectAuditLoading,
  selectAuditReportLoading,
  (logsLoading, reportLoading) => logsLoading || reportLoading
);
