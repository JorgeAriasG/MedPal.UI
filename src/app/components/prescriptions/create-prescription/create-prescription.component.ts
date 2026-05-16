import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import {
  IPrescription,
  IPrescriptionItem,
} from 'src/app/entities/IPrescription';
import { PrescriptionService } from 'src/app/services/prescription.service';
import {
  selectAuthContext,
} from 'src/app/store/selectors/auth.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeIn } from 'src/app/shared/animations';

@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css'],
  animations: [fadeIn],
  standalone: false,
})
export class CreatePrescriptionComponent implements OnInit, OnDestroy {
  prescriptionForm: FormGroup;
  patients: IPatient[] = [];
  clinicId: number | null = null;
  userId: number | null = null;
  destroy$ = new Subject<void>();
  private itemDestroy$: Subject<void>[] = [];
  infoMessage: string = '';
  errorMessage: string = '';
  matchingAllergies: string[] = [];
  isCheckingAllergies: boolean = false;

  constructor(
    private route: ActivatedRoute,
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
    this.store
      .select(selectAuthContext)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ clinicId, userId }) => {
        this.clinicId = clinicId;
        this.userId = userId;
        if (clinicId) {
          this.loadPatients();
        }
      });

    // Handle pre-selection of patient from query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const patientId = params['patientId'];
        if (patientId) {
          this.prescriptionForm.get('patientId')?.setValue(+patientId);
          this.verifyAllergies(); // Check allergies if we already have items (unlikely on init, but good practice)
        }
      });

    this.addItem();
  }

  ngOnDestroy(): void {
    this.itemDestroy$.forEach(d => { d.next(); d.complete(); });
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatients() {
    this.patientsService
      .getPatients(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients) => {
        this.patients = patients;
        // Re-check pre-selection in case patients loaded after query params
        const qParamId = this.route.snapshot.queryParamMap.get('patientId');
        if (qParamId && !this.prescriptionForm.get('patientId')?.value) {
           this.prescriptionForm.get('patientId')?.setValue(+qParamId);
        }
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

    const itemDestroy$ = new Subject<void>();
    itemGroup.get('medication')?.valueChanges
      .pipe(
        takeUntil(itemDestroy$),
        debounceTime(500)
      )
      .subscribe(() => {
        this.verifyAllergies();
      });

    this.itemDestroy$.push(itemDestroy$);
    this.items.push(itemGroup);
  }

  verifyAllergies() {
    const patientId = this.prescriptionForm.get('patientId')?.value;
    if (!patientId) return;

    const medicationNames = this.items.controls
      .map(c => c.get('medication')?.value)
      .filter(m => m && m.length > 2);

    if (medicationNames.length === 0) {
      this.matchingAllergies = [];
      return;
    }

    this.isCheckingAllergies = true;
    this.prescriptionService.checkAllergies(patientId, medicationNames)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.matchingAllergies = res.matchingAllergies;
          this.isCheckingAllergies = false;
        },
        error: () => {
          this.isCheckingAllergies = false;
        }
      });
  }

  removeItem(index: number) {
    this.itemDestroy$[index]?.next();
    this.itemDestroy$[index]?.complete();
    this.itemDestroy$.splice(index, 1);
    this.items.removeAt(index);
  }

  savePrescription() {
    if (this.prescriptionForm.invalid || this.matchingAllergies.length > 0) {
      if (this.matchingAllergies.length > 0) {
        this.errorMessage = 'Cannot save: Patient is allergic to one or more medications.';
      }
      return;
    }

    const formValue = this.prescriptionForm.value;
    const items: IPrescriptionItem[] = formValue.items.map((item: any) => ({
      medicationName: item.medication,
      dosage: item.dose,
      frequency: item.frequency,
      duration: item.duration,
      instructions: item.notes,
    }));

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const payload: IPrescription = {
      patientId: formValue.patientId,
      items: items,
      diagnosis: formValue.diagnosis,
      notes: formValue.diagnosis,
      expiresAt: expiresAt,
    };

    this.prescriptionService.createPrescription(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.infoMessage = 'Prescription created successfully!';
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
