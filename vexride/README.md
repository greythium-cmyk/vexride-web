# Vexride

**Vexride** — La plataforma predictiva más inteligente de carpooling para traslados laborales.

División tecnológica de **Greythium Incorporated** (Nueva York).

## Stack

- **Next.js 16** (App Router)
- **React 19** + **Tailwind CSS v4** + shadcn/ui
- **Framer Motion** — animaciones premium
- **Clerk** — autenticación
- **Supabase** — base de datos + Realtime (postgres_changes)
- **Sonner** — toast notifications en vivo
- **Vercel AI SDK** — Vex AI streaming
- **PWA básica** — manifest + service worker (cache demo offline)

## Features listas para producción

| Feature | Estado | Notas |
|---------|--------|-------|
| Landing page premium | ✅ | Hero, pricing, LAUNCH50, Vex AI |
| Dashboard completo | ✅ | Viajes, matches, stats, modals, FAB |
| Modo demo sin env | ✅ | Datos mock + simulador Realtime ~15s |
| Clerk auth | ✅ | Sign-in/up, middleware, webhook sync |
| Supabase data layer | ✅ | Queries, RLS schema, mappers |
| Supabase Realtime Live | ✅ | Trips, matches, notifications, chat |
| Toast notifications | ✅ | Sonner en cambios en vivo |
| Highlight animado | ✅ | Viajes/matches/notificaciones |
| Pull-to-refresh mobile | ✅ | Dashboard |
| Error boundary dashboard | ✅ | Fallback UI amigable |
| PWA básica | ✅ | Instalable, cache offline demo |
| Vex AI API | ✅ | OpenAI streaming + mock fallback |
| SEO / Open Graph | ✅ | Landing + dashboard metadata |

## Getting Started

```bash
cd vexride
npm install
cp .env.example .env.local
# Edita .env.local con tus claves (opcional para demo)
npm run dev
```

| Ruta | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Health check | http://localhost:3000/api/health |

> **Sin variables de entorno** el dashboard funciona en **modo demo** con datos mock, simulador Realtime y botón «Simular cambio realtime».

## Configuración completa

### 1. Clerk

1. Crea una app en [Clerk Dashboard](https://dashboard.clerk.com)
2. Copia `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` a `.env.local`
3. Habilita integración **Supabase** (JWT template llamado `supabase`)
4. Configura webhook → `https://tu-dominio/api/webhooks/clerk`  
   Eventos: `user.created`, `user.updated`  
   Secret → `CLERK_WEBHOOK_SECRET`

### 2. Supabase

1. Crea proyecto en [Supabase](https://supabase.com/dashboard)
2. Ejecuta en SQL Editor:
   - `supabase/schema.sql`
   - `supabase/migrations/001_realtime_live.sql`
   - (Opcional) `supabase/seed.sql`
3. En **Database → Replication**, activa Realtime para:
   `trips`, `matches`, `notifications`, `chat_messages`
4. Copia URL y anon key → `.env.local`
5. Service role key → `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)

### 3. OpenAI (Vex AI)

```env
OPENAI_API_KEY=sk-...
```

Sin clave, Vex AI responde con mock contextual en el dashboard.

### 4. App URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En Vercel usa tu dominio de producción.

## Estructura del proyecto

```
src/
├── app/
│   ├── dashboard/              # Dashboard + error boundary + SEO
│   ├── sign-in/ sign-up/       # Clerk
│   └── api/
│       ├── vex-ai/             # Streaming AI
│       ├── webhooks/clerk/     # Sync perfiles
│       └── health/             # Health check
├── components/dashboard/       # UI, modals, banners, pull-to-refresh
├── hooks/
│   ├── use-dashboard-realtime.ts
│   └── use-companion-chat.ts
├── lib/
│   ├── supabase/               # Client, queries, realtime
│   └── realtime/               # Handlers, mock simulator, logger, toasts
└── supabase/                   # SQL schema + migrations
public/
├── manifest.webmanifest        # PWA
├── sw.js                       # Service worker
└── icon.svg
```

## Supabase Realtime Live

El dashboard suscribe `postgres_changes` filtrado por `profile.id`:

| Tabla | Eventos | UI |
|-------|---------|-----|
| `trips` | * | Viajes activos, ubicación, match score |
| `matches` | * | Matches disponibles |
| `notifications` | * | Badge navbar + toasts |
| `chat_messages` | INSERT | Companion Chat |

**Optimizaciones:** unsubscribe al desmontar, debounce ~280ms en ráfagas, logging en consola.

### Probar Realtime (SQL)

```sql
-- Viaje en vivo
UPDATE trips SET status = 'in-progress', match_score = 98,
  location_label = 'Brooklyn Bridge — en ruta'
WHERE user_id = 'TU_PROFILE_UUID';

-- Nuevo match
INSERT INTO matches (user_id, driver_name, driver_avatar, driver_rating,
  driver_premium, route_from, route_to, match_time, match_score, savings, co2_saved)
VALUES ('TU_PROFILE_UUID', 'Test R.', 'TR', 4.9, false,
  'Test Origin', 'Test Dest', '9:00 AM', 95, '$10', '1.5 kg');

-- Notificación
INSERT INTO notifications (user_id, title, message, unread)
VALUES ('TU_PROFILE_UUID', 'Test Realtime', 'Cambio detectado en vivo', true);
```

### Modo demo

- Banner ámbar «Demo en vivo»
- Simulación automática cada ~15s
- Botón **Simular cambio realtime** para demos instantáneas
- Toasts Sonner en cada cambio

## Deploy en Vercel

1. Importa el repo en [Vercel](https://vercel.com)
2. Root directory: `vexride` (si el monorepo lo requiere) o raíz del proyecto
3. Añade **todas** las variables de `.env.example`
4. Deploy → verifica:
   - `/` landing
   - `/dashboard` (demo o auth según env)
   - `/api/health`
5. Clerk: actualiza URLs de redirect y webhook al dominio Vercel
6. Supabase: añade dominio Vercel en Auth redirect URLs si aplica

```bash
npm run build   # verificar localmente antes de push
```

## Scripts

```bash
npm run dev     # desarrollo
npm run build   # producción
npm run start   # servir build
npm run lint    # ESLint
```

## Pendiente para lanzamiento comercial

- **Stripe** — suscripciones Premium / LAUNCH50 checkout
- **Google Maps / Mapbox** — mapas en vivo, rutas y ETA
- **Push notifications** — web push + mobile (FCM/APNs)
- **Calendario** — Google Calendar / Outlook sync
- **Verificación de conductores** — KYC, seguro, licencia
- **App móvil nativa** — React Native o Flutter
- **Analytics** — PostHog / Vercel Analytics
- **E2E tests** — Playwright en flujos críticos

## Soporte

Greythium@gmail.com
