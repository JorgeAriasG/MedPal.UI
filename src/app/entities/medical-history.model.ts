import { SpecialtyType } from './specialty-templates.model';

// Read DTO - matches backend response
export interface MedicalHistoryReadDTO {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName?: string;
  specialtyType: SpecialtyType;
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  specialtyData: string; // JSON string (encrypted on backend)
  createdAt: string | Date;
  lastUpdated?: string | Date;
}

// Write DTO - matches backend API expectation
export interface MedicalHistoryWriteDTO {
  patientDetailsId: number;
  specialtyType: SpecialtyType;
  diagnosis: string;
  diagnosisDate: string | Date;
  clinicalNotes?: string;
  followUpDate?: string | Date;
  specialtyData?: string; // JSON string (will be encrypted by backend)
  prescriptionId?: number;
  isConfidential?: boolean;
}

// Deprecated - kept for compatibility
export interface MedicalHistoryWriteDTOLegacy {
  patientId: number;
  specialtyType: SpecialtyType;
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  specialtyData: string; // JSON string (will be encrypted by backend)
}
