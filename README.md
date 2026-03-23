# Redline

**Mark it. Fix it. Ship it.**

In-app dev feedback for AI-assisted development. Triple-tap, describe the problem, and Claude fixes it — with an optional 55-point UX audit on every fix. No database. No tickets. Just a JSON file.

---

## The Loop

1. **Triple-tap `r`** — inspector activates — click any element — type your feedback — submit
2. **`/redline fix`** — Claude reads your feedback + screenshots, finds the code, fixes it
3. **Ship it**

Leave as many redlines as you want. Fix them all at once with a single `/redline fix`.

---

## Key Features

- **Screenshot capture** — opt-in checkbox on submit; silently captured via html2canvas
- **UX Audit** — opt-in checkbox; runs a 55-point UX Audit Framework on the fix (includes the Steve Jobs Pitch)
- **Flat JSON storage** — `redline/feedback.json` at your project root. No database, no migrations
- **Batch fix** — leave 10 redlines, fix them all in one command
- **Defer & triage** — defer items you're not ready to fix, come back later

---

## The Steve Jobs Pitch

Law #55 of the UX Audit Framework. After evaluating 54 principles of interaction design, psychology, and usability, we ask:

> **We're walking into a room to pitch this to Steve Jobs. Will he invest — or will he fire us on the spot?**

The six checks:
1. **Is it pitch ready?** — Every button works. Every link goes somewhere. No "that part isn't done yet."
2. **Will SJ fire us?** — Dead buttons, broken flows, console errors = fired. Zero tolerance.
3. **What questions will SJ ask?** — "What happens when I click this?" Every element needs an answer.
4. **What gaps will he discover?** — Empty states, missing confirmations, flows that dead-end.
5. **Does it excite him?** — "It works" isn't enough. Where's the craft that makes him lean forward?
6. **Does everything work E2E?** — Full pipeline from intent to outcome, seamless.

Full framework in [`commands/redline/ux-review.md`](commands/redline/ux-review.md).

---

## Commands

| Command | What it does |
|---------|-------------|
| `/redline` or `/redline check` | See all open feedback |
| `/redline fix` | Fix all open redlines (with UX audit if requested) |
| `/redline fix <uuid>` | Fix a specific one |
| `/redline clear` | Clear all feedback |
| `/redline defer <n>` | Defer an item by number |
| `/redline defer list` | List deferred items |
| `/redline defer undo <n>` | Un-defer an item |
| `/redline ux-review` | Run standalone UX audit on a component |

---

## Installation

**Recommended:** Copy the prompt from [AGENT-INSTALLATION.md](AGENT-INSTALLATION.md) and paste it into Claude Code. It handles everything.

**Manual setup:**

```bash
git clone https://github.com/chadwtaylor/redline.git /tmp/redline

# Commands (global)
cp /tmp/redline/commands/redline.md ~/.claude/commands/
cp -r /tmp/redline/commands/redline ~/.claude/commands/

# UX Audit reference
mkdir -p ~/.claude/docs
cp /tmp/redline/docs/UX_AUDIT_FRAMEWORK.md ~/.claude/docs/

# Browser component (React/Next.js) — adjust paths for your project
cp /tmp/redline/component/redline-sidebar.tsx src/components/
cp /tmp/redline/component/api-route-example.ts src/app/api/redlines/route.ts

# Gitignore + directory
echo 'redline/feedback.json' >> .gitignore
echo 'redline/screenshots/' >> .gitignore
mkdir -p redline
```

---

## Credits

- UX Audit Framework inspired by Jon Yablonski ([lawsofux.com](https://lawsofux.com))
- MIT License
