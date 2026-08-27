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
    label: 'PATIENTS.FORM_FIRST_NAME',
  },
  middlename: {
    value: '',
    type: 'text',
    label: 'PATIENTS.FORM_MIDDLENAME',
  },
  lastname: {
    value: '',
    validators: Validators.required,
    type: 'text',
    label: 'PATIENTS.FORM_LAST_NAME',
  },
  phone: {
    value: '',
    validators: Validators.required,
    type: 'tel',
    label: 'PATIENTS.FORM_PHONE',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
    label: 'PATIENTS.FORM_EMAIL',
  },
  address: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
    label: 'PATIENTS.FORM_ADDRESS',
  },
  dob: {
    value: '',
    validators: Validators.required,
    type: 'date',
    label: 'PATIENTS.FORM_DOB',
  },
  gender: {
    value: '',
    validators: Validators.required,
    type: 'select',
    label: 'PATIENTS.FORM_GENDER',
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
    label: 'PATIENTS.FORM_EMERGENCY_CONTACT',
  },
  clinicIds: {
    value: '',
    validators: Validators.required,
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'PATIENTS.FORM_CLINIC',
  },
  isWhatsAppConsented: {
    value: false,
    type: 'checkbox',
    label: 'PATIENTS.FORM_WHATSAPP_CONSENT',
  }
};

export const appointmentFormConfig: Record<string, FormFieldConfig> = {
  date: {
    value: '',
    validators: Validators.required,
    type: 'date',
    label: 'APPOINTMENTS.TABLE_DATE',
  },
  time: {
    value: '',
    validators: Validators.required,
    type: 'time',
    label: 'APPOINTMENTS.TABLE_TIME',
  },
  notes: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
    label: 'Notas',
  },
  status: {
    value: '',
    validators: Validators.required,
    type: 'select',
    label: 'APPOINTMENTS.TABLE_STATUS',
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
    label: 'USERS.TABLE_NAME',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
    label: 'USERS.TABLE_EMAIL',
  },
  password: {
    value: '',
    validators: [Validators.required, Validators.minLength(8)],
    type: 'password',
    label: 'Contraseña',
  },
  confirmPassword: {
    value: '',
    validators: [Validators.required, Validators.minLength(8)],
    type: 'password',
    label: 'Confirmar Contraseña',
  },
  specialty: {
    value: '',
    type: 'text',
    label: 'Especialidad',
  },
  professionalLicenseNumber: {
    value: '',
    type: 'text',
    label: 'Número de Cédula Profesional',
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
    label: 'Acepto los términos de privacidad y manejo de mis datos',
  },
};

export const userEditFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
    label: 'USERS.TABLE_NAME',
  },
  email: {
    value: '',
    validators: [Validators.required, Validators.email],
    type: 'email',
    label: 'USERS.TABLE_EMAIL',
  },
  password: {
    value: '',
    type: 'password',
    label: 'Contraseña',
  },
  confirmPassword: {
    value: '',
    type: 'password',
    label: 'Confirmar Contraseña',
  },
  specialty: {
    value: '',
    type: 'text',
    label: 'Especialidad',
  },
  professionalLicenseNumber: {
    value: '',
    type: 'text',
    label: 'Número de Cédula Profesional',
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
    label: 'CLINICS.DIALOG_NAME',
  },
  location: {
    value: '',
    validators: Validators.required,
    type: 'text',
    label: 'CLINICS.DIALOG_LOCATION',
  },
  contactInfo: {
    value: '',
    validators: Validators.required,
    type: 'text',
    label: 'CLINICS.DIALOG_CONTACT',
  },
};

export const roleFormConfig: Record<string, FormFieldConfig> = {
  name: {
    value: '',
    validators: Validators.required,
    type: 'text',
    label: 'ROLES.FORM_NAME',
  },
  description: {
    value: '',
    validators: Validators.required,
    type: 'textarea',
    label: 'ROLES.FORM_DESCRIPTION',
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
