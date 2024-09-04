import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewAppointmentComponent } from './components/appointments/new-appointment/new-appointment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'appointments/new-appointment', component: NewAppointmentComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
