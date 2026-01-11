import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericData } from 'src/app/entities/specialty-templates.model';

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
    this.onChange(this.genericData);
    this.onTouched();
  }
}
