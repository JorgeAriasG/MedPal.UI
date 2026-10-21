export interface IAppointment {
  id?: number | null;
  patientId?: number;
  patientName?: string; // Nuevo: Para creación fantasma
  patientPhone?: string; // Nuevo: Para creación fantasma
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
