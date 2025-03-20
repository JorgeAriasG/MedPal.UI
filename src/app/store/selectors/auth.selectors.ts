import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserId = createSelector(
  selectAuthState,
  (state: AuthState) => state.userId
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectIsLoggedIn = createSelector(
  selectUserId,
  (userId: string | null) => !!userId
);
