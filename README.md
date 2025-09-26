# 🏆 Semillero Digital Dashboard - Vibeathon 2025

> **Dashboard inteligente que transforma Google Classroom en una herramienta de seguimiento y métricas para organizaciones educativas sin fines de lucro.**

## 🚀 **Demo en Vivo**
**🌐 Aplicación:** https://classed-vibeathon-2025-c1b9f0j8c-ludwigangels-projects.vercel.app/

**📱 Acceso Directo a Vistas:**
- [Vista Alumno](https://classed-vibeathon-2025-c1b9f0j8c-ludwigangels-projects.vercel.app/student)
- [Vista Profesor](https://classed-vibeathon-2025-c1b9f0j8c-ludwigangels-projects.vercel.app/teacher)
- [Vista Coordinador](https://classed-vibeathon-2025-c1b9f0j8c-ludwigangels-projects.vercel.app/coordinator)

## ✅ **Funcionalidades MVP Implementadas**
- ✅ Conexión con Google Classroom API
- ✅ Dashboard con lista de alumnos y progreso
- ✅ Lista de profesores y sus clases
- ✅ Estado de entregas (entregado, atrasado, faltante, reentrega)
- ✅ Filtros por cohorte, profesor y estado
- ✅ Autenticación OAuth con Google
- ✅ 3 vistas de usuario (Alumno, Profesor, Coordinador)

## 🛠 **Stack Tecnológico**
- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Flowbite
- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **APIs:** Google Classroom API, Google Calendar API
- **Deployment:** Vercel (Frontend), Docker (Local)

## 🚀 **Despliegue Local (Para Jurados)**

### **Opción 1: Usar la aplicación desplegada (Recomendado)**
Simplemente accede a: https://classed-vibeathon-2025-c1b9f0j8c-ludwigangels-projects.vercel.app/

### **Opción 2: Ejecutar localmente**

**Requisitos:** Node.js >= 18, Docker

```bash
# 1. Clonar repositorio
git clone [URL_DEL_REPO]
cd classed-vibeathon-2025

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Google (opcional para demo)

# 4. Levantar base de datos
docker compose up db -d

# 5. Ejecutar migraciones y datos de prueba
npm run db:migrate
npm run db:seed

# 6. Levantar backend (terminal 1)
cd backend
npm run start:dev

# 7. Levantar frontend (terminal 2)
cd frontend
npm run dev
```

**URLs locales:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📊 **Datos de Demostración**
La aplicación incluye datos mock para evaluación:
- 8 estudiantes ficticios
- 1 profesor (Profe Ada)
- 1 curso (Fullstack 101)
- Tareas y entregas con diferentes estados

## 🎯 **Problema Resuelto**
Semillero Digital necesitaba:
1. **Seguimiento consolidado** del progreso estudiantil
2. **Comunicación clara** de tareas y deadlines
3. **Métricas automatizadas** para coordinadores

## 💡 **Solución**
Dashboard complementario que se integra con Google Classroom API para proporcionar:
- **Vista Alumno:** Tareas pendientes, progreso personal
- **Vista Profesor:** Métricas por clase, seguimiento estudiantil
- **Vista Coordinador:** Analytics organizacional, reportes globales

## 🏗 **Arquitectura**
```
Frontend (Next.js) ↔ Backend (NestJS) ↔ Google Classroom API
                            ↕
                    PostgreSQL Database
```

## 📝 **Notas para Evaluación**
- ✅ **Proyecto funcional** creado durante Vibeathon (25-26 sept 2025)
- ✅ **Repositorio público** con código completo
- ✅ **Aplicación desplegada** lista para usar
- ✅ **Datos de demo** incluidos para evaluación
- ✅ **Responsive design** funciona en desktop y móvil

---
**Desarrollado por LUDWIG ANGEL para Vibeathon 2025** 🚀
