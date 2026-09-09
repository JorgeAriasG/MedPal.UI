import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';

interface DiagnosisValue {
  diagnosis: string;
  cie10Codes: string;
}

@Component({
  selector: 'app-diagnosis-step',
  templateUrl: './diagnosis-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class DiagnosisStepComponent {
  data: any = {};

  private diagnosisCache: DiagnosisValue | null = null;

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
  }

  get diagnosisValue(): DiagnosisValue {
    const diagnosis = (this.data.diagnosis as string) || '';
    const cie10Codes = (this.data.cie10Codes as string) || '';
    if (
      !this.diagnosisCache ||
      this.diagnosisCache.diagnosis !== diagnosis ||
      this.diagnosisCache.cie10Codes !== cie10Codes
    ) {
      this.diagnosisCache = { diagnosis, cie10Codes };
    }
    return this.diagnosisCache;
  }

  onDiagnosisChange(value: DiagnosisValue): void {
    this.data.diagnosis = value.diagnosis;
    this.data.cie10Codes = value.cie10Codes;
  }
}