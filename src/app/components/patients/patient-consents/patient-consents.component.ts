import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ConsentService } from 'src/app/services/consent.service';
import { IPatientConsent } from 'src/app/entities/IPatientConsent';

@Component({
  selector: 'app-patient-consents',
  templateUrl: './patient-consents.component.html',
  styleUrls: ['./patient-consents.component.css'],
  standalone: false,
})
export class PatientConsentsComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;
  @Input() patientName = '';

  consents: IPatientConsent[] = [];
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private consentService: ConsentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.consentService
      .getPatientConsents(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.consents = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = this.translate.instant('PATIENTS.ERROR_LOAD_CONSENTS');
        },
      });
  }

  revoke(consent: IPatientConsent): void {
    if (!confirm(this.translate.instant('PATIENTS.CONFIRM_REVOKE_CONSENT'))) return;
    this.consentService
      .revokeConsent(consent.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadData(),
        error: () => (this.error = this.translate.instant('PATIENTS.ERROR_REVOKE_CONSENT')),
      });
  }

  getScopeLabel(scope: string): string {
    const map: Record<string, string> = {
      AllRecords: 'PATIENTS.SCOPE_ALL_RECORDS',
      LabsOnly: 'PATIENTS.SCOPE_LABS_ONLY',
      SpecificDateRange: 'PATIENTS.SCOPE_DATE_RANGE',
    };
    return this.translate.instant(map[scope] || scope);
  }

  isExpired(consent: IPatientConsent): boolean {
    if (!consent.expiryDate) return false;
    return new Date(consent.expiryDate) < new Date();
  }
}
