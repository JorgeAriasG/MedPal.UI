import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css'],
  standalone: false,
})
export class NewPatientComponent implements OnInit, OnDestroy {
  @Output() patientAdded = new EventEmitter<void>();

  newPatient: IPatient = {
    id: null,
    name: '',
    middlename: '',
    lastname: '',
    phone: '',
    email: '',
    address: '',
    dob: new Date(),
    gender: '',
    curp: '',
    emergencyContact: '',
    clinicIds: [],
  };

  emailError: string | null = null;
  ageError: string | null = null;
  isSubmitting: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private patientsService: PatientsService, private store: Store) {}

  ngOnInit(): void {
    // Obtener clinicId del store
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          this.newPatient.clinicIds = clinicId ? [clinicId] : [];
        },
        error: (err) => {
          console.error('Error getting clinic ID from store:', err);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.emailError = null;
    this.ageError = null;

    if (!this.validateAge()) {
      this.ageError = 'Patient must be at least 18 years old.';
      return;
    }

    this.isSubmitting = true;
    this.patientsService.checkEmail(this.newPatient.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailError = 'This email is already registered.';
          this.isSubmitting = false;
        } else {
          this.savePatient();
        }
      },
      error: (err) => {
        console.error('Error checking email', err);
        this.isSubmitting = false;
      }
    });
  }

  validateAge(): boolean {
    if (!this.newPatient.dob) return false;
    const birthDate = new Date(this.newPatient.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  async savePatient(): Promise<void> {
    this.patientsService
      .addPatient(this.newPatient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.patientAdded.emit();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error saving patient:', err);
          this.isSubmitting = false;
        }
      });
  }

  resetForm(): void {
    this.newPatient = {
      id: null,
      name: '',
      middlename: '',
      lastname: '',
      phone: '',
      email: '',
      address: '',
      dob: new Date(),
      gender: '',
      curp: '',
      emergencyContact: '',
      clinicIds: [],
    };
  }
}
