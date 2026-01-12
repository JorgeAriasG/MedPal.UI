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
    emergencyContact: '',
    clinicId: null,
  };

  private destroy$ = new Subject<void>();

  constructor(private patientsService: PatientsService, private store: Store) {}

  ngOnInit(): void {
    // Obtener clinicId del store
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          console.log('Clinic ID from store:', clinicId);
          this.newPatient.clinicId = clinicId;
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

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior
    this.savePatient();
    this.resetForm();
  }

  async savePatient(): Promise<void> {
    try {
      this.patientsService
        .addPatient(this.newPatient)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          console.log('Patient:', response);
          this.patientAdded.emit(); // Emit the event after saving the patient
        });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
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
      emergencyContact: '',
      clinicId: null,
    };
  }
}
