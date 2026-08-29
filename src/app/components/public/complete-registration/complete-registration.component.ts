import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'src/app/services/booking.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
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
      this.snackBar.open('Token inválido', 'Cerrar', { duration: 5000 });
    }
  }

  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
        localStorage.setItem('auth_token', result.token);
        this.snackBar.open('Registro completado exitosamente', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Error al completar registro', 'Cerrar', { duration: 5000 });
      },
    });
  }
}
