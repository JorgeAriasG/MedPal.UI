import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DiagnosisValue {
  diagnosis: string;
  cie10Codes: string; // JSON array string: '["I10","E11.9"]'
}

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.component.html',
  styleUrls: ['./diagnoses.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DiagnosesComponent),
      multi: true,
    },
  ],
})
export class DiagnosesComponent implements ControlValueAccessor {
  @Input() label = 'Diagnóstico';
  @Input() placeholder = 'Diagnóstico principal de la consulta';

  value: DiagnosisValue = { diagnosis: '', cie10Codes: '' };
  disabled = false;

  private onChange: (value: DiagnosisValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DiagnosisValue): void {
    if (value) {
      this.value = {
        diagnosis: value.diagnosis || '',
        cie10Codes: value.cie10Codes || '',
      };
    }
  }

  registerOnChange(fn: (value: DiagnosisValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDiagnosisInput(value: string): void {
    this.value.diagnosis = value;
    this.emit();
  }

  onCie10Change(codes: string): void {
    this.value.cie10Codes = codes;
    this.emit();
  }

  private emit(): void {
    this.onChange({ ...this.value });
    this.onTouched();
  }
}
