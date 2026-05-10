# Material Icons - Setup & Troubleshooting

## 🔧 Problema Resuelto

Los iconos no aparecían (solo mostraban el nombre del icono como texto) porque faltaba la fuente de Material Icons.

## ✅ Solución Implementada

### 1. Agregar Material Icons Font a `src/index.html`

```html
<!-- En la sección <head> -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### 2. Agregar CSS de Configuración a `src/styles.css`

```css
.mat-icon {
  font-family: 'Material Icons' !important;
  font-weight: normal;
  font-style: normal;
  font-size: inherit;
  display: inline-flex;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
```

## 📝 Cómo Usar Iconos en Templates

### Sintaxis Básica
```html
<mat-icon>icon_name</mat-icon>
```

### Iconos Comunes en la App
```html
<!-- Navegación -->
<mat-icon>home</mat-icon>
<mat-icon>person</mat-icon>
<mat-icon>arrow_back</mat-icon>

<!-- Acciones -->
<mat-icon>add</mat-icon>
<mat-icon>edit</mat-icon>
<mat-icon>delete</mat-icon>
<mat-icon>save</mat-icon>

<!-- Información -->
<mat-icon>info</mat-icon>
<mat-icon>warning</mat-icon>
<mat-icon>error</mat-icon>
<mat-icon>success</mat-icon>

<!-- Médico -->
<mat-icon>local_hospital</mat-icon>
<mat-icon>medical_services</mat-icon>
<mat-icon>healing</mat-icon>
<mat-icon>medication</mat-icon>

<!-- Datos Personales -->
<mat-icon>account_circle</mat-icon>
<mat-icon>email</mat-icon>
<mat-icon>phone</mat-icon>
<mat-icon>calendar_today</mat-icon>
<mat-icon>location_on</mat-icon>

<!-- Contenido -->
<mat-icon>description</mat-icon>
<mat-icon>attachment</mat-icon>
<mat-icon>print</mat-icon>
<mat-icon>download</mat-icon>

<!-- Otros -->
<mat-icon>search</mat-icon>
<mat-icon>more_vert</mat-icon>
<mat-icon>close</mat-icon>
<mat-icon>check</mat-icon>
```

## 🎨 Cómo Colorear Iconos

### En Template
```html
<!-- Usar clase color -->
<mat-icon color="primary">home</mat-icon>
<mat-icon color="accent">warning</mat-icon>
<mat-icon color="warn">error</mat-icon>

<!-- O usar CSS variable -->
<mat-icon class="text-primary">home</mat-icon>
<mat-icon class="text-danger">warning</mat-icon>
```

### En CSS
```css
.my-icon {
  color: var(--color-primary);
}

.my-icon-danger {
  color: var(--color-danger);
}
```

## 📏 Tamaños de Iconos

### Por defecto
El tamaño del icono heredará del `font-size` del contenedor.

### En Template
```html
<!-- Pequeño -->
<mat-icon class="icon-small">home</mat-icon>
<!-- Medio (normal) -->
<mat-icon>home</mat-icon>
<!-- Grande -->
<mat-icon class="icon-large">home</mat-icon>
```

### CSS
```css
.icon-small {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.icon-large {
  font-size: 48px;
  width: 48px;
  height: 48px;
}
```

## 🔍 Encontrar Más Iconos

Visita la [Material Icons Library](https://fonts.google.com/icons) para:
- Ver todos los iconos disponibles (900+)
- Buscar por nombre
- Ver ejemplos
- Copiar el nombre exacto

## ✔️ Verificación

Si los iconos aún no aparecen:

1. ✅ Verifica que `index.html` tiene:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

2. ✅ Verifica que `styles.css` tiene el CSS de `.mat-icon`

3. ✅ En DevTools (F12), abre Console y verifica:
   - No hay errores de fuente faltante
   - La fuente "Material Icons" está cargada

4. ✅ Limpia la caché del navegador:
   - `Ctrl+Shift+Delete` en Chrome
   - O recarga con `Ctrl+F5`

5. ✅ Reconstruye la app:
```bash
npm run start
```

## 🚀 Dos Fuentes Disponibles

### Material Icons (Recomendado)
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
- Estilo: Redondeado
- Iconos: 900+
- Usado en la app

### Material Symbols Outlined (Alternativa)
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```
- Estilo: Más delgado/outline
- Iconos: 3000+
- Mejor para iconos específicos

## 📦 Estado Actual de la App

✅ Material Icons correctamente configurado en:
- `src/index.html` - Fuente importada
- `src/styles.css` - CSS de configuración
- `patient-detail.component.html` - Usando iconos correctamente
- `angular-material.module.ts` - MatIconModule importado

Los iconos ahora deberían aparecer correctamente en la aplicación.
