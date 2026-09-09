import { Component, Input } from '@angular/core';
import { ConsultationStepConfig } from './consultation-workspace.models';
import { DentalClinicalAlert, DentalExplorationSummary } from 'src/app/entities/dental-exploration.model';
import {
  FDI_ALL_TEETH,
  computeClinicalAlerts,
  computeExplorationSummary,
} from './steps/dental-exploration.utils';

interface PanelMetric {
  labelKey: string;
  value: number;
  of?: number;
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
  @Input() objectives: string[] = [];
  @Input() deliverables: string[] = [];
  @Input() specialty: string = '';
  @Input() data: any = {};

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

  /** Cards de "Resumen de exploración" y "Alertas" solo durante el paso Exploración dental. */
  get isDentalExploration(): boolean {
    return (
      this.specialty === 'Dental' &&
      this.currentStep?.key === 'exploration'
    );
  }

  get explorationSummary(): DentalExplorationSummary {
    return computeExplorationSummary(this.data);
  }

  get explorationMetrics(): PanelMetric[] {
    const s = this.explorationSummary;
    return [
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_EVALUATED', value: s.evaluated, of: FDI_ALL_TEETH.length },
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_FINDINGS', value: s.findings },
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_CARIES', value: s.caries },
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_RESTAURACIONES', value: s.restauraciones },
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_AUSENCIAS', value: s.ausencias },
      { labelKey: 'CONSULTATION_WORKSPACE.PANEL_METRIC_PERIODONTALES', value: s.periodontales },
    ];
  }

  get explorationAlerts(): DentalClinicalAlert[] {
    return computeClinicalAlerts(this.data);
  }
}