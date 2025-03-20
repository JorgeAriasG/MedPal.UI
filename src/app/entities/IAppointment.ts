import { IAuditData } from "./IAudit-data";
import { IPatient } from "./IPatient";

export interface IAppointment {
  patientId?: string
  userId?: string,
  appointmentDate: Date,
  status: string
}
