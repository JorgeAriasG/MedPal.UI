import { Component, Input } from '@angular/core';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { fadeIn } from 'src/app/shared/animations';

@Component({
  selector: 'app-nutrition-patient',
  templateUrl: './nutrition-patient.component.html',
  styleUrls: ['./nutrition-patient.component.css'],
  standalone: false,
  animations: [fadeIn]
})
export class NutritionPatientComponent {
  @Input() patient: IPatientDetail | null = null;
  @Input() patientDetailsId: number | null = null;
  @Input() medicalHistory: MedicalHistoryReadDTO[] = [];
  @Input() allergies: any[] = [];
  @Input() lastWeight = 0;
  @Input() lastHeight = 0;
}
