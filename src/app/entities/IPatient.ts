import { IClinic } from "./IClinic";

export interface IPatient {
  id?: number | null,
  patientDetailsId?: number | null,
  name: string,
  middlename: string,
  lastname: string,
  phone: string,
  email: string,
  address: string,
  dob: Date,
  gender: string,
  curp?: string,
  emergencyContact: string,
  clinicIds: number[],
  clinic?: IClinic,
  clinics?: IClinic[],
  weight?: number | null,
  height?: number | null
}
