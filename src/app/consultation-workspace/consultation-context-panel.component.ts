import { Component, Input } from '@angular/core';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { ConsultationStepConfig } from './consultation-workspace.models';

export interface AdviceItem {
  done: boolean;
  labelKey: string;
}

@Component({
  selector: 'app-consultation-context-panel',
  templateUrl: './consultation-context-panel.component.html',
  styleUrls: ['./consultation-context-panel.component.css'],
  standalone: false,
})
export class ConsultationContextPanelComponent {
  @Input() steps: ConsultationStepConfig[] = [];
  @Input() selectedIndex = 0;
  @Input() patient: IPatientDetail | null = null;
  @Input() lastWeight = 0;
  @Input() lastHeight = 0;
  @Input() allergies: any[] = [];
  @Input() specialty = 'General';
  @Input() data: any = {};

  get currentStep(): ConsultationStepConfig | null {
    return this.steps[this.selectedIndex] || null;
  }

  get completedSteps(): number {
    return Math.min(this.selectedIndex + 1, this.steps.length);
  }

  get progressPercent(): number {
    if (!this.steps.length) return 0;
    return Math.round((this.completedSteps / this.steps.length) * 100);
  }

  get remainingSteps(): number {
    return Math.max(this.steps.length - this.completedSteps, 0);
  }

  get isNutrition(): boolean {
    return this.specialty === 'Nutrition';
  }

  get nutritionChecklist(): AdviceItem[] {
    const measurements =
      this.data.measurements && this.data.measurements.weight && this.data.measurements.height;
    return [
      { done: !!measurements, labelKey: 'CONSULTATION_WORKSPACE.ADV_MEASUREMENTS' },
      { done: !!this.data.caloriasDiarias, labelKey: 'CONSULTATION_WORKSPACE.ADV_ASSESSMENT' },
      { done: !!this.data.waist, labelKey: 'CONSULTATION_WORKSPACE.ADV_ANTHROPOMETRY' },
      { done: !!this.data.clinicalNotes, labelKey: 'CONSULTATION_WORKSPACE.ADV_EVAL' },
      { done: !!this.data.diagnosis, labelKey: 'CONSULTATION_WORKSPACE.ADV_DIAGNOSIS' },
      {
        done: Array.isArray(this.data.treatments) && this.data.treatments.length > 0,
        labelKey: 'CONSULTATION_WORKSPACE.ADV_PLAN',
      },
    ];
  }
}