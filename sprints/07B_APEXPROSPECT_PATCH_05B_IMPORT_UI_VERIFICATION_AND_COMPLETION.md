# 07B_APEXPROSPECT_PATCH_05B_IMPORT_UI_VERIFICATION_AND_COMPLETION.md

ROLE

You are Claude Sonnet running inside Claude Code.

PROJECT

ApexProspect by AUKIY

PATH

tools/semi-auto-outreach/

ENVIRONMENT

localhost:3777

---

# CONTEXT

PATCH 1
PASS

PATCH 2
PASS

PATCH 3
PASS

PATCH 4
PASS

PATCH 5
PASS (according to previous report)

However:

Before moving to Outreach Intelligence,
we must verify whether the Top10 Import workflow is truly usable by a human operator.

---

# PROJECT MISSION

ApexProspect is an AI-Assisted Prospect-to-Revenue Operating System.

Target workflow:

AI Research
↓
Generate Prospect JSON
↓
Paste Into ApexProspect
↓
Import
↓
Top10 Ranked
↓
Outreach
↓
Reply
↓
Preview
↓
Payment
↓
Closed Won

If the operator cannot complete this workflow from the UI,
PATCH 5 is NOT truly complete.

---

# MISSION

Audit and verify the entire Batch Import workflow.

Do NOT assume.

Inspect actual implementation.

---

# VERIFY

## A. IMPORT UI EXISTS

Verify:

Can operator:

1. Open UI
2. Find Import Panel
3. Paste JSON
4. Click Import

without using API tools manually?

Report:

YES / NO

---

## B. IMPORT UI IS WIRED

Verify:

Import button actually calls backend.

Not placeholder.

Not TODO.

Not dead code.

Report:

YES / NO

Show:

* function name
* route called

---

## C. BACKEND ROUTE EXISTS

Verify:

Actual import endpoint exists.

Report:

* route path
* method
* file location

---

## D. IMPORT RESULT FEEDBACK

Verify operator receives:

* imported count
* skipped count
* duplicate count
* validation errors

after import.

Report:

YES / NO

---

## E. TOP10 DISPLAY

Verify:

After import:

Top10 ranking is visible somewhere.

Report:

YES / NO

If yes:

Where?

If no:

Mark as missing.

---

## F. IMPORT TEST

Create test batch:

Prospect A
(valid)

Prospect B
(valid)

Prospect C
(invalid)

Import through UI.

Verify:

* valid imported
* invalid rejected
* duplicate detection works

---

## G. FULL OPERATOR TEST

Operator workflow:

Paste JSON
↓
Import
↓
View Imported Lead
↓
Open Lead
↓
See Audit Score
↓
See Preview Readiness
↓
See Payment Section
↓
Generate Preview

Verify every step.

---

# RULE

DO NOT REFACTOR.

DO NOT REDESIGN.

DO NOT PATCH YET.

FIRST VERIFY.

---

# IF MISSING

Only if a missing piece is discovered:

Implement the smallest patch required.

Examples:

Missing textarea
Missing import button
Missing import result display
Missing Top10 display

Patch only that missing piece.

No extra features.

---

# PATCH RULES

Use:

* explicit assignment
* standard JSON envelope
* existing event architecture
* existing scoring functions
* existing migration logic

Do not introduce new architecture.

---

# REPORT FORMAT

## Import UI Exists

YES / NO

## Import Button Wired

YES / NO

## Backend Route

(details)

## Import Feedback

YES / NO

## Top10 Display

YES / NO

## Operator Workflow Result

PASS / FAIL

## Missing Components

(list)

## Patch Applied

(list)

## Files Changed

(list)

## Regression Checks

* preview generation
* payment flow
* WhatsApp approval
* timeline logging
* exports

## Final Verdict

PATCH 5 COMPLETE

or

PATCH 5 INCOMPLETE

and explain exactly why.

STOP.
