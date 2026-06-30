#!/usr/bin/env bash
# Vexride — sync environment variables with Vercel via CLI
#
# Prerequisites:
#   npm i -g vercel@latest
#   cd vexride && vercel link
#
# Usage:
#   ./scripts/vercel-env.sh checklist          # where to get each value
#   ./scripts/vercel-env.sh validate           # check .env.local before push
#   ./scripts/vercel-env.sh push               # upload .env.local → Vercel
#   ./scripts/vercel-env.sh pull               # download Vercel env → .env.local
#   ./scripts/vercel-env.sh doctor             # diagnose common deploy 404 issues

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${ENV_FILE:-$APP_ROOT/.env.local}"
ENV_EXAMPLE="$APP_ROOT/.env.example"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}→${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}!${NC} $*"; }
fail()  { echo -e "${RED}✗${NC} $*"; }

require_vercel_cli() {
  if ! command -v vercel >/dev/null 2>&1; then
    fail "Vercel CLI no instalado. Ejecuta: npm i -g vercel@latest"
    exit 1
  fi
}

is_placeholder() {
  local value="$1"
  [[ -z "${value// }" ]] && return 0
  [[ "$value" =~ x{5,} ]] && return 0
  return 1
}

cmd_checklist() {
  cat <<'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║  Vexride — Guía de variables de entorno (Clerk · Supabase · Stripe)        ║
╚══════════════════════════════════════════════════════════════════════════════╝

1) NEXT_PUBLIC_APP_URL
   Valor: https://TU-PROYECTO.vercel.app  (o dominio custom)
   Dónde: Vercel → Project → Settings → Domains (copia la URL principal)

──────────────────────────────────────────────────────────────────────────────
CLERK (https://dashboard.clerk.com)
──────────────────────────────────────────────────────────────────────────────
2) NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   Dónde: Clerk → tu app → Configure → API Keys → Publishable key
   Formato: pk_test_... (desarrollo) o pk_live_... (producción)

3) CLERK_SECRET_KEY
   Dónde: misma pantalla → Secret key
   Formato: sk_test_... o sk_live_...

4) NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
5) NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
6) NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
7) NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   (Estos cuatro son rutas internas — cópialos tal cual.)

8) CLERK_WEBHOOK_SECRET
   Dónde: Clerk → Webhooks → Add Endpoint
   URL: https://TU-DOMINIO/api/webhooks/clerk
   Eventos: user.created, user.updated
   Copia el "Signing Secret" (whsec_...)

   Clerk → Configure → Domains: añade tu dominio Vercel.
   Clerk → JWT Templates: crea plantilla "supabase" (para RLS con Supabase).

──────────────────────────────────────────────────────────────────────────────
SUPABASE (https://supabase.com/dashboard)
──────────────────────────────────────────────────────────────────────────────
9) NEXT_PUBLIC_SUPABASE_URL
10) NEXT_PUBLIC_SUPABASE_ANON_KEY
    Dónde: Supabase → Project Settings → API
    → Project URL y anon public key

11) SUPABASE_SERVICE_ROLE_KEY
    Dónde: misma pantalla → service_role (secret) — SOLO servidor, nunca cliente

    SQL Editor (en orden):
      • supabase/schema.sql
      • supabase/migrations/001_realtime_live.sql
      • supabase/migrations/002_stripe_subscriptions.sql
    Database → Replication: activar trips, matches, notifications, chat_messages

──────────────────────────────────────────────────────────────────────────────
STRIPE (https://dashboard.stripe.com)
──────────────────────────────────────────────────────────────────────────────
12) NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
13) STRIPE_SECRET_KEY
    Dónde: Developers → API keys (test o live según entorno)

14) STRIPE_WEBHOOK_SECRET
    Dónde: Developers → Webhooks → Add endpoint
    URL: https://TU-DOMINIO/api/webhooks/stripe
    Eventos:
      • checkout.session.completed
      • customer.subscription.updated
      • customer.subscription.deleted
    Copia el Signing secret (whsec_...)

15) STRIPE_PRICE_STARTER   → Producto Starter $29/mes → Price ID (price_...)
16) STRIPE_PRICE_PRO        → Producto Pro $69/mes
17) STRIPE_PRICE_ENTERPRISE → Producto Enterprise $199/mes
    Dónde: Product catalog → cada producto → Pricing → copia el Price ID

──────────────────────────────────────────────────────────────────────────────
OPCIONALES
──────────────────────────────────────────────────────────────────────────────
18) OPENAI_API_KEY — https://platform.openai.com/api-keys (Vex AI streaming)
19) NEXT_PUBLIC_GOOGLE_MAPS_API_KEY — Google Cloud Console (mapas avanzados)

EOF
}

