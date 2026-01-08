import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:5126/api/';

  constructor(private http: HttpClient) {}

  get<T = any>(endpoint: string) {
    return this.http.get<T>(this.baseUrl + endpoint);
  }

  post<T = any>(endpoint: string, data: any) {
    return this.http.post<T>(this.baseUrl + endpoint, data);
  }

  put<T = any>(endpoint: string, data: any) {
    return this.http.put<T>(this.baseUrl + endpoint, data);
  }

  delete<T = any>(endpoint: string) {
    return this.http.delete<T>(this.baseUrl + endpoint);
  }
}

