# 📱 GUÍA: Actualizar Frontend para Nueva Arquitectura

**Fecha:** Enero 12, 2026  
**Destinatario:** Equipo Frontend  
**Tipo:** Cambios requeridos + ejemplos code  

---

## 📋 Cambios Requeridos en Frontend

### 1. Actualizar Servicio de Autenticación

**Archivo:** `src/services/auth.service.ts`

#### ANTES (viejo):
```typescript
// ❌ Viejo - Solo devuelve user y token
login(email, password) {
  return this.http.post('/api/user/login', { email, password }).pipe(
    tap(response => {
      localStorage.setItem('token', response.token);
    })
  );
}
```

#### AHORA (nuevo):
```typescript
// ✅ Nuevo - También devuelve role y permisos
login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>('/api/user/login', { email, password }).pipe(
    tap(response => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userPermissions', JSON.stringify(response.permissions || []));
      this.currentUserSubject.next(response);
    })
  );
}

// Nuevos métodos helper
getRole(): string | null {
  return localStorage.getItem('userRole');
}

getPermissions(): string[] {
  const perms = localStorage.getItem('userPermissions');
  return perms ? JSON.parse(perms) : [];
}

hasPermission(permission: string): boolean {
  return this.getPermissions().includes(permission);
}

isSuperAdmin(): boolean {
  return this.getRole() === 'SuperAdmin';
}

isAccountAdmin(): boolean {
  return this.getRole() === 'AccountAdmin';
}

isClinicAdmin(): boolean {
  return this.getRole() === 'ClinicAdmin';
}

isDoctor(): boolean {
  return this.getRole() === 'Doctor';
}

isPatient(): boolean {
  return this.getRole() === 'Patient';
}
```

### 2. Crear DTOs/Interfaces de Respuesta

**Archivo:** `src/models/auth.models.ts`

```typescript
export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
  role: string;
  accountId?: number;
  clinicId?: number;
  permissions?: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  acceptPrivacyTerms: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  accountId?: number;
  clinicId?: number;
}
```

### 3. Actualizar Componentes de Navegación

**Archivo:** `src/components/navbar/navbar.component.ts`

#### ANTES:
```typescript
// ❌ Viejo - Solo muestra el usuario
template: `
  <nav>
    <span>Bienvenido, {{ user.name }}</span>
    <button (click)="logout()">Logout</button>
  </nav>
`
```

#### AHORA:
```typescript
// ✅ Nuevo - Muestra rol y opciones según permisos
template: `
  <nav class="navbar">
    <div class="navbar-brand">
      <span>MedPal</span>
    </div>
    
    <div class="navbar-menu" *ngIf="currentUser$ | async as user">
      <span class="user-info">
        {{ user.name }}
        <span class="role-badge" [ngClass]="'role-' + user.role">
          {{ user.role }}
        </span>
      </span>
      
      <!-- Menu items condicionado al rol -->
      <div class="nav-items">
        <a routerLink="/dashboard" routerLinkActive="active">
          Dashboard
        </a>
        
        <!-- Solo para administradores -->
        <ng-container *ngIf="authService.isAccountAdmin() || authService.isSuperAdmin()">
          <a routerLink="/admin/users" routerLinkActive="active">
            Gestionar Usuarios
          </a>
          <a routerLink="/admin/audit" routerLinkActive="active">
            Auditoría
          </a>
        </ng-container>
        
        <!-- Solo SuperAdmin -->
        <ng-container *ngIf="authService.isSuperAdmin()">
          <a routerLink="/admin/accounts" routerLinkActive="active">
            Cuentas
          </a>
          <a routerLink="/admin/system" routerLinkActive="active">
            Sistema
          </a>
        </ng-container>
        
        <!-- Solo médicos -->
        <ng-container *ngIf="authService.isDoctor()">
          <a routerLink="/medical-records" routerLinkActive="active">
            Registros Médicos
          </a>
        </ng-container>
        
        <!-- Para todos excepto patient -->
        <ng-container *ngIf="!authService.isPatient()">
          <a routerLink="/patients" routerLinkActive="active">
            Pacientes
          </a>
          <a routerLink="/appointments" routerLinkActive="active">
            Citas
          </a>
        </ng-container>
      </div>
      
      <button (click)="logout()" class="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  </nav>
