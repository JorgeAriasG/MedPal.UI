# Dashboard Refactoring Plan
**Fecha:** Enero 10, 2026  
**Objetivo:** Transformar Home en Dashboard y mantener Appointments con el calendario integrado

---

## 📋 Resumen Ejecutivo

Propuesta simple y directa:

1. **Home Component** = **Dashboard** - Vista consolidada con KPIs, citas próximas y pacientes recientes
2. **Appointments Component** - Se mantiene como está con el calendario integrado (angular-calendar)
3. **Routing** - Home en `/` (Dashboard) y Appointments en `/appointments` o accesible desde Home

---

## 🎯 Estructura Propuesta

```
components/
├── home/
│   ├── home.component.ts (convertido a Dashboard)
│   ├── home.component.html (dashboard layout con KPIs)
│   ├── home.component.css (dashboard styles)
│   └── home.component.spec.ts
│
├── appointments/
│   ├── appointment/
│   │   ├── appointment.component.ts (con calendario)
│   │   ├── appointment.component.html (con mwl-calendar)
│   │   ├── appointment.component.css (actualizado)
│   │   └── appointment.component.spec.ts
│   ├── new-appointment/
│   └── services/
│
├── clinics/
├── patients/
├── prescriptions/
└── user/
```

### Routing
```typescript
// app-routing.module.ts
const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: HomeComponent,  // Dashboard principal
    canActivate: [AuthGuard]
  },
  {
    path: 'appointments',
    component: AppointmentComponent,  // Con calendario
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    component: PatientsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinics',
    component: ClinicListComponent,
    canActivate: [AuthGuard]
  },
  // ...resto de rutas
];
```

---

## 📊 Home Component (Convertido a Dashboard)

### Objetivo
Proporcionar al médico una vista consolidada de:
- Estadísticas rápidas (KPIs)
- Próximas citas de hoy/esta semana
- Pacientes recientes
- Acciones rápidas
- Navegación a otras secciones

### Layout del Dashboard

```
┌─────────────────────────────────────────────┐
│ Bienvenido, Dr. [Nombre]  |  [Clinic: X]  │
└─────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  📅 Citas    │  │  👤 Pacientes│  │  ✅ Completadas│  │  ⏰ Próxima  │
│   Today: 5   │  │   This Month │  │    This Month  │  │   12:30 PM   │
│  This Week:12│  │   New: 3     │  │    95% Rate    │  │  John Doe    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────┐
│ [+ New Appointment] [📅 View Calendar] [+ New Patient] │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 📅 Upcoming Appointments (Today & Tomorrow)              │
├──────────────────────────────────────────────────────────┤
│ 10:00 AM - John Doe     (Dentistry)    [✎ Edit]        │
│ 02:30 PM - Jane Smith   (Cardiology)   [✎ Edit]        │
│ 09:30 AM (Tomorrow) - Mike Johnson     [✎ Edit]        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│ 👥 Recent Patients                   │  │ Quick Navigation             │
├──────────────────────────────────────┤  ├──────────────────────────────┤
│ • John Doe    (2 days ago)           │  │ 📋 Patients  |  🏥 Clinics  │
│ • Jane Smith  (5 days ago)           │  │ 💊 Prescriptions            │
│ • Mike Johnson (1 week ago)          │  │                              │
│ • Sarah Lee    (2 weeks ago)         │  │ [View All Patients →]       │
│                  [View All →]        │  └──────────────────────────────┘
└──────────────────────────────────────┘
```

