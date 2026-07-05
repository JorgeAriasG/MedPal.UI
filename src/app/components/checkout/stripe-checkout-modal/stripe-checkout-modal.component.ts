import { Component, Inject, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-checkout-modal',
  templateUrl: './stripe-checkout-modal.component.html',
  styleUrls: ['./stripe-checkout-modal.component.css'],
  standalone: false,
})
export class StripeCheckoutModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('checkoutContainer', { static: true }) checkoutContainer!: ElementRef<HTMLDivElement>;
  @Output() completed = new EventEmitter<void>();

  loading = true;
  error: string | null = null;
  private stripe: Stripe | null = null;
  private checkoutInstance: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { clientSecret: string; publishableKey: string; sessionId: string },
    public dialogRef: MatDialogRef<StripeCheckoutModalComponent>,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.data.publishableKey);
      if (!this.stripe) {
        this.error = 'Error al cargar Stripe';
        this.loading = false;
        return;
      }

      this.checkoutInstance = await this.stripe.createEmbeddedCheckoutPage({
        clientSecret: this.data.clientSecret,
        onComplete: () => {
          this.completed.emit();
          setTimeout(() => this.dialogRef.close(true), 2000);
        },
      });

      this.checkoutInstance.mount(this.checkoutContainer.nativeElement);
      this.loading = false;
    } catch (err) {
      this.error = 'Error al iniciar el proceso de pago';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.checkoutInstance) {
      this.checkoutInstance.destroy();
    }
  }
}
