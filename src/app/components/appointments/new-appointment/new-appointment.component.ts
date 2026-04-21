import { IAppointment } from './../../../entities/IAppointment';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  appointmentFormConfig,
  patientFormConfig,
} from 'src/app/conf/form-config';
import { IPatient } from 'src/app/entities/IPatient';
import { createFormGroupFromConfig } from 'src/app/shared/utils/form-utils';
import { PatientsService } from '../../patients/services/patients.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import {
  MatAutocompleteActivatedEvent,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AppointmensService } from '../services/appointmens.service';
import {
  toDateOnlyObject,
  toTimeObject,
} from 'src/app/shared/utils/date-utils';
import { Store } from '@ngrx/store';
import {
  selectClinicId,
  selectUserId,
} from 'src/app/store/selectors/auth.selectors';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css'],
  standalone: false,
})
export class NewAppointmentComponent implements OnInit, OnDestroy {
  // @Output() closedDialog = new EventEmitter<void>();
  appointmentForm: FormGroup;
  patientForm: FormGroup;
  patients: IPatient[] = [];
  filteredPatients: Observable<IPatient[]> | undefined;
  selectedPatient: IPatient | undefined;
  userId: number | null | undefined;
  clinicId: number | null | undefined;
  isEditMode = false;
  isLoading = false;
  appointmentId: number | undefined;
  statusOptions: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<NewAppointmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private appointmentService: AppointmensService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = createFormGroupFromConfig(this.fb, patientFormConfig);
    this.appointmentForm = createFormGroupFromConfig(
      this.fb,
      appointmentFormConfig
    );
    this.statusOptions = appointmentFormConfig['status'].options || [];
    console.log('Patient form:', this.patientForm);
    console.log('Appointment form:', this.appointmentForm);
    this.patientForm.get('lastname')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('phone')?.disable();

    if (this.dialogData?.appointment) {
      this.isEditMode = true;
      this.appointmentId = this.dialogData.appointment.id;
    }
  }

  ngOnInit(): void {
    // Obtener userId del store
    this.store
      .select(selectUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userId) => {
          console.log('User ID from store:', userId);
          this.userId = userId;
        },
        error: (err) => {
          console.error('Error getting user ID from store:', err);
        },
      });

    // Obtener clinicId del store
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          console.log('Clinic ID from store:', clinicId);
          this.clinicId = clinicId;
          this.getPatients();
        },
        error: (err) => {
          console.error('Error getting clinic ID from store:', err);
        },
      });

    this.filteredPatients = this.patientForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.patientForm
      .get('name')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === '' && !this.isEditMode) {
          this.patientForm.patchValue({
            lastname: '',
            email: '',
            phone: '',
          });
          this.selectedPatient = undefined;
        }
      });

    if (this.isEditMode) {
      this.setEditData();
    }
  }

  setEditData(): void {
    const app = this.dialogData.appointment;
    this.selectedPatient = app.patient;
    
    // Convert backend strings/dates to what the form components expect
    const date = new Date(app.date);
    // Para el timepicker de material, a veces necesita un objeto Date o string HH:mm
    const [h, m] = app.time.split(':');
    const time = new Date();
    time.setHours(parseInt(h), parseInt(m), 0);

    this.appointmentForm.patchValue({
      date: date,
      time: time,
      status: app.status,
      notes: app.notes,
      durationMinutes: app.durationMinutes || 30
    });

    if (app.patient) {
      this.patientForm.patchValue({
        id: app.patient.id,
        name: app.patient.name,
        lastname: app.patient.lastname,
        email: app.patient.email,
        phone: app.patient.phone,
      });
      this.patientForm.get('name')?.disable(); // Can't change patient on edit
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayFn(patient: IPatient): string {
    return patient ? `${patient.name} ${patient.lastname}` : '';
  }

  private _filter(value: any): IPatient[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    if (!filterValue) return this.patients;
    
    return this.patients.filter((option) =>
      (option.name + ' ' + option.lastname).toLowerCase().includes(filterValue)
    );
  }

  selectPatient(event: MatAutocompleteSelectedEvent): void {
    const patient: IPatient = event.option.value;
    this.selectedPatient = patient;
    
    if (this.selectedPatient) {
      this.patientForm.patchValue({
        id: this.selectedPatient.id,
        name: this.selectedPatient,
        lastname: this.selectedPatient.lastname,
        email: this.selectedPatient.email,
        phone: this.selectedPatient.phone,
      });
    }
  }

  closeDialog(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }

  saveAppointment(): void {
    if (this.appointmentForm.invalid || (!this.selectedPatient && !this.isEditMode)) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const dateValue: Date = this.appointmentForm.get('date')?.value;
    const timeValue: Date | string = this.appointmentForm.get('time')?.value;

    const appointment: IAppointment = {
      id: this.appointmentId,
      patientId: this.selectedPatient?.id ?? undefined,
      userId: this.userId ?? undefined,
      clinicId: this.clinicId ?? undefined,
      status: this.appointmentForm.get('status')?.value,
      notes: this.appointmentForm.get('notes')?.value || '',
      date: toDateOnlyObject(dateValue)!,
      time: toTimeObject(timeValue)!,
      durationMinutes: parseInt(this.appointmentForm.get('durationMinutes')?.value)
    };

    const request = this.isEditMode 
      ? this.appointmentService.updateAppointment(appointment, this.appointmentId!)
      : this.appointmentService.saveAppointment(appointment);

    request.pipe(
      takeUntil(this.destroy$),
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        let message = 'An error occurred while saving the appointment.';
        
        if (error.status === 400 && error.error?.errors) {
          // FluentValidation errors
          const validationErrors = error.error.errors;
          message = Object.values(validationErrors).flat().join(' ') || message;
        } else if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.error?.message) {
          message = error.error.message;
        }

        this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        return of(null);
      })
    ).subscribe((response) => {
      if (response !== null) {
        this.isLoading = false;
        this.snackBar.open(
          this.isEditMode ? 'Appointment updated successfully!' : 'Appointment created successfully!', 
          'Success', 
          { duration: 3000 }
        );
        this.closeDialog(true);
      }
    });
  }

  getPatients(): void {
    this.patientService
      .getPatients(this.clinicId)
      .subscribe((patients: IPatient[]) => {
        this.patients = patients;
        console.log('Patients:', this.patients);
      });
  }
}
