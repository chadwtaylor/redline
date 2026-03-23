# Redline

In-app dev feedback for AI-assisted development. Mark UI issues directly in your browser, then fix them with Claude.

## What It Does

1. **Mark issues in-browser** — Triple-tap `r` to activate the inspector. Click any element, type your feedback, submit. It's saved to your Supabase `redlines` table.

2. **Fix with Claude** — Run `/redline:fix` and Claude reads every open redline, finds the component, applies the fix, runs a UX review, and marks it done.

3. **UX Review** — Run `/redline:ux-review` to audit any component against 55 Laws of UX (Yablonski + the Steve Jobs Pitch). Every fix goes through this automatically.

## Installation

### 1. Database

Apply the migration to your Supabase project:

```bash
# Copy to your migrations directory
cp db/redlines.sql supabase/migrations/$(date +%Y%m%d%H%M%S)_redlines.sql

# Apply
supabase db reset
# or
supabase db push
```

### 2. Claude Commands

Copy the commands to your Claude Code commands directory:

```bash
# Project-level (recommended)
cp -r commands/redline .claude/commands/
cp commands/redline.md .claude/commands/

# Or user-level (available in all projects)
cp -r commands/redline ~/.claude/commands/
cp commands/redline.md ~/.claude/commands/
```

### 3. Laws of UX Reference

Copy the reference doc so the UX review has full context:

```bash
mkdir -p ~/.claude/docs
cp docs/LAWS_OF_UX.md ~/.claude/docs/
```

### 4. Browser Component

The `component/` directory contains a React sidebar component for Next.js + Supabase apps. Adapt it to your stack:

```tsx
import { RedlineSidebar } from '@/components/redline-sidebar'

// In your app shell / layout:
<RedlineSidebar isActive={redlineActive} onToggle={() => setRedlineActive(!redlineActive)} />
```

The component uses:
- `@supabase/supabase-js` browser client for reading/writing redlines
- Lucide React for icons
- Next.js `useRouter` for navigation
- Tailwind CSS for styling

Adapt the Supabase client import to match your project.

### 5. DB Reset Preservation (Optional)

If you use `supabase db reset` frequently, wrap it to preserve redlines:

```bash
cp scripts/db-reset.sh scripts/
chmod +x scripts/db-reset.sh
```

Then in `package.json`:
```json
{
  "scripts": {
    "db:reset": "./scripts/db-reset.sh"
  }
}
```

## Commands

| Command | Description |
|---------|-------------|
| `/redline` | Router — defaults to check, accepts `check`, `fix`, `clear` |
| `/redline:check` | Query open redlines and summarize |
| `/redline:fix` | Find and fix each open redline in the codebase |
| `/redline:fix <uuid>` | Fix a specific redline by ID (even if deferred) |
| `/redline:clear` | Delete all redlines from the database |
| `/redline:defer <n>` | Defer redline #n, or `list` to see deferred, or `undo n` |
| `/redline:ux-review` | Run a Laws of UX audit on changed components |

## The Steve Jobs Pitch

Every `/redline:fix` runs a UX review that includes the Steve Jobs Pitch (#55):

> We're walking into a room to pitch this to Steve Jobs. Will he invest — or will he fire us on the spot?

Six checks: Is it pitch ready? Will SJ fire us? What questions will he ask? What gaps will he discover? Does it excite him? Does everything work E2E?

## Stack Requirements

- **Database:** Supabase (Postgres)
- **AI:** Claude Code (CLI)
- **Frontend:** Any (React component provided as reference)

## License

MIT
