import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportFilters } from 'src/app/models/report.models';
import { IClinic } from 'src/app/entities/IClinic';


@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatDatepickerModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatNativeDateModule, TranslateModule,
  ],
  template: `
    <mat-card class="filters-card">
      <div class="filters-row" [formGroup]="filterForm">
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'REPORTS.FILTERS.DATE_RANGE' | translate }}</mat-label>
          <mat-date-range-input [rangePicker]="picker" [formGroup]="filterForm">
            <input matStartDate formControlName="dateFrom" placeholder="Desde">
            <input matEndDate formControlName="dateTo" placeholder="Hasta">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'REPORTS.FILTERS.CLINIC' | translate }}</mat-label>
          <mat-select formControlName="clinicId">
            <mat-option *ngFor="let c of clinics" [value]="c.id">{{ c.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="isAdmin" appearance="outline" subscriptSizing="dynamic">
          <mat-label>{{ 'REPORTS.FILTERS.DOCTOR' | translate }}</mat-label>
          <mat-select formControlName="doctorId">
            <mat-option [value]="null">{{ 'REPORTS.FILTERS.ALL_DOCTORS' | translate }}</mat-option>
            <mat-option *ngFor="let d of doctors" [value]="d.id">{{ d.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="filter-actions">
          <button mat-raised-button color="primary" [disabled]="isLoading" (click)="apply()">
            <mat-icon>search</mat-icon>
            {{ 'REPORTS.FILTERS.APPLY' | translate }}
          </button>
          <button mat-stroked-button [disabled]="isLoading" (click)="reset()">
            <mat-icon>refresh</mat-icon>
            {{ 'REPORTS.FILTERS.RESET' | translate }}
          </button>
          <button mat-stroked-button color="accent" [disabled]="isLoading || !canExport" (click)="exportCsv.emit()">
            <mat-icon>file_download</mat-icon>
            {{ 'REPORTS.EXPORT.CSV' | translate }}
          </button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .filters-card { padding: 16px 24px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 24px; }
    .filters-row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .filters-row mat-form-field { flex: 1; min-width: 180px; }
    .filter-actions { display: flex; gap: 8px; align-items: center; padding-top: 4px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) clinics: IClinic[] = [];
  @Input({ required: true }) doctors: any[] = [];
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) isAdmin = false;
  @Input({ required: true }) canExport = false;
  @Input() selectedClinicId: number | null = null;

  @Output() filterChange = new EventEmitter<ReportFilters>();
  @Output() exportCsv = new EventEmitter<void>();

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    this.filterForm = this.fb.group({
      dateFrom: [sevenDaysAgo],
      dateTo: [today],
      clinicId: [null],
      doctorId: [null],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canExport = this.filterForm.valid && !!this.filterForm.value.dateFrom && !!this.filterForm.value.dateTo;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedClinicId'] && this.selectedClinicId != null && this.clinics.length) {
      this.setClinic(this.selectedClinicId);
    }
  }

  setClinic(clinicId: number): void {
    this.filterForm.patchValue({ clinicId });
  }

  apply(): void {
    if (this.filterForm.invalid) return;
    this.filterChange.emit(this.filterForm.value as ReportFilters);
  }

  reset(): void {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.filterForm.setValue({
      dateFrom: sevenDaysAgo,
      dateTo: today,
      clinicId: this.clinics.length ? this.clinics[0].id : null,
      doctorId: null,
    });
    this.apply();
  }
}
