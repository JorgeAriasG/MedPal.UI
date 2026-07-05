import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IClinic } from 'src/app/entities/IClinic';
import { ClinicService } from '../services/clinic.service';

export interface ClinicDialogData {
  clinic?: IClinic;
  isEdit: boolean;
}

@Component({
  selector: 'app-add-clinic',
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.css'],
  standalone: false,
})
export class AddClinicComponent implements OnDestroy {
  form: FormGroup;
  isEdit: boolean;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AddClinicComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ClinicDialogData,
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private snackBar: MatSnackBar,
  ) {
    this.isEdit = data?.isEdit ?? false;
    const clinic = data?.clinic;

    const [oh = 9, om = 0] = (clinic?.open ?? '9:0').split(':').map(Number);
    const [ch = 18, cm = 0] = (clinic?.close ?? '18:0').split(':').map(Number);
    this.form = this.fb.group({
      name: [clinic?.name ?? '', Validators.required],
      location: [clinic?.location ?? '', Validators.required],
      contactInfo: [clinic?.contactInfo ?? '', Validators.required],
      openHour: [oh, [Validators.required, Validators.min(0), Validators.max(23)]],
      openMinute: [om, [Validators.required, Validators.min(0), Validators.max(59)]],
      closeHour: [ch, [Validators.required, Validators.min(0), Validators.max(23)]],
      closeMinute: [cm, [Validators.required, Validators.min(0), Validators.max(59)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const v = this.form.value;
    const toHHmm = (hourVal: any, minuteVal: any): string => {
      const d = hourVal instanceof Date ? hourVal : new Date(0, 0, 0, Number(hourVal ?? 0), Number(minuteVal ?? 0));
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };
    const payload: IClinic = {
      id: this.data?.clinic?.id ?? null,
      name: v.name,
      location: v.location,
      contactInfo: v.contactInfo,
      open: toHHmm(v.openHour, v.openMinute),
      close: toHHmm(v.closeHour, v.closeMinute),
    };

    const request = this.isEdit
      ? this.clinicService.editClinic(payload)
      : this.clinicService.addClinic(payload);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        const message = err.error?.message ?? err.message ?? 'Error al guardar la clínica';
        this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
