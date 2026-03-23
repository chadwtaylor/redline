# Redline

In-app dev feedback for AI-assisted development. Mark UI issues directly in your browser, then fix them with Claude.

## What It Does

1. **Mark issues in-browser** — Triple-tap `r` to activate the inspector. Click any element, type your feedback, submit. It's saved to `redline/feedback.json` in your project root.

2. **Fix with Claude** — Run `/redline:fix` and Claude reads every open redline, finds the component, applies the fix, runs a UX review, and marks it done.

3. **UX Review** — Run `/redline:ux-review` to audit any component against 55 Laws of UX (Yablonski + the Steve Jobs Pitch). Every fix goes through this automatically.

## Installation

No database required. Redlines are stored in a flat JSON file.

### 1. Claude Commands

Copy the commands to your Claude Code commands directory:

```bash
# Project-level (recommended)
cp -r commands/redline .claude/commands/
cp commands/redline.md .claude/commands/

# Or user-level (available in all projects)
cp -r commands/redline ~/.claude/commands/
cp commands/redline.md ~/.claude/commands/
```

### 2. Laws of UX Reference

Copy the reference doc so the UX review has full context:

```bash
mkdir -p ~/.claude/docs
cp docs/LAWS_OF_UX.md ~/.claude/docs/
```

### 3. Browser Component (Optional)

The `component/` directory contains a React sidebar component for Next.js apps. It communicates with a local API route that reads/writes `redline/feedback.json`.

```tsx
import { RedlineSidebar } from '@/components/redline-sidebar'

// In your app shell / layout:
<RedlineSidebar isActive={redlineActive} onToggle={() => setRedlineActive(!redlineActive)} />
```

The component uses:
- `fetch('/api/redlines')` to read/write redlines (no database client needed)
- Lucide React for icons
- Next.js `useRouter` for navigation
- Tailwind CSS for styling

### 4. API Route (Required for Browser Component)

Copy the example API route into your Next.js app:

```bash
mkdir -p app/api/redlines
cp component/api-route-example.ts app/api/redlines/route.ts
```

This route reads and writes `redline/feedback.json` in the project root. See `component/api-route-example.ts` for the full implementation.

### 5. Gitignore

Add these to your project's `.gitignore`:

```
redline/feedback.json
redline/screenshots/
```

Redlines and screenshots are dev-only feedback and should not be committed.

## Commands

| Command | Description |
|---------|-------------|
| `/redline` | Router — defaults to check, accepts `check`, `fix`, `clear`, `defer`, `ux-review` |
| `/redline:check` | Read open redlines and summarize |
| `/redline:fix` | Find and fix each open redline in the codebase |
| `/redline:fix <uuid>` | Fix a specific redline by ID (even if deferred) |
| `/redline:clear` | Clear all redlines from `redline/feedback.json` |
| `/redline:defer <n>` | Defer redline #n, or `list` to see deferred, or `undo n` |
| `/redline:ux-review` | Run a Laws of UX audit on changed components |

## The Steve Jobs Pitch

Every `/redline:fix` runs a UX review that includes the Steve Jobs Pitch (#55):

> We're walking into a room to pitch this to Steve Jobs. Will he invest — or will he fire us on the spot?

Six checks: Is it pitch ready? Will SJ fire us? What questions will he ask? What gaps will he discover? Does it excite him? Does everything work E2E?

## Stack Requirements

- **AI:** Claude Code (CLI)
- **Frontend:** Any (React component provided as reference)
- **Storage:** Flat file (`redline/feedback.json`)

## License

MIT
