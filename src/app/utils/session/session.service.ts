import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private store: Store<{auth: AuthState}>) { }

  getStoreUserId<T>(callback: (userId: string) => Observable<T>): Observable<T> {
    return this.store.select(selectUserId).pipe(
      switchMap(userId => {
        if (userId) {
          return callback(userId);
        } else {
          throw new Error('User ID not found');
        }
      })
    );
  }

}
