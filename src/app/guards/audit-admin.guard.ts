/**
 * Audit Admin Guard
 * Route guard for admin-level audit operations
 *
 * Checks for admin-level permissions required for audit report generation
 * and audit log export
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionService, Permission } from '../services/permission.service';

/**
 * Audit Admin Guard
 * Protects admin-level audit routes requiring MANAGE_AUDIT_LOGS permission
 */
@Injectable({
  providedIn: 'root',
})
export class AuditAdminGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  /**
   * Check if user can perform admin-level audit operations
   *
   * @param route Activated route snapshot
   * @param state Router state snapshot
   * @returns true if user can access, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check for admin-level audit permissions
    const hasAdminAccess = this.permissionService.hasAnyPermission([
      Permission.MANAGE_AUDIT_LOGS,
      Permission.GENERATE_AUDIT_REPORTS,
      Permission.EXPORT_AUDIT_LOGS,
    ]);

    if (!hasAdminAccess) {
      console.warn(
        'User does not have admin permission for audit operations'
      );
      this.router.navigate(['/unauthorized'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    return true;
  }
}