cmd_validate() {
  if [[ ! -f "$ENV_FILE" ]]; then
    fail "No existe $ENV_FILE"
    info "Copia la plantilla: cp .env.example .env.local"
    exit 1
  fi

  local required_vars=(
    NEXT_PUBLIC_APP_URL
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET
    STRIPE_PRICE_STARTER
    STRIPE_PRICE_PRO
    STRIPE_PRICE_ENTERPRISE
    CLERK_WEBHOOK_SECRET
  )

  local errors=0
  for var in "${required_vars[@]}"; do
    local value
    value="$(grep -E "^${var}=" "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" || true)"
    if is_placeholder "$value"; then
      fail "$var — vacío o placeholder (reemplaza los xxx del .env.example)"
      errors=$((errors + 1))
    else
      ok "$var"
    fi
  done

  local app_url
  app_url="$(grep -E "^NEXT_PUBLIC_APP_URL=" "$ENV_FILE" | cut -d= -f2- | tr -d '"' | tr -d "'")"
  if [[ "$app_url" == *"localhost"* ]]; then
    warn "NEXT_PUBLIC_APP_URL apunta a localhost — usa tu URL de Vercel en producción"
  fi

  if [[ $errors -gt 0 ]]; then
    fail "$errors variable(s) pendientes. Ejecuta: ./scripts/vercel-env.sh checklist"
    exit 1
  fi
  ok "Todas las variables obligatorias tienen valores reales"
}

cmd_push() {
  require_vercel_cli
  cmd_validate

  info "Subiendo variables a Vercel (production, preview, development)..."
  cd "$APP_ROOT"

  if [[ ! -d .vercel ]]; then
    warn "Proyecto no enlazado. Ejecutando: vercel link"
    vercel link
  fi

  local envs=(production preview development)
  local count=0

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue

    local key="${line%%=*}"
    local value="${line#*=}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"

    [[ -z "$key" ]] && continue
    is_placeholder "$value" && continue

    for env in "${envs[@]}"; do
      if vercel env ls "$env" 2>/dev/null | grep -q "^[[:space:]]*${key}[[:space:]]"; then
        vercel env rm "$key" "$env" --yes >/dev/null 2>&1 || true
      fi
      printf '%s' "$value" | vercel env add "$key" "$env" >/dev/null
    done
    ok "$key"
    count=$((count + 1))
  done < "$ENV_FILE"

  ok "Subidas $count variables. Redeploy: vercel --prod"
}

cmd_pull() {
  require_vercel_cli
  cd "$APP_ROOT"
  if [[ ! -d .vercel ]]; then
    vercel link
  fi
  vercel env pull "$ENV_FILE"
  ok "Variables descargadas en $ENV_FILE"
}

cmd_doctor() {
  echo ""
  info "Diagnóstico deploy Vercel — error 404"
  echo ""

  local issues=0

  if [[ ! -f "$APP_ROOT/package.json" ]]; then
    fail "No hay package.json en $APP_ROOT"
    issues=$((issues + 1))
  else
    ok "package.json presente"
  fi

  if [[ ! -f "$APP_ROOT/src/app/page.tsx" ]]; then
    fail "Falta src/app/page.tsx (landing /)"
    issues=$((issues + 1))
  else
    ok "Ruta / (page.tsx) existe"
  fi

  if [[ -f "$APP_ROOT/../package.json" ]] && [[ ! -f "$APP_ROOT/package.json" ]]; then
    warn "El repo tiene package.json en la raíz — en Vercel configura Root Directory = vexride"
    issues=$((issues + 1))
  fi

  info "Build local..."
  if (cd "$APP_ROOT" && npm run build >/dev/null 2>&1); then
    ok "npm run build exitoso"
  else
    fail "npm run build falló — revisa logs antes de deploy"
    issues=$((issues + 1))
  fi

  echo ""
  info "Checklist Vercel Dashboard:"
  cat <<'EOF'
  • Settings → General → Root Directory = vexride  (sin barra final)
  • Framework Preset = Next.js
  • Node.js Version = 20.x
  • Tras cambiar Root Directory → Redeploy (no solo Retry)
  • Deployments → último deploy debe estar "Ready" (no Error/Canceled)
  • Probar: curl https://TU-DOMINIO/api/health
    → { "status": "ok", "mode": "demo" } sin env vars
    → { "mode": "production" } con Clerk/Supabase configurados

  Si pegaste valores del .env.example (con xxx), Clerk se activa con keys
  inválidas y puede romper el middleware. Usa valores reales o deja las
  vars sin definir para modo demo hasta tener credenciales.
EOF

  if [[ -f "$ENV_FILE" ]]; then
    echo ""
    info "Validando $ENV_FILE..."
    cmd_validate || issues=$((issues + 1))
  else
    warn "Sin .env.local — la app puede correr en modo demo sin variables"
  fi

  echo ""
  if [[ $issues -eq 0 ]]; then
    ok "Sin problemas detectados localmente"
  else
    fail "$issues problema(s) encontrado(s)"
    exit 1
  fi
}

usage() {
  cat <<EOF
Uso: $(basename "$0") <comando>

Comandos:
  checklist   Muestra dónde obtener cada variable (Clerk, Supabase, Stripe)
  validate    Verifica que .env.local no tenga placeholders
  push        Sube .env.local a Vercel (production + preview + development)
  pull        Descarga variables de Vercel a .env.local
  doctor      Diagnóstico de error 404 y build

Flujo recomendado:
  1. cp .env.example .env.local
  2. ./scripts/vercel-env.sh checklist    # rellena valores
  3. ./scripts/vercel-env.sh validate
  4. vercel link
  5. ./scripts/vercel-env.sh push
  6. vercel --prod

EOF
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    checklist) cmd_checklist ;;
    validate)  cmd_validate ;;
    push)      cmd_push ;;
    pull)      cmd_pull ;;
    doctor)    cmd_doctor ;;
    "")        usage; exit 1 ;;
    *)         fail "Comando desconocido: $cmd"; usage; exit 1 ;;
  esac
}

main "$@"
