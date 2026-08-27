/**
 * Patient Consent Interface
 * Represents patient consent for medical record access
 *
 * @note This is a MOBILE FEATURE - included for reference only
 * Patient consent approval/revocation UI will be implemented in mobile app
 */

export enum ConsentScope {
  AllRecords = 'AllRecords',
  LabsOnly = 'LabsOnly',
  SpecificDateRange = 'SpecificDateRange',
}

/**
 * Patient Consent Record
 * Tracks which clinics have patient permission to access medical records
 *
 * @interface IPatientConsent
 * @description Web: Read-only view for admin/clinic staff
 *              Mobile: Patient can approve/revoke/manage consents
 */
export interface IPatientConsent {
  /**
   * Unique identifier for consent record
   */
  id: number;

  /**
   * ID of the patient granting consent
   */
  patientDetailsId: number;

  /**
   * ID of the clinic requesting access to patient's medical records
   */
  requestingClinicId: number;

  /**
   * ID of the clinic that owns the patient's medical records
   */
  ownerClinicId: number;

  /**
   * Scope level of consent (FULL, LIMITED, EMERGENCY_ONLY)
   */
  consentScope: ConsentScope;

  /**
   * Whether the patient has approved this consent
   */
  isApproved: boolean;

  /**
   * Date when consent was requested
   */
  consentDate: Date;

  /**
   * Optional expiration date for consent
   */
  expiryDate?: Date;

  /**
   * ID of user who approved the consent (patient or authorized representative)
   */
  approvedByUserId?: number;

  /**
   * Additional notes or conditions on the consent
   */
  notes?: string;

  /**
   * Display name of the requesting clinic
   */
  requestingClinicName?: string;

  /**
   * Display name of the owner clinic
   */
  ownerClinicName?: string;

  /**
   * Display name of the patient
   */
  patientName?: string;

  /**
   * Display name of the user who approved the consent
   */
  approvedByUserName?: string;

  /**
   * Display name of the target doctor
   */
  targetDoctorName?: string;

  /**
   * Soft delete flag
   */
  isDeleted: boolean;

  /**
   * When the consent record was created
   */
  createdAt: Date;

  /**
   * When the consent record was last updated
   */
  updatedAt: Date;
}

/**
 * Consent Request DTO for creating/updating consent
 */
export interface ConsentRequestDto {
  /**
   * Patient ID
   */
  patientDetailsId: number;

  /**
   * Requesting clinic ID
   */
  requestingClinicId: number;

  /**
   * Owner clinic ID
   */
  ownerClinicId: number;

  /**
   * Scope of access requested
   */
  consentScope: ConsentScope;

  /**
   * Optional expiration date
   */
  expiryDate?: Date;

  /**
   * Additional notes
   */
  notes?: string;
}

/**
 * Consent Approval DTO
 */
export interface ConsentApprovalDto {
  /**
   * Consent record ID
   */
  consentId: number;

  /**
   * Whether approved or rejected
   */
  isApproved: boolean;

  /**
   * Optional notes from patient
   */
  notes?: string;
}
