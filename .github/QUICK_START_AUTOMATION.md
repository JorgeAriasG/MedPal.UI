# ⚡ Quick Start - Workflow Automático

> De cero a feature completa con 1 comando

---

## 🚀 Cómo Empezar HOY

### **Opción A: Automatización Total (Recomendado)**
```bash
@orchestrationagent crear appointment scheduling feature completa

# ✨ El sistema hace el resto automáticamente:
# ├─ Planning (estimaciones, breakdown)
# ├─ Backend API (endpoints, servicios)
# ├─ Frontend UI (components, forms)
# ├─ Testing (unit, integration, E2E)
# ├─ Security review
# └─ ✅ Feature lista

# Tiempo: 3-5 días distribuido (vs 10+ días coordinación manual)
```

### **Opción B: Tareas Específicas (Cuando necesites algo puntal)**
```bash
@backendagent crear endpoint GET /users/me
# o
@archagent crear component de login
# o
@qaagent escribir tests para AuthService
# o
@secopsagent auditar JWT configuration
# o
@scrummaster crear sprint plan
```

---

## 📋 Dónde Están Los Agentes

### **Frontend Workspace** (`scheduling.ui/.github/agents/`)
- `archagent.agent.md` - Frontend Angular specialist
- `orchestrationagent.agent.md` - Workflow coordinator ⭐ NEW
- `backendagent.agent.md` - .NET specialist (también aquí)
- `qaagent.agent.md` - Testing specialist
- `secopsagent.agent.md` - Security specialist
- `scrummaster.agent.md` - Planning specialist

### **Backend Workspace** (`MedPal.API/.github/`)
- `copilot-instructions.md` - Backend conventions
- `AGENTS.md` - Quick reference

---

## 📚 Documentación Clave

| Documento | Para | Ubicación |
|-----------|------|-----------|
| **AGENTS.md** | Descubrir agentes | `scheduling.ui/.github/AGENTS.md` |
| **AUTOMATION_GUIDE.md** | Entender automatización | `scheduling.ui/.github/AUTOMATION_GUIDE.md` |
| **copilot-instructions.md** | Patrones de código | `scheduling.ui/.github/` o `MedPal.API/.github/` |
| **Agent Details** | Especialidades | `.github/agents/*.agent.md` |

---

## 🎯 Flujo Típico (Sin Intervención)

```
Tú:
  @orchestrationagent crear appointment scheduling

Sistema:
  ✅ PHASE 1: Planning
     └─ @scrummaster → breakdown, estimaciones, timeline
  
  ✅ PHASE 2: Development (paralelo)
     ├─ @backendagent → API endpoints, servicios
     └─ @archagent → UI components, store
  
  ✅ PHASE 3: Testing
     └─ @qaagent → unit tests, integration, E2E
  
  ✅ PHASE 4: Security
     └─ @secopsagent → JWT, RBAC, OWASP validación
  
  ✅ PHASE 5: Completion
     └─ @scrummaster → Resumen, release notes

Tú:
  Ver feature lista ✅ → merge a main
```

---

## ❓ Preguntas Frecuentes

### P: ¿Necesito una extensión?
**R:** No. VS Code soporta Hooks nativamente. Todo está built-in.

### P: ¿Cómo funciona sin intervención?
**R:** Hooks (scripts que se ejecutan en eventos del ciclo de vida):
- `SessionStart` → inicializa state
- `SubagentStop` → valida completitud y triggea siguiente fase
- `Stop` → resumen final

### P: ¿Puedo interrumpir el flujo?
**R:** Sí. Puedes invocar cualquier agente manualmente en cualquier momento. El sistema se adapta.

### P: ¿Se guarda el progreso?
**R:** Sí. En `.orchestration-state.json`. Puedes reanudar donde dejaste.

### P: ¿Cuánto tiempo se ahorra?
**R:** ~40% más rápido. Sin overhead de coordinación manual.

---

## 🎓 Ejemplos Puntuales

### **Feature Pequeña (1-2 horas)**
```
@orchestrationagent crear endpoint DELETE para pacientes
```

### **Feature Mediana (1-2 días)**
```
@orchestrationagent coordinar patient management CRUD completo
```

### **Feature Grande (3-5 días)**
```
@orchestrationagent coordinar appointment scheduling con calendar + notifications
```

---

## 🔧 Si Algo Falla

### Workflow Pausado
```
El sistema pausará automáticamente si:
- Validación falla (cobertura < 80%)
- Security review rechaza cambios
- Agente encuentra bloqueadores

Tú verás:
[ORCHᴐ] ❌ BLOCKED: [reason]
Próximos pasos: [sugerencias]
```

### Reanudar desde Punto de Fallo
```
@orchestrationagent status

# Ver qué está pendiente
# Invocar agente específico para resolver
# Sistema auto-continúa después
```

---

## 🚀 Comenzar Ahora Mismo

### **Paso 1: Abre VS Code**
```bash
Multi-root workspace:
- Backend: MedPal.API
- Frontend: scheduling.ui
```

### **Paso 2: Abre Copilot Chat**
```
Cmd+Shift+P → "Copilot: Open Chat"
```

### **Paso 3: Escribe Comando**
```
@orchestrationagent crear sprint plan para appointment scheduling feature
```

### **Paso 4: Espera Resultado**
Sistema orquesta automáticamente todo. Verás progreso consolidado.

---

## 📊 Comparación: Antes vs Después

### ANTES (Manual)
```
10+ horas
├─ Invocar @scrummaster → esperar → 2h
├─ Invocar @backendagent → esperar → 3h
├─ Invocar @archagent → esperar → 3h
├─ Invocar @qaagent → esperar → 1h
├─ Invocar @secopsagent → esperar → 30m
└─ Coordinación overhead → +30%
```

### DESPUÉS (Automático) ✨
```
4-6 horas distribuidas
├─ 1 comando: @orchestrationagent
├─ Sistema auto coordina
├─ Agentes trabajan en paralelo
├─ Sin overhead
└─ Ganancia: -40% tiempo
```

---

## 💡 Pro Tips

1. **Sé específico**: "crear appointment scheduling" vs solo "appointment"
2. **Usa automatización**: Para features completas, usa `@orchestrationagent`
3. **Usa agentes individuales**: Para tareas puntuales
4. **Monitorea progreso**: `@orchestrationagent status`
5. **Revisa automáticamente**: Todo genera y ejecuta tests

---

## 🎯 Next Steps

**HOY:**
```
@orchestrationagent crear sprint plan para appointment scheduling
```

**Luego:**
Sistema coordina planning + backend + frontend + testing + security + completion.

**Resultado:**
Feature lista para merge + release.

---

**¿Listo?** Abre Copilot y escribe ese primer comando. El resto es automático. 🚀

---

**Latest Update**: March 22, 2026 | **Status**: ✅ Production Ready | **Version**: 1.0
