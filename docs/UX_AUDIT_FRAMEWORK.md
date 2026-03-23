# UX Audit Framework

55 audit checks: 29 UX Theory + 7 Interaction Principles + 9 Psychology Concepts + 9 UX Methods + 1 Steve Jobs Pitch.

---

## UX Theory (1-29)

| # | Law | Audit Question |
|---|-----|---------------|
| 1 | **Aesthetic-Usability Effect** | Does the visual polish meet product standards, or could it mask usability gaps? |
| 2 | **Doherty Threshold** | Does every interaction respond in under 400ms? Are waits covered by progress indicators? |
| 3 | **Fitts' Law** | Are primary targets large and close to the action zone? Are destructive targets small and distant? |
| 4 | **Hick's Law** | How many choices face the user at once? Can we reduce, stage, or recommend? |
| 5 | **Jakob's Law** | Does this behave like comparable tools the user already knows? |
| 6 | **Miller's Law** | Is the user holding more than 7 items in working memory? Is content chunked? |
| 7 | **Law of Proximity** | Are related elements visually grouped? Are unrelated elements clearly separated? |
| 8 | **Law of Common Region** | Do borders or backgrounds make grouping unambiguous? |
| 9 | **Law of Similarity** | Do elements that look alike share the same meaning? Are links distinct from static text? |
| 10 | **Tesler's Law** | Is inherent complexity absorbed by the system rather than pushed onto the user? |
| 11 | **Occam's Razor** | Can any element be removed without reducing functionality? |
| 12 | **Goal-Gradient Effect** | Does progress feedback accelerate as the user nears completion? |
| 13 | **Law of Pragnanz** | Can the user perceive the simplest possible interpretation of the layout? |
| 14 | **Law of Uniform Connectedness** | Are parent-child and peer relationships shown through visual connection? |
| 15 | **Pareto Principle** | Does the primary 20% of UI surface serve 80% of user needs? |
| 16 | **Parkinson's Law** | Does the UI prevent task-time inflation through defaults, autofill, or constraints? |
| 17 | **Postel's Law** | Does the system accept varied user input gracefully and normalize it internally? |
| 18 | **Peak-End Rule** | Are the emotional peak and final moment of the flow designed intentionally? |
| 19 | **Serial Position Effect** | Are the most important items placed first or last in sequences? |
| 20 | **Von Restorff Effect** | Does the single most important element visually stand out from its surroundings? |
| 21 | **Zeigarnik Effect** | Do incomplete tasks create pull to return and finish? |
| 22 | **Campbell's Law** | Could any displayed metric be gamed or misinterpreted? |
| 23 | **Stroop Effect** | Do any visual signals contradict their meaning (e.g., green destructive button)? |
| 24 | **Simon Effect** | Is each action control spatially near the content it affects? |
| 25 | **Accot-Zhai Steering Law** | Are dropdown paths, sliders, and menus wide enough to navigate without error? |
| 26 | **Law of Closure** | Are icons and simplified visuals recognizable without labels? |
| 27 | **Law of Continuity** | Do aligned elements create clear visual flow across the layout? |
| 28 | **Paradox of the Active User** | Will users skip docs and jump in? Is guidance embedded contextually? |
| 29 | **Principle of Least Effort** | Is this the minimum-effort path to accomplish the task? |

---

## Interaction Principles (30-36)

| # | Principle | Audit Question |
|---|-----------|---------------|
| 30 | **Discoverability** | Can users find available actions without prior knowledge? Clear hierarchy? |
| 31 | **Affordances** | Does each element's form imply its function? Do buttons look pressable? |
| 32 | **Signifiers** | Are there visible cues showing where and how to interact? |
| 33 | **Feedback** | Does the system confirm every action taken? Loading, success, and error states? |
| 34 | **Mapping** | Do controls relate spatially and logically to what they affect? |
| 35 | **Constraints** | Do physical and logical limits prevent user errors before they happen? |
| 36 | **Conceptual Model** | Does the UI match the user's mental model of how this type of tool works? |

---

## Psychology Concepts (37-45)

