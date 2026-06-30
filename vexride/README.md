# Vexride

**Vexride** — La plataforma predictiva más inteligente de carpooling para traslados laborales.

División tecnológica de **Greythium Incorporated** (Nueva York).

## Stack

- **Next.js 16** (App Router) · **React 19** · **Tailwind v4** · shadcn/ui
- **Clerk** auth · **Supabase** + Realtime · **Stripe** suscripciones
- **Leaflet** mapas interactivos · **Sonner** toasts · **Vercel AI SDK**
- **PWA** manifest + service worker

## Features listas para producción

| Feature | Estado |
|---------|--------|
| Landing + pricing + LAUNCH50 | ✅ |
| Dashboard + Realtime + toasts | ✅ |
| Stripe checkout + webhooks + plan gating | ✅ |
| Mapas interactivos (Leaflet/OSM) | ✅ |
| Modo demo completo (sin env) | ✅ |
| Clerk + Supabase + Vex AI | ✅ |
| PWA · SEO · robots.txt · error boundaries | ✅ |

## Cómo lanzar en 1-click (Vercel)

1. **Fork / import** el repo en [Vercel](https://vercel.com) (root: `vexride`)
2. **Variables de entorno** — copia todas desde `.env.example`:
   - Clerk (publishable + secret + webhook secret)
   - Supabase (URL, anon, service role)
   - Stripe (keys + 3 price IDs + webhook secret)
   - OpenAI (opcional)
   - `NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app`
3. **Supabase SQL** — ejecuta `schema.sql` + `migrations/001_*` + `002_stripe_subscriptions.sql`
4. **Stripe webhook** — `https://tu-dominio/api/webhooks/stripe`  
   Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. **Clerk webhook** — `https://tu-dominio/api/webhooks/clerk`
6. **Deploy** → verifica `/`, `/pricing`, `/dashboard`, `/api/health`

```bash
npm run build   # siempre antes de push
```

## Getting Started (local)

```bash
cd vexride
npm install
cp .env.example .env.local
npm run dev
```

| Ruta | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Precios | http://localhost:3000/pricing |
| Dashboard | http://localhost:3000/dashboard |

> **Sin `.env.local`** → modo demo: datos mock, mapas OSM, suscripción simulada en `/pricing`.

## Stripe

- Página `/pricing` con planes Free · Starter · Pro · Enterprise
- Checkout: `POST /api/stripe/checkout` → Stripe Session
- Portal: `POST /api/stripe/portal` (clientes existentes)
- Webhook: `POST /api/webhooks/stripe` → actualiza `profiles.plan`
- **Demo**: sin Stripe env, el checkout simula suscripción vía `localStorage`

### Plan gating

| Feature | Plan mínimo |
|---------|-------------|
| Match breakdown IA | Starter |
| Vex AI streaming prioritario | Pro |
| Unirse a Premium Drivers | Pro |

## Mapas

- Modal de viaje: mapa Leaflet + CartoDB dark tiles (OpenStreetMap)
- Ruta, origen, destino y punto de pickup
- Coordenadas en mock data + Supabase (`driver_lat`, `driver_lng`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` opcional para futura integración Google

## Supabase Realtime

Ver sección en migraciones y README anterior para SQL de prueba en vivo.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Pendiente crítico post-lanzamiento

- Verificación KYC de conductores
- Push notifications (web + mobile)
- Sync calendario Google/Outlook
- Analytics (PostHog / Vercel Analytics)

## Soporte

Greythium@gmail.com
