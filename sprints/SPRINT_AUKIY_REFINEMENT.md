# SPRINT_AUKIY_REFINEMENT.md
# DealSense — UI Refinement: AUKIY Premium Operator Console
# Run: claude "Execute sprints/SPRINT_AUKIY_REFINEMENT.md"

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

## CONSTRAINTS — WAJIB IKUT
- DO NOT redesign the application
- DO NOT change workflow
- DO NOT change layout structure
- DO NOT change business logic
- DO NOT change data flow
- DO NOT change approval logic
- DO NOT change WhatsApp opening behavior
- DO NOT add automation
- DO NOT add animations
- DO NOT add glassmorphism
- DO NOT add gradients (exception: existing card gradient is fine)
- DO NOT add cyberpunk styling or gaming-style glow
- DO NOT overdecorate

Files to patch:
- tools/semi-auto-outreach/public/style.css  ← MAIN TARGET
- tools/semi-auto-outreach/public/index.html ← button label text only
- tools/semi-auto-outreach/public/app.js     ← button label strings only

---

## BRAND POSITIONING

AUKIY is a founder-led intelligence systems company.
Visual reference: Linear, Anthropic, Palantir, enterprise operator consoles.
NOT: gaming dashboard, crypto platform, cyberpunk, trendy SaaS.

---

## COLOR SYSTEM

```
Background:        #050505
Surface:           #0B0B0D
Elevated Surface:  #111114
Primary Text:      #E8E8E8
Secondary Text:    #B8B8B8
Muted Text:        #8A8A8A
Subtle Border:     #242428
Primary Brand:     #9D0F18  (Deep Crimson)
Success:           #2E6A4F
Warning:           #C49A3A
Danger:            #9D0F18
```

---

## DESIGN RULES

**Rule 1 — Reduce red by ~30%**
Red only for: brand identity, primary actions, important emphasis, true danger/reject.
Do NOT use red for neutral info (UNKNOWN, BELUM ADA, Tiada).

**Rule 2 — Fix UNKNOWN / missing info colors**
- Missing but not critical (UNKNOWN, BELUM ADA, Tiada) → muted gray (#8A8A8A)
- Attention needed → warning amber (#C49A3A)
- Remove red from these labels

**Rule 3 — APPROVED_TO_SEND badge**
Premium dark emerald treatment:
- background: rgba(46,106,79,0.15)
- border: 1px solid rgba(46,106,79,0.40)
- color: #7ECBA1
- no glow

**Rule 4 — Card borders**
Reduce border brightness/glow by 30–50%.
Use `#242428` as base border instead of rgba white.
Cards feel expensive and calm, not loud.

**Rule 5 — Typography hierarchy**
Labels: font-size 10px, color #8A8A8A, uppercase, letter-spacing 0.8px.
Values: color #E8E8E8, font-size 13–14px, readable.
Section headings: clear, not oversized.

**Rule 6 — Button labels + hierarchy**
Rename in index.html and app.js:
- `✅ YES — Approve & Open` → `APPROVE`
- `✏️ EDIT` → `EDIT`
- `✅ OK — Save & Open` → `APPROVE`
- `❌ NO` → `REJECT`
- `💬 Mark Replied` → `MARK REPLIED`
- `🔄 Follow-Up Draft` → `FOLLOW-UP DRAFT`
- Remove all emojis from buttons

Visual hierarchy:
- APPROVE: crimson gradient (primary, most visible)
- EDIT: graphite (secondary, quiet)
- REJECT: graphite + crimson border (controlled danger, not loud)
- MARK REPLIED / FOLLOW-UP DRAFT: muted graphite

**Rule 7 — Spacing**
Increase padding breathing room where cramped.
Do not change layout structure.

**Rule 8 — Visual noise**
Every element must justify its existence.
Fewer, stronger signals over many weak ones.
Remove emojis from section labels (DM panel label, etc.) if they add noise.

---

## PHASE 1 — AUDIT

Read:
1. tools/semi-auto-outreach/public/style.css
2. tools/semi-auto-outreach/public/index.html
3. tools/semi-auto-outreach/public/app.js

Report:
1. Current UI issues found (match against design rules above)
2. Exact files + selectors/lines that need changes
3. Proposed changes per rule
4. Expected visual impact
5. What you will NOT touch

Do NOT modify any files.
STOP — tunggu "continue".

---

## PHASE 2 — APPLY REFINEMENTS

Only after approval:
1. Apply all refinements from Phase 1 proposal
2. Keep changes minimal and focused
3. Do not touch business logic or data flow
4. Summary: files changed + before/after explanation

Target quality scores after refinement:
- Brand Fit: 9.5/10
- Premium Feel: 9.4/10
- Enterprise Feel: 9.3/10
- Operator Clarity: 9.5/10
- AUKIY Alignment: 9.6/10

STOP — done.
