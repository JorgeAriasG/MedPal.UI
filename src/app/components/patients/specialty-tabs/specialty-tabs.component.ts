import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { IPrescription } from 'src/app/entities/IPrescription';
import { TreatmentItem, PendingAttachment, SpecialtyType } from 'src/app/entities/specialty-templates.model';
import { SPECIALTY_CONFIG, resolveSpecialty, SpecialtyModuleTab } from 'src/app/config/specialty-config';

@Component({
  selector: 'app-specialty-tabs',
  templateUrl: './specialty-tabs.component.html',
  styleUrls: ['./specialty-tabs.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpecialtyTabsComponent),
      multi: true,
    },
  ],
})
export class SpecialtyTabsComponent implements ControlValueAccessor {
  @Input() patient: IPatientDetail | null = null;
  @Input() patientDetailsId: number | null = null;
  @Input() medicalHistory: MedicalHistoryReadDTO[] = [];
  @Input() prescriptions: IPrescription[] = [];
  @Input() allergies: any[] = [];
  @Input() lastWeight = 0;
  @Input() lastHeight = 0;
  /** Per-specialty tabs. */
  @Input() set specialty(value: SpecialtyType | string | null | undefined) {
    this.userSpecialty = resolveSpecialty(value as string) || 'General';
  }
  /** Show the "Diagnóstico y Cierre" tab (consultation mode). */
  @Input() showClosure = false;

  userSpecialty: SpecialtyType = 'General';
  data: any = {};
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get config() {
    return SPECIALTY_CONFIG[this.userSpecialty] || SPECIALTY_CONFIG.General;
  }

  get specialtyTabIcon(): string {
    switch (this.config.template) {
      case 'dental':
        return 'face';
      case 'nutrition':
        return 'restaurant';
      default:
        return 'description';
    }
  }

  moduleIcon(module: SpecialtyModuleTab): string {
    switch (module) {
      case 'bodyComposition':
        return 'monitor_weight';
      case 'anthropometry':
        return 'straighten';
      case 'assessment':
        return 'calculate';
      case 'dietPlans':
        return 'restaurant_menu';
      case 'progress':
        return 'trending_up';
      case 'supplements':
        return 'medication';
    }
  }

  moduleLabel(module: SpecialtyModuleTab): string {
    switch (module) {
      case 'bodyComposition':
        return 'NUTRITION.BODY_COMP_TITLE';
      case 'anthropometry':
        return 'NUTRITION.ANTHROPOMETRY_TITLE';
      case 'assessment':
        return 'NUTRITION.ASSESSMENT_TITLE';
      case 'dietPlans':
        return 'NUTRITION.DIET_PLANS_TITLE';
      case 'progress':
        return 'NUTRITION.PROGRESS_TITLE';
      case 'supplements':
        return 'NUTRITION.SUPPLEMENTS_TITLE';
    }
  }

  writeValue(value: any): void {
    this.data = value || {};
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private diagnosisCache: { diagnosis: string; cie10Codes: string } | null = null;

  get diagnosisValue(): { diagnosis: string; cie10Codes: string } {
    const diagnosis = (this.data.diagnosis as string) || '';
    const cie10Codes = (this.data.cie10Codes as string) || '';
    if (
      !this.diagnosisCache ||
      this.diagnosisCache.diagnosis !== diagnosis ||
      this.diagnosisCache.cie10Codes !== cie10Codes
    ) {
      this.diagnosisCache = { diagnosis, cie10Codes };
    }
    return this.diagnosisCache;
  }

  onDiagnosisChange(value: { diagnosis: string; cie10Codes: string }): void {
    this.data.diagnosis = value.diagnosis;
    this.data.cie10Codes = value.cie10Codes;
    this.emit();
  }

  onClinicalNotesChange(value: string): void {
    this.data.clinicalNotes = value;
    this.emit();
  }

  onTreatmentsChange(value: TreatmentItem[]): void {
    this.data.treatments = value;
    this.emit();
  }

  onAttachmentsChange(value: PendingAttachment[]): void {
    this.data.attachments = value;
    this.emit();
  }

  private emit(): void {
    this.onChange(this.data);
    this.onTouched();
  }
}