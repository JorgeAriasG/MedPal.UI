import { Component, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DoctorPerformance } from 'src/app/models/report.models';

@Component({
  selector: 'app-doctor-performance-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatCardModule, MatIconModule, TranslateModule],
  template: `
    <mat-card class="table-card">
      <div class="table-header">
        <mat-icon>medical_services</mat-icon>
        <h3>{{ 'REPORTS.DOCTOR_TABLE.TITLE' | translate }}</h3>
      </div>
      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="doctorName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.DOCTOR_TABLE.DOCTOR' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.doctorName }}</td>
          </ng-container>
          <ng-container matColumnDef="specialty">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.DOCTOR_TABLE.SPECIALTY' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.specialty }}</td>
          </ng-container>
          <ng-container matColumnDef="totalAppointments">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.APPOINTMENTS' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.totalAppointments }}</td>
          </ng-container>
          <ng-container matColumnDef="completed">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.COMPLETED' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.completed }}</td>
          </ng-container>
          <ng-container matColumnDef="cancelled">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.CANCELLED' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.cancelled }}</td>
          </ng-container>
          <ng-container matColumnDef="noShow">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.NO_SHOW' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.noShow }}</td>
          </ng-container>
          <ng-container matColumnDef="completionRate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.COMPLETION_RATE' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col" [style.color]="row.completionRate < 50 ? '#EF4444' : '#10B981'">
              {{ row.completionRate }}%
            </td>
          </ng-container>
          <ng-container matColumnDef="noShowRate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.NO_SHOW_RATE' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col" [style.color]="row.noShowRate > 20 ? '#EF4444' : '#6B7280'">
              {{ row.noShowRate }}%
            </td>
          </ng-container>
          <ng-container matColumnDef="averageDuration">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.DOCTOR_TABLE.AVG_DURATION' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.averageDuration }} min</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="!dataSource.data.length" class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>{{ 'REPORTS.EMPTY' | translate }}</p>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .table-card { border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.04); margin-bottom: 24px; overflow: hidden; }
    .table-header { display: flex; align-items: center; gap: 8px; padding: 16px 24px 0; }
    .table-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
    .table-header mat-icon { color: #5B6CFF; }
    .table-wrapper { padding: 8px 16px 16px; overflow-x: auto; }
    table { width: 100%; }
    .num-col { text-align: center; width: 100px; }
    th.mat-header-cell { font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; }
    td.mat-cell { font-size: 14px; color: #111827; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 32px; color: #9CA3AF; gap: 8px; }
    .empty-state mat-icon { font-size: 40px; width: 40px; height: 40px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorPerformanceTableComponent implements AfterViewInit {
  @Input() set data(value: DoctorPerformance[]) {
    this.dataSource.data = value || [];
  }

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['doctorName', 'specialty', 'totalAppointments', 'completed', 'cancelled', 'noShow', 'completionRate', 'noShowRate', 'averageDuration'];
  dataSource = new MatTableDataSource<DoctorPerformance>([]);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
