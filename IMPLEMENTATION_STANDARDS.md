# UI/UX Implementation Standards - Medical Scheduling App

## Executive Summary

Esta guía proporciona estándares de implementación escalables para mantener consistencia visual, funcional y de UX en toda la aplicación de scheduling médico. Todos los componentes deben seguir estos estándares para asegurar calidad, accesibilidad y experiencia de usuario superior.

---

## 1. Principios de Implementación

### 1.1 Design System First
- **Todos los colores** vienen de las variables CSS globales (`--color-*`)
- **Todo espaciado** usa el sistema de 4px (`--spacing-*`)
- **Todas las tipografías** usan variables definidas (`--font-size-*`, `--font-weight-*`)
- **Todas las sombras** vienen de variables (`--shadow-*`)

### 1.2 Mobile First
- Diseñar primero para mobile (576px)
- Responsive breakpoints: 576px (tablet), 768px, 992px (desktop), 1400px (wide)
- Usar `@media` queries para adaptaciones

### 1.3 Accesibilidad Obligatoria
- WCAG 2.1 AA es el mínimo requerido
- Contraste de color: 4.5:1 para texto normal
- Tamaño mínimo de targets: 44x44px (mobile), 32x32px (desktop)
- Navegación con teclado completa

### 1.4 Performance First
- `ChangeDetectionStrategy.OnPush` para componentes grandes
- `takeUntil` o `async` pipe para subscripciones
- Lazy loading de módulos por ruta
- Lazy loading de imágenes

---

## 2. Estructura CSS Global Implementada

### 2.1 Variables CSS Disponibles

Todos los estilos deben usar estas variables definidas en `src/styles.css`:

```css
/* Colores */
--color-primary: #1976D2
--color-success: #4CAF50
--color-warning: #FF9800
--color-danger: #F44336
--color-allergy: #FF5252
--color-bg-page: #F5F7FA
--color-bg-surface: #FFFFFF
--color-text-primary: #212121
--color-text-secondary: #757575

/* Espaciado (4px base) */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px  ← Use este para padding/margin normal
--spacing-lg: 24px  ← Use para separación entre secciones
--spacing-xl: 32px
--spacing-2xl: 48px

/* Tipografía */
--font-family: 'Roboto'
--font-size-body: 0.95rem (15px)
--font-size-small: 0.875rem (14px)
--font-weight-medium: 500
--line-height-normal: 1.5

/* Bordes y Sombras */
--border-radius-md: 8px
--shadow-md: 0 2px 8px rgba(0,0,0,0.1)
--shadow-lg: 0 4px 16px rgba(0,0,0,0.12)

/* Transiciones */
--transition-normal: 250ms ease-in-out
```

### 2.2 Clases Utilitarias Disponibles

```css
/* Spacing */
.p-md, .px-md, .py-md, .pt-md, .pb-md, .pl-md, .pr-md
.m-md, .mx-md, .my-md, .mt-md, .mb-md, .ml-md, .mr-md

/* Layout */
.flex-center, .flex-between, .flex-start
.d-flex, .align-items-center, .justify-content-between

/* Text */
.text-primary, .text-success, .text-danger
.text-muted, .text-small, .text-caption

/* Other */
.rounded, .shadow, .shadow-lg, .divider
.w-100, .h-100, .d-none
```

---

## 3. Implementación de Patrones Comunes

### 3.1 Card Component

**Uso correcto:**

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">
      <mat-icon>icon_name</mat-icon>
      Title
    </h3>
  </div>
  <div class="card-body">
    <!-- Content -->
  </div>
</div>
```

**CSS correspondiente:**

```css
.card {
  background: var(--color-bg-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-divider);
}

.card-body {
  padding: var(--spacing-lg);
}
```

### 3.2 Data Display Pattern

**Medical Data: Siempre en filas clave-valor**

```html
<div class="info-row">
  <span class="label">DOB</span>
  <span class="value">Jan 15, 1990</span>
</div>
```

**CSS:**

```css
.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-divider);
}

.label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
```

### 3.3 Alert/Status Pattern

**Alergia crítica:**

```html
<div class="allergy-banner">
  <div class="alert-icon">
    <mat-icon>warning</mat-icon>
  </div>
  <div class="alert-content">
    <h3>Known Allergies</h3>
    <mat-chip-set>
      <mat-chip class="allergy-chip" *ngFor="let a of allergies">
        {{ a }}
      </mat-chip>
    </mat-chip-set>
  </div>
