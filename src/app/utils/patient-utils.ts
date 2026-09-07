export const PLACEHOLDER_EMAIL_SUFFIX = '@clinicflow.temp';

export function hasRealEmail(email?: string | null): boolean {
  return !!email && !email.endsWith(PLACEHOLDER_EMAIL_SUFFIX);
}

export function displayEmail(email?: string | null): string {
  return hasRealEmail(email) ? (email as string) : '—';
}