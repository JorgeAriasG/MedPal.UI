import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { login, loginSuccess, loginFailure, rehydrateAuthState, logout, setClinic } from '../actions/auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/utils/session/session.service';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private store: Store) {}
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action => {
        console.log('Login action received:', action);
        return this.authService.login(action.email, action.password).pipe(
          map(response => {
            console.log('Login successful:', response);
            return loginSuccess({ userId: response.id, userToken: response.token, clinicId: response.clinicId });
          }),
          catchError(error => {
            console.error('Login failed:', error);
            return of(loginFailure({ error: 'Invalid email or password' }));
          })
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap(({ userId, userToken, clinicId }) => {
        console.log('Storing user ID in session storage');
        sessionStorage.setItem('userId', userId.toString()); // Store user ID in session storage
        sessionStorage.setItem('userToken', userToken); // Store user token in session storage
        sessionStorage.setItem('clinicId', clinicId.toString() ?? ''); // Store clinic ID
      })
    ),
    { dispatch: false }
  );

  rehydrateAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rehydrateAuthState),
      map(({ userId, userToken, clinicId }) => {
        if (userId && userToken) {
          return loginSuccess({ userId, userToken, clinicId: clinicId ?? 0 });
        } else {
          return loginFailure({ error: 'No user ID found in session storage' });
        }
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        console.log('Clearing user ID from session storage');
        sessionStorage.removeItem('userId'); // Clear user ID from session storage
        sessionStorage.removeItem('userToken'); // Clear user token from session storage
        sessionStorage.removeItem('clinicId'); // Clear selected clinic ID
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  setClinic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setClinic),
      tap(({ clinicId }) => { // Store selected clinic ID in session storage
        console.log('Storing clinic ID in session storage: ' , clinicId);
        if (clinicId) {
          sessionStorage.setItem('clinicId', clinicId.toString());
        } else {
          console.error('Clinic ID is undefined');
        }
      })),
    { dispatch: false }
  );

}
