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
2. **Supabase** — Ejecutar `supabase/schema.sql`, habilitar Realtime
3. **Webhook** — Clerk → `/api/webhooks/clerk` (user.created, user.updated)
4. **OpenAI** — Para Vex AI en producción (opcional, mock fallback incluido)

## Soporte

Greythium@gmail.com
