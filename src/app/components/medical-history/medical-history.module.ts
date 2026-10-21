import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ConsultationEngineModule } from 'src/app/shared/consultation-engine/consultation-engine.module';

// Components
import { DentalTemplateComponent } from './specialty-templates/dental-template/dental-template.component';
import { NutritionTemplateComponent } from './specialty-templates/nutrition-template/nutrition-template.component';
import { GenericTemplateComponent } from './specialty-templates/generic-template/generic-template.component';
import { SoapTemplateComponent } from './specialty-templates/soap-template/soap-template.component';
import { HistoryFormComponent } from './history-form/history-form.component';
import { HistoryTimelineComponent } from './history-timeline/history-timeline.component';

@NgModule({
  declarations: [
    DentalTemplateComponent,
    NutritionTemplateComponent,
    GenericTemplateComponent,
    SoapTemplateComponent,
    HistoryFormComponent,
    HistoryTimelineComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    ConsultationEngineModule,
  ],
  exports: [HistoryFormComponent, HistoryTimelineComponent, SoapTemplateComponent, DentalTemplateComponent, NutritionTemplateComponent, GenericTemplateComponent],
})
export class MedicalHistoryModule {}
