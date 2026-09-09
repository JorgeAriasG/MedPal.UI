import { canGeneratePrescription, resolveSpecialty } from './specialty-config';

describe('specialty-config', () => {
  describe('resolveSpecialty', () => {
    it('normalizes Spanish labels and keys to SpecialtyType', () => {
      expect(resolveSpecialty('Nutrición')).toBe('Nutrition');
      expect(resolveSpecialty('nutricion')).toBe('Nutrition');
      expect(resolveSpecialty('Medicina General')).toBe('General');
      expect(resolveSpecialty('Cardiología')).toBe('Cardiology');
      expect(resolveSpecialty('Odontología')).toBe('Dental');
      expect(resolveSpecialty('nutrition')).toBe('Nutrition');
    });

    it('falls back to General for empty or unknown values', () => {
      expect(resolveSpecialty(undefined)).toBe('General');
      expect(resolveSpecialty(null)).toBe('General');
      expect(resolveSpecialty('')).toBe('General');
      expect(resolveSpecialty('Psychiatry')).toBe('General');
    });
  });

  describe('canGeneratePrescription', () => {
    it('allows prescription generation only for SOAP specialties', () => {
      expect(canGeneratePrescription('General')).toBeTrue();
      expect(canGeneratePrescription('Cardiology')).toBeTrue();
      expect(canGeneratePrescription('Medicina General')).toBeTrue();
    });

    it('blocks prescription generation for Nutrition and Dental', () => {
      expect(canGeneratePrescription('Nutrition')).toBeFalse();
      expect(canGeneratePrescription('Nutrición')).toBeFalse();
      expect(canGeneratePrescription('Dental')).toBeFalse();
    });

    it('resolves empty/unknown values to the General fallback (SOAP-capable)', () => {
      expect(canGeneratePrescription(null)).toBeTrue();
      expect(canGeneratePrescription(undefined)).toBeTrue();
      expect(canGeneratePrescription('')).toBeTrue();
      expect(canGeneratePrescription('Psychiatry')).toBeTrue();
    });
  });
});