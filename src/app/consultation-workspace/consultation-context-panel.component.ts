import { Component, Input } from '@angular/core';
import { ConsultationStepConfig } from './consultation-workspace.models';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';

interface ContextItem {
  labelKey: string;
}

const OBJECTIVES: Record<string, ContextItem[]> = {
  Nutrition: [
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_1_NUTRITION' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_2_NUTRITION' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_3_NUTRITION' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_4_NUTRITION' },
  ],
  General: [
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_1_GENERAL' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_2_GENERAL' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_3_GENERAL' },
    { labelKey: 'CONSULTATION_WORKSPACE.OBJ_4_GENERAL' },
  ],
};

const DELIVERABLES: Record<string, ContextItem[]> = {
  Nutrition: [
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_1_NUTRITION' },
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_2_NUTRITION' },
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_3_NUTRITION' },
  ],
  General: [
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_1_GENERAL' },
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_2_GENERAL' },
    { labelKey: 'CONSULTATION_WORKSPACE.DEL_3_GENERAL' },
  ],
};

@Component({
  selector: 'app-consultation-context-panel',
  templateUrl: './consultation-context-panel.component.html',
  styleUrls: ['./consultation-context-panel.component.css'],
  standalone: false,
})
export class ConsultationContextPanelComponent {
  @Input() steps: ConsultationStepConfig[] = [];
  @Input() selectedIndex = 0;
  @Input() specialty: SpecialtyType = 'General';

  get currentStep(): ConsultationStepConfig | null {
    return this.steps[this.selectedIndex] || null;
  }

  get isNutrition(): boolean {
    return this.specialty === 'Nutrition';
  }

  get completedSteps(): number {
    return Math.min(this.selectedIndex + 1, this.steps.length);
  }

  get progressPercent(): number {
    if (this.steps.length === 0) return 0;
    return Math.round((this.completedSteps / this.steps.length) * 100);
  }

  get objectives(): ContextItem[] {
    return OBJECTIVES[this.specialty] || OBJECTIVES['General'];
  }

  get deliverables(): ContextItem[] {
    return DELIVERABLES[this.specialty] || DELIVERABLES['General'];
  }
}