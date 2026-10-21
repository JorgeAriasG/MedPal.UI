import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuditLogFilter, AuditReport } from '../../../entities';
import * as AuditActions from '../../../store/audit/audit.actions';
import {
  selectAuditReport,
  selectAuditReportLoading,
  selectAuditReportError,
} from '../../../store/audit/audit.selectors';
import { AuditReportFiltersModule } from '../audit-report-filters/audit-report-filters.module';
import { AuditReportDashboardModule } from '../audit-report-dashboard/audit-report-dashboard.module';

@Component({
  selector: 'app-audit-reports-page',
  templateUrl: './audit-reports-page.component.html',
  styleUrls: ['./audit-reports-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuditReportsPageComponent implements OnInit, OnDestroy {
  private store: Store;
  private destroy$ = new Subject<void>();

  report$: Observable<AuditReport | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentFilter: AuditLogFilter | null = null;

  constructor(store: Store) {
    this.store = store;
    this.report$ = store.select(selectAuditReport);
    this.loading$ = store.select(selectAuditReportLoading);
    this.error$ = store.select(selectAuditReportError);
  }

  ngOnInit(): void {}

  onFilterApply(filter: AuditLogFilter): void {
    this.currentFilter = filter;
    this.store.dispatch(AuditActions.generateAuditReport({ filter }));
  }

  onExportCSV(): void {
    if (this.currentFilter) {
      this.store.dispatch(AuditActions.exportAuditLogs({ filter: this.currentFilter }));
    }
  }

  onFilterReset(): void {
    this.currentFilter = null;
  }

  closeError(): void {
    this.store.dispatch(AuditActions.clearAuditReportError());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
