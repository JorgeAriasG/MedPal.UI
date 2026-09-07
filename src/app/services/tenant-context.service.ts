/**
 * Tenant Context Service
 * Manages multi-tenant context extraction from JWT claims
 *
 * Provides access to account ID, clinic ID, user ID, and role information
 * extracted from the JWT token and cached for performance
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { decodeTokenClaims, hasValidRoles, isStaff, isPatient } from '../utils/token-utils';

/**
 * Tenant Context Service
 * Extracts and maintains tenant/organization context from JWT claims
 *
 * @note Context updates when user logs in/out or token is refreshed
 */
@Injectable({
  providedIn: 'root',
})
export class TenantContextService {
  private accountId: number | null = null;
  private clinicId: number | null = null;
  private clinicIds: number[] = [];
  private userId: number | null = null;
  private role: string | null = null;
  private roles: string[] = [];

  // Subject for context changes
  private contextChange$ = new Subject<void>();

  constructor() {
    this.loadContextFromToken();
  }

  /**
   * Load tenant context from JWT token
   * Called on service initialization and after login
   * Now uses centralized token-utils decoder aligned with Jwt-Claims-Contract.md
   */
  private loadContextFromToken(): void {
    try {
      // Try sessionStorage first (more secure), then localStorage
      const token =
        sessionStorage.getItem('ngrx_auth') ||
        localStorage.getItem('ngrx_auth');

      if (!token) {
        this.clearContext();
        return;
      }

      // Parse auth state from JSON to get the JWT token
      const authState = JSON.parse(token);
      const jwtToken = authState?.userToken;

      if (!jwtToken) {
        this.clearContext();
        return;
      }

      // Use centralized decoder aligned with new snake_case contract
      const claims = decodeTokenClaims(jwtToken);

      // Critical security: if token has no valid roles[], treat as unauthenticated
      if (!hasValidRoles(claims)) {
        this.clearContext();
        return;
      }

      // Extract tenant context from claims using new snake_case names
      this.accountId = claims.accountId || null;
      this.clinicId = claims.clinicId || null;
      this.userId = claims.userId || null;
      this.role = claims.role || null;
      this.roles = claims.roles;

      // Set clinicIds from clinicId if available
      if (claims.clinicId !== null) {
        this.clinicIds = [claims.clinicId];
      }

      this.contextChange$.next();
    } catch (error) {
      console.warn('Failed to load tenant context from token:', error);
      this.clearContext();
    }
  }

  /**
   * Refresh context from token
   * Call this after login or token refresh
   */
  public refreshContext(): void {
    this.loadContextFromToken();
  }

  /**
   * Clear all context
   * Call this on logout
   */
  public clearContext(): void {
    this.accountId = null;
    this.clinicId = null;
    this.clinicIds = [];
    this.userId = null;
    this.role = null;
    this.roles = [];
    this.contextChange$.next();
  }

  /**
   * Get observable for context changes
   * @returns Observable that emits when context changes
   */
  public onContextChange(): Observable<void> {
    return this.contextChange$.asObservable();
  }

  /**
   * Account/Organization Context
   */

  /**
   * Get current account ID
   * @returns Account ID or null if not available
   */
  public getAccountId(): number | null {
    return this.accountId;
  }

  /**
   * Check if account context is available
   * @returns true if account ID is set
   */
  public hasAccountContext(): boolean {
    return this.accountId !== null;
  }

  /**
   * Clinic Context
   */

  /**
   * Get current/primary clinic ID
   * @returns Primary clinic ID or null if not available
   */
  public getClinicId(): number | null {
    return this.clinicId;
  }

  /**
   * Get all clinic IDs user has access to
   * @returns Array of clinic IDs
   */
  public getClinicIds(): number[] {
    return [...this.clinicIds];
  }

  /**
   * Check if user has access to specific clinic
   * @param clinicId Clinic ID to check
   * @returns true if user has access to this clinic (or is admin with all access)
   */
  public hasClinicAccess(clinicId: number): boolean {
    // If no clinic restrictions, user has access to all
    if (this.clinicIds.length === 0) {
      return true;
    }

    // Check if clinicId is in user's allowed clinics
    return this.clinicIds.includes(clinicId);
  }

  /**
   * Check if clinic context is available
   * @returns true if clinic ID is set
   */
  public hasClinicContext(): boolean {
    return this.clinicId !== null;
  }

  /**
   * User Context
   */

  /**
   * Get current user ID
   * @returns User ID or null if not available
   */
  public getUserId(): number | null {
    return this.userId;
  }

  /**
   * Check if user context is available
   * @returns true if user ID is set
   */
  public hasUserContext(): boolean {
    return this.userId !== null;
  }

  /**
   * Role Context
   */

  /**
   * Get user's primary role
   * @returns Role name or null if not available
   */
  public getRole(): string | null {
    return this.role;
  }

  /**
   * Get all user's roles
   * @returns Array of role names
   */
  public getRoles(): string[] {
    return [...this.roles];
  }

  /**
   * Check if user has a specific role
   * @param role Role name to check
   * @returns true if user has this role
   */
  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Check if user has ANY of the specified roles
   * @param roles Array of role names to check
   * @returns true if user has at least one of these roles
   */
  public hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  /**
   * Check if user has ALL of the specified roles
   * @param roles Array of role names to check
   * @returns true if user has all of these roles
   */
  public hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.roles.includes(role));
  }

  /**
   * Check if user is a system admin (SUPER_ADMIN or ADMIN role)
   * @returns true if user is a system admin
   */
  public isSystemAdmin(): boolean {
    return this.hasAnyRole(['SUPER_ADMIN', 'ADMIN']);
  }

  /**
   * Check if user is a clinic admin
   * @returns true if user is a clinic admin
   */
  public isClinicAdmin(): boolean {
    return this.hasRole('CLINIC_ADMIN');
  }

  /**
   * Check if user is a medical professional (DOCTOR, NURSE)
   * @returns true if user is medical staff
   */
  public isMedicalProfessional(): boolean {
    return this.hasAnyRole(['HEALTH_PROFESSIONAL', 'NURSE', 'PHARMACIST']);
  }

  /**
   * Check if user is a patient
   * @returns true if user is a patient
   */
  public isPatient(): boolean {
    return this.hasRole('PATIENT');
  }

  /**
   * Complete Context Summary
   */

  /**
   * Get complete tenant context
   * @returns Object with all context information
   */
  public getContext(): {
    accountId: number | null;
    clinicId: number | null;
    clinicIds: number[];
    userId: number | null;
    role: string | null;
    roles: string[];
  } {
    return {
      accountId: this.accountId,
      clinicId: this.clinicId,
      clinicIds: [...this.clinicIds],
      userId: this.userId,
      role: this.role,
      roles: [...this.roles],
    };
  }

  /**
   * Check if full context is available
   * @returns true if account, clinic, user, and role are all set
   */
  public hasFullContext(): boolean {
    return (
      this.accountId !== null &&
      this.clinicId !== null &&
      this.userId !== null &&
      this.role !== null
    );
  }

  /**
   * Get context for API requests
   * Useful for including in API calls as query params or headers
   * @returns Object with context for API calls
   */
  public getContextForAPI(): {
    accountId?: number;
    clinicId?: number;
    userId?: number;
  } {
    const context: {
      accountId?: number;
      clinicId?: number;
      userId?: number;
    } = {};

    if (this.accountId !== null) context.accountId = this.accountId;
    if (this.clinicId !== null) context.clinicId = this.clinicId;
    if (this.userId !== null) context.userId = this.userId;

    return context;
  }
}