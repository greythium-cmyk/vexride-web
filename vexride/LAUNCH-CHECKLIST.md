# Vexride — Launch Checklist

**Fecha de lanzamiento:** 30 de junio de 2026  
**Versión:** 1.0.0

Usa esta checklist para el primer deploy y go-live.

---

## Pre-deploy

### Código y build

- [ ] `cd vexride && npm install`
- [ ] `npm run build` — sin errores TypeScript
- [ ] `npm run lint` — sin errores críticos
- [ ] Probar modo demo local **sin** `.env.local`:
  - [ ] `/` landing
  - [ ] `/dashboard` — viajes, Realtime simulado, toasts
  - [ ] `/pricing` — activar Pro → confetti + features desbloqueadas
  - [ ] Trip detail → mapa Leaflet visible
  - [ ] `GET /api/health` → `{ status: "ok", mode: "demo" }`

### Repositorio

- [ ] Branch `main` actualizado (merge PRs de landing + launch)
- [ ] README.md y `.env.example` revisados
- [ ] Sin secretos commiteados

---

## Deploy (Vercel)

### Proyecto

- [ ] Import repo en [Vercel](https://vercel.com)
- [ ] **Root Directory:** `vexride`
- [ ] Framework: Next.js (auto-detect)
- [ ] Node.js 20+

### Variables de entorno

Copiar desde `.env.example`:

- [ ] `NEXT_PUBLIC_APP_URL` = URL de producción
- [ ] Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, URLs de redirect
- [ ] Supabase: URL, anon key, service role key
- [ ] Stripe: secret, publishable, webhook secret, 3 price IDs
- [ ] `CLERK_WEBHOOK_SECRET`
- [ ] `OPENAI_API_KEY` (opcional)

### Base de datos (Supabase)

- [ ] Ejecutar `supabase/schema.sql`
- [ ] Ejecutar `supabase/migrations/001_realtime_live.sql`
- [ ] Ejecutar `supabase/migrations/002_stripe_subscriptions.sql`
- [ ] Replication ON: `trips`, `matches`, `notifications`, `chat_messages`
- [ ] Clerk ↔ Supabase JWT integration (`supabase` template)

### Webhooks

- [ ] **Stripe** → `https://TU-DOMINIO/api/webhooks/stripe`
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] **Clerk** → `https://TU-DOMINIO/api/webhooks/clerk`
  - `user.created`, `user.updated`

### Clerk Dashboard

- [ ] Sign-in / Sign-up URLs apuntan a producción
- [ ] After sign-in/up → `/dashboard`
- [ ] Dominio Vercel en allowed origins

### Stripe Dashboard

- [ ] Productos: Starter ($29), Pro ($69), Enterprise ($199)
- [ ] Price IDs en env vars
- [ ] Modo Live activado (cuando corresponda)
- [ ] Código promo LAUNCH50 creado (opcional)

---

## Post-deploy

### Smoke tests

- [ ] `curl https://TU-DOMINIO/api/health`
  ```json
  { "status": "ok", "mode": "production", "timestamp": "..." }
  ```
- [ ] Landing `/` — carga < 3s
- [ ] Sign-up → redirect dashboard
- [ ] Dashboard carga datos (Supabase o fallback demo)
- [ ] Realtime: UPDATE trip en Supabase → toast + highlight
- [ ] `/pricing` → checkout Stripe (test card `4242...`)
- [ ] Plan Pro → Vex AI streaming, Premium Drivers desbloqueados
- [ ] PWA: manifest accesible, SW registrado en producción

### Seguridad

- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en Vercel (server)
- [ ] RLS activo en todas las tablas Supabase
- [ ] Webhook secrets rotados y verificados

### Monitoreo

- [ ] Vercel Analytics (opcional)
- [ ] Supabase logs sin errores RLS
- [ ] Stripe webhook delivery 200 OK

---

## Marketing (go-live)

### Contenido

- [ ] Tweet/post anunciando lanzamiento — 30 jun 2026
- [ ] Demo link: `https://TU-DOMINIO/dashboard` (modo demo funciona sin login si Clerk no configurado)
- [ ] Código LAUNCH50 en materiales
- [ ] Screenshots: dashboard, mapa, Vex AI, pricing

### Canales sugeridos

- [ ] Product Hunt (draft)
- [ ] LinkedIn — Greythium Incorporated
- [ ] Email a early adopters / beta list
- [ ] Landing CTA → `/sign-up` o `/dashboard`

### Métricas día 1

- [ ] Sign-ups (Clerk dashboard)
- [ ] Checkout sessions (Stripe)
- [ ] Health uptime (`/api/health` ping cada 5 min)

---

## Rollback

Si algo falla en producción:

1. Vercel → Deployments → **Rollback** al deployment anterior
2. Verificar `/api/health`
3. Revisar logs Stripe/Clerk webhooks
4. Modo demo sigue funcionando si Supabase falla (fallback automático)

---

## Contacto

Greythium@gmail.com

*Checklist v1.0 — Vexride Launch Day*
