# Redline

**Mark it. Fix it. Ship it.**

In-browser dev feedback that Claude fixes autonomously. No database. No tickets. No context-switching. You point at the problem, describe it in plain English, and AI resolves it -- with a 55-principle UX audit on every fix.

---

## The Loop

```
You see a problem ──► Click the element ──► Type feedback ──► Submit
                                                                │
Claude reads the redline ◄──────────────────────────────────────┘
        │
        ├── Finds the component in your codebase
        ├── Reads the screenshot for visual context
        ├── Applies the fix
        ├── Runs a 55-law UX audit
        └── Marks it done
```

That's the whole workflow. No project management tool. No Slack thread. No "can you look at this when you get a chance." You see it, you mark it, Claude fixes it.

---

## How It Works

### Zero Database

Redlines are stored in a flat JSON file at `redline/feedback.json` in your project root. No Supabase. No Postgres. No migrations. No ORM. Just a JSON array that Claude reads and writes.

```json
[
  {
    "id": "a7f3b291-4e82-4d1c-9f6a-3b8c2d1e0f5a",
    "page_url": "/bookings/new",
    "element_selector": "button.submit-booking",
    "element_text": "Submit",
    "feedback": "Button says Submit but should say Create Booking — be specific",
    "screenshot_path": "redline/screenshots/a7f3b291-4e82-4d1c-9f6a-3b8c2d1e0f5a.png",
    "status": "open",
    "created_at": "2026-03-23T14:30:00.000Z"
  }
]
```

### Silent Screenshot Capture

When you submit a redline, `html2canvas` captures the selected element automatically. No manual screenshots. No copy-paste. The image lands in `redline/screenshots/{id}.png` and Claude reads it for visual context when fixing — so it sees exactly what you saw.

### UX Review Built In

