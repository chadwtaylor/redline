---
name: redline:check
description: Check open redlines (in-app dev feedback) and summarize what needs attention
allowed-tools:
  - Bash
---

Query all open redlines from the local Supabase and present a summary.

Connection: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`

Run this query:
```sql
SELECT id, page_url, element_selector, element_text, feedback, created_at
FROM redlines WHERE status = 'open' ORDER BY created_at;
```

For each redline, show:
1. Page URL
2. Element selector
3. Feedback text
4. When it was left

End with a count: "X open redlines"
