import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IDietPlan } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-diet-plan-list',
  templateUrl: './diet-plan-list.component.html',
  styleUrls: ['./diet-plan-list.component.css'],
  standalone: false,
})
export class DietPlanListComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  plans: IDietPlan[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private nutritionService: NutritionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.nutritionService.getDietPlans(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.plans = data;
        this.loading = false;
      });
  }

  newPlan(): void {
    this.router.navigate(['/nutrition/diet-plans/new'], {
      queryParams: { patientDetailsId: this.patientDetailsId },
    });
  }

  viewPlan(id: number): void {
    this.router.navigate(['/nutrition/diet-plans', id]);
  }

  deletePlan(id: number): void {
    if (!confirm('¿Eliminar este plan?')) return;
    this.nutritionService.deleteDietPlan(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadData());
  }

  getTotalCalories(plan: IDietPlan): number {
    return plan.meals.reduce((sum, m) =>
      sum + m.items.reduce((s, i) => s + i.calories, 0), 0);
  }

  isActive(plan: IDietPlan): boolean {
    const now = new Date();
    const start = new Date(plan.startDate);
    const end = plan.endDate ? new Date(plan.endDate) : null;
    return plan.status === 'Active' && start <= now && (!end || end >= now);
  }
}
