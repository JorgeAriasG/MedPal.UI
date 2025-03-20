import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
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

  getStoreUserId(): Observable<string | null> {
    return this.store.select(selectUserId);
  }

  // TODO: Clinic is returning as 0
  getClinicId(): Observable<string | null> {
    return this.store.select(selectClinicId);
  }

}
