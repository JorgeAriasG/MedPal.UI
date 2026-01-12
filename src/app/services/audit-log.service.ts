/**
 * Audit Log Service
 * Handles API calls for audit log retrieval, filtering, and export
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IMedicalRecordAccessLog,
  AuditLogFilter,
  AuditReport,
  PagedResult,
} from '../entities';

/**
 * Audit Log Service
 * Provides methods for accessing audit logs and generating reports
 */
@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private apiUrl = '/api/audit-logs';

  constructor(private http: HttpClient) {}

  /**
   * Get paginated audit logs with optional filtering
   *
   * @param filter Filter criteria (optional)
   * @returns Observable of paginated audit logs
   */
  public getAccessLogs(
    filter?: AuditLogFilter
  ): Observable<PagedResult<IMedicalRecordAccessLog>> {
    let params = new HttpParams();

    if (filter) {
      // Pagination parameters
      if (filter.page !== undefined) {
        params = params.set('page', filter.page.toString());
      }
      if (filter.pageSize !== undefined) {
        params = params.set('pageSize', filter.pageSize.toString());
      }

      // Date range filters
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom.toString());
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo.toString());
      }

      // Entity filters
      if (filter.userId) {
        params = params.set('userId', filter.userId.toString());
      }
      if (filter.clinicId) {
        params = params.set('clinicId', filter.clinicId.toString());
      }
      if (filter.patientId) {
        params = params.set('patientId', filter.patientId.toString());
      }

      // Consent filter
      if (filter.hasConsent !== undefined) {
        params = params.set('hasConsent', filter.hasConsent.toString());
      }

      // Search/purpose filter
      if (filter.searchTerm) {
        params = params.set('searchTerm', filter.searchTerm);
      }
    }

    return this.http.get<PagedResult<IMedicalRecordAccessLog>>(
      this.apiUrl,
      { params }
    );
  }

  /**
   * Get single audit log detail
   *
   * @param logId ID of the audit log to retrieve
   * @returns Observable of audit log detail
   */
  public getAccessLogDetail(
    logId: number
  ): Observable<IMedicalRecordAccessLog> {
    return this.http.get<IMedicalRecordAccessLog>(
      `${this.apiUrl}/${logId}`
    );
  }

  /**
   * Generate audit report based on filter criteria
   *
   * @param filter Filter criteria for report generation
   * @returns Observable of generated audit report
   */
  public generateReport(filter?: AuditLogFilter): Observable<AuditReport> {
    let params = new HttpParams();

    if (filter) {
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom.toString());
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo.toString());
      }
      if (filter.clinicId) {
        params = params.set('clinicId', filter.clinicId.toString());
      }
      if (filter.userId) {
        params = params.set('userId', filter.userId.toString());
      }
    }

    return this.http.get<AuditReport>(`${this.apiUrl}/reports/generate`, {
      params,
    });
  }

  /**
   * Export audit logs as CSV or other format
   *
   * @param filter Filter criteria for export
   * @param format Export format (default: csv)
   * @returns Observable of file blob
   */
  public exportLogs(
    filter?: AuditLogFilter,
    format: string = 'csv'
  ): Observable<Blob> {
    let params = new HttpParams().set('format', format);

    if (filter) {
      if (filter.dateFrom) {
        params = params.set('dateFrom', filter.dateFrom.toString());
      }
      if (filter.dateTo) {
        params = params.set('dateTo', filter.dateTo.toString());
      }
      if (filter.clinicId) {
        params = params.set('clinicId', filter.clinicId.toString());
      }
      if (filter.userId) {
        params = params.set('userId', filter.userId.toString());
      }
      if (filter.patientId) {
        params = params.set('patientId', filter.patientId.toString());
      }
    }

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }

  /**
   * Download exported file
   * Utility method to trigger file download
   *
   * @param blob File blob to download
   * @param filename Name for the downloaded file
   */
  public downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