</div>
```

**CSS:**

```css
.allergy-banner {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
  border: 2px solid var(--color-allergy);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-lg);
}

.allergy-chip {
  background-color: var(--color-allergy) !important;
  color: white !important;
}
```

---

## 4. Implementación por Componente

### 4.1 Patient Detail Component ✅ COMPLETADO

**Archivo**: `patient-detail.component.html`

**Características Implementadas:**
- ✅ Header section con información del paciente
- ✅ Allergy alert banner prominente
- ✅ Tabs: Overview, Medical History, Prescriptions
- ✅ Demographics card en Overview
- ✅ Quick stats card
- ✅ Prescription cards con acciones
- ✅ Empty states
- ✅ Loading y error states
- ✅ Responsive design
- ✅ Accesibilidad

### 4.2 Próximos Componentes a Refactorizar

#### Home Component
- [ ] Dashboard con widgets reutilizables
- [ ] Statistics cards pattern
- [ ] Calendar integration
- [ ] Recent activities timeline

#### Patients List Component
- [ ] Data table con pagination
- [ ] Filtros y búsqueda
- [ ] Row actions (view, edit, delete)
- [ ] Bulk actions

#### Medical History Timeline
- [ ] Timeline vertical
- [ ] Expandable entries
- [ ] Specialty icons
- [ ] Status indicators

#### Forms (Signup, Login, History Form)
- [ ] Form validation styling
- [ ] Error messaging
- [ ] Loading states
- [ ] Success confirmations

#### Prescriptions
- [ ] Prescription cards
- [ ] Print preview
- [ ] Refill actions
- [ ] Status tracking

---

## 5. Reglas de Implementación por Contexto

### 5.1 Datos Médicos Críticos

**Regla**: Siempre visible, nunca oculto, máximo contraste

```html
<!-- Correcto: Alergias al tope, visible inmediatamente -->
<div class="allergy-banner">
  <mat-chip class="allergy-chip">{{ allergy }}</mat-chip>
</div>

<!-- Incorrecto: En un collapse, oculto -->
<mat-expansion-panel>
  <mat-chip>{{ allergy }}</mat-chip>
</mat-expansion-panel>
```

### 5.2 Paciente Identificación

**Regla**: Siempre visible en cada página donde sea contexto relevante

```html
<!-- Header del paciente siempre presente -->
<div class="patient-header">
  <h1>{{ patient.name }}</h1>
  <p>{{ patient.email }} | {{ patient.phone }}</p>
</div>
```

### 5.3 Acciones Destructivas

**Regla**: Requiere confirmación, color rojo, claridad

```html
<button 
  mat-raised-button 
  color="warn"
  (click)="confirmDelete()"
>
  <mat-icon>delete</mat-icon>
  Delete Record
</button>

<!-- Confirmation Dialog -->
<h2 mat-dialog-title>Delete Record?</h2>
<mat-dialog-content>
  This action cannot be undone.
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="cancel()">Cancel</button>
  <button mat-raised-button color="warn" (click)="delete()">
    Delete
  </button>
</mat-dialog-actions>
```

### 5.4 Estados de Carga

**Regla**: Visible y no bloqueante (usar spinner inline)

```html
<!-- Correcto -->
<button [disabled]="isLoading">
  <span *ngIf="!isLoading">Save</span>
  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
</button>

<!-- Incorrecto: Sin feedback visual -->
<button [disabled]="isLoading">Save</button>
```

### 5.5 Validación de Formularios

**Regla**: Real-time feedback, messages claros

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput type="email" formControlName="email">
  <mat-error *ngIf="form.get('email')?.hasError('required')">
    Email is required
  </mat-error>
  <mat-error *ngIf="form.get('email')?.hasError('email')">
    Invalid email format
  </mat-error>
  <mat-hint>example@domain.com</mat-hint>
</mat-form-field>
```

---

## 6. Color Usage Guidelines

### 6.1 Especialidades Médicas

Colores asignados para mantener consistencia:

```typescript
const SPECIALTY_COLORS = {
  'Dental': '#7B1FA2',        // Purple
  'Nutrición': '#558B2F',     // Green
  'General': '#1976D2',       // Blue
  'Cardiología': '#F44336',   // Red
  'Pediatría': '#FF9800'      // Orange
};
```

### 6.2 Estados de Datos

