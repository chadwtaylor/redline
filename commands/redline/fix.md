---
name: redline:fix
description: Read open redlines, fix each one in the codebase, mark as fixed. Optionally pass a UUID to fix a specific redline (even if deferred).
argument-hint: "[uuid]"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Agent
---

Fix redlines from the local Supabase.

Connection: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## If a UUID argument is provided

Fix a specific redline by ID (works for open OR deferred):

```sql
SELECT id, page_url, element_selector, element_text, feedback, created_at
FROM redlines WHERE id = '{uuid}';
```

## If no argument

Fix all open redlines:

```sql
SELECT id, page_url, element_selector, element_text, feedback, created_at
FROM redlines WHERE status = 'open' ORDER BY created_at;
```

## Process

For each redline:
1. Read the feedback
2. Find the component file using the element_selector (grep for `data-testid` or the CSS path)
3. Read the relevant code
4. Apply the fix
5. Run `/redline:ux-review` on the changed component to validate against Laws of UX — adjust the fix if the review flags issues
6. Mark as fixed:
```sql
UPDATE redlines SET status = 'fixed' WHERE id = '{id}';
```

After all fixes, report what was done.

If a redline is unclear or can't be fixed automatically, flag it and move on. Don't skip silently.
