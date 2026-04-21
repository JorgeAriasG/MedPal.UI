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
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
      { label: 'Other', value: 'O' },
    ],
  },
  emergencyContact: {
    value: '',
    validators: Validators.required,
    type: 'text',
  },
  clinicId: {
    value: '',
    validators: Validators.required,
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'Clinic',
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
      { label: 'Scheduled', value: 'Scheduled' },
      { label: 'In Progress', value: 'InProgress' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'No-show', value: 'NoShow' },
      { label: 'Rescheduled', value: 'Rescheduled' },
    ],
  },
  durationMinutes: {
    value: 30,
    validators: [Validators.required, Validators.min(15), Validators.max(120)],
    type: 'text', // Changed from 'number' to 'text' as 'number' is not in our FormFieldConfig type yet, but we'll use input type='number' in HTML
    label: 'Duration (min)',
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
  principalClinicId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'Clinic',
  },
  roleId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent (admin only)
    label: 'Role',
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
  principalClinicId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent
    label: 'Clinic',
  },
  roleId: {
    value: '',
    type: 'select',
    options: [], // Will be populated dynamically by EditModalComponent (admin only)
    label: 'Role',
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
