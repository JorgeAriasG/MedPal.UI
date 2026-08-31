import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { loginSuccess } from 'src/app/store/actions/auth.actions';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.css'],
  standalone: false,
})
export class CompleteRegistrationComponent implements OnInit {
  token: string = '';
  registrationForm: FormGroup;
  loading = false;
  success = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private store: Store,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name: [''],
      lastname: [''],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.snackBar.open(this.translate.instant('COMPLETE_REGISTRATION.SNACKBAR_INVALID_TOKEN'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
    }
  }

  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  private decodeClinicId(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.clinicId ?? payload?.clinic_id ?? null;
    } catch {
      return null;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid || !this.token) {
      return;
    }

    this.loading = true;
    const { email, password, name, lastname } = this.registrationForm.value;

    this.bookingService.completeRegistration({
      token: this.token,
      email,
      password,
      name,
      lastname,
    }).subscribe({
      next: (result) => {
        this.loading = false;
        this.success = true;
        const clinicId = this.decodeClinicId(result.token);
        this.authService.persistAuth({
          id: result.id,
          name: result.name,
          email: result.email,
          role: 'Patient',
          clinicId: clinicId ?? undefined,
        }, result.token, 'Patient');
        this.store.dispatch(loginSuccess({
          userId: result.id,
          userToken: result.token,
          clinicId,
          userRole: 'Patient',
        }));
        this.snackBar.open(this.translate.instant('COMPLETE_REGISTRATION.SNACKBAR_SUCCESS'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || this.translate.instant('COMPLETE_REGISTRATION.SNACKBAR_ERROR'), this.translate.instant('COMMON.CLOSE'), { duration: 5000 });
      },
    });
  }
}
