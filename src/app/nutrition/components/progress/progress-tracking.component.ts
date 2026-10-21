import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INutritionProgress } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-progress-tracking',
  templateUrl: './progress-tracking.component.html',
  styleUrls: ['./progress-tracking.component.css'],
  standalone: false,
})
export class ProgressTrackingComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  entries: INutritionProgress[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.nutritionService.getProgress(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.entries = data;
        this.loading = false;
      });
  }

  getTrend(entry: INutritionProgress, index: number): { weight: number; fat: number; muscle: number } {
    if (index >= this.entries.length - 1) {
      return { weight: 0, fat: 0, muscle: 0 };
    }
    const prev = this.entries[index + 1];
    return {
      weight: +(entry.weight - prev.weight).toFixed(1),
      fat: +( (entry.bodyFatPercentage || 0) - (prev.bodyFatPercentage || 0) ).toFixed(1),
      muscle: +( (entry.muscleMass || 0) - (prev.muscleMass || 0) ).toFixed(1),
    };
  }

  getTrendIcon(value: number): string {
    if (value === 0) return 'remove';
    return value > 0 ? 'arrow_upward' : 'arrow_downward';
  }

  getTrendClass(value: number, reverse = false): string {
    if (value === 0) return '';
    const isGood = reverse ? value < 0 : value > 0;
    return isGood ? 'trend-good' : 'trend-bad';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
