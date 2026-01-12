import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/user/login/login.component';
import { SharedModule } from './shared/shared.module';
import { SignupComponent } from './components/user/signup/signup.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './store/reducers/auth.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { auditReducer } from './store/audit/audit.reducer';
import { AuditEffects } from './store/audit/audit.effects';
import { consentReducer } from './store/consent/consent.reducer';
import { ConsentEffects } from './store/consent/consent.effects';
import { AngularMaterialModule } from './angular-material.module';
import { AuthInterceptor } from './interceptors/authInterceptor';
import { AuditContextInterceptor } from './interceptors/audit-context.interceptor';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ActionReducer, MetaReducer } from '@ngrx/store';

// Meta-reducer para persistencia automática del state
export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth'], // Solo persiste el state de auth
    rehydrate: true, // Rehidrata automáticamente al cargar la app
    storage: sessionStorage, // Usa sessionStorage en lugar de localStorage
    storageKeySerializer: (key) => `ngrx_${key}`, // Prefijo para las keys
  })(reducer);
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    SharedModule,
    StoreModule.forRoot({ auth: authReducer, audit: auditReducer, consent: consentReducer }, { metaReducers }),
    EffectsModule.forRoot([AuthEffects, AuditEffects, ConsentEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25,
      connectInZone: true,
      trace: true,
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuditContextInterceptor, multi: true },
  ],
  schemas: [],
})
export class AppModule {}
