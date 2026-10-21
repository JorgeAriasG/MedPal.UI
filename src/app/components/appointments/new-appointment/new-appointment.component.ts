import { IAppointment } from './../../../entities/IAppointment';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  appointmentFormConfig,
  patientFormConfig,
} from 'src/app/conf/form-config';
import { IPatient } from 'src/app/entities/IPatient';
import { createFormGroupFromConfig } from 'src/app/shared/utils/form-utils';
import { PatientsService } from '../../patients/services/patients.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { debounceTime, switchMap, map, startWith, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import {
  MatAutocompleteActivatedEvent,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AppointmentsService } from '../services/appointments.service';
import {
  toDateOnlyObject,
  toTimeObject,
} from 'src/app/shared/utils/date-utils';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  selectAuthContext,
} from 'src/app/store/selectors/auth.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { BookingService, BookingLinkResponse } from 'src/app/services/booking.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css'],
  standalone: false,
})
export class NewAppointmentComponent implements OnInit, OnDestroy {
  // @Output() closedDialog = new EventEmitter<void>();
  appointmentForm: FormGroup;
  patientForm: FormGroup;
  patients: IPatient[] = [];
  filteredPatients: Observable<IPatient[]> | undefined;
  selectedPatient: IPatient | undefined;
  userId: number | null | undefined;
  clinicId: number | null | undefined;
  isEditMode = false;
  isLoading = false;
  linkLoading = false;
  appointmentId: number | undefined;
  statusOptions: any[] = [];
  clinicOpen: { hour: number; minute: number } | null = null;
  clinicClose: { hour: number; minute: number } | null = null;
  availableSlots: { hour: number; minute: number; label: string }[] = [];
  existingAppointments: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<NewAppointmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private appointmentService: AppointmentsService,
    private bookingService: BookingService,
    private store: Store,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.patientForm = createFormGroupFromConfig(this.fb, patientFormConfig);
    this.appointmentForm = createFormGroupFromConfig(
      this.fb,
      appointmentFormConfig
    );
    this.statusOptions = appointmentFormConfig['status'].options || [];
    this.patientForm.get('lastname')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('phone')?.disable();

    this.clinicId = this.dialogData?.clinicId ?? null;

