# PHASE_6_SCHEDULE_OPERATION_CONTROL.md
# DealSense Prospects Operator — Phase 6
# Run: claude --model claude-fable-5 "Read sprints/BLUEPRINT_PROSPECTS_OPERATOR.md sprints/BLUEPRINT_DATA_SCHEMA.md sprints/BLUEPRINT_PHASE_GATE.md then execute sprints/PHASE_6_SCHEDULE_OPERATION_CONTROL.md"

## CURRENT STATUS
Phase 1-5B: COMPLETE — MVM PASS

## PHASE 6 OBJECTIVE
Add Schedule + Operation Control layer.

3 components:
1. Master Operation ON/OFF toggle
2. Send Safety Lock — working hours warning
3. Schedule Tab — queue prospects for later

CORE RULES:
- No auto-send. Ever.
- No Baileys.
- No hidden sending.
- Human approval still required for every message.
- Schedule = queue for operator review, NOT auto-blast.
- Preserve all Phase 1-5B behavior.
- Patch only what Phase 6 requires.

---

## COMPONENT 1 — Master Operation ON/OFF Toggle

Location: Dashboard header, left of "+ Add Lead"

UI:
- Toggle button: "⚡ Operation: ON" / "⏸ Operation: OFF"
- ON state: green indicator
- OFF state: red indicator, muted header

Behavior when OFF:
- APPROVE button disabled on ALL cards
- Confirm Sent disabled on ALL cards
- Show banner: "Operation paused. No messages can be approved."
- Pipeline tabs still work
- Data still viewable
- Import still works
- Export still works
- Toggle itself always clickable

Persist state:
- Save to localStorage key: "dealsense_operation_state"
- Restore on page refresh

Backend: NOT required. Frontend-only toggle.

---

## COMPONENT 2 — Send Safety Lock (Working Hours)

Add working hours config in a simple config object in app.js:

```javascript
const WORKING_HOURS = {
  start: 9,   // 9 AM
  end: 21,    // 9 PM
  timezone: 'Asia/Kuala_Lumpur'
};
```

When APPROVE is clicked:
- Check current local time
- If outside working hours (before 9AM or after 9PM):
  - Show warning modal:
    "⚠ Di luar waktu operasi (9AM–9PM). Hantar sekarang juga?"
  - Buttons: "Hantar Sekarang" / "Batal"
  - If "Hantar Sekarang" → proceed with existing WA open flow
  - If "Batal" → cancel, no WA opened
- If within working hours → proceed normally

Do NOT block sending. Only warn and ask confirmation.

---

## COMPONENT 3 — Schedule Tab

Add "SCHEDULED" tab in pipeline tabs bar.

Schedule flow:
- Add "Schedule" button in each unlocked prospect card
- When clicked: show simple time picker (date + time input)
- Confirm → set fields:
  - scheduleStatus: "SCHEDULED"
  - scheduledAt: selected datetime ISO string
  - prospectStatus: "SCHEDULED" (for tab filter)
- Lead moves to SCHEDULED tab
- APPROVE button shows label: "Send Now (Scheduled for [date])"
- Operator can still approve early manually

Schedule list in SCHEDULED tab:
- Show: Business name, scheduled time, DM preview (first 50 chars)
- Sort by scheduledAt ascending (earliest first)
- Overdue indicator: if scheduledAt < now → show "OVERDUE" badge in amber

Unschedule:
- "Remove from Schedule" button in card
- Resets scheduledAt: "" and scheduleStatus: "NOT_SCHEDULED"
- Returns lead to previous tab

Backend: Add PATCH /api/leads/:id for scheduleStatus + scheduledAt update.
Or reuse existing PATCH /api/leads/:id if it already handles partial updates.

---

## ACCEPTANCE CRITERIA

1. npm start runs without error.
2. localhost:3777 loads.
3. Master ON/OFF toggle visible in header.
4. Toggle OFF → APPROVE disabled on all cards.
5. Toggle OFF → banner visible.
6. Toggle ON → APPROVE re-enabled.
7. State persists on refresh.
8. APPROVE outside 9AM-9PM → warning modal appears.
9. Warning modal "Hantar Sekarang" → WA opens.
10. Warning modal "Batal" → nothing happens.
11. Within working hours → no warning, normal flow.
12. Schedule button visible in unlocked cards.
13. Click Schedule → time picker appears.
14. Confirm schedule → lead moves to SCHEDULED tab.
15. SCHEDULED tab shows scheduled leads.
16. Overdue leads show OVERDUE badge.
17. Remove from Schedule → lead returns to previous tab.
18. All Phase 1-5B behavior preserved.
19. No auto-send added.
20. No Baileys added.

---

## MANUAL TEST CHECKLIST

1. Click Operation toggle → OFF
2. Confirm APPROVE greyed on Zira card
3. Confirm banner visible
4. Click toggle → ON → APPROVE re-enabled
5. Refresh → state preserved
6. Change system clock to 11PM (or mock) → click APPROVE → warning appears
7. Click "Hantar Sekarang" → WA opens
8. Click Schedule on Zira → pick future time → confirm
9. Zira moves to SCHEDULED tab
10. Check SCHEDULED tab shows Zira with scheduled time
11. Click Remove from Schedule → Zira back to CONTACTED tab

REPORT BACK: Phase 6 Build Report (same format as previous phases)
STOP after Phase 6 report. DO NOT proceed to Phase 7.
