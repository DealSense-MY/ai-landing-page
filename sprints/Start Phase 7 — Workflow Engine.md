You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Start Phase 7 — Workflow Engine.

Sprint file:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\sprints\PHASE_7_WORKFLOW_ENGINE.md

Current pre-flight status:
PASS.

Confirmed:

* Zira Beauty Spa prospectStatus is now CONTACTED
* PATCH /api/leads/:id now accepts:

  * previewClicked
  * previewClickCount
  * lastPreviewClickedAt
* Phase 7 has NOT been implemented yet
* Approval flow unchanged
* WhatsApp flow unchanged
* No auto-send added
* No new npm packages
* previewRenderer.js does not exist; renderer logic is inline in public/app.js
* This naming gap should not trigger a refactor

---

CORE DOCTRINE

Do NOT auto-send messages.

Human approval remains mandatory.

YES / APPROVE means:

* approve current draft
* open WhatsApp with prefilled message
* human manually presses Send

Do not change this.

---

PHASE 7 GOAL

Build Workflow Engine features that help the operator decide what to do next.

Expected direction:

* Smart action suggestions
* Daily tracker
* Stale lead detection
* Follow-up overdue detection
* Preview tracking support
* Clear next action per lead

This should support execution, not overbuild.

---

DO NOT MODIFY

* approval/WhatsApp send flow
* auto-send rules
* core outreach doctrine
* existing Phase 6D fixes
* import/export flow unless required by sprint
* server response shape unless required and safe
* DM copy unless sprint explicitly requires it
* lead IDs
* existing status meanings

---

PHASE CONTROL

PHASE 1 — READ + AUDIT ONLY

Do not modify files.

Tasks:

1. Read PHASE_7_WORKFLOW_ENGINE.md fully.
2. Inspect current files:

   * server.js
   * public/app.js
   * public/index.html
   * public/style.css
   * data/leads.json
3. Identify exact implementation points.
4. Confirm pre-flight fields are present.
5. Confirm Zira is CONTACTED.
6. Confirm no auto-send logic exists.
7. Confirm Phase 6D fixes still intact.

Return:

1. Phase 7 requirements summary
2. Files likely to change
3. Functions likely to patch
4. Smart Action Panel logic plan
5. Daily Tracker logic plan
6. Stale detection logic plan
7. Preview tracking logic plan
8. Risks
9. What must not be touched
10. Confirmation no files modified

Then STOP and print:

=== PHASE 1 COMPLETE — WAITING FOR HUMAN APPROVAL ===

---

PHASE 2 — IMPLEMENT WORKFLOW ENGINE UI

Only after approval.

Implement UI sections required by the sprint:

* Smart Action Panel
* Daily Tracker
* Stale Lead / Follow-up indicators
* Any required badges or next-action display

Do not alter approval/WhatsApp flow.

STOP after implementation report.

---

PHASE 3 — IMPLEMENT WORKFLOW LOGIC

Only after approval.

Implement:

* overdue follow-up detection
* stale lead detection
* preview tracking indicators
* daily activity calculations
* smart next-action logic

Use existing lead fields where possible.

Do not add new packages.

STOP after implementation report.

---

PHASE 4 — TEST REPORT

Only after approval.

Verify:

1. Zira appears correctly as CONTACTED
2. Zira can appear in follow-up overdue bucket if date logic qualifies
3. NEW leads remain NEW
4. CLOSED_WON leads stay locked
5. Smart Action Panel does not suggest contacting locked leads
6. Preview tracking fields persist via PATCH
7. Dashboard loads localhost:3777
8. Approval/WA flow unchanged
9. No auto-send added
10. No regression to Phase 6D fixes

STOP.

---

IMPORTANT:
Do not continue phases automatically.
Do not implement Phase 8.
Do not refactor into modules yet.
