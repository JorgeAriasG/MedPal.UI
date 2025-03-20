import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ userId: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const rehydrateAuthState = createAction(
  '[Auth] Rehydrate State',
  props<{ userId: string | null }>() // Ensure the type is string | null
);

export const logout = createAction('[Auth] Logout');
