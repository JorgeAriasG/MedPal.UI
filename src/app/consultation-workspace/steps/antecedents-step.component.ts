import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
  ConsultationWorkspaceContext,
} from '../consultation-workspace.models';

@Component({
  selector: 'app-antecedents-step',
  templateUrl: './antecedents-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class AntecedentsStepComponent {
  data: any = {};
  context: ConsultationWorkspaceContext | null = null;

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
    this.context = step.context;
  }

  get patientId(): number | null {
    return this.context?.patient?.id ?? null;
  }
}