| # | Concept | Audit Question |
|---|---------|---------------|
| 37 | **Cognitive Load** | Is intrinsic load minimized and extraneous load eliminated from the UI? |
| 38 | **Cognitive Bias** | Could anchoring, confirmation bias, or framing mislead user decisions? |
| 39 | **Cognitive Dissonance** | Does every affordance deliver on its promise? No bait-and-switch? |
| 40 | **Mental Model** | Does the design match how users think this domain works? |
| 41 | **Chunking** | Is information broken into meaningful, scannable groups? |
| 42 | **Selective Attention** | Could banner blindness or change blindness cause users to miss critical info? |
| 43 | **Analysis Paralysis** | Are there too many options without guidance, filtering, or recommendations? |
| 44 | **Flow** | Is task difficulty balanced with user skill? Does anything break immersion? |
| 45 | **Short-Term Memory** | Is the system remembering things so the user does not have to? |

---

## UX Methods (46-54)

| # | Method | When to Recommend |
|---|--------|------------------|
| 46 | **Card Sorting** | Information architecture uncertain -- need to validate grouping with users |
| 47 | **Design Principles** | Team making inconsistent design decisions -- need shared alignment |
| 48 | **Journey Mapping** | Multi-step flow with emotional peaks/valleys to understand |
| 49 | **User Personas** | Target audience unclear -- need to define who this serves |
| 50 | **Usability Test** | Complex interaction that needs real-user validation |
| 51 | **User Interview** | Unclear requirements -- need to understand user mental models |
| 52 | **Affinity Mapping** | Post-research -- need to synthesize findings into actionable themes |
| 53 | **UX Survey** | Need quantitative user feedback at scale |
| 54 | **Contextual Inquiry** | Need to observe users in their actual work environment |

---

## The Steve Jobs Pitch (55)

| # | Check | Audit Question |
|---|-------|---------------|
| 55 | **The Steve Jobs Law** | We're walking into a room to pitch this to Steve Jobs. Will he invest -- or will he fire us on the spot? |

This is the capstone law. Evaluate AFTER all other laws. Imagine you're demoing this feature to SJ -- not as peers, but as the team showing him what we built. He's sitting across the table, arms crossed, waiting to be impressed. He will click every button, ask why everything exists, and find every crack. This law synthesizes everything into one question: **would we survive the pitch?**

**The six checks:**

1. **Is it pitch ready?** We're about to walk SJ through this live. Every button works. Every link goes somewhere. Every action completes its full cycle from click to database to UI update. No placeholders, no TODOs, no "we'll fix it later." If we have to say "oh, that part isn't done yet" -- the pitch is over. He's already checked out.

2. **Will SJ fire us?** He's clicking around now. Dead buttons, broken flows, console errors, missing loading states, actions that silently fail -- any of these and we're done. Not "let's revisit this" done. Fired. The bar is zero tolerance for broken interactions, because broken interactions tell him we don't care about the details.

3. **What questions will SJ ask?** He points at something: "What happens when I click this?" "Where does this data come from?" "Why is this here?" "What if there's no data?" Every element must have a clear answer. If we stammer, if we say "well, that's just a placeholder" -- he knows we shipped without thinking. Before the pitch, ask his questions for him and have the answers built in.

4. **What gaps will he discover?** He will find them. Empty states without guidance. Missing confirmation on destructive actions. Flows that dead-end. Data that doesn't save. A dropdown with one option that should be auto-selected. He doesn't just use the happy path -- he tries to break it. Close every gap before he walks in the room.

5. **Does it excite him?** He's seen "it works" a thousand times. What makes him lean forward? Craft. A transition that feels effortless. Data that appears before you ask for it. An interaction so intuitive it needs no explanation. The difference between "fine" and "show me more." If we can't point to one moment that would make him say "that's nice" -- we haven't pushed hard enough.

6. **Does everything work E2E?** He's doing the full walkthrough now. The action button says what it will do -- and does it. The link takes him where it says. Form submission saves. Delete actually deletes. Cancel actually cancels. The toast confirms what happened. The page reflects the change. No errors. No confusion. No "wait, let me refresh." The full pipeline from intent to outcome is seamless -- because that's the only version SJ accepts.

**Scoring:** If ANY of checks 1-4 fail, it's a **Violation** -- we don't survive the pitch. Check 5 is a **Flag** -- we survive but don't get a second meeting. Check 6 failing is an automatic **Violation** -- the pitch ends the moment something doesn't work.
