import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  setClinic,
  loadUserProfile,
  loadUserProfileSuccess,
  loadUserProfileFailure,
} from '../actions/auth.actions';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClinicService } from 'src/app/components/clinics/services/clinic.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private clinicService: ClinicService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) => {
        console.log('Login action received:', action);
        return this.authService.login(action.email, action.password).pipe(
          map((response) => {
            console.log('Login successful:', response);
            return loginSuccess({
              userId: response.id,
              userToken: response.token,
              clinicId: response.clinicId ?? null,
              specialty: response.specialty || undefined,
            });
          }),
          catchError((error) => {
            console.error('Login failed:', error);
            return of(loginFailure({ error: 'Invalid email or password' }));
          })
        );
      })
    )
  );

  // After successful login, fetch user profile to get specialty and other data
  loginSuccessLoadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      switchMap(() => {
        console.log('Login successful - loading user profile');
        return of(loadUserProfile());
      })
    )
  );

  // Load user profile from User/me endpoint
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserProfile),
      switchMap(() => {
        return this.authService.getCurrentUser().pipe(
          map((response) => {
            console.log('User profile loaded:', response);
            return loadUserProfileSuccess({
              specialty: response.specialty || 'General',
            });
          }),
          catchError((error) => {
            console.error('Error loading user profile:', error);
            return of(
              loadUserProfileFailure({
                error: 'Failed to load user profile',
              })
            );
          })
        );
      })
    )
  );

  // After clinic selection, navigate to home
  loginSuccessClinic$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ clinicId }) => {
          console.log('Login success - clinicId:', clinicId);
          // Si no hay clinicId, obtener las clínicas y seleccionar la primera
          if (clinicId === null || clinicId === undefined || clinicId === 0) {
            this.clinicService.getClinics().subscribe({
              next: (clinics) => {
                if (clinics && clinics.length > 0) {
                  console.log('Setting default clinic:', clinics[0].id);
                  this.store.dispatch(
                    setClinic({ clinicId: clinics[0].id ?? null })
                  );
                }
              },
              error: (err) => {
                console.error('Error fetching clinics:', err);
              },
            });
          }
        })
      ),
    { dispatch: false }
  );

  // Navigate to home after user profile is loaded
  loadUserProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUserProfileSuccess),
        tap(({ specialty }) => {
          console.log('User profile updated with specialty:', specialty);
          this.router.navigate(['']);
        })
      ),
    { dispatch: false }
  );

  // Simplificado: solo navegar al login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          console.log('Logging out - navigating to login');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
