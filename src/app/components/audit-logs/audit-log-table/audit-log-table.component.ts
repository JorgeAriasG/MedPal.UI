/**
 * Audit Log Table Component
 * Dumb (presentational) component for displaying audit logs in a table
 *
 * Responsibilities:
 * - Display audit logs in a formatted table
 * - Handle pagination
 * - Show loading state
 * - Emit row selection events
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { IMedicalRecordAccessLog } from '../../../entities';

/**
 * Audit Log Table Component
 * Presentational component for displaying audit logs
 */
@Component({
  selector: 'app-audit-log-table',
  templateUrl: './audit-log-table.component.html',
  styleUrls: ['./audit-log-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
  ],
})
export class AuditLogTableComponent
  implements OnInit, AfterViewInit {
  /**
   * Input: Audit logs to display
   */
  @Input() logs: IMedicalRecordAccessLog[] = [];

  /**
   * Input: Loading state
   */
  @Input() loading: boolean = false;

  /**
   * Input: Pagination information
   */
  @Input() pagination: any | null = null;

  /**
   * Output: Page change event
   * Emits new page number when user changes page
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Output: Row selection event
   * Emits selected log when user clicks a row
   */
  @Output() rowSelect = new EventEmitter<IMedicalRecordAccessLog>();

  /**
   * Material paginator reference
   */
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  /**
   * Table columns to display
   */
  displayedColumns: string[] = [
    'accessTime',
    'userId',
    'clinicId',
    'patientId',
    'purpose',
    'hadValidConsent',
    'actions',
  ];

  constructor() {}

  /**
   * Component lifecycle: Initialize
   */
  ngOnInit(): void {
    // Additional initialization if needed
  }

  /**
   * Component lifecycle: After View Init
   * Update paginator with pagination info from store
   */
  ngAfterViewInit(): void {
    if (this.paginator && this.pagination) {
      this.paginator.pageIndex = this.pagination.page - 1;
      this.paginator.pageSize = this.pagination.pageSize;
      this.paginator.length = this.pagination.totalItems;
    }
  }

  /**
   * Handle pagination change
   * @param event Pagination change event from Material paginator
   */
  onPageChange(event: PageEvent): void {
    const newPage = event.pageIndex + 1; // Convert from 0-indexed to 1-indexed
    this.pageChange.emit(newPage);
  }

  /**
   * Handle row click
   * @param log Clicked audit log
   */
  onRowSelect(log: IMedicalRecordAccessLog): void {
    this.rowSelect.emit(log);
  }

  /**
   * Format date for display
   * @param date Date to format
   */
  formatDate(date: any): string {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  }

  /**
   * Get badge color for consent status
   * @param hasConsent Whether access had valid consent
   */
  getConsentColor(hasConsent: boolean): string {
    return hasConsent ? 'accent' : 'warn';
  }

  /**
   * Get display text for consent status
   * @param hasConsent Whether access had valid consent
   */
  getConsentText(hasConsent: boolean): string {
    return hasConsent ? 'Yes' : 'No';
  }
}
