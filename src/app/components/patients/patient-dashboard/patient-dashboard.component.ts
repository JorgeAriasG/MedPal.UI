import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import { selectUserSpecialty } from 'src/app/store/selectors/auth.selectors';
import { PatientsService } from '../services/patients.service';
import { ClinicalDataService } from 'src/app/services/clinical-data.service';
import { AppointmentsService } from '../../appointments/services/appointments.service';
import { HistoryFormComponent } from '../../medical-history/history-form/history-form.component';
import { fadeIn, slideDown } from 'src/app/shared/animations';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  standalone: false,
  animations: [fadeIn, slideDown],
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
  patient: IPatientDetail | null = null;
  patientDetailsId: number | null = null;
  allergies: any[] = [];
  medicalHistoryCount = 0;
  loading = true;
  error = '';
  lastWeight = 0;
  lastHeight = 0;
  lastBmi = 0;
  lastVitalDate: string | Date | null = null;
  upcomingAppointments: any[] = [];
  pastAppointments: any[] = [];
  userSpecialty: SpecialtyType = 'General';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private clinicalDataService: ClinicalDataService,
    private appointmentService: AppointmentsService,
    private dialog: MatDialog,
    private store: Store,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    }

    this.store.select(selectUserSpecialty)
      .pipe(takeUntil(this.destroy$))
      .subscribe((specialty) => {
        this.userSpecialty = (specialty as SpecialtyType) || 'General';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(id: number): void {
    this.loading = true;
    this.error = '';
    this.patientsService.getPatientDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.patientDetailsId = response.id;
          if (response.patient) {
            this.patient = response.patient;
          }
          if (response.allergies) {
            this.allergies = response.allergies;
          }
          this.medicalHistoryCount = response.medicalHistories?.length || 0;

          if (this.patientDetailsId) {
            this.loadLatestVitals(this.patientDetailsId);
          }
          this.loadAppointments(id);
          this.loading = false;
        },
        error: (err) => {
          this.error = this.translate.instant('PATIENTS.ERROR_LOAD');
          this.loading = false;
          console.error(err);
        },
      });
  }

  private loadLatestVitals(patientDetailsId: number): void {
    this.clinicalDataService.getVitalSigns(patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vitals) => {
          if (vitals.length > 0) {
            const latest = vitals[vitals.length - 1];
            this.lastWeight = latest.weight || 0;
            this.lastHeight = latest.height || 0;
            this.lastBmi = latest.bmi || 0;
            this.lastVitalDate = latest.recordedAt || null;
          }
        },
        error: (err) => console.error(err),
      });
  }

  private loadAppointments(patientId: number): void {
    this.appointmentService.getAppointmentsByPatient(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (appointments: any[]) => {
          const now = new Date();
          const upcoming: any[] = [];
          const past: any[] = [];

          (appointments || []).forEach((app) => {
            const dt = this.toDate(app);
            const isOver = !!dt && dt < now;
            const isDone = ['Completed', 'Cancelled', 'NoShow', 'completed', 'cancelled', 'no-show'].includes(app.status);
            if (isOver || isDone) {
              past.push(app);
            } else {
              upcoming.push(app);
            }
          });

          upcoming.sort((a, b) => (this.toDate(a)?.getTime() || 0) - (this.toDate(b)?.getTime() || 0));
          past.sort((a, b) => (this.toDate(b)?.getTime() || 0) - (this.toDate(a)?.getTime() || 0));

          this.upcomingAppointments = upcoming;
          this.pastAppointments = past;
        },
        error: (err) => console.error(err),
      });
  }

  private toDate(app: any): Date | null {
    const d = app?.date;
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === 'object' && d.year) {
      return new Date(d.year, (d.month || 1) - 1, d.day || 1, app.time?.hour || 0, app.time?.minute || 0);
    }
    const iso = `${d}`;
    const time = app?.time ? `${app.time}` : '';
    const dt = new Date(time ? `${iso}T${time}` : iso);
    return isNaN(dt.getTime()) ? null : dt;
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'Programada';
      case 'InProgress':
        return 'En curso';
      case 'Completed':
        return 'Completada';
      case 'Cancelled':
        return 'Cancelada';
      case 'NoShow':
        return 'No asistió';
      default:
        return status;
    }
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
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) this.loadData(this.patient!.id!);
      });
  }
}