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
              userRole: response.role,
              clinicId: response.clinicId ?? null,
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
  // Handle gracefully if endpoint is not available (404) or user lacks permission (403)
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
            // 404 = endpoint doesn't exist, 403 = insufficient permissions
            // These are not blocking errors for some roles (SuperAdmin, AccountAdmin)
            if (error.status === 404 || error.status === 403) {
              console.warn('User profile endpoint not available or insufficient permissions:', error.status);
              // Complete successfully without specialty - user can still log in
              return of(loadUserProfileSuccess({ specialty: 'General' }));
            }
            // For other errors, fail the profile load
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

  // After clinic selection, handle clinic assignment intelligently
  // Only fetch clinics if user has a role that should have access to them
  loginSuccessClinic$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ clinicId, userRole }) => {
          console.log('Login success - clinicId:', clinicId, 'userRole:', userRole);

          // Roles that are clinic-based and may need clinic assignment
          const CLINIC_REQUIRING_ROLES = ['Doctor', 'HealthProfessional', 'Receptionist', 'Patient', 'ClinicAdmin'];

          // Only attempt to fetch clinics if:
          // 1. User role requires a clinic AND
          // 2. clinicId is not already set
          if (CLINIC_REQUIRING_ROLES.includes(userRole) && (clinicId === null || clinicId === undefined || clinicId === 0)) {
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
                console.warn('Could not automatically assign clinic:', err);
                // Don't block login flow - user may have different permissions
                // SuperAdmin and AccountAdmin don't need clinics
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
