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
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(userToken).pipe(
      take(1), // Only check once
      map(token => {
        console.log('AuthGuard#canActivate - hasToken:', !!token);
        if (!token) {
          console.log('No token found, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