### Home TypeScript Structure
```typescript
export class HomeComponent implements OnInit, OnDestroy {
  // State
  clinicId: number;
  currentUser: User;
  private destroy$ = new Subject<void>();
  
  // KPIs
  appointmentsTodayCount: number = 0;
  appointmentsThisWeekCount: number = 0;
  totalPatientsThisMonth: number = 0;
  newPatientsThisMonth: number = 0;
  completionRatePercentage: number = 0;
  nextAppointment: IAppointment | null = null;
  
  // Lists
  upcomingAppointments: IAppointment[] = [];
  recentPatients: IPatient[] = [];
  
  constructor(
    private appointmentService: AppointmensService,
    private patientService: PatientsService,
    private clinicService: ClinicService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Cargar todos los datos necesarios para el dashboard
  }

  navigateToCalendar(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToNewAppointment(): void {
    // Abrir dialog de nueva cita
  }

  navigateToPatients(): void {
    this.router.navigate(['/patients']);
  }

  navigateToClinics(): void {
    this.router.navigate(['/clinics']);
  }

  navigateToPrescriptions(): void {
    this.router.navigate(['/prescriptions']);
  }

  openEditAppointmentModal(appointment: IAppointment): void {
    // Abrir modal de edición
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 🗓️ Appointments Component (Se mantiene con calendario)

### Lo que permanece
- Vista semanal con `mwl-calendar-week-view` de angular-calendar
- Botón "New Appointment" que abre dialog
- Lógica de carga de citas
- Edición de citas en modal
- Eliminación de citas
- Integración con clinic selector

### Lo que se mejora
- CSS actualizado con Design System tokens (ya hecho)
- HTML refactorizado con mejor estructura (ya hecho)
- Mejor manejo de errores
- Loading states

### AppointmentComponent TypeScript
```typescript
export class AppointmentComponent implements OnInit, OnDestroy {
  // State
  faPencil = faPencil;
  appointments: IAppointment[] = [];
  clinicId: number | null | undefined;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  currentAppointmentId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmensService,
    private dialog: MatDialog,
    private clinicService: ClinicService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loadClinicData();
  }

  loadClinicData(): void {
    // Cargar clinic ID y appointments
  }

  getAllAppointmentsById(): void {
    // Cargar citas y convertir a eventos del calendario
  }

  addAppointmentToggle(): void {
    // Abrir dialog de nueva cita
  }

  openEditModal(appointment: IAppointment): void {
    // Abrir modal de edición
  }

  onFormSubmitted(data: any): void {
    // Procesar actualización de cita
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 🏠 Structure Overview

```
ANTES:
Home
├── QuickAction Menu
├── Appointment Component (contiene calendar)
│   └── mwl-calendar-week-view
└── Otros

DESPUÉS:
Home (Dashboard)
├── Header (Bienvenida, Clinic)
├── KPI Cards (4 cards)
├── Quick Actions
├── Upcoming Appointments List
├── Recent Patients List
└── Navigation Cards

Appointments (se mantiene)
├── Header
├── Action Bar
├── mwl-calendar-week-view
├── New Appointment Dialog
└── Edit Modal
```

---

## 🔄 Flujo de Navegación

```
┌─────────────────┐
│  DASHBOARD      │
│    (Home)       │
├─────────────────┤
│  KPIs           │
│  Quick Actions  │
│  Upcoming Appts │
│  Recent Patients│
│  Navigation     │
└────────┬────────┘
         │ Click "View Calendar" o "New Appointment"
         ↓
┌─────────────────┐
│  APPOINTMENTS   │
│  (with Calendar)│
├─────────────────┤
│  Calendar View  │
│  Edit/Delete    │
│  New Appointment│
└─────────────────┘
```

---

## 📦 Servicios Necesarios

### Existentes (usar)
- `AppointmentService` - getAppointments, updateAppointment, saveAppointment
- `PatientsService` - getPatients
- `ClinicService` - getClinics

### Por crear (OPCIONAL)
Si queremos KPIs más precisos, podríamos crear un servicio dashboard, pero por ahora usamos los servicios existentes directamente.

---

## 🎨 Design System Integration

### Componentes a usar:
- **mat-card** - KPI cards, sections, recent patients
- **mat-button** - Actions, navigation
- **mat-icon** - Icons para KPIs y acciones
- **mat-dialog** - Modal para crear/editar citas (reutilizar NewAppointmentComponent)
- **mwl-calendar-week-view** - Calendar en appointments

### Colores (Design System):
- `--color-primary` - Botones principales
- `--color-success` - Completed status
- `--color-warning` - Pending status
- `--color-danger` - Cancelled status
- `--color-bg-surface` - Card backgrounds

---

## 📈 Fases de Implementación

### **Fase 1: Preparación** ✅
- [x] Crear plan
- [x] Revisar estructura actual
- [x] Clarificar con usuario

### **Fase 2: Actualizar Home → Dashboard** (3-4 horas)
- [ ] Crear nuevo layout HTML (KPI cards, sections)
- [ ] Crear CSS con Design System tokens
- [ ] Actualizar TypeScript para cargar datos
- [ ] Implementar quick actions
- [ ] Implementar upcoming appointments section
- [ ] Implementar recent patients section
- [ ] Implementar navigation cards
- [ ] Testing y ajustes

### **Fase 3: Verificar Appointments** (30 minutos)
- [ ] Verificar que todo funcione correctamente
- [ ] Asegurar que navigation desde Home funcione
- [ ] Testing

### **Fase 4: Routing Update** (15 minutos)
- [ ] Asegurar que `/appointments` funcione correctamente
- [ ] Verificar navegación

### **Fase 5: Testing & Polish** (1-2 horas)
- [ ] Testing en diferentes resoluciones
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Verificar flujo completo: Dashboard → Appointments

### **Fase 6: Cleanup** (15 minutos)
- [ ] Remover componentes o código obsoleto
- [ ] Verificar que no haya broken imports

---

## ⚙️ Configuración Técnica

### Imports necesarios (ya deberían estar)
```typescript
// home.module.ts
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
```

### Módulos a asegurar que estén
```typescript
@NgModule({
  declarations: [
    HomeComponent,          // Ahora Dashboard
    AppointmentComponent,   // Con calendario
    NewAppointmentComponent,
    // ...otros
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    // ...otros
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class HomeModule {}
```

### App Routing
```typescript
// app-routing.module.ts
const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },               // Dashboard
      { path: 'appointments', component: AppointmentComponent }, // Con calendar
      { path: 'patients', component: PatientsComponent },
      { path: 'clinics', component: ClinicListComponent },
      // ...resto
    ]
  },
];
```

---

## 🎯 Ventajas de esta Arquitectura

✅ **Simple y Directa**
- Home = Dashboard (información importante)
- Appointments = Calendario y gestión de citas
- Mínimos cambios, máximo impacto

✅ **No requiere nuevo componente**
- Reutilizamos appointments con el calendario
- Menos código para mantener
- Menos complejidad

✅ **UX Intuitiva**
- Médico entra al dashboard (KPIs)
- Click en "View Calendar" accesa el calendario
- Click en cita próxima puede editarla

✅ **Escalable**
- Fácil agregar más secciones al dashboard
- Cada sección es independiente
- Appointments sigue siendo robusto

✅ **Rápido de implementar**
- Solo refactorizar Home
- Appointments ya está funcional
- 5-6 horas totales de trabajo

---

## 📝 Cambios en archivos

### Files a actualizar:
- `src/app/components/home/home.component.ts` (convertir a dashboard)
- `src/app/components/home/home.component.html` (nuevo layout)
- `src/app/components/home/home.component.css` (nuevos estilos)
- `src/app/components/home/home.module.ts` (asegurar imports)
- `src/app/app-routing.module.ts` (asegurar rutas)

### Files a mantener igual:
- `src/app/components/appointments/` (funciona como está)
- `src/app/components/appointments/new-appointment/` (reutilizar)

---

## ✅ Confirmado

✅ **Home = Dashboard** (no nuevo componente)
✅ **Appointments mantiene calendario** (no cambios mayores)
✅ **Arquitectura simple y directa**
✅ **Máximo reutilización de código**

---

## 📝 Próximos Pasos

1. ✅ Plan actualizado presentado
2. 📍 Confirmar para proceder
3. ⏭️ Fase 2: Refactorizar Home → Dashboard

---

**Estimado Total:** 5-6 horas de trabajo  
**Componentes nuevos:** 0  
**Componentes refactorizados:** 1 (Home → Dashboard)  
**Cambios arquitectura:** Mínimos

---

## 🎯 Estructura Propuesta

```
components/
├── home/
│   ├── home.component.ts (convertido a Dashboard)
│   ├── home.component.html (dashboard layout con KPIs)
│   ├── home.component.css (dashboard styles)
│   └── home.component.spec.ts
│
├── appointments/
│   ├── appointment/
│   │   ├── appointment.component.ts (con calendario)
│   │   ├── appointment.component.html (con mwl-calendar)
│   │   ├── appointment.component.css
│   │   └── appointment.component.spec.ts
│   ├── new-appointment/ (se reutiliza)
│   └── services/
│
├── clinics/
├── patients/
├── prescriptions/
└── user/
```

---

## 📊 Home Component (Convertido a Dashboard)

### Objetivo
Proporcionar al médico una vista consolidada de:
- Estadísticas rápidas (KPIs)
- Próximas citas de hoy/esta semana
- Pacientes recientes
- Acciones rápidas
- Navegación a otras secciones

### Componentes del Dashboard

#### 1. **Header Section**
```
┌─────────────────────────────────────────────────┐
│ Bienvenido, Dr. [Nombre]  |  [Clinic: X]      │
└─────────────────────────────────────────────────┘
```

#### 2. **KPI Cards Row** (4 columnas)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  📅 Citas    │  │  👤 Pacientes│  │  ✅ Completadas│  │  ⏰ Próxima  │
│   Today: 5   │  │   This Month │  │    This Month  │  │   12:30 PM   │
│  This Week:12│  │   New: 3     │  │    95% Rate    │  │  John Doe    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Datos requeridos por KPI:**
- **Appointments Today**: Count de citas hoy
- **Total Patients (this month)**: Count total + nuevos
- **Completion Rate**: % de citas completadas
- **Next Appointment**: Detalles de próxima cita

#### 3. **Quick Actions Bar**
```
┌────────────────────────────────────────────────┐
│ [+ New Appointment] [📅 Go to Calendar] [+ New Patient] │
└────────────────────────────────────────────────┘
```

#### 4. **Upcoming Appointments Section**
```
Next Appointments (Today & Tomorrow & This Week)
┌──────────────────────────────────────────────────────┐
│ 📅 TODAY                                             │
├──────────────────────────────────────────────────────┤
│ 10:00 AM - John Doe     (Dentistry)    [✎ Edit]    │
│ 02:30 PM - Jane Smith   (Cardiology)   [✎ Edit]    │
├──────────────────────────────────────────────────────┤
│ 📅 TOMORROW                                          │
├──────────────────────────────────────────────────────┤
│ 09:30 AM - Mike Johnson (Pediatrics)   [✎ Edit]    │
│ 03:00 PM - Sarah Lee    (Nutrition)    [✎ Edit]    │
└──────────────────────────────────────────────────────┘
```

#### 5. **Recent Patients Section**
```
┌──────────────────────────────────────────┐
│ 👥 Recent Patients                       │
├──────────────────────────────────────────┤
│ • John Doe         (Last visit: 2 days) │
│ • Jane Smith       (Last visit: 5 days) │
│ • Mike Johnson     (Last visit: 1 week) │
│ • Sarah Lee        (Last visit: 2 week) │
│                       [View All Patients]│
└──────────────────────────────────────────┘
```

#### 6. **Navigation Cards to Other Sections**
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 📋 Patients      │  │ 🏥 Clinics       │  │ 💊 Prescriptions │
│ Manage patient   │  │ Manage medical   │  │ Create & manage  │
│ information      │  │ centers          │  │ prescriptions    │
│ [View All →]     │  │ [View All →]     │  │ [View All →]     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Home TypeScript Structure
```typescript
export class HomeComponent implements OnInit, OnDestroy {
  // State
  clinicId: number;
  currentUser: User;
  
  // KPIs
  appointmentsTodayCount: number;
  totalPatientsThisMonth: number;
  newPatientsThisMonth: number;
  completionRatePercentage: number;
  nextAppointment: IAppointment;
  
  // Lists
  upcomingAppointments: IAppointment[];
  recentPatients: IPatient[];
  
  // Methods
  loadDashboardData(): void
  navigateToCalendar(): void
  navigateToPatients(): void
  navigateToNewAppointment(): void
  navigateToNewPatient(): void
  navigateToClinics(): void
  openEditAppointmentModal(id: number): void
}
```

---

## 🗓️ Calendar Component (Nuevo)

### Objetivo
Vista dedicada al calendario semanal/mensual con eventos de citas. Componente independiente con su propia ruta (`/calendar`)

### Layout
```
┌──────────────────────────────────────────────────┐
│ Appointments Schedule                            │
│ View and manage your clinic appointments        │
├──────────────────────────────────────────────────┤
│ [< Prev Week] [Week View] [Month View] [Next >] │
├──────────────────────────────────────────────────┤
│  Sun     Mon     Tue     Wed     Thu     Fri  Sat│
│  5       6       7       8       9       10   11 │
│                                                  │
│ [Event] [Event] [Event] [Event] [Event] [...]   │
│                                                  │
│                                                  │
│ [+ New Appointment Button]                      │
└──────────────────────────────────────────────────┘
```

### Funcionalidades
- Vista semanal/mensual con angular-calendar
- Click en evento para ver detalles
- Botón para crear nueva cita (abre dialog)
- Botón para editar cita (abre modal)
- Botón para eliminar cita
- Navegación entre semanas/meses
- Respuesta a cambios de clinic en el store

### Calendar TypeScript
```typescript
export class CalendarComponent implements OnInit, OnDestroy {
  // State
  viewDate: Date;
  viewMode: 'week' | 'month' = 'week';
  events: CalendarEvent[];
  clinicId: number;
  
  // Methods
  ngOnInit(): void
  loadAppointments(): void
  nextPeriod(): void
  previousPeriod(): void
  toggleViewMode(): void
  openNewAppointmentDialog(): void
  openEditAppointmentModal(appointment: IAppointment): void
  onEventClick(event: CalendarEvent): void
  deleteAppointment(id: number): void
}
```

---

## 🏠 Structure Overview

```
ANTES:
Home
├── QuickAction Menu
├── Appointment Component (contiene calendar + lista)
│   └── mwl-calendar-week-view
└── Otros componentes

DESPUÉS:
Home (Dashboard)
├── Header (Welcome, Clinic)
├── KPI Cards
├── Quick Actions
├── Upcoming Appointments List
├── Recent Patients List
└── Navigation Cards

Calendar (Componente separado, ruta /calendar)
├── Header
├── Action Bar (New Appointment)
└── mwl-calendar-week-view
    ├── Edit button por evento
    ├── Delete button
    └── New appointment dialog
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    APPOINTMENT DATA FLOW                     │
└─────────────────────────────────────────────────────────────┘

                    AppointmentService
                    ├── getAppointments()
                    ├── getAppointmentsByDate()
                    ├── getAppointmentsThisWeek()
                    ├── saveAppointment()
                    ├── updateAppointment()
                    └── deleteAppointment()

                            ↙              ↘

                    Home                Calendar
                   (Dashboard)         (Schedule)
                   
            - Próximas citas     - Vista semanal
            - KPIs               - Eventos clickeables
            - Resumen            - Edit/Delete buttons
            - Quicklinks         - New appointment dialog
```

---

## 📦 Servicios Necesarios

### Existentes (usar)
- `AppointmentService` - getAppointments, saveAppointment, updateAppointment
- `PatientsService` - getPatients
- `ClinicService` - getClinics

### Por crear (si es necesario)
```typescript
// dashboard.service.ts (OPCIONAL)
export class DashboardService {
  getAppointmentsTodayCount(clinicId: number): Observable<number>
  getCompletionRate(clinicId: number): Observable<number>
  getUpcomingAppointments(clinicId: number, days: number): Observable<IAppointment[]>
  getRecentPatients(clinicId: number, limit: number): Observable<IPatient[]>
}
```

O simplemente usar `AppointmentService` y `PatientsService` directamente en el componente.

---

## 🎨 Design System Integration

### Componentes a usar:
- **mat-card** - KPI cards, sections
- **mat-button** - Actions
- **mat-icon** - Icons para KPIs y acciones
- **mat-dialog** - Modal para crear/editar citas
- **mwl-calendar-week-view** - Calendar de angular-calendar

### Colores (Design System):
- `--color-primary` - Botones principales
- `--color-success` - Completed status
- `--color-warning` - Pending status
- `--color-danger` - Cancelled status
- `--color-bg-surface` - Card backgrounds

---

## 📈 Fases de Implementación

### **Fase 1: Preparación** ✅
- [x] Crear plan
- [x] Revisar estructura actual
- [x] Clarificar con usuario

### **Fase 2: Calendar Component** (2-3 horas)
- [ ] Crear calendar.component.ts/html/css
- [ ] Extraer lógica de appointment.component
- [ ] Implementar new-appointment dialog
- [ ] Implementar edit modal
- [ ] Implementar delete functionality
- [ ] Testing en navegador

### **Fase 3: Home → Dashboard** (3-4 horas)
- [ ] Actualizar home.component.ts (remover calendar logic)
- [ ] Crear dashboard layout (KPI cards, sections)
- [ ] Implementar upcoming appointments section
- [ ] Implementar recent patients section
- [ ] Implementar navigation cards
- [ ] Implementar quick actions
- [ ] Testing y ajustes de diseño

### **Fase 4: Routing Update** (30 minutos)
- [ ] Agregar ruta /calendar
- [ ] Actualizar home.module.ts
- [ ] Verificar que app-routing.module funcione correctamente

### **Fase 5: Testing & Polish** (1-2 horas)
- [ ] Testing en diferentes resoluciones
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Verificar navegación entre Home y Calendar

### **Fase 6: Cleanup** (30 minutos)
- [ ] Remover código obsoleto del appointment component
- [ ] Verificar que no haya broken imports
- [ ] Actualizar documentación si es necesaria

---

## ⚙️ Configuración Técnica

### Imports necesarios (en home.module.ts)
```typescript
// Ya existentes
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

// Importar nuevos componentes
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
```

### Módulos a registrar
```typescript
@NgModule({
  declarations: [
    HomeComponent,      // Ahora es Dashboard
    CalendarComponent,  // Nuevo
    // ...otros
  ],
  imports: [
    // ...existentes
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class HomeModule {}
```

### App Routing
```typescript
// app-routing.module.ts
const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },           // Dashboard
      { path: 'calendar', component: CalendarComponent }, // Calendar
      { path: 'patients', component: PatientsComponent },
      { path: 'clinics', component: ClinicListComponent },
      // ...resto
    ]
  },
];
```

---

## 🎯 Ventajas de esta Arquitectura

✅ **Home = Dashboard**
- Médico ve información importante al entrar
- Sin componente extra innecesario
- KPIs y resumen en un vistazo

✅ **Calendar como ruta separada**
- Acceso fácil desde dashboard
- Componente dedicado a la visualización de citas
- Separación clara de responsabilidades

✅ **Escalabilidad**
- Fácil agregar más rutas (Patients, Clinics, etc)
- Cada componente es independiente

✅ **UX Mejorado**
- Médico entra a dashboard (información crítica)
- Click en "Go to Calendar" o nueva cita accesa calendar
- Flujo intuitivo y natural

✅ **Limpieza de código**
- Remover appointment component complejo
- Calendar tiene una única responsabilidad
- Home es más simple y enfocado

---

## 📝 Cambios en archivos

### Files a crear:
- `src/app/components/calendar/calendar.component.ts`
- `src/app/components/calendar/calendar.component.html`
- `src/app/components/calendar/calendar.component.css`
- `src/app/components/calendar/calendar.component.spec.ts`

### Files a actualizar:
- `src/app/components/home/home.component.ts` (convertir a dashboard)
- `src/app/components/home/home.component.html` (nuevo layout)
- `src/app/components/home/home.component.css` (nuevos estilos)
- `src/app/components/home/home.module.ts` (agregar calendar)
- `src/app/app-routing.module.ts` (agregar ruta /calendar)

### Files a revisar/limpiar:
- `src/app/components/appointments/appointment/` (verificar si aún se usa)
- `src/app/components/appointments/new-appointment/` (reutilizar desde calendar)

---

## 🤔 Decisiones Confirmadas ✅

✅ **Home = Dashboard** (no componente nuevo)
✅ **Calendar componente separado** con ruta `/calendar`
✅ **Appointments component removido** (funcionalidad en Calendar)
✅ **Estructura simple y directa**

---

## 📝 Próximos Pasos

1. ✅ Plan actualizado presentado
2. 📍 Esperar confirmación para proceder
3. ⏭️ Fase 2: Crear Calendar Component

---

**Estimado Total:** 7-10 horas de trabajo  
**Componentes nuevos:** 1 (Calendar)  
**Componentes refactorizados:** 1 (Home → Dashboard)  
**Componentes removidos/limpiados:** 1 (Appointments logic)

---

## 📊 Dashboard Component - Detalles

### Objetivo
Proporcionar al médico una vista consolidada de:
- Estadísticas rápidas (KPIs)
- Próximas citas de hoy/esta semana
- Pacientes recientes
- Acciones rápidas

### Componentes del Dashboard

#### 1. **Header Section**
```
┌─────────────────────────────────────────────────────┐
│ Bienvenido, Dr. [Nombre]  |  [Clinic: X]  |  [Date] │
└─────────────────────────────────────────────────────┘
```

#### 2. **KPI Cards Row** (4 columnas)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  📅 Citas    │  │  👤 Pacientes│  │  ✅ Completadas│  │  ⏰ Próxima  │
│   Today: 5   │  │   This Month │  │    This Month  │  │   12:30 PM   │
│  This Week:12│  │   New: 3     │  │    95% Rate    │  │  John Doe    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Datos requeridos por KPI:**
- **Appointments Today**: Count de citas hoy
- **Total Patients (this month)**: Count total + nuevos
- **Completion Rate**: % de citas completadas
- **Next Appointment**: Detalles de próxima cita

#### 3. **Quick Actions Bar**
```
┌────────────────────────────────────────┐
│ [+ New Appointment] [View Calendar] [+ New Patient] │
└────────────────────────────────────────┘
```

#### 4. **Upcoming Appointments Section**
```
Tomorrow & Next Week
┌─────────────────────────────────────────────────────┐
│ 📅 TODAY                                            │
├─────────────────────────────────────────────────────┤
│ 10:00 AM - John Doe     (Dentistry)    [✎ Edit]    │
│ 02:30 PM - Jane Smith   (Cardiology)   [✎ Edit]    │
├─────────────────────────────────────────────────────┤
│ 📅 TOMORROW                                         │
├─────────────────────────────────────────────────────┤
│ 09:30 AM - Mike Johnson (Pediatrics)   [✎ Edit]    │
│ 03:00 PM - Sarah Lee    (Nutrition)    [✎ Edit]    │
└─────────────────────────────────────────────────────┘
```

#### 5. **Recent Patients Section**
```
┌──────────────────────────────────────────┐
│ 👥 Recent Patients                       │
├──────────────────────────────────────────┤
│ • John Doe         (Last visit: 2 days) │
│ • Jane Smith       (Last visit: 5 days) │
│ • Mike Johnson     (Last visit: 1 week) │
│ • Sarah Lee        (Last visit: 2 week) │
└──────────────────────────────────────────┘
```

#### 6. **Statistics Chart (Optional)**
- Gráfico de citas por día (últimos 7 días)
- Gráfico de especialidades más visitadas
- (Usando Chart.js que ya está importado en home.component)

### Dashboard TypeScript Structure
```typescript
export class DashboardComponent implements OnInit, OnDestroy {
  // State
  clinicId: number;
  currentUser: User;
  
  // KPIs
  appointmentsTodayCount: number;
  totalPatientsThisMonth: number;
  newPatientsThisMonth: number;
  completionRatePercentage: number;
  nextAppointment: IAppointment;
  
  // Lists
  upcomingAppointments: IAppointment[];
  recentPatients: IPatient[];
  
  // Methods
  loadDashboardData(): void
  navigateToCalendar(): void
  navigateToAppointments(): void
  navigateToNewAppointment(): void
  navigateToNewPatient(): void
  openEditAppointmentModal(id: number): void
}
```

---

## 🗓️ Calendar Component - Detalles

### Objetivo
Vista dedicada al calendario semanal/mensual con eventos de citas

### Componentes
```
┌──────────────────────────────────────────────────┐
│ Appointments Calendar                            │
├──────────────────────────────────────────────────┤
│ [< Prev Week] [Week View] [Month View] [Next >] │
├──────────────────────────────────────────────────┤
│  Sun     Mon     Tue     Wed     Thu     Fri  Sat│
│  5       6       7       8       9       10   11 │
│                                                  │
│ [Event] [Event] [Event] [Event] [Event] [...]   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Calendar TypeScript
```typescript
export class CalendarComponent implements OnInit, OnDestroy {
  // State
  viewDate: Date;
  viewMode: 'week' | 'month' = 'week';
  events: CalendarEvent[];
  
  // Methods
  loadEvents(): void
  toggleViewMode(): void
  nextPeriod(): void
  previousPeriod(): void
  onEventClick(event: CalendarEvent): void
}
```

---

## 📋 Appointments Component (Refactorizado) - Detalles

### Cambios
**De:**
- Mostrar calendario + lista de citas
- Mixed concerns (calendar + appointment management)

**A:**
- Solo lista/tabla de citas
- Búsqueda y filtros
- Acciones inline (Edit, Delete, View)
- Modal para crear/editar

### Estructura HTML Propuesta
```
┌──────────────────────────────────────────────────────┐
│ My Appointments                                      │
├──────────────────────────────────────────────────────┤
│ [Search] [Filter by Status] [Filter by Date]        │
├──────────────────────────────────────────────────────┤
│ Patient      | Date       | Time    | Status | Actions
├──────────────────────────────────────────────────────┤
│ John Doe     | Jan 10,25  | 10:00 AM| Scheduled |✎ ✕
│ Jane Smith   | Jan 11,25  | 02:30 PM| Pending   |✎ ✕
│ Mike Johnson | Jan 12,25  | 09:30 AM| Completed |✎ ✕
└──────────────────────────────────────────────────────┘
```

### Appointments TypeScript
```typescript
export class AppointmentComponent implements OnInit, OnDestroy {
  // State
  appointments: IAppointment[];
  filteredAppointments: IAppointment[];
  searchTerm: string = '';
  statusFilter: string = '';
  
  // Methods
  loadAppointments(): void
  filterAppointments(): void
  searchAppointments(term: string): void
  openEditModal(id: number): void
  deleteAppointment(id: number): void
  openNewAppointmentDialog(): void
}
```

---

## 🏠 Home Component (Actualizado)

### Estructura Propuesta
```html
<div class="home-container">
  <app-navigation-bar></app-navigation-bar>
  
  <!-- Tab Navigation -->
  <mat-tab-group>
    <mat-tab label="Dashboard" icon="dashboard">
      <app-dashboard></app-dashboard>
    </mat-tab>
    
    <mat-tab label="Calendar" icon="calendar_month">
      <app-calendar></app-calendar>
    </mat-tab>
    
    <mat-tab label="Appointments" icon="event_note">
      <app-appointment></app-appointment>
    </mat-tab>
    
    <mat-tab label="Patients" icon="people">
      <app-patients></app-patients>
    </mat-tab>
    
    <mat-tab label="Clinics" icon="local_hospital">
      <app-clinic-list></app-clinic-list>
    </mat-tab>
  </mat-tab-group>
</div>
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    APPOINTMENT DATA FLOW                     │
└─────────────────────────────────────────────────────────────┘

                    AppointmentService
                    ├── getAppointments()
                    ├── getAppointmentsByDate()
                    ├── getAppointmentsThisWeek()
                    ├── saveAppointment()
                    ├── updateAppointment()
                    └── deleteAppointment()

                            ↙ ↓ ↘

            ┌──────────────────┬──────────────────┬──────────────┐
            │                  │                  │              │
        Dashboard          Calendar         Appointments
        
    - Próximas citas   - Vista semanal    - Lista completa
    - KPIs             - Eventos          - Búsqueda/filtros
    - Resumen          - Click para editar - Actions inline
```

---

## 📦 Servicios Necesarios

### Existentes (usar)
- `AppointmentService` - getAppointments, saveAppointment, updateAppointment
- `PatientsService` - getPatients
- `ClinicService` - getClinics

### Por crear (si es necesario)
```typescript
// dashboard.service.ts
export class DashboardService {
  getAppointmentsTodayCount(clinicId: number): Observable<number>
  getCompletionRate(clinicId: number): Observable<number>
  getUpcomingAppointments(clinicId: number, days: number): Observable<IAppointment[]>
  getRecentPatients(clinicId: number, limit: number): Observable<IPatient[]>
}
```

---

## 🎨 Design System Integration

### Componentes a usar:
- **mat-card** - KPI cards, sections
- **mat-tab-group** - Navigation en home
- **mat-table** - Tabla de appointments
- **mat-form-field** - Search, filters
- **mat-button** - Actions
- **mat-icon** - Icons para KPIs
- **mat-dialog** - Modales (appointment edit)

### Colores (Design System):
- `--color-primary` - Botones principales
- `--color-success` - Completed status
- `--color-warning` - Pending status
- `--color-danger` - Cancelled status
- `--color-bg-surface` - Card backgrounds

---

## 📈 Fases de Implementación

### **Fase 1: Preparación** ✅
- [x] Crear plan
- [x] Revisar estructura actual

### **Fase 2: Calendar Component** (2-3 horas)
- [ ] Crear calendar.component.ts/html/css
- [ ] Extraer lógica de appointment.component
- [ ] Testing en navegador

### **Fase 3: Dashboard Component** (3-4 horas)
- [ ] Crear dashboard.component.ts/html/css
- [ ] Implementar KPI cards
- [ ] Implementar upcoming appointments section
- [ ] Implementar recent patients section
- [ ] Crear dashboard.service si es necesario
- [ ] Testing y ajustes de diseño

### **Fase 4: Refactor Appointments** (1-2 horas)
- [ ] Actualizar appointment.component (remover calendar)
- [ ] Agregar tabla/lista con filtros
- [ ] Agregar búsqueda
- [ ] Testing

### **Fase 5: Update Home Component** (1 hora)
- [ ] Agregar mat-tab-group
- [ ] Distribuir componentes en tabs
- [ ] CSS/responsive

### **Fase 6: Testing & Polish** (1-2 horas)
- [ ] Testing en diferentes resoluciones
- [ ] Mobile responsiveness
- [ ] Performance optimization

---

## ⚙️ Configuración Técnica

### Imports necesarios (en home.module.ts)
```typescript
// Ya existentes
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Por importar si falta
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips'; // Para status badges
```

### Módulos a registrar
- DashboardComponent en declarations
- CalendarComponent en declarations
- Actualizar routing en home.module

---

## 🎯 Ventajas de esta Arquitectura

✅ **Separación de Responsabilidades**
- Dashboard: Solo KPIs y resumen
- Calendar: Vista visual del tiempo
- Appointments: Gestión operativa

✅ **Escalabilidad**
- Fácil agregar más tabs (Patients, Clinics, Prescriptions)
- Cada componente es independiente

✅ **UX Mejorado**
- Médico ve dashboard al entrar (información importante)
- Calendar para planificación visual
- Appointments para gestión detallada

✅ **Performance**
- Cada tab carga sus datos bajo demanda
- No overload de información en una vista

✅ **Responsive**
- Cada componente se adapta a mobile
- Tabs se pueden convertir en drawer en mobile

---

## 🤔 Decisiones Pendientes (PARA DISCUTIR)

1. **¿Home como contenedor con tabs o como router?**
   - Opción A: Tabs (actual propuesta) - más simple, componentes siempre cargados
   - Opción B: Router lazy-load - más eficiente en performance

2. **¿Dashboard Service?**
   - ¿Crear servicio dedicado o usar AppointmentService + PatientsService?

3. **¿Gráficos en Dashboard?**
   - ¿Incluir Chart.js con estadísticas visuales?
   - ¿Qué KPIs mostrar? (appointment rate, patient satisfaction, etc)

4. **¿Mobile Layout**
   - ¿Mantener tabs o cambiar a drawer/accordion en mobile?

5. **¿Niveles de permisos?**
   - Dashboard muestra info diferente según rol (Admin vs Doctor)?

---

## 📝 Próximos Pasos

1. **Revisas este plan**
2. **Indicas:** 
   - ✅ Si te parece bien esta arquitectura
   - 📝 Cambios o ajustes que quieras
   - ❓ Respuestas a las decisiones pendientes
3. **Procedo con Fase 2**

---

**Estimado Total:** 8-12 horas de trabajo  
**Componentes nuevos:** 2 (Calendar, Dashboard)  
**Componentes refactorizados:** 2 (Appointments, Home)
