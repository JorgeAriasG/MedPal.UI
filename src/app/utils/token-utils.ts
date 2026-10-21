/**
 * Token Utils
 * Centralized JWT claims decoder aligned with Jwt-Claims-Contract.md
 *
 * Backend (TokenService.GenerateToken) now emits claims in snake_case:
 *   sub, user_id, email, user_type, account_id, clinic_id, roles[], role, jti, patient_id
 *
 * Rules:
 * - Token sin roles[] → tratar como no autenticado (logout/redirect), NUNCA como Patient
 * - Tokens de paciente NO deben llevar account_id/clinic_id (viola el contrato)
 * - role (first role) es solo para render UI; decisiones de permiso deben basarse en roles[]
 * - sub o user_id pueden usarse para id. de usuario (fallback de sub a user_id)
 */

export interface TokenClaims {
  /** Identificador único del usuario (sub o user_id fallback) */
  userId: number | null;
  /** Id. de tenant (account_id, puede ser null) */
  accountId: number | null;
  /** Id. de clínica (clinic_id, puede ser null) */
  clinicId: number | null;
  /** Array de roles canónico [] o [] */
  roles: string[];
  /** Rol legacy solo para render UI (puede ser undefined) */
  role: string | undefined;
  /** Tipo de usuario: "staff" o "patient" */
  userType: string | null;
  /** Id. de paciente (solo tokens de paciente, puede ser null) */
  patientId: number | null;
}

/**
 * Decode JWT token payload aligned with the new contract
 * @param token JWT token string
 * @returns TokenClaims object con la convención snake_case actualizada
 */
export function decodeTokenClaims(token: string): TokenClaims {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return defaultTokenClaims();
    }

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    );

    if (!decoded || !decoded.roles) {
      // Token sin roles[] → inválido, retornar claims vacíos/neutros
      return defaultTokenClaims();
    }

    // userId: usar sub primero, luego user_id como fallback
    const userId = decoded.sub || decoded.user_id || null;

    // accountId: solo staff; null para patient
    const accountId =
      decoded.account_id !== undefined ? decoded.account_id : null;

    // clinicId: solo staff; >0; null para patient
    const clinicId = decoded.clinic_id !== undefined ? decoded.clinic_id : null;

    // roles: array canónico (siempre existirá por la validación anterior)
    const roles: string[] =
      typeof decoded.roles === 'string'
        ? [decoded.roles] // wrap string in array
        : Array.isArray(decoded.roles)
          ? decoded.roles
          : [];

    // role: legacy render - solo primer rol de la lista (NO usar para decisiones)
    const role = roles.length > 0 ? roles[0] : undefined;

    // userType: "staff" o "patient"
    const userType = decoded.user_type || null;

    // patientId: solo en tokens de paciente
    const patientId =
      decoded.patient_id !== undefined ? decoded.patient_id : null;

    return { userId, accountId, clinicId, roles, role, userType, patientId };
  } catch (error) {
    console.warn('Failed to decode token claims:', error);
    return defaultTokenClaims();
  }
}

/** Claims por defecto para token inválido o ausente */
function defaultTokenClaims(): TokenClaims {
  return {
    userId: null,
    accountId: null,
    clinicId: null,
    roles: [],
    role: undefined,
    userType: null,
    patientId: null,
  };
}

/**
 * Verify if token has valid roles[] (critical security check)
 * @param claims TokenClaims to validate
 * @returns true if token has valid roles array
 */
export function hasValidRoles(claims: TokenClaims): boolean {
  return Array.isArray(claims.roles) && claims.roles.length > 0;
}

/**
 * Check if user is staff based on userType
 * @param claims TokenClaims to check
 * @returns true if userType is "staff"
 */
export function isStaff(claims: TokenClaims): boolean {
  return claims.userType === 'staff';
}

/**
 * Check if user is patient based on userType
 * @param claims TokenClaims to check
 * @returns true if userType is "patient"
 */
export function isPatient(claims: TokenClaims): boolean {
  return claims.userType === 'patient';
}

/**
 * Get effective userId falling back sub → user_id → null
 * @param claims TokenClaims
 * @returns userId or null
 */
export function getUserId(claims: TokenClaims): number | null {
  return claims.userId;
}

/**
 * Check if user has specific role in roles[]
 * @param claims TokenClaims
 * @param role Role name to check
 * @returns true if user has this role
 */
export function hasRole(claims: TokenClaims, role: string): boolean {
  return claims.roles.includes(role);
}

/**
 * Check if user has ANY of the specified roles
 * @param claims TokenClaims
 * @param roles Array of role names to check
 * @returns true if user has at least one of these roles
 */
export function hasAnyRole(claims: TokenClaims, roles: string[]): boolean {
  return claims.roles.some((r) => roles.includes(r));
}

/**
 * Check if user has ALL of the specified roles
 * @param claims TokenClaims
 * @param roles Array of role names to check
 * @returns true if user has all of these roles
 */
export function hasAllRoles(claims: TokenClaims, roles: string[]): boolean {
  return claims.roles.every((r) => roles.includes(r));
}
