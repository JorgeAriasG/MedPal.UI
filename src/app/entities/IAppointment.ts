export interface IAppointment {
  patientId?: number;
  userId?: number;
  clinicId?: number;
  status: string;
  notes?: string;
  date: {
    year: number;
    month: number;
    day: number;
    dayOfWeek?: number;
  };
  time: {
    hour: number;
    minute: number;
  };
}
