# AUKIY UI Refinement Prompt for Claude Code

## Purpose

Use this prompt in Claude Code to audit and refine the current DealSense Operator Lite dashboard into a more premium AUKIY-aligned operator console.

This is **not** a redesign prompt.

The objective is to preserve the working application while improving perceived quality, clarity, hierarchy, and premium brand consistency.

---

# Pre-Build Audit Summary

## Current UI Strengths

The current dashboard already has a strong foundation:

- Dark premium interface direction
- Clear human-approval workflow
- Strong operational feel
- AUKIY crimson/black identity already present
- Good negative space
- Functional card-based layout
- Clear prospect information structure
- Safety banner reinforces human-in-the-loop positioning

The UI already feels better than a generic admin panel.

Estimated current score:

| Area | Score |
|---|---:|
| Brand Fit | 8.8 / 10 |
| Premium Feel | 8.5 / 10 |
| Enterprise Feel | 8.4 / 10 |
| AUKIY Alignment | 9.0 / 10 |

---

## Main Problems to Fix

### 1. Red Is Overused

Red currently appears in too many places:

- Brand badge
- Warning text
- UNKNOWN values
- Button states
- Borders
- Accent lines
- Error-like labels

This weakens the brand color because the eye cannot tell what matters most.

Refinement goal:

Red should only be used for:

- Brand identity
- Primary action
- Important emphasis

---

### 2. Status Colors Need Better Meaning

Current issue:

- `UNKNOWN` in red looks like an error.
- `BELUM ADA` in red looks like a failure.
- Green approval badge feels too default/admin-panel style.

Refinement goal:

- Unknown / missing info = muted gray or warning amber
- Approved = premium dark emerald
- Danger/reject = controlled crimson, not bright red

---

### 3. Typography Hierarchy Can Be Stronger

Current issue:

Labels and values are visually close in weight.

Refinement goal:

- Labels should feel smaller, quieter, and operational.
- Values should be brighter and easier to scan.
- Section titles should be clearer but not loud.

---

### 4. Border and Glow Need Restraint

Current issue:

Some red outlines/glow can start moving toward gaming/cyberpunk.

Refinement goal:

- Reduce border brightness and glow by 30–50%.
- Make cards feel expensive, calm, and controlled.
- Use subtle separation instead of loud outlines.

---

### 5. Button Language and Hierarchy Need Operator Clarity

Current issue:

Button labels like `YES`, `NO` are functional but slightly developer-ish.

Refinement goal:

- Primary: `APPROVE`
- Secondary: `EDIT`
- Danger: `REJECT`
- Supporting: `MARK REPLIED`, `FOLLOW-UP DRAFT`

The user should understand the decision path instantly.

---

# Final Claude Code Prompt

Paste everything below into Claude Code.

---

