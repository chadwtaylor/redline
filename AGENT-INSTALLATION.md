# Agent Installation

Copy the prompt below and paste it into [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Claude will handle the rest.

---

```
Install Redline from github.com/true-north-stack/redline into this project:

1. Clone https://github.com/true-north-stack/redline.git to /tmp/redline
2. Copy /tmp/redline/commands/redline.md to ~/.claude/commands/redline.md
3. Copy /tmp/redline/commands/redline/ directory to ~/.claude/commands/redline/
4. Copy /tmp/redline/VERSION to ~/.claude/commands/redline/VERSION
5. Copy /tmp/redline/docs/UX_AUDIT_FRAMEWORK.md to ~/.claude/docs/UX_AUDIT_FRAMEWORK.md (create ~/.claude/docs/ if needed)
6. Ask me where my React components live, then copy /tmp/redline/component/redline-sidebar.tsx and /tmp/redline/component/redline-inspector.tsx there
7. Ask me where my API routes live, then copy /tmp/redline/component/api-route-example.ts there as route.ts
8. Install modern-screenshot: run the project's package manager add command (e.g., pnpm add modern-screenshot or npm install modern-screenshot)
9. Add these lines to my .gitignore (if not already present): redline/feedback.json and redline/screenshots/
10. Create the redline/ directory in my project root
11. Install the update checker hook: copy /tmp/redline/.claude/hooks/redline-check-update.js to ~/.claude/hooks/redline-check-update.js, then add it to ~/.claude/settings.json under hooks.SessionStart (same pattern as existing hooks)
12. Clean up: rm -rf /tmp/redline
13. Confirm setup is complete and show me how to use /redline
```
