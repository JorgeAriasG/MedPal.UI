import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectUserId, userToken, selectClinicId } from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private store: Store<{auth: AuthState}>) { }

  getStoreUserId(): Observable<number | null> {
    return this.store.select(selectUserId);
  }

  // TODO: Clinic is returning as 0
  getClinicId(): Observable<number | null> {
    return this.store.select(selectClinicId);
  }

  getUserToken(): Observable<string | null> {
    return this.store.select(userToken);
  }

}
