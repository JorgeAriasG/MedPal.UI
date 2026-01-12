import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { selectAuthError, selectIsLoading } from '../../../store/selectors/auth.selectors';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  showPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthPercent = 0;
  passwordStrengthText = '';
  private destroy$ = new Subject<void>();

  specialties = [
    { value: 'General', label: 'General Practice' },
    { value: 'Dentistry', label: 'Dentistry' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Dermatology', label: 'Dermatology' },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.createForm();
    this.error$ = this.store.select(selectAuthError);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit(): void {
    // Initialization if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Personal
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+\d\s\-()]*$/)]],

      // Professional
      licenseNumber: ['', Validators.required],
      specialty: ['', Validators.required],

      // Account
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      // Agreements
      acceptTerms: [false, Validators.required],
      acceptDataProcessing: [false, Validators.required],
      acceptMarketing: [false]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  updatePasswordStrength(): void {
    const password = this.form.get('password')?.value || '';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 1) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = 33;
      this.passwordStrengthText = 'Weak';
    } else if (strength <= 2) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = 66;
      this.passwordStrengthText = 'Medium';
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = 100;
      this.passwordStrengthText = 'Strong';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { firstName, lastName, email, password, confirmPassword, licenseNumber, specialty, acceptTerms } = this.form.value;

    // Construir payload exacto que el backend espera
    const signupPayload = {
      name: `${firstName} ${lastName}`, // Backend espera Name, no firstName/lastName
      email,
      password,
      confirmPassword,
      professionalLicenseNumber: licenseNumber,
      specialty: specialty || null,
      acceptPrivacyTerms: acceptTerms
    };

    // Llamar auth service para signup
    this.authService.signup(signupPayload).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        // Navegar a home o dashboard
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.error('Signup error:', error);
      }
    });
  }
}
