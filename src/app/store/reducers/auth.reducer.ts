import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginFailure,
  rehydrateAuthState,
  setClinic,
  logout,
} from '../actions/auth.actions';

export interface AuthState {
  userId: number | null;
  userToken: string | null;
  error: string | null;
  clinicId: number | null;
}

export const initialState: AuthState = {
  userId: null,
  userToken: null,
  error: null,
  clinicId: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { userId, userToken, clinicId }) => ({
    ...state,
    userId,
    userToken,
    clinicId,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({ ...state, error })),
  on(logout, (state) => ({
    ...initialState, // Reset state immediately when logout action is dispatched
  })),
  on(rehydrateAuthState, (state, { userId }) => ({ ...state, userId })),
  on(setClinic, (state, { clinicId }) => ({ ...state, clinicId, error: null }))
);
