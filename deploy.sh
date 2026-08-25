#!/usr/bin/env bash
#
# Deploy the current main branch to this server.
#
#   ./deploy.sh              deploy origin/main
#   ./deploy.sh some-branch  deploy a different branch
#
# Run it ON the server, from the app directory. It is idempotent and safe to
# re-run. It deliberately does NOT touch .env — secrets are managed by hand.
#
set -euo pipefail

BRANCH="${1:-main}"
APP_NAME="futureline"
PORT="${PORT:-5000}"
HEALTH_URL="http://127.0.0.1:${PORT}/en"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mDEPLOY FAILED: %s\033[0m\n' "$*" >&2; exit 1; }

cd "$(dirname "$0")"

[ -f .env ] || fail ".env is missing in $(pwd). Create it before deploying (see docs/DEPLOYMENT.md)."

log "Fetching origin/$BRANCH"
git fetch --prune origin
PREV_SHA="$(git rev-parse HEAD)"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
NEW_SHA="$(git rev-parse HEAD)"
echo "    $PREV_SHA -> $NEW_SHA"

log "Installing dependencies"
# The project pins React 18 while @react-three/* target React 19, so a plain
# `npm ci` fails peer resolution. This flag is required, not optional.
npm ci --legacy-peer-deps --no-audit --no-fund

log "Syncing database schema"
# `db push` is non-destructive for additive changes and a no-op when the schema
# already matches. Review carefully before deploying a schema that drops columns.
npx prisma db push --skip-generate

log "Building"
npm run build

log "Restarting"
if command -v pm2 >/dev/null 2>&1 && pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
elif command -v pm2 >/dev/null 2>&1; then
  pm2 start ecosystem.config.js && pm2 save
elif systemctl list-units --type=service --all 2>/dev/null | grep -q "${APP_NAME}.service"; then
  sudo systemctl restart "${APP_NAME}.service"
else
  fail "No pm2 process or ${APP_NAME}.service found. Start the app once manually, then re-run."
fi

log "Health check"
for i in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$HEALTH_URL" || true)"
  if [ "$code" = "200" ]; then
    printf '    healthy (HTTP 200) after %ss\n' "$i"
    log "Deployed $NEW_SHA"
    exit 0
  fi
  sleep 1
done

fail "App did not return HTTP 200 at $HEALTH_URL within 30s. Check logs: pm2 logs $APP_NAME --lines 50. To roll back: git reset --hard $PREV_SHA && npm ci --legacy-peer-deps && npm run build && pm2 reload $APP_NAME"
