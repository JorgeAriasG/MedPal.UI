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
  clinicId: number | null;
  specialty: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  userId: null,
  userToken: null,
  error: null,
  clinicId: null,
  specialty: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { userId, userToken, clinicId, specialty }) => ({
    ...state,
    userId,
    userToken,
    clinicId,
    specialty: specialty || null,
    error: null,
    loading: false,
  })),
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
  on(rehydrateAuthState, (state, { userId, userToken, clinicId, specialty }) => ({
    ...state,
    userId,
    userToken,
    clinicId,
    specialty: specialty || null,
  })),
  on(setClinic, (state, { clinicId }) => ({ ...state, clinicId, error: null })),
  on(setLoading, (state, { loading }) => ({ ...state, loading }))
);
