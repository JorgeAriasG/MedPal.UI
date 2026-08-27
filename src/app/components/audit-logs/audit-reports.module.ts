import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { AuditReportsPageComponent } from './audit-reports-page/audit-reports-page.component';
import { AuditReportFiltersModule } from './audit-report-filters/audit-report-filters.module';
import { AuditReportDashboardModule } from './audit-report-dashboard/audit-report-dashboard.module';

const routes: Routes = [
  {
    path: '',
    component: AuditReportsPageComponent,
  },
];

@NgModule({
  declarations: [AuditReportsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TranslateModule,
    AuditReportFiltersModule,
    AuditReportDashboardModule,
  ],
})
export class AuditReportsModule {}
