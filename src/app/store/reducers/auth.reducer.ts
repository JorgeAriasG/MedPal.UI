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
} from '../actions/auth.actions';

export interface AuthState {
  userId: number | null;
  userToken: string | null;
  error: string | null;
  principalClinicId: number | null;
  specialty: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  userId: null,
  userToken: null,
  error: null,
  principalClinicId: null,
  specialty: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(
    loginSuccess,
    (state, { userId, userToken, principalClinicId, specialty }) => ({
      ...state,
      userId,
      userToken,
      principalClinicId,
      specialty: specialty || null,
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
    (state, { userId, userToken, principalClinicId, specialty }) => ({
      ...state,
      userId,
      userToken,
      principalClinicId,
      specialty: specialty || null,
    }),
  ),
  on(setClinic, (state, { principalClinicId }) => ({
    ...state,
    principalClinicId,
    error: null,
  })),
  on(setLoading, (state, { loading }) => ({ ...state, loading })),
);
