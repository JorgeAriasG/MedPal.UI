import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IAnthropometry } from '../../models';
import { NutritionService } from '../../services/nutrition.service';
import { AnthropometryDialogComponent } from './anthropometry-dialog.component';
import { getBmiColor } from '../shared/nutrition.utils';

@Component({
  selector: 'app-anthropometry',
  templateUrl: './anthropometry.component.html',
  styleUrls: ['./anthropometry.component.css'],
  standalone: false,
})
export class AnthropometryComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  dataSource: IAnthropometry[] = [];
  loading = false;
  error = '';

  displayedColumns: string[] = [
    'recordedAt', 'weight', 'bmi', 'waistHipRatio', 'bodyFat', 'actions'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private nutritionService: NutritionService,
    private dialog: MatDialog,
    private translate: TranslateService
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
    this.error = '';
    this.nutritionService.getAnthropometry(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = this.translate.instant('NUTRITION.ERROR_LOAD_ANTHRO');
        },
      });
  }

  openDialog(entry?: IAnthropometry): void {
    const dialogRef = this.dialog.open(AnthropometryDialogComponent, {
      width: '720px',
      maxHeight: '90vh',
      data: { patientDetailsId: this.patientDetailsId, entry: entry || null },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) this.loadData();
      });
  }

  getBmiColor(bmi: number): string {
    return getBmiColor(bmi);
  }

  delete(id: number): void {
    if (!confirm(this.translate.instant('NUTRITION.CONFIRM_DELETE_ANTHRO'))) return;
    this.nutritionService.deleteAnthropometry(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadData(),
        error: () => this.error = this.translate.instant('NUTRITION.ERROR_DELETE_ANTHRO'),
      });
  }
}
