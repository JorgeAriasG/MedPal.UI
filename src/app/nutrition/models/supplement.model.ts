export interface ISupplement {
  id?: number;
  patientDetailsId: number;
  name: string;
  brand?: string;
  description?: string;
  form?: SupplementForm;
  dosage: string;
  unit: string;
  frequency: string;
  timing?: string;
  duration?: string;
  indication: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  prescribedAt?: Date;
  prescribedById?: number;
  notes?: string;
  createdAt?: Date;
}

export type SupplementForm =
  | 'tablet'
  | 'capsule'
  | 'powder'
  | 'liquid'
  | 'injection'
  | 'spray'
  | 'gummy'
  | 'bar'
  | 'other';
