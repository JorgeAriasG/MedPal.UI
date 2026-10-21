/**
 * Consent Access Guard
 * Route guard for accessing patient consent management features
 *
 * Checks user permissions for viewing and managing patient consents
 * Allows patients to access their own consents via patientId and userType
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserType } from '../store/selectors/auth.selectors';
import { PermissionService } from '../services/permission.service';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

/**
 * Consent Access Guard
 * Protects consent management routes requiring VIEW_CONSENT permission
 * Also allows patients to access their own consents
 */
@Injectable({
  providedIn: 'root',
})
export class ConsentAccessGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private store: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Check basic permission to view consent
    const hasViewPermission = this.permissionService.canViewConsent();

    // Additionally, allow patients to view their own consents
    // via userType === "patient" and patientId available
    const isOwnPatientConsent = this.store.select(selectUserType).pipe(
      take(1),
      map((userType) => {
        const isPatient = userType === 'patient';
        return isPatient;
      }),
      catchError(() => of(false)),
    );

    // Combine: allow if has explicit permission OR is patient accessing own consents
    return isOwnPatientConsent.pipe(
      map((isPatient) => {
        if (hasViewPermission || isPatient) {
          return true;
        }

        console.warn('User does not have permission to view consent');
        this.router.navigate(['/unauthorized'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
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