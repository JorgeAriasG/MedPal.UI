import { Component, Injector, Input, OnChanges, Type } from '@angular/core';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepConfig,
  ConsultationWorkspaceContext,
} from './consultation-workspace.models';

@Component({
  selector: 'app-consultation-step-outlet',
  templateUrl: './consultation-step-outlet.component.html',
  styleUrls: ['./consultation-step-outlet.component.css'],
  standalone: false,
})
export class ConsultationStepOutletComponent implements OnChanges {
  @Input() step: ConsultationStepConfig | null = null;
  @Input() data: any = {};
  @Input() context: ConsultationWorkspaceContext | null = null;

  stepInjector: Injector = Injector.create({
    providers: [],
  });

  private _lastStepKey: string | null = null;
  private _lastData: any = undefined;

  get stepComponent(): Type<any> | null {
    return this.step?.component ?? null;
  }

  constructor(private injector: Injector) {}

  ngOnChanges(): void {
    const stepKey = this.step?.key ?? null;
    const dataChanged = this.data !== this._lastData;
    if (stepKey !== this._lastStepKey || dataChanged) {
      this._lastStepKey = stepKey;
      this._lastData = this.data;
      this.stepInjector = Injector.create({
        parent: this.injector,
        providers: [
          {
            provide: CONSULTATION_STEP_DATA,
            useValue: { data: this.data, context: this.context },
          },
        ],
      });
    }
  }
}