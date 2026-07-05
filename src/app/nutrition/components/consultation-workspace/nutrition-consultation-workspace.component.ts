import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nutrition-consultation-workspace',
  templateUrl: './nutrition-consultation-workspace.component.html',
  styleUrls: ['./nutrition-consultation-workspace.component.css'],
  standalone: false,
})
export class NutritionConsultationWorkspaceComponent {
  @Input() patientDetailsId!: number;
  @Input() weight = 0;
  @Input() height = 0;

  activeStepIndex = 0;
}
