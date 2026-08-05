import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, from, of } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmensService } from '../services/appointmens.service';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { Store } from '@ngrx/store';
import { selectUserSpecialty } from 'src/app/store/selectors/auth.selectors';
import { SPECIALTY_CONFIG, SoapConfig, resolveSpecialty } from 'src/app/config/specialty-config';
import { SpecialtyType, TreatmentItem } from 'src/app/entities/specialty-templates.model';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { MedicalHistoryAttachmentsService } from 'src/app/services/medical-history-attachments.service';
import { MedicalHistoryWriteDTO } from 'src/app/entities/medical-history.model';
import { PendingAttachment } from 'src/app/entities/specialty-templates.model';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { IPrescription, IPrescriptionItem } from 'src/app/entities/IPrescription';

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
  userSpecialty: SpecialtyType = 'General';
  consultationData: any = {};
  patientDetailsId: number | null = null;
  antecedentsData: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmensService,
    private patientsService: PatientsService,
    private medicalHistoryService: MedicalHistoryService,
    private attachmentsService: MedicalHistoryAttachmentsService,
    private prescriptionService: PrescriptionService,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserSpecialty)
      .pipe(takeUntil(this.destroy$))
      .subscribe(specialty => {
        this.userSpecialty = (specialty as SpecialtyType) || 'General';
        this.specialtyConfig = SPECIALTY_CONFIG[resolveSpecialty(this.userSpecialty)] || SPECIALTY_CONFIG.General;
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
    this.patientsService.getPatientDetailsSummary(patientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.patientDetailsId = response.id;
          this.antecedentsData = response.antecedentsData || null;
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
          parsed.specialtyData.attachments = (parsed.specialtyData.attachments || []).filter(
            (a: PendingAttachment) => a.file
          );
          this.consultationData = parsed;
        }
      }
    } catch {}
  }

  private buildDto(): MedicalHistoryWriteDTO | null {
    if (!this.patientDetailsId) return null;
    const specialtyData = this.consultationData.specialtyData || {};

    let clinicalNotes = specialtyData.clinicalNotes || '';
    if (this.specialtyConfig.template === 'soap' && specialtyData.plan) {
      clinicalNotes = specialtyData.plan;
    }

    return {
      patientDetailsId: this.patientDetailsId,
      specialtyType: this.userSpecialty,
      diagnosis: (specialtyData.diagnosis || '').trim(),
      diagnosisDate: new Date().toISOString().split('T')[0],
      clinicalNotes: clinicalNotes || undefined,
      specialtyData: this.medicalHistoryService.serializeSpecialtyData(specialtyData),
      cie10Codes: specialtyData.cie10Codes || undefined,
      treatments: specialtyData.treatments?.length
        ? JSON.stringify(specialtyData.treatments)
        : undefined,
      isConfidential: true,
    };
  }

  completeConsultation(): void {
    if (!this.appointment) return;
    this.saving = true;

    const dto = this.buildDto();
    if (!dto) {
      this.saving = false;
      return;
    }

    if (!dto.diagnosis) {
      this.saving = false;
      this.snackBar.open('Escribe un diagnóstico para poder guardar la consulta', 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-warn',
      });
      return;
    }

    if (!dto.clinicalNotes) {
      this.saving = false;
      this.snackBar.open('Completa las Notas Clínicas para poder guardar la consulta', 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-warn',
      });
      return;
    }

    const pendingAttachments = (this.consultationData.specialtyData?.attachments || []).filter(
      (a: PendingAttachment) => a.file
    );

    this.medicalHistoryService
      .createHistory(dto)
      .pipe(
        concatMap((record) => this.uploadAttachments(record.id, pendingAttachments)),
        concatMap(() => this.appointmentService.completeConsultation(this.appointment.id)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          localStorage.removeItem(this.draftKey);
          this.saving = false;
          this.snackBar.open('Consulta guardada con éxito', 'OK', {
            duration: 3000,
            panelClass: 'cf-toast-success',
          });
        },
        error: (err) => {
          console.error('Error al completar la consulta:', err);
          this.saving = false;
          this.snackBar.open(
            'No se pudo guardar la consulta. Verifica que todos los campos requeridos estén completos.',
            'OK',
            { duration: 5000, panelClass: 'cf-toast-error' }
          );
        },
      });
  }

  generatePrescription(): void {
    const specialtyData = this.consultationData.specialtyData || {};
    const diagnosis = (specialtyData.diagnosis || '').trim();
    const treatments = Array.isArray(specialtyData.treatments) ? specialtyData.treatments : [];
    const patientId = this.appointment?.patient?.id ?? this.appointment?.patientId;

    if (!diagnosis) {
      this.snackBar.open('Escribe un diagnóstico para poder generar la receta', 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-warn',
      });
      return;
    }

    if (!treatments.length) {
      this.snackBar.open('Agrega al menos un tratamiento para poder generar la receta', 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-warn',
      });
      return;
    }

    if (!patientId) {
      this.snackBar.open('No se pudo identificar al paciente para la receta', 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-error',
      });
      return;
    }

    const items: IPrescriptionItem[] = treatments.map((t: TreatmentItem) => ({
      medicationName: (t.name || '').trim(),
      dosage: (t.dose || '').trim(),
      frequency: (t.frequency || '').trim(),
      duration: (t.duration || '').trim(),
      instructions: t.description || '',
    }));

    const incomplete = items.filter((i) => !i.medicationName || !i.dosage || !i.frequency || !i.duration);
    if (incomplete.length) {
      this.snackBar.open(
        'Completa la dosis, frecuencia y duración de todos los tratamientos para generar la receta',
        'OK',
        { duration: 5000, panelClass: 'cf-toast-warn' }
      );
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const payload: IPrescription = {
      patientId,
      diagnosis,
      items,
      notes: diagnosis,
      expiresAt,
    };

    this.prescriptionService.createPrescription(payload).subscribe({
      next: () => {
        this.snackBar.open('Receta generada con éxito', 'OK', {
          duration: 3000,
          panelClass: 'cf-toast-success',
        });
      },
      error: (err) => {
        console.error('Error al generar la receta:', err);
        this.snackBar.open('No se pudo generar la receta. Verifica los datos e inténtalo de nuevo.', 'OK', {
          duration: 5000,
          panelClass: 'cf-toast-error',
        });
      },
    });
  }

  private uploadAttachments(
    medicalHistoryId: number,
    attachments: PendingAttachment[]
  ) {
    if (!attachments.length) return of(null);
    return from(attachments).pipe(
      concatMap((attachment) =>
        this.attachmentsService.upload(medicalHistoryId, attachment.file!, attachment.type)
      )
    );
  }

  goBack(): void {
    this.router.navigate(['/appointments']);
  }
}
