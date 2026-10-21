import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BookingService, TimeSlot } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: false,
})
export class BookingComponent implements OnInit {
  sr: string = '';
  clinicId: number | null = null;
  doctorId: number | null = null;
  clinicName: string = '';
  doctorName: string = '';

  selectedDate: Date | null = null;
  selectedTime: string = '';
  availableSlots: TimeSlot[] = [];
  loadingSlots = false;

  patientForm: FormGroup;
  consentForm: FormGroup;
  step = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.patientForm = this.fb.group({
      patientName: ['', Validators.required],
      patientPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    this.consentForm = this.fb.group({
      consentMedicalRecords: [false, Validators.requiredTrue],
      consentWhatsapp: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.sr = this.route.snapshot.queryParamMap.get('sr') || '';
    if (!this.sr) {
      this.snackBar.open(this.translate.instant('BOOKING.SNACKBAR_INVALID_LINK'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
      return;
    }

    this.decodeLinkPayload();
    this.loadAvailability();
  }

  private decodeLinkPayload(): void {
    try {
      const payload = JSON.parse(
        atob(this.sr.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      this.clinicId = payload?.clinicId ?? payload?.clinic_id ?? null;
      this.doctorId = payload?.doctorId ?? payload?.doctor_id ?? payload?.sub ?? null;
      this.clinicName = payload?.clinicName ?? payload?.clinc_name ?? '';
      this.doctorName = payload?.doctorName ?? payload?.name ?? '';
    } catch {
      // Keep ids null; backend re-validates via the signed sr token.
    }
  }

  loadAvailability(): void {
    if (!this.selectedDate) return;

    this.loadingSlots = true;
    const dateStr = this.formatDate(this.selectedDate);

    this.bookingService
      .getPublicAvailability(this.sr, this.clinicId || 0, this.doctorId || 0, dateStr)
      .subscribe({
        next: (slots) => {
          this.availableSlots = slots;
          this.loadingSlots = false;
        },
        error: () => {
          this.snackBar.open(this.translate.instant('BOOKING.SNACKBAR_LOAD_ERROR'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
          this.loadingSlots = false;
        },
      });
  }

  onDateSelect(date: Date | null): void {
    this.selectedDate = date;
    this.selectedTime = '';
    this.loadAvailability();
  }

  onTimeSelect(time: string): void {
    this.selectedTime = time;
    this.step = 2;
  }

  onSubmit(): void {
    if (this.patientForm.invalid || this.consentForm.invalid || !this.selectedDate || !this.selectedTime) {
      return;
    }

    const request = {
      sr: this.sr,
      patientName: this.patientForm.value.patientName,
      patientPhone: this.patientForm.value.patientPhone,
      date: this.formatDate(this.selectedDate!),
      time: this.selectedTime,
      durationMinutes: 30,
      consentMedicalRecords: this.consentForm.value.consentMedicalRecords,
      consentWhatsapp: this.consentForm.value.consentWhatsapp,
    };

    this.bookingService.completeBooking(request).subscribe({
      next: (result) => {
        if (result.pendingRegistration) {
          this.snackBar.open(this.translate.instant('BOOKING.SNACKBAR_PENDING'), this.translate.instant('COMMON.CLOSE'), { duration: 8000 });
        } else {
          this.snackBar.open(this.translate.instant('BOOKING.SNACKBAR_SUCCESS'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || this.translate.instant('BOOKING.SNACKBAR_ERROR'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
