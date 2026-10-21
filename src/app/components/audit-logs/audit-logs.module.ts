/**
 * Audit Logs Module
 * Feature module for audit log management
 *
 * Note: Components are now standalone and imported directly
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuditLogsPageComponent } from './audit-logs-page/audit-logs-page.component';

/**
 * Audit Logs module routes
 * Protected with AuditAccessGuard
 */
const routes: Routes = [
  {
    path: '',
    component: AuditLogsPageComponent,
  },
];

/**
 * Audit Logs Feature Module
 * Contains all audit log management components and features
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AuditLogsPageComponent,
  ],
})
export class AuditLogsModule {}
