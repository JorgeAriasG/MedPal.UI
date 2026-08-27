import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducer';
import { userToken } from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(userToken).pipe(
      take(1),
      map(token => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }
        if (this.isTokenExpired(token)) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      const exp = payload?.exp;
      return !exp || exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}
