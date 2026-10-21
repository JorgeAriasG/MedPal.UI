import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IDietPlan, IMeal, IMealItem } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-diet-plan-editor',
  templateUrl: './diet-plan-editor.component.html',
  styleUrls: ['./diet-plan-editor.component.css'],
  standalone: false,
})
export class DietPlanEditorComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  patientDetailsId!: number;
  editId: number | null = null;
  saving = false;
  loading = false;

  mealTypes: { key: string; label: string }[] = [
    { key: 'breakfast', label: 'Desayuno' },
    { key: 'morning-snack', label: 'Colación matutina' },
    { key: 'lunch', label: 'Comida' },
    { key: 'afternoon-snack', label: 'Colación vespertina' },
    { key: 'dinner', label: 'Cena' },
    { key: 'supper', label: 'Merienda nocturna' },
  ];

  searchQuery = '';
  searchResults: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private nutritionService: NutritionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      objective: [''],
      dailyCalories: [0],
      proteinGrams: [0],
      carbsGrams: [0],
      fatGrams: [0],
      fiberGrams: [0],
      waterMl: [0],
      startDate: [new Date()],
      endDate: [''],
      isActive: [true],
      meals: this.fb.array([]),
    });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.patientDetailsId = Number(params['patientDetailsId']);
        if (!this.patientDetailsId) {
          const segs = this.route.snapshot.url.map(s => s.path);
          const detailIdx = segs.indexOf('detail');
          if (detailIdx >= 0) {
            this.patientDetailsId = Number(segs[detailIdx + 1]);
          }
        }
      });

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        if (params['id']) {
          this.editId = Number(params['id']);
          this.loadPlan(this.editId);
        }
      });

    if (!this.editId) {
      this.addAllMeals();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get meals(): FormArray {
    return this.form.get('meals') as FormArray;
  }

  addAllMeals(): void {
    this.mealTypes.forEach(() => this.addMeal());
  }

  addMeal(): void {
    this.meals.push(this.fb.group({
      mealType: [''],
      time: [''],
      items: this.fb.array([]),
      instructions: [''],
    }));
  }

  removeMeal(index: number): void {
    this.meals.removeAt(index);
  }

  getMealItems(mealIndex: number): FormArray {
    return this.meals.at(mealIndex).get('items') as FormArray;
  }

  addItem(mealIndex: number): void {
    const items = this.getMealItems(mealIndex);
    items.push(this.fb.group({
      foodName: [''],
      portion: [0],
      unit: ['g'],
      calories: [0],
      proteinGrams: [0],
      carbsGrams: [0],
      fatGrams: [0],
      fiberGrams: [0],
      notes: [''],
      baseServingSize: [0],
      baseCalories: [0],
      baseProtein: [0],
      baseCarbs: [0],
      baseFat: [0],
      customUnit: [''],
    }));
  }

  removeItem(mealIndex: number, itemIndex: number): void {
    this.getMealItems(mealIndex).removeAt(itemIndex);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    if (query.length < 2) {
      this.searchResults = [];
      return;
    }
    this.nutritionService.searchFoods(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.searchResults = results.slice(0, 10);
      });
  }

  private readonly STANDARD_UNITS = ['g', 'ml', 'pieza', 'rebanada', 'taza', 'cucharada', 'unidad'];

  selectFood(food: any, mealIndex: number): void {
    const items = this.getMealItems(mealIndex);
    const unit = this.STANDARD_UNITS.includes(food.servingUnit) ? food.servingUnit : 'otra';
    const patch = {
      foodName: food.name,
      portion: food.servingSize,
      unit: unit,
      customUnit: unit === 'otra' ? food.servingUnit : '',
      calories: food.calories,
      proteinGrams: food.protein,
      carbsGrams: food.carbs,
      fatGrams: food.fat,
      fiberGrams: food.fiber || 0,
      baseServingSize: food.servingSize,
      baseCalories: food.calories,
      baseProtein: food.protein,
      baseCarbs: food.carbs,
      baseFat: food.fat,
    };
    const lastItem = items.at(items.length - 1);
    if (lastItem && !lastItem.value.foodName) {
      lastItem.patchValue(patch);
    } else {
      this.addItem(mealIndex);
      items.at(items.length - 1).patchValue(patch);
    }
    this.searchQuery = '';
    this.searchResults = [];
  }

  recalcItemMacros(): void {
    for (let m = 0; m < this.meals.length; m++) {
      const items = this.getMealItems(m);
      for (let i = 0; i < items.length; i++) {
        const itemGroup = items.at(i);
        const val = itemGroup.value;
        const baseSize = Number(val.baseServingSize) || 0;
        if (baseSize <= 0) continue;
        const ratio = (Number(val.portion) || 0) / baseSize;
        itemGroup.patchValue({
          calories: Math.round((Number(val.baseCalories) || 0) * ratio),
          proteinGrams: Math.round((Number(val.baseProtein) || 0) * ratio * 10) / 10,
          carbsGrams: Math.round((Number(val.baseCarbs) || 0) * ratio * 10) / 10,
          fatGrams: Math.round((Number(val.baseFat) || 0) * ratio * 10) / 10,
        }, { emitEvent: false });
      }
    }
  }

  recalcTotals(): void {
    let totalCals = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    for (let m = 0; m < this.meals.length; m++) {
      const items = this.getMealItems(m);
      for (let i = 0; i < items.length; i++) {
        const item = items.at(i).value;
        totalCals += Number(item.calories) || 0;
        totalProtein += Number(item.proteinGrams) || 0;
        totalCarbs += Number(item.carbsGrams) || 0;
        totalFat += Number(item.fatGrams) || 0;
        totalFiber += Number(item.fiberGrams) || 0;
      }
    }

    this.form.patchValue({
      dailyCalories: Math.round(totalCals),
      proteinGrams: Math.round(totalProtein),
      carbsGrams: Math.round(totalCarbs),
      fatGrams: Math.round(totalFat),
      fiberGrams: Math.round(totalFiber),
    }, { emitEvent: false });
  }

  private loadPlan(id: number): void {
    this.loading = true;
    this.nutritionService.getDietPlan(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((plan) => {
        this.form.patchValue({
          title: plan.name,
          description: plan.description,
          objective: plan.objective,
          dailyCalories: plan.dailyCalories,
          proteinGrams: plan.proteinG,
          carbsGrams: plan.carbsG,
          fatGrams: plan.fatG,
          fiberGrams: plan.fiberG,
          waterMl: plan.waterMl,
          startDate: new Date(plan.startDate),
          endDate: plan.endDate ? new Date(plan.endDate) : '',
          isActive: plan.status === 'Active',
        });

        this.meals.clear();
          plan.meals.forEach((meal) => {
            const mealGroup = this.fb.group({
              mealType: [meal.mealName],
              time: [meal.timeOfDay || ''],
              items: this.fb.array([]),
              instructions: [meal.instructions || ''],
            });
            const itemsArr = mealGroup.get('items') as FormArray;
            meal.items.forEach((item) => {
              const itemUnit = this.STANDARD_UNITS.includes(item.unit) ? item.unit : 'otra';
              itemsArr.push(this.fb.group({
                foodName: [item.customFoodName],
                portion: [item.quantity],
                unit: [itemUnit],
                calories: [item.calories],
                proteinGrams: [item.protein],
                carbsGrams: [item.carbs],
                fatGrams: [item.fat],
                fiberGrams: [item.fiberG || 0],
                notes: [item.notes || ''],
                baseServingSize: [item.quantity],
                baseCalories: [item.calories],
                baseProtein: [item.protein],
                baseCarbs: [item.carbs],
                baseFat: [item.fat],
                customUnit: [itemUnit === 'otra' ? item.unit : ''],
              }));
            });
            this.meals.push(mealGroup);
          });

        this.loading = false;
      });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.recalcTotals();

    const formVal = this.form.value;

    const payload: any = {
      patientDetailsId: this.patientDetailsId,
      name: formVal.title,
      description: formVal.description,
      objective: formVal.objective,
      dailyCalories: formVal.dailyCalories,
      proteinG: formVal.proteinGrams,
      carbsG: formVal.carbsGrams,
      fatG: formVal.fatGrams,
      fiberG: formVal.fiberGrams,
      waterMl: formVal.waterMl,
      startDate: formVal.startDate,
      endDate: formVal.endDate || undefined,
      status: formVal.isActive ? 'Active' : 'Draft',
      meals: formVal.meals.map((m: any) => ({
        mealName: m.mealType,
        timeOfDay: m.time,
        instructions: m.instructions,
        items: m.items.map((i: any) => ({
          customFoodName: i.foodName,
          quantity: i.portion,
          unit: i.unit === 'otra' ? i.customUnit : i.unit,
          calories: i.calories,
          protein: i.proteinGrams,
          carbs: i.carbsGrams || i.carbs,
          fat: i.fatGrams,
          fiber: i.fiberGrams,
          notes: i.notes,
        })),
      })),
    };

    const request = this.editId
      ? this.nutritionService.updateDietPlan(this.editId, payload)
      : this.nutritionService.saveDietPlan(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/patients/detail', this.patientDetailsId]);
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/patients/detail', this.patientDetailsId]);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
