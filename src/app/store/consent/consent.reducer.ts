/**
 * Consent Store Reducer
 * Manages state mutations for patient consent operations
 *
 * @note MOBILE FEATURE
 * Uses createReducer/on pattern following established auth store pattern
 */

import { createReducer, on } from '@ngrx/store';
import { ConsentState, initialConsentState } from './consent.state';
import * as ConsentActions from './consent.actions';

/**
 * Consent Reducer
 * Handles all consent-related state mutations
 */
export const consentReducer = createReducer(
  initialConsentState,

  // Load Patient Consents
  on(ConsentActions.loadPatientConsents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ConsentActions.loadPatientConsentsSuccess, (state, { consents }) => ({
    ...state,
    consents,
    pendingConsents: consents.filter(c => !c.isApproved && !c.isDeleted),
    approvedConsents: consents.filter(c => c.isApproved && !c.isDeleted),
    revokedConsents: consents.filter(c => c.isDeleted),
    loading: false,
    error: null
  })),

  on(ConsentActions.loadPatientConsentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select Consent
  on(ConsentActions.selectConsent, (state, { consent }) => ({
    ...state,
    selectedConsent: consent
  })),

  on(ConsentActions.clearSelectedConsent, (state) => ({
    ...state,
    selectedConsent: null
  })),

  // Request Consent
  on(ConsentActions.requestConsent, (state) => ({
    ...state,
    submitting: true,
    submissionError: null
  })),

  on(ConsentActions.requestConsentSuccess, (state, { consent }) => ({
    ...state,
    consents: [...state.consents, consent],
    pendingConsents: [...state.pendingConsents, consent],
    submitting: false,
    submissionError: null
  })),

  on(ConsentActions.requestConsentFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    submissionError: error
  })),

  // Approve Consent
  on(ConsentActions.approveConsent, (state) => ({
    ...state,
    submitting: true,
    submissionError: null
  })),

  on(ConsentActions.approvConsentSuccess, (state, { consent }) => ({
    ...state,
    consents: state.consents.map(c => c.id === consent.id ? consent : c),
    pendingConsents: state.pendingConsents.filter(c => c.id !== consent.id),
    approvedConsents: [...state.approvedConsents.filter(c => c.id !== consent.id), consent],
    selectedConsent: state.selectedConsent?.id === consent.id ? consent : state.selectedConsent,
    submitting: false,
    submissionError: null
  })),

  on(ConsentActions.approveConsentFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    submissionError: error
  })),

  // Reject Consent
  on(ConsentActions.rejectConsent, (state) => ({
    ...state,
    submitting: true,
    submissionError: null
  })),

  on(ConsentActions.rejectConsentSuccess, (state, { consentId }) => ({
    ...state,
    consents: state.consents.filter(c => c.id !== consentId),
    pendingConsents: state.pendingConsents.filter(c => c.id !== consentId),
    submitting: false,
    submissionError: null
  })),

  on(ConsentActions.rejectConsentFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    submissionError: error
  })),

  // Revoke Consent
  on(ConsentActions.revokeConsent, (state) => ({
    ...state,
    submitting: true,
    submissionError: null
  })),

  on(ConsentActions.revokeConsentSuccess, (state, { consentId }) => ({
    ...state,
    consents: state.consents.map(c =>
      c.id === consentId ? { ...c, isDeleted: true } : c
    ),
    approvedConsents: state.approvedConsents.filter(c => c.id !== consentId),
    revokedConsents: state.revokedConsents.filter(c => c.id !== consentId).concat(
      state.consents.find(c => c.id === consentId)!
    ),
    selectedConsent: state.selectedConsent?.id === consentId ? null : state.selectedConsent,
    submitting: false,
    submissionError: null
  })),

  on(ConsentActions.revokeConsentFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    submissionError: error
  })),

  // Reset State
  on(ConsentActions.resetConsentState, () => ({
    ...initialConsentState
  }))
);
