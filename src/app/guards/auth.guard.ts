import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducer';
import { userToken } from '../store/selectors/auth.selectors';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router,
    private permissionService: PermissionService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(userToken).pipe(
      take(1),
      map(token => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }
        if (this.permissionService.isTokenExpired()) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
