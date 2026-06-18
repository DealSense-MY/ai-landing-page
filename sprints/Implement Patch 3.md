APPROVED — Proceed to Phase B only.

TASK:
Implement Patch 3 — Prospect Modal Pipeline Clarity.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

Allowed files:

* public/app.js
* public/style.css

Do NOT modify:

* public/index.html unless absolutely required
* server.js
* data/leads.json
* import/export logic
* WhatsApp flow
* approval flow
* auto-send rules
* DM Draft behavior except where needed to display status/header safely
* lead records

---

IMPLEMENT ONLY THESE CHANGES

1. Add clear modal pipeline header at the top of the lead card.

The modal must show:

* Prospect/business name
* Status
* Deal state
* Lock state
* Next action
* Short meaning/explanation

Example for open lead:

Zira Beauty Spa
Status: CONTACTED
Deal: OPEN
Lock: No
Next action: Wait for reply or prepare follow-up.

Example for locked lead:

Zira Beauty Spa
Status: CLOSED_WON
Deal: CLOSED_WON
Lock: CLOSED WON
Next action: View only.
Lead locked — view only. No outreach action available.

---

2. Add helper function getLeadStatus(lead)

Status priority must be:

1. CLOSED_WON / CLOSED_LOST if any of these fields say closed:

   * lead.prospectStatus
   * lead.status
   * lead.dealStatus
   * lead.pipelineStatus
   * lead.lockReason

2. REPLIED

3. FOLLOW_UP

4. CONTACTED

5. APPROVED

6. PREVIEW_READY

7. NEW

8. UNKNOWN

Do not mutate lead data.
Display only.

---

3. Add helper function getNextAction(status)

Return readable operator instructions:

NEW:
Generate preview or prepare first outreach DM.

PREVIEW_READY:
Review DM and approve outreach.

APPROVED:
Open WhatsApp / confirm sent.

CONTACTED:
Wait for reply or prepare follow-up.

REPLIED:
Use ResponseOps / close path.

FOLLOW_UP:
Prepare follow-up draft.

CLOSED_WON:
View only.

CLOSED_LOST:
View only.

UNKNOWN:
Review prospect manually.

---

4. Strengthen lock detection.

Current isLocked(id) only checks lead.locked.

Update lock logic so a lead is considered locked if:

* lead.locked === true
  OR
* lead.prospectStatus === CLOSED_WON
  OR
* lead.status === CLOSED_WON
  OR
* lead.dealStatus === CLOSED_WON
  OR
* lead.pipelineStatus === CLOSED_WON
  OR
* lead.lockReason === CLOSED_WON
  OR
* lead.prospectStatus === CLOSED_LOST
  OR
* lead.status === CLOSED_LOST
  OR
* lead.dealStatus === CLOSED_LOST
  OR
* lead.pipelineStatus === CLOSED_LOST
  OR
* lead.lockReason === CLOSED_LOST

This must protect UI and click handlers.

Do not rely only on CSS.

---

5. Replace unclear technical status display.

Current badge may show raw status like APPROVED_TO_SEND.

Change modal header/status display into readable text:

STATUS: NEW
STATUS: CONTACTED
STATUS: REPLIED
STATUS: CLOSED WON
STATUS: CLOSED LOST

Do not use unexplained color-only indicators.

---

6. Button availability for locked leads.

For CLOSED_WON or CLOSED_LOST:

Disable visually and functionally:

* APPROVE & OPEN WHATSAPP
* EDIT MANUALLY
* SAVE EDIT
* REWRITE DM
* MARK REPLIED
* FOLLOW-UP DRAFT
* CLOSED WON if already won
* CLOSED LOST if already lost

Show clear note:

Lead locked — view only. No outreach action available.

---

7. Keep open leads usable.

For NEW / PREVIEW_READY / CONTACTED / REPLIED leads, do not accidentally lock all actions.

Only disable based on existing safe rules.

---

8. CSS styling.

Add styles:

* .modal-pipeline-header
* .modal-prospect-title
* .pipeline-badge
* .pipeline-next-action
* .pipeline-lock-note
* .pipeline-muted
* .action-disabled if needed

Use ApexProspect / AUKIY theme:

* matte black
* graphite
* crimson accent
* muted green for won
* muted gray for lost
* muted blue/info for contacted
* readable text
* no neon

---

SECURITY

Use:

* textContent for lead fields
* textarea.value for DM
* safe href assignments
* no unsafe innerHTML with raw lead data

---

AFTER IMPLEMENTATION REPORT

Return:

1. Files changed
2. getLeadStatus added: yes/no
3. getNextAction added: yes/no
4. Modal prospect title added: yes/no
5. Status badge readable: yes/no
6. Deal state shown: yes/no
7. Lock state shown: yes/no
8. Next action shown: yes/no
9. Lock detection strengthened beyond lead.locked: yes/no
10. Closed leads view-only: yes/no
11. Click handlers protected by stronger lock detection: yes/no
12. Open leads still usable: yes/no
13. Lead data untouched: yes/no
14. data/leads.json untouched: yes/no
15. server.js untouched: yes/no
16. WhatsApp/approval flow unchanged: yes/no
17. Auto-send not added: yes/no

STOP and print:

=== PATCH 3 MODAL PIPELINE CLARITY PHASE B COMPLETE — WAITING FOR HUMAN APPROVAL ===
