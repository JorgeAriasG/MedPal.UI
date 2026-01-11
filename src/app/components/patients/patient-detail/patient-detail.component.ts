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

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: false,
})
export class PatientDetailComponent implements OnInit {
  patient: IPatientDetail | null = null;
  prescriptions: IPrescription[] = [];
  medicalHistory: MedicalHistoryReadDTO[] = [];
  allergies: string[] = [];
  patientDetailsId: number | null = null; // Store the wrapper ID from API
  loading = true;
  error = '';
  newNote = '';
  userSpecialty: SpecialtyType = 'General';

  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private prescriptionService: PrescriptionService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    }

    // Subscribe to user specialty from store - updates when User/me endpoint loads it
    this.store.select(selectUserSpecialty).subscribe((specialty) => {
      this.userSpecialty = (specialty as SpecialtyType) || 'General';
      console.log('User specialty updated:', this.userSpecialty);
    });
  }

  loadData(id: number) {
    this.patientsService.getPatientDetails(id).subscribe({
      next: (response) => {
        // Response is a wrapper with patientDetailsId
        this.patientDetailsId = response.id;

        // Response is a wrapper, extract the actual patient data
        if (response.patient) {
          this.patient = response.patient;
        }

        // Map medicalHistories to medicalHistoryEntries if available
        if (response.medicalHistories && response.medicalHistories.length > 0) {
          this.medicalHistory = response.medicalHistories;
        }

        // Store allergies if available
        if (response.allergies && response.allergies.length > 0) {
          this.allergies = response.allergies;
        }

        this.loading = false;
        // Load prescriptions for this patient
        this.loadPrescriptions(id);
      },
      error: (err) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadPrescriptions(patientId: number) {
    this.prescriptionService.getPrescriptionsByPatient(patientId).subscribe({
      next: (data) => {
        this.prescriptions = data;
      },
      error: (err) => console.error(err),
    });
  }

  openNewConsultation(): void {
    if (!this.patient || !this.patient.id || !this.patientDetailsId) return;

    // Log for debugging
    console.log('Opening new consultation with specialty:', this.userSpecialty);
    console.log('PatientDetailsId:', this.patientDetailsId);

    const dialogRef = this.dialog.open(HistoryFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        patientDetailsId: this.patientDetailsId, // Use the wrapper ID from API
        userSpecialty: this.userSpecialty,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Reload patient data to get updated medical history
        this.loadData(this.patient!.id!);
      }
    });
  }

  saveNote() {
    if (!this.patient || !this.patient.id) return;

    const historyUpdate = {
      patientId: this.patient.id,
      notes: this.newNote,
    };

    this.patientsService.updateMedicalHistory(historyUpdate).subscribe({
      next: (res) => {
        this.newNote = '';
        this.loadData(this.patient!.id!);
      },
      error: (err) => console.error('Error saving note', err),
    });
  }
}
