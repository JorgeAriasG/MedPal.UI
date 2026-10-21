import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IDietPlan } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-diet-plan-detail',
  templateUrl: './diet-plan-detail.component.html',
  styleUrls: ['./diet-plan-detail.component.css'],
  standalone: false,
})
export class DietPlanDetailComponent implements OnInit, OnDestroy {
  plan: IDietPlan | null = null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nutritionService: NutritionService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = Number(params['id']);
        if (id) this.loadPlan(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlan(id: number): void {
    this.loading = true;
    this.nutritionService.getDietPlan(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((plan) => {
        this.plan = plan;
        this.loading = false;
      });
  }

  goBack(): void {
    if (this.plan) {
      this.router.navigate(['/patients/detail', this.plan.patientDetailsId]);
    } else {
      this.router.navigate(['/patients']);
    }
  }

  edit(): void {
    if (this.plan?.id) {
      this.router.navigate(['/nutrition/diet-plans/edit', this.plan.id]);
    }
  }

  print(): void {
    window.print();
  }

  mealTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'breakfast': 'Desayuno',
      'morning-snack': 'Colación matutina',
      'lunch': 'Comida',
      'afternoon-snack': 'Colación vespertina',
      'dinner': 'Cena',
      'supper': 'Merienda nocturna',
    };
    return labels[type] || type;
  }

  getMealTotalCalories(items: any[]): number {
    return items.reduce((s, i) => s + (i.calories || 0), 0);
  }
}
