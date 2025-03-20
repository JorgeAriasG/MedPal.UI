import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../store/reducers/auth.reducer';
import { selectIsLoggedIn } from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsLoggedIn).pipe(
      map(isLoggedIn => {
        console.log('AuthGuard#canActivate - isLoggedIn:', isLoggedIn);
        if (!isLoggedIn) {
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
