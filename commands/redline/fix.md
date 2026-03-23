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

Fix redlines stored in `redline/feedback.json` in the project root.

## If a UUID argument is provided

Fix a specific redline by ID (works for open OR deferred):

1. Read `redline/feedback.json`
2. Find the entry where `id` matches the provided UUID
3. If not found, report "No redline found with that ID"

## If no argument

Fix all open redlines:

1. Read `redline/feedback.json`
2. Filter to entries where `status === 'open'`
3. Sort by `created_at` ascending

## Process

For each redline:
1. Read the feedback. If `screenshot_path` exists, read the screenshot image for visual context.
2. Find the component file using the element_selector (grep for `data-testid` or the CSS path)
3. Read the relevant code
4. Apply the fix
5. Run `/redline:ux-review` on the changed component to validate against Laws of UX — adjust the fix if the review flags issues
6. Mark as fixed: read `redline/feedback.json`, update the matching entry's `status` to `'fixed'`, write the file back

After all fixes, report what was done.

If a redline is unclear or can't be fixed automatically, flag it and move on. Don't skip silently.
