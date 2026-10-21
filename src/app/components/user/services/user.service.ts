import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../entities/IUser';
import { IRole } from '../../../entities/IRole';
import { ApiService } from '../../../services/api.service';

/**
 * User Service
 *
 * Manages user-related operations including CRUD, authentication,
 * roles, and permissions.
 *
 * Key Features:
 * - User registration and management
 * - Role assignment and retrieval
 * - User profile access (me endpoint)
 * - User listing and filtering
 *
 * @injectable
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'user';

  constructor(private apiService: ApiService) {}

  /**
   * Register a new user (public registration)
   *
   * @param user User registration data
   * @returns Observable of registration response
   */
  register(user: IUser): Observable<any> {
    const registerData = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      specialty: user.specialty,
      professionalLicenseNumber: user.professionalLicenseNumber,
      acceptPrivacyTerms: user.acceptPrivacyTerms,
    };
    return this.apiService.post(`${this.endpoint}/register`, registerData);
  }

  /**
   * Add a new user (admin operation)
   *
   * @param user User data
   * @returns Observable of created user
   */
  addUser(user: IUser): Observable<IUser> {
    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      specialty: user.specialty,
      professionalLicenseNumber: user.professionalLicenseNumber,
      acceptPrivacyTerms: user.acceptPrivacyTerms,
      ...(user.roleId && { roleId: user.roleId }),
      ...(user.clinicId && { clinicId: user.clinicId }),
    };
    return this.apiService.post<IUser>(this.endpoint, userData);
  }

  /**
   * Get current authenticated user profile
   * Uses the /me endpoint
   *
   * @returns Observable of current user
   */
  getMe(): Observable<IUser> {
    return this.apiService.get<IUser>(`${this.endpoint}/me`);
  }

  /**
   * Get all users (account-level)
   *
   * @returns Observable of users array
   */
  getUsers(): Observable<IUser[]> {
    const url = `${this.endpoint}/account`;
    return this.apiService.get<IUser[]>(url);
  }

  /**
   * Get user by ID
   *
   * @param id User ID
   * @returns Observable of user
   */
  getUserById(id: number): Observable<IUser> {
    return this.apiService.get<IUser>(`${this.endpoint}/${id}`);
  }

  /**
   * Get users by role
   *
   * @param role Role identifier/name
   * @returns Observable of users with given role
   */
  getByRole(role: string): Observable<IUser[]> {
    return this.apiService.get<IUser[]>(`${this.endpoint}?role=${role}`);
  }

  /**
   * Delete a user
   *
   * @param id User ID
   * @returns Observable of delete response
   */
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Update user information
   *
   * @param user Partial user data to update
   * @returns Observable of updated user
   */
  editUser(user: Partial<IUser>): Observable<IUser> {
    return this.apiService.put<IUser>(this.endpoint, user);
  }

  /**
   * Update user by ID
   *
   * @param id User ID
   * @param user Partial user data
   * @returns Observable of updated user
   */
  updateUser(id: number, user: Partial<IUser>): Observable<IUser> {
    return this.apiService.put<IUser>(`${this.endpoint}/${id}`, user);
  }

  /**
   * Assign a role to a user
   *
   * @param userId User ID
   * @param roleId Role ID
   * @returns Observable of updated user
   */
  assignRole(userId: number, roleId: number): Observable<IUser> {
    return this.apiService.put<IUser>(
      `${this.endpoint}/${userId}/role`,
      { roleId }
    );
  }

  /**
   * Get a specific role by ID
   *
   * @param roleId Role ID
   * @returns Observable of role
   */
  getRoleById(roleId: number): Observable<IRole> {
    return this.apiService.get<IRole>(`role/${roleId}`);
  }

  /**
   * Get all roles
   *
   * @returns Observable of roles array
   */
  getRoles(): Observable<IRole[]> {
    return this.apiService.get<IRole[]>('role');
  }
}
