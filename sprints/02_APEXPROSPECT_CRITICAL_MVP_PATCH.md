# 02_APEXPROSPECT_CRITICAL_MVP_PATCH

ROLE:
You are Claude Code CLI.

PROJECT:
ApexProspect by AUKIY
Path: tools/semi-auto-outreach/
Localhost: 3777

MISSION:
Apply the smallest critical MVP patch so ApexProspect can run, track revenue, and support first 5 paying clients.

DO NOT rewrite.
DO NOT refactor widely.
DO NOT add auto-send.
DO NOT break WhatsApp approval flow.
DO NOT break existing Zira lead.
DO NOT touch live data manually.

---

# AUDIT FINDINGS TO FIX

Critical findings:

1. `server.js` requires `./modules/previewBuilder`, but `modules/previewBuilder.js` is missing.
2. No revenue/payment field exists.
3. `REJECTED_NEEDS_REWORK` is a dead-end status.
4. `replyStatus` is imported but not synced when lead is marked replied.
5. `INTERESTED`, `PAID`, `DELIVERING`, `DELIVERED` stages are missing.
6. Status system has multiple overlapping fields. Do NOT redesign this now. Patch safely.

---

# PATCH 1 — RESTORE PREVIEW BUILDER

Create:

`modules/previewBuilder.js`

Goal:
Unblock server startup.

Requirements:

* Export whatever function `server.js` expects.
* Do not change `server.js` require path unless necessary.
* Use existing `landingPageEngineData` if available.
* Return safe minimal preview HTML / preview object compatible with existing endpoint.
* Preserve WhatsApp CTA.
* Sanitize WhatsApp number with:

```js
.replace(/[^0-9]/g, '')
```

* No external API call.
* No AI call.
* No auto-send.

Verify:

* `npm run dev` or current start command works.
* localhost:3777 starts.
* `/api/leads/:id/generate-preview` does not crash.

---

# PATCH 2 — ADD PAYMENT / REVENUE FIELDS

Add safe defaults in migration/schema:

```js
dealValue: 0,
quotedAmount: 0,
paidAmount: 0,
paymentStatus: "UNPAID",
paymentProofNote: "",
paidAt: null
```

Add minimal API/action if existing pattern allows:

* Mark Paid
* Save deal value / paid amount

When marked paid:

* `paymentStatus = "PAID"`
* `paidAt = new Date().toISOString()`
* status/deal status should reflect `PAID` using current status architecture safely
* add timeline/run-log event: `PAYMENT_RECEIVED`

Do not break existing status fields.

---

# PATCH 3 — FIX REJECTED_NEEDS_REWORK DEAD-END

Current issue:
`handleNo()` sets `REJECTED_NEEDS_REWORK`, but Smart Panel / pipeline does not surface it properly.

Fix:

* Add visible next action:
  “Rewrite DM and re-approve.”
* Ensure this status appears in a useful tab or priority panel.
* Do not mark as closed lost.
* Keep amendment/rewrite path open.

Add timeline event when rewrite is requested:

`DM_REWRITE_REQUESTED`

---

# PATCH 4 — SYNC REPLY STATUS

When `handleReplied()` runs:

Also set:

```js
replyStatus: "REPLIED"
```

Add timeline event if not already present:

`REPLIED_MARKED`

---

# PATCH 5 — ADD MISSING MVP STAGES SAFELY

Add support for these statuses without redesigning the whole status system:

```text
INTERESTED
PAID
DELIVERING
DELIVERED
```

Rules:

* REPLIED can move to INTERESTED
* APPROVED can move to PAID
* PAID can move to DELIVERING
* DELIVERING can move to DELIVERED
* DELIVERED can move to CLOSED_WON

Do not remove existing statuses.
Do not collapse the 5-field status system yet.
Just make display + next action stable.

---

# PATCH 6 — UI MINIMUM

Add simple fields/buttons only if low risk:

* Deal Value
* Paid Amount
* Payment Status
* Mark Paid button
* Move to Interested button
* Move to Delivering button
* Move to Delivered button

No new complex layout.
No enterprise CRM UI.

---

# VERIFICATION FLOW

Test this exact flow with Zira or a safe test lead:

```text
PREVIEW_READY
→ APPROVED_TO_SEND
→ SENT_MANUAL_CONFIRMATION_NEEDED
→ CONTACTED
→ REPLIED
→ INTERESTED
→ PREVIEW_GENERATED
→ PREVIEW_SENT / PREVIEW_CLICK_MARKED
→ PAID
→ DELIVERING
→ DELIVERED
→ CLOSED_WON
```

Confirm:

* localhost:3777 starts
* no missing module crash
* preview generation endpoint works
* WhatsApp flow still requires human manual send
* no auto-send added
* payment fields save
* Mark Paid logs event
* REJECTED_NEEDS_REWORK no longer dead-end
* CLOSED_WON still locks record
* existing export still works
* no live data manually edited

---

# REPORT BACK

Return:

## Files changed

## Exact changes made

## Startup test result

## Preview generation test result

## Payment flow test result

## WhatsApp no-auto-send confirmation

## Any bugs found

## Next recommended patch

STOP after report.
