import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validate-prescription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './validate-prescription.component.html',
  styleUrl: './validate-prescription.component.css',
})
export class ValidatePrescriptionComponent implements OnInit, OnDestroy {
  isValid: boolean | null = null;
  loading: boolean = true;
  prescriptionData: any = null;
  errorMessage: string = '';
  window = window;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.validate(code);
    } else {
      this.loading = false;
      this.errorMessage = this.translate.instant('VALIDATE_PRESCRIPTION.INVALID_FALLBACK');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validate(code: string) {
    this.prescriptionService.validatePrescription(code)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res && res.isValid) {
            this.isValid = true;
            this.prescriptionData = res.prescription ? res.prescription : res;
          } else {
            this.isValid = false;
            this.errorMessage = this.translate.instant('VALIDATE_PRESCRIPTION.INVALID_FALLBACK');
          }
        },
        error: (err) => {
          this.loading = false;
          this.isValid = false;
          this.errorMessage = this.translate.instant('VALIDATE_PRESCRIPTION.INVALID_FALLBACK');
        },
      });
  }
}
