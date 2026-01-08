import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IRole } from 'src/app/entities/IRole';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private apiService: ApiService) {}

  getRoles(clinicId?: number | null) {
    const url = clinicId ? `/roles?clinicId=${clinicId}` : '/roles';
    return this.apiService.get<IRole[]>(url);
  }

  getRoleById(id: number) {
    return this.apiService.get<IRole>(`/roles/${id}`);
  }

  createRole(role: IRole) {
    return this.apiService.post<IRole>('/roles', role);
  }

  updateRole(role: Partial<IRole>) {
    return this.apiService.put<IRole>(`/roles/${role.id}`, role);
  }

  deleteRole(id: number) {
    return this.apiService.delete<void>(`/roles/${id}`);
  }

  editRole(role: Partial<IRole>) {
    return this.updateRole(role);
  }
}
