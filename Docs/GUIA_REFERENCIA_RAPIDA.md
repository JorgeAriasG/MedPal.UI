# 📑 GUÍA DE REFERENCIA RÁPIDA

**Uso:** Consulta rápida sobre roles, permisos y documentación  
**Actualización:** 12 de Enero, 2026

---

## 🎭 ROLES Y SUS CAPACIDADES

### Tabla Completa de Roles

| Rol | Scope | Usuarios | Pacientes | Citas | Records | Auditoría | Uso |
|-----|:-----:|:--------:|:---------:|:-----:|:-------:|:---------:|-----|
| **SuperAdmin** | Global | ✅ | ⚠️ | ⚠️ | ❌ | ✅ | Admin del sistema |
| **AccountAdmin** | Account | ✅ | ✅ | ✅ | ❌ | ✅ | Director de red |
| **ClinicAdmin** | Clinic | ✅ | ✅ | ✅ | ❌ | ✅ | Director de clínica |
| **Doctor** | Clinic | ❌ | ✅ | ✅ | ✅ | ❌ | Médico |
| **HealthProf** | Clinic | ❌ | ✅ | ✅ | ⚠️ | ❌ | Enfermera/Psic |
| **Receptionist** | Clinic | ❌ | ✅ | ✅ | ❌ | ❌ | Recepcionista |
| **Patient** | Own | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ | Paciente |

**Leyenda:** ✅ = Total | ⚠️ = Limitado | ❌ = Ninguno

---

## 🔐 CATEGORÍAS DE PERMISOS

### Por Recurso (Resource.Action)

#### 👥 USUARIOS (Users)
```
Users.ViewAll       - Ver todos los usuarios
Users.ViewOwn       - Ver solo el usuario actual
Users.Create        - Crear nuevos usuarios
Users.Update        - Editar usuarios existentes
Users.Delete        - Eliminar usuarios
Users.Manage        - Gestión completa
```

#### 🏥 PACIENTES (Patients)
```
Patients.ViewAll    - Ver todos los pacientes
Patients.ViewOwn    - Ver solo los pacientes propios
Patients.Create     - Crear nuevos pacientes
Patients.Update     - Editar pacientes
Patients.Delete     - Eliminar pacientes
```

#### 📋 CITAS (Appointments)
```
Appointments.ViewAll   - Ver todas las citas
Appointments.ViewOwn   - Ver solo mis citas
Appointments.Create    - Crear citas
Appointments.Update    - Editar citas
Appointments.Cancel    - Cancelar citas
```

#### 📄 REGISTROS MÉDICOS (MedicalRecords)
```
MedicalRecords.ViewAll       - Ver todos (SuperAdmin)
MedicalRecords.ViewOwn       - Ver propios (Pacientes)
MedicalRecords.ViewAssigned  - Ver asignados (Médicos)
MedicalRecords.Create        - Crear registros
MedicalRecords.Update        - Editar registros
```

#### 💊 PRESCRIPCIONES (Prescriptions)
```
Prescriptions.Create   - Crear prescripciones
Prescriptions.View     - Ver prescripciones
Prescriptions.Update   - Actualizar prescripciones
```

#### 🏢 CLÍNICAS (Clinics)
```
Clinics.View           - Ver clínicas
Clinics.Manage         - Gestionar clínicas
```

#### 👔 ROLES (Roles)
```
Roles.View             - Ver roles
Roles.Assign           - Asignar roles a usuarios
Roles.Revoke           - Revocar roles
Roles.ViewAudit        - Ver auditoría de roles
```

#### 💰 FACTURACIÓN (Billing)
```
Billing.View           - Ver facturación
Billing.Manage         - Gestionar facturación
```

#### 📊 REPORTES (Reports)
```
Reports.Generate       - Generar reportes
Reports.View           - Ver reportes
```

---

## 📊 MATRIZ DE PERMISOS POR ROL

### SuperAdmin (Todos excepto MedicalRecords)
```
✅ Users.* (todas)
✅ Patients.* (todas)
✅ Appointments.* (todas)
❌ MedicalRecords.* (para seguridad)
✅ Prescriptions.* (todas)
✅ Clinics.* (todas)
✅ Roles.* (todas)
✅ Billing.* (todas)
✅ Reports.* (todas)
```

### AccountAdmin (Todos dentro su Account)
```
✅ Users.* (su account)
✅ Patients.* (su account)
✅ Appointments.* (su account)
❌ MedicalRecords.* (para seguridad)
✅ Prescriptions.* (su account)
✅ Clinics.* (su account)
✅ Roles.* (su account)
✅ Billing.* (su account)
✅ Reports.* (su account)
```

