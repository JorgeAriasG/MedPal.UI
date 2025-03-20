import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5126/api/User/login'; // Update with your API URL

  constructor(private router: Router, private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    const loginData = { email, passwordHash: encryptedPassword };

    return this.http.post(this.apiUrl, loginData);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
