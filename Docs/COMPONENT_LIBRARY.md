# Component Library & Best Practices

## Overview

Este documento define patrones reutilizables y mejores prácticas para crear componentes Angular escalables siguiendo el Design System establecido.

---

## 1. Estructura de Componentes

### 1.1 Anatomía Básica

Todos los componentes deben seguir esta estructura:

```
component-name/
├── component-name.component.ts
├── component-name.component.html
├── component-name.component.css
└── component-name.component.spec.ts
```

### 1.2 Convenciones de Nombres

- **Componentes**: `kebab-case` en archivos, `PascalCase` en clases
- **Selectores**: Usar prefijo `app-` (e.g., `<app-patient-card>`)
- **Directivas**: Usar prefijo `app` (e.g., `appHighlight`)
- **Servicios**: Sufijo `Service` (e.g., `PatientService`)
- **Guards**: Sufijo `Guard` (e.g., `AuthGuard`)
- **Pipes**: Sufijo `Pipe` (e.g., `DateFormatPipe`)

---

## 2. Patrones de Componentes Comunes

### 2.1 Card Component Pattern

**Caso de Uso**: Mostrar información agrupada en contenedor visual

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">
      <mat-icon>icon_name</mat-icon>
      Card Title
    </h3>
  </div>
  <div class="card-body">
    <!-- Content here -->
  </div>
  <div class="card-footer" *ngIf="actions">
    <!-- Actions here -->
  </div>
</div>
```

**CSS Clases Requeridas**:
- `.card` - Contenedor principal
- `.card-header` - Encabezado con título
- `.card-body` - Contenido principal
- `.card-footer` - Acciones (opcional)

**Propiedades**:
```typescript
@Input() title: string;
@Input() icon: string;
@Input() actions: Action[];
@Input() isLoading: boolean = false;
@Input() isError: boolean = false;
```

---

### 2.2 Data Table Pattern

**Caso de Uso**: Mostrar datos tabulares con sorting y filtrado

```html
<div class="table-container">
  <div class="table-header">
    <h3>{{ title }}</h3>
    <mat-form-field class="search-field">
      <input matInput placeholder="Search..." [(ngModel)]="searchTerm">
    </mat-form-field>
  </div>
  
  <table mat-table [dataSource]="filteredData" class="data-table">
    <!-- Column definitions -->
    <ng-container matColumnDef="column_name">
      <th mat-header-cell *matHeaderCellDef>Column Header</th>
      <td mat-cell *matCellDef="let element">{{ element.property }}</td>
    </ng-container>
    
    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let element">
        <button mat-icon-button matTooltip="Edit">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Delete">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
