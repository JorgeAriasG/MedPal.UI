import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { AuditLogDetailComponent } from './audit-log-detail.component';

@NgModule({
  declarations: [AuditLogDetailComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
  exports: [AuditLogDetailComponent],
})
export class AuditLogDetailModule {}
