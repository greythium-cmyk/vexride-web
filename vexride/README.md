# Vexride

**Vexride** — La plataforma predictiva más inteligente de carpooling para traslados laborales.

División tecnológica de **Greythium Incorporated** (Nueva York).

> **Producto lanzado — 30 de junio de 2026**  
> Vexride está listo para compartir, demo y deploy en producción.

---

## Producto Lanzado

Vexride v1.0 incluye todo lo necesario para un SaaS de movilidad laboral:

| Módulo | Capacidades |
|--------|-------------|
| **Landing** | Hero, pricing, LAUNCH50, Vex AI, footer premium |
| **Dashboard** | Viajes, matches, stats, modals, FAB, pull-to-refresh |
| **Realtime** | Supabase live + simulador demo + toasts + highlights |
| **Auth** | Clerk + loading gate + modo demo sin login |
| **Pagos** | Stripe checkout, portal, webhooks, plan gating |
| **Mapas** | Leaflet/OSM interactivo en detalle de viaje |
| **Vex AI** | Streaming OpenAI + mock fallback + gating Pro |
| **PWA/SEO** | Manifest, SW, favicon, robots, sitemap, OG |

### Modo demo (cero configuración)

Sin `.env.local` el producto funciona al 100%:

```bash
cd vexride && npm install && npm run dev
```

- Dashboard con datos mock y Realtime simulado (~15s)
- Mapas OpenStreetMap
- Suscripción simulada en `/pricing` (confetti al activar Pro)
- Health check: `GET /api/health` → `{ "status": "ok", "mode": "demo" }`

---

## Deploy rápido (≈10 minutos)

### 1. Vercel

1. Importa el repo en [vercel.com](https://vercel.com) — **Root Directory:** `vexride`
2. Copia variables de `.env.example` (ver abajo)
3. Deploy

### 2. Variables de entorno

```env
# Obligatorias para producción completa
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
CLERK_WEBHOOK_SECRET=whsec_...

# Opcionales
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### 3. Supabase (SQL Editor)

Ejecuta en orden:

1. `supabase/schema.sql`
2. `supabase/migrations/001_realtime_live.sql`
3. `supabase/migrations/002_stripe_subscriptions.sql`

Activa Realtime en: `trips`, `matches`, `notifications`, `chat_messages`.

### 4. Webhooks

| Servicio | URL | Eventos |
|----------|-----|---------|
| Stripe | `/api/webhooks/stripe` | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` |
| Clerk | `/api/webhooks/clerk` | `user.created`, `user.updated` |

### 5. Verificación post-deploy

```bash
curl https://tu-dominio.vercel.app/api/health
# → { "status": "ok", "mode": "production", "timestamp": "..." }
```

| Ruta | Qué verificar |
|------|---------------|
| `/` | Landing carga |
| `/pricing` | Planes + checkout demo/Stripe |
| `/dashboard` | Viajes, mapa, Realtime, plan badge |
| `/api/health` | `status: ok`, `mode: production` |

---

## Stack

Next.js 16 · React 19 · Tailwind v4 · Clerk · Supabase · Stripe · Leaflet · Sonner · Vercel AI SDK · PWA

## Rutas locales

| Ruta | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Precios | http://localhost:3000/pricing |
| Dashboard | http://localhost:3000/dashboard |
| Health | http://localhost:3000/api/health |

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build producción
npm run start    # servir build
npm run lint     # ESLint
```

## Plan gating

| Feature | Plan mínimo |
|---------|-------------|
| Match breakdown IA | Starter |
| Vex AI streaming | Pro |
| Premium Drivers | Pro |

## Documentación adicional

- **[LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)** — Checklist completo pre/post deploy y marketing

## Post-lanzamiento (crítico)

- Verificación KYC de conductores
- Push notifications
- Sync calendario Google/Outlook

## Soporte

Greythium@gmail.com

---

*Vexride © 2026 Greythium Incorporated*
