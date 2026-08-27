import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConsentPageComponent } from './consent-page/consent-page.component';

const routes: Routes = [
  {
    path: '',
    component: ConsentPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConsentPageComponent,
  ],
})
export class ConsentModule {}
