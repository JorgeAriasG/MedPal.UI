import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginFailure,
  rehydrateAuthState,
  setClinic,
  logout,
  loadUserProfileSuccess,
  loadUserProfileFailure,
  login,
  setLoading,
  setAuthClaims,
} from '../actions/auth.actions';

export interface AuthState {
  userId: number | null;
  userToken: string | null;
  error: string | null;
  clinicId: number | null;
  clinicOpen: { hour: number; minute: number } | null;
  clinicClose: { hour: number; minute: number } | null;
  specialty: string | null;
  loading: boolean;
  /** Account ID - multi-tenancy scope (null for patients) */
  accountId: number | null;
  /** Clinic ID - clinic-specific scope (null for patients) */
  clinicIdExtra: number | null;
  /** User type: "staff" or "patient" */
  userType: string | null;
  /** Patient ID - only for patient tokens */
  patientId: number | null;
  /** Array of roles from JWT claims (snake_case) */
  roles: string[];
}

export const initialState: AuthState = {
  userId: null,
  userToken: null,
  error: null,
  clinicId: null,
  clinicOpen: null,
  clinicClose: null,
  specialty: null,
  loading: false,
  accountId: null,
  clinicIdExtra: null,
  userType: null,
  patientId: null,
  roles: [],
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(
    loginSuccess,
    (
      state,
      {
        userId,
        userToken,
        clinicId,
        specialty,
        clinicOpen,
        clinicClose,
        accountId,
        userType,
        patientId,
        roles,
      }: {
        userId: number | null;
        userToken: string;
        clinicId: number | null;
        specialty?: string | null | undefined;
        clinicOpen?: { hour: number; minute: number } | null | undefined;
        clinicClose?: { hour: number; minute: number } | null | undefined;
        accountId?: number | null | undefined;
        userType?: string | null | undefined;
        patientId?: number | null | undefined;
        roles?: string[] | undefined;
      }
    ) => ({
      ...state,
      userId,
      userToken,
      clinicId: clinicId || null,
      specialty: specialty || null,
      clinicOpen: clinicOpen ?? null,
      clinicClose: clinicClose ?? null,
      accountId: accountId || null,
      clinicIdExtra: clinicId || null,
      userType: userType || null,
      patientId: patientId || null,
      roles: roles || [],
      error: null,
      loading: false,
    }),
  ),
  on(loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(loadUserProfileSuccess, (state, { specialty }) => ({
    ...state,
    specialty,
    error: null,
    loading: false,
  })),
  on(loadUserProfileFailure, (state, { error }) => ({
    ...state,
    specialty: 'General', // Default to General on failure
    error,
    loading: false,
  })),
  on(logout, (state) => ({
    ...initialState, // Reset state immediately when logout action is dispatched
  })),
  on(
    rehydrateAuthState,
    (
      state,
      {
        userId,
        userToken,
        clinicId,
        specialty,
        accountId,
        userType,
        patientId,
        roles,
      }: {
        userId: number | null;
        userToken: string | null;
        clinicId: number | null;
        specialty?: string | null;
        accountId?: number | null;
        userType?: string | null;
        patientId?: number | null;
        roles?: string[];
      }
    ) => ({
      ...state,
      userId,
      userToken,
      clinicId: clinicId || null,
      specialty: specialty || null,
      accountId: accountId || null,
      clinicIdExtra: clinicId || null,
      userType: userType || null,
      patientId: patientId || null,
      roles: roles || [],
    }),
  ),
  on(setClinic, (state, { clinicId, open, close }) => ({
    ...state,
    clinicId: clinicId || null,
    clinicOpen: open ?? null,
    clinicClose: close ?? null,
    error: null,
  })),
  on(setLoading, (state, { loading }) => ({ ...state, loading })),
  on(setAuthClaims, (state, { claims }) => ({
    ...state,
    userId: claims.userId,
    accountId: claims.accountId,
    clinicIdExtra: claims.clinicId,
    userType: claims.userType,
    patientId: claims.patientId,
    roles: claims.roles,
  })),
);
