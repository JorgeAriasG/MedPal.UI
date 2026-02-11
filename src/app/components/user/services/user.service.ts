import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../../entities/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5126/api/user';

  constructor(private http: HttpClient) {}

  register(user: IUser): Observable<any> {
    // Send registration to /api/user/register endpoint
    const registerData = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      specialty: user.specialty,
      professionalLicenseNumber: user.professionalLicenseNumber,
      acceptPrivacyTerms: user.acceptPrivacyTerms,
    };
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  addUser(user: IUser): Observable<any> {
    const registerData = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      specialty: user.specialty,
      professionalLicenseNumber: user.professionalLicenseNumber,
      acceptPrivacyTerms: user.acceptPrivacyTerms,
      ...(user.roleId && { roleId: user.roleId }), // Include roleId if provided (admin creating user)
      ...(user.defaultClinicId && { defaultClinicId: user.defaultClinicId }), // Include clinic if provided
    };
    return this.http.post(`${this.apiUrl}`, registerData);
  }

  getUsers(): Observable<IUser[]> {
    const url = `${this.apiUrl}/account`;
    return this.http.get<IUser[]>(url);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  editUser(user: Partial<IUser>): Observable<any> {
    return this.http.put(this.apiUrl, user);
  }
}
