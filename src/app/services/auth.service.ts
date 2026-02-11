import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logout } from '../store/actions/auth.actions';
import { ApiService } from './api.service';
import {
  LoginResponse,
  RegisterRequest,
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
 * Stores auth state in localStorage and provides reactive updates.
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

  // Storage keys
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly PERMISSIONS_KEY = 'user_permissions';
  private readonly USER_KEY = 'user_data';

  // Observable auth state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private store: Store,
    private apiService: ApiService
  ) {}

  /**
   * Authenticate user with email and password
   * Stores token, role, and permissions in localStorage
   *
   * @param email User email
   * @param password User password (sent to backend for hashing)
   * @returns Observable<LoginResponse>
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginData = { email, password };
    return this.apiService.post<LoginResponse>(this.loginEndpoint, loginData).pipe(
      tap((response: LoginResponse) => {
        // Store token
        localStorage.setItem(this.TOKEN_KEY, response.token);

        // Store role
        localStorage.setItem(this.ROLE_KEY, response.role);

        // Store permissions as JSON array
        const permissions = response.permissions || [];
        localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));

        // Store user data
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          accountId: response.accountId,
          clinicId: response.clinicId,
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        // Update observable
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Register new user
   *
   * @param registerData Registration data
   * @returns Observable<LoginResponse>
   */
  signup(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.apiService
      .post<LoginResponse>('User/register', registerData)
      .pipe(
        tap((response: LoginResponse) => {
          // Automatically log in after successful registration
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROLE_KEY, response.role);
          const permissions = response.permissions || [];
          localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));

          const user: User = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
            accountId: response.accountId,
            clinicId: response.clinicId,
          };
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  /**
   * Get current user profile data from backend
   *
   * @returns Observable<User>
   */
  getCurrentUser(): Observable<any> {
    return this.apiService.get(this.currentUserEndpoint);
  }

  /**
   * Logout current user
   * Clears all stored auth data and navigates to login
   */
  logout(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Update observable
    this.currentUserSubject.next(null);

    // Dispatch logout action to store
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
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored JWT token
   *
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user's role
   *
   * @returns User role (e.g., 'SuperAdmin', 'Doctor')
   */
  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  /**
   * Get current user's permissions
   *
   * @returns Array of permission strings
   */
  getPermissions(): string[] {
    const perms = localStorage.getItem(this.PERMISSIONS_KEY);
    return perms ? JSON.parse(perms) : [];
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
    return this.getRole() === UserRole.SUPER_ADMIN;
  }

  /**
   * Check if current user is AccountAdmin
   *
   * @returns boolean
   */
  isAccountAdmin(): boolean {
    return this.getRole() === UserRole.ACCOUNT_ADMIN;
  }

  /**
   * Check if current user is ClinicAdmin
   *
   * @returns boolean
   */
  isClinicAdmin(): boolean {
    return this.getRole() === UserRole.CLINIC_ADMIN;
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
   * Check if current user is Doctor
   *
   * @returns boolean
   */
  isDoctor(): boolean {
    return this.getRole() === UserRole.DOCTOR;
  }

  /**
   * Check if current user is HealthProfessional
   *
   * @returns boolean
   */
  isHealthProfessional(): boolean {
    return this.getRole() === UserRole.HEALTH_PROFESSIONAL;
  }

  /**
   * Check if current user has clinical role (Doctor or HealthProfessional)
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
    return this.getRole() === UserRole.RECEPTIONIST;
  }

  /**
   * Check if current user is Patient
   *
   * @returns boolean
   */
  isPatient(): boolean {
    return this.getRole() === UserRole.PATIENT;
  }

  /**
   * Get current user's accountId (multi-tenancy)
   *
   * @returns Account ID or null
   */
  getAccountId(): number | null {
    const user = this.getUserFromStorage();
    return user?.accountId ?? null;
  }

  /**
   * Get current user's clinicId (clinic-specific scope)
   *
   * @returns Clinic ID or null
   */
  getClinicId(): number | null {
    const user = this.getUserFromStorage();
    return user?.clinicId ?? null;
  }

  /**
   * Get current auth context (for debugging/logging)
   *
   * @returns AuthContext
   */
  getAuthContext(): AuthContext {
    const user = this.getUserFromStorage();
    return {
      user,
      isAuthenticated: !!user,
      token: this.getToken(),
      role: this.getRole(),
      permissions: this.getPermissions(),
      isLoading: false,
      error: null,
    };
  }

  /**
   * Retrieve user data from localStorage
   * Private helper method
   *
   * @returns User or null
   */
  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
