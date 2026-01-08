import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  setClinic,
} from '../actions/auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
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

  // Después de login exitoso, si no hay clinicId, obtener la primera clínica
  loginSuccess$ = createEffect(
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
