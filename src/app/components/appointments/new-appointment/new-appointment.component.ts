import { IAppointment } from './../../../entities/IAppointment';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  appointmentFormConfig,
  patientFormConfig,
} from 'src/app/conf/form-config';
import { IPatient } from 'src/app/entities/IPatient';
import { createFormGroupFromConfig } from 'src/app/shared/utils/form-utils';
import { PatientsService } from '../../patients/services/patients.service';
import { Observable, Subject } from 'rxjs';
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

  private destroy$ = new Subject<void>();

  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private appointment: AppointmensService,
    private store: Store
  ) {
    this.patientForm = createFormGroupFromConfig(this.fb, patientFormConfig);
    this.appointmentForm = createFormGroupFromConfig(
      this.fb,
      appointmentFormConfig
    );
    console.log('Patient form:', this.patientForm);
    console.log('Appointment form:', this.appointmentForm);
    this.patientForm.get('lastname')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('phone')?.disable();
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
        if (value === '') {
          this.patientForm.patchValue({
            lastname: '',
            email: '',
            phone: '',
          });
          this.selectedPatient = undefined;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filter(value: string): IPatient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter((option) =>
      (option.name + ' ' + option.lastname).toLowerCase().includes(filterValue)
    );
  }

  selectPatient(event: MatAutocompleteSelectedEvent): void {
    const [firstName, ...lastNameParts] = event.option.value.split(' ');
    const lastname = lastNameParts.join(' ');
    this.selectedPatient = this.patients.find(
      (patient) => patient.name === firstName && patient.lastname === lastname
    );
    if (this.selectedPatient) {
      this.patientForm.patchValue({
        id: this.selectedPatient.id,
        name: this.selectedPatient.name,
        lastname: this.selectedPatient.lastname,
        email: this.selectedPatient.email,
        phone: this.selectedPatient.phone,
      });
    }
  }

  closeDialog(): void {
    this.matDialog.closeAll();
  }

  saveAppointment(): void {
    const dateValue: Date = this.appointmentForm.get('date')?.value;
    const timeValue: Date | string = this.appointmentForm.get('time')?.value;

    const appointment: IAppointment = {
      patientId: this.selectedPatient?.id ?? undefined,
      userId: this.userId ?? undefined,
      clinicId: this.clinicId ?? undefined,
      status: 'Pending',
      notes: this.appointmentForm.get('notes')?.value || '',
      date: toDateOnlyObject(dateValue)!,
      time: toTimeObject(timeValue)!,
    };
    console.log('Appointment:', appointment);
    this.appointment.saveAppointment(appointment).subscribe((response) => {
      console.log('Appointment saved:', response);
      this.closeDialog();
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
