import { IAppointment } from './../../../entities/IAppointment';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { appointmentFormConfig, patientFormConfig } from 'src/app/conf/form-config';
import { IPatient } from 'src/app/entities/IPatient';
import { createFormGroupFromConfig } from 'src/app/shared/utils/form-utils';
import { PatientsService } from '../../patients/services/patients.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SessionService } from 'src/app/utils/session/session.service';
import { AppointmensService } from '../services/appointmens.service';
import { toDateOnlyObject, toTimeObject } from 'src/app/shared/utils/date-utils';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.css'],
    standalone: false
})
export class NewAppointmentComponent {
  // @Output() closedDialog = new EventEmitter<void>();
  appointmentForm: FormGroup;
  patientForm: FormGroup;
  patients: IPatient[] = [];
  filteredPatients: Observable<IPatient[]> | undefined;
  selectedPatient: IPatient | undefined;
  userId: number | null | undefined;
  clinicId: number | null | undefined;

  constructor(private matDialog: MatDialog, private fb: FormBuilder, private patientService: PatientsService, private appointment: AppointmensService, private session: SessionService){
    this.patientService.getPatients().subscribe((patients: IPatient[]) => {
      this.patients = patients;
      console.log('Patients:', this.patients);
    });
    this.patientForm = createFormGroupFromConfig(this.fb, patientFormConfig);
    this.appointmentForm = createFormGroupFromConfig(this.fb, appointmentFormConfig);
    console.log('Patient form:', this.patientForm);
    console.log('Appointment form:', this.appointmentForm);
    this.patientForm.get('lastname')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('phone')?.disable();
  }

  ngOnInit(): void {
    this.filteredPatients = this.patientForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.patientForm.get('name')!.valueChanges.subscribe(value => {
      if (value === '') {
        this.patientForm.patchValue({
          lastname: '',
          email: '',
          phone: ''
        });
        this.selectedPatient = undefined;
      }
    });
    this.getUserId();
    this.getClinicId();
  }

  private _filter(value: string): IPatient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter(option =>
      (option.name + ' ' + option.lastname).toLowerCase().includes(filterValue)
    );
  }

  selectPatient(event: MatAutocompleteSelectedEvent): void {
    const [firstName, ...lastNameParts] = event.option.value.split(' ');
    const lastname = lastNameParts.join(' ');
    this.selectedPatient = this.patients.find(
      patient => patient.name === firstName && patient.lastname === lastname
    );
    if (this.selectedPatient) {
      this.patientForm.patchValue({
        id: this.selectedPatient.id,
        name: this.selectedPatient.name,
        lastname: this.selectedPatient.lastname,
        email: this.selectedPatient.email,
        phone: this.selectedPatient.phone
      });
    }
  }

  closeDialog(): void {
    this.matDialog.closeAll();
  }

  getUserId(): void {
    this.session.getStoreUserId().subscribe({
      next: userId => {
        console.log('User ID:', userId);
        this.userId = userId;
      },
      error: err => {
        console.error('Error fetching user ID:', err);
      }
    });
  }

  getClinicId(): void {
    this.session.getClinicId().subscribe({
      next: clinicId => {
        console.log('Clinic ID:', clinicId);
        this.clinicId = clinicId;
      },
      error: err => {
        console.error('Error fetching clinic ID:', err);
      }});
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
      time: toTimeObject(timeValue)!
    };
    console.log('Appointment:', appointment);
    this.appointment.saveAppointment(appointment).subscribe(response => {
      console.log('Appointment saved:', response);
      this.closeDialog();
    });
  }
}
