import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  ISubscription,
  ISubscriptionPlan,
  ISubscriptionStatus,
  ICheckoutSessionResponse,
  IPortalSessionResponse,
} from '../entities/ISubscription';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private endpoint = 'Subscription';

  constructor(private apiService: ApiService) {}

  getPlans(): Observable<ISubscriptionPlan[]> {
    return this.apiService.get<ISubscriptionPlan[]>(`${this.endpoint}/plans`);
  }

  getCurrent(): Observable<ISubscription> {
    return this.apiService.get<ISubscription>(`${this.endpoint}/current`);
  }

  getStatus(): Observable<ISubscriptionStatus> {
    return this.apiService.get<ISubscriptionStatus>(`${this.endpoint}/status`);
  }

  createCheckoutSession(): Observable<ICheckoutSessionResponse> {
    return this.apiService.post<ICheckoutSessionResponse>(`${this.endpoint}/create-checkout`, {});
  }

  createPortalSession(): Observable<IPortalSessionResponse> {
    return this.apiService.post<IPortalSessionResponse>(`${this.endpoint}/create-portal`, {});
  }

  canAddUser(): Observable<{ canAdd: boolean }> {
    return this.apiService.get<{ canAdd: boolean }>(`${this.endpoint}/can-add-user`);
  }

  canAddClinic(): Observable<{ canAdd: boolean }> {
    return this.apiService.get<{ canAdd: boolean }>(`${this.endpoint}/can-add-clinic`);
  }
}
