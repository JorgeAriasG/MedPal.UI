/**
 * Consent Access Guard
 * Route guard for accessing patient consent management features
 *
 * Checks user permissions for viewing and managing patient consents
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionService } from '../services/permission.service';

/**
 * Consent Access Guard
 * Protects consent management routes requiring VIEW_CONSENT permission
 */
@Injectable({
  providedIn: 'root',
})
export class ConsentAccessGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  /**
   * Check if user can access consent management
   *
   * @param route Activated route snapshot
   * @param state Router state snapshot
   * @returns true if user can access, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check basic permission to view consent
    if (!this.permissionService.canViewConsent()) {
      console.warn('User does not have permission to view consent');
      this.router.navigate(['/unauthorized'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    return true;
  }
}
