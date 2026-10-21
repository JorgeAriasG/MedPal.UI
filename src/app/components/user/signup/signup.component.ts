import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { selectAuthError, selectIsLoading } from '../../../store/selectors/auth.selectors';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ISubscriptionPlan } from 'src/app/entities/ISubscription';
import { StripeCheckoutModalComponent } from '../../checkout/stripe-checkout-modal/stripe-checkout-modal.component';

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
  currentStep = 0;
  showPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthPercent = 0;
  passwordStrengthText = '';
  plans: ISubscriptionPlan[] = [];
  selectedPlan: ISubscriptionPlan | null = null;
  registrationError: string | null = null;

  private destroy$ = new Subject<void>();

  steps = [
    { key: 'personal', icon: 'person', label: 'AUTH.SIGNUP.STEP_PERSONAL' },
    { key: 'professional', icon: 'badge', label: 'AUTH.SIGNUP.STEP_PROFESSIONAL' },
    { key: 'account', icon: 'lock', label: 'AUTH.SIGNUP.STEP_ACCOUNT' },
    { key: 'plan', icon: 'workspace_premium', label: 'AUTH.SIGNUP.STEP_PLAN' },
    { key: 'confirm', icon: 'how_to_reg', label: 'AUTH.SIGNUP.STEP_CONFIRM' },
  ];

  specialties: { value: string; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
    this.form = this.createForm();
    this.error$ = this.store.select(selectAuthError);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit(): void {
    this.specialties = [
      { value: 'General', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_GENERAL') },
      { value: 'Dentistry', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_DENTISTRY') },
      { value: 'Nutrition', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_NUTRITION') },
      { value: 'Cardiology', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_CARDIOLOGY') },
      { value: 'Pediatrics', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_PEDIATRICS') },
      { value: 'Dermatology', label: this.translate.instant('AUTH.SIGNUP.SPECIALTY_DERMATOLOGY') },
    ];

    this.loadPlans();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlans(): void {
    this.subscriptionService.getPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plans) => {
          this.plans = plans;
          if (plans.length > 0) {
            this.selectedPlan = plans[0];
          }
        },
        error: () => {
          console.error('Failed to load plans');
        },
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+\d\s\-()]*$/)]],
      licenseNumber: ['', Validators.required],
      specialty: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      acceptDataProcessing: [false, Validators.requiredTrue],
      acceptMarketing: [false],
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
      this.passwordStrengthText = this.translate.instant('AUTH.SIGNUP.PASSWORD_STRENGTH_WEAK');
    } else if (strength <= 2) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = 66;
      this.passwordStrengthText = this.translate.instant('AUTH.SIGNUP.PASSWORD_STRENGTH_MEDIUM');
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = 100;
      this.passwordStrengthText = this.translate.instant('AUTH.SIGNUP.PASSWORD_STRENGTH_STRONG');
    }
  }

  selectPlan(plan: ISubscriptionPlan): void {
    this.selectedPlan = plan;
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0: return this.form.get('firstName')!.valid && this.form.get('lastName')!.valid && this.form.get('email')!.valid;
      case 1: return this.form.get('licenseNumber')!.valid && this.form.get('specialty')!.valid;
      case 2: return this.form.get('password')!.valid && this.form.get('confirmPassword')!.valid && !this.form.hasError('passwordMismatch');
      case 3: return this.selectedPlan !== null;
      case 4: return this.form.get('acceptTerms')!.valid && this.form.get('acceptDataProcessing')!.valid;
      default: return false;
    }
  }

  next(): void {
    if (!this.isStepValid(this.currentStep)) return;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  back(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  canGoNext(): boolean {
    return this.isStepValid(this.currentStep) && this.currentStep < this.steps.length - 1;
  }

  canGoBack(): boolean {
    return this.currentStep > 0;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.registrationError = null;

    const { firstName, lastName, email, password, confirmPassword, licenseNumber, specialty, acceptTerms } = this.form.value;

    const initiatePayload = {
      name: `${firstName} ${lastName}`,
      email,
      password,
      confirmPassword,
      professionalLicenseNumber: licenseNumber,
      specialty: specialty || null,
      acceptPrivacyTerms: acceptTerms,
      planName: this.selectedPlan?.name || 'SOLO',
    };

    this.authService.initiateRegistration(initiatePayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const dialogRef = this.dialog.open(StripeCheckoutModalComponent, {
            data: {
              clientSecret: res.clientSecret,
              publishableKey: res.publishableKey,
              sessionId: res.sessionId,
            },
            disableClose: true,
            width: '640px',
            maxWidth: '95vw',
          });

          const sessionId = res.sessionId;
          dialogRef.afterClosed().subscribe((completed: boolean | undefined) => {
            if (completed) {
              this.router.navigate(['/bienvenido'], { queryParams: { session_id: sessionId } });
            } else {
              this.registrationError = 'El proceso de pago fue cancelado o no se completó.';
            }
          });
        },
        error: (err: any) => {
          this.registrationError = err.error?.message
            ?? err.message
            ?? 'Error al iniciar el proceso de registro. Intenta de nuevo.';
        },
      });
  }
}
