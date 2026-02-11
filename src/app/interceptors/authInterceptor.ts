import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userToken } from '../store/selectors/auth.selectors';

/**
 * Authentication Interceptor
 *
 * Handles:
 * - Adding JWT token to all HTTP requests
 * - Adding role and permissions headers
 * - Handling 401 (unauthorized) responses
 * - Handling 403 (forbidden) responses
 *
 * Intercepted endpoints:
 * - All API calls (excludes external URLs)
 * - Non-auth endpoints
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get token from store
    return this.store.select(userToken).pipe(
      take(1),
      switchMap((token: string | null) => {
        // Clone request and add auth headers
        let modifiedRequest = request;

        if (token) {
          // Add Authorization header with JWT token
          modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Add optional role and permissions headers (for debugging/logging)
        const role = this.authService.getRole();
        const permissions = this.authService.getPermissions();

        if (role) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: {
              'X-User-Role': role,
            },
          });
        }

        if (permissions.length > 0) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: {
              'X-User-Permissions': permissions.join(','),
            },
          });
        }

        // Add clinic context header if available (for multi-tenancy)
        const clinicId = this.authService.getClinicId();
        if (clinicId) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: {
              'X-Clinic-Id': clinicId.toString(),
            },
          });
        }

        // Add account context header if available
        const accountId = this.authService.getAccountId();
        if (accountId) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: {
              'X-Account-Id': accountId.toString(),
            },
          });
        }

        return next.handle(modifiedRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle 401 - Unauthorized (token expired or invalid)
        if (error.status === 401) {
          console.warn('[AuthInterceptor] 401 Unauthorized - Token invalid or expired');
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // Handle 403 - Forbidden (insufficient permissions)
        if (error.status === 403) {
          console.warn('[AuthInterceptor] 403 Forbidden - Insufficient permissions');
          this.router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }
}
