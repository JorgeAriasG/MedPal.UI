# Copilot Instructions - Medical Scheduling App UI

> Angular 19.2.3 | NgRx State Management | Material Design 3 | TypeScript Strict Mode

## Quick Context

- **Project Type:** Medical scheduling app (appointments, patients, prescriptions, clinics, users, audit, consent)
- **Architecture:** Component-based with centralized NgRx state, HTTP services, Guards, Interceptors
- **Key Tech:** Angular 19.2.3, @ngrx/store 18.1.1, @angular/material 19.2.4, RxJS 7.8.0
- **Status:** Phase 1-3 complete (auth, base components); ready for final UI polish & missing components
- **Goal:** Complete UI layer aligned with backend API + implement missing services/components

---

## Code Style & Conventions

### Language & Formatting
- **TypeScript:** Strict mode 100% enforced (`tsconfig.json`)
- **Indentation:** 2 spaces
- **Line length:** 100-120 chars
- **Naming:** camelCase (variables/methods), PascalCase (classes/interfaces), UPPER_SNAKE_CASE (constants/enums)
- **Imports:** Sorted: @angular → third-party → local paths (with ~ for src/app)

### Component Patterns
```typescript
// Smart Component (Container) - handles state/logic
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsComponent implements OnInit, OnDestroy {
  patients$: Observable<IPatient[]>;
  private destroy$ = new Subject<void>();

  constructor(private patientService: PatientsService, private store: Store) {}

  ngOnInit() {
    this.patients$ = this.store.select(selectPatients);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class ItemService {
  private endpoint = 'items';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<IItem[]> {
    return this.apiService.get<IItem[]>(this.endpoint);
  }

  getById(id: number): Observable<IItem> {
    return this.apiService.get<IItem>(`${this.endpoint}/${id}`);
  }

  create(item: IItem): Observable<IItem> {
    return this.apiService.post<IItem>(this.endpoint, item);
  }

  update(id: number, item: Partial<IItem>): Observable<IItem> {
    return this.apiService.put<IItem>(`${this.endpoint}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

### Memory Management (CRITICAL)
- Always unsubscribe from observables using `takeUntil` or `async` pipe:
  ```typescript
  this.patients$.pipe(takeUntil(this.destroy$)).subscribe(...);
  ```
- Never use `.subscribe()` without unsubscribe in components

### NgRx Patterns
- **Actions:** Feature-scoped (e.g., `loadPatients`, `loadPatientsSuccess`, `loadPatientsFailure`)
- **Reducers:** Pure functions, no side effects
- **Effects:** Handle async operations (HTTP calls)
- **Selectors:** Use `createFeatureSelector` + `createSelector` for memoization

---

## Architecture & Project Structure

```
src/app/
├── components/
│   ├── appointments/          - Schedule management (list, create, edit)
│   ├── audit-logs/            - Audit trail visualization
│   ├── calendar/              - Calendar view for appointments
│   ├── clinics/               - Clinic management (add, edit, list)
│   ├── home/                  - Dashboard (clinic context-aware)
│   ├── medical-history/       - Patient medical records display
│   ├── patients/              - Patient management (CRUD)
│   ├── prescriptions/         - Prescription handling (create, detail, QR)
│   ├── public/                - Auth pages (login, signup, unauthorized)
│   ├── quickaction-menu/      - Quick action floating menu
│   └── user/                  - User management, roles, profile
├── services/
│   ├── api.service.ts         - HTTP wrapper (GET, POST, PUT, DELETE)
│   ├── auth.service.ts        - Authentication & JWT management
│   ├── audit-log.service.ts   - Audit logging operations
│   ├── clinic-context.service.ts - Clinic context management
│   ├── medical-history.service.ts - Medical records API
│   ├── permission.service.ts  - Permission checking (RBAC)
│   ├── prescription.service.ts - Prescription operations
│   └── tenant-context.service.ts - Multi-tenancy support
├── guards/
│   └── auth.guard.ts          - Route protection (check auth + permissions)
├── interceptors/
│   └── auth.interceptor.ts    - JWT token injection + error handling
├── store/
│   ├── actions/               - Feature actions (auth, audit, etc)
│   ├── reducers/              - State reducers
│   ├── selectors/             - State selectors (memoized)
│   ├── effects/               - Side effects (API calls)
│   └── audit/ & consent/      - Feature-specific state folders
├── entities/                  - TypeScript interfaces/models
├── conf/                      - Configuration (form configs, constants)
├── shared/                    - Reusable components (EditModal, Menu, etc)
└── utils/                     - Utility functions (validation, formatting)
```

---

## Design System & Styling

