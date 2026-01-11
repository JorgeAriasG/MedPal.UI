import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../store/actions/auth.actions';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { Observable, Subject } from 'rxjs';
import { selectAuthError, selectIsLoggedIn, selectIsLoading } from '../../../store/selectors/auth.selectors';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.error$ = this.store.select(selectAuthError);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit(): void {
    // No navigation needed here - effects handle it
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;
    this.store.dispatch(login({ email, password }));
  }
}
