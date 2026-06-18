# PHASE_4_AUTOLOCK_AMENDMENTS_SAFE_RECORDS.md

Claude Code, execute Phase 4 only.

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

Phase 2: PASS
- Pipeline tabs added.
- Prospect table/list added.
- Zira lead still visible.
- Existing card behavior preserved.
- Approve still opens WhatsApp only.

Phase 3: COMPLETE
- AutoLog + Confirm Sent implemented.
- Safe manual WhatsApp workflow preserved.
- Server running.
- Do not proceed to Phase 4 until Aliff manually verifies localhost:3777.

PHASE 4 OBJECTIVE:
Implement AutoLock and Amendments for closed prospect records.

This phase must make closed records safe:
- Closed Won locks the record.
- Closed Lost locks the record.
- Locked records cannot be edited directly.
- Any correction after lock must be added as an amendment.
- AutoLog must record all lock and amendment events.

CORE RULES:
- Do not rewrite the app.
- Do not redesign UI.
- Do not change stack.
- Keep localhost:3777 working.
- Preserve existing app behavior.
- Preserve pipeline tabs and prospect table.
- Preserve Confirm Sent behavior.
- Preserve safe manual WhatsApp workflow.
- No auto-send.
- No hidden sending.
- No Baileys.
- No WhatsApp automation.
- No login, billing, SaaS database, or cloud backend.
- Patch only what Phase 4 requires.
- Do not build Export Logs yet.
- Do not build Run Log timeline yet.
- Do not proceed to Phase 5.

FILES TO INSPECT FIRST:
- `server.js`
- `public/app.js`
- `public/index.html`
- `public/style.css`
- `data/leads.json`
- `data/run-log.json`

DO NOT MODIFY DATA FILES DIRECTLY UNLESS REQUIRED BY APP ACTION TESTING.
If testing changes data, preserve backup and report exactly what changed.

REQUIRED EVENTS FOR THIS PHASE:
- CLOSED_WON
- CLOSED_LOST
- LOCKED
- AMENDMENT_ADDED

Existing Phase 3 events must remain working:
- CTA_APPROVED
- WHATSAPP_OPENED
- SENT_MANUAL_CONFIRMED

AUTOLOCK REQUIREMENTS:

1. Closed Won Flow

When user clicks Closed Won:
- Log `CLOSED_WON`
- Set:
  - `dealStatus`: `CLOSED_WON`
  - `prospectStatus`: `CLOSED_WON` if this does not break existing filters
  - `closedAt`: current ISO timestamp
  - `lastActionAt`: current ISO timestamp
- Lock the record:
  - `locked`: true
  - `lockedAt`: current ISO timestamp
  - `lockReason`: `CLOSED_WON`
- Log `LOCKED`
- Save to `leads.json`
- Save events to lead `events` array and `run-log.json`
- UI should show locked state clearly.

2. Closed Lost Flow

When user clicks Closed Lost:
- Log `CLOSED_LOST`
- Set:
  - `dealStatus`: `CLOSED_LOST`
  - `prospectStatus`: `CLOSED_LOST` if this does not break existing filters
  - `closedAt`: current ISO timestamp
  - `lastActionAt`: current ISO timestamp
- Lock the record:
  - `locked`: true
  - `lockedAt`: current ISO timestamp
  - `lockReason`: `CLOSED_LOST`
- Log `LOCKED`
- Save to `leads.json`
- Save events to lead `events` array and `run-log.json`
- UI should show locked state clearly.

3. Locked Record UI

For locked records:
- Show a visible badge:
  `LOCKED`
- Show:
  - lockedAt
  - lockReason
- Disable direct editing actions.

Disable or block these actions on locked record:
- Edit DM draft
- Approve
- Confirm Sent
- Mark Replied
- Paste Reply / Save Reply
- Follow-Up Draft
- Closed Won
- Closed Lost
- Reject if it mutates record

Read-only actions may remain:
- View data
- Export CSV
- Export JSON
- View events if already present
- Add amendment

Important:
Locked records should not silently fail.
If user tries a disabled action, show a clear message:
`Record is locked. Add an amendment instead.`

4. Amendments UI

Add an Amendments section inside each prospect card.

For all records:
- Show existing amendments list if available.

For locked records:
- Show textarea:
  `Add amendment / correction note`
- Show button:
  `Add Amendment`

