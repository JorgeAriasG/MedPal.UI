export interface IConsultation {
  id?: number;
  appointmentId: number;
  patientId: number;
  doctorId?: number;
  soapData?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  diagnosis?: string;
  cie10Codes?: string[];
  notes?: string;
  status: 'in_progress' | 'completed';
  createdAt?: string;
  completedAt?: string;
}
