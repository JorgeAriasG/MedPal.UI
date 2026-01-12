import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IRole } from 'src/app/entities/IRole';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly endpoint: string = 'role';
  constructor(private apiService: ApiService) {}

  getRoles(clinicId?: number | null) {
    return this.apiService.get<IRole[]>(this.endpoint);
  }

  getRoleById(id: number) {
    return this.apiService.get<IRole>(`${this.endpoint}/${id}`);
  }

  createRole(role: IRole) {
    return this.apiService.post<IRole>(this.endpoint, role);
  }

  updateRole(role: Partial<IRole>) {
    return this.apiService.put<IRole>(`${this.endpoint}/${role.id}`, role);
  }

  deleteRole(id: number) {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  editRole(role: Partial<IRole>) {
    return this.updateRole(role);
  }
}
