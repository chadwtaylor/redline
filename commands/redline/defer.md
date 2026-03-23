---
name: redline:defer
description: Defer a redline by number, or list all deferred redlines
argument-hint: "<number|list|undo number>"
allowed-tools:
  - Bash
---

# Redline Defer

Connection: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## If argument is "list"

Show all deferred redlines with their DB IDs (so user can reference them directly in `/redline:fix`):

```sql
SELECT ROW_NUMBER() OVER (ORDER BY created_at) as num, id, page_url, element_selector, feedback, created_at
FROM redlines WHERE status = 'deferred' ORDER BY created_at;
```

Display each with its UUID so the user can do `/redline:fix <uuid>` directly without undeferring first.

## If argument is a number

First, query open redlines with row numbers:

```sql
SELECT ROW_NUMBER() OVER (ORDER BY created_at) as num, id, page_url, feedback
FROM redlines WHERE status = 'open' ORDER BY created_at;
```

Find the row matching the given number, then defer it:

```sql
UPDATE redlines SET status = 'deferred' WHERE id = '{matched_id}';
```

Confirm which redline was deferred.

## If argument is "undo" followed by a number

Reopen a deferred redline by its number in the deferred list:

```sql
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as num
  FROM redlines WHERE status = 'deferred'
)
UPDATE redlines SET status = 'open'
FROM numbered
WHERE redlines.id = numbered.id AND numbered.num = {number};
```
