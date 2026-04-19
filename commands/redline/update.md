---
name: redline:update
description: Update Redline to latest version from GitHub
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
  - WebFetch
---

# Redline Update

Update Redline from the GitHub repository (github.com/true-north-stack/redline).

## Step 1: Check versions

Read the installed version:
```bash
cat ~/.claude/commands/redline/VERSION 2>/dev/null || echo "0.0.0"
```

Fetch the latest version from GitHub:
```bash
curl -sL https://raw.githubusercontent.com/true-north-stack/redline/main/VERSION
```

**If installed == latest:**
```
## Redline Update

**Installed:** X.Y.Z
**Latest:** X.Y.Z

You're already on the latest version.
```
Exit.

## Step 2: Show what's new and confirm

Fetch the CHANGELOG from GitHub:
```bash
curl -sL https://raw.githubusercontent.com/true-north-stack/redline/main/CHANGELOG.md
```

Display changes between installed and latest versions. If no CHANGELOG exists yet, just show the version diff.

```
## Redline Update Available

**Installed:** X.Y.Z
**Latest:** A.B.C

### What's New
(changelog entries between versions, or "See GitHub for details" if no changelog)

The update will replace:
- `~/.claude/commands/redline.md` (router)
- `~/.claude/commands/redline/` (all subcommands)
- `~/.claude/hooks/redline-check-update.js` (update hook)
- `~/.claude/docs/UX_AUDIT_FRAMEWORK.md` (UX framework)

Your project component files (`redline-inspector.tsx`, `redline-sidebar.tsx`, API route) will NOT be updated automatically. If the update includes component changes, you'll be notified.
```

Ask the user: "Proceed with update?" with options "Yes, update now" and "No, cancel".

If cancelled, exit.

## Step 3: Run update

```bash
# Clone latest to temp directory
rm -rf /tmp/redline && git clone https://github.com/true-north-stack/redline.git /tmp/redline
```

Copy updated files:
```bash
# Commands
cp /tmp/redline/commands/redline.md ~/.claude/commands/redline.md
cp /tmp/redline/commands/redline/*.md ~/.claude/commands/redline/

# VERSION
cp /tmp/redline/VERSION ~/.claude/commands/redline/VERSION

# Hook
cp /tmp/redline/.claude/hooks/redline-check-update.js ~/.claude/hooks/redline-check-update.js 2>/dev/null || true

# UX Audit Framework
mkdir -p ~/.claude/docs
cp /tmp/redline/docs/UX_AUDIT_FRAMEWORK.md ~/.claude/docs/UX_AUDIT_FRAMEWORK.md 2>/dev/null || true
```

Check if component files changed:
```bash
# Compare component files if the user has them installed
diff /tmp/redline/component/redline-inspector.tsx /tmp/redline/component/redline-inspector.tsx 2>/dev/null
diff /tmp/redline/component/redline-sidebar.tsx /tmp/redline/component/redline-sidebar.tsx 2>/dev/null
```

Clear the update cache:
```bash
rm -f ~/.claude/cache/redline-update-check.json
```

Clean up:
```bash
rm -rf /tmp/redline
```

## Step 4: Display result

```
+--------------------------------------------------+
|  Redline Updated: vX.Y.Z -> vA.B.C              |
+--------------------------------------------------+

Restart your session to pick up new commands.
```

If component files have changes in the new version, add:
```
Component files have been updated upstream. To update your project's components:
- Re-run the install prompt from AGENT-INSTALLATION.md, or
- Manually copy from github.com/true-north-stack/redline/component/
```
