import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentReportRow } from 'src/app/models/report.models';

@Component({
  selector: 'app-appointment-detail-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCardModule, MatIconModule, MatChipsModule, TranslateModule],
  template: `
    <mat-card class="table-card">
      <div class="table-header">
        <mat-icon>list_alt</mat-icon>
        <h3>{{ 'REPORTS.APPOINTMENT_TABLE.TITLE' | translate }}</h3>
      </div>
      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.APPOINTMENT_TABLE.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.date }}</td>
          </ng-container>
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.APPOINTMENT_TABLE.TIME' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.time }}</td>
          </ng-container>
          <ng-container matColumnDef="patientName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.APPOINTMENT_TABLE.PATIENT' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.patientName }}</td>
          </ng-container>
          <ng-container matColumnDef="doctorName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.APPOINTMENT_TABLE.DOCTOR' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.doctorName }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'REPORTS.APPOINTMENT_TABLE.STATUS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip [class.status-completed]="row.status === 'Completed'"
                        [class.status-cancelled]="row.status === 'Cancelled'"
                        [class.status-noshow]="row.status === 'NoShow'"
                        [class.status-scheduled]="row.status === 'Scheduled'"
                        [class.status-progress]="row.status === 'InProgress'"
                        class="status-chip">
                {{ 'APPOINTMENTS.STATUS_' + row.status | translate }}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="durationMinutes">
            <th mat-header-cell *matHeaderCellDef mat-sort-header class="num-col">{{ 'REPORTS.APPOINTMENT_TABLE.DURATION' | translate }}</th>
            <td mat-cell *matCellDef="let row" class="num-col">{{ row.durationMinutes }} min</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="!dataSource.data.length" class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>{{ 'REPORTS.EMPTY' | translate }}</p>
        </div>
        <mat-paginator *ngIf="dataSource.data.length" [length]="totalItems" [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons (page)="onPageChange($event)">
        </mat-paginator>
      </div>
    </mat-card>
  `,
  styles: [`
    .table-card { border-radius: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.04); overflow: hidden; }
    .table-header { display: flex; align-items: center; gap: 8px; padding: 16px 24px 0; }
    .table-header h3 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
    .table-header mat-icon { color: #5B6CFF; }
    .table-wrapper { padding: 8px 16px 16px; overflow-x: auto; }
    table { width: 100%; }
    .num-col { text-align: center; width: 80px; }
    th.mat-header-cell { font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; }
    td.mat-cell { font-size: 14px; color: #111827; }
    .status-chip { font-size: 12px; padding: 2px 10px; border-radius: 12px; min-height: 24px; }
    .status-completed { background: rgba(16,185,129,0.12) !important; color: #059669 !important; }
    .status-cancelled { background: rgba(239,68,68,0.12) !important; color: #DC2626 !important; }
    .status-noshow { background: rgba(245,158,11,0.12) !important; color: #D97706 !important; }
    .status-scheduled { background: rgba(91,108,255,0.12) !important; color: #5B6CFF !important; }
    .status-progress { background: rgba(99,102,241,0.12) !important; color: #6366F1 !important; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 32px; color: #9CA3AF; gap: 8px; }
    .empty-state mat-icon { font-size: 40px; width: 40px; height: 40px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDetailTableComponent implements AfterViewInit {
  @Input({ required: true }) totalItems = 0;
  @Input({ required: true }) isLoading = false;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _data: AppointmentReportRow[] = [];
  @Input() set data(value: AppointmentReportRow[]) {
    this._data = value || [];
    this.dataSource.data = this._data;
    this.dataSource._updateChangeSubscription();
  }
  get data(): AppointmentReportRow[] { return this._data; }

  displayedColumns = ['date', 'time', 'patientName', 'doctorName', 'status', 'durationMinutes'];
  dataSource = new MatTableDataSource<AppointmentReportRow>([]);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
