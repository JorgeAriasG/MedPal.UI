import { Validators } from "@angular/forms";

export const patientFormConfig = {
  name: ['', Validators.required],
  middlename: [''],
  lastname: ['', Validators.required],
  phone: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  address: ['', Validators.required],
  dob: ['', Validators.required],
  gender: ['', Validators.required],
  emergencyContact: ['', Validators.required]
};

export const appointmentFormConfig = {
  date: ['', Validators.required],
  time: ['', Validators.required],
  notes: ['', Validators.required],
  status: ['', Validators.required]
};
