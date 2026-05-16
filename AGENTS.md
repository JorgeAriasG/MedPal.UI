# AGENTS.md — ClinicFlow UI

## Context

ClinicFlow is a healthcare SaaS for clinics, specialists, nutritionists, private practices.
Angular 19.2 app | NgRx state | NgModule architecture | Material Design | Karma+Jasmine

## Critical Rules

**ONLY modify** UI / UX / styling / layout consistency.
**NEVER modify** backend logic, API calls, business logic, routes, workflows, forms behavior, auth, permissions, state management.

## Design Vision

UI must feel: modern, minimal, calm, premium, lightweight, operational, intuitive.
Reference: Linear, Stripe Dashboard, Apple-level simplicity.

## Color System (Aspirational)

| Token | Value |
|-------|-------|
| Primary | `#5B6CFF` |
| Secondary | `#A7F3D0` |
| Background | `#F6F8FC` |
| Surface | `#FFFFFF` |
| Border | `rgba(0,0,0,0.06)` |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |

> **Note:** Actual `styles.css` uses `#1976D2` primary, `#F5F7FA` bg, Roboto/Outfit/Muli fonts.
> If aligning code to these tokens, update `styles.css` accordingly.

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

- **Cards:** `background: white; border-radius: 16px; padding: 24px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.04);`
- **Buttons primary:** rounded, subtle blue palette, medium weight, soft hover
- **Buttons secondary:** ghost style, low contrast, subtle borders
- **Inputs:** spacious, `border-color: #5B6CFF` on focus, `box-shadow: 0 0 0 4px rgba(91,108,255,0.12)`
- **Tables:** soft separators, spacious rows, rounded containers
- **Sidebar:** slim, icon-oriented, softly elevated, rounded active states
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
- **Auth persistence:** `localStorage` via `ngrx-store-localstorage` (key prefix: `ngrx_`). Token key: `token`.
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
