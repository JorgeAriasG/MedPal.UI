import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';

@Component({
  selector: 'app-nutrition-plan-step',
  templateUrl: './nutrition-plan-step.component.html',
  styleUrls: ['./step-common.css'],
  standalone: false,
})
export class NutritionPlanStepComponent {
  data: any = {};

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
  }

  get energia(): number {
    return Number(this.data.caloriasDiarias || 0);
  }

  get macrosLabel(): string {
    const m = this.data.macros;
    if (!m) return '—';
    const carbs = m.carbsTargetPercentage ?? 50;
    const protein = m.proteinTargetPercentage ?? 25;
    const fat = m.fatTargetPercentage ?? 25;
    return `${carbs}% carbohidratos / ${protein}% proteína / ${fat}% grasas`;
  }

  get hidratacionL(): number {
    if (this.data.planHidratacionL != null) return Number(this.data.planHidratacionL);
    if (this.data.waterMl) return Math.round((this.data.waterMl / 1000) * 10) / 10;
    return 0;
  }

  setHidratacion(value: number): void {
    this.data.planHidratacionL = Number(value);
  }

  get comidasDia(): number {
    return this.data.planComidasDia || 4;
  }

  setComidasDia(value: number): void {
    this.data.planComidasDia = Number(value);
  }

  get indicaciones(): string {
    return this.data.planIndicaciones || '';
  }

  setIndicaciones(value: string): void {
    this.data.planIndicaciones = value;
  }
}