For unlocked records:
- You may show amendments section as read-only or allow amendment, but locked record support is required.

When Add Amendment is clicked:
- Validate note is not empty.
- Add object to `lead.amendments`:
  - `id`
  - `timestamp`
  - `actor`: `Aliff`
  - `note`
  - `reason`: optional if provided
- Log `AMENDMENT_ADDED`
- Save event to lead `events` array and `run-log.json`
- Update `lastActionAt`
- Do not change original locked fields unless explicitly required.
- Do not unlock the record.

5. Backend Safety

If needed, add minimal API endpoints:
- `POST /api/leads/:id/lock`
- `POST /api/leads/:id/amendments`

Or reuse existing save/update routes safely.

Validation:
- reject unknown lead
- reject empty amendment
- if already locked, do not duplicate lock unless action is idempotent
- if already closed, do not overwrite lockReason accidentally
- never remove old fields
- never remove existing events
- never remove existing amendments

6. Frontend Safety

After any lock or amendment action:
- Refresh/re-render current lead
- Pipeline table counts update
- Prospect row status updates
- Card reflects locked state
- No duplicate cards
- No duplicate table rows

7. No Export Logs / Run Log Timeline Yet

Do not build:
- run log timeline UI
- export logs button
- event filtering dashboard
- analytics
- SaaS features

Those are Phase 5.

ACCEPTANCE CRITERIA:

After Phase 4:
1. `npm start` runs without error.
2. `localhost:3777` loads.
3. Zira lead appears in table/list and card.
4. Pipeline tabs still work.
5. Prospect table still works.
6. Approve still opens WhatsApp only for unlocked records.
7. Confirm Sent still works for unlocked records.
8. Closed Won sets dealStatus/prospectStatus correctly.
9. Closed Won creates `CLOSED_WON` event.
10. Closed Won creates `LOCKED` event.
11. Closed Lost sets dealStatus/prospectStatus correctly.
12. Closed Lost creates `CLOSED_LOST` event.
13. Closed Lost creates `LOCKED` event.
14. Locked badge appears.
15. lockedAt appears.
16. lockReason appears.
17. Locked record cannot be edited directly.
18. Locked record direct actions are disabled or safely blocked.
19. Amendment can be added to locked record.
20. Amendment creates `AMENDMENT_ADDED` event.
21. Amendment is saved in `lead.amendments`.
22. Amendment does not unlock the record.
23. Events are saved in lead `events` array.
24. Events are saved in `run-log.json`.
25. Refresh preserves locked state and amendments.
26. No duplicate leads.
27. No data loss.
28. No Baileys or auto-send code introduced.
29. Browser console has no breaking errors.

MANUAL TEST CHECKLIST:

At `localhost:3777`:

1. Open dashboard.
2. Confirm Zira visible.
3. Confirm Phase 3 Confirm Sent still exists/works if record is unlocked.
4. Click Closed Won on a test/unlocked lead.
5. Confirm locked badge appears.
6. Confirm direct edit buttons are disabled or safely blocked.
7. Try Edit DM draft.
8. Confirm it does not allow direct edit.
9. Add amendment note:
   `Correction: manual note added after lock.`
10. Confirm amendment appears in amendment list.
11. Inspect `data/leads.json`:
    - `locked`: true
    - `lockedAt`: exists
    - `lockReason`: `CLOSED_WON` or `CLOSED_LOST`
    - `amendments` contains the new note
    - `events` contains `CLOSED_WON` or `CLOSED_LOST`
    - `events` contains `LOCKED`
    - `events` contains `AMENDMENT_ADDED`
12. Inspect `data/run-log.json`:
    - same events exist.
13. Refresh browser.
14. Confirm locked state and amendment persist.
15. Confirm no duplicate leads.

REPORT BACK FORMAT:

Phase 4 Build Report

1. Files inspected
2. Files changed
3. AutoLock implementation details
4. Locked UI behavior
5. Actions disabled or blocked on locked records
6. Amendments implementation details
7. Events wired
8. Backend endpoint changes
9. Whether Phase 3 Confirm Sent still works
10. WhatsApp safety confirmation
11. Whether any data file changed during testing
12. Terminal output summary
13. Browser/manual test checklist
14. Risks or issues found
15. Whether safe to proceed to Phase 5

STOP after Phase 4 report.

DO NOT proceed to Phase 5.
