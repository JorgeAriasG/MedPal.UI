import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  NutritionData,
  MeasurementData,
  TreatmentItem,
  PendingAttachment,
} from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-nutrition-template',
  templateUrl: './nutrition-template.component.html',
  styleUrls: ['./nutrition-template.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NutritionTemplateComponent),
      multi: true,
    },
  ],
})
export class NutritionTemplateComponent implements ControlValueAccessor {
  @Input() hideEngine = false;

  nutritionData: NutritionData = {
    peso: 0,
    altura: 0,
    imc: 0,
    objetivo: '',
    restricciones: [],
    caloriasDiarias: 0,
  };

  disabled = false;
  newRestriction = '';

  private onChange: (value: NutritionData) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: NutritionData): void {
    if (value) {
      this.nutritionData = {
        ...value,
        peso: value.peso ?? 0,
        altura: value.altura ?? 0,
        imc: value.imc ?? 0,
        objetivo: value.objetivo ?? '',
        restricciones: Array.isArray(value.restricciones) ? value.restricciones : [],
        caloriasDiarias: value.caloriasDiarias ?? 0,
      };
      if (!this.nutritionData.measurements && this.nutritionData.peso > 0 && this.nutritionData.altura > 0) {
        const heightCm = this.nutritionData.altura > 3 ? this.nutritionData.altura : this.nutritionData.altura * 100;
        this.nutritionData.measurements = {
          weight: this.nutritionData.peso,
          height: heightCm,
          bmi: this.nutritionData.imc || 0,
        };
      }
    }
  }

  registerOnChange(fn: (value: NutritionData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateField(field: 'objetivo' | 'caloriasDiarias', value: any): void {
    if (this.disabled) return;
    (this.nutritionData as any)[field] = value;
    this.emit();
  }

  onMeasurementsChange(value: MeasurementData): void {
    this.nutritionData.measurements = value;
    // Mantener compatibilidad con el contrato NutritionData legado
    this.nutritionData.peso = value.weight || 0;
    this.nutritionData.altura = value.height || 0;
    this.nutritionData.imc = value.bmi || 0;
    this.emit();
  }

  private diagnosisCache: { diagnosis: string; cie10Codes: string } | null = null;

  get diagnosisValue(): { diagnosis: string; cie10Codes: string } {
    const diagnosis = this.nutritionData.diagnosis || '';
    const cie10Codes = this.nutritionData.cie10Codes || '';
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
    this.nutritionData.diagnosis = value.diagnosis;
    this.nutritionData.cie10Codes = value.cie10Codes;
    this.emit();
  }

  onClinicalNotesChange(value: string): void {
    this.nutritionData.clinicalNotes = value;
    this.emit();
  }

  onTreatmentsChange(value: TreatmentItem[]): void {
    this.nutritionData.treatments = value;
    this.emit();
  }

  onAttachmentsChange(value: PendingAttachment[]): void {
    this.nutritionData.attachments = value;
    this.emit();
  }

  addRestriction(): void {
    if (this.disabled || !this.newRestriction.trim()) return;

    if (
      !this.nutritionData.restricciones.includes(this.newRestriction.trim())
    ) {
      this.nutritionData.restricciones.push(this.newRestriction.trim());
      this.newRestriction = '';
      this.emit();
    }
  }

  removeRestriction(restriction: string): void {
    if (this.disabled) return;

    const index = this.nutritionData.restricciones.indexOf(restriction);
    if (index >= 0) {
      this.nutritionData.restricciones.splice(index, 1);
      this.emit();
    }
  }

  private emit(): void {
    this.onChange(this.nutritionData);
    this.onTouched();
  }
}

