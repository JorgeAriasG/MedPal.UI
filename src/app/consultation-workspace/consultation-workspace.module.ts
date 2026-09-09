import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConsultationEngineModule } from 'src/app/shared/consultation-engine/consultation-engine.module';
import { ConsultationWorkspaceComponent } from './consultation-workspace.component';
import { ConsultationStepperComponent } from './consultation-stepper.component';
import { ConsultationStepOutletComponent } from './consultation-step-outlet.component';
import { ConsultationContextPanelComponent } from './consultation-context-panel.component';
import { ConsultationPatientSummaryComponent } from './consultation-patient-summary.component';
import { ConsultationWorkspaceStepsModule } from './steps/consultation-workspace-steps.module';

@NgModule({
  declarations: [
    ConsultationWorkspaceComponent,
    ConsultationStepperComponent,
    ConsultationStepOutletComponent,
    ConsultationContextPanelComponent,
    ConsultationPatientSummaryComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatStepperModule,
    MatTooltipModule,
    TranslateModule,
    ConsultationEngineModule,
    ConsultationWorkspaceStepsModule,
  ],
  exports: [ConsultationWorkspaceComponent],
})
export class ConsultationWorkspaceModule {}