# Semillero Digital – Plataforma de métricas y seguimiento en tiempo real para Google Classroom

Monorepo para la Vibeathon (25–26 septiembre 2025). Frontend en Next.js 14 (App Router) + TailwindCSS + Flowbite + PWA. Backend en NestJS con Prisma + PostgreSQL, jobs de sincronización con Google Classroom & Calendar.

## Estructura

```
semillero-classroom-dashboard/
├─ frontend/        # Next.js 14 (App Router) + Tailwind + Flowbite + PWA
├─ backend/         # NestJS + Prisma + Cron jobs + Google APIs
├─ prisma/          # Esquema DB compartido + seeds demo
├─ docker-compose.yml
├─ package.json     # npm workspaces
├─ .gitignore
├─ .env.example
└─ README.md
```

## Requisitos del concurso
- Proyecto funcional creado durante 25–26 septiembre 2025
- Repositorio público con README claro y pasos de despliegue
- Video demo (1–2 min) mostrando flujo principal – agrega el link en este README (sección Demo)

## Funcionalidades MVP
- Login con Google (OAuth2) – mismo email que Classroom
- Integración Classroom API para cursos, alumnos, tareas, entregas
- Filtros por cohorte, profesor y estado
- Dashboards: Alumno, Profesor, Coordinador

## Funcionalidades "wow"
- Predicción de riesgo (micro-modelo ML)
- Análisis de sentimiento (NLP simple)
- Integración Calendar + Meet (asistencia)
- Notificaciones multicanal (email/Telegram/WhatsApp)
- PWA con modo offline
- Reportes PDF/CSV automáticos
- Heatmaps y gráficos interactivos

## Variables de entorno
Copia `.env.example` a `.env` y completa los valores. El backend y frontend usan variables específicas. Para desarrollo con Docker Compose, `.env` en la raíz propaga a servicios.

## Puesta en marcha (local)
Requisitos: Node.js >= 18, Docker, npm.

1) Instalar dependencias (workspaces):
```
npm install
```

2) Iniciar servicios con Docker (Postgres + backend + frontend):
```
docker compose up --build
```

3) Ejecutar migraciones y seed de datos demo:
```
npm run db:migrate
npm run db:seed
```

4) Abrir frontend: http://localhost:3000
   Backend REST API: http://localhost:4000

## Scripts útiles
- `npm run db:migrate` – aplica migraciones Prisma
- `npm run db:seed` – inserta datos ficticios para demo
- `npm run sync:classroom` – job de sincronización Classroom (pull)
- `npm run sync:calendar` – job de sincronización Calendar (pull)
- `npm run report:weekly` – genera reportes PDF/CSV (demo)

## Deploy
- Frontend: Vercel
- Backend: Render/Heroku/Fly.io
- DB: Supabase/Railway/PostgreSQL gestionado

CI/CD con GitHub Actions (lint, test, build). Archivos en `.github/workflows/`.

## Demo
- Video (1–2 min): [pendiente]

## Notas
- Para Google OAuth y APIs, necesitarás crear credenciales en Google Cloud Console.
- Scopes requeridos (Classroom/Calendar/OpenID) están documentados en `backend/src/google/google.constants.ts`.
- Durante el hackathon, si no cuentas con credenciales, usa el seed y el modo demo para grabar el flujo end-to-end.
