import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConsentPageComponent } from './consent-page/consent-page.component';
import { ConsentGrantDialogModule } from './consent-grant-dialog/consent-grant-dialog.module';
import { ConfirmDialogModule } from '../../shared/confirm-dialog/confirm-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: ConsentPageComponent,
  },
];

@NgModule({
  declarations: [
    ConsentPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
    ConsentGrantDialogModule,
    ConfirmDialogModule,
  ],
})
export class ConsentModule {}
