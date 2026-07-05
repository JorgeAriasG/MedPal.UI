import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { KpiCardsComponent } from './kpi-cards/kpi-cards.component';
import { DoctorPerformanceTableComponent } from './doctor-performance-table/doctor-performance-table.component';
import { AppointmentDetailTableComponent } from './appointment-detail-table/appointment-detail-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReportsPageComponent,
    ReportFiltersComponent,
    KpiCardsComponent,
    DoctorPerformanceTableComponent,
    AppointmentDetailTableComponent,
  ],
})
export class ReportsModule {}
