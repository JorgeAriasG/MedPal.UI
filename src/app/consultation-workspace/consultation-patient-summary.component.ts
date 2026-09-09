import { Component, Input } from '@angular/core';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';

@Component({
  selector: 'app-consultation-patient-summary',
  templateUrl: './consultation-patient-summary.component.html',
  styleUrls: ['./consultation-context-panel.component.css'],
  standalone: false,
})
export class ConsultationPatientSummaryComponent {
  @Input() patient: IPatientDetail | null = null;
  @Input() lastWeight = 0;
  @Input() lastHeight = 0;
  @Input() allergiesCount = 0;

  get fullName(): string {
    const p = this.patient;
    if (!p) return '—';
    return [p.name, p.middlename, p.lastname].filter(Boolean).join(' ');
  }

  get age(): number {
    if (!this.patient?.dob) return 0;
    const dob = new Date(this.patient.dob);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
      years--;
    }
    return Math.max(years, 0);
  }
}