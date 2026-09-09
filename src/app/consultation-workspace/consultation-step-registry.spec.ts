import { resolveWorkspaceConfig, SPECIALTY_WORKSPACE_REGISTRY } from './consultation-step-registry';
import { GeneralStepComponent } from './steps/general-step.component';
import { NutritionAnamnesisStepComponent } from './steps/nutrition-anamnesis-step.component';
import { NutritionAnthropometryStepComponent } from './steps/nutrition-anthropometry-step.component';

describe('consultation-step-registry', () => {
  it('resolves the Nutrition workspace with its specialty-specific steps', () => {
    const config = resolveWorkspaceConfig('Nutrition');

    expect(config.specialty).toBe('Nutrition');
    expect(config.title).toBe('Nutrición');
    expect(config.steps.map((s) => s.key)).toEqual([
      'general',
      'anamnesis',
      'anthropometry',
      'evaluation',
      'diet-plan',
      'summary',
    ]);
  });

  it('uses nutrition-specific components for Nutrition anamnesis and anthropometry', () => {
    const byKey = (key: string) =>
      resolveWorkspaceConfig('Nutrition').steps.find((s) => s.key === key);

    expect(byKey('general')?.component).toBe(GeneralStepComponent);
    expect(byKey('anamnesis')?.component).toBe(NutritionAnamnesisStepComponent);
    expect(byKey('anthropometry')?.component).toBe(NutritionAnthropometryStepComponent);
    expect(byKey('summary')?.component?.name).toBe('SummaryStepComponent');
  });

  it('resolves the base workspace for General and soap-based specialties', () => {
    const baseKeys = [
      'general',
      'antecedents',
      'evaluation',
      'diagnosis',
      'plan',
      'summary',
    ];

    expect(resolveWorkspaceConfig('General').steps.map((s) => s.key)).toEqual(baseKeys);
    expect(resolveWorkspaceConfig('Cardiology').steps.map((s) => s.key)).toEqual([
      'general',
      'history',
      'physical-exam',
      'studies',
      'diagnosis',
      'treatment-plan',
    ]);
    expect(resolveWorkspaceConfig('Dental').steps.map((s) => s.key)).toEqual([
      'general',
      'exploration',
      'diagnosis',
      'treatment',
      'summary',
    ]);
  });

  it('falls back to General for unknown or empty specialties', () => {
    expect(resolveWorkspaceConfig('Psychiatry').specialty).toBe('General');
    expect(resolveWorkspaceConfig(undefined).specialty).toBe('General');
    expect(resolveWorkspaceConfig(null).specialty).toBe('General');
    expect(resolveWorkspaceConfig('').specialty).toBe('General');
  });

  it('defines a consistent shape for every registered specialty', () => {
    Object.values(SPECIALTY_WORKSPACE_REGISTRY).forEach((config) => {
      expect(config.title.length).toBeGreaterThan(0);
      expect(config.subtitleKey.startsWith('CONSULTATION_WORKSPACE.SUBTITLE_')).toBeTrue();
      expect(config.steps.length).toBeGreaterThanOrEqual(3);

      config.steps.forEach((step) => {
        expect(step.key.length).toBeGreaterThan(0);
        expect(step.labelKey.startsWith('CONSULTATION_WORKSPACE.STEP_')).toBeTrue();
        expect(step.icon.length).toBeGreaterThan(0);
      });
    });
  });

  it('assigns a renderable component to every step of every specialty', () => {
    Object.values(SPECIALTY_WORKSPACE_REGISTRY).forEach((config) => {
      config.steps.forEach((step) => {
        expect(step.component).toBeDefined();
        expect(step.component).toBeInstanceOf(Function);
      });
    });
  });
});