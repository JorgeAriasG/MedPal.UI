import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubscriptionService } from '../services/subscription.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.subscriptionService.getStatus().pipe(
      map((status) => {
        if (status.hasAccess) {
          return true;
        }
        this.router.navigate(['/checkout/required']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/checkout/required']);
        return of(false);
      })
    );
  }
}
