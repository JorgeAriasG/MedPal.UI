import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IClinic } from 'src/app/entities/IClinic';
import { ClinicService } from '../services/clinic.service';

@Component({
    selector: 'app-add-clinic',
    templateUrl: './add-clinic.component.html',
    styleUrls: ['./add-clinic.component.css'],
    standalone: false
})
export class AddClinicComponent implements OnInit, OnDestroy {
  data = inject(MAT_DIALOG_DATA);
  isEdit: boolean = false;
  clinic: IClinic = {
    id: null,
    name: '',
    location: '',
    contactInfo: '',
    open: { hour: 0, minute: 0 },
    close: { hour: 0, minute: 0 }
  };
  private destroy$ = new Subject<void>();

  constructor(private clinicService: ClinicService, private dialog: MatDialog){
    this.dialog.afterOpened.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.clinic = this.data[0];
      this.isEdit = this.data[0];
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if(this.isEdit) {
      this.editClinic();
    } else {
      this.addClinic();
    }
  }

  private toHourMinute(value: any): { hour: number; minute: number } {
    if (!value) {
      return { hour: 0, minute: 0 };
    }
    if (typeof value === 'object' && value.hour != null && value.minute != null) {
      return { hour: Number(value.hour), minute: Number(value.minute) };
    }
    if (typeof value === 'string') {
      const parts = value.split(':').map(p => Number(p));
      return { hour: parts[0] || 0, minute: parts[1] || 0 };
    }
    if (value instanceof Date) {
      return { hour: value.getHours(), minute: value.getMinutes() };
    }
    return { hour: 0, minute: 0 };
  }

  addClinic(): void {
    const payload = {
      ...this.clinic,
      open: this.toHourMinute(this.clinic.open),
      close: this.toHourMinute(this.clinic.close),
    };
    this.clinicService.addClinic(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialog.closeAll(),
        error: (error) => console.error(error),
      });
  }

  editClinic(): void {
    const payload = {
      ...this.clinic,
      open: this.toHourMinute(this.clinic.open),
      close: this.toHourMinute(this.clinic.close),
    };
    this.clinicService.editClinic(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialog.closeAll(),
        error: (error) => console.error(error),
      });
  }

}
