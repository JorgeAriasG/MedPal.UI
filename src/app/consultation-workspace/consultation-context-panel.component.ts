import { Component, Input } from '@angular/core';
import { ConsultationStepConfig } from './consultation-workspace.models';

@Component({
  selector: 'app-consultation-context-panel',
  templateUrl: './consultation-context-panel.component.html',
  styleUrls: ['./consultation-context-panel.component.css'],
  standalone: false,
})
export class ConsultationContextPanelComponent {
  @Input() steps: ConsultationStepConfig[] = [];
  @Input() selectedIndex = 0;
  @Input() objectives: string[] = [];
  @Input() deliverables: string[] = [];

  get currentStep(): ConsultationStepConfig | null {
    return this.steps[this.selectedIndex] || null;
  }

  get completedSteps(): number {
    return Math.min(this.selectedIndex + 1, this.steps.length);
  }

  get progressPercent(): number {
    if (this.steps.length === 0) return 0;
    return Math.round((this.completedSteps / this.steps.length) * 100);
  }
}