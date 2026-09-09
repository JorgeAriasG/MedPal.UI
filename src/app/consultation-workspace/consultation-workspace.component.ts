import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import {
  ConsultationStepConfig,
  ConsultationWorkspaceContext,
  SpecialtyWorkspaceConfig,
} from './consultation-workspace.models';
import { resolveWorkspaceConfig } from './consultation-step-registry';

@Component({
  selector: 'app-consultation-workspace',
  templateUrl: './consultation-workspace.component.html',
  styleUrls: ['./consultation-workspace.component.css'],
  standalone: false,
})
export class ConsultationWorkspaceComponent {
  @Input() set specialty(value: SpecialtyType | string | null | undefined) {
    this.config = resolveWorkspaceConfig(value);
  }
  @Input() context: ConsultationWorkspaceContext = {
    patientDetailsId: null,
    patient: null,
    medicalHistory: [],
    prescriptions: [],
    allergies: [],
    antecedentsData: null,
    lastWeight: 0,
    lastHeight: 0,
    appointment: null,
  };
  @Input() data: any = {};

  @Output() saveDraft = new EventEmitter<void>();
  @Output() complete = new EventEmitter<void>();
  @Output() generatePrescription = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  config: SpecialtyWorkspaceConfig = resolveWorkspaceConfig('General');
  selectedStepIndex = 0;

  get currentStep(): ConsultationStepConfig | null {
    return this.config.steps[this.selectedStepIndex] || null;
  }

  onStepChange(index: number): void {
    this.selectedStepIndex = index;
  }
}