# PHASE_3_AUTOLOG_CONFIRM_SENT_SAFE_WA.md

Claude Code, execute Phase 3 only.

PROJECT:
DealSense Prospects Operator / Landing Page Engine / Customer Acquisition

LOCAL APP:
http://localhost:3777

CURRENT STATUS:
Phase 1: PASS
- Data migration safe.
- `run-log.json` exists.
- `leads.json` fields preserved.
- New fields added.
- No auto-send code.
- Migration idempotent.

Phase 2: PASS pending Aliff manual browser verification
- Pipeline tabs added.
- Prospect table/list added.
- Zira lead still visible.
- Existing card behavior preserved.
- Approve still opens WhatsApp only.
- No data files changed.

PHASE 3 OBJECTIVE:
Implement AutoLog event wiring and Confirm Sent button for the safe manual WhatsApp workflow.

This phase must prove:
Approve is not equal to Sent.

Correct flow:
1. Aliff clicks Approve.
2. System logs CTA_APPROVED.
3. WhatsApp opens with prefilled message.
4. System logs WHATSAPP_OPENED.
5. Aliff manually presses send in WhatsApp.
6. Aliff returns to dashboard and clicks Confirm Sent.
7. System logs SENT_MANUAL_CONFIRMED.

CORE SAFETY RULES:
- No auto-send.
- No hidden sending.
- No Baileys.
- No WhatsApp automation.
- Do not send WhatsApp messages through backend.
- Do not mark sent automatically when WhatsApp opens.
- Approve must not equal sent.
- Confirm Sent must be a separate human action.
- Preserve existing WhatsApp open behavior.
- Preserve existing DM edit behavior.
- Preserve existing pipeline tabs and prospect table.
- Preserve existing prospect card behavior.
- Keep localhost:3777 working.
- Patch only what Phase 3 requires.
- Do not build AutoLock yet.
- Do not build Amendments yet.
- Do not build Export Logs yet.
- Do not redesign UI.

FILES TO INSPECT FIRST:
- `server.js`
- `public/app.js`
- `public/index.html`
- `public/style.css`
- `data/leads.json`
- `data/run-log.json`

DO NOT MODIFY DATA FILES DIRECTLY UNLESS REQUIRED BY APP ACTION TESTING.
If testing changes data, preserve backup and report exactly what changed.

REQUIRED AUTOLOG EVENTS FOR THIS PHASE:
- CTA_APPROVED
- WHATSAPP_OPENED
- SENT_MANUAL_CONFIRMED

OPTIONAL ONLY IF EXISTING BUTTONS ARE SIMPLE TO WIRE SAFELY:
- DM_DRAFT_EDITED

Do not wire the full event map yet unless it is already trivial and low-risk.

IMPLEMENTATION REQUIREMENTS:

1. Create/Use Central AutoLog Helper

Create a single safe helper for logging events.

It should write the event to:
A. the matching lead record `events` array
B. global `data/run-log.json`

Each event object should include:
- `id`
- `type`
- `leadId`
- `leadName` if available
- `timestamp`
- `source`: `operator-ui`
- `actor`: `Aliff`
- `metadata` object

Use simple local JSON storage only.
No database.
No cloud.
No SaaS architecture.

2. Add API Endpoint for Logging Events

Add a minimal backend route, for example:

POST `/api/leads/:id/events`

Expected request body:
- `type`
- `metadata`

Response:
- updated lead or success object

Validation:
- reject missing lead id
- reject unknown lead
- reject missing event type
- never crash the app if run-log file is missing; recreate safely if needed

Do not expose any auto-send capability.

3. Wire Approve Button

Existing Approve flow must still open WhatsApp.

When Approve is clicked:
- log `CTA_APPROVED`
- open WhatsApp using existing openContact() behavior
- log `WHATSAPP_OPENED`

Important:
If logging fails, do not auto-send and do not silently mark sent.
Show a small safe warning if needed.

4. Add Confirm Sent Button

Add a visible `Confirm Sent` button to the prospect card after WhatsApp has been opened or after lead has `WHATSAPP_OPENED` event.

Button label:
`Confirm Sent`

Button purpose:
Aliff clicks it only after he manually sends the message in WhatsApp.

When clicked:
- log `SENT_MANUAL_CONFIRMED`
- update safe lead fields if already present:
  - `contactedAt`
  - `lastActionAt`
  - `humanDecision`: `SENT_MANUALLY_CONFIRMED`
  - `prospectStatus`: `CONTACTED` if this does not break existing filters
- show clear UI feedback:
  `Manual send confirmed`

Do not open WhatsApp from Confirm Sent.
Do not send any message from Confirm Sent.

5. UI Safety Copy

Add a small note near Confirm Sent:
`Click only after you manually pressed send in WhatsApp.`

Keep it simple and clear.

6. Preserve Existing Behavior

Must still work:
- pipeline tabs
- prospect table/list
- Zira row
- existing prospect card
- DM edit
- Approve opens WhatsApp
- Reject
- Mark Replied
- Follow-Up Draft
- Closed Won
- Closed Lost
- Paste Reply
- CSV export
- JSON export

7. No AutoLock Yet

Do not implement locked behavior in this phase.
Do not disable editing based on locked field yet.
Do not add amendments yet.

ACCEPTANCE CRITERIA:

After Phase 3:
1. `npm start` runs without error.
2. `localhost:3777` loads.
3. Zira lead appears in table/list and card.
4. Approve still opens WhatsApp with prefilled message.
5. Approve does not auto-send.
6. Clicking Approve creates `CTA_APPROVED` event.
7. WhatsApp open creates `WHATSAPP_OPENED` event.
8. Confirm Sent button exists.
9. Confirm Sent does not open WhatsApp.
10. Confirm Sent does not send any message.
11. Confirm Sent creates `SENT_MANUAL_CONFIRMED` event.
12. Events are visible in lead `events` array.
13. Events are also saved in `run-log.json`.
14. Refresh does not remove events.
15. Pipeline tabs and prospect table still work.
16. DM edit still works.
17. No duplicate leads.
18. No data loss.
19. No Baileys or auto-send code introduced.
20. Browser console has no breaking errors.

MANUAL TEST CHECKLIST:

At `localhost:3777`:

1. Open dashboard.
2. Confirm Zira visible.
3. Click Approve.
4. Confirm WhatsApp opens with prefilled message.
5. Confirm message is not sent automatically.
6. Return to dashboard.
7. Confirm `Confirm Sent` button is visible.
8. Click Confirm Sent.
9. Confirm UI says manual send confirmed.
10. Inspect `data/leads.json`:
    - Zira has `CTA_APPROVED`
    - Zira has `WHATSAPP_OPENED`
    - Zira has `SENT_MANUAL_CONFIRMED`
11. Inspect `data/run-log.json`:
    - same events exist.
12. Refresh browser.
13. Confirm state persists.

REPORT BACK FORMAT:

Phase 3 Build Report

1. Files inspected
2. Files changed
3. API endpoint added or modified
4. AutoLog helper details
5. Events wired
6. Confirm Sent button behavior
7. WhatsApp safety confirmation
8. Whether any data file changed during testing
9. Terminal output summary
10. Browser/manual test checklist
11. Risks or issues found
12. Whether safe to proceed to Phase 4

STOP after Phase 3 report.

DO NOT proceed to Phase 4.
