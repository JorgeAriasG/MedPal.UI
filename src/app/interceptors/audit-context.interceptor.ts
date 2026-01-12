/**
 * Audit Context Interceptor
 * HTTP interceptor for audit request handling
 *
 * Adds tenant context headers to requests and handles audit-specific error responses
 * (optional - enhances audit logging on the backend)
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TenantContextService } from '../services/tenant-context.service';
import { Router } from '@angular/router';

/**
 * Audit Context Interceptor
 * Adds tenant context to audit-related requests
 */
@Injectable()
export class AuditContextInterceptor implements HttpInterceptor {
  constructor(
    private tenantContextService: TenantContextService,
    private router: Router
  ) {}

  /**
   * Intercept HTTP requests and responses
   *
   * @param req HTTP request
   * @param next Handler for next middleware
   * @returns Observable of HTTP event
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add tenant context headers to audit-related requests
    if (this.isAuditRequest(req)) {
      const context = this.tenantContextService.getContextForAPI();

      // Clone request with additional headers
      let auditReq = req.clone({
        setHeaders: {
          'X-Account-Id': context.accountId?.toString() || '',
          'X-Clinic-Id': context.clinicId?.toString() || '',
          'X-User-Id': context.userId?.toString() || '',
        },
      });

      // Remove empty headers
      auditReq = auditReq.clone({
        setHeaders: {
          'X-Account-Id': context.accountId?.toString() || undefined,
          'X-Clinic-Id': context.clinicId?.toString() || undefined,
          'X-User-Id': context.userId?.toString() || undefined,
        } as any,
      });

      return next.handle(auditReq).pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error)
        )
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) =>
        this.handleError(error)
      )
    );
  }

  /**
   * Check if request is audit-related
   * @param req HTTP request
   * @returns true if request is for audit endpoints
   */
  private isAuditRequest(req: HttpRequest<any>): boolean {
    return (
      req.url.includes('/api/audit') ||
      req.url.includes('/api/consent') ||
      req.url.includes('/audit-logs') ||
      req.url.includes('/consent')
    );
  }

  /**
   * Handle HTTP errors
   * @param error HTTP error response
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 403:
        // Forbidden - user doesn't have permission
        console.error('Access forbidden for audit operation', error);
        this.router.navigate(['/unauthorized']);
        break;

      case 404:
        // Not found
        console.error('Audit resource not found', error);
        break;

      case 500:
        // Server error
        console.error('Server error during audit operation', error);
        break;

      default:
        console.error('Error during audit operation', error);
    }

    return throwError(() => error);
  }
}
