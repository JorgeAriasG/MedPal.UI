import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsPageComponent } from './reports-page/reports-page.component';

const routes: Routes = [
  { path: '', component: ReportsPageComponent },
];

@NgModule({ imports: [RouterModule.forChild(routes)] })
export class ReportsRoutingModule {}
