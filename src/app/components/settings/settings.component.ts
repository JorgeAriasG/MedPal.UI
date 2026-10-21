import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ISubscription } from 'src/app/entities/ISubscription';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  subscription: ISubscription | null = null;
  loading = false;
  error: string | null = null;
  billingLoading = false;
  billingError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSubscription(): void {
    this.loading = true;
    this.error = null;
    this.subscriptionService.getCurrent()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sub) => {
          this.subscription = sub;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo cargar la información de suscripción';
        },
      });
  }

  getUsagePercent(current: number, max: number): number {
    if (max === 0) return 0;
    return Math.round((current / max) * 100);
  }

  getPlanBadgeClass(planName: string): string {
    switch (planName) {
      case 'SOLO': return 'badge-solo';
      case 'CONSULTORIO': return 'badge-consultorio';
      case 'CLINICA': return 'badge-clinica';
      default: return '';
    }
  }

  isPendingPayment(): boolean {
    return this.subscription?.status === 'pending_payment';
  }

  openPortal(): void {
    this.billingLoading = true;
    this.billingError = null;
    this.subscriptionService.createPortalSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: () => {
          this.billingLoading = false;
          this.billingError = 'No se pudo abrir el portal de facturación. Intenta de nuevo.';
        },
      });
  }

  completePayment(): void {
    this.billingLoading = true;
    this.billingError = null;
    this.subscriptionService.createCheckoutSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: () => {
          this.billingLoading = false;
          this.billingError = 'No se pudo iniciar el pago. Intenta de nuevo.';
        },
      });
  }
}
