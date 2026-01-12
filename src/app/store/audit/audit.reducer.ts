/**
 * Audit Store Reducer
 * Handles state mutations for audit store
 */

import { createReducer, on } from '@ngrx/store';
import { AuditState, initialAuditState } from './audit.state';
import * as AuditActions from './audit.actions';

export const auditReducer = createReducer(
  initialAuditState,

  // Load Audit Logs
  on(AuditActions.loadAuditLogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuditActions.loadAuditLogsSuccess, (state, { logs, pagination }) => ({
    ...state,
    logs,
    pagination,
    loading: false,
    error: null,
  })),

  on(AuditActions.loadAuditLogsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Set Audit Filter
  on(AuditActions.setAuditFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter, page: 1 }, // Reset to page 1 when filter changes
    loading: true,
    error: null,
  })),

  // Select Audit Log
  on(AuditActions.selectAuditLog, (state, { log }) => ({
    ...state,
    selectedLog: log,
  })),

  on(AuditActions.clearSelectedAuditLog, (state) => ({
    ...state,
    selectedLog: null,
  })),

  // Load Audit Log Detail
  on(AuditActions.loadAuditLogDetail, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuditActions.loadAuditLogDetailSuccess, (state, { log }) => ({
    ...state,
    selectedLog: log,
    loading: false,
    error: null,
  })),

  on(AuditActions.loadAuditLogDetailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Generate Report
  on(AuditActions.generateAuditReport, (state) => ({
    ...state,
    reportLoading: true,
    reportError: null,
  })),

  on(AuditActions.generateAuditReportSuccess, (state) => ({
    ...state,
    reportLoading: false,
    reportError: null,
  })),

  on(AuditActions.generateAuditReportFailure, (state, { error }) => ({
    ...state,
    reportError: error,
    reportLoading: false,
  })),

  // Export Logs
  on(AuditActions.exportAuditLogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuditActions.exportAuditLogsSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(AuditActions.exportAuditLogsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Reset State
  on(AuditActions.resetAuditState, () => initialAuditState)
);
