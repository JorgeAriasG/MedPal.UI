import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ConsentActions from './consent.actions';
import { ConsentService } from '../../services/consent.service';

@Injectable()
export class ConsentEffects {
  private actions$ = inject(Actions);
  private consentService = inject(ConsentService);
  private snackBar = inject(MatSnackBar);

  loadAllConsents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.loadAllConsents),
      switchMap(() =>
        this.consentService.getAllConsents().pipe(
          map((consents) => ConsentActions.loadAllConsentsSuccess({ consents })),
          catchError((err) => of(ConsentActions.loadAllConsentsFailure({ error: err.message })))
        )
      )
    )
  );

  loadPatientConsents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.loadPatientConsents),
      switchMap(({ patientDetailsId }) =>
        this.consentService.getPatientConsents(patientDetailsId).pipe(
          map((consents) => ConsentActions.loadPatientConsentsSuccess({ consents })),
          catchError((err) => of(ConsentActions.loadPatientConsentsFailure({ error: err.message })))
        )
      )
    )
  );

  requestConsent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.requestConsent),
      switchMap(({ request }) =>
        this.consentService.grantConsent(request).pipe(
          map((consent) => ConsentActions.requestConsentSuccess({ consent })),
          catchError((err) => of(ConsentActions.requestConsentFailure({ error: err.message })))
        )
      )
    )
  );

  approveConsent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.approveConsent),
      switchMap(({ consentId, notes }) =>
        this.consentService.approveConsent(consentId, notes).pipe(
          map((consent) => ConsentActions.approveConsentSuccess({ consent })),
          catchError((err) => of(ConsentActions.approveConsentFailure({ error: err.message })))
        )
      )
    )
  );

  rejectConsent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.rejectConsent),
      switchMap(({ consentId, notes }) =>
        this.consentService.rejectConsent(consentId, notes).pipe(
          map(() => ConsentActions.rejectConsentSuccess({ consentId })),
          catchError((err) => of(ConsentActions.rejectConsentFailure({ error: err.message })))
        )
      )
    )
  );

  revokeConsent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConsentActions.revokeConsent),
      switchMap(({ consentId }) =>
        this.consentService.revokeConsent(consentId).pipe(
          map(() => ConsentActions.revokeConsentSuccess({ consentId })),
          catchError((err) => of(ConsentActions.revokeConsentFailure({ error: err.message })))
        )
      )
    )
  );

  requestSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConsentActions.requestConsentSuccess),
        tap(() => this.snackBar.open('Consentimiento registrado exitosamente', 'Cerrar', { duration: 3000, panelClass: 'cf-toast-success' }))
      ),
    { dispatch: false }
  );

  approveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConsentActions.approveConsentSuccess),
        tap(() => this.snackBar.open('Consentimiento aprobado', 'Cerrar', { duration: 3000, panelClass: 'cf-toast-success' }))
      ),
    { dispatch: false }
  );

  rejectSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConsentActions.rejectConsentSuccess),
        tap(() => this.snackBar.open('Consentimiento rechazado', 'Cerrar', { duration: 3000, panelClass: 'cf-toast-warn' }))
      ),
    { dispatch: false }
  );

  revokeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConsentActions.revokeConsentSuccess),
        tap(() => this.snackBar.open('Consentimiento revocado', 'Cerrar', { duration: 3000, panelClass: 'cf-toast-warn' }))
      ),
    { dispatch: false }
  );

  failure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ConsentActions.loadAllConsentsFailure,
          ConsentActions.loadPatientConsentsFailure,
          ConsentActions.requestConsentFailure,
          ConsentActions.approveConsentFailure,
          ConsentActions.rejectConsentFailure,
          ConsentActions.revokeConsentFailure
        ),
        tap(({ error }) => this.snackBar.open(`Error: ${error}`, 'Cerrar', { duration: 5000, panelClass: 'cf-toast-error' }))
      ),
    { dispatch: false }
  );
}
