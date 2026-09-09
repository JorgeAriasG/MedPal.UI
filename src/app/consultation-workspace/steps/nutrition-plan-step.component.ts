import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';
import { NutritionService } from 'src/app/nutrition/services/nutrition.service';
import { IFoodItem } from 'src/app/nutrition/models/food-item.model';

export interface PlanMeal {
  momento: string;
  alimentos: string[];
  racion?: string;
}

const MEAL_MOMENTS: { key: string; icon: string; labelKey: string }[] = [
  { key: 'breakfast', icon: 'light_mode', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_BREAKFAST' },
  { key: 'morning-snack', icon: 'wb_sunny', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_MORNING_SNACK' },
  { key: 'lunch', icon: 'lunch_dining', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_LUNCH' },
  { key: 'afternoon-snack', icon: 'wb_twilight', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_AFTERNOON_SNACK' },
  { key: 'dinner', icon: 'nightlight', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_DINNER' },
];

@Component({
  selector: 'app-nutrition-plan-step',
  templateUrl: './nutrition-plan-step.component.html',
  styleUrls: ['./step-common.css', './nutrition-plan-step.component.css'],
  standalone: false,
})
export class NutritionPlanStepComponent implements OnDestroy {
  data: any = {};
  mealMoments = MEAL_MOMENTS;
  queries: Record<string, string> = {};
  results: Record<string, IFoodItem[]> = {};
  loading: Record<string, boolean> = {};

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData,
    private nutritionService: NutritionService
  ) {
    this.data = step.data;
    this.seedMeals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private seedMeals(): void {
    if (!Array.isArray(this.data.planComidas) || this.data.planComidas.length === 0) {
      this.data.planComidas = MEAL_MOMENTS.map((m) => ({
        momento: m.key,
        alimentos: [],
        racion: '',
      }));
    }
  }

  get meals(): PlanMeal[] {
    return this.data.planComidas || [];
  }

  momentInfo(momento: string): { icon: string; labelKey: string } {
    return (
      MEAL_MOMENTS.find((m) => m.key === momento) || {
        icon: 'restaurant',
        labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_LUNCH',
      }
    );
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

  search(momento: string, query: string): void {
    this.queries[momento] = query;
    if (query.trim().length < 2) {
      this.results[momento] = [];
      return;
    }
    this.loading[momento] = true;
    this.nutritionService
      .searchFoods(query.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (foods) => {
          this.results[momento] = foods.slice(0, 8);
          this.loading[momento] = false;
        },
        error: () => {
          this.results[momento] = [];
          this.loading[momento] = false;
        },
      });
  }

  selectFood(momento: string, food: IFoodItem): void {
    const meal = this.meals.find((m) => m.momento === momento);
    if (!meal) return;
    const label = food.servingSize
      ? `${food.name} · ${food.servingSize} ${food.servingUnit}`
      : food.name;
    if (!meal.alimentos.includes(label)) {
      meal.alimentos.push(label);
    }
    this.queries[momento] = '';
    this.results[momento] = [];
  }

  removeFood(momento: string, index: number): void {
    const meal = this.meals.find((m) => m.momento === momento);
    if (!meal) return;
    meal.alimentos.splice(index, 1);
  }
}