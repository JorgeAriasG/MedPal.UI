import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(this.baseUrl + endpoint, options as {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      context?: any;
      params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
      reportProgress?: boolean;
      observe?: 'body';
      responseType?: 'json';
      withCredentials?: boolean;
      transferCache?: { includeHeaders?: string[] } | boolean;
    });
  }

  getBlob(endpoint: string): Observable<Blob> {
    return this.http.get(this.baseUrl + endpoint, { responseType: 'blob' });
  }

  post<T = any>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.post<T>(this.baseUrl + endpoint, data, options as {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      context?: any;
      params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
      reportProgress?: boolean;
      observe?: 'body';
      responseType?: 'json';
      withCredentials?: boolean;
      transferCache?: { includeHeaders?: string[] } | boolean;
    });
  }

  put<T = any>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.put<T>(this.baseUrl + endpoint, data, options as {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      context?: any;
      params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
      reportProgress?: boolean;
      observe?: 'body';
      responseType?: 'json';
      withCredentials?: boolean;
      transferCache?: { includeHeaders?: string[] } | boolean;
    });
  }

  patch<T = any>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.patch<T>(this.baseUrl + endpoint, data, options as {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      context?: any;
      params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
      reportProgress?: boolean;
      observe?: 'body';
      responseType?: 'json';
      withCredentials?: boolean;
    });
  }

  delete<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http.delete<T>(this.baseUrl + endpoint, options as {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      context?: any;
      params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
      reportProgress?: boolean;
      observe?: 'body';
      responseType?: 'json';
      withCredentials?: boolean;
      transferCache?: { includeHeaders?: string[] } | boolean;
    });
  }
}
