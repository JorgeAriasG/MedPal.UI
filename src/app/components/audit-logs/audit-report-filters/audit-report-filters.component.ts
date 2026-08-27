import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuditLogFilter } from '../../../entities';

@Component({
  selector: 'app-audit-report-filters',
  templateUrl: './audit-report-filters.component.html',
  styleUrls: ['./audit-report-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuditReportFiltersComponent {
  @Input() isLoading: boolean = false;
  @Output() filterApply = new EventEmitter<AuditLogFilter>();
  @Output() filterReset = new EventEmitter<void>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      clinicId: [''],
      patientId: [''],
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      const formValue = this.filterForm.value;
      const filter: AuditLogFilter = {
        dateFrom: formValue.dateFrom || undefined,
        dateTo: formValue.dateTo || undefined,
        clinicId: formValue.clinicId
          ? parseInt(formValue.clinicId, 10)
          : undefined,
        patientId: formValue.patientId
          ? parseInt(formValue.patientId, 10)
          : undefined,
      };
      this.filterApply.emit(filter);
    }
  }

  onReset(): void {
    this.filterForm.reset();
    this.filterReset.emit();
  }
}
