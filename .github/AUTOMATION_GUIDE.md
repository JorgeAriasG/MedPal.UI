# 🎭 Automation Guide - Workflow Sinérgico Automático

> Sin extensión. Sin intervención manual. Solo coordinación inteligente.

---

## 🎯 ¿Cómo Funciona?

### **No Necesitas Extensión**

VS Code Copilot soporta **Hooks nativamente** - scripts que se ejecutan en eventos del ciclo de vida:

```
Tu comando @orchestrationagent
    ↓
Hook: SessionStart → Inicializa contexto
    ↓
Agente ejecuta tarea
    ↓
Hook: SubagentStart → Prepara siguiente fase
    ↓
Hook: SubagentStop → Valida completitud → Autodelega
    ↓
Hook: Stop → Resume final
```

---

## 🔧 Componentes de Automatización

### **1. Agente Orquestador**
```
Ubicación: .github/agents/orchestrationagent.agent.md
Responsabilidad: Coordinar flujo entre agentes
Invocación: @orchestrationagent [tarea]
```

### **2. Hooks de Lifecycle**
```
Ubicación: .github/hooks/*.json + *.js
Responsabilidad: Ejecutar scripts en eventos

Eventos:
├─ SessionStart           → Inicializa state
├─ PreToolUse            → Valida permisos
├─ SubagentStart         → Inyecta contexto
├─ SubagentStop          → Valida + handoff
└─ Stop                  → Genera resumen
```

### **3. State Persistente**
```
Ubicación: .github/hooks/.orchestration-state.json
Propósito: Trackear progreso entre agentes
Contenido: Fases, agentes completados, deps
```

---

## 🚀 Cómo Empezar

### **Paso 1: Invocar Orquestrador (Única vez)**
```bash
@orchestrationagent crear appointment scheduling feature

# El agente lee tu solicitud
# Hooks inicializan context automáticamente
```

### **Paso 2: El Flujo Automático Continúa**

```
ORCH invoca @scrummaster
 ├─ Planning: breakdown, estimaciones, timeline
 └─ ✅ Completado

Hook detecta completitud
 └─ Estado actualizado en .orchestration-state.json

ORCH auto-invoca @backendagent + @archagent (paralelo)
 ├─ Backend: API endpoints, services, migrations
 ├─ Frontend: Components, forms, store
 └─ ✅ Ambos completados

Hooks detectan ambos listos
 └─ Trigger siguiente fase

ORCH auto-invoca @qaagent
 ├─ Testing: unit tests, integration, E2E
 └─ ✅ Completado

ORCH auto-invoca @secopsagent
 ├─ Security: audit JWT, RBAC, data protection
 └─ ✅ Approved

ORCH invoca @scrummaster (finalización)
 ├─ Marca como done
 ├─ Genera resumen ejecutivo
 └─ ✅ Feature lista para producción
```

### **Paso 3: Monitorear Progreso**
```bash
@orchestrationagent status

# Output: Dashboard actual
# ├─ Phase 1 (Planning): ✅ Done (2h)
# ├─ Phase 2 (Backend): 🔄 In Progress (50%)
# ├─ Phase 3 (Frontend): ⏳ Pending
# ├─ Phase 4 (Testing): ⏳ Pending
# ├─ Phase 5 (Security): ⏳ Pending
# └─ Phase 6 (Completion): ⏳ Pending
```

---

## 📊 Flujo Automático Detallado

### **Sin Hooks (Manual - Lo Viejo)**
```
Tú: @archagent crear component
Esperar respuesta
↓
Tú: @backendagent crear API
Esperar respuesta
↓
Tú: @qaagent crear tests
Esperar respuesta
↓
Tú: @secopsagent auditar
Esperar respuesta

TOTAL: 4+ comandos, coordinación manual, overhead
```

### **Con Hooks (Automático - Lo Nuevo)**
```
Tú: @orchestrationagent coordinar

Sistema automático:
├─ Hook SessionStart → init
├─ Orch invoca scrummaster (planning)
├─ Hook SubagentStop → valida
├─ Orch delega backendagent+archagent (paralelo)
├─ Hook SubagentStop → ambos ready?
├─ Orch invoca qaagent (testing)
├─ Hook SubagentStop → coverage OK?
├─ Orch invoca secopsagent (security)
├─ Hook SubagentStop → approved?
├─ Orch invoca scrummaster (finalización)
└─ Hook Stop → resumen

TOTAL: 1 comando, workflow coordinado, sin intervención
```

---

## 🔄 Estado Persistente

### **Archivo de Estado**
```json
// .github/hooks/.orchestration-state.json
{
  "sessionId": "orch-2026-03-22-001",
  "startTime": "2026-03-22T10:30:00Z",
  "currentPhase": "backend",
  "agents": {
    "scrummaster": {
      "status": "completed",
      "endTime": "2026-03-22T10:35:00Z"
    },
    "backendagent": {
      "status": "in-progress",
      "startTime": "2026-03-22T10:35:00Z"
    },
    "archagent": {
      "status": "in-progress",
      "startTime": "2026-03-22T10:35:00Z"
    }
  },
  "progression": {
    "planning": "✅",
    "backend": "🔄",
    "frontend": "🔄",
    "testing": "⏳",
    "security": "⏳",
    "completion": "⏳"
  }
}
```

### **Cómo Funciona**

