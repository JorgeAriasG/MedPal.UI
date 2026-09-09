import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
  ConsultationWorkspaceContext,
} from '../consultation-workspace.models';

@Component({
  selector: 'app-evaluation-step',
  templateUrl: './evaluation-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class EvaluationStepComponent {
  data: any = {};
  context: ConsultationWorkspaceContext | null = null;

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
    this.context = step.context;
  }

  get patientDetailsId(): number | null {
    return this.context?.patientDetailsId ?? null;
  }
}