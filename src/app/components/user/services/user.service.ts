import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../../entities/IUser';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5126/api/User'; // Update with your API URL

  constructor(private http: HttpClient) {}

  register(user: IUser): Observable<any> {
    // Encrypt the password before sending it to the API
    const encryptedPassword = CryptoJS.SHA256(user.password).toString();
    const userToRegister = {
      ...user,
      passwordHash: encryptedPassword // Assuming the API will hash the password
    };
    return this.http.post(this.apiUrl, userToRegister);
  }
}
