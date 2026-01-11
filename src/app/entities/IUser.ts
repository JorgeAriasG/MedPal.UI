export interface IUser {
  name: string;
  email: string;
  password: string;
  defaultClinicId?: string;
  specialty?: string; // Medical specialty: 'Dental', 'Nutrición', 'Cardiología', etc.
  professionalLicenseNumber?: string;
  confirmPassword?: string;
  acceptPrivacyTerms?: boolean;
}
