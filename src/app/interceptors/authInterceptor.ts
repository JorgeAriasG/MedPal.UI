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
import { Store } from '@ngrx/store';
import { userToken } from '../store/selectors/auth.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.store.select(userToken).pipe(
      take(1),
      switchMap((token: string | null) => {
        let modifiedRequest = request;
        const authToken = token || this.authService.getToken();

        if (authToken) {
          modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`,
            },
          });
        }

        const role = this.authService.getRole();
        const permissions = this.authService.getPermissions();

        if (role) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: { 'X-User-Role': role },
          });
        }

        if (permissions.length > 0) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: { 'X-User-Permissions': permissions.join(',') },
          });
        }

        const clinicId = this.authService.getClinicId();
        if (clinicId) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: { 'X-Clinic-Id': clinicId.toString() },
          });
        }

        const accountId = this.authService.getAccountId();
        if (accountId) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: { 'X-Account-Id': accountId.toString() },
          });
        }

        return next.handle(modifiedRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
