import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBodyComposition } from '../../models';
import { NutritionService } from '../../services/nutrition.service';
import { getBmiColor } from '../shared/nutrition.utils';

@Component({
  selector: 'app-body-composition',
  templateUrl: './body-composition.component.html',
  styleUrls: ['./body-composition.component.css'],
  standalone: false,
})
export class BodyCompositionComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  entries: IBodyComposition[] = [];
  latest: IBodyComposition | null = null;
  loading = false;
  showInBodySync = false;
  syncing = false;

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
    this.nutritionService.getBodyComposition(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.entries = data;
        this.latest = data.length > 0 ? data[data.length - 1] : null;
        this.loading = false;
      });
  }

  syncFromInBody(): void {
    this.syncing = true;
    this.nutritionService.syncInBody(this.patientDetailsId, `sync_${Date.now()}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.syncing = false;
        this.loadData();
      });
  }

  getVisceralFatLabel(level: number): string {
    if (level <= 9) return 'Normal';
    if (level <= 14) return 'Elevado';
    return 'Riesgo alto';
  }

  getVisceralFatColor(level: number): string {
    if (level <= 9) return '#10b981';
    if (level <= 14) return '#f59e0b';
    return '#ef4444';
  }

  getTrendClass(current: number, previous: number): string {
    if (previous === 0) return '';
    return current > previous ? 'trend-up' : current < previous ? 'trend-down' : '';
  }

  getTrendIcon(current: number, previous: number): string {
    if (previous === 0) return '';
    return current > previous ? 'arrow_upward' : current < previous ? 'arrow_downward' : 'remove';
  }

  previousOf(index: number): IBodyComposition | null {
    return index > 0 ? this.entries[index - 1] : null;
  }

  getBmiColor(bmi: number): string {
    return getBmiColor(bmi);
  }
}
