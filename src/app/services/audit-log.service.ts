/**
 * Audit Log Service
 *
 * Manages audit log operations and medical record access tracking.
 * Provides methods for retrieving, filtering, and reporting on audit logs.
 *
 * Key Features:
 * - Access log retrieval with filtering
 * - Detailed access log retrieval
 * - Report generation
 * - Export functionality
 *
 * @injectable
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IMedicalRecordAccessLog,
  AuditLogFilter,
  AuditReport,
  PagedResult,
} from '../entities';
import { ApiService } from './api.service';

/**
 * Audit Log Service
 * Provides methods for accessing audit logs and generating reports
 */
@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private endpoint = 'audit-logs';

  constructor(private apiService: ApiService) {}

  /**
   * Get paginated audit logs with optional filters
   *
   * @param filter - Filter criteria (dates, user, clinic, consent status, search)
   * @returns Observable of paginated audit access logs
   */
  getAccessLogs(
    filter: AuditLogFilter = {}
  ): Observable<PagedResult<IMedicalRecordAccessLog>> {
    // Build query string from filter object
    const queryParams = this.buildQueryString(filter);
    const url = `${this.endpoint}${queryParams}`;
    return this.apiService.get<PagedResult<IMedicalRecordAccessLog>>(url);
  }

  /**
   * Get a specific audit log entry by ID
   *
   * @param id - The audit log entry ID
   * @returns Observable of a single audit log entry
   */
  getAccessLogById(id: number): Observable<IMedicalRecordAccessLog> {
    return this.apiService.get<IMedicalRecordAccessLog>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Alias for getAccessLogById for backwards compatibility
   *
   * @param logId - The audit log entry ID
   * @returns Observable of audit log detail
   */
  getAccessLogDetail(
    logId: number
  ): Observable<IMedicalRecordAccessLog> {
    return this.getAccessLogById(logId);
  }

  /**
   * Generate audit report based on filter criteria
   *
   * Report includes:
   * - Total access count
   * - Summary by user
   * - Summary by clinic
   * - Summary by date
   * - Consent violation count
   *
   * @param filter - Filter criteria for report generation
   * @returns Observable of audit report
   */
  generateReport(filter: AuditLogFilter = {}): Observable<AuditReport> {
    const queryParams = this.buildQueryString(filter);
    const url = `${this.endpoint}/reports/generate${queryParams}`;
    return this.apiService.get<AuditReport>(url);
  }

  /**
   * Export audit logs as CSV or PDF format
   *
   * @param filter - Filter criteria for export
   * @param format - Export format ('csv' or 'pdf', default: 'csv')
   * @returns Observable of Blob (file data)
   */
  exportLogs(filter: AuditLogFilter = {}, format: string = 'csv'): Observable<Blob> {
    const queryParams = this.buildQueryString(filter);
    const separator = queryParams ? '&' : '?';
    const url = `${this.endpoint}/export${queryParams}${separator}format=${format}`;
    return this.apiService.get<Blob>(url);
  }

  /**
   * Export audit logs to CSV format (convenience method)
   *
   * @param filter - Filter criteria for export
   * @returns Observable of Blob (CSV file)
   */
  exportLogsAsCSV(filter: AuditLogFilter = {}): Observable<Blob> {
    return this.exportLogs(filter, 'csv');
  }

  /**
   * Export audit logs to PDF format (convenience method)
   *
   * @param filter - Filter criteria for export
   * @returns Observable of Blob (PDF file)
   */
  exportLogsAsPDF(filter: AuditLogFilter = {}): Observable<Blob> {
    return this.exportLogs(filter, 'pdf');
  }

  /**
   * Get audit logs filtered by user ID
   *
   * @param userId - The user ID to filter by
   * @param limit - Optional limit on number of results
   * @returns Observable of audit logs for the user
   */
  getLogsByUser(userId: number, limit?: number): Observable<PagedResult<IMedicalRecordAccessLog>> {
    const filter: AuditLogFilter = { userId, pageSize: limit };
    return this.getAccessLogs(filter);
  }

  /**
   * Get audit logs filtered by clinic ID
   *
   * @param clinicId - The clinic ID to filter by
   * @param limit - Optional limit on number of results
   * @returns Observable of audit logs for the clinic
   */
  getLogsByClinic(clinicId: number, limit?: number): Observable<PagedResult<IMedicalRecordAccessLog>> {
    const filter: AuditLogFilter = { clinicId, pageSize: limit };
    return this.getAccessLogs(filter);
  }

  /**
   * Get consent violation logs (where access occurred without valid consent)
   *
   * @param filter - Additional filter criteria
   * @returns Observable of consent violation logs
   */
  getConsentViolations(filter: AuditLogFilter = {}): Observable<PagedResult<IMedicalRecordAccessLog>> {
    const violationFilter: AuditLogFilter = {
      ...filter,
      hasConsent: false,
    };
    return this.getAccessLogs(violationFilter);
  }

  /**
   * Get audit logs for a specific patient
   *
   * @param patientId - The patient ID
   * @param filter - Additional filter criteria
   * @returns Observable of audit logs for the patient
   */
  getLogsByPatient(
    patientId: number,
    filter: AuditLogFilter = {}
  ): Observable<PagedResult<IMedicalRecordAccessLog>> {
    return this.getAccessLogs({
      ...filter,
      patientId,
    });
  }

  /**
   * Get audit logs within a date range
   *
   * @param dateFrom - Start date
   * @param dateTo - End date
   * @param filter - Additional filter criteria
   * @returns Observable of audit logs in date range
   */
  getLogsByDateRange(
    dateFrom: Date,
    dateTo: Date,
    filter: AuditLogFilter = {}
  ): Observable<PagedResult<IMedicalRecordAccessLog>> {
    return this.getAccessLogs({
      ...filter,
      dateFrom,
      dateTo,
    });
  }

  /**
   * Search audit logs by search term (purpose, reason, notes)
   *
   * @param searchTerm - The search term
   * @param filter - Additional filter criteria
   * @returns Observable of search results
   */
  searchLogs(
    searchTerm: string,
    filter: AuditLogFilter = {}
  ): Observable<PagedResult<IMedicalRecordAccessLog>> {
    return this.getAccessLogs({
      ...filter,
      searchTerm,
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Helper method to build query string from filter object
   *
   * @param filter - Filter criteria
   * @returns Query string (empty if no filters, or starts with ?)
   */
  private buildQueryString(filter: AuditLogFilter): string {
    const params = new URLSearchParams();

    if (filter.dateFrom) {
      params.append('dateFrom', filter.dateFrom.toISOString());
    }
    if (filter.dateTo) {
      params.append('dateTo', filter.dateTo.toISOString());
    }
    if (filter.userId) {
      params.append('userId', filter.userId.toString());
    }
    if (filter.clinicId) {
      params.append('clinicId', filter.clinicId.toString());
    }
    if (filter.patientId) {
      params.append('patientId', filter.patientId.toString());
    }
    if (filter.hasConsent !== undefined) {
      params.append('hasConsent', filter.hasConsent.toString());
    }
    if (filter.searchTerm) {
      params.append('searchTerm', encodeURIComponent(filter.searchTerm));
    }
    if (filter.page) {
      params.append('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params.append('pageSize', filter.pageSize.toString());
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }
}
