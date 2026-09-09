import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';
import {
  MeasurementData,
  PendingAttachment,
  TreatmentItem,
} from 'src/app/entities/specialty-templates.model';

interface Cie10Entry {
  code: string;
}

@Component({
  selector: 'app-summary-step',
  templateUrl: './summary-step.component.html',
  styleUrls: ['./step-common.css', './summary-step.component.css'],
  standalone: false,
})
export class SummaryStepComponent {
  data: any = {};

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
  }

  get diagnosis(): string {
    return (this.data.diagnosis as string) || '';
  }

  get clinicalNotes(): string {
    return (this.data.clinicalNotes as string) || '';
  }

  get measurements(): MeasurementData | null {
    const m = this.data.measurements as MeasurementData | undefined;
    return m && (m.weight || m.height) ? m : null;
  }

  get treatments(): TreatmentItem[] {
    return Array.isArray(this.data.treatments) ? this.data.treatments : [];
  }

  get attachments(): PendingAttachment[] {
    return Array.isArray(this.data.attachments) ? this.data.attachments : [];
  }

  get cie10Codes(): string[] {
    const raw = (this.data.cie10Codes as string) || '';
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Cie10Entry[] | string[];
      if (Array.isArray(parsed)) {
        return parsed.map((e) => (typeof e === 'string' ? e : e.code)).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  }

  treatmentDetail(t: TreatmentItem): string {
    return [t.frequency, t.duration].filter(Boolean).join(' · ');
  }

  get hasNutritionAssessment(): boolean {
    return !!(this.data.caloriasDiarias || this.data.bmr);
  }

  get dailyCalories(): number {
    return this.data.caloriasDiarias || 0;
  }

  get bmr(): number {
    return this.data.bmr || 0;
  }

  get waterMl(): number {
    return this.data.waterMl || 0;
  }

  get fiber(): number {
    return this.data.fiber || 0;
  }

  get objetivoLabel(): string {
    const map: Record<string, string> = {
      'weight-loss': 'Pérdida de peso',
      maintenance: 'Mantenimiento',
      'weight-gain': 'Aumento de peso',
      'muscle-gain': 'Ganancia muscular',
    };
    return map[this.data.objetivo] || '';
  }

  get macros(): {
    proteinTargetGrams: number;
    carbsTargetGrams: number;
    fatTargetGrams: number;
  } | null {
    return this.data.macros || null;
  }

  get whr(): number | null {
    return this.data.waist > 0 && this.data.hip > 0
      ? Number((this.data.waist / this.data.hip).toFixed(2))
      : null;
  }

  get restricciones(): string[] {
    return Array.isArray(this.data.restricciones) ? this.data.restricciones : [];
  }
}