import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ReportService } from 'src/app/services/report.service';
import { TenantContextService } from 'src/app/services/tenant-context.service';
import { ClinicService } from 'src/app/components/clinics/services/clinic.service';
import { UserService } from 'src/app/components/user/services/user.service';
import { ReportFilters, ReportData } from 'src/app/models/report.models';
import { IClinic } from 'src/app/entities/IClinic';

import { ReportFiltersComponent } from '../report-filters/report-filters.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { DoctorPerformanceTableComponent } from '../doctor-performance-table/doctor-performance-table.component';
import { AppointmentDetailTableComponent } from '../appointment-detail-table/appointment-detail-table.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    CommonModule, MatProgressSpinnerModule, MatIconModule, TranslateModule,
    ReportFiltersComponent, KpiCardsComponent, DoctorPerformanceTableComponent,
    AppointmentDetailTableComponent,
  ],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <mat-icon class="header-icon">analytics</mat-icon>
        <div>
          <h1>{{ 'REPORTS.TITLE' | translate }}</h1>
          <p class="subtitle">{{ 'REPORTS.SUBTITLE' | translate }}</p>
        </div>
      </div>

      <app-report-filters
        [clinics]="clinics"
        [doctors]="doctors"
        [isLoading]="isLoading"
        [isAdmin]="isAdmin"
        [canExport]="canExport"
        [selectedClinicId]="selectedClinicId"
        (filterChange)="onFilterChange($event)"
        (exportCsv)="onExportCsv()">
      </app-report-filters>

      <div *ngIf="error" class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ error }}</span>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <ng-container *ngIf="!isLoading && data">
        <app-kpi-cards [summary]="data.summary"></app-kpi-cards>

        <app-doctor-performance-table *ngIf="isAdmin || data.doctorPerformance.length <= 1"
          [data]="data.doctorPerformance">
        </app-doctor-performance-table>

        <app-appointment-detail-table
          [data]="data.appointmentDetails"
          [totalItems]="data.totalItems"
          [isLoading]="isLoading"
          (pageChange)="onPageChange($event)">
        </app-appointment-detail-table>

        <div *ngIf="!data.totalItems && !isLoading" class="empty-state">
          <mat-icon>analytics</mat-icon>
          <p>{{ 'REPORTS.EMPTY' | translate }}</p>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .reports-page { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .page-header h1 { margin: 0; font-size: 28px; font-weight: 700; color: #111827; }
    .page-header .subtitle { margin: 2px 0 0; font-size: 14px; color: #6B7280; }
    .header-icon { font-size: 32px; width: 32px; height: 32px; color: #5B6CFF; }
    .error-banner { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(239,68,68,0.08); border-radius: 12px; color: #DC2626; margin-bottom: 16px; font-size: 14px; }
    .loading-container { display: flex; justify-content: center; padding: 64px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px; color: #9CA3AF; gap: 12px; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPageComponent implements OnInit, OnDestroy {
  clinics: IClinic[] = [];
  doctors: any[] = [];
  selectedClinicId: number | null = null;
  isAdmin = false;
  isLoading = false;
  canExport = false;
  error: string | null = null;
  data: ReportData | null = null;

  private currentFilters: ReportFilters | null = null;
  private currentUserId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private reportService: ReportService,
    private tenantContext: TenantContextService,
    private clinicService: ClinicService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.detectRole();
    this.loadClinics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private detectRole(): void {
    const context = this.tenantContext.getContext();
    const role = context?.role || '';
    const adminRoles = ['SuperAdmin', 'Admin', 'AccountAdmin', 'ClinicAdmin'];
    this.isAdmin = adminRoles.includes(role);
    this.currentUserId = context?.userId || null;
  }

  private loadClinics(): void {
    this.clinicService.getClinics().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.clinics = Array.isArray(res) ? res : [];
      if (this.clinics.length) {
        const savedClinicId = this.tenantContext.getClinicId();
        const defaultClinic = savedClinicId && this.clinics.find(c => c.id === savedClinicId)
          ? savedClinicId : (this.clinics[0].id as number);
        this.selectedClinicId = defaultClinic;
        this.loadDoctors(defaultClinic);
      }
    });
  }

  private loadDoctors(clinicId: number): void {
    const onUsers = (users: any[]) => {
      const allUsers = Array.isArray(users) ? users : [];
      this.doctors = allUsers.filter((u: any) => u.clinicId == clinicId || !u.clinicId);
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const filters: ReportFilters = {
        dateFrom: sevenDaysAgo,
        dateTo: today,
        clinicId,
        doctorId: this.isAdmin ? null : this.currentUserId,
      };
      this.currentFilters = filters;
      this.loadData(filters);
    };

    if (this.isAdmin) {
      this.userService.getUsers().pipe(
        catchError(() => of([] as any[])),
        takeUntil(this.destroy$),
      ).subscribe(onUsers);
    } else {
      const ctx = this.tenantContext.getContext();
      let doctorName = '';
      try {
        const raw = localStorage.getItem('user_data');
        if (raw) {
          const u = JSON.parse(raw);
          doctorName = u.name || '';
        }
      } catch { /* ignore */ }
      const user = ctx?.userId ? [{ id: ctx.userId, name: doctorName, clinicId }] : [];
      onUsers(user);
    }
  }

  onFilterChange(filters: ReportFilters): void {
    this.currentFilters = filters;
    this.loadData(filters);
  }

  onPageChange(_page: number): void {
    // Frontend pagination handled by MatPaginator — no reload needed
  }

  onExportCsv(): void {
    if (this.data) {
      this.reportService.exportToCsv(this.data);
    }
  }

  private loadData(filters: ReportFilters): void {
    if (!filters.clinicId || !filters.dateFrom || !filters.dateTo) return;

    this.isLoading = true;
    this.error = null;
    this.canExport = false;

    this.reportService.getReportData(
      filters.clinicId,
      filters.dateFrom,
      filters.dateTo,
      this.isAdmin ? filters.doctorId : this.currentUserId,
      this.isAdmin,
    ).pipe(
      catchError(err => {
        this.error = 'Error al cargar los reportes';
        this.isLoading = false;
        this.cdr.markForCheck();
        return of(null as unknown as ReportData);
      }),
      takeUntil(this.destroy$),
    ).subscribe(result => {
      this.isLoading = false;
      if (result) {
        this.data = result;
        this.canExport = result.totalItems > 0;
      }
      this.cdr.markForCheck();
    });
  }
}
