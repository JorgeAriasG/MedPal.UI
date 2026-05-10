import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { IPrescription } from 'src/app/entities/IPrescription';
import { HistoryFormComponent } from '../../medical-history/history-form/history-form.component';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import { selectUserSpecialty } from 'src/app/store/selectors/auth.selectors';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { fadeIn, slideDown } from 'src/app/shared/animations';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: false,
  animations: [fadeIn, slideDown]
})
export class PatientDetailComponent implements OnInit {
  patient: IPatientDetail | null = null;
  prescriptions: IPrescription[] = [];
  medicalHistory: MedicalHistoryReadDTO[] = [];
  allergies: any[] = [];
  patientDetailsId: number | null = null;
  loading = true;
  error = '';
  newNote = '';
  userSpecialty: SpecialtyType = 'General';

  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private prescriptionService: PrescriptionService,
    private medicalHistoryService: MedicalHistoryService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    }

    this.store.select(selectUserSpecialty).subscribe((specialty) => {
      this.userSpecialty = (specialty as SpecialtyType) || 'General';
    });
  }

  loadData(id: number) {
    this.patientsService.getPatientDetails(id).subscribe({
      next: (response) => {
        this.patientDetailsId = response.id;
        if (response.patient) {
          this.patient = response.patient;
        }
        if (response.medicalHistories) {
          this.medicalHistory = response.medicalHistories;
        }
        if (response.allergies) {
          this.allergies = response.allergies;
        }
        
        this.loading = false;
        this.loadPrescriptions(id);
        if (this.patientDetailsId) {
          this.loadMedicalHistory(this.patientDetailsId);
        }
      },
      error: (err) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadMedicalHistory(patientDetailsId: number) {
    this.medicalHistoryService.getPatientHistory(patientDetailsId).subscribe({
      next: (data) => this.medicalHistory = data,
      error: (err) => console.error(err),
    });
  }

  loadPrescriptions(patientId: number) {
    this.prescriptionService.getPrescriptionsByPatient(patientId).subscribe({
      next: (data) => this.prescriptions = data,
      error: (err) => console.error(err),
    });
  }

  openNewConsultation(): void {
    if (!this.patient || !this.patient.id || !this.patientDetailsId) return;
    const dialogRef = this.dialog.open(HistoryFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        patientDetailsId: this.patientDetailsId,
        userSpecialty: this.userSpecialty,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadData(this.patient!.id!);
    });
  }

  saveNote() {
    if (!this.patient || !this.patient.id) return;
    const historyUpdate = { patientId: this.patient.id, notes: this.newNote };
    this.patientsService.updateMedicalHistory(historyUpdate).subscribe({
      next: () => {
        this.newNote = '';
        this.loadData(this.patient!.id!);
      },
      error: (err) => console.error(err),
    });
  }
}
