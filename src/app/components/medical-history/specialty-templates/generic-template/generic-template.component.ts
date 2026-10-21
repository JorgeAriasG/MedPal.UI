import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  GenericData,
  MeasurementData,
  TreatmentItem,
  PendingAttachment,
} from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-generic-template',
  templateUrl: './generic-template.component.html',
  styleUrls: ['./generic-template.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericTemplateComponent),
      multi: true,
    },
  ],
})
export class GenericTemplateComponent implements ControlValueAccessor {
  @Input() hideEngine = false;

  genericData: GenericData = {
    customData: '',
  };

  disabled = false;

  private onChange: (value: GenericData) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: GenericData): void {
    if (value) {
      this.genericData = value;
    }
  }

  registerOnChange(fn: (value: GenericData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateData(value: string): void {
    if (this.disabled) return;
    this.genericData.customData = value;
    this.emit();
  }

  private diagnosisCache: { diagnosis: string; cie10Codes: string } | null = null;

  get diagnosisValue(): { diagnosis: string; cie10Codes: string } {
    const diagnosis = this.genericData.diagnosis || '';
    const cie10Codes = this.genericData.cie10Codes || '';
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
    this.genericData.diagnosis = value.diagnosis;
    this.genericData.cie10Codes = value.cie10Codes;
    this.emit();
  }

  onClinicalNotesChange(value: string): void {
    this.genericData.clinicalNotes = value;
    this.emit();
  }

  onTreatmentsChange(value: TreatmentItem[]): void {
    this.genericData.treatments = value;
    this.emit();
  }

  onMeasurementsChange(value: MeasurementData): void {
    this.genericData.measurements = value;
    this.emit();
  }

  onAttachmentsChange(value: PendingAttachment[]): void {
    this.genericData.attachments = value;
    this.emit();
  }

  private emit(): void {
    this.onChange(this.genericData);
    this.onTouched();
  }
}
