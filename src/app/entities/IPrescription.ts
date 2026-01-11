export interface IPrescriptionItem {
  id?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface IPrescription {
  id?: number;
  patientId: number;
  patientName?: string; // Optional for display
  doctorId?: number; // Usually set by backend based on token
  doctorName?: string;
  createdAt?: string | Date;
  expiresAt?: string | Date;
  diagnosis?: string;
  notes?: string;
  items: IPrescriptionItem[];
  uniqueCode?: string; // For validation
}
