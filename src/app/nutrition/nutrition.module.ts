import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { AnthropometryComponent } from './components/anthropometry/anthropometry.component';
import { AnthropometryDialogComponent } from './components/anthropometry/anthropometry-dialog.component';
import { BodyCompositionComponent } from './components/body-composition/body-composition.component';
import { AssessmentCalculatorComponent } from './components/assessment/assessment-calculator.component';
import { DietPlanListComponent } from './components/diet-plans/diet-plan-list.component';
import { DietPlanEditorComponent } from './components/diet-plans/diet-plan-editor.component';
import { DietPlanDetailComponent } from './components/diet-plans/diet-plan-detail.component';
import { FoodDatabaseComponent } from './components/food-database/food-database.component';
import { ProgressTrackingComponent } from './components/progress/progress-tracking.component';
import { SupplementListComponent } from './components/supplements/supplement-list.component';
import { NutritionConsultationWorkspaceComponent } from './components/consultation-workspace/nutrition-consultation-workspace.component';
import { NutritionSummaryComponent } from './components/summary/nutrition-summary.component';

@NgModule({
  declarations: [
    AnthropometryComponent,
    AnthropometryDialogComponent,
    BodyCompositionComponent,
    AssessmentCalculatorComponent,
    DietPlanListComponent,
    DietPlanEditorComponent,
    DietPlanDetailComponent,
    FoodDatabaseComponent,
    ProgressTrackingComponent,
    SupplementListComponent,
    NutritionConsultationWorkspaceComponent,
    NutritionSummaryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NutritionRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MatStepperModule,
    BaseChartDirective,
    TranslateModule,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
  ],
  exports: [
    AnthropometryComponent,
    BodyCompositionComponent,
    AssessmentCalculatorComponent,
    DietPlanListComponent,
    DietPlanEditorComponent,
    DietPlanDetailComponent,
    FoodDatabaseComponent,
    ProgressTrackingComponent,
    SupplementListComponent,
    NutritionConsultationWorkspaceComponent,
    NutritionSummaryComponent,
  ],
})
export class NutritionModule {}
