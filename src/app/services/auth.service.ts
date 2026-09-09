import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  logout,
  loginSuccess,
} from '../store/actions/auth.actions';
import { AuthState, initialState } from '../store/reducers/auth.reducer';
import { selectAuthState } from '../store/selectors/auth.selectors';
import { PermissionService } from './permission.service';
import { ApiService } from './api.service';
import {
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  InitiateRegRequest,
  InitiateRegResponse,
  CompleteRegRequest,
  CompleteRegResponse,
  User,
  AuthContext,
  UserRole,
  ADMIN_ROLES,
  CLINICAL_ROLES,
} from '../entities/auth.models';

/**
 * Authentication Service
 *
 * Manages user authentication, role verification, and permissions checking.
 * Auth state is sourced from the NgRx store (single source of truth).
 * Legacy localStorage keys (auth_token, user_role, user_permissions,
 * user_data) are removed on boot; the store rehydrates via
 * ngrx-store-localstorage (key 'auth').
 *
 * Key Features:
 * - JWT token management
 * - Role-based access control (RBAC)
 * - Permission verification
 * - Multi-tenancy support (accountId, clinicId)
 * - Reactive auth state via BehaviorSubject
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginEndpoint = 'User/login';
  private currentUserEndpoint = 'User/me';

  // Legacy storage keys removed one-shot on construction
  private readonly LEGACY_STORAGE_KEYS = [
    'auth_token',
    'user_role',
    'user_permissions',
    'user_data',
  ];

  // Observable auth state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Synchronous snapshot of the auth store (replaced store.value usage)
  private authSnapshot: AuthState = initialState;

  constructor(
    private router: Router,
    private http: HttpClient,
    private store: Store<{ auth: AuthState }>,
    private apiService: ApiService,
    private permissionService: PermissionService,
  ) {
    // One-shot cleanup of deprecated localStorage keys.
    // NgRx store (persisted as ngrx_auth) is the only source of truth.
    this.LEGACY_STORAGE_KEYS.forEach((key) =>
      localStorage.removeItem(key),
    );

    // Keep a live snapshot of auth state and mirror it into currentUser$.
    // This lets synchronous getters (getToken, getRole, getClinicId...)
    // read from the store instead of localStorage.
    this.store.select(selectAuthState).subscribe((state) => {
      const snapshot = state ?? initialState;
      this.authSnapshot = snapshot;
      this.currentUserSubject.next(this.buildUserFromState(snapshot));
    });
  }

  /**
   * Authenticate user with email and password.
   * The calling flow (AuthEffects.login$) dispatches loginSuccess to the
   * store on success; this method only returns the raw API observable.
   *
   * @param email User email
   * @param password User password (sent to backend for hashing)
   * @returns Observable<LoginResponse>
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginData = { email, password };
    return this.apiService.post<LoginResponse>(this.loginEndpoint, loginData);
  }

  /**
   * Register new user
   *
   * @param registerData Registration data
   * @returns Observable<RegisterResponse>
   */
  signup(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('User/register', registerData);
  }

  /**
   * Initiate registration with Stripe payment
   *
   * @param dto Registration data including plan selection
   * @returns InitiateRegResponse with clientSecret for Embedded Checkout
   */
  initiateRegistration(dto: InitiateRegRequest): Observable<InitiateRegResponse> {
    return this.apiService.post<InitiateRegResponse>('User/initiate-registration', dto);
  }

  /**
   * Complete registration after successful Stripe payment
   *
   * @param dto Contains sessionId from Stripe Checkout
   * @returns CompleteRegResponse with token and user data
   */
  completeRegistration(dto: CompleteRegRequest): Observable<CompleteRegResponse> {
    return this.apiService.post<CompleteRegResponse>('User/complete-registration', dto);
  }

  /**
   * Persist authenticated user state (token, role, permissions, user data).
   * Used by external flows (e.g. patient complete-registration) to keep auth
   * state consistent with the normal login flow.
   * Now delegates to the NgRx store, which is the single source of truth.
   */
  persistAuth(user: User, token: string, role: string, permissions: string[] = []): void {
    this.store.dispatch(
      loginSuccess({
        userId: user.id,
        userToken: token,
        userRole: role,
        accountId: user.accountId ?? null,
        clinicId: user.clinicId ?? null,
        name: user.name,
        email: user.email,
      }),
    );
  }

  /**
   * Get current user profile data from backend
   *
   * @returns Observable<any>
   */
  getCurrentUser(): Observable<any> {
    return this.apiService.get(this.currentUserEndpoint);
  }

  /**
   * Logout current user
   * Dispatches logout action to NgRx store, clears cached permissions,
   * and navigates to login. Does NOT rely on localStorage keys.
   */
  logout(): void {
    // Clear cached JWT claims and permissions
    this.permissionService.clearPermissions();

    // Dispatch logout action to store — the reducer resets state to
    // initialState, and ngrx-store-localstorage persists the reset.
    this.store.dispatch(logout());

    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   *
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!this.authSnapshot.userToken;
  }

  /**
   * Get stored JWT token
   *
   * @returns JWT token or null
   */
  getToken(): string | null {
    return this.authSnapshot.userToken || null;
  }

  /**
   * Get current user's role
   *
   * @returns User role (e.g., 'SuperAdmin', 'Doctor') or null
   */
  getRole(): string | null {
    return this.authSnapshot.roles?.[0] ?? this.authSnapshot.role ?? null;
  }

  /**
   * Get current user's permissions
   * Derived from the store's roles using the same map as PermissionService.
   * For minimal impact, derive a basic set from roles; callers should
   * prefer PermissionService for audit/consent permission checks.
   *
   * @returns Array of permission strings
   */
  getPermissions(): string[] {
    const roles = this.authSnapshot.roles || [];
    const permMap: Record<string, string[]> = {
      SUPER_ADMIN: [
        'Users.ViewAll', 'Users.ViewOwn', 'Users.Create', 'Users.Update', 'Users.Delete', 'Users.Manage',
        'Patients.ViewAll', 'Patients.ViewOwn', 'Patients.Create', 'Patients.Update', 'Patients.Delete',
        'Appointments.ViewAll', 'Appointments.ViewOwn', 'Appointments.Create', 'Appointments.Update', 'Appointments.Cancel',
        'MedicalRecords.ViewAll', 'MedicalRecords.ViewOwn', 'MedicalRecords.ViewAssigned', 'MedicalRecords.Create', 'MedicalRecords.Update',
        'Prescriptions.Create', 'Prescriptions.View', 'Prescriptions.Update',
        'Clinics.View', 'Clinics.Manage',
        'Roles.View', 'Roles.Assign', 'Roles.Revoke', 'Roles.ViewAudit',
        'Billing.View', 'Billing.Manage',
        'Reports.Generate', 'Reports.View',
        'Audit.View', 'Audit.Manage',
        'Consent.View', 'Consent.Approve', 'Consent.Revoke',
      ],
      ACCOUNT_ADMIN: [
        'Users.ViewAll', 'Users.ViewOwn', 'Users.Create', 'Users.Update', 'Users.Delete', 'Users.Manage',
        'Patients.ViewAll', 'Patients.ViewOwn', 'Patients.Create', 'Patients.Update', 'Patients.Delete',
        'Appointments.ViewAll', 'Appointments.ViewOwn', 'Appointments.Create', 'Appointments.Update', 'Appointments.Cancel',
        'MedicalRecords.ViewAll', 'MedicalRecords.ViewOwn', 'MedicalRecords.ViewAssigned', 'MedicalRecords.Create', 'MedicalRecords.Update',
        'Prescriptions.Create', 'Prescriptions.View', 'Prescriptions.Update',
        'Clinics.View', 'Clinics.Manage',
        'Roles.View', 'Roles.Assign', 'Roles.Revoke', 'Roles.ViewAudit',
        'Billing.View', 'Billing.Manage',
        'Reports.Generate', 'Reports.View',
        'Audit.View', 'Audit.Manage',
        'Consent.View', 'Consent.Approve', 'Consent.Revoke',
      ],
    };
    const perms: string[] = [];
    roles.forEach((role) => {
      const rolePerms = permMap[role] || [];
      perms.push(...rolePerms);
    });
    return [...new Set(perms)];
  }

  /**
   * Check if user has specific permission
   *
   * @param permission Permission to check (e.g., 'Users.Create')
   * @returns boolean
   */
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  /**
   * Check if user has all specified permissions
   *
   * @param permissions Permissions to verify
   * @returns boolean
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.every((p) => userPermissions.includes(p));
  }

  /**
   * Check if user has any of the specified permissions
   *
   * @param permissions Permissions to check
   * @returns boolean
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.some((p) => userPermissions.includes(p));
  }

  /**
   * Check if current user is SuperAdmin
   *
   * @returns boolean
   */
  isSuperAdmin(): boolean {
    const role = this.getRole();
    return role === UserRole.SUPER_ADMIN;
  }

  /**
   * Check if current user is AccountAdmin
   *
   * @returns boolean
   */
  isAccountAdmin(): boolean {
    const role = this.getRole();
    return role === UserRole.ACCOUNT_ADMIN;
  }

  /**
   * Check if current user is ClinicAdmin
   *
   * @returns boolean
   */
  isClinicAdmin(): boolean {
    const role = this.getRole();
    return role === UserRole.CLINIC_ADMIN;
  }

  /**
   * Check if current user has any admin role
   *
   * @returns boolean
   */
  isAdmin(): boolean {
    const role = this.getRole();
    return !!role && ADMIN_ROLES.includes(role as any);
  }

  /**
   * Check if current user is a clinical professional (HealthProfessional)
   *
   * @returns boolean
   */
  isHealthProfessional(): boolean {
    const role = this.getRole();
    return role === UserRole.HEALTH_PROFESSIONAL;
  }

  /**
   * Check if current user has clinical role (HealthProfessional)
   *
   * @returns boolean
   */
  isClinicalRole(): boolean {
    const role = this.getRole();
    return !!role && CLINICAL_ROLES.includes(role as any);
  }

  /**
   * Check if current user is Receptionist
   *
   * @returns boolean
   */
  isReceptionist(): boolean {
    const role = this.getRole();
    return role === UserRole.RECEPTIONIST;
  }

  /**
   * Check if current user is Patient
   *
   * @returns boolean
   */
  isPatient(): boolean {
    const role = this.getRole();
    return role === UserRole.PATIENT;
  }

  /**
   * Get current user's accountId (multi-tenancy)
   *
   * @returns Account ID or null
   */
  getAccountId(): number | null {
    return this.authSnapshot.accountId ?? null;
  }

  /**
   * Get current user's clinicId (clinic-specific scope)
   *
   * @returns Clinic ID or null
   */
  getClinicId(): number | null {
    return this.authSnapshot.clinicId ?? null;
  }

  /**
   * Get current auth context (for debugging/logging)
   *
   * @returns AuthContext
   */
  getAuthContext(): AuthContext {
    const state = this.authSnapshot;
    return {
      user: this.buildUserFromState(state),
      isAuthenticated: !!state.userToken,
      token: state.userToken || null,
      role: state.roles?.[0] ?? state.role ?? null,
      permissions: this.getPermissions(),
      isLoading: state.loading,
      error: state.error,
    };
  }

  /**
   * Private: build a User model from the NgRx auth state.
   *
   * @param state AuthState snapshot
   * @returns User or null when not authenticated
   */
  private buildUserFromState(state: AuthState): User | null {
    if (!state.userId) return null;
    return {
      id: state.userId,
      name: state.name || '',
      email: state.email || '',
      role: state.roles?.[0] ?? state.role ?? '',
      accountId: state.accountId ?? undefined,
      clinicId: state.clinicId ?? undefined,
    };
  }
}