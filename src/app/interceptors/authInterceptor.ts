import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { selectClinicId, userToken } from '../store/selectors/auth.selectors';

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
    return combineLatest([
      this.store.select(userToken).pipe(take(1)),
      this.store.select(selectClinicId).pipe(take(1)),
    ]).pipe(
      switchMap(([token, clinicId]) => {
        let modifiedRequest = request;
        const authToken = token || this.authService.getToken();

        if (authToken) {
          modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`,
            },
          });
        }

        const resolvedClinicId = clinicId ?? this.authService.getClinicId();
        if (resolvedClinicId) {
          modifiedRequest = modifiedRequest.clone({
            setHeaders: { 'X-Clinic-Id': resolvedClinicId.toString() },
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