# PHASE_7_WORKFLOW_ENGINE.md
# DealSense Prospects Operator — Phase 7
# Run: claude --model claude-fable-5 "Read sprints/BLUEPRINT_PROSPECTS_OPERATOR.md then execute sprints/PHASE_7_WORKFLOW_ENGINE.md"

## CURRENT STATUS
Phase 1-6: COMPLETE

## PHASE 7 OBJECTIVE
Add Workflow Automation Engine — smart suggestions, follow-up detection, daily target tracker.

NO auto-send. System suggests. Operator decides.

CORE RULES:
- Suggestions only — never auto-approve, never auto-send
- No Baileys
- No hidden actions
- Preserve all Phase 1-6 behavior
- Frontend-only calculations where possible
- Patch only what Phase 7 requires

---

## COMPONENT 1 — Smart Action Panel

Add a collapsible panel at TOP of dashboard (below pipeline tabs, above prospect table).

Panel title: "⚡ Next Actions"
Toggle: "Show / Hide"

Panel shows priority action list calculated from leads data:

Priority logic (calculate client-side from loaded leads):

```
PRIORITY 1 — "Reply received, close now"
  Condition: replyStatus = REPLIED AND dealStatus = OPEN
  Action suggestion: "Close Won atau Follow Up"

PRIORITY 2 — "Follow up overdue"
  Condition: prospectStatus = CONTACTED
  AND lastActionAt < (now - 3 days)
  AND dealStatus = OPEN
  Action suggestion: "Hantar follow up"

PRIORITY 3 — "Preview not built"
  Condition: previewStatus = NOT_BUILT
  AND prospectStatus = NEW OR PREVIEW_READY
  Action suggestion: "Generate preview"

PRIORITY 4 — "Scheduled and overdue"
  Condition: scheduleStatus = SCHEDULED
  AND scheduledAt < now
  Action suggestion: "Approve dan hantar sekarang"

PRIORITY 5 — "New leads waiting"
  Condition: prospectStatus = NEW
  AND humanDecision = PENDING
  Action suggestion: "Review lead baru"
```

Each suggestion row shows:
- Business name (clickable → scroll to card)
- Status pill
- Action suggestion text
- Days since last action (if applicable)

Empty state: "✓ Semua prospects up to date."

---

## COMPONENT 2 — Daily Target Tracker

Add small stats bar below Smart Action Panel.

Shows today's progress:

```
Today: [contacted today] contacted  |  [replied today] replied  |  [target] daily target
Progress bar: contacted / target
```

Config in app.js:
```javascript
const DAILY_TARGET = {
  outreach: 5,   // target DM sent per day
  followUp: 3    // target follow ups per day
};
```

Calculate from events[] where timestamp is today (local date).

Count:
- outreach sent today = events of type SENT_MANUAL_CONFIRMED with today's date
- follow ups today = events of type FOLLOW_UP_SENT with today's date

Show progress bar — fill % = (sent today / target) * 100
Cap at 100%.

---

## COMPONENT 3 — Stale Prospect Detection

In prospect table, add visual indicator for stale prospects:

Stale = prospectStatus is CONTACTED or APPROVED
AND lastActionAt < (now - 5 days)
AND dealStatus = OPEN

Indicator: amber "STALE" badge in table row next to prospect status

Tooltip/title: "Tiada action dalam 5 hari"

---

## COMPONENT 4 — Preview Click Signal (Placeholder)

Add previewClicked field display in prospect card if previewClicked = true:

Show: "👁 Preview dah dibuka [previewClickCount]x"

This is display-only for now.
Actual click tracking requires server-side redirect (future Phase).

For now: add a "Mark Preview Sent" button that sets:
- previewClicked: true (manually confirmed by operator)
- previewClickCount: previewClickCount + 1
- lastPreviewClickedAt: now

Backend: PATCH /api/leads/:id for these fields.

---

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads.
3. Smart Action Panel visible (collapsible).
4. Panel shows correct suggestions based on lead data.
5. Clicking business name scrolls to card.
6. Empty state shows when no actions needed.
7. Daily Target bar visible.
8. Today's sent count calculated from events.
9. Progress bar fills correctly.
10. Stale prospects show STALE badge in table.
11. STALE badge only on CONTACTED/APPROVED leads older than 5 days.
12. Mark Preview Sent button works.
13. previewClicked updates in leads.json.
14. All Phase 1-6 behavior preserved.
15. No auto-send added.
16. No Baileys added.
17. Browser console no breaking errors.

---

## MANUAL TEST CHECKLIST

1. Open localhost:3777
2. Confirm Smart Action Panel visible
3. Check Zira appears in suggestions (CONTACTED, overdue)
4. Click Zira in panel → scroll to card
5. Check Daily Target bar shows today's count
6. Confirm Stale badge on leads older than 5 days
7. Click Mark Preview Sent on Zira
8. Confirm previewClicked = true in leads.json
9. Confirm previewClickCount incremented
10. All existing buttons still work

REPORT BACK: Phase 7 Build Report
STOP after Phase 7. DO NOT proceed to Phase 8.
