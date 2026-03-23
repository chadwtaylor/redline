---
name: redline:clear
description: Clear all redlines (open, fixed, dismissed) from the database
allowed-tools:
  - Bash
---

Delete all redlines regardless of status.

Connection: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`

Run:
```sql
DELETE FROM redlines;
```

Report the count deleted.
