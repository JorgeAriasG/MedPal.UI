import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ userId: number, userToken: string, clinicId: number }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const rehydrateAuthState = createAction(
  '[Auth] Rehydrate State',
  props<{ userId: number | null, userToken: string | null, clinicId: number | null }>() // Ensure the type is string | null
);

export const setClinic = createAction(
  '[Clinic] Set Clinic',
  props<{ clinicId: number | null }>()
);
