# Redline

**Your UX Feedback Loop Champion**

![Redline in action](assets/redline-screenshot.png)

In-app dev feedback for AI-assisted development. No database — just a JSON file.

## How It Works

1. **Triple-tap a shortcut** → select element or drag an area → type feedback → submit
2. **`/redline fix`** → Claude reads feedback + screenshots, finds the code, fixes it
3. Ship it

Leave as many redlines as you want. Fix them all at once.

## Keyboard Shortcuts

| Shortcut | Mode | Notes |
|----------|------|-------|
| `rrr` | Element select | Right hand |
| `uuu` | Element select | Left hand |
| `eee` | Area screenshot | Launches directly into area capture |
| `s` | Toggle mode | Switch between element/area while inspector is open |
| `Esc` | Cancel/exit | Cancel selection, close modal, or deactivate inspector |
| `Cmd+Enter` | Submit | Submit feedback from the modal |

All triple-tap shortcuts work the same way — tap three times within 500ms. They won't trigger while typing in inputs or textareas.

## Two Capture Modes

### Element Mode (default)

Hover over any element to highlight it. Click to select. A feedback modal opens with the CSS selector and element text pre-filled.

- Generates semantic selectors (`data-testid` > `id` > CSS path)
- Screenshot captured silently on selection — opt-in to include on submit
- Best for targeting specific components for code-level fixes

### Area Screenshot Mode

Click and drag to capture any rectangular region of the page. A red overlay highlights your selection area with live pixel dimensions as you drag. On release, the screenshot is captured and the feedback modal opens with a preview.

- Viewport captured via `modern-screenshot`, cropped to your selection
- Screenshot auto-included (the whole point of area mode)
- Best for layout issues, spacing problems, or multi-element feedback
- Drag in any direction — the selection normalizes automatically
- Tiny drags (< 20px) are ignored to prevent accidental captures

A mode indicator pill at the top of the screen shows which mode is active. Press **`s`** to toggle between modes while the inspector is open.

## Features

- **Element screenshots** — opt-in on submit, captured via `modern-screenshot` (supports Tailwind v4, `oklab()`, modern CSS)
- **Area screenshots** — drag to capture any region of the page with live dimension overlay
- **Screenshot preview** — area captures show a preview in the feedback modal before submit
- **Request UX Audit** — opt-in 55-point audit including the Steve Jobs Pitch
- **Flat file** — `redline/feedback.json`. No database
- **Batch fix** — 10 redlines? One command
- **`initialMode` prop** — launch the inspector directly into area mode programmatically

## The Steve Jobs Pitch

> We're walking into a room to pitch this to Steve Jobs. Will he invest — or will he fire us on the spot?

Is it pitch ready? Will SJ fire us? What questions will he ask? What gaps will he discover? Does it excite him? Does everything work E2E?

## Commands

| Command | What it does |
|---------|-------------|
| `/redline check` | See open feedback |
| `/redline fix` | Fix all open redlines |
| `/redline fix <uuid>` | Fix a specific one |
| `/redline clear` | Clear all feedback |
| `/redline defer <n>` | Defer / list / undo |
| `/redline ux-review` | Standalone UX audit |

## Component API

```tsx
<RedlineInspector
  active={boolean}           // Whether the inspector is active
  onDeactivate={() => void}  // Called when the inspector should close
  apiUrl="/api/redlines"     // API endpoint for submitting feedback (default: /api/redlines)
  initialMode="element"      // Starting mode: 'element' or 'area' (default: element)
/>
```

## Install

See **[AGENT-INSTALLATION.md](AGENT-INSTALLATION.md)** — paste the prompt into Claude Code and it handles everything.

MIT License
