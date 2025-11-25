import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../utils/session/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from storage and attach to request
    return this.sessionService.getUserToken().pipe(
      take(1),
      switchMap((userToken: string | null) => {
        if (userToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${userToken}`
            }
          });
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          // this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
