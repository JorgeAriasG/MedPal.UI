import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ConsultationEngineModule } from 'src/app/shared/consultation-engine/consultation-engine.module';
import { MedicalHistoryModule } from 'src/app/components/medical-history/medical-history.module';

import { GeneralStepComponent } from './general-step.component';
import { AntecedentsStepComponent } from './antecedents-step.component';
import { EvaluationStepComponent } from './evaluation-step.component';
import { DiagnosisStepComponent } from './diagnosis-step.component';
import { PlanStepComponent } from './plan-step.component';
import { SummaryStepComponent } from './summary-step.component';
import { NutritionAnamnesisStepComponent } from './nutrition-anamnesis-step.component';
import { NutritionAnthropometryStepComponent } from './nutrition-anthropometry-step.component';
import { NutritionPlanStepComponent } from './nutrition-plan-step.component';

@NgModule({
  declarations: [
    GeneralStepComponent,
    AntecedentsStepComponent,
    EvaluationStepComponent,
    DiagnosisStepComponent,
    PlanStepComponent,
    SummaryStepComponent,
    NutritionAnamnesisStepComponent,
    NutritionAnthropometryStepComponent,
    NutritionPlanStepComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    ConsultationEngineModule,
    MedicalHistoryModule,
  ],
  exports: [
    GeneralStepComponent,
    AntecedentsStepComponent,
    EvaluationStepComponent,
    DiagnosisStepComponent,
    PlanStepComponent,
    SummaryStepComponent,
    NutritionAnamnesisStepComponent,
    NutritionAnthropometryStepComponent,
    NutritionPlanStepComponent,
  ],
})
export class ConsultationWorkspaceStepsModule {}