# PHASE_5_EXPORT_RUNLOG_IMPORT.md

Claude Code, execute Phase 5 only.

PROJECT:
DealSense Prospects Operator / Landing Page Engine / Customer Acquisition

LOCAL APP:
http://localhost:3777

CURRENT STATUS:
Phase 1: PASS — Data migration, run-log.json, idempotent migration
Phase 2: PASS — Pipeline tabs, prospect table, Zira visible
Phase 3: PASS — AutoLog, Confirm Sent, safe WA flow
Phase 4: PASS — AutoLock, Amendments, locked UI, all 29 criteria pass

PHASE 5 OBJECTIVE:
Four focused tasks:
1. Fix handleOk defense-in-depth gap (identified in Phase 4)
2. Run Log Timeline — collapsible events list per prospect card
3. Export Logs — download run-log.json as backup
4. Import Prospects — paste JSON array to import leads from ChatGPT agent

CORE RULES:
- Do not rewrite the app.
- Do not redesign UI.
- Keep localhost:3777 working.
- Preserve all Phase 1-4 behavior.
- No auto-send.
- No hidden sending.
- No Baileys.
- No WhatsApp automation.
- No login, billing, SaaS database, or cloud backend.
- Patch only what Phase 5 requires.

FILES TO INSPECT FIRST:
- server.js
- public/app.js
- public/index.html
- public/style.css
- data/leads.json
- data/run-log.json

---

## TASK 1 — Fix handleOk Guard

In public/app.js, find handleOk function.

Add isLocked() guard at the very top:

```javascript
async function handleOk(id) {
  if (isLocked(id)) {
    showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.');
    return;
  }
  // ... rest of existing handleOk code unchanged
}
```

This is a small defensive patch only.
Do not change any other logic in handleOk.

---

## TASK 2 — Run Log Timeline

Add a collapsible "Run Log" section inside each prospect card.

Show the events[] array for that lead in reverse chronological order.

Each event row shows:
- event type (bold)
- timestamp (formatted local time)
- actor if available
- metadata summary if relevant (e.g. "via wa.me", "messageLength: 639")

UI requirements:
- Collapsed by default — show "▶ Run Log (N events)" toggle button
- Click toggle → expands inline list
- Click again → collapses
- Empty events → show "No events yet."
- Style: dark panel, muted text, consistent with AUKIY theme
- No external libraries needed — pure JS + CSS

Do not show events from run-log.json here.
Show only the lead's own events[] array.

---

## TASK 3 — Export Logs Button

Add an "Export Logs" button to the dashboard header area.
Place it near the existing CSV and JSON export buttons.

Button label: "↓ Logs"

When clicked:
- Fetch GET /api/logs or read run-log.json via new endpoint
- Download as: run-log-[timestamp].json
- Format: pretty-printed JSON array

Add backend endpoint:
GET /api/logs

Returns run-log.json content as JSON array.
If file missing or empty, return [].
Never crash if file missing.

---

## TASK 4 — Import Prospects (JSON Paste)

Add an Import Prospects feature.

UI:
- Add "↑ Import" button in dashboard header near "+ Add Lead"
- Click → shows import panel/modal (inline div, not browser modal)
- Import panel contains:
  - Textarea: "Paste JSON array from ChatGPT agent here..."
  - Button: "Import Prospects"
  - Button: "Cancel"
  - Result area: shows import summary after done

Import behavior:
- Accept JSON array format from ChatGPT agent output
- Support both formats:
  A. Full agent format: array of objects with operatorLiteLeadData nested
  B. Flat format: array of lead objects directly

For Format A, extract from operatorLiteLeadData:
```
id, businessName, lokasi, niche, platform, contact,
whatsapp, profileUrl, kelemahan, offer, defaultDm,
previewPath, screenshotPath, status, bestContactRoute,
humanDecision, editNotes
```
Also extract from landingPageEngineData if present.
Also extract scoringData.fitScore and scoringData.priority if present.

For Format B, use fields directly.

For each imported lead:
- Generate id if missing: businessName + lokasi → lowercase-dash format
- Set dateAdded = now if missing
- Set sourceRunId = generated UUID
- Set events = [{ eventType: "LEAD_IMPORTED", timestamp: now }]
- Set prospectStatus = lead.prospectStatus || lead.status || "NEW"
- Set dealStatus = "OPEN" if missing
- Set previewStatus = "NOT_BUILT" if missing
- Set locked = false if missing
- Set amendments = [] if missing

