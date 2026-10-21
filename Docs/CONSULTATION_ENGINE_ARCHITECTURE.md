# Consultation Engine — Arquitectura Unificada

## Estado actual (verificado)

- `consultation.component.ts` renderiza el template de especialidad según `SPECIALTY_CONFIG` (dental | nutrition | soap | generic).
- `completeConsultation()` → `POST /appointments/{id}/complete` con body vacío `{}`. La `specialtyData` (odontograma, notas) **nunca se persiste**; solo vive en `localStorage` como borrador (`consultation_draft_{id}`).
- El backend **ya soporta** persistencia: `POST /api/medicalhistory` (`MedicalHistoryController`) con `SpecialtyData` (JSON), `Diagnosis`, `DiagnosisDate`, `ClinicalNotes`, `FollowUpDate`, `Cie10Codes`, `IsConfidential`.
- `history-form.component.ts` (dialog del paciente) ya POSTea a `/medicalhistory` usando los mismos templates de especialidad. Son **dos flujos paralelos desconectados**.
- Nutrición es una isla: `nutrition-consultation-workspace` (no es ControlValueAccessor, recibe inputs) + `nutrition-summary`, con persistencia propia (`NutritionController`, `AnthropometryRecord`, `DietPlan`, `NutritionProgress`).
- **No existe** infraestructura de imágenes/adjuntos (ni modelo, ni controller, ni storage, ni upload en la UI).

## Redundancias detectadas

| Dato | Dónde se duplica |
|------|------------------|
| Peso / Altura / IMC | Sidebar consulta (`patient.weight/height`), workspace nutrición (`peso/altura→imc`), `specialtyData` nutrición en historial |
| Notas de texto libre | `clinicalNotes` (historial) vs `dental.observations` vs 4 campos SOAP vs `generic.customData` |
| Diagnóstico | Campo `diagnosis` en historial; CIE-10 solo en consulta para especialidades SOAP; dental/nutrición sin diagnóstico |
| Signos vitales | Backend tiene `VitalSignController` + `clinical-data.service`; el workspace de consulta no los usa |

## Arquitectura objetivo

Regla del diseño: **si una feature no es exclusiva de una especialidad, se extrae como componente reutilizable.**

### Componentes compartidos (módulo `consultation-engine`)

| Componente | Responsabilidad | Reemplaza |
|------------|-----------------|-----------|
| `clinical-notes` | Nota clínica de texto libre (un solo origen) | `clinicalNotes` libre duplicado |
| `clinical-attachments` | Carga multi-archivo (radiografías/fotos/docs) + galería + borrado | — (nuevo) |
| `image-viewer` | Lightbox con zoom/rotación | — (nuevo) |
| `diagnoses` | Diagnóstico (texto) + códigos CIE-10 en chips | `cie10-search` (solo SOAP) |
| `treatments` | Lista de procedimientos/tratamientos | — (nuevo) |
| `alerts` | Alergias/antecedentes del paciente (`clinical-data.service.getAntecedents`) | — (nuevo) |
| `measurements` | Peso, altura, IMC + signos vitales (origen único) | Bloque "Datos Antropométricos" del sidebar + IMC de nutrición |
| `previous-consultations` | Timeline de historial del paciente (`getPatientHistory`) | Placeholder "Última Consulta" + `nutrition-summary` |

### Templates = orquestadores

- `dental-template`: **odontograma** (exclusivo dental) + clinical-notes + clinical-attachments (radiografías) + measurements + diagnoses + treatments.
- `nutrition-template` (reemplaza `nutrition-consultation-workspace`): measurements (IMC) + objetivo/restricciones/calorías (exclusivo) + compartidos.
- `soap-template`: S / O / A / P (metodología SOAP, exclusiva) + compartidos.
- `generic-template`: compartidos.

### Persistencia de la consulta

- `consultationData = { diagnosis, clinicalNotes, cie10Codes, treatments, specialtyData }`.
- "Completar Consulta" (flujo de 3 llamadas, robusto y sin acoplar el endpoint de complete):
  1. `POST /api/medicalhistory` → crea el registro (devuelve `id`).
  2. `POST /api/medicalhistory/{id}/attachments` (multipart) por cada archivo pendiente.
  3. `POST /api/appointments/{id}/complete` → marca la cita completa.
- Borrador (`localStorage`) se mantiene como respaldo.

## Fase 1 — Backend (adjuntos)

### Modelo `ClinicalAttachment`

| Columna | Tipo | Notas |
|---------|------|-------|
| Id | int | PK |
| MedicalHistoryId | int | FK → MedicalHistory |
| Type | string | radio \| photo \| doc |
| FileName | string | nombre original |
| StoragePath | string | ruta en disco |
| MimeType | string | content-type |
| Size | long | bytes |
| UploadedByUserId | int? | auditoría |
| CreatedAt | DateTime | auditoría |
| OwnerClinicId | int? | multi-tenancy |
| IsDeleted / DeletedAt / DeletedByUserId | — | soft delete |

### Endpoints (`MedicalHistoryAttachmentsController`)

- `GET    /api/medicalhistory/{id}/attachments` — listar adjuntos de un registro.
- `POST   /api/medicalhistory/{id}/attachments` — subir (IFormFile, multipart).
- `GET    /api/attachments/{id}/content` — stream del archivo (auth NOM-004).
- `DELETE /api/attachments/{id}` — borrado lógico.

### Storage (disco 16TB)

- `appsettings.json`: `Storage:AttachmentsPath` (ruta dentro del container, p.ej. `/data/medpal/attachments`).
- `docker-compose.backend.yml`: volumen/host mount hacia el disco de 16TB del servidor.
- Estructura de carpetas: `{AttachmentsPath}/{clinicId}/{patientDetailsId}/{medicalHistoryId}/{guid}{ext}`.

### Extra

- `MedicalHistory.Treatments` (string JSON, opcional) para tratamientos/procedimientos compartidos.

## Fase 2 — Frontend

1. Nuevo módulo `consultation-engine` con los componentes compartidos y sus servicios de adjuntos.
2. Refactor de templates a orquestadores (controlan `specialtyData`; los compartidos se enlazan vía inputs/outputs).
3. Refactor de `consultation.component`: sidebar simplificado, columna de referencias real, y flujo de persistencia.
4. Unificar nutrición: `nutrition-template` como CVA usado en consulta e historial.
5. Converger `history-form` a los mismos componentes compartidos.

## Fase 3 — Verificación

- `npm run build`, `npm test`, `dotnet build`.
- E2E local: login → crear cita → consulta → subir radiografía → completar → verificar registro en `medicalhistory` + archivo en disco.
- Deploy vía CI/CD y verificación en prod (upload real, path del 16TB).

## Decisiones por defecto

- **SOAP**: sus 4 campos son la nota clínica; `clinical-notes` no se muestra en SOAP; el `plan` se serializa en `ClinicalNotes` al persistir.
- **Mediciones**: v1 dentro de `specialtyData` del template; los signos vitales siguen en su tabla `VitalSign` existente.
- **Adjuntos**: se suben después de crear el MedicalHistory (3 llamadas secuenciales).
- El endpoint `POST /appointments/{id}/complete` **no cambia** (body vacío, como hoy).
