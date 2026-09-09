import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';

@Component({
  selector: 'app-nutrition-anamnesis-step',
  templateUrl: './nutrition-anamnesis-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class NutritionAnamnesisStepComponent {
  data: any = {};

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
  }

  get motivoConsulta(): string {
    return (this.data.motivoConsulta as string) || '';
  }

  get habitosAlimentarios(): string {
    return (this.data.habitosAlimentarios as string) || '';
  }

  get restricciones(): string {
    return Array.isArray(this.data.restricciones)
      ? this.data.restricciones.join(', ')
      : '';
  }

  setMotivoConsulta(value: string): void {
    this.data.motivoConsulta = value;
  }

  setHabitosAlimentarios(value: string): void {
    this.data.habitosAlimentarios = value;
  }

  setRestricciones(value: string): void {
    this.data.restricciones = value
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);
  }
}