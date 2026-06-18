You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Execute Patch 3 — Prospect Modal Pipeline Clarity.

Goal:
Repair the prospect modal so the operator can clearly understand the pipeline state and the next action for each prospect.

This is a UI/UX clarity patch only.

Do NOT add new features.
Do NOT refactor the whole app.
Do NOT change lead data.
Do NOT change WhatsApp flow.
Do NOT add auto-send.

---

CURRENT PROBLEM

The prospect modal is still confusing.

When the operator opens a prospect card, it is not immediately clear:

1. What prospect is being viewed
2. What status the prospect is in
3. Whether the lead is locked
4. What the next action should be
5. Which buttons are available
6. Which buttons are unavailable
7. What the small colored dot means
8. Whether the prospect is ready for outreach or already closed

---

GOAL

At the top of the modal, show a clear pipeline summary:

* Prospect name
* Status
* Deal state
* Lock state
* Next action
* Short explanation

The operator should know what to do within 3 seconds.

---

REQUIRED MODAL HEADER STRUCTURE

At the very top of the prospect modal, above the prospect details grid, add a clear header:

Example:

Zira Beauty Spa
Status: CONTACTED
Deal: OPEN
Next action: Wait for reply or prepare follow-up
Lock: No

For CLOSED_WON:

Zira Beauty Spa
Status: CLOSED_WON
Deal: CLOSED_WON
Next action: View only
Lock: CLOSED WON

For CLOSED_LOST:

Test Import Spa
Status: CLOSED_LOST
Deal: CLOSED_LOST
Next action: View only
Lock: CLOSED LOST

---

REMOVE / REPLACE UNCLEAR DOT

If the modal currently shows a small colored dot near the close button, do not leave it unexplained.

Either:

1. Remove the dot completely

OR

2. Replace it with a clear text badge:

STATUS: NEW
STATUS: CONTACTED
STATUS: CLOSED WON
STATUS: CLOSED LOST

Preferred:
Replace dot with text badge.

Do not use unexplained color-only indicators.

---

PIPELINE STATES

Use these readable pipeline meanings:

NEW:

* Meaning: Prospect baru masuk. Belum outreach.
* Next action: Generate preview or prepare first outreach DM.

PREVIEW_READY:

* Meaning: Preview sudah tersedia. DM boleh disemak.
* Next action: Review DM and approve outreach.

APPROVED:

* Meaning: DM sudah approved tetapi belum confirmed sent.
* Next action: Open WhatsApp / confirm sent.

CONTACTED:

* Meaning: First DM sudah dihantar / prospect sudah contacted.
* Next action: Wait for reply or prepare follow-up.

REPLIED:

* Meaning: Prospect sudah reply.
* Next action: Use ResponseOps / close path.

FOLLOW_UP:

* Meaning: Follow-up diperlukan.
* Next action: Prepare follow-up draft.

CLOSED_WON:

* Meaning: Deal menang.
* Next action: View only.

CLOSED_LOST:

* Meaning: Deal lost.
* Next action: View only.

UNKNOWN:

* Meaning: Status not clear.
* Next action: Review prospect manually.

---

STATUS RESOLUTION

Create or use a helper function if needed:

getLeadStatus(lead)

It should safely resolve status from existing fields:

lead.prospectStatus
lead.status
lead.dealStatus
lead.pipelineStatus

Priority:

1. CLOSED_WON / CLOSED_LOST if any status/deal field says closed
2. REPLIED
3. FOLLOW_UP
4. CONTACTED
5. APPROVED
6. PREVIEW_READY
7. NEW
8. UNKNOWN

Do not mutate data.
Display only.

---

LOCK STATE

A lead is locked if:

lead.prospectStatus === CLOSED_WON
or lead.status === CLOSED_WON
or lead.dealStatus === CLOSED_WON
or lead.prospectStatus === CLOSED_LOST
or lead.status === CLOSED_LOST
or lead.dealStatus === CLOSED_LOST

For locked leads:

Show:

Lead locked — view only. No outreach action available.

Disable unavailable action buttons visually and functionally:

