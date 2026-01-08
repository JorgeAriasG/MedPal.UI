import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IClinic } from 'src/app/entities/IClinic';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private endpoint = 'clinic';

  constructor(private store: Store, private apiService: ApiService) {}

  addClinic(clinic: IClinic): Observable<any> {
    // Usar selector de NgRx en lugar de SessionService
    return this.store
      .select(selectUserId)
      .pipe(
        switchMap((userId: number | null) =>
          this.apiService.post(`${this.endpoint}?userId=${userId}`, clinic)
        )
      );
  }

  editClinic(clinic: IClinic): Observable<any> {
    return this.apiService.put(`${this.endpoint}`, clinic);
  }

  getClinics(): Observable<any> {
    return this.apiService.get(`${this.endpoint}`);
  }
}
