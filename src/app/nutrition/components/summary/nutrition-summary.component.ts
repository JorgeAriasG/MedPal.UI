import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NutritionService } from '../../services/nutrition.service';
import { IBodyComposition, INutritionProgress, INutritionalAssessment, IDietPlan } from '../../models';
import type { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-nutrition-summary',
  templateUrl: './nutrition-summary.component.html',
  styleUrls: ['./nutrition-summary.component.css'],
  standalone: false,
})
export class NutritionSummaryComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;
  @Input() readonly = false;
  @Output() startConsultation = new EventEmitter<void>();

  loading = true;
  latestBodyComp: IBodyComposition | null = null;
  progressEntries: INutritionProgress[] = [];
  latestAssessment: INutritionalAssessment | null = null;
  activeDietPlan: IDietPlan | null = null;

  weightDiff = 0;
  bmiDiff = 0;
  fatDiff = 0;

  weightChartData: ChartData<'line'> | undefined;
  weightChartOptions: ChartOptions<'line'> | undefined;
  bodyCompChartData: ChartData<'bar'> | undefined;
  bodyCompChartOptions: ChartOptions<'bar'> | undefined;

  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      latest: this.nutritionService.getLatestBodyComposition(this.patientDetailsId),
      progress: this.nutritionService.getProgress(this.patientDetailsId),
      assessment: this.nutritionService.getAssessment(this.patientDetailsId),
      dietPlans: this.nutritionService.getDietPlans(this.patientDetailsId),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.latestBodyComp = data.latest;
          this.progressEntries = data.progress;
          this.latestAssessment = data.assessment ?? null;
          this.activeDietPlan = data.dietPlans.find(dp => dp.status === 'Active') || null;
          this.computeTrends();
          this.buildChartData();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private computeTrends(): void {
    const entries = this.progressEntries;
    if (entries.length < 2) return;
    const latest = entries[0];
    const prev = entries[entries.length - 1];
    this.weightDiff = +(latest.weight - prev.weight).toFixed(1);
    this.bmiDiff = this.latestBodyComp && this.latestBodyComp.bmi
      ? +(this.latestBodyComp.bmi - (prev.weight / ((this.latestBodyComp.height || 1.7) ** 2))).toFixed(1)
      : 0;
    this.fatDiff = latest.bodyFatPercentage && prev.bodyFatPercentage
      ? +(latest.bodyFatPercentage - prev.bodyFatPercentage).toFixed(1)
      : 0;
  }

  private buildChartData(): void {
    if (this.progressEntries.length < 2) return;

    const labels = this.progressEntries.map(e =>
      new Date(e.recordedAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
    ).reverse();

    const weightValues = this.progressEntries.map(e => e.weight).reverse();
    const muscleValues = this.progressEntries.map(e => e.muscleMass || 0).reverse();
    const fatValues = this.progressEntries.map(e => e.bodyFatPercentage || 0).reverse();

    this.weightChartData = {
      labels,
      datasets: [{
        label: 'Peso (kg)',
        data: weightValues,
        borderColor: '#5B6CFF',
        backgroundColor: 'rgba(91,108,255,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }],
    };

    this.weightChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
      },
    };

    this.bodyCompChartData = {
      labels,
      datasets: [
        {
          label: 'Masa Muscular (kg)',
          data: muscleValues,
          backgroundColor: '#5B6CFF',
          borderRadius: 4,
        },
        {
          label: 'Grasa Corporal (kg)',
          data: fatValues,
          backgroundColor: '#FF6B6B',
          borderRadius: 4,
        },
      ],
    };

    this.bodyCompChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
      },
    };
  }

  onStart(): void {
    this.startConsultation.emit();
  }
}
