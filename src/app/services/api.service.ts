import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:5126/api/';

  constructor(private http: HttpClient) {}

  get(endpoint: string) {
    return this.http.get(this.baseUrl + endpoint);
  }

  post(endpoint: string, data: any) {
    return this.http.post(this.baseUrl + endpoint, data);
  }

  put(endpoint: string, data: any) {
    return this.http.put(this.baseUrl + endpoint, data);
  }

  delete(endpoint: string) {
    return this.http.delete(this.baseUrl + endpoint);
  }
}
