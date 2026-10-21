export interface ReportFilters {
  dateFrom: Date;
  dateTo: Date;
  clinicId: number | null;
  doctorId?: number | null;
}

export interface AppointmentSummary {
  totalAppointments: number;
  completed: number;
  cancelled: number;
  noShow: number;
  scheduled: number;
  inProgress: number;
  rescheduled: number;
  completionRate: number;
  noShowRate: number;
  cancellationRate: number;
  averageDuration: number;
}

export interface DoctorPerformance {
  doctorId: number;
  doctorName: string;
  specialty: string;
  totalAppointments: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  noShowRate: number;
  averageDuration: number;
}

export interface AppointmentReportRow {
  id: number;
  date: string;
  time: string;
  patientName: string;
  doctorName: string;
  doctorId: number;
  status: string;
  durationMinutes: number;
}

export interface ReportData {
  summary: AppointmentSummary;
  doctorPerformance: DoctorPerformance[];
  appointmentDetails: AppointmentReportRow[];
  totalItems: number;
}
