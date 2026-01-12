import { IPatient } from './IPatient';
import { MedicalHistoryReadDTO } from './medical-history.model';

export interface IMedicalHistory {
  id?: number;
  patientId: number;
  diagnoses: string; // JSON or separated string
  allergies: string;
  notes: string; // "Encrypted" notes (FE sends plain text, BE encrypts)
  lastUpdated?: string | Date;
}

// Response wrapper from PatientDetails API endpoint
export interface IPatientDetailResponse {
  id: number;
  patientId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  patient: IPatient;
  medicalHistories: MedicalHistoryReadDTO[];
  allergies: string[];
}

export interface IPatientDetail extends IPatient {
  medicalHistory?: IMedicalHistory;
  medicalHistoryEntries?: MedicalHistoryReadDTO[];
}
