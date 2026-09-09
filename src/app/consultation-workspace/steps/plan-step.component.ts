import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';
import { PendingAttachment } from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-plan-step',
  templateUrl: './plan-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class PlanStepComponent {
  data: any = {};

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
  }

  get attachments(): PendingAttachment[] {
    return Array.isArray(this.data.attachments) ? this.data.attachments : [];
  }

  onAttachmentsChange(value: PendingAttachment[]): void {
    this.data.attachments = value;
  }
}