Every `/redline fix` automatically runs a UX audit against the **UX Audit Framework** — 54 established principles plus the Steve Jobs Pitch (#55). You can also run `/redline ux-review` standalone on any component. When submitting feedback from the browser, users can request a UX review and the fix will include the full audit automatically.

---

## Installation

### 1. Claude Commands

Copy the command files into your Claude Code commands directory:

```bash
# Clone the repo (or add as a submodule)
git clone https://github.com/chadwtaylor/redline.git

# Project-level (recommended — scoped to this project)
cp -r redline/commands/redline .claude/commands/
cp redline/commands/redline.md .claude/commands/

# Or user-level (available in every project)
cp -r redline/commands/redline ~/.claude/commands/
cp redline/commands/redline.md ~/.claude/commands/
```

### 2. UX Audit Framework Reference

The UX review needs the 55-principle reference doc:

```bash
mkdir -p ~/.claude/docs
cp redline/docs/UX_AUDIT_FRAMEWORK.md ~/.claude/docs/
```

A compact reference covering 54 established UX/psychology principles plus the Steve Jobs Pitch (#55). Claude reads it during every review.

### 3. Browser Component (Optional)

For React/Next.js apps, a sidebar component is included in `component/`. It provides the in-browser inspector UI — click any element, type feedback, submit with automatic screenshot capture.

```tsx
import { RedlineSidebar } from '@/components/redline-sidebar'

// In your app shell or layout:
export default function DashboardShell({ children }) {
  const [redlineActive, setRedlineActive] = useState(false)

  return (
    <div>
      <Sidebar>
        {/* ... your nav items ... */}
        <RedlineSidebar
          isActive={redlineActive}
          onToggle={() => setRedlineActive(!redlineActive)}
        />
      </Sidebar>
      <main>{children}</main>
    </div>
  )
}
```

The component uses `fetch('/api/redlines')` for reads/writes, Lucide React for icons, and Tailwind CSS for styling. It shows a live count badge of open redlines and a popover list to navigate directly to marked pages.

### 4. API Route (Required for Browser Component)

Copy the example API route into your Next.js app:

```bash
mkdir -p src/app/api/redlines
cp redline/component/api-route-example.ts src/app/api/redlines/route.ts
```

This route handles:
- **GET** — returns open redlines with count
- **POST (JSON)** — creates a redline without screenshot
- **POST (multipart/form-data)** — creates a redline with automatic screenshot capture

All files write to `redline/feedback.json` at the git root of your project. Works in monorepos — it uses `git rev-parse --show-toplevel` to find the root.

### 5. Gitignore

Add to your project's `.gitignore`:

```
redline/feedback.json
redline/screenshots/
```

Redlines and screenshots are ephemeral dev feedback. They should never be committed.

---

## Commands

### `/redline` or `/redline check` — See What's Open

Reads `redline/feedback.json`, filters to open items, and presents a numbered summary.

**Example output:**

```
## Open Redlines

1. /bookings/new → button.submit-booking
   "Button says Submit but should say Create Booking — be specific"
   Mar 23, 2:30 PM

2. /agreements/abc123 → .rates-table th:nth-child(3)
   "Rate column header should be right-aligned to match the numbers below it"
   Mar 23, 2:45 PM

3. /settings/zones → .zone-dialog input[name="name"]
   "No validation — lets me save a zone with an empty name"
   Mar 23, 3:01 PM

3 open redlines
```

### `/redline fix` — Fix All Open Redlines

Claude processes every open redline sequentially:

1. Reads the feedback text
2. Reads the screenshot (if captured) for visual context
3. Greps the codebase to find the component file
4. Reads the relevant code
5. Applies the fix
6. Runs `/redline ux-review` on the changed component
7. Adjusts the fix if the UX audit flags issues
8. Marks the redline as `fixed`

**Example session:**

```
> /redline fix

Fixing 3 open redlines...

#1 — /bookings/new → button.submit-booking
  Reading screenshot: redline/screenshots/a7f3b291.png
  Found: src/components/bookings/booking-form.tsx:142
  Fix: Changed button text from "Submit" to "Create Booking"
  UX Review: Pass (Von Restorff #20 — CTA is visually distinct)
  ✓ Marked fixed

#2 — /agreements/abc123 → .rates-table th:nth-child(3)
  Found: src/components/agreements/rates-table.tsx:67
  Fix: Added text-right class to Rate column header and cells
  UX Review: Pass (Law of Continuity #27 — numbers align with header)
  ✓ Marked fixed

#3 — /settings/zones → .zone-dialog input[name="name"]
  Found: src/components/settings/zone-dialog.tsx:34
  Fix: Added required validation with error message "Zone name is required"
  UX Review: Flag (Constraints #35 — consider max-length validation too)
  Applied additional fix: Added maxLength={100}
  ✓ Marked fixed

Done. 3 redlines fixed.
```

### `/redline fix <uuid>` — Fix a Specific Redline

Target a single redline by its ID. Works on both open **and** deferred redlines — you don't need to un-defer first.

```
> /redline fix a7f3b291-4e82-4d1c-9f6a-3b8c2d1e0f5a

Fixing redline a7f3b291...
  Reading screenshot: redline/screenshots/a7f3b291.png
  Found: src/components/bookings/booking-form.tsx:142
  Fix: Changed button text from "Submit" to "Create Booking"
  UX Review: Pass
  ✓ Marked fixed
```

### `/redline clear` — Reset Everything

Wipes all redlines regardless of status (open, fixed, dismissed, deferred). Clean slate.

```
> /redline clear

Cleared 7 redlines.
```

### `/redline defer` — Triage What's Not Ready

Defer a redline you don't want to fix right now. It stays in the file but won't show up in `/redline check` or `/redline fix`.

**Defer by number** (position in the open list):

```
> /redline defer 2

Deferred: "Rate column header should be right-aligned" (/agreements/abc123)
```

**List deferred redlines** (with UUIDs for direct fixing):

```
> /redline defer list

Deferred Redlines:

1. a7f3b291-4e82-4d1c-9f6a-3b8c2d1e0f5a
   /agreements/abc123 → .rates-table th:nth-child(3)
   "Rate column header should be right-aligned to match the numbers below it"
   Mar 23, 2:45 PM

1 deferred redline
Tip: Use /redline fix <uuid> to fix a deferred item directly.
```

**Un-defer** (move back to open):

```
> /redline defer undo 1

Reopened: "Rate column header should be right-aligned" (/agreements/abc123)
```

### `/redline ux-review` — Full UX Audit

Run a standalone UX Audit Framework review on any component, page, or your recent changes. This is the same review that runs automatically on every fix -- but you can trigger it anytime.

**With a target:**

```
> /redline ux-review src/components/bookings/booking-detail.tsx
```

**Without a target** (reviews recently changed `.tsx` files via `git diff`):

```
> /redline ux-review
```

**Example output:**

```
## UX Review: BookingDetail

### Findings

**Violations (must fix):**
- Hick's Law (#4): Action bar shows 8 options simultaneously. Group into
  primary (Confirm, Cancel) and secondary (overflow menu) actions.
  → src/components/bookings/booking-action-bar.tsx:45
- Fitts' Law (#3): "Delete Booking" and "Confirm Booking" buttons are the
  same size and adjacent. Destructive action should be smaller/further.
  → src/components/bookings/booking-action-bar.tsx:52

**Flags (consider fixing):**
- Tesler's Law (#10): User manually selects timezone for every new schedule.
  System should default to their profile timezone.
  → src/components/bookings/schedule-card.tsx:89
- Von Restorff Effect (#20): No visual distinction between draft and active
  bookings in the list view. Consider a status badge or color indicator.

**Passes (well done):**
- Law of Proximity (#7): Schedule, services, and notes are clearly grouped
  into distinct cards with appropriate spacing.
- Feedback (#33): Toast confirmations appear for all state transitions.
- Conceptual Model (#36): Status flow (Draft → Confirmed → In Progress →
  Completed) matches user expectations from similar scheduling tools.

### The Steve Jobs Pitch

1. ✓ Pitch ready — all flows complete end-to-end
2. ✓ No dead buttons or broken interactions found
3. ⚠ SJ asks: "Why do I see 8 action buttons?" (see Hick's Law above)
4. ⚠ SJ finds: Delete and Confirm too close together (see Fitts' Law above)
5. ✓ The schedule timeline component is genuinely well-crafted
6. ✓ Full E2E: create → confirm → complete → invoice pipeline works

### Summary
Two action bar violations need immediate attention — reduce visible actions
and separate destructive controls. Core UX is solid.
```

---

## The Steve Jobs Pitch

This is Law #55. The capstone of every UX review. After evaluating 54 laws of interaction design, psychology, and usability, we ask one final question:

> **We're walking into a room to pitch this to Steve Jobs. Will he invest — or will he fire us on the spot?**

Not as peers. As the team showing him what we built. He's sitting across the table, arms crossed, waiting to be impressed. He will click every button, ask why everything exists, and find every crack.

### The Six Checks

**1. Is it pitch ready?**

We're about to walk SJ through this live. Every button works. Every link goes somewhere. Every action completes its full cycle from click to database to UI update. No placeholders, no TODOs, no "we'll fix it later." If we have to say "oh, that part isn't done yet" — the pitch is over. He's already checked out.

**2. Will SJ fire us?**

He's clicking around now. Dead buttons, broken flows, console errors, missing loading states, actions that silently fail — any of these and we're done. Not "let's revisit this" done. *Fired.* The bar is zero tolerance for broken interactions, because broken interactions tell him we don't care about the details.

**3. What questions will SJ ask?**

He points at something: "What happens when I click this?" "Where does this data come from?" "Why is this here?" "What if there's no data?" Every element must have a clear answer. If we stammer, if we say "well, that's just a placeholder" — he knows we shipped without thinking. Before the pitch, ask his questions for him and have the answers built in.

**4. What gaps will he discover?**

He will find them. Empty states without guidance. Missing confirmation on destructive actions. Flows that dead-end. Data that doesn't save. A dropdown with one option that should be auto-selected. He doesn't just use the happy path — he tries to break it. Close every gap before he walks in the room.

**5. Does it excite him?**

He's seen "it works" a thousand times. What makes him lean forward? Craft. A transition that feels effortless. Data that appears before you ask for it. An interaction so intuitive it needs no explanation. The difference between "fine" and "show me more." If we can't point to one moment that would make him say "that's nice" — we haven't pushed hard enough.

**6. Does everything work E2E?**

He's doing the full walkthrough now. The action button says what it will do — and does it. The link takes him where it says. Form submission saves. Delete actually deletes. Cancel actually cancels. The toast confirms what happened. The page reflects the change. No errors. No confusion. No "wait, let me refresh." The full pipeline from intent to outcome is seamless — because that's the only version SJ accepts.

### Scoring

| Check | Fail = | Rationale |
|-------|--------|-----------|
| 1-4 | **Violation** | We don't survive the pitch. |
| 5 | **Flag** | We survive but don't get a second meeting. |
| 6 | **Violation** | The pitch ends the moment something doesn't work. |

---

## Philosophy

### Don't Make Me Think

That's the whole idea. Redline exists because the gap between *seeing a problem* and *fixing a problem* should be zero friction.

Traditional feedback loops look like this: screenshot the issue, open a ticket, describe the context, assign it, wait for someone to pick it up, answer clarifying questions, review the PR, merge, deploy. That's a week for a button label change.

Redline looks like this: click the button, type "should say Create Booking not Submit", hit enter. Claude fixes it in the same session. Done.

The system remembers things so you don't have to:
- **Screenshots are automatic** — you never take one manually
- **Element selectors are captured** — Claude knows exactly which component to find
- **Page URLs are recorded** — full context of where you were
- **UX review runs on every fix** — you don't have to remember to check

### The Audit Is Not Optional

Every fix goes through the 55-principle UX Audit Framework review. Not because you asked for it — because shipping without it is shipping without quality control. The review catches what humans miss: Fitts' Law violations, Hick's Law overload, missing feedback states, destructive actions without confirmation.

If the audit flags something, the fix is adjusted before it's marked done. The bar isn't "does the change work" — it's "does the change meet the standard."

---

## Project Structure

```
redline/
├── commands/
│   ├── redline.md              # Router — delegates to subcommands
│   └── redline/
│       ├── check.md            # Read and summarize open redlines
│       ├── fix.md              # Find and fix redlines in codebase
│       ├── clear.md            # Reset all redlines
│       ├── defer.md            # Triage: defer, list, undo
│       └── ux-review.md        # 55-law UX audit
├── component/
│   ├── redline-sidebar.tsx     # React sidebar component
│   └── api-route-example.ts    # Next.js API route for read/write
├── docs/
│   └── UX_AUDIT_FRAMEWORK.md   # 55-principle UX audit reference
└── README.md
```

### Your Project (After Setup)

```
your-project/
├── .claude/
│   └── commands/
│       ├── redline.md
│       └── redline/
│           ├── check.md
│           ├── fix.md
│           ├── clear.md
│           ├── defer.md
│           └── ux-review.md
├── redline/                    # gitignored
│   ├── feedback.json           # All redlines
│   └── screenshots/            # Auto-captured PNGs
│       ├── a7f3b291-...png
│       └── c4d5e6f7-...png
└── src/
    └── app/
        └── api/
            └── redlines/
                └── route.ts    # API route (if using browser component)
```

---

## Stack Requirements

| Requirement | Details |
|-------------|---------|
| **AI** | [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (CLI) |
| **Storage** | Flat file (`redline/feedback.json`) — no database |
| **Frontend** | Any — React/Next.js component provided as reference |
| **Styling** | Tailwind CSS (for the included component) |
| **Icons** | Lucide React (for the included component) |

The Claude commands work with any frontend framework (or no framework at all). The browser component is a convenience for React/Next.js apps — you can build your own inspector in Vue, Svelte, or anything else that can POST JSON to a file.

---

## License

MIT
