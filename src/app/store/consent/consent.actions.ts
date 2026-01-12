/**
 * Consent Store Actions
 * Actions for managing patient consent state
 *
 * @note MOBILE FEATURE
 */

import { createAction, props } from '@ngrx/store';
import { IPatientConsent, ConsentRequestDto, ConsentApprovalDto } from '../../entities';

// Load Patient Consents
export const loadPatientConsents = createAction(
  '[Consent] Load Patient Consents',
  props<{ patientId: number }>()
);

export const loadPatientConsentsSuccess = createAction(
  '[Consent] Load Patient Consents Success',
  props<{ consents: IPatientConsent[] }>()
);

export const loadPatientConsentsFailure = createAction(
  '[Consent] Load Patient Consents Failure',
  props<{ error: string }>()
);

// Select Consent Detail
export const selectConsent = createAction(
  '[Consent] Select Consent',
  props<{ consent: IPatientConsent }>()
);

export const clearSelectedConsent = createAction(
  '[Consent] Clear Selected Consent'
);

// Request New Consent
export const requestConsent = createAction(
  '[Consent] Request Consent',
  props<{ request: ConsentRequestDto }>()
);

export const requestConsentSuccess = createAction(
  '[Consent] Request Consent Success',
  props<{ consent: IPatientConsent }>()
);

export const requestConsentFailure = createAction(
  '[Consent] Request Consent Failure',
  props<{ error: string }>()
);

// Approve Consent
export const approveConsent = createAction(
  '[Consent] Approve Consent',
  props<{ consentId: number; notes?: string }>()
);

export const approvConsentSuccess = createAction(
  '[Consent] Approve Consent Success',
  props<{ consent: IPatientConsent }>()
);

export const approveConsentFailure = createAction(
  '[Consent] Approve Consent Failure',
  props<{ error: string }>()
);

// Reject Consent Request
export const rejectConsent = createAction(
  '[Consent] Reject Consent',
  props<{ consentId: number; notes?: string }>()
);

export const rejectConsentSuccess = createAction(
  '[Consent] Reject Consent Success',
  props<{ consentId: number }>()
);

export const rejectConsentFailure = createAction(
  '[Consent] Reject Consent Failure',
  props<{ error: string }>()
);

// Revoke Consent
export const revokeConsent = createAction(
  '[Consent] Revoke Consent',
  props<{ consentId: number; reason?: string }>()
);

export const revokeConsentSuccess = createAction(
  '[Consent] Revoke Consent Success',
  props<{ consentId: number }>()
);

export const revokeConsentFailure = createAction(
  '[Consent] Revoke Consent Failure',
  props<{ error: string }>()
);

// Reset Consent State
export const resetConsentState = createAction(
  '[Consent] Reset Consent State'
);
