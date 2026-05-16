import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SoapData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
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
}