### Global Variables (src/styles.css)
All colors, spacing, typography come from CSS variables:

```css
/* Colors */
--color-primary: #1976D2
--color-success: #4CAF50
--color-warning: #FF9800
--color-danger: #F44336
--color-allergy: #FF5252

/* Spacing (4px base unit) */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px      ← Use for padding/margin (default)
--spacing-lg: 24px      ← Between sections
--spacing-xl: 32px
--spacing-2xl: 48px

/* Typography */
--font-family: 'Roboto'
--font-size-body: 0.95rem
--font-size-small: 0.875rem
--font-weight-medium: 500

/* More: border-radius, shadows, transitions, etc */
```

### Component Styles
- Use **isolated `.component.css`** files (not inline)
- Reference global variables: `color: var(--color-primary)`;
- Use Material design tokens where applicable
- Mobile first: `@media (min-width: 768px) { ... }`
- Minimal custom CSS (Material handles most styling)

### Material Design 3
- Use Material components from `@angular/material` (not custom HTML)
- MatButton, MatInput, MatCard, MatTable, MatDialog, MatSnackBar, etc.
- Icons from FontAwesome (`@fortawesome/*`)
- Import Material module in component's module using `angular-material.module.ts`

---

## Build & Test Commands

```bash
# Development
npm start          # ng serve (http://localhost:4200)

# Production
npm run build      # ng build (output: dist/)

# Testing
npm test           # ng test (Karma runner)

# Watch builds
npm run watch      # ng build --watch --configuration development

# Angular CLI commands
ng generate component <name>   # Scaffold new component
ng generate service <name>     # Scaffold new service
ng generate module <name>      # Scaffold new module
ng generate guard <name>       # Scaffold new route guard
```

---

## Project Conventions & Patterns

### Entity/Interface Pattern
- Located in `src/app/entities/`
- Named `I<Entity>.ts` (e.g., `IUser.ts`, `IPatient.ts`)
- Export interface + optional enums/constants
- Example:
  ```typescript
  // entities/IPatient.ts
  export interface IPatient {
    id: number;
    name: string;
    email: string;
    dateOfBirth: string;
    allergies?: string[];
  }
  ```

### API Service Pattern
- `api.service.ts` is the base HTTP wrapper
- Individual entity services inherit/use it: `UserService`, `PatientService`, etc.
- Endpoints defined as class properties: `private endpoint = 'users'`
- Always return typed Observables: `Observable<IUser[]>`

### Form Configuration Pattern
- Forms defined in `conf/form-config.ts`
- Each entity has a config object with field definitions
- Used by `EditModalComponent` for dynamic form rendering
- Example:
  ```typescript
  export const userFormConfig = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true }
  ];
  ```

### JWT & Authentication
- Token stored in `localStorage` under key `token`
- `AuthService` manages login, logout, token refresh
- `authInterceptor` auto-injects token in all API calls
- Protected routes use `AuthGuard`

### Clinic Context
- Multi-clinic support: each user sees data for their clinic
- `ClinicContextService` manages current clinic
- `HomeComponent` uses clinic-aware selectors
- Clinic ID passed to API: `GET /appointments?clinicId=123`

### Role-Based Access Control (RBAC)
- Roles: SuperAdmin, AccountAdmin, ClinicAdmin, Doctor, HealthProfessional, Receptionist, Patient
- Permissions: 40+ granular permissions (Users.Create, Patients.View, etc.)
- `PermissionService.hasPermission(permission)` checks access
- Routes guarded by `canActivate: [AuthGuard]`

### Error Handling
- HTTP errors caught in interceptor
- 401 (Unauthorized) → redirect to login
- 403 (Forbidden) → redirect to /unauthorized
- 404/500 → display snackbar error message
- Form validation errors shown on inputs

---

## Integration Points

### Backend API
- Base URL: `http://localhost:5126/api/`
- Endpoints: `/appointments`, `/users`, `/patients`, `/prescriptions`, `/clinics`, `/audit`, etc.
- Auth: Bearer token in `Authorization` header
- Response format: `{ data: T, statusCode: number, message: string }`

### NgRx Store
- Feature modules register with Store using `StoreModule.forFeature('featureName', reducer)`
- Effects listen to actions and dispatch new actions on async completion
- Selectors retrieve memoized state slices

### Material Dialog
- Dialog content passed via `data` property
- Return data with `dialogRef.close(data)`
- Example: `NewAppointmentComponent` opens in dialog, returns appointment on save

### Routing
- Lazy-loaded modules by feature (e.g., `patients` feature module)
- Routes protected by guards
- Parameters: `/patient/:id` captured with `route.param` subscription

