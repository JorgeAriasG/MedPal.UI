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
import { Store } from '@ngrx/store';
import { selectUserRoles } from '../store/selectors/auth.selectors';
import { PermissionService, Permission } from '../services/permission.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

/**
 * Audit Admin Guard
 * Protects admin-level audit routes requiring MANAGE_AUDIT_LOGS permission
 */
@Injectable({
  providedIn: 'root',
})
export class AuditAdminGuard implements CanActivate {
  constructor(
    private store: Store,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Check for admin-level audit permissions using store selectors
    return this.store.select(selectUserRoles).pipe(
      take(1),
      map((roles) => {
        if (!roles || roles.length === 0) {
          console.warn('User does not have admin permission for audit operations');
          this.router.navigate(['/unauthorized'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

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
      }),
      catchError(() => {
        this.router.navigate(['/unauthorized'], {
          queryParams: { returnUrl: state.url },
        });
        return of(false);
      }),
    );
  }
}