### ClinicAdmin (Todos dentro su Clinic)
```
✅ Users.* (su clínica)
✅ Patients.* (su clínica)
✅ Appointments.* (su clínica)
❌ MedicalRecords.* (para seguridad)
✅ Prescriptions.* (su clínica)
✅ Clinics.View (su clínica)
✅ Roles.* (su clínica)
✅ Billing.* (su clínica)
✅ Reports.* (su clínica)
```

### Doctor (Solo clínicos)
```
❌ Users.*
✅ Patients.ViewAll, Patients.Update
✅ Appointments.*
✅ MedicalRecords.ViewAssigned, Create, Update
✅ Prescriptions.*
✅ Clinics.View
❌ Roles.*
✅ Billing.View
❌ Reports.Generate (pero sí Reports.View)
```

### Patient (Solo propio)
```
❌ Users.*
✅ Patients.ViewOwn
✅ Appointments.ViewOwn, Create
✅ MedicalRecords.ViewOwn
❌ Prescriptions.Create (pero sí View)
❌ Clinics.*
❌ Roles.*
✅ Billing.View
❌ Reports.Generate
```

---

## 📍 POLÍTICAS DE AUTORIZACIÓN

### 8 Políticas Implementadas

| Policy | SuperAdmin | AccountAdmin | ClinicAdmin | Doctor | Patient |
|--------|:----------:|:------------:|:-----------:|:------:|:-------:|
| ViewUsersPolicy | ✅ | ✅ | ✅ | ❌ | ❌ |
| ViewPatientsPolicy | ✅ | ✅ | ✅ | ✅ | ❌ |
| ViewAppointmentsPolicy | ✅ | ✅ | ✅ | ✅ | ✅ |
| ManageUsersPolicy | ✅ | ✅ | ✅ | ❌ | ❌ |
| ManagePatientsPolicy | ✅ | ✅ | ✅ | ✅ | ❌ |
| ViewAuditLogPolicy | ✅ | ✅ | ❌ | ❌ | ❌ |
| AdministerAccountPolicy | ✅ | ✅ | ❌ | ❌ | ❌ |
| AdministerClinicPolicy | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 🗂️ ESTRUCTURA DE MULTI-TENANCY

```
┌─────────────────────────────────────┐
│         SISTEMA (Global)            │
└────────┬────────────────────────────┘
         │
         ├─ SuperAdmin (acceso total)
         │
         ├─ Account 1 (Organización)
         │  │
         │  ├─ Clinic 1
         │  │  ├─ Users: [Doctor, Receptionist]
         │  │  └─ Patients: [Juan, María]
         │  │
         │  └─ Clinic 2
         │     ├─ Users: [Doctor, Nurse]
         │     └─ Patients: [Carlos, Ana]
         │
         └─ Account 2 (Organización)
            │
            └─ Clinic 3
               ├─ Users: [ClinicAdmin]
               └─ Patients: [Pedro]
```

### Aislamiento Automático

```
Doctor en Clinic 1
  → Ve solo pacientes de Clinic 1
  → NO ve Clinic 2 ni Account 2

ClinicAdmin en Clinic 1
  → Ve solo usuarios de Clinic 1
  → NO ve Clinic 2 ni Account 2

AccountAdmin en Account 1
  → Ve todo de Account 1 (Clinic 1 + 2)
  → NO ve Account 2

SuperAdmin
  → Ve metadata de todo (excepto Medical Records)
  → NO ve detalles sensibles
```

---

## 📚 DOCUMENTACIÓN ÍNDICE

### Busca por Necesidad

| Necesidad | Documento | Tiempo |
|-----------|-----------|--------|
| Qué cambió | RESUMEN_EJECUTIVO_FRONTEND.md | 3 min |
| Cómo funciona | ARQUITECTURA_ROLES_POLITICAS.md | 15 min |
| Código para copiar | GUIA_ACTUALIZACION_FRONTEND.md | 30 min |
| Entender backend | DETALLES_TECNICOS_BACKEND.md | 20 min |
| Navegar todo | INDICE_DOCUMENTACION.md | 5 min |
| Resumen final | RESUMEN_FINAL.md | 5 min |
| Esta guía | GUIA_REFERENCIA_RAPIDA.md | 5 min |

---

## 🚀 IMPLEMENTACIÓN CHECKLIST

### Frontend (2-4 horas)

#### AuthService (20 min)
- [ ] Guardar role del login
- [ ] Guardar permissions del login
- [ ] getRole() método
- [ ] hasPermission() método
- [ ] Métodos de rol específicos

