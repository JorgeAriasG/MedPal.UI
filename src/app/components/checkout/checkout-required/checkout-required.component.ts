import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-checkout-required',
  templateUrl: './checkout-required.component.html',
  styleUrls: ['./checkout-required.component.css'],
  standalone: false,
})
export class CheckoutRequiredComponent implements OnInit, OnDestroy {
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToCheckout(): void {
    this.loading = true;
    this.error = null;
    this.subscriptionService.createCheckoutSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo iniciar el proceso de pago. Intenta de nuevo.';
        },
      });
  }
}
