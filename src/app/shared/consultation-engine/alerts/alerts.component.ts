import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  standalone: false,
})
export class AlertsComponent {
  @Input() patientDetailsId!: number;
  @Input() antecedentsData: string | null = null;

  get antecedents(): string | null {
    return this.antecedentsData;
  }
}
