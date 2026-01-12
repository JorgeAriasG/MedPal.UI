/**
 * Audit Log Filters Component
 * Dumb (presentational) component for filter controls
 *
 * Responsibilities:
 * - Display filter form
 * - Emit filter events to parent
 * - Handle form submission and reset
 * - Display loading state
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuditLogFilter } from '../../../entities';

/**
 * Audit Log Filters Component
 * Presentational component for audit log filtering
 */
@Component({
  selector: 'app-audit-log-filters',
  templateUrl: './audit-log-filters.component.html',
  styleUrls: ['./audit-log-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AuditLogFiltersComponent implements OnInit {
  /**
   * Input: Loading state
   * Disables form controls while loading
   */
  @Input() isLoading: boolean = false;

  /**
   * Output: Filter applied
   * Emits filter criteria when user submits form
   */
  @Output() filterApply = new EventEmitter<AuditLogFilter>();

  /**
   * Output: Filter reset
   * Emits when user clicks reset button
   */
  @Output() filterReset = new EventEmitter<void>();

  /**
   * Filter form
   */
  filterForm: FormGroup;

  /**
   * Expand/collapse state
   */
  isExpanded = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.createFilterForm();
  }

  /**
   * Component lifecycle: Initialize
   */
  ngOnInit(): void {
    // Any additional initialization if needed
  }

  /**
   * Create filter form with validation
   */
  private createFilterForm(): FormGroup {
    return this.fb.group({
      dateRange: this.fb.group({
        dateFrom: ['', [Validators.required]],
        dateTo: ['', [Validators.required]],
      }),
      userId: [''],
      clinicId: [''],
      patientId: [''],
      hasConsent: [''],
      searchTerm: [''],
    });
  }

  /**
   * Handle form submission
   * Extracts form values and emits filterApply event
   */
  onSubmit(): void {
    if (this.filterForm.valid) {
      const formValue = this.filterForm.value;
      const filter: AuditLogFilter = {
        dateFrom: formValue.dateRange.dateFrom,
        dateTo: formValue.dateRange.dateTo,
        userId: formValue.userId ? parseInt(formValue.userId, 10) : undefined,
        clinicId: formValue.clinicId
          ? parseInt(formValue.clinicId, 10)
          : undefined,
        patientId: formValue.patientId
          ? parseInt(formValue.patientId, 10)
          : undefined,
        hasConsent:
          formValue.hasConsent !== ''
            ? formValue.hasConsent === 'true'
            : undefined,
        searchTerm: formValue.searchTerm || undefined,
        page: 1,
        pageSize: 25,
      };

      this.filterApply.emit(filter);
    }
  }

  /**
   * Handle filter reset
   * Clears form and emits reset event
   */
  onReset(): void {
    this.filterForm.reset();
    this.filterReset.emit();
  }

  /**
   * Toggle filter panel expansion
   */
  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Get date range form group
   */
  get dateRangeGroup(): FormGroup {
    return this.filterForm.get('dateRange') as FormGroup;
  }

  /**
   * Check if form is valid and ready to submit
   */
  get isFormValid(): boolean {
    return this.filterForm.valid;
  }
}
