import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';
import { NutritionService } from 'src/app/nutrition/services/nutrition.service';
import { IFoodItem } from 'src/app/nutrition/models/food-item.model';
import { STANDARD_UNITS } from 'src/app/nutrition/components/shared/nutrition.utils';
import {
  PlanFood,
  computeFoodKcal,
  mealMomentsFor,
  normalizePlanFoods,
} from './nutrition-plan.utils';

export interface PlanMeal {
  momento: string;
  alimentos: PlanFood[];
  racion?: string;
}

const MEAL_MOMENTS: { key: string; icon: string; labelKey: string }[] = [
  { key: 'breakfast', icon: 'light_mode', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_BREAKFAST' },
  { key: 'morning-snack', icon: 'wb_sunny', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_MORNING_SNACK' },
  { key: 'lunch', icon: 'lunch_dining', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_LUNCH' },
  { key: 'afternoon-snack', icon: 'wb_twilight', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_AFTERNOON_SNACK' },
  { key: 'dinner', icon: 'nightlight', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_DINNER' },
  { key: 'supper', icon: 'bedtime', labelKey: 'CONSULTATION_WORKSPACE.PLAN_MEAL_SUPPER' },
];

@Component({
  selector: 'app-nutrition-plan-step',
  templateUrl: './nutrition-plan-step.component.html',
  styleUrls: ['./step-common.css', './nutrition-plan-step.component.css'],
  standalone: false,
})
export class NutritionPlanStepComponent implements OnDestroy {
  data: any = {};
  standardUnits = STANDARD_UNITS;
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
    const raw = Array.isArray(this.data.planComidas) ? this.data.planComidas : [];
    this.data.planComidas = raw.map((m: any) => ({
      momento: m.momento,
      alimentos: normalizePlanFoods(m.alimentos),
      racion: (m.racion as string) || '',
    }));
    this.reconcileMeals();
  }

  private reconcileMeals(): void {
    const existing = this.data.planComidas as PlanMeal[];
    const byMoment = new Map(existing.map((m) => [m.momento, m]));
    this.data.planComidas = mealMomentsFor(this.comidasDia).map((key) => {
      return (
        byMoment.get(key) || { momento: key, alimentos: [] as PlanFood[], racion: '' }
      );
    });
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

  foodKcal(food: PlanFood): number {
    return computeFoodKcal(food);
  }

  mealKcal(meal: PlanMeal): number {
    return meal.alimentos.reduce((sum, food) => sum + this.foodKcal(food), 0);
  }

  get totalKcal(): number {
    return this.meals.reduce((sum, meal) => sum + this.mealKcal(meal), 0);
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
    this.reconcileMeals();
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
    const unidad = STANDARD_UNITS.includes(food.servingUnit) ? food.servingUnit : 'unidad';
    meal.alimentos.push({
      name: food.name,
      cantidad: food.servingSize,
      unidad,
      kcalBase: food.calories,
      proteinBase: food.protein,
      carbsBase: food.carbs,
      fatBase: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
    });
    this.queries[momento] = '';
    this.results[momento] = [];
  }

  updateCantidad(food: PlanFood, value: number): void {
    food.cantidad = Number(value) || 0;
  }

  updateUnidad(food: PlanFood, value: string): void {
    food.unidad = value;
  }

  removeFood(momento: string, index: number): void {
    const meal = this.meals.find((m) => m.momento === momento);
    if (!meal) return;
    meal.alimentos.splice(index, 1);
  }
}