Duplicate check:
- Check by id exact match
- Check by whatsapp + businessName both matching
- If duplicate found: skip and add to "skipped" list
- Do not overwrite existing records

Validation:
- businessName is required — skip if missing
- whatsapp or contact must exist — warn if both missing but still import
- Show import summary: N imported, N skipped, N warnings

After import:
- Save updated leads.json
- Log LEAD_IMPORTED event for each new lead in run-log.json
- Refresh prospect table and pipeline tab counts
- Close import panel
- Show success message

Backend endpoint:
POST /api/leads/import

Accepts: { leads: [...] }
Returns: { imported: N, skipped: N, warnings: [...] }

---

## ACCEPTANCE CRITERIA

After Phase 5:
1. npm start runs without error.
2. localhost:3777 loads.
3. All Phase 1-4 behavior preserved.
4. handleOk has isLocked() guard.
5. Run Log toggle button visible in each prospect card.
6. Click toggle → events list expands.
7. Events show type, timestamp, actor, metadata.
8. Collapsed by default.
9. Empty events shows "No events yet."
10. "↓ Logs" button visible in header.
11. Click Logs → downloads run-log-[timestamp].json.
12. Downloaded file is valid JSON array.
13. "↑ Import" button visible in header.
14. Click Import → shows import panel.
15. Paste JSON array → click Import Prospects.
16. New leads appear in prospect table.
17. Duplicate leads are skipped with warning.
18. Zira lead not affected by import.
19. Existing locked records not affected by import.
20. LEAD_IMPORTED event logged per new lead.
21. Pipeline tab counts update after import.
22. Import panel closes after success.
23. No data loss.
24. No auto-send introduced.
25. No Baileys introduced.
26. Browser console no breaking errors.

---

## MANUAL TEST CHECKLIST

At localhost:3777:

1. Open dashboard.
2. Confirm all existing leads visible (Zira + LockTest).
3. Click Run Log toggle on Zira card.
4. Confirm events expand — CTA_APPROVED, WHATSAPP_OPENED, SENT_MANUAL_CONFIRMED visible.
5. Click toggle again — collapses.
6. Click "↓ Logs" button.
7. Confirm run-log-[timestamp].json downloads.
8. Open file — confirm valid JSON array with events.
9. Click "↑ Import" button.
10. Paste this test JSON:
```json
[
  {
    "agentRank": 1,
    "status": "PENDING",
    "operatorLiteLeadData": {
      "id": "test-import-spa-ipoh",
      "businessName": "Test Import Spa",
      "lokasi": "Ipoh",
      "niche": "Beauty Spa",
      "platform": "Facebook",
      "contact": "0123456789",
      "whatsapp": "60123456789",
      "profileUrl": "https://facebook.com/testimportspa",
      "kelemahan": "Tiada page booking",
      "offer": "Page Booking WhatsApp / Mini Website Booking WhatsApp RM350",
      "defaultDm": "Hi, saya Aliff. Saya ada buat preview untuk spa ini.",
      "humanDecision": "PENDING",
      "editNotes": ""
    },
    "scoringData": {
      "fitScore": 4,
      "priority": "B"
    }
  }
]
```
11. Click Import Prospects.
12. Confirm "1 imported, 0 skipped" message.
13. Confirm Test Import Spa appears in prospect table under NEW tab.
14. Import same JSON again — confirm "0 imported, 1 skipped (duplicate)".
15. Confirm Zira still intact.
16. Confirm LockTest still locked.
17. Try handleOk guard: edit Zira DM → click OK — confirm works.
18. Lock a new test lead → try APPROVE EDIT path — confirm blocked.

---

## REPORT BACK FORMAT

Phase 5 Build Report

1. Files inspected
2. Files changed
3. handleOk guard added — yes/no
4. Run Log Timeline implementation
5. Export Logs implementation
6. Import Prospects implementation
7. Duplicate check behavior
8. Events logged on import
9. Whether Phase 1-4 behavior preserved
10. Terminal output summary
11. Manual test checklist
12. Risks or issues found
13. Whether safe to proceed to Phase 6

STOP after Phase 5 report.
DO NOT proceed to Phase 6.
