export function getBmiColor(bmi: number): string {
  if (!bmi || bmi === 0) return '#9e9e9e';
  if (bmi < 18.5) return '#ff9800';
  if (bmi < 25) return '#4caf50';
  if (bmi < 30) return '#ff9800';
  return '#f44336';
}

export function getBmiCategory(bmi: number): string {
  if (!bmi || bmi === 0) return '';
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidad Grado I';
  if (bmi < 40) return 'Obesidad Grado II';
  return 'Obesidad Grado III';
}
