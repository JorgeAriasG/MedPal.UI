/**
 * Permission Service
 * Manages role-based access control (RBAC) for audit and consent features
 *
 * Extracts permissions from JWT claims and provides methods for permission checking
 */

import { Injectable } from '@angular/core';

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

      // Parse auth state from JSON
      const authState = JSON.parse(token);
      const jwtToken = authState?.token;

      if (!jwtToken) {
        this.cachedPermissions.clear();
        this.cachedClaims.clear();
        return;
      }

      // Extract and decode JWT payload
      const decodedPayload = this.decodeJWT(jwtToken);

      // Extract permissions from claims
      const permissions = decodedPayload?.permissions || [];
      const roles = decodedPayload?.roles || [];

      // Build permission set from both explicit permissions and role-based permissions
      this.cachedPermissions = new Set([
        ...permissions,
        ...this.derivePermissionsFromRoles(roles),
      ]);

      // Cache all claims for later use
      this.cachedClaims = new Map(Object.entries(decodedPayload || {}));
    } catch (error) {
      console.warn('Failed to load permissions from token:', error);
      this.cachedPermissions.clear();
      this.cachedClaims.clear();
    }
  }

  /**
   * Decode JWT token payload
   * @param token JWT token string
   * @returns Decoded payload object or null if invalid
   */
  private decodeJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return decoded;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
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
      DOCTOR: [
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
   * @returns true if user can view consent
   */
  public canViewConsent(): boolean {
    return this.hasPermission(Permission.VIEW_CONSENT);
  }

  /**
   * Can user approve consent requests?
   * @returns true if user can approve consent
   */
  public canApproveConsent(): boolean {
    return this.hasPermission(Permission.APPROVE_CONSENT);
  }

  /**
   * Can user revoke patient consent?
   * @returns true if user can revoke consent
   */
  public canRevokeConsent(): boolean {
    return this.hasPermission(Permission.REVOKE_CONSENT);
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
