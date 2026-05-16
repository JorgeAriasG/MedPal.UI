import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  constructor(private consentService: ConsentService) {}

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
          this.error = 'Error al cargar consentimientos';
        },
      });
  }

  revoke(consent: IPatientConsent): void {
    if (!confirm('¿Revocar este consentimiento?')) return;
    this.consentService
      .revokeConsent(consent.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadData(),
        error: () => (this.error = 'Error al revocar consentimiento'),
      });
  }

  getScopeLabel(scope: string): string {
    const labels: Record<string, string> = {
      AllRecords: 'Todos los registros',
      LimitedAccess: 'Acceso limitado',
      EmergencyOnly: 'Solo emergencias',
    };
    return labels[scope] || scope;
  }

  isExpired(consent: IPatientConsent): boolean {
    if (!consent.expiryDate) return false;
    return new Date(consent.expiryDate) < new Date();
  }
}
