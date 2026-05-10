# Signup Component - Checklist de Refactorización Detallado

## 📋 Información General

**Componente**: Signup
**Ruta**: `src/app/components/user/signup/`
**Tiempo Estimado**: 1.5-2 horas
**Dificultad**: 🟡 Medio (más campos, validación compleja)
**Prioridad**: ⭐⭐⭐⭐ Alta (segunda pantalla de autenticación)

---

## 🎯 Objetivo Final

Transformar el signup en una página profesional con múltiples secciones, validación avanzada y diseño consistente con el Design System.

---

## 📋 Cambios Necesarios - Estructura HTML

### Estructura Base Recomendada

```html
<div class="signup-container">
  <!-- Background -->
  <div class="signup-background"></div>
  
  <!-- Card -->
  <div class="signup-card">
    
    <!-- Header -->
    <div class="signup-header">
      <h1 class="signup-title">Create Account</h1>
      <p class="signup-subtitle">Join Medical Scheduling System</p>
    </div>

    <!-- Stepper (Opcional) o Tabs (Recomendado) -->
    <mat-tab-group class="signup-tabs">
      
      <!-- Tab 1: Personal Information -->
      <mat-tab label="Personal">
        <div class="tab-content">
          <!-- First Name -->
          <mat-form-field class="full-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="John">
            <mat-error *ngIf="form.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>

          <!-- Last Name -->
          <mat-form-field class="full-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Doe">
            <mat-error *ngIf="form.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>

          <!-- Email -->
          <mat-form-field class="full-width">
            <mat-label>Email Address</mat-label>
            <input matInput type="email" formControlName="email" placeholder="doctor@example.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Invalid email format
            </mat-error>
          </mat-form-field>

          <!-- Phone (Optional) -->
          <mat-form-field class="full-width">
            <mat-label>Phone (Optional)</mat-label>
            <input matInput type="tel" formControlName="phone" placeholder="+1 (555) 000-0000">
            <mat-icon matPrefix>phone</mat-icon>
          </mat-form-field>
        </div>
      </mat-tab>

      <!-- Tab 2: Professional Information -->
      <mat-tab label="Professional">
        <div class="tab-content">
          <!-- License Number -->
          <mat-form-field class="full-width">
            <mat-label>License Number</mat-label>
            <input matInput formControlName="licenseNumber" placeholder="LIC-12345678">
            <mat-error *ngIf="form.get('licenseNumber')?.hasError('required')">
              License number is required
            </mat-error>
          </mat-form-field>

          <!-- Specialty Dropdown -->
          <mat-form-field class="full-width">
            <mat-label>Specialty</mat-label>
            <mat-select formControlName="specialty">
              <mat-option value="General">General Practice</mat-option>
              <mat-option value="Dentistry">Dentistry</mat-option>
              <mat-option value="Nutrition">Nutrition</mat-option>
              <mat-option value="Cardiology">Cardiology</mat-option>
              <mat-option value="Pediatrics">Pediatrics</mat-option>
              <mat-option value="Dermatology">Dermatology</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('specialty')?.hasError('required')">
              Specialty is required
            </mat-error>
          </mat-form-field>

          <!-- Clinic Association (Optional) -->
          <mat-form-field class="full-width">
            <mat-label>Associated Clinic (Optional)</mat-label>
            <mat-select formControlName="clinicId">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let clinic of clinics$ | async" [value]="clinic.id">
                {{ clinic.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-tab>

      <!-- Tab 3: Account Information -->
      <mat-tab label="Account">
        <div class="tab-content">
          <!-- Password -->
          <mat-form-field class="full-width">
            <mat-label>Password</mat-label>
            <input matInput 
                   [type]="showPassword ? 'text' : 'password'" 
                   formControlName="password"
                   placeholder="••••••••"
                   (input)="updatePasswordStrength()">
            <mat-icon matPrefix>lock</mat-icon>
            <button 
              mat-icon-button 
              matSuffix 
              (click)="togglePassword()"
              type="button">
              <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">
              Minimum 8 characters
            </mat-error>
          </mat-form-field>

          <!-- Password Strength Indicator -->
          <div class="password-strength" *ngIf="form.get('password')?.value">
            <div class="strength-bar">
              <div class="strength-fill" [ngClass]="'strength-' + passwordStrength" [style.width.%]="passwordStrengthPercent"></div>
            </div>
            <p class="strength-text" [ngClass]="'strength-' + passwordStrength">
              {{ passwordStrengthText }}
            </p>
          </div>

          <!-- Confirm Password -->
          <mat-form-field class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput 
                   [type]="showPassword ? 'text' : 'password'" 
                   formControlName="confirmPassword"
                   placeholder="••••••••">
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">
              Please confirm password
            </mat-error>
            <mat-error *ngIf="form.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>
        </div>
      </mat-tab>

      <!-- Tab 4: Agreements -->
      <mat-tab label="Agreements">
        <div class="tab-content">
          <!-- Terms Checkbox -->
          <div class="checkbox-group">
            <mat-checkbox formControlName="acceptTerms" class="agreement-checkbox">
              <span>I agree to the <a href="javascript:void(0)" class="link">Terms of Service</a> and <a href="javascript:void(0)" class="link">Privacy Policy</a></span>
            </mat-checkbox>
            <mat-error *ngIf="form.get('acceptTerms')?.hasError('required')" class="checkbox-error">
              You must accept the terms
            </mat-error>
          </div>

          <!-- Data Processing Checkbox -->
          <div class="checkbox-group">
            <mat-checkbox formControlName="acceptDataProcessing" class="agreement-checkbox">
              <span>I consent to the processing of personal data as outlined in our <a href="javascript:void(0)" class="link">Privacy Policy</a></span>
            </mat-checkbox>
          </div>

          <!-- Marketing Checkbox -->
          <div class="checkbox-group">
            <mat-checkbox formControlName="acceptMarketing" class="agreement-checkbox">
              <span>I would like to receive emails about new features and updates (Optional)</span>
            </mat-checkbox>
          </div>
        </div>
      </mat-tab>

    </mat-tab-group>

    <!-- Error Alert (Global) -->
    <div class="error-alert" *ngIf="error$ | async as error">
      <mat-icon>error_outline</mat-icon>
      <span>{{ error }}</span>
    </div>

    <!-- Action Buttons -->
    <div class="signup-actions">
      <button 
        mat-stroked-button 
        routerLink="/login"
        class="back-button">
        Back to Login
      </button>
      
      <button 
        mat-raised-button 
        color="primary" 
        type="submit"
        [disabled]="(isLoading$ | async) || form.invalid"
        (click)="submit()"
        class="submit-button">
        <span *ngIf="!(isLoading$ | async)">Create Account</span>
        <mat-spinner *ngIf="isLoading$ | async" diameter="20" class="inline-spinner"></mat-spinner>
      </button>
    </div>

    <!-- Footer -->
    <div class="signup-footer">
      <p class="login-link">
        Already have an account? 
        <a routerLink="/login" class="link-primary">Sign In</a>
      </p>
    </div>

  </div>

</div>
```

