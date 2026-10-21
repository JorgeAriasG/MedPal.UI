import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AuditReportDashboardComponent } from './audit-report-dashboard.component';

@NgModule({
  declarations: [AuditReportDashboardComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
    BaseChartDirective,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
  ],
  exports: [AuditReportDashboardComponent],
})
export class AuditReportDashboardModule {}
