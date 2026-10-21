import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentSummary } from 'src/app/models/report.models';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule],
  template: `
    <div class="kpi-grid">
      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon total">calendar_month</mat-icon>
        <div class="kpi-value">{{ summary.totalAppointments }}</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.TOTAL_APPOINTMENTS' | translate }}</div>
      </mat-card>

      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon completed">check_circle</mat-icon>
        <div class="kpi-value">{{ summary.completed }}</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.COMPLETED' | translate }}</div>
      </mat-card>

      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon cancelled">cancel</mat-icon>
        <div class="kpi-value">{{ summary.cancelled }}</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.CANCELLED' | translate }}</div>
      </mat-card>

      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon noshow">person_off</mat-icon>
        <div class="kpi-value">{{ summary.noShow }}</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.NO_SHOW' | translate }}</div>
      </mat-card>

      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon rate completion">trending_up</mat-icon>
        <div class="kpi-value">{{ summary.completionRate }}%</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.COMPLETION_RATE' | translate }}</div>
      </mat-card>

      <mat-card class="kpi-card">
        <mat-icon class="kpi-icon rate noshow-rate">trending_down</mat-icon>
        <div class="kpi-value">{{ summary.noShowRate }}%</div>
        <div class="kpi-label">{{ 'REPORTS.KPIS.NO_SHOW_RATE' | translate }}</div>
      </mat-card>
    </div>
  `,
  styles: [`
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { padding: 20px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.04); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
    .kpi-icon { font-size: 28px; width: 28px; height: 28px; margin-bottom: 4px; }
    .kpi-icon.total { color: #5B6CFF; }
    .kpi-icon.completed { color: #10B981; }
    .kpi-icon.cancelled { color: #EF4444; }
    .kpi-icon.noshow { color: #F59E0B; }
    .kpi-icon.rate { color: #6366F1; }
    .kpi-icon.completion { color: #10B981; }
    .kpi-icon.noshow-rate { color: #F59E0B; }
    .kpi-value { font-size: 28px; font-weight: 700; color: #111827; line-height: 1.2; }
    .kpi-label { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardsComponent {
  @Input({ required: true }) summary!: AppointmentSummary;
}
