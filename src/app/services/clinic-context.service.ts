import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { selectClinicId } from '../store/selectors/auth.selectors';
import { AuthService } from './auth.service';
import { ClinicService } from '../components/clinics/services/clinic.service';

/**
 * ClinicContextService
 *
 * Manages intelligent clinic selection based on user role and multi-tenancy rules.
 * Encapsulates business logic for determining which clinic context a user should work in.
 *
 * Rules:
 * - SuperAdmin: No clinic required, returns null
 * - AccountAdmin: No clinic required initially, returns null (can select clinics they create)
 * - Clinical roles (Doctor, HealthProfessional, Receptionist): Must have a clinic
 * - Patient: May have clinic context
 * - ClinicAdmin: Must have a clinic
 */
@Injectable({
  providedIn: 'root',
})
export class ClinicContextService {
  // Roles that are clinic-based and require a clinic context
  private readonly CLINIC_REQUIRING_ROLES = [
    'Doctor',
    'HealthProfessional',
    'Receptionist',
    'Patient',
    'ClinicAdmin',
  ];

  // Roles that don't require clinic context
  private readonly CLINIC_EXEMPT_ROLES = ['SuperAdmin', 'AccountAdmin'];

  constructor(
    private store: Store,
    private authService: AuthService,
    private clinicService: ClinicService
  ) {}

  /**
   * Get the appropriate clinic context for the current user
   *
   * Returns Observable<number | null> where:
   * - number: Clinic ID for users who need/have clinic context
   * - null: For admin users (SuperAdmin, AccountAdmin) or when no clinic is available
   */
  getClinicContext(): Observable<number | null> {
    return this.store.select(selectClinicId).pipe(
      switchMap((clinicId) => {
        // If clinic is already set, use it
        if (clinicId && clinicId !== 0) {
          return of(clinicId);
        }

        // Check user role to determine if clinic is needed
        const userRole = this.authService.getRole() || '';

        // Admin roles don't require clinic context
        if (this.CLINIC_EXEMPT_ROLES.includes(userRole)) {
          return of(null);
        }

        // Clinical roles need a clinic - try to get the first available
        if (this.CLINIC_REQUIRING_ROLES.includes(userRole)) {
          return this.clinicService.getClinics().pipe(
            map((clinics) => {
              if (clinics && clinics.length > 0) {
                return clinics[0].id || null;
              }
              // No clinics available for this user
              return null;
            }),
            catchError((error) => {
              console.warn(
                `Could not fetch clinics for role ${userRole}:`,
                error
              );
              // Gracefully handle permission/availability errors
              return of(null);
            })
          );
        }

        // Unknown role or uncategorized
        return of(null);
      })
    );
  }

  /**
   * Check if current user requires a clinic context
   *
   * Useful for conditional routing or UI visibility
   */
  isClinicRequired(): boolean {
    const userRole = this.authService.getRole() || '';
    return this.CLINIC_REQUIRING_ROLES.includes(userRole);
  }

  /**
   * Check if current user is exempt from clinic requirements
   */
  isClinicExempt(): boolean {
    const userRole = this.authService.getRole() || '';
    return this.CLINIC_EXEMPT_ROLES.includes(userRole);
  }

  /**
   * Get the current role's clinic requirement status
   */
  getClinicRequirementStatus(): {
    required: boolean;
    exempt: boolean;
    role: string;
  } {
    const userRole = this.authService.getRole() || '';
    return {
      required: this.CLINIC_REQUIRING_ROLES.includes(userRole),
      exempt: this.CLINIC_EXEMPT_ROLES.includes(userRole),
      role: userRole,
    };
  }
}
