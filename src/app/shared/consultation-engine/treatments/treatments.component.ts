import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TreatmentItem } from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreatmentsComponent),
      multi: true,
    },
  ],
})
export class TreatmentsComponent implements ControlValueAccessor {
  treatments: TreatmentItem[] = [];
  disabled = false;

  newName = '';
  newDescription = '';
  newDose = '';
  newFrequency = '';
  newDuration = '';

  private onChange: (value: TreatmentItem[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: TreatmentItem[]): void {
    this.treatments = Array.isArray(value) ? [...value] : [];
  }

  registerOnChange(fn: (value: TreatmentItem[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  add(): void {
    const name = this.newName.trim();
    if (!name || this.disabled) return;
    this.treatments = [
      ...this.treatments,
      {
        name,
        description: this.newDescription.trim() || undefined,
        dose: this.newDose.trim() || undefined,
        frequency: this.newFrequency.trim() || undefined,
        duration: this.newDuration.trim() || undefined,
      },
    ];
    this.newName = '';
    this.newDescription = '';
    this.newDose = '';
    this.newFrequency = '';
    this.newDuration = '';
    this.emit();
  }

  remove(index: number): void {
    if (this.disabled) return;
    this.treatments = this.treatments.filter((_, i) => i !== index);
    this.emit();
  }

  private emit(): void {
    this.onChange([...this.treatments]);
    this.onTouched();
  }
}
