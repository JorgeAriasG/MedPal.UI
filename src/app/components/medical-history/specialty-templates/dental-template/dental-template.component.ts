import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DentalData,
  ToothStatus,
  ToothData,
} from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-dental-template',
  templateUrl: './dental-template.component.html',
  styleUrls: ['./dental-template.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DentalTemplateComponent),
      multi: true,
    },
  ],
})
export class DentalTemplateComponent implements ControlValueAccessor, OnInit {
  dentalData: DentalData = {
    teeth: {},
    observations: '',
  };

  selectedTooth: string | null = null;
  disabled = false;

  // Adult teeth numbers (FDI notation)
  upperTeeth = [
    '18',
    '17',
    '16',
    '15',
    '14',
    '13',
    '12',
    '11',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
  ];
  lowerTeeth = [
    '48',
    '47',
    '46',
    '45',
    '44',
    '43',
    '42',
    '41',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
  ];

  toothStatuses: {
    value: ToothStatus;
    label: string;
    color: string;
    icon: string;
  }[] = [
    { value: 'sano', label: 'Sano', color: '#4caf50', icon: 'check_circle' },
    { value: 'caries', label: 'Caries', color: '#f44336', icon: 'warning' },
    { value: 'resina', label: 'Resina', color: '#2196f3', icon: 'build' },
    { value: 'corona', label: 'Corona', color: '#ffc107', icon: 'star' },
    { value: 'ausente', label: 'Ausente', color: '#9e9e9e', icon: 'block' },
    {
      value: 'endodoncia',
      label: 'Endodoncia',
      color: '#9c27b0',
      icon: 'healing',
    },
  ];

  private onChange: (value: DentalData) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    // Initialize all teeth as 'sano' by default
    [...this.upperTeeth, ...this.lowerTeeth].forEach((toothNum) => {
      if (!this.dentalData.teeth[toothNum]) {
        this.dentalData.teeth[toothNum] = { status: 'sano' };
      }
    });
  }

  writeValue(value: DentalData): void {
    if (value) {
      this.dentalData = value;
    }
  }

  registerOnChange(fn: (value: DentalData) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectTooth(toothNumber: string): void {
    if (this.disabled) return;
    this.selectedTooth = toothNumber;
    this.onTouched();
  }

  setToothStatus(toothNumber: string, status: ToothStatus): void {
    if (this.disabled) return;

    if (!this.dentalData.teeth[toothNumber]) {
      this.dentalData.teeth[toothNumber] = { status };
    } else {
      this.dentalData.teeth[toothNumber].status = status;
    }

    this.onChange(this.dentalData);
    this.selectedTooth = null;
  }

  getToothStatus(toothNumber: string): ToothStatus {
    return this.dentalData.teeth[toothNumber]?.status || 'sano';
  }

  getToothColor(toothNumber: string): string {
    const status = this.getToothStatus(toothNumber);
    const statusConfig = this.toothStatuses.find((s) => s.value === status);
    return statusConfig?.color || '#4caf50';
  }

  getToothIcon(toothNumber: string): string {
    const status = this.getToothStatus(toothNumber);
    const statusConfig = this.toothStatuses.find((s) => s.value === status);
    return statusConfig?.icon || 'check_circle';
  }

  updateObservations(observations: string): void {
    if (this.disabled) return;
    this.dentalData.observations = observations;
    this.onChange(this.dentalData);
  }

  clearSelection(): void {
    this.selectedTooth = null;
  }
}
