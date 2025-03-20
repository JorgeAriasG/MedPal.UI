import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { login, loginSuccess, loginFailure, rehydrateAuthState, logout } from '../actions/auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/utils/session/session.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action => {
        console.log('Login action received:', action);
        return this.authService.login(action.email, action.password).pipe(
          map(response => {
            console.log('Login successful:', response);
            return loginSuccess({ userId: response.id });
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
      tap(({ userId }) => {
        console.log('Storing user ID in session storage');
        sessionStorage.setItem('userId', userId); // Store user ID in session storage
      })
    ),
    { dispatch: false }
  );

  rehydrateAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rehydrateAuthState),
      map(({ userId }) => {
        if (userId) {
          return loginSuccess({ userId });
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
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
