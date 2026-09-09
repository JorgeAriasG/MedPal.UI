import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import {
  ConsultationStepConfig,
  ConsultationWorkspaceContext,
  SpecialtyWorkspaceConfig,
} from './consultation-workspace.models';
import { resolveWorkspaceConfig } from './consultation-step-registry';

const SPECIALTY_EMOJIS: Record<string, string> = {
  General: '🩺',
  Cardiology: '🫀',
  Pediatrics: '🧒',
  Dermatology: '🧴',
  Dental: '🦷',
  Nutrition: '🥑',
};

@Component({
  selector: 'app-consultation-workspace',
  templateUrl: './consultation-workspace.component.html',
  styleUrls: ['./consultation-workspace.component.css'],
  standalone: false,
})
export class ConsultationWorkspaceComponent {
  @Input() set specialty(value: SpecialtyType | string | null | undefined) {
    this.config = resolveWorkspaceConfig(value);
  }
  @Input() context: ConsultationWorkspaceContext = {
    patientDetailsId: null,
    patient: null,
    medicalHistory: [],
    prescriptions: [],
    allergies: [],
    antecedentsData: null,
    lastWeight: 0,
    lastHeight: 0,
    appointment: null,
  };
  @Input() data: any = {};

  @Output() saveDraft = new EventEmitter<void>();
  @Output() complete = new EventEmitter<void>();
  @Output() generatePrescription = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  config: SpecialtyWorkspaceConfig = resolveWorkspaceConfig('General');
  selectedStepIndex = 0;

  get currentStep(): ConsultationStepConfig | null {
    return this.config.steps[this.selectedStepIndex] || null;
  }

  get specialtyEmoji(): string {
    return SPECIALTY_EMOJIS[this.config.specialty] || '🩺';
  }

  get title(): string {
    return this.config.title.toLowerCase();
  }

  get isLastStep(): boolean {
    return (
      this.selectedStepIndex === this.config.steps.length - 1
    );
  }

  get primaryCtaKey(): string {
    if (this.isLastStep) {
      return 'CONSULTATION_WORKSPACE.COMPLETE_CONSULT';
    }
    if (this.currentStep?.key === 'diet-plan') {
      return 'CONSULTATION_WORKSPACE.GENERATE_PLAN';
    }
    return 'CONSULTATION_WORKSPACE.NEXT_STEP_CTA';
  }

  get patientName(): string {
    const p = this.context.patient;
    return p ? [p.name, p.middlename, p.lastname].filter(Boolean).join(' ') : '—';
  }

  get patientInitials(): string {
    const parts = this.patientName.split(/\s+/).filter(Boolean);
    return parts.length > 0 ? parts.slice(0, 2).map((s) => s.charAt(0)).join('').toUpperCase() : '—';
  }

  get patientAge(): number {
    const dob = this.context.patient?.dob;
    if (!dob) return 0;
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    return Math.max(years, 0);
  }

  get patientIdLabel(): string {
    const p = this.context.patient;
    if (!p) return '—';
    return p.curp || p.id?.toString() || '—';
  }

  get bmi(): string {
    const { lastWeight, lastHeight } = this.context;
    if (!lastWeight || !lastHeight) return '—';
    const meters = lastHeight / 100;
    return (lastWeight / (meters * meters)).toFixed(1);
  }

  get weightLabel(): string {
    return this.context.lastWeight ? `${this.context.lastWeight} kg` : '—';
  }

  get heightLabel(): string {
    return this.context.lastHeight ? `${(this.context.lastHeight / 100).toFixed(2)} m` : '—';
  }

  onStepChange(index: number): void {
    this.selectedStepIndex = index;
  }

  nextStep(): void {
    if (this.isLastStep) return;
    this.selectedStepIndex++;
  }

  prevStep(): void {
    if (this.selectedStepIndex === 0) return;
    this.selectedStepIndex--;
  }

  onPrimaryAction(): void {
    const isPlanStep = this.currentStep?.key === 'diet-plan';
    if (this.isLastStep) {
      this.complete.emit();
      return;
    }
    this.nextStep();
    if (isPlanStep) {
      this.generatePrescription.emit();
    }
  }
}