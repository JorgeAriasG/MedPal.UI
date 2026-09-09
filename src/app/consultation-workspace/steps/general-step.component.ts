import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
  ConsultationWorkspaceContext,
} from '../consultation-workspace.models';
import { MeasurementData } from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-general-step',
  templateUrl: './general-step.component.html',
  styleUrls: ['./step-common.css', './general-step.component.css'],
  standalone: false,
})
export class GeneralStepComponent {
  data: any = {};
  context: ConsultationWorkspaceContext | null = null;

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
    this.context = step.context;
    if (!this.data.measurements) {
      this.data.measurements = { weight: 0, height: 0, bmi: 0 } as MeasurementData;
    }
  }

  get patientName(): string {
    const p = this.context?.patient;
    return p ? `${p.name} ${p.middlename} ${p.lastname}`.trim() : '';
  }

  get age(): number | null {
    const dob = this.context?.patient?.dob;
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      years--;
    }
    return years;
  }
}