</div>
```

---

### 2.3 Form Component Pattern

**Caso de Uso**: Crear formularios reactivos con validación

```typescript
export class MyFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private service: MyService,
    private dialog: MatDialogRef<MyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      field1: ['', [Validators.required, Validators.minLength(3)]],
      field2: ['', Validators.required],
      field3: this.fb.group({
        nested1: [''],
        nested2: ['']
      })
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.loadData(this.data.id);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isLoading = true;
    this.service.save(this.form.value).subscribe({
      next: (result) => {
        this.dialog.close(result);
      },
      error: (err) => {
        this.isLoading = false;
        // Handle error
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
```

**HTML Template**:
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <mat-form-field>
    <mat-label>Field 1</mat-label>
    <input matInput formControlName="field1" required>
    <mat-error *ngIf="form.get('field1')?.hasError('required')">
      Field is required
    </mat-error>
    <mat-error *ngIf="form.get('field1')?.hasError('minlength')">
      Minimum 3 characters
    </mat-error>
  </mat-form-field>

  <div formGroupName="nested">
    <mat-form-field>
      <mat-label>Nested Field</mat-label>
      <input matInput formControlName="nested1">
    </mat-form-field>
  </div>

  <button mat-raised-button color="primary" [disabled]="isLoading">
    <span *ngIf="!isLoading">Submit</span>
    <mat-spinner *ngIf="isLoading" diameter="20" class="inline-spinner"></mat-spinner>
  </button>
</form>
```

---

### 2.4 List with Empty/Error States

**Caso de Uso**: Mostrar listas con manejo de estados

```html
<div class="list-container">
  <!-- Loading State -->
  <div *ngIf="isLoading" class="state-loading">
    <mat-spinner diameter="40"></mat-spinner>
    <p>Loading...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error && !isLoading" class="state-error">
    <mat-icon>error_outline</mat-icon>
    <h3>Error Loading Data</h3>
    <p>{{ error }}</p>
    <button mat-raised-button color="primary" (click)="retry()">
      <mat-icon>refresh</mat-icon>
      Retry
    </button>
  </div>

  <!-- Empty State -->
  <div *ngIf="!isLoading && items.length === 0 && !error" class="state-empty">
    <mat-icon>inbox</mat-icon>
    <h3>No Items Found</h3>
    <p>Create your first item to get started</p>
    <button mat-raised-button color="primary" (click)="create()">
      <mat-icon>add</mat-icon>
      Create Item
    </button>
  </div>

  <!-- List -->
  <div *ngIf="!isLoading && items.length > 0" class="list">
    <div class="list-item" *ngFor="let item of items">
      <!-- Item content -->
    </div>
  </div>
</div>
```

---

## 3. Estilos Comunes - CSS Patterns

### 3.1 Componentes de Card

```css
.card {
  background: var(--color-bg-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}
```

### 3.2 Componentes de Tablas

```css
.table-container {
  background: var(--color-bg-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.table-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: var(--color-bg-page);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--spacing-md);
  text-align: left;
  color: var(--color-text-secondary);
  border-bottom: 2px solid var(--color-border);
}

.data-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-divider);
}

.data-table tr:hover {
  background-color: var(--color-bg-page);
}
```

### 3.3 Estados Vacíos

```css
.state-empty,
.state-loading,
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
}

.state-empty mat-icon,
.state-error mat-icon {
  font-size: 64px;
  width: 64px;
  height: 64px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.state-empty h3,
.state-error h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-primary);
}

.state-empty p,
.state-error p {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-text-secondary);
}

.state-loading {
  min-height: 300px;
}
```

---

## 4. Service Patterns

### 4.1 CRUD Service Pattern

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private endpoint = 'api/items';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.endpoint);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.endpoint}/${id}`);
  }

  create(item: Item): Observable<Item> {
    return this.http.post<Item>(this.endpoint, item);
  }

  update(id: number, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.endpoint}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

### 4.2 HTTP Error Handling

```typescript
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.statusText;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

---

## 5. RxJS Patterns

### 5.1 Subscription Management

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private service: MyService) {}

  ngOnInit(): void {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // Handle data
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 5.2 Loading & Error States

```typescript
export class DataComponent implements OnInit {
  data$ = this.service.getData().pipe(
    tap(() => this.isLoading = false),
    catchError((error) => {
      this.error = error.message;
      return of([]);
    }),
    startWith([])
  );

  isLoading = true;
  error: string | null = null;

  constructor(private service: DataService) {}

  ngOnInit(): void {}
}
```

---

## 6. Testing Patterns

### 6.1 Component Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyComponent],
      imports: [MaterialModule],
      providers: [MyService]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data when loaded', () => {
    component.data = { name: 'Test' };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```

---

## 7. Accessibility Requirements

Every component must include:

1. **Semantic HTML**: Use `<button>`, `<a>`, `<nav>`, etc.
2. **ARIA Labels**: `aria-label`, `aria-describedby` for clarity
3. **Keyboard Navigation**: Full tab navigation support
4. **Focus Management**: Visible focus indicators
5. **Color Contrast**: 4.5:1 for normal text
6. **Form Labels**: Always associated with inputs

```html
<!-- Good -->
<button aria-label="Close dialog" (click)="close()">
  <mat-icon>close</mat-icon>
</button>

<!-- Bad -->
<div (click)="close()">X</div>
```

---

## 8. Performance Optimization

### 8.1 Change Detection

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {
  @Input() items: Item[] = [];
}
```

### 8.2 Lazy Loading

```typescript
const routes: Routes = [
  {
    path: 'patients',
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule)
  }
];
```

### 8.3 Unsubscribe Pattern

Always use `takeUntil` or `async` pipe to prevent memory leaks.

---

## 9. Checklist for New Components

- [ ] Component follows naming conventions
- [ ] HTML is semantic and accessible
- [ ] CSS uses design tokens (CSS variables)
- [ ] All states (loading, error, empty) handled
- [ ] Inputs/Outputs documented with JSDoc
- [ ] No memory leaks (subscriptions managed)
- [ ] Mobile responsive design tested
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Tests written for main logic
- [ ] Console errors: 0

---

## 10. References

- Angular Best Practices: https://angular.io/guide/styleguide
- Material Design Guidelines: https://m3.material.io
- WCAG 2.1 Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- RxJS Best Practices: https://rxjs.dev/guide/operators
