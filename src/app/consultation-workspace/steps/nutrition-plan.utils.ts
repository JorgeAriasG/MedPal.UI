export interface PlanFood {
  name: string;
  cantidad: number;
  unidad: string;
  kcalBase?: number;
  proteinBase?: number;
  carbsBase?: number;
  fatBase?: number;
  servingSize?: number;
  servingUnit?: string;
}

export const MEAL_MOMENT_DEFAULT_COUNT = 4;

const MOMENT_SETS: Record<number, string[]> = {
  2: ['breakfast', 'lunch'],
  3: ['breakfast', 'lunch', 'dinner'],
  4: ['breakfast', 'morning-snack', 'lunch', 'dinner'],
  5: ['breakfast', 'morning-snack', 'lunch', 'afternoon-snack', 'dinner'],
  6: ['breakfast', 'morning-snack', 'lunch', 'afternoon-snack', 'dinner', 'supper'],
};

export function mealMomentsFor(count: number): string[] {
  return MOMENT_SETS[count] || MOMENT_SETS[MEAL_MOMENT_DEFAULT_COUNT];
}

export function parseLegacyFood(value: string): PlanFood | null {
  const match = /^(.*?)\s*·\s*([\d.,]+)\s*([^\s]+)\s*$/.exec((value || '').trim());
  if (!match) return null;
  const cantidad = parseFloat(match[2].replace(',', '.'));
  return {
    name: match[1].trim(),
    cantidad: isNaN(cantidad) ? 1 : cantidad,
    unidad: match[3],
  };
}

export function normalizePlanFoods(alimentos: unknown): PlanFood[] {
  if (!Array.isArray(alimentos)) return [];
  return alimentos
    .map((f: any): PlanFood | null => {
      if (typeof f === 'string') {
        return parseLegacyFood(f) || { name: f, cantidad: 1, unidad: 'unidad' };
      }
      if (f && typeof f === 'object') {
        const out: PlanFood = {
          name: f.name || 'Alimento',
          cantidad: Number(f.cantidad ?? f.quantity ?? 1) || 1,
          unidad: f.unidad || f.unit || 'unidad',
        };
        const kcalBase = f.kcalBase ?? f.calories;
        if (kcalBase != null) out.kcalBase = Number(kcalBase);
        const proteinBase = f.proteinBase ?? f.protein;
        if (proteinBase != null) out.proteinBase = Number(proteinBase);
        const carbsBase = f.carbsBase ?? f.carbs;
        if (carbsBase != null) out.carbsBase = Number(carbsBase);
        const fatBase = f.fatBase ?? f.fat;
        if (fatBase != null) out.fatBase = Number(fatBase);
        if (f.servingSize != null) out.servingSize = Number(f.servingSize);
        if (f.servingUnit != null) out.servingUnit = f.servingUnit;
        return out;
      }
      return null;
    })
    .filter((f): f is PlanFood => f !== null);
}

export function computeFoodKcal(food: PlanFood): number {
  const base = Number(food.kcalBase) || 0;
  if (!base) return 0;
  const size = Number(food.servingSize) || 0;
  const sameUnit = !!food.servingUnit && food.unidad === food.servingUnit;
  if (!sameUnit || size <= 0) return Math.round(base);
  const ratio = (Number(food.cantidad) || 0) / size;
  return Math.round(base * ratio);
}