* APPROVE & OPEN WHATSAPP
* EDIT MANUALLY / SAVE EDIT
* REWRITE DM / REMAKE CTA
* MARK REPLIED
* FOLLOW-UP DRAFT
* CLOSED WON if already won
* CLOSED LOST if already lost

Do not rely only on CSS. Guard click handlers if needed.

---

BUTTON CLARITY BY STATUS

Do not show every action as equally available.

For NEW:
Primary action hint:
Generate preview or prepare first outreach DM.
Allow:

* EDIT MANUALLY
* REWRITE DM
* APPROVE & OPEN WHATSAPP only if DM exists

For PREVIEW_READY:
Allow:

* OPEN PREVIEW if available
* EDIT MANUALLY
* REWRITE DM
* APPROVE & OPEN WHATSAPP

For CONTACTED:
Allow:

* MARK REPLIED
* FOLLOW-UP DRAFT
* OPEN PREVIEW if available
  Disable or de-emphasize:
* APPROVE & OPEN WHATSAPP unless deliberately allowed by existing logic

For REPLIED:
Allow:

* FOLLOW-UP DRAFT
* CLOSED WON
* CLOSED LOST
* RESPONSEOPS if already exists

For CLOSED_WON / CLOSED_LOST:
View only.
No outreach action available.

Important:
If hiding buttons is risky, keep them visible but disabled with clear disabled style and title/helper text.

---

MODAL TITLE

The modal must show the prospect/business name at the top.

Use fallback:

lead.businessName
lead.name
lead.business
"Unknown Prospect"

Do not modify the actual data.

---

STYLE REQUIREMENTS

Use ApexProspect / AUKIY theme:

* matte black
* graphite panel
* crimson status accents
* muted green for won
* muted gray for lost
* muted blue for contacted/info
* no neon
* readable text
* compact but clear

Add CSS classes if needed:

.modal-pipeline-header
.modal-prospect-title
.pipeline-badge
.pipeline-next-action
.pipeline-lock-note
.action-disabled

---

SECURITY

Use safe DOM/text handling.

* textContent for raw lead data
* textarea.value for DM
* safe href assignment
* no unsafe innerHTML with raw lead fields

---

FILES TO INSPECT

* public/app.js
* public/style.css
* public/index.html only if modal shell is static there

---

PHASE A — AUDIT ONLY

Do not modify files.

Report:

1. Where modal HTML is generated
2. Current modal title behavior
3. Where the small status dot is created/styled
4. Current status fields available on lead
5. Current button disable/lock logic
6. Whether closed leads are guarded in click handlers
7. Exact functions to patch
8. Exact files to patch
9. Confirmation no files modified

STOP.

---

PHASE B — IMPLEMENT PATCH

After approval only.

Implement:

1. Modal pipeline header
2. Prospect name at top
3. Clear status badge
4. Deal state display
5. Lock state display
6. Next action display
7. Replace/remove unexplained colored dot
8. Button availability clarity by status
9. Locked lead view-only note
10. Safe DOM handling
11. AUKIY/Apex styling

Do not modify lead data.

STOP and report:

1. Files changed
2. Modal prospect name added: yes/no
3. Status badge added: yes/no
4. Next action added: yes/no
5. Lock state added: yes/no
6. Colored dot removed or explained: yes/no
7. Closed leads view-only: yes/no
8. Buttons disabled for locked leads: yes/no
9. Lead data untouched: yes/no
10. WhatsApp/approval flow unchanged: yes/no
11. Auto-send not added: yes/no

---

PHASE C — MANUAL VERIFICATION

Verify with at least:

1. Zira Beauty Spa
2. LockTest Business
3. One NEW or OPEN test lead if available
4. One CLOSED_LOST lead if available

Check:

1. Prospect name visible at modal top
2. Status visible as text badge
3. Next action visible
4. Lock note visible for CLOSED_WON / CLOSED_LOST
5. Locked lead buttons disabled
6. NEW/OPEN lead still usable
7. DM Draft section still works
8. Preview section still visible
9. No auto-send
10. Dashboard still loads at localhost:3777

Print:

=== PATCH 3 MODAL PIPELINE CLARITY COMPLETE — WAITING FOR HUMAN APPROVAL ===