---

## 🎨 Cambios Necesarios - CSS

```css
/* ========================================
   SIGNUP COMPONENT - MULTI-SECTION FORM
   ======================================== */

.signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-page) 0%, #F0F4F8 100%);
  padding: var(--spacing-lg);
  position: relative;
}

.signup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  pointer-events: none;
  background: 
    radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(79, 195, 247, 0.1) 0%, transparent 50%);
}

.signup-card {
  background: var(--color-bg-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-2xl);
  z-index: 10;
  animation: slideUp 500ms ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.signup-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.signup-title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-headline);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.signup-subtitle {
  margin: 0;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

/* Tabs */
.signup-tabs {
  margin: var(--spacing-lg) 0;
}

.signup-tabs ::ng-deep .mat-mdc-tab-labels {
  border-bottom: 1px solid var(--color-divider);
}

.signup-tabs ::ng-deep .mat-mdc-tab {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
}

.signup-tabs ::ng-deep .mat-mdc-tab-header-pagination {
  display: none; /* Hide pagination on small screens */
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
  min-height: 300px;
}

.full-width {
  width: 100%;
}

/* Password Strength */
.password-strength {
  margin: var(--spacing-md) 0;
}

.strength-bar {
  height: 4px;
  background: var(--color-divider);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.strength-fill {
  height: 100%;
  transition: width var(--transition-normal), background-color var(--transition-normal);
}

.strength-weak {
  background-color: var(--color-danger);
  width: 33%;
}

.strength-medium {
  background-color: var(--color-warning);
  width: 66%;
}

.strength-strong {
  background-color: var(--color-success);
  width: 100%;
}

.strength-text {
  margin: 0;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.strength-text.strength-weak {
  color: var(--color-danger);
}

.strength-text.strength-medium {
  color: var(--color-warning);
}

.strength-text.strength-strong {
  color: var(--color-success);
}

/* Checkbox Groups */
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
}

.agreement-checkbox {
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.agreement-checkbox ::ng-deep .mat-mdc-checkbox-label {
  word-break: break-word;
}

.agreement-checkbox a.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.agreement-checkbox a.link:hover {
  text-decoration: underline;
  color: var(--color-primary-dark);
}

.checkbox-error {
  font-size: var(--font-size-caption);
  color: var(--color-danger);
  margin-top: var(--spacing-sm);
  display: block;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius-sm);
  color: var(--color-danger);
  font-size: var(--font-size-small);
  margin: var(--spacing-lg) 0;
  animation: slideIn 300ms ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.error-alert mat-icon {
  flex-shrink: 0;
  font-size: 20px;
  width: 20px;
  height: 20px;
}

/* Action Buttons */
.signup-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.back-button {
  flex: 1;
  border-color: var(--color-divider);
  color: var(--color-text-primary);
  transition: all var(--transition-normal);
}

.back-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(25, 118, 210, 0.05);
}

.submit-button {
  flex: 2;
  height: 44px;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.5px;
  transition: all var(--transition-normal);
}

.submit-button:not([disabled]):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.inline-spinner {
  margin: 0 var(--spacing-sm);
}

/* Footer */
.signup-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
}

.login-link {
  margin: 0;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

.login-link a.link-primary {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.login-link a.link-primary:hover {
  text-decoration: underline;
  color: var(--color-primary-dark);
}

/* Responsive */
@media (max-width: 600px) {
  .signup-container {
    padding: var(--spacing-md);
  }

  .signup-card {
    max-width: 100%;
    padding: var(--spacing-lg);
  }

  .signup-title {
    font-size: var(--font-size-title);
  }

  .tab-content {
    min-height: 250px;
    padding: var(--spacing-md) 0;
  }

  .signup-actions {
    flex-direction: column;
  }

  .submit-button,
  .back-button {
    flex: 1;
    height: 40px;
  }

  .signup-tabs ::ng-deep .mat-mdc-tab-header-pagination {
    display: flex; /* Show pagination on mobile */
  }
}

@media (max-width: 768px) {
  .signup-card {
    max-width: 450px;
  }
}
```

