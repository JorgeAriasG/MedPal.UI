/**
 * Consent Store Selectors
 * Provides typed access to consent state
 *
 * @note MOBILE FEATURE
 * Selectors follow established pattern: feature selector + derived selectors
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConsentState } from './consent.state';

/**
 * Feature Selector for Consent State
 */
export const selectConsentState = createFeatureSelector<ConsentState>('consent');

/**
 * Select all patient consents
 */
export const selectAllConsents = createSelector(
  selectConsentState,
  (state: ConsentState) => state.consents
);

/**
 * Select count of all consents
 */
export const selectConsentsCount = createSelector(
  selectAllConsents,
  (consents) => consents.length
);

/**
 * Select pending consents (awaiting approval)
 */
export const selectPendingConsents = createSelector(
  selectConsentState,
  (state: ConsentState) => state.pendingConsents
);

/**
 * Select approved consents
 */
export const selectApprovedConsents = createSelector(
  selectConsentState,
  (state: ConsentState) => state.approvedConsents
);

/**
 * Select revoked consents
 */
export const selectRevokedConsents = createSelector(
  selectConsentState,
  (state: ConsentState) => state.revokedConsents
);

/**
 * Select currently selected consent detail
 */
export const selectSelectedConsent = createSelector(
  selectConsentState,
  (state: ConsentState) => state.selectedConsent
);

/**
 * Select loading state for consent operations
 */
export const selectConsentLoading = createSelector(
  selectConsentState,
  (state: ConsentState) => state.loading
);

/**
 * Select loading error
 */
export const selectConsentError = createSelector(
  selectConsentState,
  (state: ConsentState) => state.error
);

/**
 * Select submission loading state (for approve/reject/revoke operations)
 */
export const selectConsentSubmitting = createSelector(
  selectConsentState,
  (state: ConsentState) => state.submitting
);

/**
 * Select submission error
 */
export const selectConsentSubmissionError = createSelector(
  selectConsentState,
  (state: ConsentState) => state.submissionError
);

/**
 * Select combined loading state (data loading OR submission in progress)
 */
export const selectConsentIsLoading = createSelector(
  selectConsentLoading,
  selectConsentSubmitting,
  (loading, submitting) => loading || submitting
);

/**
 * Select pending consents count
 */
export const selectPendingConsentsCount = createSelector(
  selectPendingConsents,
  (pending) => pending.length
);

/**
 * Select approved consents count
 */
export const selectApprovedConsentsCount = createSelector(
  selectApprovedConsents,
  (approved) => approved.length
);

/**
 * Select revoked consents count
 */
export const selectRevokedConsentsCount = createSelector(
  selectRevokedConsents,
  (revoked) => revoked.length
);

/**
 * Select has any valid (approved) consents
 */
export const selectHasValidConsents = createSelector(
  selectApprovedConsents,
  (approved) => approved.length > 0
);
