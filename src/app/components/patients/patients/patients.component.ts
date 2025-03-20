import { IClinic } from 'src/app/entities/IClinic';
import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import { EditModalComponent } from '../../../shared/edit-modal/edit-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: IPatient[] = [];
  addPatient: boolean = false;
  displayedColumns: string[] = ['name', 'middlename', 'lastname', 'email', 'phone', 'clinicName', 'actions'];
  editPatientId: any = null;
  editPatientData: Partial<IPatient> = {};

  constructor(private patientsService: PatientsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPatients();
  }

  addPatientToggle(): void {
    this.addPatient = !this.addPatient;
  }

  onPatientAdded(): void {
    console.log('Patient added event received'); // Debug log
    this.addPatientToggle();
    this.getPatients();
    // No need to call loadPatients as the subscription will handle updates
  }

  getPatients(): void {
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      // this.patients.forEach(patient => {
      //   if (patient.clinic == null || patient.clinic == undefined) {
      //     patient.clinic = {
      //       id: 0,
      //       name: 'No clinic',
      //       location: '',
      //       contactInfo: ''
      //     }
      //   }
      // });
      console.log('Patients loaded:', this.patients);
    });
  }

  deletePatient(id: number): void {
    this.patientsService.deletePatient(id).subscribe(res => {
      this.getPatients();
      console.log(res);
    })
  }

  // editPatient(patient: IPatient): void {
  //   this.editPatientData = { ...patient };
  //   console.log('EditPatientData: ', this.editPatientData);
  //   this.editPatientId = this.editPatientData.id;
  // }

  editPatient(patient: IPatient): void {
    this.dialog.open(EditModalComponent, {width: '400px', data: {...patient}});
  }

  saveEdit(patient: Partial<IPatient>): void {
    this.patientsService.editPatient(patient).subscribe(res => {
      this.cancelEdit();
      this.getPatients();
      console.log(res);
    });
  }

  cancelEdit(): void {
    this.editPatientId = null;
    this.editPatientData = {};
  }
}
