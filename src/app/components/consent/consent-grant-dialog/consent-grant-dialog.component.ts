import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectConsentSubmitting } from '../../../store/consent/consent.selectors';
import * as ConsentActions from '../../../store/consent/consent.actions';
import { ConsentScope } from '../../../entities/IPatientConsent';

@Component({
  selector: 'app-consent-grant-dialog',
  standalone: false,
  templateUrl: './consent-grant-dialog.component.html',
  styleUrls: ['./consent-grant-dialog.component.css'],
})
export class ConsentGrantDialogComponent implements OnInit, OnDestroy {
  consentForm!: FormGroup;
  submitting = false;
  scopeOptions = [
    { value: ConsentScope.AllRecords, label: 'Todos los Registros' },
    { value: ConsentScope.LabsOnly, label: 'Solo Laboratorio' },
    { value: ConsentScope.SpecificDateRange, label: 'Rango de Fechas' },
  ];
  minDate = new Date();
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<ConsentGrantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientDetailsId?: number }
  ) {}

  ngOnInit(): void {
    this.consentForm = this.fb.group({
      patientDetailsId: [this.data?.patientDetailsId || null, Validators.required],
      requestingClinicId: [null, Validators.required],
      ownerClinicId: [null, Validators.required],
      consentScope: [ConsentScope.AllRecords, Validators.required],
      expiryDate: [null],
      notes: [''],
    });

    this.store.select(selectConsentSubmitting)
      .pipe(takeUntil(this.destroy$))
      .subscribe((s) => (this.submitting = s));
  }

  onSubmit(): void {
    if (this.consentForm.invalid) return;
    this.store.dispatch(ConsentActions.requestConsent({ request: this.consentForm.value }));
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
