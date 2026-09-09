# AGENTS.md — ClinicFlow

## AI Operating Model

- The human owner approves architecture, security, public contracts, migrations, provider choices, and production actions.
- Codex acts as architect/orchestrator and prepares or reviews specs, ADRs, task boundaries, and evidence.
- OpenCode owns product development, testing, and deployment execution from accepted tasks.
- Cross-cutting architecture is canonical in the core API under `Docs/Architecture`; this UI must not redefine backend domain rules.
- Work on one accepted task at a time and report files changed, commands run, results, risks, and contract impact.

## Context

ClinicFlow is a healthcare SaaS for clinics, specialists, nutritionists, private practices.
Angular 19.2 app | NgRx state | NgModule architecture | Material Design | Karma+Jasmine

## Critical Rules

**Authorized to modify** UI / UX / styling / layout consistency **and**
backend/API code (controllers, repositories, services, authorization,
business logic) following the repo conventions. Still flag breaking changes,
permission/security impact, and DB migrations rather than applying them silently.

**Producción (PRD):** ninguna acción sobre PRD (acceso directo a BD, escritura/limpieza de datos, endpoints que muten, creación de registros de prueba) sin aprobación explícita del owner **antes de ejecutar**. Sin conexiones directas a la BD de PRD salvo autorización read-only pendiente por consulta. El smoke de aceptación se realiza por API pública y reporta resultados; para cualquier limpieza o mutación se solicita OK explícito.

## Specialized agents

`.opencode/agents/` defines subagents that can be delegated to in parallel:
`architect`, `backend`, `frontend`, `qa`. Delegate domain-specific work to them
instead of doing it inline when parallel or focused expertise is useful.

Additional platform agents are available for `frontend-staff`, `geolocation`,
and `payments-billing`. The existing `cfdev` skill remains the UI-only visual
refactor skill; use `clinicflow-platform` for cross-cutting platform work.

## Design Vision

UI must feel: modern, minimal, calm, premium, lightweight, operational, intuitive.
Reference: Linear, Stripe Dashboard, Apple-level simplicity.

> **Regla general (rollout progresivo):** Todo requerimiento visual nuevo aplica el
> **ClinicFlow Visual Contract v1** — tokens en `src/styles.css` (`--cf-*`), recetas en
> `Docs/DESIGN_SYSTEM.md §0`. Piloto canónico: consulta de Nutrición (glass teal,
> sidebar light, stepper pills, panel contextual). Los estilos se adoptan módulo a
> módulo sin romper comportamiento. Capacidades por especialidad (ej. recetas solo SOAP)
> van en `specialty-config` / el registry del workspace, nunca hardcodeadas en UI.

## Color System (Contract v1 — teal glass)

| Token | Value | Use |
|-------|-------|-----|
| `--cf-primary` | `#0ea5a8` | accents, focus, chips, active links |
| `--cf-primary-dark` | `#087b85` | hover / text on teal |
| `--cf-navy` | `#0c2d57` | headings, card values |
| `--cf-text` | `#123456` | body text |
| `--cf-muted` | `#6b7c93` | secondary text |
| `--cf-card` | `rgba(255,255,255,0.72)` | glass card bg |
| `--cf-gradient` | radial + `linear-gradient(135deg,#e9fbff,#f8fdff 50%,#d8f5f7)` | app background (fixed) |

> Legacy `styles.css` pre-piloto usaba `#1976D2` primary y `#F5F7FA` bg. Migración
> progresiva al contrato; nuevos componentes usan los `--cf-*` desde el inicio.

## Typography Scale

| Element | Size / Weight |
|---------|--------------|
| Dashboard Title | 28px / 700 |
| Section Title | 18px / 600 |
| Card Metric | 24px / 700 |
| Body Text | 14–15px |
| Labels | 12–13px |

## Spacing (4px base)

Prefer: 4, 8, 12, 16, 24, 32. Favor whitespace over density.

## Component Styles

- **Cards:** glass — `background: var(--cf-card); border-radius: 24–32px; padding: 24px; border: 1px solid rgba(255,255,255,0.85); box-shadow: 0 18px 45px rgba(31,117,140,0.16); backdrop-filter: blur(22px);`
- **Buttons primary:** gradiente `#18c5c8→#058897`, texto blanco, radius 16px, peso 800, soft hover
- **Buttons secondary (ghost):** `rgba(255,255,255,0.72)`, bajo contraste, borde blanco sutil
- **Inputs:** espaciosos, radius 14px, `border-color: #0ea5a8` on focus, `box-shadow: 0 0 0 4px rgba(14,165,168,0.14)`
- **Tables:** separadores suaves, filas espaciosas, contenedores redondeados
- **Sidebar:** light glass, icon-oriented, `nav-pill` active con gradiente teal + barra inset 4px
- **Stepper de consulta:** pills conectadas con círculos numerados (ver `consultation-stepper.*`)
- **Microinteractions:** `transition: all 0.2s ease;` — no bounce/flash

---

# Operations

## Commands

| Action | Command | Notes |
|--------|---------|-------|
| Dev server | `npm start` | http://localhost:4200 |
| Build | `npm run build` | Output: `dist/scheduling.ui/browser` |
| Test | `npm test` | Karma + Jasmine |
| Watch build | `npm run watch` | `ng build --watch --configuration development` |

No `lint`, `typecheck`, or `format` scripts exist.

## Architecture Quirks

- **All components use `standalone: false`** — NgModule-based, not Angular standalone
- **CSS:** Scoped `.component.css` files. Global tokens in `src/styles.css`.
- **NgRx** for `auth`, `audit`, `consent` only. Appointments/patients/prescriptions/clinics use services directly.
- **Auth persistence:** NgRx state is persisted with the `ngrx_` prefix; the direct JWT fallback key used by `AuthService` is `auth_token`.
- **Routing:** All authenticated routes defined in `home.module.ts` under `AuthGuard`.
- **Icons:** FontAwesome (`@fortawesome/*`), not Material Icons.
- **Imports order:** `@angular/*` → third-party → local (`../../` or `src/app/` paths).
- **Memory mgmt:** `takeUntil(this.destroy$)` + `Subject<void>` in `ngOnDestroy`.
- **Interfaces:** `I` + PascalCase (`IUser.ts`, `IPatient.ts`) in `src/app/entities/`.

## Known Gaps

| Area | Status |
|------|--------|
| Calendar component | 0% (library `angular-calendar` installed but no component) |
| Audit log components/service/store | ~15% skeleton |
| Route guards (audit-access, audit-admin, consent-access) | Stubs — only `auth.guard.ts` works |
| NgRx store for appointments, patients, prescriptions | Not implemented |
| `appointmens.service.ts` | Typo in filename (missing "t") |

## Key References (more detail)

- `.github/copilot-instructions.md` — full code patterns doc (421 lines)
- `PROJECT_ANALYSIS.json` — exhaustive component/service/store status map
- `Docs/DESIGN_SYSTEM.md` — extended design tokens
- `Dockerfile` uses `npm ci --legacy-peer-deps` for builds
- CI: GitHub Actions → GHCR (`ghcr.io/jorgeariasg/medpal-ui-stg`) → self-hosted docker compose
