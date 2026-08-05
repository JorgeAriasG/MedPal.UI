import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MeasurementData } from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeasurementsComponent),
      multi: true,
    },
  ],
})
export class MeasurementsComponent implements ControlValueAccessor {
  measurements: MeasurementData = { weight: 0, height: 0, bmi: 0 };
  disabled = false;

  private onChange: (value: MeasurementData) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: MeasurementData): void {
    if (value) {
      this.measurements = {
        weight: value.weight || 0,
        height: value.height || 0,
        bmi: value.bmi || 0,
      };
    }
  }

  registerOnChange(fn: (value: MeasurementData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateField(field: 'weight' | 'height', value: number): void {
    this.measurements[field] = value || 0;
    this.recalculateBmi();
    this.emit();
  }

  private recalculateBmi(): void {
    const weight = this.measurements.weight;
    const heightCm = this.measurements.height;
    if (weight > 0 && heightCm > 0) {
      const heightM = heightCm / 100;
      this.measurements.bmi = Number((weight / (heightM * heightM)).toFixed(2));
    } else {
      this.measurements.bmi = 0;
    }
  }

  getCategory(): string {
    const imc = this.measurements.bmi;
    if (!imc) return '—';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  getCategoryColor(): string {
    const imc = this.measurements.bmi;
    if (!imc) return '#9e9e9e';
    if (imc < 18.5) return '#ff9800';
    if (imc < 25) return '#4caf50';
    if (imc < 30) return '#ff9800';
    return '#f44336';
  }

  private emit(): void {
    this.onChange({ ...this.measurements });
    this.onTouched();
  }
}