`,
styles: [`
  .role-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    margin-left: 8px;
  }
  
  .role-SuperAdmin { background: #ff6b6b; color: white; }
  .role-AccountAdmin { background: #4ecdc4; color: white; }
  .role-ClinicAdmin { background: #45b7d1; color: white; }
  .role-Doctor { background: #96ceb4; color: white; }
  .role-Patient { background: #dfe6e9; color: #2d3436; }
`]
```

```typescript
export class NavbarComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
```

### 4. Actualizar Guards de Rutas

**Archivo:** `src/guards/role.guard.ts`

#### ANTES:
```typescript
// ❌ Viejo - Solo verifica si está autenticado
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
```

#### AHORA:
```typescript
// ✅ Nuevo - Verifica rol y permisos
export const authGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (allowedRoles: string[]): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentRole = authService.getRole();
  if (allowedRoles.includes(currentRole)) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

export const permissionGuard = (requiredPermission: string): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.hasPermission(requiredPermission)) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

// Guards específicos para ahorro de código
export const adminGuard = roleGuard(['SuperAdmin', 'AccountAdmin', 'ClinicAdmin']);
export const doctorGuard = roleGuard(['Doctor', 'HealthProfessional']);
export const superAdminGuard = roleGuard(['SuperAdmin']);
```

### 5. Actualizar Configuración de Rutas

**Archivo:** `src/app.routes.ts`

```typescript
export const routes: Routes = [
  // Públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // Protegidas - Todos autenticados
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Solo administradores
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [authGuard, roleGuard(['SuperAdmin', 'AccountAdmin', 'ClinicAdmin'])]
      },
      {
        path: 'audit',
        component: AdminAuditComponent,
        canActivate: [authGuard, roleGuard(['SuperAdmin', 'AccountAdmin'])]
      },
      {
        path: 'accounts',
        component: AdminAccountsComponent,
        canActivate: [authGuard, superAdminGuard]
      },
      {
        path: 'system',
        component: AdminSystemComponent,
        canActivate: [authGuard, superAdminGuard]
      }
    ]
  },

  // Médicos
  {
    path: 'medical-records',
    component: MedicalRecordsComponent,
    canActivate: [authGuard, roleGuard(['Doctor', 'HealthProfessional'])]
  },

  // Todos excepto patients
  {
    path: 'patients',
    component: PatientsListComponent,
    canActivate: [authGuard, permissionGuard('Patients.ViewAll')]
  },

  {
    path: 'appointments',
    component: AppointmentsComponent,
    canActivate: [authGuard]
  },

  // Catchall
  { path: '**', redirectTo: '/dashboard' }
];
```

### 6. Crear Directivas de Permiso (Opcional pero Recomendado)

**Archivo:** `src/directives/has-permission.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input() set appHasPermission(permission: string | string[]) {
    this.permissions = Array.isArray(permission) ? permission : [permission];
    this.updateView();
  }

  private permissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasPermission = this.permissions.some(p => 
      this.authService.hasPermission(p)
    );

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

**Uso en templates:**
```html
<!-- Solo mostrar si tiene permiso -->
<button *appHasPermission="'Users.Manage'" (click)="openUserDialog()">
  Crear Usuario
</button>

<!-- Multiple permisos (OR) -->
<div *appHasPermission="['Users.Manage', 'Users.Create']">
  Zona administrativa
</div>
```

### 7. Crear Directiva de Rol

**Archivo:** `src/directives/has-role.directive.ts`

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() set appHasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  private requiredRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const currentRole = this.authService.getRole();
    const hasRole = this.requiredRoles.includes(currentRole);

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

**Uso en templates:**
```html
<!-- Solo mostrar para SuperAdmin -->
<div *appHasRole="'SuperAdmin'">
  Panel de Control del Sistema
</div>

<!-- Para múltiples roles (OR) -->
<div *appHasRole="['SuperAdmin', 'AccountAdmin']">
  Zona administrativa
</div>
```

### 8. Actualizar Servicio de Pacientes

**Archivo:** `src/services/patient.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:5126/api/patients';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Solo mostrar datos que el usuario puede ver
  getAllPatients(): Observable<any[]> {
    // El backend automáticamente filtra según rol
    return this.http.get<any[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: any): Observable<any> {
    // Validar permiso antes de enviar
    if (!this.authService.hasPermission('Patients.Create')) {
      throw new Error('No tienes permiso para crear pacientes');
    }
    return this.http.post<any>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: any): Observable<any> {
    if (!this.authService.hasPermission('Patients.Update')) {
      throw new Error('No tienes permiso para editar pacientes');
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    if (!this.authService.hasPermission('Patients.Delete')) {
      throw new Error('No tienes permiso para eliminar pacientes');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### 9. Actualizar Componente de Lista de Pacientes

**Archivo:** `src/components/patients/patients-list/patients-list.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  template: `
    <div class="patients-container">
      <div class="header">
        <h1>Pacientes</h1>
        <p class="role-info">
          Rol: <strong>{{ authService.getRole() }}</strong>
        </p>
      </div>

      <!-- Botón crear solo si tiene permiso -->
      <button 
        *appHasPermission="'Patients.Create'"
        (click)="openCreateDialog()"
        class="btn-primary"
      >
        + Nuevo Paciente
      </button>

      <!-- Tabla de pacientes -->
      <table class="patients-table" *ngIf="(patients$ | async) as patients">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let patient of patients">
            <td>{{ patient.name }}</td>
            <td>{{ patient.email }}</td>
            <td>{{ patient.phone }}</td>
            <td>
              <!-- Edit solo si tiene permiso -->
              <button 
                *appHasPermission="'Patients.Update'"
                (click)="openEditDialog(patient)"
                class="btn-small"
              >
                Editar
              </button>

              <!-- Delete solo si tiene permiso -->
              <button 
                *appHasPermission="'Patients.Delete'"
                (click)="deletePatient(patient.id)"
                class="btn-small btn-danger"
              >
                Eliminar
              </button>

              <!-- Ver detalles para todos -->
              <button 
                (click)="viewDetails(patient)"
                class="btn-small"
              >
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje si no hay permiso -->
      <div *ngIf="!authService.hasPermission('Patients.ViewAll')" class="alert">
        No tienes permiso para ver pacientes
      </div>
    </div>
  `,
  styles: [`
    .patients-container {
      padding: 20px;
    }
    
    .header {
      margin-bottom: 20px;
    }
    
    .role-info {
      color: #666;
      font-size: 14px;
    }
    
    .btn-primary {
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    
    .btn-small {
      background: #2196F3;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      margin-right: 5px;
    }
    
    .btn-danger {
      background: #f44336;
    }
    
    .patients-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .patients-table th,
    .patients-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .patients-table th {
      background: #f5f5f5;
      font-weight: bold;
    }
    
    .alert {
      padding: 15px;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      color: #856404;
    }
  `]
})
export class PatientsListComponent implements OnInit {
  patients$: Observable<any[]>;

  constructor(
    private patientService: PatientService,
    public authService: AuthService
  ) {
    this.patients$ = this.patientService.getAllPatients();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patients$ = this.patientService.getAllPatients();
  }

  openCreateDialog(): void {
    // Implementar modal de crear
  }

  openEditDialog(patient: any): void {
    // Implementar modal de editar
  }

  deletePatient(id: number): void {
    if (confirm('¿Está seguro?')) {
      this.patientService.deletePatient(id).subscribe(
        () => {
          alert('Paciente eliminado');
          this.loadPatients();
        },
        error => console.error(error)
      );
    }
  }

  viewDetails(patient: any): void {
    // Implementar vista de detalles
  }
}
```

---

## 🎯 Checklist de Cambios

- [ ] Actualizar `auth.service.ts` con nuevos métodos
- [ ] Crear/actualizar interfaces en `models/auth.models.ts`
- [ ] Actualizar `navbar.component.ts` con nuevas opciones
- [ ] Implementar nuevos guards en `guards/`
- [ ] Actualizar `app.routes.ts` con canActivate
- [ ] Crear directivas `has-permission.directive.ts` y `has-role.directive.ts`
- [ ] Actualizar servicios existentes (patient, appointment, etc.)
- [ ] Actualizar componentes para usar nuevas directivas
- [ ] Probar cada ruta con diferentes roles
- [ ] Verificar que datos sensibles no se muestren

---

## 🧪 Testing: Verificar Funcionalidad

### Test 1: Login y Roles

```typescript
// Verificar que el login devuelve el rol correcto
it('should login and return role', () => {
  const response = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    token: 'jwt-token',
    role: 'Doctor',
    permissions: ['Patients.ViewAll', 'MedicalRecords.Create']
  };

  authService.login('test@example.com', 'password').subscribe(result => {
    expect(result.role).toBe('Doctor');
    expect(authService.getRole()).toBe('Doctor');
    expect(authService.hasPermission('Patients.ViewAll')).toBe(true);
  });
});
```

### Test 2: Role Guard

```typescript
it('should allow access if role matches', () => {
  spyOn(authService, 'getRole').and.returnValue('Doctor');
  
  const result = roleGuard(['Doctor', 'HealthProfessional'])();
  expect(result).toBe(true);
});

it('should deny access if role does not match', () => {
  spyOn(authService, 'getRole').and.returnValue('Patient');
  spyOn(router, 'navigate');
  
  const result = roleGuard(['Doctor'])();
  expect(result).toBe(false);
  expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
});
```

### Test 3: Directiva de Permiso

```typescript
it('should show element if user has permission', () => {
  spyOn(authService, 'hasPermission').and.returnValue(true);
  
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  
  const element = fixture.debugElement.query(By.directive(HasPermissionDirective));
  expect(element).toBeTruthy();
});

it('should hide element if user lacks permission', () => {
  spyOn(authService, 'hasPermission').and.returnValue(false);
  
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  
  const element = fixture.debugElement.query(By.directive(HasPermissionDirective));
  expect(element).toBeFalsy();
});
```

---

## 🔗 Referencias y URLs

- JWT Decoder: https://jwt.io
- Backend API Docs: http://localhost:5126/swagger
- Roles disponibles:
  - SuperAdmin
  - AccountAdmin
  - ClinicAdmin
  - Doctor
  - HealthProfessional
  - Receptionist
  - Patient

---

**Documento generado:** 12/01/2026  
**Validez:** Hasta nueva actualización  
**Contacto:** Backend Team
