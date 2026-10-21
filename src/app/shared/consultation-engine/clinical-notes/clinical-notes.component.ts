import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-clinical-notes',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClinicalNotesComponent),
      multi: true,
    },
  ],
})
export class ClinicalNotesComponent implements ControlValueAccessor {
  @Input() label = 'Notas Clínicas';
  @Input() placeholder = 'Describe la evolución, hallazgos y plan...';
  @Input() rows = 4;
  @Input() required = false;

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
