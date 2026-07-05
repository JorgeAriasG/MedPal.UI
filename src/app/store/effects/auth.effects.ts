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
import { toHourMinute } from 'src/app/shared/utils/date-utils';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private clinicService: ClinicService,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((response) => {
            return loginSuccess({
              userId: response.id,
              userToken: response.token,
              userRole: response.role,
              clinicId: response.clinicId,
            });
          }),
          catchError((error) => {
            console.error('Login failed:', error);
            return of(loginFailure({ error: 'Invalid email or password' }));
          }),
        );
      }),
    ),
  );

  // After successful login, fetch user profile to get specialty and other data
  loginSuccessLoadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      switchMap(() => {
        return of(loadUserProfile());
      }),
    ),
  );

  // Load user profile from User/me endpoint
  // Handle gracefully if endpoint is not available (404) or user lacks permission (403)
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserProfile),
      switchMap(() => {
        return this.authService.getCurrentUser().pipe(
          map((response) => {
            return loadUserProfileSuccess({
              specialty: response.specialty || 'General',
            });
          }),
          catchError((error) => {
            // 404 = endpoint doesn't exist, 403 = insufficient permissions
            // These are not blocking errors for some roles (SuperAdmin, AccountAdmin)
            if (error.status === 404 || error.status === 403) {
              console.warn(
                'User profile endpoint not available or insufficient permissions:',
                error.status,
              );
              // Complete successfully without specialty - user can still log in
              return of(loadUserProfileSuccess({ specialty: 'General' }));
            }
            // For other errors, fail the profile load
            console.error('Error loading user profile:', error);
            return of(
              loadUserProfileFailure({
                error: 'Failed to load user profile',
              }),
            );
          }),
        );
      }),
    ),
  );

  // After clinic selection, handle clinic assignment intelligently
  // Always ensure clinic hours are loaded when we have a clinic ID
  loginSuccessClinic$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        switchMap(({ clinicId, userRole }) => {
          // Roles that are clinic-based and may need clinic assignment
          const CLINIC_REQUIRING_ROLES = [
            'HealthProfessional',
            'Receptionist',
            'Patient',
            'ClinicAdmin',
          ];

          // Always load clinic hours if we have a clinicId
          // OR if we need to assign a clinic for clinic-requiring roles (no ID set)
          const shouldLoadClinicHours =
            clinicId !== null &&
            clinicId !== undefined &&
            clinicId !== 0;

          const needsClinicAssignment =
            !shouldLoadClinicHours &&
            CLINIC_REQUIRING_ROLES.includes(userRole);

          if (!shouldLoadClinicHours && !needsClinicAssignment) {
            // No clinic ID needed and not a clinic-requiring role
            return of({ type: '[Clinic] No Clinic Action Needed' });
          }

          return this.clinicService.getClinics().pipe(
            map((clinics) => {
              if (!clinics || clinics.length === 0) {
                console.warn('No clinics available');
                return { type: '[Clinic] No Clinics Available' };
              }

              let clinic = null;

              // If we have a specific clinicId, find that clinic
              if (shouldLoadClinicHours) {
                clinic = clinics.find((c: { id: number | null }) => c.id === clinicId);
              }

              // Otherwise, use the first clinic (for role-based assignment)
              if (!clinic) {
                clinic = clinics[0];
              }

              return setClinic({
                clinicId: clinic?.id ?? null,
                open: clinic?.open ? toHourMinute(clinic.open) : null,
                close: clinic?.close ? toHourMinute(clinic.close) : null,
              });
            }),
            catchError((err) => {
              console.warn('Could not load clinic hours:', err);
              // Return neutral action on error
              return of({ type: '[Clinic] Load Clinic Hours Error' });
            }),
          );
        }),
      ),
    { dispatch: true },
  );

  // Navigate to home after user profile is loaded
  loadUserProfileSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUserProfileSuccess),
        tap(() => {
          this.router.navigate(['']);
        }),
      ),
    { dispatch: false },
  );

  // Simplificado: solo navegar al login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
