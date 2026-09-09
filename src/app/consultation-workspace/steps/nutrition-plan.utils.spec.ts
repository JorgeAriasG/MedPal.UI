import {
  PlanFood,
  computeFoodKcal,
  mealMomentsFor,
  normalizePlanFoods,
  parseLegacyFood,
} from './nutrition-plan.utils';

describe('nutrition-plan.utils', () => {
  describe('mealMomentsFor', () => {
    it('returns the canonical moment sets per count', () => {
      expect(mealMomentsFor(2)).toEqual(['breakfast', 'lunch']);
      expect(mealMomentsFor(3)).toEqual(['breakfast', 'lunch', 'dinner']);
      expect(mealMomentsFor(4)).toEqual(['breakfast', 'morning-snack', 'lunch', 'dinner']);
      expect(mealMomentsFor(5)).toEqual([
        'breakfast',
        'morning-snack',
        'lunch',
        'afternoon-snack',
        'dinner',
      ]);
      expect(mealMomentsFor(6)).toEqual([
        'breakfast',
        'morning-snack',
        'lunch',
        'afternoon-snack',
        'dinner',
        'supper',
      ]);
    });

    it('falls back to the default set for unknown counts', () => {
      expect(mealMomentsFor(7)).toEqual(mealMomentsFor(4));
      expect(mealMomentsFor(0)).toEqual(mealMomentsFor(4));
    });
  });

  describe('parseLegacyFood', () => {
    it('parses "name · amount unit" legacy chips', () => {
      expect(parseLegacyFood('Avena · 40 g')).toEqual({
        name: 'Avena',
        cantidad: 40,
        unidad: 'g',
      });
      expect(parseLegacyFood('Pechuga · 1.5 pieza')).toEqual({
        name: 'Pechuga',
        cantidad: 1.5,
        unidad: 'pieza',
      });
    });

    it('accepts comma decimals and returns null otherwise', () => {
      expect(parseLegacyFood('Arroz · 0,5 taza')!.cantidad).toBe(0.5);
      expect(parseLegacyFood('Solo un alimento')).toBeNull();
    });
  });

  describe('normalizePlanFoods', () => {
    it('converts legacy string items into PlanFood objects', () => {
      const result = normalizePlanFoods(['Avena · 40 g', 'Manzana']);
      expect(result).toEqual([
        { name: 'Avena', cantidad: 40, unidad: 'g' },
        { name: 'Manzana', cantidad: 1, unidad: 'unidad' },
      ]);
    });

    it('passes through object items completing defaults', () => {
      const result = normalizePlanFoods([
        {
          name: 'Pollo',
          cantidad: 120,
          unidad: 'g',
          kcalBase: 165,
          servingSize: 100,
          servingUnit: 'g',
        },
        { name: 'Yogur' },
      ]);
      expect(result[0]).toEqual({
        name: 'Pollo',
        cantidad: 120,
        unidad: 'g',
        kcalBase: 165,
        servingSize: 100,
        servingUnit: 'g',
      });
      expect(result[1]).toEqual({
        name: 'Yogur',
        cantidad: 1,
        unidad: 'unidad',
      });
    });

    it('handles empty and invalid inputs defensively', () => {
      expect(normalizePlanFoods(undefined)).toEqual([]);
      expect(normalizePlanFoods(null)).toEqual([]);
      expect(normalizePlanFoods('not-an-array')).toEqual([]);
    });
  });

  describe('computeFoodKcal', () => {
    const base: PlanFood = {
      name: 'Pollo',
      cantidad: 150,
      unidad: 'g',
      kcalBase: 165,
      servingSize: 100,
      servingUnit: 'g',
    };

    it('scales kcal by the amount ratio when units match', () => {
      expect(computeFoodKcal(base)).toBe(248);
    });

    it('keeps base kcal when the unit differs from the serving unit', () => {
      expect(computeFoodKcal({ ...base, unidad: 'taza' })).toBe(165);
    });

    it('does not scale without base data', () => {
      expect(computeFoodKcal({ name: 'X', cantidad: 10, unidad: 'g' })).toBe(0);
    });

    it('handles zero amounts', () => {
      expect(computeFoodKcal({ ...base, cantidad: 0 })).toBe(0);
    });
  });
});