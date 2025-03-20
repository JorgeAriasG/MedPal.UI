import { Component, EventEmitter, Output } from '@angular/core';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';

@Component({
    selector: 'app-new-patient',
    templateUrl: './new-patient.component.html',
    styleUrls: ['./new-patient.component.css'],
    standalone: false
})
export class NewPatientComponent {
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
    clinic: {
      id: 0,
      name: '',
      location: '',
      contactInfo: ''
    },
    clinicId: null
  };

  constructor(private patientsService: PatientsService) { }

  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior
    this.savePatient();
    this.resetForm();
  }

  async savePatient(): Promise<void> {
    try {
      await this.patientsService.savePatient(this.newPatient).subscribe((response: any) => {
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
      clinic: {
        id: 0,
        name: '',
        location: '',
        contactInfo: ''
      },
      clinicId: null
    };
  }
}