    if (this.dialogData?.appointment) {
      this.isEditMode = true;
      this.appointmentId = this.dialogData.appointment.id;
    }
  }

  ngOnInit(): void {
    this.store
      .select(selectAuthContext)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId, clinicId, clinicOpen, clinicClose }) => {
        this.userId = userId;
        if (clinicId) {
          this.clinicId = clinicId;
        }
        this.clinicOpen = clinicOpen;
        this.clinicClose = clinicClose;
        this.getPatients();
        this.generateSlots();
      });

    this.appointmentForm.get('durationMinutes')?.setValue(30);
    this.appointmentForm.get('durationMinutes')?.disable();

    this.appointmentForm.get('date')?.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((date) => {
        this.loadDayAppointments(date);
      });

    this.filteredPatients = this.patientForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.patientForm
      .get('name')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === '' && !this.isEditMode) {
          this.patientForm.patchValue({
            lastname: '',
            email: '',
            phone: '',
          });
          this.selectedPatient = undefined;
        }
      });

    if (this.isEditMode) {
      this.setEditData();
    }

    const initialDate = this.appointmentForm.get('date')?.value;
    if (initialDate) {
      this.loadDayAppointments(initialDate);
    }
  }

  setEditData(): void {
    const app = this.dialogData.appointment;
    this.selectedPatient = app.patient;
    
    const [y, mo, d] = app.date.split('-').map(Number);
    const date = new Date(y, mo - 1, d);
    const [h, m] = app.time.split(':');

    this.appointmentForm.patchValue({
      date: date,
      time: { hour: parseInt(h), minute: parseInt(m) },
      status: app.status,
      notes: app.notes,
      durationMinutes: app.durationMinutes || 30,
    });

    if (app.patient) {
      this.patientForm.patchValue({
        id: app.patient.id,
        name: app.patient,
        lastname: app.patient.lastname,
        email: app.patient.email,
        phone: app.patient.phone,
      });
      this.patientForm.get('name')?.disable(); // Can't change patient on edit
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayFn(patient: IPatient): string {
    return patient ? `${patient.name} ${patient.lastname}` : '';
  }

  private _filter(value: any): IPatient[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    if (!filterValue) return this.patients;
    
    return this.patients.filter((option) =>
      (option.name + ' ' + option.lastname).toLowerCase().includes(filterValue)
    );
  }

  selectPatient(event: MatAutocompleteSelectedEvent): void {
    const patient: IPatient = event.option.value;
    this.selectedPatient = patient;
    
    if (this.selectedPatient) {
      this.patientForm.patchValue({
        id: this.selectedPatient.id,
        name: this.selectedPatient,
        lastname: this.selectedPatient.lastname,
        email: this.selectedPatient.email,
        phone: this.selectedPatient.phone,
      });
    }
  }

  closeDialog(refresh: boolean = false): void {
    this.dialogRef.close(refresh);
  }

  saveAppointment(): void {
    if (this.appointmentForm.invalid || (!this.selectedPatient && !this.isEditMode)) {
      this.snackBar.open(this.translate.instant('ERRORS.INVALID_FORM'), this.translate.instant('COMMON.CLOSE'), { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const dateValue: Date = this.appointmentForm.get('date')?.value;
    const timeValue: any = this.appointmentForm.get('time')?.value;

    const appointment: IAppointment = {
      id: this.appointmentId,
      patientId: this.selectedPatient?.id ?? undefined,
      userId: this.userId ?? undefined,
      clinicId: this.clinicId ?? undefined,
      status: this.appointmentForm.get('status')?.value,
      notes: this.appointmentForm.get('notes')?.value || '',
      date: toDateOnlyObject(dateValue)!,
      time: toTimeObject(timeValue)!,
      durationMinutes: 30,
    };

    const request = this.isEditMode 
      ? this.appointmentService.updateAppointment(appointment, this.appointmentId!)
      : this.appointmentService.saveAppointment(appointment);

    request.pipe(
      takeUntil(this.destroy$),
      catchError((error: HttpErrorResponse) => {
        this.isLoading = false;
        let message = 'An error occurred while saving the appointment.';
        
        if (error.status === 400 && error.error?.errors) {
          // FluentValidation errors
          const validationErrors = error.error.errors;
          message = Object.values(validationErrors).flat().join(' ') || message;
        } else if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.error?.message) {
          message = error.error.message;
        }

        this.snackBar.open(message, this.translate.instant('COMMON.CLOSE'), { duration: 5000, panelClass: ['error-snackbar'] });
        return of(null);
      })
    ).subscribe((response) => {
      if (response !== null) {
        this.isLoading = false;
        this.snackBar.open(
          this.isEditMode ? this.translate.instant('APPOINTMENTS.SNACKBAR_SUCCESS_UPDATE') : this.translate.instant('APPOINTMENTS.SNACKBAR_SUCCESS_CREATE'), 
          this.translate.instant('COMMON.ACCEPT'), 
          { duration: 3000 }
        );
        this.closeDialog(true);
      }
    });
  }

  private loadDayAppointments(date: Date | null): void {
    if (!date || !this.clinicId) {
      this.existingAppointments = [];
      this.generateSlots();
      return;
    }

    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${mo}-${d}`;

    this.appointmentService
      .getAppointments(Number(this.clinicId), dateStr)
      .pipe(takeUntil(this.destroy$))
      .subscribe((apps: any) => {
        this.existingAppointments = apps || [];
        this.generateSlots();
      });
  }

  private generateSlots(): void {
    if (!this.clinicOpen || !this.clinicClose) {
      this.availableSlots = [];
      return;
    }

    const slots: { hour: number; minute: number; label: string }[] = [];
    for (let h = this.clinicOpen.hour; h <= this.clinicClose.hour; h++) {
      const minStart = h === this.clinicOpen.hour ? this.clinicOpen.minute : 0;
      const minEnd = h === this.clinicClose.hour ? this.clinicClose.minute : 60;

      for (let m = minStart; m < minEnd; m += 30) {
        const slotStart = h * 60 + m;
        const slotEnd = slotStart + 30;

        const occupied = this.existingAppointments.some((a) => {
          if (this.isEditMode && a.id === this.appointmentId) return false;
          const aH = a.time?.hour ?? Number(a.time?.split(':')[0]);
          const aM = a.time?.minute ?? Number(a.time?.split(':')[1]);
          const appStart = aH * 60 + aM;
          const appEnd = appStart + (a.durationMinutes || 30);
          return slotStart < appEnd && slotEnd > appStart;
        });

        if (!occupied) {
          slots.push({
            hour: h,
            minute: m,
            label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          });
        }
      }
    }

    this.availableSlots = slots;
  }

  getPatients(): void {
    this.patientService
      .getPatients(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients: IPatient[]) => {
        this.patients = patients;
      });
  }

  generateBookingLink(): void {
    if (!this.clinicId || !this.userId) {
      this.snackBar.open(
        this.translate.instant('APPOINTMENTS.LINK_REQUIRED_CONTEXT'),
        this.translate.instant('COMMON.CLOSE'),
        { duration: 3000 }
      );
      return;
    }

    this.linkLoading = true;
    this.bookingService
      .generateStaffLink(this.clinicId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: BookingLinkResponse) => {
          this.linkLoading = false;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(res.url).catch(() => undefined);
          }
          this.snackBar.open(
            this.translate.instant('APPOINTMENTS.LINK_COPIED'),
            this.translate.instant('COMMON.ACCEPT'),
            { duration: 4000 }
          );
        },
        error: () => {
          this.linkLoading = false;
          this.snackBar.open(
            this.translate.instant('APPOINTMENTS.LINK_ERROR'),
            this.translate.instant('COMMON.CLOSE'),
            { duration: 4000, panelClass: ['error-snackbar'] }
          );
        },
      });
  }
}
