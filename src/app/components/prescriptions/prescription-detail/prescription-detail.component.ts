import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IPrescription } from 'src/app/entities/IPrescription';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css'],
  standalone: false,
})
export class PrescriptionDetailComponent implements OnInit, OnDestroy {
  prescription: IPrescription | null = null;
  qrCodeUrl: SafeUrl | null = null;
  loading = true;
  error = '';
  private destroy$ = new Subject<void>();
  private objectURL: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPrescription(+id);
    } else {
      this.error = this.translate.instant('ERRORS.INVALID_ID');
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrescription(id: number) {
    this.prescriptionService.getPrescriptionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.prescription = data;
          this.loadQrCode(id);
        },
        error: (err) => {
          this.error = this.translate.instant('PRESCRIPTIONS.ERROR_LOAD');
          this.loading = false;
          console.error(err);
        },
      });
  }

  loadQrCode(id: number) {
    this.prescriptionService.getPrescriptionQr(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.objectURL = URL.createObjectURL(blob);
          this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectURL);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load QR code', err);
          this.error = this.translate.instant('PRESCRIPTIONS.ERROR_QR');
          this.loading = false;
        },
      });
  }

  print() {
    window.print();
  }
}
