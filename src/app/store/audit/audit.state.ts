/**
 * Audit Store State
 * Manages state for audit log viewing and filtering
 */

import { IMedicalRecordAccessLog, AuditLogFilter } from '../../entities';

/**
 * Pagination information for paginated results
 */
export interface PaginationInfo {
  /**
   * Current page number (1-indexed)
   */
  page: number;

  /**
   * Items per page
   */
  pageSize: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Total number of pages
   */
  totalPages: number;
}

/**
 * Audit Store State
 * Contains all audit log data and loading/error states
 */
export interface AuditState {
  /**
   * Array of audit log entries for current page
   */
  logs: IMedicalRecordAccessLog[];

  /**
   * Current pagination info
   */
  pagination: PaginationInfo;

  /**
   * Current filter criteria
   */
  filter: AuditLogFilter;

  /**
   * Whether data is currently being loaded
   */
  loading: boolean;

  /**
   * Error message if load failed
   */
  error: string | null;

  /**
   * Selected log detail (optional, for detail view)
   */
  selectedLog: IMedicalRecordAccessLog | null;

  /**
   * Whether report generation is in progress
   */
  reportLoading: boolean;

  /**
   * Error message for report generation
   */
  reportError: string | null;
}

/**
 * Initial state for audit store
 */
export const initialAuditState: AuditState = {
  logs: [],
  pagination: {
    page: 1,
    pageSize: 25,
    totalItems: 0,
    totalPages: 0,
  },
  filter: {
    page: 1,
    pageSize: 25,
  },
  loading: false,
  error: null,
  selectedLog: null,
  reportLoading: false,
  reportError: null,
};
