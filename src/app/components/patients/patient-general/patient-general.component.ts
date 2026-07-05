import { Component, Input } from '@angular/core';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { IPrescription } from 'src/app/entities/IPrescription';
import { fadeIn } from 'src/app/shared/animations';

@Component({
  selector: 'app-patient-general',
  templateUrl: './patient-general.component.html',
  styleUrls: ['./patient-general.component.css'],
  standalone: false,
  animations: [fadeIn]
})
export class PatientGeneralComponent {
  @Input() patient: IPatientDetail | null = null;
  @Input() patientDetailsId: number | null = null;
  @Input() medicalHistory: MedicalHistoryReadDTO[] = [];
  @Input() prescriptions: IPrescription[] = [];
  @Input() allergies: any[] = [];
  @Input() lastWeight = 0;
  @Input() lastHeight = 0;
}
