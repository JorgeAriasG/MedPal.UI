import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserId = createSelector(
  selectAuthState,
  (state: AuthState) => state.userId,
);

export const userToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.userToken,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error,
);

export const selectIsLoggedIn = createSelector(
  selectUserId,
  (userId: number | null) => !!userId,
);

export const selectClinicId = createSelector(
  selectAuthState,
  (state: AuthState) => state.    clinicId,
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading,
);

export const selectUserSpecialty = createSelector(
  selectAuthState,
  (state: AuthState) => state.specialty || 'General',
);

export const selectClinicOpen = createSelector(
  selectAuthState,
  (state: AuthState) => state.clinicOpen,
);

export const selectClinicClose = createSelector(
  selectAuthState,
  (state: AuthState) => state.clinicClose,
);

export const selectClinicContext = createSelector(
  selectAuthState,
  (state: AuthState) => ({
    clinicId: state.    clinicId,
    clinicOpen: state.clinicOpen,
    clinicClose: state.clinicClose,
  }),
);

export const selectAuthContext = createSelector(
  selectAuthState,
  (state: AuthState) => ({
    userId: state.userId,
    clinicId: state.    clinicId,
    clinicOpen: state.clinicOpen,
    clinicClose: state.clinicClose,
  }),
);
