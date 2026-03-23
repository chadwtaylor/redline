---
name: redline
description: Manage in-app dev feedback (redlines). Routes to check/fix/clear/ux-review or defaults to check.
argument-hint: "<check|fix|clear|defer|ux-review>"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Agent
---

Route to the appropriate redline subcommand based on the argument:

- `check` or no argument → run `/redline:check`
- `fix` → run `/redline:fix`
- `clear` → run `/redline:clear`
- `defer` → run `/redline:defer`
- `ux-review` → run `/redline:ux-review`

Connection: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`
Table: `redlines` (columns: id, page_url, element_selector, element_text, feedback, screenshot_path, status, created_at)

If the argument is `check` or empty, query and summarize open redlines.
If the argument is `fix`, find and fix each open redline in the codebase, then mark as fixed.
If the argument is `clear`, delete all redlines and report the count.
If the argument is `defer`, defer/list/undo deferred redlines.
If the argument is `ux-review`, run a Laws of UX audit on the specified component or recent changes.
