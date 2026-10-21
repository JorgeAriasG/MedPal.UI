import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    userId: number | null;
    userToken: string;
    clinicId: number | null;
    userRole: string | null;
    specialty?: string | null;
    clinicOpen?: { hour: number; minute: number } | null;
    clinicClose?: { hour: number; minute: number } | null;
    accountId?: number | null;
    userType?: string | null;
    patientId?: number | null;
    roles?: string[];
    name?: string | null;
    email?: string | null;
  }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

export const loadUserProfile = createAction('[Auth] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[Auth] Load User Profile Success',
  props<{ specialty: string }>(),
);

export const loadUserProfileFailure = createAction(
  '[Auth] Load User Profile Failure',
  props<{ error: string }>(),
);

export const logout = createAction('[Auth] Logout');

export const rehydrateAuthState = createAction(
  '[Auth] Rehydrate State',
  props<{
    userId: number | null;
    userToken: string | null;
    clinicId: number | null;
    specialty?: string | null;
  }>(),
);

export const setClinic = createAction(
  '[Clinic] Set Clinic',
  props<{
    clinicId: number | null;
    open?: { hour: number; minute: number } | null;
    close?: { hour: number; minute: number } | null;
  }>(),
);

export const setLoading = createAction(
  '[Auth] Set Loading',
  props<{ loading: boolean }>(),
);

export const setAuthClaims = createAction(
  '[Auth] Set Claims',
  props<{
    claims: {
      userId: number | null;
      accountId: number | null;
      clinicId: number | null;
      roles: string[];
      userType: string | null;
      patientId: number | null;
    };
  }>(),
);