#### Guards (15 min)
- [ ] roleGuard() implementado
- [ ] permissionGuard() implementado
- [ ] Guards agregados a rutas

#### Rutas (15 min)
- [ ] canActivate agregado
- [ ] Roles especificados
- [ ] Ruta /unauthorized creada

#### Componentes (30 min)
- [ ] *ngIf para botones
- [ ] Navbar dinámico
- [ ] Listas actualizadas
- [ ] Servicios actualizados

#### Directivas (20 min)
- [ ] *appHasPermission
- [ ] *appHasRole

#### Testing (30 min)
- [ ] Login test
- [ ] Rutas test
- [ ] Permisos test

---

## 🧪 TESTING RÁPIDO

### Test 1: Login
```bash
POST /api/user/login
{"email":"doctor@clinic.com","password":"pass"}
→ Verificar response: role, permissions
```

### Test 2: JWT
```bash
1. Copiar token de response
2. Ir a https://jwt.io
3. Pegar token
4. Verificar payload: role, permissions, account_id
```

### Test 3: Rutas (Frontend)
```bash
1. Login como Doctor
2. Ir a /admin (debe redirigir)
3. Ir a /patients (debe funcionar)
4. Verificar botón crear solo si role lo permite
```

### Test 4: Backend
```bash
1. Doctor intenta crear paciente (✅ 201)
2. Patient intenta crear paciente (❌ 403)
3. Verificar que ClinicAdmin solo ve su clínica
```

---

## 📋 RESPUESTAS RÁPIDAS

### P: ¿Cómo sé qué permiso necesito?
**R:** Busca en esta guía → Categorías de Permisos

### P: ¿Doctor puede ver Medical Records?
**R:** Sí, MedicalRecords.ViewAssigned

### P: ¿Patient puede crear citas?
**R:** Sí, Appointments.Create

### P: ¿ClinicAdmin puede ver otra clínica?
**R:** No, query filter automático

### P: ¿SuperAdmin ve Medical Records?
**R:** No, para seguridad (NOM-004)

### P: ¿Cuántos roles hay?
**R:** 7 roles totales (3 admin + 4 clínicos/patient)

### P: ¿Cuántos permisos hay?
**R:** 40+ permisos granulares

### P: ¿Cuántas políticas hay?
**R:** 8 políticas de autorización

### P: ¿Se puede crear rol personalizado?
**R:** Sí, en la BD (tabla Roles)

### P: ¿Se puede dar permiso temporal?
**R:** Sí, campo ExpiresAt en UserRole

---

## 🔗 RELACIONES RÁPIDAS

### JWT Claims → Frontend
```
nameid                → UserId (para identificar)
email                 → Email del usuario
role                  → Nombre del rol (para guards)
account_id            → Para verificar scope
clinic_id             → Para verificar scope
permissions           → Array de acciones permitidas
```

### Frontend → Backend
```
Authorization: Bearer <token>
    ↓
Backend extrae claims
    ↓
Verifica policy
    ↓
Aplica query filters
    ↓
Retorna datos seguros
```

---

## ⏱️ TIMELINE

```
HOY:
  ✅ 09:00 - Backend completado
  ✅ 10:00 - Documentación creada (6 archivos)
  ✅ 11:00 - Equipo notificado

PRÓXIMO (2-4 HORAS):
  ⏳ Frontend: Implementar cambios
  ⏳ Testing: Verificar funcionalidad

LUEGO (2-3 HORAS):
  ⏳ Merge a rama principal
  ⏳ Deploy a staging

FINALMENTE:
  ⏳ Testing con usuarios reales
  ⏳ Deploy a producción
```

---

## 💡 TIPS

1. **Abre 2 tabs:** Esta guía + GUIA_ACTUALIZACION_FRONTEND.md
2. **Copia/Pega:** Todo el código está listo en la guía
3. **Testing primero:** Prueba login antes de cambiar rutas
4. **Debuggea en jwt.io:** Para ver qué claims tiene el token
5. **localStorage inspection:** F12 → Application → localStorage

---

## 🎯 RESUMEN EN 3 FRASES

1. Backend devuelve `role` y `permissions` en el login
2. Frontend guarda estos en localStorage y los usa
3. Frontend protege rutas con guards y botones con *ngIf

**¿Listo?** → GUIA_ACTUALIZACION_FRONTEND.md

---

**Última actualización:** 12/01/2026  
**Versión:** 1.0  
**Status:** ✅ COMPLETO PARA REFERENCIA
