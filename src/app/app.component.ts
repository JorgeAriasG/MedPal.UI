import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from './store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from './store/selectors/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'scheduling.ui';
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store<{ auth: AuthState }>) {
    // El meta-reducer rehidrata automáticamente el state desde sessionStorage
    // Ya no necesitamos hacer esto manualmente
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {}
}
