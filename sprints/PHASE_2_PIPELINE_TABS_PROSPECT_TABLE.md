# PHASE_2_PIPELINE_TABS_PROSPECT_TABLE.md

Claude Code, execute Phase 2 only.

PROJECT:
DealSense Prospects Operator / Landing Page Engine / Customer Acquisition

LOCAL APP:
http://localhost:3777

CURRENT STATUS:
Phase 1 verification passed.

Confirmed:
- Server runs on localhost:3777.
- HTTP 200 on `/`.
- Zira lead intact.
- Lead ID preserved: `zira-beauty-spa-ipoh`.
- `leads.json` old fields preserved.
- New fields added safely.
- Migration is idempotent.
- `run-log.json` exists.
- No duplicate leads after second restart.
- No auto-send code detected.
- Existing WhatsApp open flow preserved.

PHASE 2 OBJECTIVE:
Add Pipeline Tabs and Prospect Table/List view while preserving the existing Operator Lite behavior.

IMPORTANT:
This is a small controlled patch.
Do not redesign the whole system.
Do not rewrite blindly.
Inspect current files first.

CORE RULES:
- Keep localhost:3777 working.
- Preserve current working behavior.
- Preserve existing Zira lead card.
- Preserve DM draft edit behavior.
- Preserve Approve button behavior.
- Approve must still only open WhatsApp with prefilled message.
- No auto-send.
- No hidden sending.
- No Baileys.
- No WhatsApp automation.
- Human approval remains required.
- Do not add login, billing, SaaS database, or cloud backend.
- Do not remove old fields from `leads.json`.
- Do not change data structure unless absolutely necessary.
- Patch only what Phase 2 needs.

CURRENT APP CONTEXT:
The app already has:
- Operator Lite style interface
- Prospect card
- DM draft
- Approve
- Edit
- Reject
- Mark Replied
- Follow-Up Draft
- Closed Won
- Closed Lost
- Paste Reply
- CSV export
- JSON export
- Human approval warning

PHASE 2 REQUIREMENTS:

1. Add Pipeline Tabs / Status Filters

Add visible tabs or filter buttons to organize prospects by status.

Suggested tabs:
- All
- New
- Approved
- Contacted
- Replied
- Follow-Up
- Closed Won
- Closed Lost

Use existing fields if possible:
- `prospectStatus`
- `dealStatus`
- `replyStatus`
- `status`

Do not break if some fields are empty.
Use safe fallback logic.

2. Add Prospect Table/List View

Add a compact prospect table/list above or beside the existing card view.

The table should show at minimum:
- Business name
- Location
- Prospect status
- Reply status
- Deal status
- Last action date
- Priority or fit score if available

Each row should allow selecting the prospect.
When selected, the existing prospect card/details should still work.

Since current data only has Zira, the table must show Zira correctly.

3. Preserve Existing Prospect Card Behavior

Do not remove the current card.
Do not remove current buttons.
Do not change existing workflows unless required for Phase 2 display.

Must still work:
- DM draft edit
- Approve opens WhatsApp
- Reject
- Mark Replied
- Follow-Up Draft
- Closed Won
- Closed Lost
- Paste Reply
- CSV export
- JSON export

4. Safe UI Only

Phase 2 is mainly layout/navigation.

Do not build these yet unless already existing:
- Confirm Sent
- AutoLock behavior
- Amendments behavior
- Export logs
- Run Log timeline

If placeholders are needed, keep them display-only and clearly inactive.

5. No AutoLog Event Wiring Yet Unless Already Present

Do not implement full event logging in Phase 2 unless the existing code already has a clean helper ready.

AutoLog full button mapping will be handled in a later phase.

6. File Safety

Before editing:
- Inspect relevant files.
- Identify current app structure.
- Make minimal patch.

Likely files:
- `public/index.html`
- `public/app.js`
- `public/style.css`
- Only touch `server.js` if absolutely required.

Do not modify:
- `data/leads.json` except if testing requires safe backup and no data loss.
- WhatsApp open logic unless preserving exact behavior.
- Approval logic beyond UI integration.

ACCEPTANCE CRITERIA:

After Phase 2:
1. `npm start` runs without error.
2. `localhost:3777` loads.
3. UI title remains `DealSense Prospects Operator`.
4. Pipeline tabs/status filters are visible.
5. Prospect table/list is visible.
6. Zira lead appears in the table/list.
7. Selecting Zira shows existing prospect card/details.
8. DM draft can still be edited.
9. Approve still opens WhatsApp with prefilled message.
10. Approve does not auto-send.
11. No hidden WhatsApp sending exists.
12. Existing action buttons still appear.
13. No data loss in `leads.json`.
14. No duplicate leads.
15. No console-breaking errors.

REPORT BACK FORMAT:

Phase 2 Build Report

1. Files inspected
2. Files changed
3. UI changes completed
4. How pipeline tabs work
5. How prospect table/list works
6. Whether Zira lead still appears
7. Whether existing card behavior is preserved
8. Whether DM edit still works
9. Whether Approve still opens WhatsApp only
10. Whether any data file changed
11. Terminal output summary
12. Browser/manual test checklist
13. Risks or issues found
14. Whether safe to proceed to Phase 3

STOP after Phase 2 report.

DO NOT proceed to Phase 3.
