---
name: clinicflow-platform
description: Apply ClinicFlow cross-repository contracts and tenant, geolocation, payment, and fiscal invariants to staff UI work; do not use for visual-only refactors.
---

# ClinicFlow Platform Skill - Staff UI

Use this skill when staff UI work consumes or affects tenant, scheduling, geolocation, receivable, payment, subscription, refund, reconciliation, or CFDI contracts. Use the existing `cfdev` skill for visual-only UI refactors.

Read `AGENTS.md`, the accepted task, the canonical core-API spec/ADRs, and current components/services before editing. The backend owns authorization and domain state; the UI presents it and gathers valid input.

Key invariants:

- Distance narrows a server-authorized clinic set and is never client authority.
- Google calls occur only during address capture/correction/approved refresh.
- SaaS subscriptions, patient payments, and CFDI are separate concerns.
- Provider secrets and exact patient coordinates are not exposed.
- Contract, permission, and migration changes require human approval.

Return changed files, build/test evidence, contract/security impact, and unresolved decisions.

