export function toHourMinute(value: any): { hour: number; minute: number } {
  if (!value) return { hour: 0, minute: 0 };
  if (typeof value === 'object' && 'hour' in value && 'minute' in value) {
    return { hour: Number(value.hour), minute: Number(value.minute) };
  }
  if (typeof value === 'string') {
    // "HH:mm" or "HH:mm:ss"
    const [h, m] = value.split(':').map(v => Number(v));
    return { hour: Number.isFinite(h) ? h : 0, minute: Number.isFinite(m) ? m : 0 };
  }
  if (value instanceof Date) {
    return { hour: value.getHours(), minute: value.getMinutes() };
  }
  return { hour: 0, minute: 0 };
}

export function toDateOnlyObject(date: Date | string | null) {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    dayOfWeek: d.getDay()
  };
}

export function toTimeObject(dateOrTime: Date | string | { hour: number; minute: number } | null) {
  if (!dateOrTime) return null;
  if (typeof dateOrTime === 'object' && 'hour' in dateOrTime && 'minute' in dateOrTime) {
    return { hour: Number(dateOrTime.hour), minute: Number(dateOrTime.minute) };
  }
  if (typeof dateOrTime === 'string' && dateOrTime.includes(':')) {
    const [hour, minute] = dateOrTime.split(':').map(Number);
    return { hour: hour || 0, minute: minute || 0 };
  }
  const d = typeof dateOrTime === 'string' ? new Date(dateOrTime) : dateOrTime;
  return { hour: d.getHours(), minute: d.getMinutes() };
}
