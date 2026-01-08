# Componente de Gestión de Roles

## Descripción
Componente completo para gestionar roles de usuarios dentro del sistema de clinics. Sigue la estructura del proyecto y está integrado con los servicios, formularios y modales existentes.

## Estructura de Archivos

```
src/app/components/user/roles/
├── services/
│   ├── roles.service.ts
│   └── roles.service.spec.ts
├── roles-list/
│   ├── roles-list.component.ts
│   ├── roles-list.component.html
│   ├── roles-list.component.css
│   └── roles-list.component.spec.ts
├── new-role/
│   ├── new-role.component.ts
│   ├── new-role.component.html
│   ├── new-role.component.css
│   └── new-role.component.spec.ts
```

## Archivos Relacionados

### Entidades
- `src/app/entities/IRole.ts` - Interfaz de datos para rol

### Configuración
- `src/app/conf/form-config.ts` - Configuración de formularios (se agregó `roleFormConfig`)

### Módulos
- `src/app/components/home/home.module.ts` - Módulo que declara los componentes

### Rutas
- Route registrada: `/roles/list`

## Características

### RolesListComponent (`roles-list`)
- **Funcionalidad:**
  - Listar todos los roles de una clínica
  - Crear nuevo rol
  - Editar rol existente
  - Eliminar rol
  
- **Propiedades:**
  - `roles: IRole[]` - Lista de roles
  - `clinicId: number` - ID de la clínica (obtenido del store)
  - `displayedColumns: string[]` - Columnas mostradas en la tabla

- **Métodos principales:**
  - `getRoles()` - Obtiene los roles de la clínica actual
  - `editRole(role)` - Abre modal de edición
  - `deleteRole(id)` - Elimina un rol
  - `onRoleAdded()` - Refresca la lista cuando se crea un rol

### NewRoleComponent (`new-role`)
- **Funcionalidad:**
  - Formulario reactivo para crear nuevos roles
  - Validación de campos requeridos
  - Notificación al componente padre cuando se crea el rol

- **Campos del formulario:**
  - `name` - Nombre del rol (requerido)
  - `description` - Descripción del rol (requerido)

- **Métodos principales:**
  - `onSubmit()` - Envía el formulario y crea el rol
  - `onCancel()` - Limpia el formulario

### RolesService
- **Métodos disponibles:**
  - `getRoles(clinicId?)` - GET `/roles`
  - `getRoleById(id)` - GET `/roles/:id`
  - `createRole(role)` - POST `/roles`
  - `updateRole(role)` - PUT `/roles/:id`
  - `editRole(role)` - Alias para updateRole
  - `deleteRole(id)` - DELETE `/roles/:id`

## Integración

### Con el EditModalComponent
El componente usa el modal de edición genérico pasando:
```typescript
{
  entityType: 'role',
  data: role,
  title: 'Edit Role'
}
```

La configuración automáticamente renderiza los campos basados en `roleFormConfig`.

### Con el Store (NgRx)
Obtiene el `clinicId` del estado de Redux:
```typescript
this.store.select(selectClinicId)
```

### Con el Servicio de API
Todas las operaciones CRUD van a través de `RolesService` que extiende `ApiService`.

## Cómo Usar

### Acceder al componente
Navega a `/roles/list` en la aplicación.

### Crear un rol
1. Haz clic en "Add Role"
2. Completa los campos (nombre y descripción)
3. Haz clic en "Create Role"

### Editar un rol
1. Haz clic en "Edit" en la fila del rol
2. El modal se abre con los datos del rol
3. Realiza los cambios
4. Haz clic en "Save"

### Eliminar un rol
1. Haz clic en "Delete" en la fila del rol
2. El rol se eliminará inmediatamente

## Dependencias

- **Angular Material** - Componentes de UI (tabla, botones, diálogos)
- **RxJS** - Manejo reactivo de datos
- **NgRx** - Gestión de estado (para obtener clinicId)
- **Reactive Forms** - Manejo de formularios en NewRoleComponent
- **ApiService** - Servicio base para llamadas HTTP

## Extensiones Futuras

Posibles mejoras:
- Agregar campo `permissions` para seleccionar permisos específicos
- Agregar confirmación de eliminación
- Agregar paginación si la lista es muy grande
- Agregar búsqueda/filtrado de roles
- Agregar mensajes de confirmación (snackbar)
- Crear un componente para gestionar permisos por rol

## Notas de Desarrollo

- El servicio está providido en 'root', por lo que está disponible en toda la aplicación
- Los componentes están declarados en `HomeModule`, no requieren módulo separado
- La gestión de state de clinicId viene del store de auth
- Los formularios siguen el patrón de configuración centralizada en `form-config.ts`