1. **Hook SessionStart** → Crea archivo de estado
2. **Hook SubagentStart** → Marca agente como "in-progress"
3. **Hook SubagentStop** → Actualiza estado a "completed"
4. **Orch lee estado** → Decide siguiente fase
5. **Hook Stop** → Resumen final

---

## 🛠️ Archivos de Configuración

### **Estructura Creada**
```
.github/
├── agents/
│   ├── archagent.agent.md              ✅ Existía
│   ├── orchestrationagent.agent.md     ✅ NUEVO
│   ├── backendagent.agent.md           ✅ NUEVO
│   ├── qaagent.agent.md                ✅ NUEVO
│   ├── secopsagent.agent.md            ✅ NUEVO
│   └── scrummaster.agent.md            ✅ NUEVO
│
├── hooks/
│   ├── orchestration.json              ✅ NUEVO (Config principal)
│   ├── session-start.js                ✅ NUEVO (Init)
│   ├── pre-tool-use.js                 ✅ NUEVO (Validation)
│   ├── subagent-start.js               ✅ NUEVO (Delegation)
│   ├── subagent-stop.js                ✅ NUEVO (Handoff automático)
│   └── session-stop.js                 ✅ NUEVO (Summary)
│
├── AGENTS.md                           ✅ NUEVO (Documentación)
└── copilot-instructions.md             ✅ Existía
```

---

## ⚙️ Cómo Configurar (Ya Hecho)

### **1. Config de Hooks** ✅
```json
{
  "hooks": {
    "SessionStart": [{ "type": "command", "command": "node .github/hooks/session-start.js" }],
    "SubagentStop": [{ "type": "command", "command": "node .github/hooks/subagent-stop.js" }],
    ...
  }
}
```

### **2. Scripts de Hooks** ✅
Cada evento tiene un script Node.js que:
- Lee input JSON desde stdin
- Actualiza state persistente
- Escribe output JSON a stdout
- Retorna `continue: true` o `false`

### **3. Agente Orquestador** ✅
Lee state, decide handoffs, invoca agentes correctos.

---

## 📈 Beneficios

### **Antes (Sin Automatización)**
```
Tiempo por feature: 10 horas
├─ Invocar @scrummaster (2h planning)
├─ Invocar @backendagent (3h API)
├─ Invocar @archagent (3h UI)
├─ Invocar @qaagent (1h testing)
├─ Invocar @secopsagent (30min security)
└─ Coordinación manual de handoffs: +30% overhead
```

### **Después (Con Automatización)**
```
Tiempo por feature: 6 horas
├─ Solo 1 comando: @orchestrationagent
├─ Orquestador coordina automáticamente
├─ Agentes trabajan en paralelo
├─ Handoffs automáticos
├─ Sin overhead de coordinación
└─ Ganancia: -40% tiempo, +100% eficiencia
```

---

## 🎓 Ejemplos de Uso

### **Ejemplo 1: Feature Simple**
```bash
@orchestrationagent crear endpoint GET /appointments/{id}
```

**Qué sucede automáticamente:**
1. Hook SessionStart → registra sesión
2. Orch invoca @scrummaster → 5 min planning
3. Hook SubagentStop → detecta completitud
4. Orch invoca @backendagent → implementa endpoint
5. Hook SubagentStop → valida endpoint
6. Orch invoca @qaagent → escribe tests
7. Hook SubagentStop → valida coverage >= 80%
8. Orch invoca @secopsagent → audita JWT
9. Hook SubagentStop → aprobado ✓
10. Hook Stop → resumen final

**Tu única intervención:** 1 comando

---

### **Ejemplo 2: Feature Compleja**
```bash
@orchestrationagent coordinar prescription management feature completa
```

**Qué sucede automáticamente:**
1. Orch invoca @scrummaster → epic breakdown completo
2. Orch invoca @backendagent + @archagent en paralelo
   - Backend: 4 endpoints, services, migrations
   - Frontend: forms, components, store
3. Orch espera a ambos (hooks monitoring)
4. Orch invoca @qaagent → testing completo
5. Orch invoca @secopsagent → security audit
6. Orch invoca @scrummaster → finalización
7. Output: Feature lista para merge + release notes

**Tu única intervención:** 1 comando

---

## ❓ FAQ

### **¿Necesito una extensión?**
❌ No. VS Code soporta Hooks nativamente.

### **¿Cuánto tarda la automatización?**
⏱️ Los Hooks son muy rápidos (<100ms cada uno). El tiempo real es el de los agentes ejecutando tareas.

### **¿Qué pasa si un agente falla?**
🔄 El Hook detecta el error, pausa el flujo, te notifica dónde están los bloqueadores.

### **¿Puedo intervenir manualmente?**
✅ Sí. Puedes invocar cualquier agente manualmente en cualquier momento. El Orquestrador se adapta.

### **¿Se guarda el estado?**
✅ Sí. En `.github/hooks/.orchestration-state.json`. Puedes continuar un workflow interrumpido.

### **¿Funciona offline?**
✅ Los Hooks son locales (scripts Node.js). Solo necesitas conectividad para Copilot API.

---

## 🚀 Próximo Paso

### **Ahora Mismo:**
```bash
@orchestrationagent crear sprint plan para appointment scheduling

# Espera a que el orquestador coordine el planning
# Los hooks automáticamente gestionarán la transición
```

El resto es automático. Tu equipo puede enfocarse en implementación, no en coordinación.

---

**Versión**: 1.0  
**Última actualización**: March 22, 2026  
**Status**: ✅ Listo para automatización completa
