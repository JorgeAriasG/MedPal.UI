/**
 * Authentication Models & DTOs
 *
 * Defines the structure for authentication-related data,
 * roles, and permissions across the application.
 */

/**
 * Login Response DTO
 * Returned by backend after successful authentication
 */
export interface LoginResponse {
  /** User unique identifier */
  id: number;

  /** User full name */
  name: string;

  /** User email address */
  email: string;

  /** JWT authentication token */
  token: string;

  /** User role (SuperAdmin, AccountAdmin, ClinicAdmin, Doctor, etc.) */
  role: string;

  /** Account ID - multi-tenancy scope */
  accountId?: number;

  /** Clinic ID - clinic-specific scope */
  clinicId?: number;

  /** Array of permission strings (e.g., 'Users.Create', 'Patients.View') */
  permissions?: string[];
}

/**
 * Register Request DTO
 * Sent to backend for user registration
 */
export interface RegisterRequest {
  /** User full name */
  name: string;

  /** User email address - must be unique */
  email: string;

  /** User password - backend handles hashing */
  password: string;

  /** Accept privacy policy and terms */
  acceptPrivacyTerms: boolean;
}

/**
 * User Model
 * Represents a logged-in user in the application
 */
export interface User {
  /** User unique identifier */
  id: number;

  /** User full name */
  name: string;

  /** User email address */
  email: string;

  /** User role (SuperAdmin, AccountAdmin, ClinicAdmin, Doctor, Receptionist, Patient, etc.) */
  role: string;

  /** Account ID - null if not account-scoped */
  accountId?: number;

  /** Clinic ID - null if not clinic-scoped */
  clinicId?: number;
}

/**
 * Auth Context
 * Represents the current authentication state
 */
export interface AuthContext {
  /** Currently authenticated user */
  user: User | null;

  /** Whether user is authenticated */
  isAuthenticated: boolean;

  /** User's JWT token */
  token: string | null;

  /** User's role */
  role: string | null;

  /** User's permissions */
  permissions: string[];

  /** Whether loading authentication state */
  isLoading: boolean;

  /** Error message if authentication failed */
  error: string | null;
}

/**
 * Permission Constants
 * Centralized permission definitions for type safety
 */
export const PERMISSIONS = {
  // Users
  USERS_VIEW_ALL: 'Users.ViewAll',
  USERS_VIEW_OWN: 'Users.ViewOwn',
  USERS_CREATE: 'Users.Create',
  USERS_UPDATE: 'Users.Update',
  USERS_DELETE: 'Users.Delete',
  USERS_MANAGE: 'Users.Manage',

  // Patients
  PATIENTS_VIEW_ALL: 'Patients.ViewAll',
  PATIENTS_VIEW_OWN: 'Patients.ViewOwn',
  PATIENTS_CREATE: 'Patients.Create',
  PATIENTS_UPDATE: 'Patients.Update',
  PATIENTS_DELETE: 'Patients.Delete',

  // Appointments
  APPOINTMENTS_VIEW_ALL: 'Appointments.ViewAll',
  APPOINTMENTS_VIEW_OWN: 'Appointments.ViewOwn',
  APPOINTMENTS_CREATE: 'Appointments.Create',
  APPOINTMENTS_UPDATE: 'Appointments.Update',
  APPOINTMENTS_CANCEL: 'Appointments.Cancel',

  // Medical Records
  MEDICAL_RECORDS_VIEW_ALL: 'MedicalRecords.ViewAll',
  MEDICAL_RECORDS_VIEW_OWN: 'MedicalRecords.ViewOwn',
  MEDICAL_RECORDS_VIEW_ASSIGNED: 'MedicalRecords.ViewAssigned',
  MEDICAL_RECORDS_CREATE: 'MedicalRecords.Create',
  MEDICAL_RECORDS_UPDATE: 'MedicalRecords.Update',

  // Prescriptions
  PRESCRIPTIONS_CREATE: 'Prescriptions.Create',
  PRESCRIPTIONS_VIEW: 'Prescriptions.View',
  PRESCRIPTIONS_UPDATE: 'Prescriptions.Update',

  // Clinics
  CLINICS_VIEW: 'Clinics.View',
  CLINICS_MANAGE: 'Clinics.Manage',

  // Roles
  ROLES_VIEW: 'Roles.View',
  ROLES_ASSIGN: 'Roles.Assign',
  ROLES_REVOKE: 'Roles.Revoke',
  ROLES_VIEW_AUDIT: 'Roles.ViewAudit',

  // Billing
  BILLING_VIEW: 'Billing.View',
  BILLING_MANAGE: 'Billing.Manage',

  // Reports
  REPORTS_GENERATE: 'Reports.Generate',
  REPORTS_VIEW: 'Reports.View',

  // Audit
  AUDIT_VIEW: 'Audit.View',
  AUDIT_MANAGE: 'Audit.Manage',

  // Consent
  CONSENT_VIEW: 'Consent.View',
  CONSENT_APPROVE: 'Consent.Approve',
  CONSENT_REVOKE: 'Consent.Revoke',
} as const;

/**
 * Role Constants
 * Centralized role definitions for type safety
 */
export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ACCOUNT_ADMIN = 'AccountAdmin',
  CLINIC_ADMIN = 'ClinicAdmin',
  DOCTOR = 'Doctor',
  HEALTH_PROFESSIONAL = 'HealthProfessional',
  RECEPTIONIST = 'Receptionist',
  PATIENT = 'Patient',
}

/**
 * Admin Roles
 * Roles that have administrative privileges
 */
export const ADMIN_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.ACCOUNT_ADMIN,
  UserRole.CLINIC_ADMIN,
] as const;

/**
 * Clinical Roles
 * Roles that provide medical/clinical access
 */
export const CLINICAL_ROLES = [
  UserRole.DOCTOR,
  UserRole.HEALTH_PROFESSIONAL,
] as const;
