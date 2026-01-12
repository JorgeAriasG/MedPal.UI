/**
 * Audit Access Guard
 * Route guard for accessing audit log features
 *
 * Checks user permissions and clinic access before allowing navigation
 * to audit-related routes
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { TenantContextService } from '../services/tenant-context.service';

/**
 * Audit Access Guard
 * Protects audit log routes requiring VIEW_AUDIT_LOGS permission
 */
@Injectable({
  providedIn: 'root',
})
export class AuditAccessGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private tenantContextService: TenantContextService,
    private router: Router
  ) {}

  /**
   * Check if user can access audit logs
   *
   * @param route Activated route snapshot
   * @param state Router state snapshot
   * @returns true if user can access, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check basic permission
    if (!this.permissionService.canViewAuditLogs()) {
      console.warn('User does not have permission to view audit logs');
      this.router.navigate(['/unauthorized'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // Check clinic-specific access if clinicId is in route params
    const clinicId = route.params['clinicId'];
    if (clinicId) {
      const clinicIdNum = parseInt(clinicId, 10);
      if (!this.tenantContextService.hasClinicAccess(clinicIdNum)) {
        console.warn(
          `User does not have access to clinic ${clinicId}`
        );
        this.router.navigate(['/unauthorized'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }

    return true;
  }
}
