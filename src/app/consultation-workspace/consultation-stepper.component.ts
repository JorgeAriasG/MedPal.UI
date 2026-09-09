import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  select(index: number): void {
    if (index === this.selectedIndex) return;
    this.selectionChange.emit(index);
  }
}