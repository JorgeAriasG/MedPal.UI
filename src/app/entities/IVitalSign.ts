export interface IVitalSign {
  id: number;
  patientDetailsId: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodGlucose?: number;
  notes?: string;
  recordedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IVitalSignWrite {
  patientDetailsId: number;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  weight?: number | null;
  height?: number | null;
  bmi?: number | null;
  bloodGlucose?: number | null;
  notes?: string | null;
  recordedAt: Date;
}
