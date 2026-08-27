import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IMedicalRecordAccessLog } from '../../../entities';

export interface AuditLogDetailData {
  log: IMedicalRecordAccessLog;
}

@Component({
  selector: 'app-audit-log-detail',
  templateUrl: './audit-log-detail.component.html',
  styleUrls: ['./audit-log-detail.component.css'],
  standalone: false,
})
export class AuditLogDetailComponent {
  log: IMedicalRecordAccessLog;

  constructor(
    private dialogRef: MatDialogRef<AuditLogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuditLogDetailData,
    private translate: TranslateService
  ) {
    this.log = data.log;
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  }

  getUserName(): string {
    return this.log.userName || this.translate.instant('AUDIT.TABLE_USER_ID') + ' ' + this.log.userId;
  }

  getPatientName(): string {
    return this.log.patientName || this.translate.instant('AUDIT.TABLE_PATIENT_ID') + ' ' + this.log.patientDetailsId;
  }

  getAccessingClinic(): string {
    return this.log.accessingClinicName || this.translate.instant('AUDIT.FILTER_CLINIC_ID') + ' ' + this.log.accessingClinicId;
  }

  getOwnerClinic(): string {
    return this.log.ownerClinicName || this.translate.instant('AUDIT.FILTER_CLINIC_ID') + ' ' + this.log.medicalRecordOwnerClinicId;
  }

  getConsentText(hasConsent: boolean): string {
    return hasConsent ? this.translate.instant('AUDIT.CONSENT_YES') : this.translate.instant('AUDIT.CONSENT_NO');
  }

  close(): void {
    this.dialogRef.close();
  }
}
