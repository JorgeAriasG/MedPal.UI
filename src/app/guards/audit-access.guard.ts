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
import { Store } from '@ngrx/store';
import { selectUserRoles, selectAccountId } from '../store/selectors/auth.selectors';
import { PermissionService } from '../services/permission.service';
import { TenantContextService } from '../services/tenant-context.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

/**
 * Audit Access Guard
 * Protects audit log routes requiring VIEW_AUDIT_LOGS permission
 */
@Injectable({
  providedIn: 'root',
})
export class AuditAccessGuard implements CanActivate {
  constructor(
    private store: Store,
    private permissionService: PermissionService,
    private tenantContextService: TenantContextService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Check basic permission using store selectors
    return this.store.select(selectUserRoles).pipe(
      take(1),
      map((roles) => {
        if (!roles || roles.length === 0) {
          console.warn('User does not have permission to view audit logs');
          this.router.navigate(['/unauthorized'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        // Check VIEW_AUDIT_LOGS permission
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