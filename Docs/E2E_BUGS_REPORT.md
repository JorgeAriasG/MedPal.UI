# E2E Bugs Report

- **Date:** 2026-08-05
- **Scope:** E2E session — omnibar ghost-appointment flow
- **Role under test:** `HealthProfessional`
- **Test user:** `doctor.nutricion@medpal.com`

---

## Resolution status (2026-08-06)

Backend access-control hardening and cross-account support landed. Summary:

- **BUG-001** → **Resolved** (`PatientAccessRequirement` + `PatientAccessHandler`,
  see below).
- **FINDING-001** → **Resolved** (ghost patients now resolvable via clinic fallback;
  legacy ghosts stay visible to the clinic account even with no medical history).
- New authorization bugs found during hardening were fixed (see
  **BUG-004**, **BUG-005**).
- **Cross-account (portal)**: `PatientAccount` link table + migration
  `20260806031707_AddPatientAccountTable` applied to `MedPalDBDev` with backfill
  (56 memberships: 53 primary, 3 cross-account). Patients created via portal are no
  longer required to have `AccountId == NULL`.

### Smoke verification (release build, PID restarted)

| Probe | Result |
|-------|--------|
| `POST /api/user/login` as `doctor.nutricion@medpal.com` (HealthProfessional) | 200, token issued |
| `GET /api/patient/55` (BUG-001 repro) | **200** (was 403) |
| `GET /api/patient/51` (patient owned only by account 3, doctor is account 1) | **404** (isolated) |
| `GET /api/patient/52`, `53` (cross-account membership verified + consent) | **200** |
| `GET /api/patientdetails/patient/55` | 200 |
| `GET /api/vitalsign/patientdetails/55` | 200 |
| `dotnet test -c Release` | 54 tests — 52 pass, 2 pre-existing failures (AutoMapper config, DeleteAppointmentAsync) |

---

## BUG-001 — `GET /api/patient/{id}` returns 403 for the HealthProfessional role

| Field | Value |
|-------|-------|
| Area | Backend authorization |
| Severity | Medium (latent) |
| Status | **Resolved** in PR hardening (Fase 1) |
| Endpoint | `GET /api/patient/{id}` |
| Source | `MedPal.API/Controllers/PatientsController.cs:55-81` |

### Description

`GetPatientById` only authorized `Patients.ViewAll` or `Patients.ViewOwn`. The
`HealthProfessional` role only has `Patients.ViewAssigned` (plus `Create` / `Update`)
— see `MedPal.API/Data/Seeders/AuthorizationSeeder.cs:232-242`. As a result, a
doctor received **403 Forbidden** for **every** patient id.

### Reproduction

1. Login as `doctor.nutricion@medpal.com`.
2. `GET http://localhost:5126/api/patient/55` with the backend token.
3. Response: `403` (also verified with `/api/patient/56`).

### Resolution

- New `PatientAccessRequirement` / `PatientAccessHandler` (`MedPal.API/Authorization/`)
  now authorize `GetPatientById` with the full rule set: patient's own portal access,
  `SuperAdmin`, staff of any account the patient belongs to (via `PatientAccounts`),
  cross-account membership **verified + consent**, and legacy ghost resolution via
  the clinic account of `PatientClinics`.
- Unauthorized access returns a unified **404** (never a distinguishing 403).
- Covered by `MedPal.API.Tests/Authorization/PatientAccessHandlerTests.cs` (8 tests).
- **Impact:** current UI flows were not broken (patient details load via
  `/api/patientdetails`), but any future frontend call to `GET /api/patient/{id}` for
  a doctor now works.

---

## FINDING-001 — Ghost patient invisible in the Patients list (by design)

| Field | Value |
|-------|-------|
| Area | Patients list filtering |
| Type | Product / not a bug |
| Status | Needs decision |
| Source | `MedPal.API/Repositories/Implementations/PatientRepository.cs:20-55` |

### Description

A patient created on the fly via the omnibar (ghost patient) does **not** appear in
the Patients list for a doctor. The list (`Patients.ViewAssigned`) filters by
`MedicalHistories.HealthcareProfessionalId == userId`, and a ghost patient has no
medical history yet.

Verified against the database:
- `Patient 56` exists, is linked to clinic `1` via `PatientClinics`, and is referenced
  by appointment `109` (Scheduled) — yet it is absent from the list and from
  `GET /api/patient?clinicId=1` (11 results vs 55 at DB level).
- Earlier ghosts (`Patient 54`, `Patient 55`) **do** appear because they already have
  a `MedicalHistory` assigned to doctor 7 (created via the consultation or history form).

### Decision (2026-08-06)

Resolved so that the doctor **does** see the patient: `PatientAccessHandler` resolves
legacy ghost patients (no `AccountId`, no membership) through the clinic of
`PatientClinics`, and `PatientDetailsRepository.ApplyAccountFilter` keeps ghosts
visible to that clinic account. No change to list filtering was required for the
cross-account fix; ghost-created-by-user visibility remains a frontend/product concern
but is no longer an authorization blocker.

---

## BUG-004 — Consent at clinic level was never evaluated (`TargetDoctorId == null`)

