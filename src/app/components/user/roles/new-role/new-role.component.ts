import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RolesService } from '../services/roles.service';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.css'],
  standalone: false,
})
export class NewRoleComponent implements OnDestroy {
  @Output() roleAdded = new EventEmitter<void>();
  form: FormGroup;
  clinicId: number | null | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private store: Store
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          this.clinicId = clinicId;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newRole = {
        ...this.form.value,
      };

      this.rolesService
        .createRole(newRole)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (role) => {
            console.log('Role created:', role);
            this.form.reset();
            this.roleAdded.emit();
          },
          error: (error) => {
            console.error('Error creating role:', error);
          },
        });
    }
  }

  onCancel(): void {
    this.form.reset();
  }
}
