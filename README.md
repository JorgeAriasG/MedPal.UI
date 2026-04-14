# 🏥 Medical Scheduling App - Frontend (Angular 19)

> Advanced patient scheduling system with role-based access control, multi-tenancy, and comprehensive medical records management.

## 📚 Documentation

**Toda la documentación está en la carpeta [`Docs/`](./Docs/)**

### Quick Links
- 📖 [Design System](./Docs/DESIGN_SYSTEM.md) - Colors, typography, components
- 🏗️ [Implementation Standards](./Docs/IMPLEMENTATION_STANDARDS.md) - Code patterns & best practices
- 📋 [Component Library](./Docs/COMPONENT_LIBRARY.md) - Available components
- 🎯 [Implementation Roadmap](./Docs/IMPLEMENTATION_ROADMAP.md) - Feature roadmap
- ✅ [Project Analysis](./Docs/PROJECT_ANALYSIS_REPORT.md) - Current status

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

Frontend runs at: **http://localhost:4200**  
Backend API: **http://localhost:5126**

---

## 📂 Project Structure

```
src/
├── app/
│   ├── components/          ← Smart & dumb components
│   ├── services/            ← HTTP & business logic
│   ├── store/               ← NgRx state management
│   ├── guards/              ← Route guards
│   ├── interceptors/        ← HTTP interceptors
│   ├── entities/            ← TypeScript interfaces
│   └── shared/              ← Reusable components
├── assets/                  ← Images, icons
├── styles.css               ← Global styles (CSS variables)
└── index.html
```

---

## 🎨 Tech Stack

- **Angular:** 19.2.3
- **State:** NgRx 18.1.1
- **UI:** Angular Material 3
- **HTTP:** RxJS 7.8.0
- **Forms:** Reactive Forms
- **Build:** TypeScript 5.6, Webpack

---

## 🔐 Features

✅ JWT Authentication  
✅ Role-Based Access Control (RBAC)  
✅ Multi-tenancy Support  
✅ Responsive Design (Mobile + Desktop)  
✅ Real-time Notifications  
✅ Patient Management  
✅ Appointment Scheduling  
✅ Medical Records  
✅ Prescription Management  
✅ Audit Logging  

---

## 📖 All Documentation

See [`Docs/`](./Docs/) folder for complete documentation index.

---

## 🔗 Related Resources

- **Backend API:** [`MedPal.API`](../../Backend/Services/MedPalApi/MedPal.API/)
- **Backend Docs:** [`MedPal.API/Docs/`](../../Backend/Services/MedPalApi/MedPal.API/Docs/)
- **Copilot Instructions:** [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)

---

**Version:** 1.0  
**Last Updated:** March 25, 2026  
**Status:** Sprint 1 - Testing & Integration
