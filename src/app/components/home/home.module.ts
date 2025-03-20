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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { NewPatientComponent } from '../patients/new-patient/new-patient.component';
import { AddClinicComponent } from '../clinics/add-clinic/add-clinic.component';
import { QuickactionMenuComponent } from '../quickaction-menu/quickaction-menu.component';
import { AppointmentComponent } from '../appointments/appointment/appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({ declarations: [
        HomeComponent,
        NewAppointmentComponent,
        PatientsComponent,
        ClinicListComponent,
        NewPatientComponent,
        AddClinicComponent,
        QuickactionMenuComponent,
        AppointmentComponent
    ],
    exports: [
        HomeComponent,
        NewAppointmentComponent,
        PatientsComponent,
        ClinicListComponent,
        NewPatientComponent,
        AddClinicComponent,
        QuickactionMenuComponent,
        AppointmentComponent
    ], imports: [CommonModule,
        SharedModule,
        MatCardModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        FontAwesomeModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        RouterModule.forChild([
            { path: '', component: HomeComponent },
            { path: 'appointments/new-appointment', component: NewAppointmentComponent },
            { path: 'patients/list', component: PatientsComponent },
            { path: 'clinics/list', component: ClinicListComponent }
        ])], providers: [MatNativeDateModule, provideHttpClient(withInterceptorsFromDi())] })
export class HomeModule { }
