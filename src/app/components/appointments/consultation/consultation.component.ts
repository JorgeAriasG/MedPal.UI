import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppointmensService } from '../services/appointmens.service';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { ClinicalDataService } from 'src/app/services/clinical-data.service';
import { Store } from '@ngrx/store';
import { selectUserSpecialty } from 'src/app/store/selectors/auth.selectors';
import { SPECIALTY_CONFIG, SoapConfig } from 'src/app/config/specialty-config';
import { SpecialtyType, SpecialtyDataType } from 'src/app/entities/specialty-templates.model';


@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css'],
  standalone: false,
})
export class ConsultationComponent implements OnInit, OnDestroy {
  appointment: any = null;
  loading = true;
  loadingDetails = false;
  saving = false;
  error = false;
  specialtyConfig: SoapConfig = SPECIALTY_CONFIG.General;
  consultationData: any = {};
  patientDetailsId: number | null = null;
  lastWeight = 0;
  lastHeight = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmensService,
    private patientsService: PatientsService,
    private clinicalDataService: ClinicalDataService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserSpecialty)
      .pipe(takeUntil(this.destroy$))
      .subscribe(specialty => {
        this.specialtyConfig = SPECIALTY_CONFIG[specialty as SpecialtyType] || SPECIALTY_CONFIG.General;
        this.initConsultationData();
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(Number(id));
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initConsultationData(): void {
    switch (this.specialtyConfig.template) {
      case 'dental':
        this.consultationData.specialtyData = { teeth: {}, observations: '' };
        break;
      case 'nutrition':
        this.consultationData.specialtyData = { peso: 0, altura: 0, imc: 0, objetivo: '', restricciones: [], caloriasDiarias: 0 };
        break;
      case 'soap':
        this.consultationData.specialtyData = { subjective: '', objective: '', assessment: '', plan: '' };
        break;
      default:
        this.consultationData.specialtyData = { customData: '' };
    }
  }

  private loadAppointment(id: number): void {
    this.loading = true;
    this.error = false;
    this.appointmentService
      .getAppointmentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (app: any) => {
          this.appointment = app;
          this.loading = false;
          this.restoreDraft();
          this.loadPatientRelatedData(app);
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
  }

  private loadPatientRelatedData(app: any): void {
    const patientId = app.patient?.id || app.patientId;
    if (!patientId) return;

    this.loadingDetails = true;
    this.patientsService.getPatientDetails(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.patientDetailsId = response.id;
          if (response.patient) {
            this.lastWeight = response.patient.weight || 0;
            this.lastHeight = response.patient.height || 0;
          }
          this.loadingDetails = false;
        },
        error: () => {
          this.loadingDetails = false;
        },
      });
  }

  private get draftKey(): string {
    return `consultation_draft_${this.appointment?.id || 'new'}`;
  }

  saveDraft(): void {
    this.saving = true;
    try {
      localStorage.setItem(this.draftKey, JSON.stringify(this.consultationData));
    } catch {}
    setTimeout(() => {
      this.saving = false;
    }, 300);
  }

  private restoreDraft(): void {
    try {
      const saved = localStorage.getItem(this.draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.specialtyData) {
          this.consultationData = parsed;
        }
      }
    } catch {}
  }

  completeConsultation(): void {
    if (!this.appointment) return;
    this.saving = true;
    this.appointmentService
      .completeConsultation(this.appointment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          localStorage.removeItem(this.draftKey);
          this.saving = false;
          this.router.navigate(['/appointments']);
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}
