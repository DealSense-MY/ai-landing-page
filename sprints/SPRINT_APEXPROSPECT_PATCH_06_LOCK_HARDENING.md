# SPRINT_APEXPROSPECT_PATCH_06_LOCK_HARDENING.md

You are Claude Code.

PROJECT:
Landing Page PWA / Customer Acquisition System

ACTIVE CHANNEL:
13_BUILD_EXECUTION__APEXPROSPECT

APP:
ApexProspect Operator PWA

LOCAL APP:
localhost:3777

MISSION:
Apply PATCH 6 — Lock Hardening Sprint.

This is a small safety patch only.

Fix server-side lock guard gaps found in the final security report.

Do NOT build new features.
Do NOT redesign.
Do NOT refactor globally.
Do NOT change UI unless absolutely required.
Do NOT touch WhatsApp flow.
Do NOT add AI provider.
Do NOT deploy.
Do NOT ask for API keys.

---

# CURRENT SECURITY REPORT SUMMARY

XSS Surface:
CLEAN ✅

Data Integrity:
SAFE ✅

Issue found:

F1 HIGH:
`PATCH /api/leads/:id` has no server-side lock guard.
Locked leads can still be mutated via direct API call.

F3 LOW:
`POST /api/leads/:id/mark-paid` only blocks some closed states instead of all locked states.

F2 LOW:
Raw audit array strings can be stored in JSON, but render layer escapes output.
No action required for PATCH 6.

---

# PATCH 6 OBJECTIVE

Add server-side lock hardening.

Required:

1. Add full lock guard to:
   `PATCH /api/leads/:id`

2. Normalize lock guard in:
   `POST /api/leads/:id/mark-paid`

3. Keep event route unrestricted:
   `POST /api/leads/:id/events`

4. Do not change existing data shape.

5. Do not break unlocked lead workflow.

---

# NON-NEGOTIABLE RULES

1. Locked records must be server-protected, not only UI-protected.
2. UI hiding buttons is not enough.
3. Direct API mutation must fail for locked leads.
4. Locked lead can still receive events if needed.
5. Locked lead can still receive amendments if amendment endpoint exists.
6. Do not allow status/reply/payment changes on locked leads.
7. No auto-send.
8. No hidden WhatsApp sending.
9. No Baileys.
10. Human manual WhatsApp workflow remains unchanged.

---

# FILES TO INSPECT

Inspect before editing:

- `tools/semi-auto-outreach/server.js`
- `tools/semi-auto-outreach/public/app.js` only if needed for route call context
- `tools/semi-auto-outreach/data/leads.json` read-only unless testing safely
- `tools/semi-auto-outreach/data/run-log.json` read-only unless testing safely

Expected file changed:
- `tools/semi-auto-outreach/server.js`

Do not modify other files unless absolutely necessary.

---

# PATCH 6A — LOCK GUARD ON PATCH /api/leads/:id

Find route:

`PATCH /api/leads/:id`

Before any field write, add guard:

```js
if (lead.locked) {
  return res.status(403).json({
    success: false,
    error: 'Lead is locked',
    code: 'LEAD_LOCKED'
  });
}
```

Requirements:
- Guard must happen after lead is found.
- Guard must happen before writing status, reply, followUpDate, scheduleStatus, previewClicked, or any other mutable field.
- Use the app's existing JSON response style if it already differs, but preserve failure status 403.
- Do not block if lead is not locked.
- Do not change allowed field assignment logic.

---

# PATCH 6B — NORMALIZE MARK-PAID LOCK CHECK

Find route:

`POST /api/leads/:id/mark-paid`

Current behavior:
May only block if lockReason is CLOSED_WON / CLOSED_LOST.

Required behavior:
If `lead.locked` is true, block payment mutation regardless of lockReason.

Use:

```js
if (lead.locked) {
  return res.status(403).json({
    success: false,
    error: 'Lead is locked',
    code: 'LEAD_LOCKED'
  });
}
```

Requirements:
- Guard must happen after lead is found.
- Guard must happen before changing payment fields.
- Do not change payment logic for unlocked leads.

---

# ROUTES THAT MUST NOT BE BLOCKED BY THIS PATCH

Do not add lock blocking to:

`POST /api/leads/:id/events`

Reason:
Events may be used for audit trail.

Do not break amendments route if it exists.

Reason:
Locked records must still accept amendments/corrections.

---

# REGRESSION RULES

Must remain true:

1. App opens at `localhost:3777`.
2. Existing lead data loads.
3. Unlocked lead can still be edited through allowed UI.
4. Locked lead cannot be mutated through `PATCH /api/leads/:id`.
5. Locked lead cannot be payment-mutated through `POST /api/leads/:id/mark-paid`.
6. Locked lead can still receive events.
7. Amendments still work if implemented.
8. AutoLog still works.
9. Confirm Sent remains manual.
10. Approve only opens WhatsApp prefilled message.
11. No auto-send is added.
12. No hidden WhatsApp sending is added.
13. No data loss.
14. No global refactor.

---

# MANUAL TEST PLAN

Use safe test data only.
Do not damage real outreach data.

If a locked test lead exists:

1. Call `PATCH /api/leads/:id` on locked lead with a status/reply mutation.
2. Expected:
   - HTTP 403
   - body contains `LEAD_LOCKED` or equivalent locked error
   - `leads.json` unchanged for that mutation

3. Call `POST /api/leads/:id/mark-paid` on locked lead.
4. Expected:
   - HTTP 403
   - body contains `LEAD_LOCKED` or equivalent locked error
   - payment fields unchanged

5. Call `POST /api/leads/:id/events` on locked lead.
6. Expected:
   - event can still be added
   - event appears in lead events / run-log if existing behavior supports it

If no locked test lead exists:
- Create or use a temporary test lead.
- Lock it through existing lock route/UI.
- Run the above tests.
- Report exactly what was changed.

---

# CURL TEST EXAMPLES

Adjust lead ID to an existing locked test lead.

```bash
curl -X PATCH http://localhost:3777/api/leads/LOCKED_TEST_ID ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"REPLIED\",\"replyText\":\"should not save\"}"
```

Expected:
403 locked error.

```bash
curl -X POST http://localhost:3777/api/leads/LOCKED_TEST_ID/mark-paid ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\":397,\"paymentStatus\":\"PAID\"}"
```

Expected:
403 locked error.

---

# ACCEPTANCE CRITERIA

PATCH 6 is accepted only if:

1. `PATCH /api/leads/:id` blocks all locked leads server-side.
2. `POST /api/leads/:id/mark-paid` blocks all locked leads server-side.
3. Both return HTTP 403.
4. Unlocked leads still work as before.
5. Event logging route remains usable.
6. Amendments remain usable if present.
7. No UI regression.
8. No data loss.
9. No WhatsApp behavior change.
10. No auto-send introduced.
11. Only minimal code changed.

---

# REPORT FORMAT

Return:

# PATCH 6 LOCK HARDENING REPORT

1. Files inspected
2. Files changed
3. Old behavior
4. New behavior
5. Exact lock guards added
6. Routes tested
7. Locked PATCH test result
8. Locked mark-paid test result
9. Event route regression result
10. Amendment regression result if applicable
11. Unlocked lead regression result
12. WhatsApp safety confirmation
13. Data integrity confirmation
14. Any risk found
15. Recommended next action

STOP AFTER REPORT.

Do not proceed to PATCH 7.
Do not deploy.
Do not implement AI provider.
Do not change app direction.
