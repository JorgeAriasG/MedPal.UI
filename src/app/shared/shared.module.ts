import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OmnibarComponent } from './omnibar/omnibar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimeoutWarningComponent } from './timeout-warning/timeout-warning.component';
import { Cie10SearchComponent } from './cie10-search/cie10-search.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MenuComponent, 
    EditModalComponent, 
    OmnibarComponent,
    TimeoutWarningComponent,
    Cie10SearchComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    MenuComponent, 
    EditModalComponent, 
    OmnibarComponent,
    TimeoutWarningComponent,
    Cie10SearchComponent,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class SharedModule {}
