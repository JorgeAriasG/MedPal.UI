import { Component, Inject } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
  ConsultationWorkspaceContext,
} from '../consultation-workspace.models';
import { NutritionalAssessmentService } from 'src/app/nutrition/services/nutritional-assessment.service';
import {
  ActivityFactor,
  AssessmentGoal,
  BmrMethod,
  INutritionalAssessment,
} from 'src/app/nutrition/models';

const ACTIVITY_LABELS: Record<ActivityFactor, string> = {
  sedentary: 'Sedentario',
  light: 'Ligero',
  moderate: 'Moderado',
  active: 'Activo',
  'very-active': 'Muy activo',
};

const GOAL_LABELS: Record<AssessmentGoal, string> = {
  'weight-loss': 'Pérdida de peso',
  maintenance: 'Mantenimiento',
  'weight-gain': 'Aumento de peso',
  'muscle-gain': 'Ganancia muscular',
};

const METHOD_LABELS: Record<BmrMethod, string> = {
  'mifflin-st-jeor': 'Mifflin-St Jeor',
  'harris-benedict': 'Harris-Benedict',
  'world-health-org': 'WHO',
};

interface NutritionMacros {
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
  proteinTargetPercentage: number;
  carbsTargetPercentage: number;
  fatTargetPercentage: number;
}

@Component({
  selector: 'app-nutrition-anthropometry-step',
  templateUrl: './nutrition-anthropometry-step.component.html',
  styleUrls: ['./step-common.css', './nutrition-anthropometry-step.component.css'],
  standalone: false,
})
export class NutritionAnthropometryStepComponent {
  data: any = {};
  context: ConsultationWorkspaceContext | null = null;

  activities: ActivityFactor[] = ['sedentary', 'light', 'moderate', 'active', 'very-active'];
  goals: AssessmentGoal[] = ['weight-loss', 'maintenance', 'weight-gain', 'muscle-gain'];
  methods: BmrMethod[] = ['mifflin-st-jeor', 'harris-benedict', 'world-health-org'];

  activityFactor: ActivityFactor = 'moderate';
  method: BmrMethod = 'mifflin-st-jeor';

  result: INutritionalAssessment | null = null;

  constructor(
    @Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData,
    private assessmentService: NutritionalAssessmentService
  ) {
    this.data = step.data;
    this.context = step.context;

    this.activityFactor = (this.data.activityFactor as ActivityFactor) || 'moderate';
    this.method = (this.data.bmrMethod as BmrMethod) || 'mifflin-st-jeor';

    this.recalculate();
  }

  get goal(): AssessmentGoal {
    return (this.data.objetivo as AssessmentGoal) || 'maintenance';
  }

  get weight(): number {
    return this.data.measurements?.weight || 0;
  }

  get height(): number {
    return this.data.measurements?.height || 0;
  }

  get bmi(): number {
    return this.data.measurements?.bmi || 0;
  }

  get waist(): number {
    return this.data.waist || 0;
  }

  get hip(): number {
    return this.data.hip || 0;
  }

  get hasMeasurements(): boolean {
    return this.weight > 0 && this.height > 0;
  }

  get age(): number {
    const dob = this.context?.patient?.dob;
    if (!dob) return 0;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 0;
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    return years;
  }

  get gender(): 'male' | 'female' {
    const g = (this.context?.patient?.gender || '').toLowerCase();
    return g.startsWith('f') ? 'female' : 'male';
  }

  get whr(): number | null {
    return this.waist > 0 && this.hip > 0
      ? Number((this.waist / this.hip).toFixed(2))
      : null;
  }

  get bmiCategory(): string {
    const imc = this.bmi;
    if (!imc) return '—';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  get bmiColor(): string {
    const imc = this.bmi;
    if (!imc) return '#9e9e9e';
    if (imc < 18.5) return '#ff9800';
    if (imc < 25) return '#4caf50';
    if (imc < 30) return '#ff9800';
    return '#f44336';
  }

  get bmr(): number {
    return this.data.bmr || 0;
  }

  get caloriasDiarias(): number {
    return this.data.caloriasDiarias || 0;
  }

  get macros(): NutritionMacros | null {
    return this.data.macros || null;
  }

  get waterMl(): number {
    return this.data.waterMl || 0;
  }

  get fiber(): number {
    return this.data.fiber || 0;
  }

  setWaist(value: number): void {
    this.data.waist = value || 0;
  }

  setHip(value: number): void {
    this.data.hip = value || 0;
  }

  onGoalChange(value: AssessmentGoal): void {
    this.data.objetivo = value;
    this.recalculate();
  }

  onActivityChange(value: ActivityFactor): void {
    this.activityFactor = value;
    this.data.activityFactor = value;
    this.recalculate();
  }

  onMethodChange(value: BmrMethod): void {
    this.method = value;
    this.data.bmrMethod = value;
    this.recalculate();
  }

  recalculate(): void {
    if (!this.hasMeasurements) {
      this.result = null;
      return;
    }
    this.result = this.assessmentService.runFullAssessment(
      this.weight,
      this.height,
      this.age || 30,
      this.gender,
      this.activityFactor,
      this.goal,
      this.method
    );
    this.data.bmr = this.result.bmr;
    this.data.caloriasDiarias = this.result.totalEnergyExpenditure;
    this.data.macros = {
      proteinTargetGrams: this.result.proteinTargetGrams,
      carbsTargetGrams: this.result.carbsTargetGrams,
      fatTargetGrams: this.result.fatTargetGrams,
      proteinTargetPercentage: this.result.proteinTargetPercentage,
      carbsTargetPercentage: this.result.carbsTargetPercentage,
      fatTargetPercentage: this.result.fatTargetPercentage,
    };
    this.data.waterMl = this.result.waterTargetMl;
    this.data.fiber = this.result.fiberTargetGrams;
  }

  getActivityLabel(f: ActivityFactor): string {
    return ACTIVITY_LABELS[f];
  }

  getGoalLabel(g: AssessmentGoal): string {
    return GOAL_LABELS[g];
  }

  getMethodLabel(m: BmrMethod): string {
    return METHOD_LABELS[m];
  }
}