```
Activo/Vigente:   --color-success (#4CAF50)
Pendiente:        --color-warning (#FF9800)
Vencido/Error:    --color-danger  (#F44336)
Información:      --color-info    (#2196F3)
Crítico/Alergias: --color-allergy (#FF5252)
```

---

## 7. Responsive Breakpoints Implementation

```css
/* Mobile First - Base styles for mobile */
.component { /* 320px and up */ }

/* Tablet and up */
@media (min-width: 576px) {
  .component { /* Adjustments for tablet */ }
}

/* Desktop and up */
@media (min-width: 992px) {
  .component { /* Adjustments for desktop */ }
}

/* Wide screens */
@media (min-width: 1400px) {
  .component { /* Adjustments for wide */ }
}
```

### Grid System Usage

```html
<!-- Automatically responsive -->
<div class="row">
  <div class="col-6">Half width on desktop, full on mobile</div>
  <div class="col-6">Half width on desktop, full on mobile</div>
</div>

<!-- Explicit responsive -->
<div class="overview-grid">
  <!-- Grid with minmax(400px, 1fr) - automatically responsive -->
</div>
```

---

## 8. Testing Checklist

Antes de considerar un componente "completado":

### Visual Testing
- [ ] Looks correct on mobile (375px)
- [ ] Looks correct on tablet (768px)
- [ ] Looks correct on desktop (1920px)
- [ ] All colors match design tokens
- [ ] All spacing uses variables
- [ ] Typography hierarchy clear

### Functional Testing
- [ ] All buttons clickable and respond
- [ ] Forms validate correctly
- [ ] Loading states appear
- [ ] Error states display messages
- [ ] Navigation works

### Accessibility Testing
- [ ] Tab navigation works logically
- [ ] Focus visible everywhere
- [ ] Color contrast meets 4.5:1
- [ ] Screen reader friendly
- [ ] No keyboard traps

### Performance Testing
- [ ] No console errors
- [ ] No memory leaks (test DevTools)
- [ ] Loading < 2 seconds
- [ ] Smooth animations (60fps)

---

## 9. Implementation Checklist for New Components

```markdown
## Component: [Name]
- [ ] Follows Design System colors (CSS vars)
- [ ] Follows spacing system (4px grid)
- [ ] Mobile responsive (tested at 375px, 768px, 1920px)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast 4.5:1+
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] No memory leaks (takeUntil/async pipe)
- [ ] ChangeDetectionStrategy.OnPush used
- [ ] All external icons have labels
- [ ] All form inputs have labels
- [ ] Tested with browser DevTools zoom (200%)
- [ ] No console errors or warnings
```

---

## 10. File Structure for Styling

### Global Styles (src/styles.css)
- CSS custom properties (design tokens)
- Base element styles (html, body, h1-h6, p, etc.)
- Utility classes (spacing, layout, text)
- Material overrides

### Component Styles (component.css)
- Component-specific styles only
- Use CSS variables from globals
- Scoped styles (no global impact)
- Mobile-first media queries

### Material Customization
- Imports in `angular-material.module.ts`
- Material theme customization in `styles.css` with overrides
- Custom Material component styling in component CSS

---

## 11. Maintenance & Evolution

### Updating Design Tokens

If colors/spacing need changes:

1. Update variable in `src/styles.css`
2. All components using `var(--color-*)` automatically update
3. No individual component changes needed

### Adding New Components

1. Copy pattern from existing component
2. Use only CSS variables for colors/spacing
3. Follow accessibility checklist
4. Test at all breakpoints
5. Update COMPONENT_LIBRARY.md if new pattern

### Performance Optimization Over Time

- Monitor bundle size with `ng build --stats-json`
- Use Angular DevTools to profile
- Review change detection strategies quarterly
- Keep dependencies up to date

---

## 12. References & Resources

- **Design Tokens**: See this file's section 2.1
- **Design System**: Read `DESIGN_SYSTEM.md`
- **Component Patterns**: Read `COMPONENT_LIBRARY.md`
- **Color Palette**: CSS variables in `src/styles.css`
- **Material Design**: https://m3.material.io
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 13. Support & Questions

For questions about implementation standards:
1. Check DESIGN_SYSTEM.md for theory
2. Check COMPONENT_LIBRARY.md for patterns
3. Check IMPLEMENTATION_STANDARDS.md (this file) for how-to
4. Review patient-detail component as reference
5. Check CSS variables in src/styles.css for available tokens
