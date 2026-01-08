import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../../entities/IUser';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5126/api/User';

  constructor(private http: HttpClient) {}

  register(user: IUser): Observable<any> {
    const encryptedPassword = CryptoJS.SHA256(user.password).toString();
    const userToRegister = {
      ...user,
      passwordHash: encryptedPassword
    };
    return this.http.post(this.apiUrl, userToRegister);
  }

  getUsers(clinicId?: number | null): Observable<IUser[]> {
    const url = clinicId ? `${this.apiUrl}?clinicId=${clinicId}` : this.apiUrl;
    return this.http.get<IUser[]>(url);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  editUser(user: Partial<IUser>): Observable<any> {
    return this.http.put(this.apiUrl, user);
  }
}
