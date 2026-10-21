import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducer';
import { setAuthClaims } from '../store/actions/auth.actions';
import { userToken } from '../store/selectors/auth.selectors';
import { decodeTokenClaims, hasValidRoles } from '../utils/token-utils';

/**
 * Auth Guard - Porte de entrée a rutas autenticadas
 * Ahora usa el helper centralized decodeTokenClaims y roles[] del contrato nuevo
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(userToken).pipe(
      take(1),
      map((token) => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }

        // Decode token claims using centralized helper
        const claims = decodeTokenClaims(token);

        // Critical: if token has no valid roles[], treat as unauthenticated
        if (!hasValidRoles(claims)) {
          this.router.navigate(['/login']);
          return false;
        }

        // Store the new claims in the auth store for other guards/services
        this.store.dispatch(setAuthClaims({ claims }));

        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      }),
    );
  }
}