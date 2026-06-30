# Vexride

**Vexride** — La plataforma predictiva más inteligente de carpooling para traslados laborales.

División tecnológica de **Greythium Incorporated** (Nueva York).

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4** + shadcn/ui
- **Framer Motion** — animaciones premium
- **Clerk** — autenticación
- **Supabase** — base de datos + realtime
- **Vercel AI SDK** — Vex AI streaming

## Getting Started

```bash
cd vexride
npm install
cp .env.example .env.local
# Edita .env.local con tus claves
npm run dev
```

- Landing: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

> Sin variables de entorno, el dashboard funciona en **modo demo** con datos mock.

## Estructura

```
src/
├── app/
│   ├── dashboard/          # Dashboard principal
│   ├── sign-in/            # Clerk auth
│   ├── api/vex-ai/         # Vex AI streaming endpoint
│   └── api/webhooks/clerk/ # Sync usuarios → Supabase
├── components/dashboard/   # UI del dashboard
├── lib/
│   ├── types/              # TypeScript types
│   ├── supabase/           # Client, queries, realtime
│   └── vex-ai/             # Respuestas contextuales
└── supabase/
    ├── schema.sql          # RLS + tablas
    └── seed.sql            # Datos de ejemplo
```

## Configuración Backend

Ver `.env.example` para todas las variables. Pasos:

1. **Clerk** — Crear app, habilitar integración Supabase (JWT template `supabase`)
2. **Supabase** — Ejecutar `supabase/schema.sql`, luego `supabase/migrations/001_realtime_live.sql` si ya tenías schema anterior
3. **Webhook** — Clerk → `/api/webhooks/clerk` (user.created, user.updated)
4. **OpenAI** — Para Vex AI en producción (opcional, mock fallback incluido)

## Supabase Realtime Live

El dashboard suscribe cambios en tiempo real vía `postgres_changes`:

| Tabla | Eventos | UI afectada |
|-------|---------|-------------|
| `trips` | INSERT/UPDATE/DELETE | Viajes activos, match score, ubicación |
| `matches` | INSERT/UPDATE/DELETE | Matches disponibles |
| `notifications` | INSERT/UPDATE | Badge navbar |
| `chat_messages` | INSERT | Companion Chat |

**Modo demo** (sin Supabase): simulador cada ~15s actualiza viajes, matches y notificaciones.

### Probar Realtime desde Supabase Dashboard

1. Obtén tu `profile.id` (UUID) en Table Editor → `profiles`
2. **Viaje en vivo** — UPDATE en `trips`:
   ```sql
   UPDATE trips SET status = 'in-progress', match_score = 98,
     location_label = 'Brooklyn Bridge — en ruta'
   WHERE user_id = 'TU_PROFILE_UUID';
   ```
3. **Nuevo match** — INSERT en `matches`:
   ```sql
   INSERT INTO matches (user_id, driver_name, driver_avatar, driver_rating,
     driver_premium, route_from, route_to, match_time, match_score, savings, co2_saved)
   VALUES ('TU_PROFILE_UUID', 'Test R.', 'TR', 4.9, false,
     'Test Origin', 'Test Dest', '9:00 AM', 95, '$10', '1.5 kg');
   ```
4. **Notificación** — INSERT en `notifications`:
   ```sql
   INSERT INTO notifications (user_id, title, message, unread)
   VALUES ('TU_PROFILE_UUID', 'Test Realtime', 'Cambio detectado en vivo', true);
   ```
5. **Chat companion** — INSERT en `chat_messages`:
   ```sql
   INSERT INTO chat_messages (user_id, role, content, channel)
   VALUES ('TU_PROFILE_UUID', 'assistant', 'Mensaje de prueba en vivo', 'companion:MG');
   ```
   (Usa el avatar del conductor, ej. `companion:MG` para María G.)

Verifica en **Database → Replication** que `trips`, `matches`, `notifications`, `chat_messages` estén en `supabase_realtime`.

## Soporte

Greythium@gmail.com