---

## 🔧 Cambios Necesarios - TypeScript

### Estructura TypeScript Recomendada

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthState } from '../../../store/reducers/auth.reducer';
import { selectAuthError, selectIsLoading } from '../../../store/selectors/auth.selectors';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error$: Observable<string | null>;
  isLoading$: Observable<boolean>;
  clinics$: Observable<any[]>;
  showPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthPercent = 0;
  passwordStrengthText = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.createForm();
    this.error$ = this.store.select(selectAuthError);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit(): void {
    // Cargar clínicas (opcional, usar service)
    // this.clinics$ = this.clinicService.getClinics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Personal
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+\d\s\-()]*$/)]],
      
      // Professional
      licenseNumber: ['', Validators.required],
      specialty: ['', Validators.required],
      clinicId: [null],
      
      // Account
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      
      // Agreements
      acceptTerms: [false, Validators.required],
      acceptDataProcessing: [false, Validators.required],
      acceptMarketing: [false]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  updatePasswordStrength(): void {
    const password = this.form.get('password')?.value || '';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength <= 1) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = 33;
      this.passwordStrengthText = 'Weak';
    } else if (strength <= 2) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = 66;
      this.passwordStrengthText = 'Medium';
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = 100;
      this.passwordStrengthText = 'Strong';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { firstName, lastName, email, phone, licenseNumber, specialty, clinicId, password, acceptTerms, acceptDataProcessing } = this.form.value;
    
    // Llamar auth service para signup
    this.authService.signup({
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      specialty,
      clinicId,
      password,
      acceptTerms,
      acceptDataProcessing
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        // El auth.guard redirigirá automáticamente después del login
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Signup error:', error);
      }
    });
  }
}
```

---

## ✅ Checklist de Implementación

### Paso 1: Preparación
- [ ] Abre `signup.component.html`
- [ ] Abre `signup.component.css`
- [ ] Abre `signup.component.ts`
- [ ] Abre `auth.service.ts` para agregar método `signup()`

### Paso 2: HTML - Estructura Multi-Tab
- [ ] Copia estructura HTML con mat-tab-group
- [ ] Verifica mat-tab-group importado
- [ ] Verifica mat-checkbox importado
- [ ] Verifica MatTabsModule en imports

### Paso 3: CSS - Styling Completo
- [ ] Copia CSS de signup
- [ ] Verifica NO colores hardcoded
- [ ] Verifica CSS variables para colores/spacing
- [ ] Verifica responsive breakpoints

### Paso 4: TypeScript - Lógica de Form
- [ ] Agrega FormBuilder inyectado
- [ ] Crea método `createForm()` con validators
- [ ] Agrega `passwordMatchValidator`
- [ ] Agrega método `updatePasswordStrength()`
- [ ] Agrega método `togglePassword()`

### Paso 5: TypeScript - Auth Service
- [ ] Verifica que `AuthService` tenga método `signup()`
- [ ] El signup() debería llamar `POST /api/Auth/signup`
- [ ] Debería retornar Observable con token y userId
- [ ] El componente debería navegar a '' después del signup

### Paso 6: Testing Visual
- [ ] Abre `localhost:4200/signup`
- [ ] Verifica colores consistentes con Design System
- [ ] Verifica tabs funcionales y cambian contenido
- [ ] Verifica password strength indicator cambia
- [ ] Verifica password toggle show/hide funciona
- [ ] Verifica botones tienen hover effects

### Paso 7: Testing Responsivo
- [ ] Mobile (375px) - tabs stacked, botones full width
- [ ] Tablet (768px) - spacing correcto
- [ ] Desktop (1920px) - card max-width 500px

### Paso 8: Testing Validación
- [ ] Email vacío → muestra "Email is required"
- [ ] Email inválido → muestra "Invalid email format"
- [ ] Password < 8 caracteres → muestra error
- [ ] Passwords no coinciden → muestra "Passwords do not match"
- [ ] acceptTerms no marcado → botón deshabilitado
- [ ] Todos campos validos → botón habilitado

### Paso 9: Testing Funcionalidad
- [ ] Click password toggle → cambia entre texto y •••••
- [ ] Escribir password → strength indicator actualiza
- [ ] Click "Create Account" → loading spinner muestra
- [ ] Credenciales válidas → navega a home
- [ ] Credenciales inválidas → muestra error alert

### Paso 10: Testing Accesibilidad
- [ ] Presiona TAB → navega por todos los inputs
- [ ] Focus visible en todos elementos
- [ ] Screen reader lee labels correctamente
- [ ] Color contrast 4.5:1+

### Paso 11: Comparar con Login
- [ ] ¿Colores iguales?
- [ ] ¿Tipografía consistente?
- [ ] ¿Animaciones similares?
- [ ] ¿Hover effects iguales?

### Paso 12: Final Check
- [ ] Sin console errors
- [ ] Sin console warnings
- [ ] Build sin errores
- [ ] Se ve profesional y moderno

---

## 📚 Documentación de Referencia

- **CSS Variables**: `QUICK_REFERENCE.md` → Color Palette & Spacing
- **Estructura**: `login.component.html` (base similar)
- **Estilos**: `login.component.css` (adaptar para multi-tab)
- **Formularios**: `IMPLEMENTATION_STANDARDS.md` → Forms section
- **Accesibilidad**: `DESIGN_SYSTEM.md` → Section 9

---

## 🎯 Criterios de Éxito

✅ **Visual**
- Consistente con Design System
- Colores usando variables
- Tabs funcionales
- Password strength visible

✅ **Funcional**
- Form valida correctamente
- Password match validator funciona
- Signup API llamada correctamente
- Redirecciona a home tras éxito

✅ **Responsivo**
- Mobile 375px: perfecto
- Tablet 768px: bien
- Desktop 1920px: bien

✅ **Accesible**
- Keyboard navigation completa
- Focus visible
- Color contrast OK
- Screen reader friendly

---

## ⏱️ Timeline Sugerido

- **5 min**: Preparación
- **20 min**: HTML (multi-tab)
- **20 min**: CSS (styling)
- **15 min**: TypeScript (form + validation)
- **10 min**: Auth Service (si es necesario)
- **20 min**: Testing visual
- **15 min**: Testing responsivo/funcional
- **10 min**: Testing accesibilidad
- **5 min**: Final checks

**Total**: ~120 minutos = 2 horas

---

**¡Listo para empezar! 🚀**

Después de Signup, continúa con History Form Modal (siguiente de Phase 1).
