#!/usr/bin/env bash
# Wrapper around `supabase db reset` that preserves redlines.
# Usage: ./scripts/db-reset.sh

set -euo pipefail

BACKUP_FILE=".redlines-backup.json"
PSQL="psql postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# 1. Export redlines (if table exists and has data)
REDLINE_COUNT=$($PSQL -t -A -c "SELECT count(*) FROM redlines;" 2>/dev/null || echo "0")

if [ "$REDLINE_COUNT" -gt "0" ]; then
  echo "📋 Backing up $REDLINE_COUNT redline(s)..."
  $PSQL -t -A -c "
    SELECT json_agg(row_to_json(r))
    FROM (SELECT user_id, page_url, element_selector, element_text, feedback, screenshot_path, status, created_at FROM redlines ORDER BY created_at) r;
  " > "$BACKUP_FILE" 2>/dev/null
else
  echo "📋 No redlines to back up."
  rm -f "$BACKUP_FILE"
fi

# 2. Run the actual reset
echo "🔄 Running supabase db reset..."
supabase db reset

# 3. Restore redlines
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  echo "📋 Restoring $REDLINE_COUNT redline(s)..."
  # Use psql variable via stdin (not -c) to handle special chars in feedback
  $PSQL -v json_data="$(cat "$BACKUP_FILE")" <<'EOSQL'
    INSERT INTO redlines (user_id, page_url, element_selector, element_text, feedback, screenshot_path, status, created_at)
    SELECT
      (r->>'user_id')::uuid,
      r->>'page_url',
      r->>'element_selector',
      r->>'element_text',
      r->>'feedback',
      r->>'screenshot_path',
      r->>'status',
      (r->>'created_at')::timestamptz
    FROM json_array_elements(:'json_data'::json) AS r;
EOSQL
  rm -f "$BACKUP_FILE"
  echo "✅ Redlines restored."
else
  echo "📋 No redlines to restore."
fi
