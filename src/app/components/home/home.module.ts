import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { NewAppointmentComponent } from '../appointments/new-appointment/new-appointment.component';
import { PatientsComponent } from '../patients/patients/patients.component';
import { ClinicListComponent } from '../clinics/clinic-list/clinic-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { NewPatientComponent } from '../patients/new-patient/new-patient.component';
import { PatientDetailComponent } from '../patients/patient-detail/patient-detail.component';
import { AddClinicComponent } from '../clinics/add-clinic/add-clinic.component';
import { QuickactionMenuComponent } from '../quickaction-menu/quickaction-menu.component';
import { AppointmentComponent } from '../appointments/appointment/appointment.component';
import { ConfirmStartConsultationComponent } from '../appointments/appointment/confirm-start-consultation/confirm-start-consultation.component';
import { ConsultationComponent } from '../appointments/consultation/consultation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ListComponent } from '../user/list/list/list.component';
import { RolesListComponent } from '../user/roles/roles-list/roles-list.component';
import { NewRoleComponent } from '../user/roles/new-role/new-role.component';
import { CreatePrescriptionComponent } from '../prescriptions/create-prescription/create-prescription.component';
import { PrescriptionDetailComponent } from '../prescriptions/prescription-detail/prescription-detail.component';
import { MedicalHistoryModule } from '../medical-history/medical-history.module';
import { NutritionModule } from 'src/app/nutrition/nutrition.module';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuditAccessGuard } from 'src/app/guards/audit-access.guard';
import { AuditAdminGuard } from 'src/app/guards/audit-admin.guard';
import { ConsentAccessGuard } from 'src/app/guards/consent-access.guard';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PatientAntecedentsComponent } from '../patients/patient-antecedents/patient-antecedents.component';
import { PatientVitalSignsComponent } from '../patients/patient-vital-signs/patient-vital-signs.component';
import { VitalSignDialogComponent } from '../patients/patient-vital-signs/vital-sign-dialog.component';
import { PatientConsentsComponent } from '../patients/patient-consents/patient-consents.component';
import { PatientGeneralComponent } from '../patients/patient-general/patient-general.component';
import { PatientDentalComponent } from '../patients/patient-dental/patient-dental.component';
import { NutritionPatientComponent } from '../patients/nutrition-patient/nutrition-patient.component';
import { SettingsComponent } from '../settings/settings.component';
import { CheckoutSuccessComponent } from '../checkout/checkout-success/checkout-success.component';
import { CheckoutRequiredComponent } from '../checkout/checkout-required/checkout-required.component';
import { StripeCheckoutModalComponent } from '../checkout/stripe-checkout-modal/stripe-checkout-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    HomeComponent,
    NewAppointmentComponent,
    PatientsComponent,
    ClinicListComponent,
    NewPatientComponent,
    PatientDetailComponent,
    PatientAntecedentsComponent,
    PatientVitalSignsComponent,
    VitalSignDialogComponent,
    PatientConsentsComponent,
    PatientGeneralComponent,
    PatientDentalComponent,
    NutritionPatientComponent,
    AddClinicComponent,
    QuickactionMenuComponent,
    AppointmentComponent,
    ConfirmStartConsultationComponent,
    ConsultationComponent,
    ListComponent,
    RolesListComponent,
    NewRoleComponent,
    CreatePrescriptionComponent,
    PrescriptionDetailComponent,
    SettingsComponent,
    CheckoutSuccessComponent,
    CheckoutRequiredComponent,
    StripeCheckoutModalComponent,
  ],
  exports: [
    HomeComponent,
    NewAppointmentComponent,
    PatientsComponent,
    ClinicListComponent,
    NewPatientComponent,
    AddClinicComponent,
    QuickactionMenuComponent,
    AppointmentComponent,
    ListComponent,
    RolesListComponent,
    NewRoleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatCardModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MedicalHistoryModule,
    NutritionModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'appointments', component: AppointmentComponent },
      {
        path: 'appointments/:id/consultation',
        component: ConsultationComponent,
      },
      {
        path: 'appointments/new-appointment',
        component: NewAppointmentComponent,
      },
      { path: 'patients/detail/:id', component: PatientDetailComponent },
      { path: 'clinics', component: ClinicListComponent },
      { path: 'users', component: ListComponent },
      { path: 'checkout/success', component: CheckoutSuccessComponent },
      { path: 'checkout/required', component: CheckoutRequiredComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'roles', component: RolesListComponent },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../reports/reports.module').then(
                (m) => m.ReportsModule
              ),
          },
        ],
      },
      { path: 'prescriptions/new', component: CreatePrescriptionComponent },
      {
        path: 'prescriptions/detail/:id',
        component: PrescriptionDetailComponent,
      },
      // Nutrition module (lazy-loaded)
      {
        path: 'nutrition',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('src/app/nutrition/nutrition.module').then(
                (m) => m.NutritionModule
              ),
          },
        ],
      },
      // Audit routes (protected with guards)
      {
        path: 'audit-logs',
        canActivate: [AuditAccessGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../audit-logs/audit-logs.module').then(
                (m) => m.AuditLogsModule
              ),
          },
        ],
      },
      // Audit Reports Route - Phase 3b
      // @note Uncomment when audit-reports module is fully implemented
      // {
      //   path: 'audit-reports',
      //   canActivate: [AuditAdminGuard],
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../audit-logs/audit-reports.module').then(
      //           (m) => m.AuditReportsModule
      //         ),
      //     },
      //   ],
      // },
      // Consent routes (protected with guards)
      // @note Phase 3a: Consent modules not yet created
      // {
      //   path: 'consent',
      //   canActivate: [ConsentAccessGuard],
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../consent/consent.module').then(
      //           (m) => m.ConsentModule
      //         ),
      //     },
      //   ],
      // },
    ]),
  ],
  providers: [MatNativeDateModule, provideHttpClient(withInterceptorsFromDi())],
})
export class HomeModule {}
