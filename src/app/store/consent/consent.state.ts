/**
 * Consent Store State
 * Manages state for patient consent data and operations
 *
 * @note MOBILE FEATURE
 * This store is designed for mobile app usage
 * Web: Read-only view of consent status
 * Mobile: Patient approval/revocation workflows
 */

import { IPatientConsent, ConsentScope } from '../../entities';

/**
 * Consent Store State
 * Tracks patient consents and operations
 */
export interface ConsentState {
  /**
   * Array of patient consents for current patient
   */
  consents: IPatientConsent[];

  /**
   * Current consent being viewed/edited
   */
  selectedConsent: IPatientConsent | null;

  /**
   * Whether data is being loaded
   */
  loading: boolean;

  /**
   * Error message if operation failed
   */
  error: string | null;

  /**
   * Whether an approval/revocation is in progress
   */
  submitting: boolean;

  /**
   * Error for approval/revocation operations
   */
  submissionError: string | null;

  /**
   * Pending consents awaiting patient action
   */
  pendingConsents: IPatientConsent[];

  /**
   * Approved consents currently valid
   */
  approvedConsents: IPatientConsent[];

  /**
   * Revoked consents
   */
  revokedConsents: IPatientConsent[];
}

/**
 * Initial state for consent store
 */
export const initialConsentState: ConsentState = {
  consents: [],
  selectedConsent: null,
  loading: false,
  error: null,
  submitting: false,
  submissionError: null,
  pendingConsents: [],
  approvedConsents: [],
  revokedConsents: [],
};
