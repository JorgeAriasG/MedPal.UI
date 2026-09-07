/**
 * Permission Service
 * Manages role-based access control (RBAC) for audit and consent features
 *
 * Extracts permissions from JWT claims and provides methods for permission checking
 * Now aligned with Jwt-Claims-Contract.md snake_case claims convention
 */

import { Injectable } from '@angular/core';
import { decodeTokenClaims, hasValidRoles } from '../utils/token-utils';

/**
 * Available permissions in the system
 */
export enum Permission {
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_AUDIT_LOGS = 'MANAGE_AUDIT_LOGS',
  EXPORT_AUDIT_LOGS = 'EXPORT_AUDIT_LOGS',
  GENERATE_AUDIT_REPORTS = 'GENERATE_AUDIT_REPORTS',
  VIEW_CONSENT = 'VIEW_CONSENT',
  APPROVE_CONSENT = 'APPROVE_CONSENT',
  REVOKE_CONSENT = 'REVOKE_CONSENT',
  VIEW_MEDICAL_HISTORY = 'VIEW_MEDICAL_HISTORY',
  MANAGE_MEDICAL_HISTORY = 'MANAGE_MEDICAL_HISTORY',
}

/**
 * Permission Service
 * Handles JWT claim extraction and permission checking
 *
 * @note Caches permissions to avoid repeated token parsing
 * @note Uses centralized token-utils decoder for snake_case claims
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private cachedPermissions: Set<string> = new Set();
  private cachedClaims: Map<string, any> = new Map();

  constructor() {
    this.loadPermissionsFromToken();
  }

  /**
   * Load permissions from JWT token in storage
   * Called on service initialization and after login
   * Now uses centralized token-utils decoder aligned with Jwt-Claims-Contract.md
   */
  private loadPermissionsFromToken(): void {
    try {
      // Try sessionStorage first (more secure), then localStorage
      const token =
        sessionStorage.getItem('ngrx_auth') ||
        localStorage.getItem('ngrx_auth');

      if (!token) {
        this.cachedPermissions.clear();
        this.cachedClaims.clear();
        return;
      }

      // Parse auth state from JSON to get the JWT token
      const authState = JSON.parse(token);
      const jwtToken = authState?.userToken || localStorage.getItem('auth_token');

      if (!jwtToken) {
        this.cachedPermissions.clear();
        this.cachedClaims.clear();
        return;
      }

      // Use centralized decoder aligned with new snake_case contract
      const claims = decodeTokenClaims(jwtToken);

      // Critical security: if token has no valid roles[], treat as unauthenticated
      if (!hasValidRoles(claims)) {
        // Token inválido - roles vacío → limpiar todo y tratar como no autenticado
        this.cachedPermissions.clear();
        this.cachedClaims.clear();
        return;
      }

      // Extract permissions from roles using the role-permission map
      const roles = claims.roles;
      const permissions: string[] = [];
      roles.forEach((role) => {
        const rolePermissions = this.derivePermissionsFromRoles([role]);
        permissions.push(...rolePermissions);
      });

      this.cachedPermissions = new Set(permissions);

      // Cache all claims for later use (e.g., tenant context, role checks)
      this.cachedClaims = new Map<string, any>([
        ['userType', claims.userType],
        ['accountId', claims.accountId],
        ['clinicId', claims.clinicId],
        ['patientId', claims.patientId],
        ['roles', claims.roles],
        ['userId', claims.userId],
        ['role', claims.role],
      ]);
    } catch (error) {
      console.warn('Failed to load permissions from token:', error);
      this.cachedPermissions.clear();
      this.cachedClaims.clear();
    }
  }

  /**
   * Derive permissions from roles
   * Maps role names to their associated permissions
   * @param roles Array of role names
   * @returns Array of permissions derived from roles
   */
  private derivePermissionsFromRoles(roles: string[]): string[] {
    const rolePermissionMap: Record<string, string[]> = {
      SUPER_ADMIN: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.REVOKE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      ADMIN: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      CLINIC_ADMIN: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
      ],
      ACCOUNT_ADMIN: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      HEALTH_PROFESSIONAL: [
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.VIEW_CONSENT,
      ],
      NURSE: [
        Permission.VIEW_MEDICAL_HISTORY,
      ],
      PATIENT: [
        Permission.VIEW_CONSENT,
        Permission.REVOKE_CONSENT,
      ],
      // Actual JWT role names from the backend (PascalCase / camelCase)
      SuperAdmin: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.REVOKE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      Admin: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      AccountAdmin: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.GENERATE_AUDIT_REPORTS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.MANAGE_MEDICAL_HISTORY,
      ],
      ClinicAdmin: [
        Permission.VIEW_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.VIEW_CONSENT,
        Permission.APPROVE_CONSENT,
        Permission.VIEW_MEDICAL_HISTORY,
      ],
      HealthProfessional: [
        Permission.VIEW_MEDICAL_HISTORY,
        Permission.VIEW_CONSENT,
      ],
      Nurse: [
        Permission.VIEW_MEDICAL_HISTORY,
      ],
      Patient: [
        Permission.VIEW_CONSENT,
        Permission.REVOKE_CONSENT,
      ],
    };

    const permissions: string[] = [];
    roles.forEach((role) => {
      const rolePermissions = rolePermissionMap[role] || [];
      permissions.push(...rolePermissions);
    });

    return [...new Set(permissions)]; // Remove duplicates
  }

  /**
   * Refresh permissions from token
   * Call this after login or token refresh
   */
  public refreshPermissions(): void {
    this.loadPermissionsFromToken();
  }

  /**
   * Check if user has a specific permission
   * @param permission Permission to check
   * @returns true if user has permission
   */
  public hasPermission(permission: string | Permission): boolean {
    return this.cachedPermissions.has(permission);
  }

  /**
   * Check if user has ALL of the specified permissions
   * @param permissions Array of permissions to check
   * @returns true if user has all permissions
   */
  public hasAllPermissions(
    permissions: (string | Permission)[]
  ): boolean {
    return permissions.every((p) => this.cachedPermissions.has(p));
  }

  /**
   * Check if user has ANY of the specified permissions
   * @param permissions Array of permissions to check
   * @returns true if user has at least one permission
   */
  public hasAnyPermission(
    permissions: (string | Permission)[]
  ): boolean {
    return permissions.some((p) => this.cachedPermissions.has(p));
  }

  /**
   * Audit-specific permission checks
   */

  /**
   * Can user view audit logs?
   * @param clinicId Optional clinic ID to check access for specific clinic
   * @returns true if user can view audit logs
   */
  public canViewAuditLogs(clinicId?: number): boolean {
    if (!this.hasPermission(Permission.VIEW_AUDIT_LOGS)) {
      return false;
    }

    // If clinicId specified, check if user has access to that clinic
    if (clinicId) {
      const userClinicIds = this.getUserClinicIds();
      return userClinicIds.length === 0 || userClinicIds.includes(clinicId);
    }

    return true;
  }

  /**
   * Can user manage (filter/export) audit logs?
   * @returns true if user can manage audit logs
   */
  public canManageAuditLogs(): boolean {
    return this.hasPermission(Permission.MANAGE_AUDIT_LOGS);
  }

  /**
   * Can user export audit logs?
   * @returns true if user can export audit logs
   */
  public canExportAuditLogs(): boolean {
    return this.hasPermission(Permission.EXPORT_AUDIT_LOGS);
  }

  /**
   * Can user generate audit reports?
   * @returns true if user can generate reports
   */
  public canGenerateAuditReports(): boolean {
    return this.hasPermission(Permission.GENERATE_AUDIT_REPORTS);
  }

  /**
   * Consent-specific permission checks
   */

  /**
   * Can user view patient consent records?
   * Also allows the patient themselves (via patientId and userType === "patient")
   * @returns true if user can view consent
   */
  public canViewConsent(): boolean {
    // Check explicit permission first
    if (this.hasPermission(Permission.VIEW_CONSENT)) {
      return true;
    }

    // Allow patient to view their own consents via userType and patientId
    const userType = this.cachedClaims.get('userType');
    const patientId = this.cachedClaims.get('patientId');

    // If user is a patient, allow them to view their own consents
    if (userType === 'patient' && patientId !== null) {
      return true;
    }

    return false;
  }

  /**
   * Can user approve consent requests?
   * Also allows the patient themselves for their own consents
   * @returns true if user can approve consent
   */
  public canApproveConsent(): boolean {
    // Check explicit permission first
    if (this.hasPermission(Permission.APPROVE_CONSENT)) {
      return true;
    }

    // Allow patient to approve their own consents
    const userType = this.cachedClaims.get('userType');
    const patientId = this.cachedClaims.get('patientId');

    if (userType === 'patient' && patientId !== null) {
      return true;
    }

    return false;
  }

  /**
   * Can user revoke patient consent?
   * Also allows the patient themselves to revoke their own consents
   * @returns true if user can revoke consent
   */
  public canRevokeConsent(): boolean {
    // Check explicit permission first
    if (this.hasPermission(Permission.REVOKE_CONSENT)) {
      return true;
    }

    // Allow patient to revoke their own consents
    const userType = this.cachedClaims.get('userType');
    const patientId = this.cachedClaims.get('patientId');

    if (userType === 'patient' && patientId !== null) {
      return true;
    }

    return false;
  }

  /**
   * Medical history permission checks
   */

  /**
   * Can user view medical history?
   * @returns true if user can view medical history
   */
  public canViewMedicalHistory(): boolean {
    return this.hasPermission(Permission.VIEW_MEDICAL_HISTORY);
  }

  /**
   * Can user manage medical history?
   * @returns true if user can manage medical history
   */
  public canManageMedicalHistory(): boolean {
    return this.hasPermission(Permission.MANAGE_MEDICAL_HISTORY);
  }

  /**
   * Get user's role from token claims
   * @returns User's role or null if not available
   */
  public getUserRole(): string | null {
    return this.cachedClaims.get('role') || null;
  }

  /**
   * Get user's roles from token claims
   * @returns Array of user's roles or empty array
   */
  public getUserRoles(): string[] {
    const roles = this.cachedClaims.get('roles');
    return Array.isArray(roles) ? roles : [];
  }

  /**
   * Get user's userType from token claims
   * @returns User type ("staff" or "patient") or null
   */
  public getUserType(): string | null {
    return this.cachedClaims.get('userType') || null;
  }

  /**
   * Get user's patientId from token claims
   * @returns Patient ID or null if not a patient token
   */
  public getPatientId(): number | null {
    return this.cachedClaims.get('patientId') || null;
  }

  /**
   * Get user's accountId from token claims
   * @returns Account ID or null
   */
  public getAccountId(): number | null {
    return this.cachedClaims.get('accountId') || null;
  }

  /**
   * Get user's clinicId from token claims
   * @returns Clinic ID or null
   */
  public getClinicId(): number | null {
    return this.cachedClaims.get('clinicId') || null;
  }

  /**
   * Get user's clinic IDs from token claims
   * @returns Array of clinic IDs or empty array if user has access to all
   */
  public getUserClinicIds(): number[] {
    const clinicIds = this.cachedClaims.get('clinicIds');
    return Array.isArray(clinicIds) ? clinicIds : [];
  }

  /**
   * Get all cached claims from JWT
   * @returns Map of all JWT claims
   */
  public getAllClaims(): Map<string, any> {
    return new Map(this.cachedClaims);
  }

  /**
   * Get specific claim from JWT
   * @param claimKey Claim key to retrieve
   * @returns Claim value or null if not found
   */
  public getClaim(claimKey: string): any {
    return this.cachedClaims.get(claimKey) || null;
  }

  /**
   * Check if token is expired
   * @returns true if token is expired or invalid
   */
  public isTokenExpired(): boolean {
    if (this.cachedClaims.size === 0) {
      this.loadPermissionsFromToken();
    }
    const exp = this.cachedClaims.get('exp');
    if (!exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  /**
   * Clear all cached permissions and claims
   * Call this on logout
   */
  public clearPermissions(): void {
    this.cachedPermissions.clear();
    this.cachedClaims.clear();
  }
}