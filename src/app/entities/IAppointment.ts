export interface IAppointment {
  patientId?: string
  userId?: string,
  clinicId?: string,
  date: string,
  time: string,
  status: string,
  notes?: string
}
