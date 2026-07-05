import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { loginSuccess } from '../../../store/actions/auth.actions';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { CompleteRegResponse } from '../../../entities/auth.models';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: false,
})
export class WelcomeComponent implements OnInit, OnDestroy {
  state: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<{ auth: AuthState }>,
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.state = 'error';
      this.errorMessage = 'No se encontró la sesión de pago';
      return;
    }

    this.authService.completeRegistration({ sessionId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: CompleteRegResponse) => {
          this.store.dispatch(loginSuccess({
            userId: response.id,
            userToken: response.token,
            userRole: response.role,
            clinicId: response.clinicId,
          }));
          this.state = 'success';
        },
        error: (err: any) => {
          this.state = 'error';
          this.errorMessage = err.error?.message
            ?? err.message
            ?? 'Error al crear tu cuenta. Contacta a soporte.';
        },
      });
  }

  goToDashboard(): void {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
