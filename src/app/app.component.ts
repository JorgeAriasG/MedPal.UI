import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { rehydrateAuthState } from './store/actions/auth.actions';
import { AuthState } from './store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from './store/selectors/auth.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'scheduling.ui';
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store<{ auth: AuthState }>) {
    const userId = parseInt(sessionStorage.getItem('userId') || '0');
    const userToken = sessionStorage.getItem('userToken');
    const clinicId = parseInt(sessionStorage.getItem('clinicId') || '0');
    this.store.dispatch(rehydrateAuthState({ userId: userId ? userId : null, userToken: userToken ? userToken : null, clinicId: clinicId ? clinicId : null }));
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {}
}
