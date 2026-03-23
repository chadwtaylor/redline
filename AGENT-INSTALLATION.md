# Agent Installation

Copy the prompt below and paste it into [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Claude will handle the rest.

---

```
Install Redline from github.com/chadwtaylor/redline into this project:

1. Clone https://github.com/chadwtaylor/redline.git to /tmp/redline
2. Copy /tmp/redline/commands/redline.md to ~/.claude/commands/redline.md
3. Copy /tmp/redline/commands/redline/ directory to ~/.claude/commands/redline/
4. Copy /tmp/redline/docs/UX_AUDIT_FRAMEWORK.md to ~/.claude/docs/UX_AUDIT_FRAMEWORK.md (create ~/.claude/docs/ if needed)
5. Ask me where my React components live, then copy /tmp/redline/component/redline-sidebar.tsx and /tmp/redline/component/redline-inspector.tsx there
6. Ask me where my API routes live, then copy /tmp/redline/component/api-route-example.ts there as route.ts
7. Install modern-screenshot: run the project's package manager add command (e.g., pnpm add modern-screenshot or npm install modern-screenshot)
8. Add these lines to my .gitignore (if not already present): redline/feedback.json and redline/screenshots/
9. Create the redline/ directory in my project root
10. Clean up: rm -rf /tmp/redline
11. Confirm setup is complete and show me how to use /redline
```
