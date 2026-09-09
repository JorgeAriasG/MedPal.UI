import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConsultationStepConfig } from './consultation-workspace.models';

@Component({
  selector: 'app-consultation-stepper',
  templateUrl: './consultation-stepper.component.html',
  styleUrls: ['./consultation-stepper.component.css'],
  standalone: false,
})
export class ConsultationStepperComponent {
  @Input() steps: ConsultationStepConfig[] = [];
  @Input() selectedIndex = 0;
  @Output() selectionChange = new EventEmitter<number>();

  onSelectionChange(event: StepperSelectionEvent): void {
    this.selectionChange.emit(event.selectedIndex);
  }
}