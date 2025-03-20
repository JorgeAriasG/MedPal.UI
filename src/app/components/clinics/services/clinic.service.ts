import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IClinic } from 'src/app/entities/IClinic';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { switchMap } from 'rxjs/operators';
import { SessionService } from 'src/app/utils/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private baseUrl = 'http://localhost:5126/api/clinic';

  constructor(private http: HttpClient, private session: SessionService) { }

  addClinic(clinic: IClinic): Observable<any> {
    return this.session.getStoreUserId().pipe(
      switchMap((userId: string | null) => this.http.post(`${this.baseUrl}?userId=${userId}`, clinic))
    );
  }

  editClinic(clinic: IClinic): Observable<any> {
    return this.http.put(`${this.baseUrl}?id=${clinic.id}`, clinic);
  }

  getClinics(): Observable<any> {
    return this.session.getStoreUserId().pipe(
      switchMap((userId: string | null) => this.http.get<IClinic[]>(`${this.baseUrl}?Id=${userId}`))
    );
  }
}