| Field | Value |
|-------|-------|
| Area | Backend / PHI authorization |
| Severity | High (privacy leak) |
| Status | Fixed |
| Source | `MedPal.API/Services/Implementations/ConsentService.cs` |

### Description

`IsConsentForDoctorValidAsync` only evaluated consent rows with a specific
`TargetDoctorId`. Clinic-wide consents (`TargetDoctorId == null`) were ignored,
so a clinic staff member could be wrongly denied (or, in the old
specialty-sharing logic, inadvertently granted access based on role).

### Fix

`ConsentService` now treats `TargetDoctorId == null` as clinic-level and evaluates it
when the requesting clinic matches the consent's clinic. `MedicalHistoryController` no
longer passes `patientId` where `patientDetailsId` was expected (see BUG-005), so the
consent evaluation receives the correct record.

---

## BUG-005 — `MedicalHistoryController` passed `patientId` as `patientDetailsId`

| Field | Value |
|-------|-------|
| Area | Backend / PHI authorization |
| Severity | High (wrong-record authorization) |
| Source | `MedPal.API/Controllers/MedicalHistoryController.cs` |

### Description

The helper `CanViewRecordAsync` invoked `ConsentService.IsConsentForDoctorValidAsync`
with the patient id instead of the medical-history-assigned `patientDetailsId`, so
consent checks could evaluate against the wrong record (the actual bug detected in
the architectural review).

### Fix

The controller and repository now resolve the medical history's
`PatientDetailsId` (via `MedicalHistoryRepository` incl. `PatientDetails.Patient`)
before consent checks. Covered by `MedicalRecordAccessHandlerTests.cs` (7 tests).

---

## Nu1903 — AutoMapper 13.0.1 vulnerable aceptada temporalmente (Opción B, 2026-08-06)

| Field | Value |
|-------|-------|
| Area | Backend dependency / security debt |
| Severity | 7.5 HIGH (DoS, availability only) |
| Status | **Accepted** — pending re-evaluation |
| Advisory | GHSA-rvv3-g6hj-g44x / CVE-2026-32933 |
| Detail | `Backend/Services/MedPalApi/MedPal.API/Docs/NU1903_AUTOMAPPER_ACCEPTED.md` |

### Decision

Stay on AutoMapper 13.0.1 (MIT, always free). All patched versions (15.1.1+ /
16.1.1+) require a commercial/OSS license key (AutoMapper became dual-licensed in
v15.0.0), so no patched, license-free version exists. Exploitability in this API is
practically low: mappings are internal EF entities → flat bounded DTOs; the DoS needs
attacker-controlled object graphs 25,000+ levels deep. The `NU1903` warning is kept
visible on every build as a reminder. Re-visit when a license decision is possible —
plan in the doc above (bump to 15.1.3 + `LicenseKey` + `ILoggerFactory` fix in tests).

---

## BUG-006 — Frontend: stuck on `/login` after re-login; sidebar shown on login page (2026-08-07)

| Field | Value |
|-------|-------|
| Area | Frontend auth state |
| Severity | High (session UX broken) |
| Status | **Resolved** |
| Source | `src/app/guards/auth.guard.ts`, `src/app/services/auth.service.ts`, `src/app/app.component.{ts,html}` |

### Root cause

`PermissionService.cachedClaims` is Singleton state filled **once** at boot from the
storage token. On hard reload mid-session (stale/expired token in localStorage),
`AuthGuard.isTokenExpired()` trusted that stale cache, so after a fresh re-login the
guard still read the old claims and redirected back to `/login` — blocking all
authenticated navigation until the page was fully reloaded. The `app.component.html`
chrome (sidebar/toolbar/omnibar) was driven only by the NgRx `isLoggedIn$`, so on
`/login` the whole app frame and the login form coexisted.

### Fix (5 changes)

1. `auth.guard.ts` — `isTokenExpired()` decodes `exp` from the JWT payload itself
   (`atob`), no longer relies on `PermissionService`.
2. `auth.service.ts` — `logout()` also calls `permissionService.clearPermissions()`.
3. `auth.effects.ts` — `loginSuccessLoadProfile$` calls `refreshPermissions()` after login.
4. `menu.component.ts` — logout button calls `authService.logout()` (full cleanup +
   store reset + navigation) instead of a bare `store.dispatch(logout())`.
5. `app.component.{ts,html}` — new `showChrome` flag: chrome renders only when
   `isLoggedIn$` and the route is not public (`/login`, `/signup`, `/bienvenido`,
   `/unauthorized`, `/validate-prescription`).

### Verification (Chrome DevTools, `http://localhost:4200`)

1. Seeded `localStorage` with an **expired JWT** + `ngrx_auth` (userId set) and
   reloaded → landed on `/login` rendering the login form only, **no sidebar** (old
   code would show it).
2. Logged in with `doctor.nutricion@medpal.com` → navigated to `/` dashboard, sidebar
   + content rendered; sidebar navigation to `/patients` works.
3. Clicked "Cerrar Sesión" → `auth_token` removed, `ngrx_auth` reset to nulls, app
   returned to `/login` with clean state.

---

## Note (non-bug)

The redirect to `/login` on hard reload during the session was caused by an expired
JWT (60-min expiry, `appsettings.json`) combined with BUG-006 stale claim caching —
fixed 2026-08-07.