---

## Security & Auth

### Key Principles
1. Never store sensitive data (passwords, PII) in localStorage
2. Always validate tokens on app startup
3. Check permissions before rendering/enabling UI
4. Use guards on all protected routes
5. Sanitize user input (Angular by default escapes HTML)

### Auth Flow
1. User logs in via `/public/login`
2. `AuthService.login()` calls `/auth/login` API
3. Backend returns JWT token
4. Token stored in localStorage
5. `authInterceptor` injects token in all subsequent requests
6. Token checked on app startup; if invalid, redirect to login

### Permission Checking
```typescript
// In component
if (this.permissionService.hasPermission('Users.Create')) {
  // Show "Create User" button
}

// In template
<button *ngIf="hasPermission('Users.Create')">Create</button>
```

---

## Testing

- **Framework:** Karma (runner) + Jasmine (assertions)
- **Command:** `npm test`
- **Pattern:** One `.spec.ts` per component/service
- **Mocking:** Use Jasmine spies for services/HTTP
- **Focus:** Component logic, service methods, guards

---

## Development Workflow

### Adding a New Entity
1. Create `src/app/entities/I<Entity>.ts` (interface)
2. Create `src/app/services/<entity>.service.ts` (HTTP CRUD)
3. Create service tests `<entity>.service.spec.ts`
4. Add form config to `conf/form-config.ts`

### Adding a New Component
1. Run `ng generate component components/<feature>/<component-name>`
2. Implement smart/dumb component split
3. Use `ChangeDetectionStrategy.OnPush`
4. Unsubscribe in `ngOnDestroy` with `destroy$`
5. Use Material components for styling
6. Add form validation if needed

### Adding a New Endpoint
1. Add new action in `store/actions/<feature>.actions.ts`
2. Handle in reducer: `store/reducers/<feature>.reducer.ts`
3. Add selector: `store/selectors/<feature>.selectors.ts`
4. Create effect (if async): `store/effects/<feature>.effects.ts`

---

## Common Issues & Solutions

### Subscription Memory Leaks
- **Problem:** Component doesn't unsubscribe before destroy
- **Solution:** Use `takeUntil(this.destroy$)` in all subscribe chains

### Change Detection Not Triggering
- **Problem:** Using OnPush but data changes aren't detected
- **Solution:** Ensure observable emits new values via proper RxJS operators

### CORS Errors
- **Problem:** Frontend (4200) can't call backend (5126)
- **Solution:** Backend must have CORS enabled for localhost:4200

### Material Styling Issues
- **Problem:** Material components not styled correctly
- **Solution:** Ensure `angular-material.module.ts` imported in module

### Form Config Not Rendering
- **Problem:** Custom fields don't show in EditModalComponent
- **Solution:** Field names must match entity property names exactly

---

## Quick Reference Links

- **Design System:** `DESIGN_SYSTEM.md` (colors, typography, spacing, components)
- **Implementation Standards:** `IMPLEMENTATION_STANDARDS.md` (accessibility, performance, patterns)
- **Component Library:** `COMPONENT_LIBRARY.md` (component examples & best practices)
- **API Context:** `Docs/ANGULAR_PROJECT_CONTEXT.md` (backend integration details)
- **Code Patterns:** `Docs/ANGULAR_CODE_PATTERNS.md` (entity, service, store, guard patterns)

---

## Agent Focus Areas

When working on this codebase:

1. **Enforce strict TypeScript** - No `any` types unless absolutely necessary
2. **Follow SOLID principles** - Single responsibility, dependency injection, loose coupling
3. **Maintain OnPush change detection** - For better performance
4. **Use Material Design 3** - Consistency with design system
5. **Respect CSS variables** - Don't hardcode colors or spacing
6. **Keep components simple** - Complex logic goes in services
7. **Handle errors gracefully** - No silent failures
8. **Write testable code** - Services/guards easy to unit test
9. **Document public APIs** - JSDoc comments on services/components
10. **Clean up subscriptions** - Always unsubscribe in ngOnDestroy

---

## Next Steps for Completion

1. **Missing Components:** Identify which components listed in API don't have full UI implementation
2. **Missing Services:** Create services for any API endpoints without corresponding service
3. **Form Validation:** Enhance form configs with more validation rules
4. **Error States:** Implement comprehensive error handling/display
5. **Loading States:** Add spinners/skeletons while data loads
6. **Responsive Design:** Test all components on mobile/tablet/desktop
7. **Accessibility:** Ensure WCAG 2.1 AA compliance across all components
8. **Performance:** Implement pagination, virtual scrolling for large lists

