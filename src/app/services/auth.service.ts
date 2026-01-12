import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '../store/actions/auth.actions';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginEndpoint = 'User/login';
  private currentUserEndpoint = 'User/me';

  constructor(
    private router: Router,
    private http: HttpClient,
    private store: Store,
    private apiService: ApiService
  ) {}

  login(email: string, password: string): Observable<any> {
    // Send password in plain text - backend handles hashing
    const loginData = { email, password };
    return this.apiService.post(this.loginEndpoint, loginData);
  }

  signup(data: any): Observable<any> {
    return this.apiService.post('User/register', data);
  }

  // Get current user profile data including specialty
  getCurrentUser(): Observable<any> {
    return this.apiService.get(this.currentUserEndpoint);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
