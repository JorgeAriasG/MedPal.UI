import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure, rehydrateAuthState, logout, setClinic } from '../actions/auth.actions';

export interface AuthState {
  userId: string | null;
  error: string | null;
  clinicId: string | null;
}

export const initialState: AuthState = {
  userId: null,
  error: null,
  clinicId: null
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { userId }) => ({ ...state, userId, error: null })),
  on(loginFailure, (state, { error }) => ({ ...state, error })),
  on(rehydrateAuthState, (state, { userId }) => ({ ...state, userId })),
  on(logout, state => ({ ...state, userId: null, error: null })), // Clear the state on logout
  on(setClinic, (state, { clinicId }) => ({ ...state, clinicId, error: null }))
);
