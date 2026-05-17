import { Validators } from "@angular/forms";

export interface FormFieldConfig {
  value?: any;
  validators?: any;
  type: 'text' | 'email' | 'tel' | 'date' | 'time' | 'select' | 'textarea' | 'password' | 'checkbox';
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  label?: string; // Custom label for better UX (if not provided, will be auto-generated from key)
}

export const patientFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  middlename: {
    value: '',
    type: 'text',
  },
  lastname: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  phone: {
    value: '',
    validators: Validators.required,
    type: 'tel',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
  },
  address: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
  },
  dob: {
    value: '',
    validators: Validators.required,
    type: 'date',
  },
  gender: {
    value: '',
    validators: Validators.required,
    type: 'select',
    options: [
      { label: 'PATIENTS.GENDER_MALE', value: 'M' },
      { label: 'PATIENTS.GENDER_FEMALE', value: 'F' },
      { label: 'PATIENTS.GENDER_OTHER', value: 'O' },
    ],
  },
  emergencyContact: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  clinicIds: {
    value: '',
    validators: Validators.required,
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'PATIENTS.FORM_CLINIC',
  }
};

export const appointmentFormConfig: Record<string, FormFieldConfig> = {
  date: {
    value: '',
    validators: Validators.required,
    type: 'date',
  },
  time: {
    value: '',
    validators: Validators.required,
    type: 'time',
  },
  notes: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
  },
  status: {
    value: '',
    validators: Validators.required,
    type: 'select',
    options: [
      { label: 'APPOINTMENTS.STATUS_SCHEDULED', value: 'Scheduled' },
      { label: 'APPOINTMENTS.STATUS_IN_PROGRESS', value: 'InProgress' },
      { label: 'APPOINTMENTS.STATUS_COMPLETED', value: 'Completed' },
      { label: 'APPOINTMENTS.STATUS_CANCELLED', value: 'Cancelled' },
      { label: 'APPOINTMENTS.STATUS_NO_SHOW', value: 'NoShow' },
      { label: 'APPOINTMENTS.STATUS_RESCHEDULED', value: 'Rescheduled' },
    ],
  },
  durationMinutes: {
    value: 30,
    validators: [Validators.required, Validators.min(15), Validators.max(120)],
    type: 'text', // Changed from 'number' to 'text' as 'number' is not in our FormFieldConfig type yet, but we'll use input type='number' in HTML
    label: 'PATIENTS.FORM_DURATION',
  },
};

export const userFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
  },
  password: {
    value: '',
    validators: [Validators.required, Validators.minLength(8)],
    type: 'password',
  },
  confirmPassword: {
    value: '',
    validators: [Validators.required, Validators.minLength(8)],
    type: 'password',
  },
  specialty: {
    value: '',
    type: 'text',
  },
  professionalLicenseNumber: {
    value: '',
    type: 'text',
  },
  clinicId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'PATIENTS.FORM_CLINIC',
  },
  roleId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent (admin only)
    label: 'PATIENTS.FORM_ROLE',
  },
  acceptPrivacyTerms: {
    value: false,
    validators: Validators.requiredTrue,
    type: 'checkbox',
  },
};

export const userEditFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
  },
  password: {
    value: '',
    type: 'password',
  },
  confirmPassword: {
    value: '',
    type: 'password',
  },
  specialty: {
    value: '',
    type: 'text',
  },
  professionalLicenseNumber: {
    value: '',
    type: 'text',
  },
  clinicId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'PATIENTS.FORM_CLINIC',
  },
  roleId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent (admin only)
    label: 'PATIENTS.FORM_ROLE',
  }
};

export const clinicFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  location: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  contactInfo: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
};

export const roleFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  description: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
  },
};

// Mapa de configuraciones por entidad
export const formConfigMap = {
  patient: patientFormConfig,
  appointment: appointmentFormConfig,
  user: userFormConfig,
  userEdit: userEditFormConfig,
  clinic: clinicFormConfig,
  role: roleFormConfig,
};
