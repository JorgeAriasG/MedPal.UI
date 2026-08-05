import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared.module';

import { ClinicalNotesComponent } from './clinical-notes/clinical-notes.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ClinicalAttachmentsComponent } from './clinical-attachments/clinical-attachments.component';
import { DiagnosesComponent } from './diagnoses/diagnoses.component';
import { TreatmentsComponent } from './treatments/treatments.component';
import { MeasurementsComponent } from './measurements/measurements.component';
import { AlertsComponent } from './alerts/alerts.component';
import { PreviousConsultationsComponent } from './previous-consultations/previous-consultations.component';

@NgModule({
  declarations: [
    ClinicalNotesComponent,
    ImageViewerComponent,
    ClinicalAttachmentsComponent,
    DiagnosesComponent,
    TreatmentsComponent,
    MeasurementsComponent,
    AlertsComponent,
    PreviousConsultationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [
    ClinicalNotesComponent,
    ImageViewerComponent,
    ClinicalAttachmentsComponent,
    DiagnosesComponent,
    TreatmentsComponent,
    MeasurementsComponent,
    AlertsComponent,
    PreviousConsultationsComponent,
  ],
})
export class ConsultationEngineModule {}
