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
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import { SessionService } from 'src/app/utils/session/session.service';
import { AppointmensService } from '../services/appointmens.service';

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
  userId: string | null | undefined;
  clinicId: string | null | undefined;

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
    this.filteredPatients = this.patientForm.get('name')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.patientForm.get('name')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.patientForm.patchValue({
          lastname: '',
          email: '',
          phone: ''
        });
      }
    });
    this.getUserId();
    this.getClinicId();
  }

  private _filter(value: string): IPatient[] {
    const filterValue = value.toLowerCase();
    console.log('Filter value:', filterValue);
    return this.patients.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  selectPatient($event: MatAutocompleteActivatedEvent): void {
    console.log('Selected patient:', $event);
    if ($event.option) {
      const firstName = $event.option.value.split(' ')[0];
      const lastname = $event.option.value.split(' ')[1];
      this.selectedPatient = this.patients.find(patient => patient.name === firstName && patient.lastname === lastname);
      this.patientForm.patchValue({
        id: this.selectedPatient?.id,
        name: this.selectedPatient?.name,
        lastname: this.selectedPatient?.lastname,
        email: this.selectedPatient?.email,
        phone: this.selectedPatient?.phone
      });
      console.log('Selected patient:', this.selectedPatient);
    } else {
      console.log('No patient selected');
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
    const timeValue: Date = this.appointmentForm.get('time')?.value;

    const appointment: IAppointment = {
      patientId: this.selectedPatient?.id ?? undefined,
      userId: this.userId ?? undefined,
      clinicId: this.clinicId ?? undefined,
      status: 'Pending',
      notes: this.appointmentForm.get('notes')?.value || '',
      date: dateValue ? dateValue.toISOString().split('T')[0] : '',
      time: timeValue ? timeValue.toISOString().split('T')[1].substring(0, 5) : ''
    };
    console.log('Appointment:', appointment);
    this.appointment.saveAppointment(appointment).subscribe(response => {
      console.log('Appointment saved:', response);
      // TODO: Show a modal when dialog is closed after saving the appointment
      this.closeDialog();
    });
  }
}
