import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  MeasurementData,
  TreatmentItem,
  PendingAttachment,
} from 'src/app/entities/specialty-templates.model';

export interface SoapData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis?: string;
  cie10Codes?: string; // JSON array string
  treatments?: TreatmentItem[];
  measurements?: MeasurementData;
  attachments?: PendingAttachment[];
}

@Component({
  selector: 'app-soap-template',
  templateUrl: './soap-template.component.html',
  styleUrls: ['./soap-template.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SoapTemplateComponent),
      multi: true,
    },
  ],
})
export class SoapTemplateComponent implements ControlValueAccessor {
  soapData: SoapData = {
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  };

  disabled = false;

  private onChange: (value: SoapData) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: SoapData): void {
    if (value) {
      this.soapData = { ...this.soapData, ...value };
    }
  }

  registerOnChange(fn: (value: SoapData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  update(): void {
    if (this.disabled) return;
    this.onChange(this.soapData);
    this.onTouched();
  }

  private diagnosisCache: { diagnosis: string; cie10Codes: string } | null = null;

  get diagnosisValue(): { diagnosis: string; cie10Codes: string } {
    const diagnosis = this.soapData.diagnosis || '';
    const cie10Codes = this.soapData.cie10Codes || '';
    if (
      !this.diagnosisCache ||
      this.diagnosisCache.diagnosis !== diagnosis ||
      this.diagnosisCache.cie10Codes !== cie10Codes
    ) {
      this.diagnosisCache = { diagnosis, cie10Codes };
    }
    return this.diagnosisCache;
  }

  onDiagnosisChange(value: { diagnosis: string; cie10Codes: string }): void {
    this.soapData.diagnosis = value.diagnosis;
    this.soapData.cie10Codes = value.cie10Codes;
    this.update();
  }

  onTreatmentsChange(value: TreatmentItem[]): void {
    this.soapData.treatments = value;
    this.update();
  }

  onMeasurementsChange(value: MeasurementData): void {
    this.soapData.measurements = value;
    this.update();
  }

  onAttachmentsChange(value: PendingAttachment[]): void {
    this.soapData.attachments = value;
    this.update();
  }
}
