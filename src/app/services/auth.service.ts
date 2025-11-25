import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Store } from '@ngrx/store';
import { logout } from '../store/actions/auth.actions';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'User/login'; // Update with your API URL

  constructor(
    private router: Router,
    private http: HttpClient,
    private store: Store,
    private apiService: ApiService
  ) {}

  login(email: string, password: string): Observable<any> {
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    const loginData = { email, passwordHash: encryptedPassword };

    return this.apiService.post(this.endpoint, loginData);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
