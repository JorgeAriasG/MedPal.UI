import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { DentalTemplateComponent } from './specialty-templates/dental-template/dental-template.component';
import { NutritionTemplateComponent } from './specialty-templates/nutrition-template/nutrition-template.component';
import { GenericTemplateComponent } from './specialty-templates/generic-template/generic-template.component';
import { HistoryFormComponent } from './history-form/history-form.component';
import { HistoryTimelineComponent } from './history-timeline/history-timeline.component';

@NgModule({
  declarations: [
    DentalTemplateComponent,
    NutritionTemplateComponent,
    GenericTemplateComponent,
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
  ],
  exports: [HistoryFormComponent, HistoryTimelineComponent],
})
export class MedicalHistoryModule {}