```text
You are acting as Senior Product Designer and Brand Director for AUKIY Intelligence OS.

PROJECT CONTEXT

You are working inside an existing functional dashboard.

The dashboard is a human-approved outreach operator console for DealSense / AUKIY local execution.

The dashboard currently works.

Your job is NOT to redesign it.

Your job is to refine the existing UI into a premium AUKIY visual system.

IMPORTANT EXECUTION RULES

DO NOT redesign the application.
DO NOT change workflow.
DO NOT change layout structure.
DO NOT change business logic.
DO NOT change data flow.
DO NOT change approval logic.
DO NOT change WhatsApp opening behavior.
DO NOT add automation.
DO NOT add animations.
DO NOT add glassmorphism.
DO NOT add gradients.
DO NOT add trendy SaaS styling.
DO NOT add cyberpunk styling.
DO NOT add gaming-style glow.
DO NOT overdecorate.

Only refine the existing UI.

BRAND POSITIONING

AUKIY is:

- Founder-led intelligence systems company
- Executive technology brand
- Systems over noise
- Quiet authority
- Premium software infrastructure
- Strategic execution
- Human-in-the-loop AI systems

The UI should feel closer to:

- Linear
- Anthropic
- Palantir
- Enterprise operator consoles
- Mission-critical internal software

NOT:

- Gaming dashboard
- Crypto platform
- Esports UI
- Cyberpunk interface
- Startup landing page
- Generic Bootstrap admin panel
- Trendy SaaS marketing dashboard

OBJECTIVE

Increase perceived quality from approximately 8.8/10 to 9.5/10 while keeping the same structure.

This should feel like a serious software company operating mission-critical systems.

The interface should become calmer, more disciplined, more premium, and easier to scan.

COLOR SYSTEM

Use this AUKIY color system:

Primary Brand Color:
Deep Crimson: #9D0F18

Background:
#050505

Surface:
#0B0B0D

Elevated Surface:
#111114

Primary Text:
#E8E8E8

Secondary Text:
#B8B8B8

Muted Text:
#8A8A8A

Subtle Border:
#242428

Success:
#2E6A4F

Warning:
#C49A3A

Danger:
#9D0F18

DESIGN RULES

1. Reduce visible red usage by approximately 30%.

Red should only represent:
- Brand identity
- Primary actions
- Important emphasis
- True danger/reject states

Do not use red for neutral information.

2. Remove red from informational labels.

Examples:

UNKNOWN
BELUM ADA
Tiada

These should use muted gray or warning amber depending on meaning.

If it means missing but not critical, use muted gray.
If it means attention needed, use warning amber.

3. APPROVED_TO_SEND badge

Replace bright/default green appearance.

Use premium dark emerald styling.

It should feel enterprise-grade, calm, and trustworthy.

Suggested treatment:
- dark emerald background
- subtle emerald border
- muted light green text
- no glow

4. Card borders

Current red glow / red border intensity is too strong.

Reduce border brightness and glow intensity by 30–50%.

Cards should feel expensive and subtle.

Use subtle borders and restrained shadows.

5. Typography hierarchy

Improve visual hierarchy.

Labels:
- smaller
- muted
- uppercase allowed
- increased letter spacing
- less visual weight

Values:
- brighter
- stronger
- easier to scan

Important section headings:
- clear
- premium
- not oversized

6. Buttons

Keep all functionality.

Improve visual consistency and wording.

Rename visible button labels only if safe and simple:

YES / Approve & Open → APPROVE
EDIT → EDIT
NO → REJECT
Mark Replied → MARK REPLIED
Follow-up Draft → FOLLOW-UP DRAFT

Primary action:
APPROVE

Secondary action:
EDIT

Danger action:
REJECT

Ensure visual hierarchy clearly communicates decision importance.

Primary action should be most visible.
Secondary actions should be quieter.
Reject should be controlled, not loud.

7. Spacing

Audit all padding and margins.

Increase visual breathing room where appropriate.

Avoid crowded sections.

Do not make the dashboard oversized.

Improve readability without changing layout structure.

8. Premium Audit

Review:
- colors
- spacing
- borders
- typography
- status indicators
- button hierarchy
- visual noise
- scanning clarity

9. Visual Weight Audit

Reduce visual noise.

Every visible element must justify its existence.

Prefer fewer stronger visual signals over many weak signals.

The dashboard should feel calm, disciplined, and expensive.

10. Change Priority Framework

Prioritize changes in this order:

Priority A — High Impact:
- Visual hierarchy
- Status colors
- Typography hierarchy
- Button hierarchy

Priority B — Medium Impact:
- Borders
- Surface contrast
- Padding and spacing

Priority C — Low Impact:
- Minor polish
- Micro refinements

Do not spend significant effort on low-impact cosmetic changes.

The goal is not visual novelty.

The goal is higher trust, clarity, and perceived software quality.

11. Enterprise Software Rule

Every design decision must answer:

"Does this increase operator clarity and trust?"

If not, remove it or keep it unchanged.

Avoid decorative design.

Avoid visual features that exist only to look modern.

Prefer functional elegance over visual creativity.

The interface should feel like software used to make business decisions, not software used to impress designers.

12. AUKIY Design Doctrine

Built In Silence.

Systems Over Noise.

Reduce unnecessary visual signals.

Use fewer colors.

Use fewer accents.

Use stronger hierarchy.

Increase clarity.

Increase confidence.

Increase trust.

The dashboard should feel calm, disciplined, intentional, and expensive.

EXECUTION FORMAT

Phase 1 — UI Audit Report

Before editing files, inspect the current UI files and provide:

1. Current UI issues found
2. Exact files that need changes
3. Proposed changes
4. Expected visual impact
5. Risks or things you will avoid

STOP after Phase 1.

Wait for my approval before modifying files.

Phase 2 — Apply Refinements

Only after I approve:

1. Apply the refinements directly
2. Keep changes minimal and focused
3. Do not touch business logic
4. Do not change workflow
5. Do not introduce new dependencies unless absolutely necessary
6. Provide a concise summary of files changed
7. Provide before/after explanation

FINAL QUALITY TARGET

The result should feel like:

A premium operator console for a founder-led intelligence systems company.

Not flashy.
Not generic.
Not noisy.
Not playful.
Not trendy.

Calm.
Disciplined.
Clear.
Trustworthy.
Expensive.
Operational.

STOP NOW.

Begin with Phase 1 only.
```

---

# Expected Result After Claude Applies It

If applied correctly, the dashboard should move from:

> Premium internal tool

into:

> Premium AUKIY operator console

Expected improvement:

| Area | Before | After Target |
|---|---:|---:|
| Brand Fit | 8.8 | 9.5 |
| Premium Feel | 8.5 | 9.4 |
| Enterprise Feel | 8.4 | 9.3 |
| Operator Clarity | 8.6 | 9.5 |
| AUKIY Alignment | 9.0 | 9.6 |

---

# Approval Guidance

After Claude returns Phase 1, approve only if the proposal follows these rules:

- No redesign
- No workflow change
- No business logic change
- No new visual gimmicks
- Red usage reduced
- Status colors improved
- Typography hierarchy improved
- Buttons clearer
- Overall UI calmer and more premium

If Claude suggests major layout changes, reject that part.

If Claude suggests animation, gradients, glassmorphism, or cyberpunk effects, reject immediately.

