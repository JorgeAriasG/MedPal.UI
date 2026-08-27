import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuditReportsPageComponent } from './audit-reports-page/audit-reports-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuditReportsPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AuditReportsPageComponent,
  ],
})
export class AuditReportsModule {}
