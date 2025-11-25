import { IClinic } from "./IClinic";

export interface IPatient {
  id?: number | null,
  name: string,
  middlename: string,
  lastname: string,
  phone: string,
  email: string,
  address: string,
  dob: Date,
  gender: string,
  emergencyContact: string,
  clinicId?: number | null,
  clinic?: IClinic
}
