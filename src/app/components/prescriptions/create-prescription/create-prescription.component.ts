import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import {
  IPrescription,
  IPrescriptionItem,
} from 'src/app/entities/IPrescription';
import { PrescriptionService } from 'src/app/services/prescription.service';
import {
  selectClinicId,
  selectUserId,
} from 'src/app/store/selectors/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
  standalone: false,
})
export class CreatePrescriptionComponent implements OnInit, OnDestroy {
  prescriptionForm: FormGroup;
  patients: IPatient[] = [];
  clinicId: number | null = null;
  userId: number | null = null;
  destroy$ = new Subject<void>();
  infoMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private patientsService: PatientsService,
    private prescriptionService: PrescriptionService,
    private store: Store,
    private router: Router
  ) {
    this.prescriptionForm = this.fb.group({
      patientId: ['', Validators.required],
      diagnosis: ['', Validators.required],
      items: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    // Get Clinic ID to filter patients
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.clinicId = id;
        this.loadPatients();
      });

    this.store
      .select(selectUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.userId = id; // Ideally passed to backend implicitly, or used here
      });

    // Add one initial item row
    this.addItem();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatients() {
    this.patientsService
      .getPatients(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients) => {
        this.patients = patients;
      });
  }

  get items(): FormArray {
    return this.prescriptionForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      medication: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      notes: [''],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  savePrescription() {
    if (this.prescriptionForm.invalid) {
      return;
    }

    const formValue = this.prescriptionForm.value;

    // Map form items to API fields
    const items: IPrescriptionItem[] = formValue.items.map((item: any) => ({
      medicationName: item.medication,
      dosage: item.dose,
      frequency: item.frequency,
      duration: item.duration,
      instructions: item.notes,
    }));

    // Calculate default expiration (e.g., 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const payload: IPrescription = {
      patientId: formValue.patientId,
      items: items,
      diagnosis: formValue.diagnosis,
      notes: formValue.diagnosis, // User's example showed 'notes', mapping diagnosis to it or just sending empty if separate. Assuming diagnosis is primary.
      expiresAt: expiresAt,
    };

    if (this.clinicId) {
      // If backend needs clinicId associated with prescription, add it if interface allows.
      // We will trust the backend to handle context.
    }

    this.prescriptionService.createPrescription(payload).subscribe({
      next: (res) => {
        this.infoMessage = 'Prescription created successfully!';
        // Navigate to detail or reset
        setTimeout(() => {
          if (res.id) {
            this.router.navigate(['/prescriptions/detail', res.id]);
          } else {
            this.router.navigate(['/']);
          }
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = 'Error creating prescription.';
        console.error(err);
      },
    });
  }
}
