import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NutritionData } from 'src/app/entities/specialty-templates.model';

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
      this.nutritionData = value;
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

  updateField(field: keyof NutritionData, value: any): void {
    if (this.disabled) return;
    (this.nutritionData as any)[field] = value;

    // Auto-calculate IMC when peso or altura changes
    if (field === 'peso' || field === 'altura') {
      this.calculateIMC();
    }

    this.onChange(this.nutritionData);
    this.onTouched();
  }

  calculateIMC(): void {
    if (this.nutritionData.peso > 0 && this.nutritionData.altura > 0) {
      const alturaMetros = this.nutritionData.altura;
      this.nutritionData.imc = Number(
        (this.nutritionData.peso / (alturaMetros * alturaMetros)).toFixed(2)
      );
    } else {
      this.nutritionData.imc = 0;
    }
  }

  addRestriction(): void {
    if (this.disabled || !this.newRestriction.trim()) return;

    if (
      !this.nutritionData.restricciones.includes(this.newRestriction.trim())
    ) {
      this.nutritionData.restricciones.push(this.newRestriction.trim());
      this.newRestriction = '';
      this.onChange(this.nutritionData);
    }
  }

  removeRestriction(restriction: string): void {
    if (this.disabled) return;

    const index = this.nutritionData.restricciones.indexOf(restriction);
    if (index >= 0) {
      this.nutritionData.restricciones.splice(index, 1);
      this.onChange(this.nutritionData);
    }
  }

  getIMCCategory(): string {
    const imc = this.nutritionData.imc;
    if (imc === 0) return '';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  getIMCColor(): string {
    const imc = this.nutritionData.imc;
    if (imc === 0) return '#9e9e9e';
    if (imc < 18.5) return '#ff9800';
    if (imc < 25) return '#4caf50';
    if (imc < 30) return '#ff9800';
    return '#f44336';
  }
}
