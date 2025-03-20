import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../store/actions/auth.actions';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { selectAuthError, selectIsLoggedIn } from '../../../store/selectors/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage$: Observable<string | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {
    this.errorMessage$ = this.store.select(selectAuthError);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;
      this.store.dispatch(login({ email, password }));

      // Listen for login success or failure
      this.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          console.log('Login successful');
          this.router.navigate(['/']);
          // Additional logic if needed
        }
      });

      this.errorMessage$.subscribe(error => {
        if (error) {
          console.error('Login failed:', error);
          // Additional logic if needed
        }
      });
    }
  }
}
