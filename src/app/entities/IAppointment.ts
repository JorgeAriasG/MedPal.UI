export interface IAppointment {
  id?: number | null;
  patientId?: number;
  userId?: number;
  clinicId?: number;
  status: string;
  notes?: string;
  durationMinutes?: number;
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
