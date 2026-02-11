import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { ValidatePrescriptionComponent } from './components/public/validate-prescription/validate-prescription.component';
import { UnauthorizedComponent } from './components/public/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'validate-prescription/:code',
    component: ValidatePrescriptionComponent,
  },
  { path: '**', redirectTo: 'login' }, // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
