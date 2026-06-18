# 03_APEXPROSPECT_PATCH_02_PAYMENT_REVENUE

ROLE:
You are Claude Code CLI.

PROJECT:
ApexProspect by AUKIY
Path: tools/semi-auto-outreach/
Localhost: 3777

MISSION:
Add minimal payment and revenue tracking so ApexProspect can support first 5 paying clients.

DO NOT rewrite.
DO NOT refactor widely.
DO NOT add auto-send.
DO NOT break WhatsApp approval flow.
DO NOT break preview generation.
DO NOT manually edit live data files unless required for safe test seed.
DO NOT collapse the existing multi-status architecture yet.

---

# CURRENT PATCH STATE

PATCH 1 result:
PASS.

Confirmed:

* `modules/previewBuilder.js` exists
* server is live on localhost:3777
* preview generation endpoint works
* no auto-send added
* Zira preview generation works

Now implement PATCH 2 only.

---

# BUSINESS GOAL

ApexProspect must track money.

Minimum payment flow:

APPROVED / INTERESTED / PREVIEW_SENT
↓
Client agrees
↓
Aliff sends DuitNow QR manually
↓
Client pays
↓
Aliff marks PAID
↓
System records amount + timeline event
↓
Lead can continue to delivery / closed won later

---

# REQUIRED DATA FIELDS

Add safe defaults to lead migration/schema:

```js
dealValue: 0,
quotedAmount: 0,
paidAmount: 0,
paymentStatus: "UNPAID",
paymentProofNote: "",
paidAt: null
```

If there is already a schema/migration helper such as `migrateLeadRecord()`, add defaults there.

If POST `/api/leads` creates new leads with minimal schema, update it so new leads also get these payment fields at creation.

Do not remove existing fields.

---

# REQUIRED API

Add endpoint:

```http
POST /api/leads/:id/mark-paid
```

Expected JSON body:

```json
{
  "paidAmount": 350,
  "dealValue": 350,
  "paymentProofNote": "DuitNow QR paid, screenshot confirmed"
}
```

Behavior:

1. Find lead by id.
2. If not found, return 404.
3. If lead is locked as CLOSED_WON or CLOSED_LOST, do not modify normal deal/payment fields unless current project convention allows amendments. Prefer to return safe error.
4. Set:

```js
paymentStatus = "PAID"
paidAmount = numeric paidAmount
dealValue = numeric dealValue || paidAmount
quotedAmount = existing quotedAmount || dealValue || paidAmount
paymentProofNote = provided note || existing note || ""
paidAt = new Date().toISOString()
```

5. Update status safely:
   Use existing architecture carefully.

Set whichever payment/deal status field is appropriate without breaking current display:

* status may become "PAID"
* dealStatus may become "PAID"
* pipelineStatus may become "PAID"

Do not remove older statuses.

6. Add timeline / run-log event:

```text
PAYMENT_RECEIVED
```

Event payload should include:

* paidAmount
* dealValue
* paymentProofNote
* paidAt

7. Persist using existing safe write method such as `queueWrite()`.

---

# REQUIRED FRONTEND UI

Add minimal UI only.

In lead card/modal/details panel, show:

* Deal Value
* Quoted Amount
* Paid Amount
* Payment Status
* Payment Proof Note
* Paid At

Add button:

```text
Mark Paid
```

When clicked:

* ask for paid amount
* ask optional payment note
* call POST `/api/leads/:id/mark-paid`
* refresh lead data
* show success state

Do not create full invoice system.
Do not create payment gateway.
Do not add Stripe/Billplz.
Manual DuitNow QR is enough.

---

# SMART PANEL / SUMMARY

If low risk, add simple revenue summary:

```text
Total Paid Revenue: RM X
Paid Deals: N
Unpaid Approved Deals: N
```

If this touches too many files, skip and report as next patch.

---

# STATUS / PIPELINE RULES

Do not redesign status system now.

But make sure PAID displays sensibly.

If there is a tab/filter/status badge system:

* PAID should not appear as UNKNOWN
* PAID should show next action: "Start delivery."

---

# VERIFICATION TESTS

Test with Zira or safe test lead:

1. Server still running.
2. Existing preview generation still works.
3. Existing WhatsApp approval/open flow still works.
4. Call:

```http
POST /api/leads/zira-beauty-spa-ipoh/mark-paid
```

with:

```json
{
  "paidAmount": 350,
  "dealValue": 350,
  "paymentProofNote": "Test payment confirmed"
}
```

5. Confirm response ok.
6. Confirm lead now has:

* paymentStatus: PAID
* paidAmount: 350
* dealValue: 350
* paidAt not null
* PAYMENT_RECEIVED event in timeline/run-log

7. Confirm UI shows payment status.
8. Confirm no auto-send added.
9. Confirm CLOSED_WON lock behavior unchanged.

---

# REPORT BACK

Return:

## Files changed

## Exact changes made

## API endpoint added

## Schema fields added

## UI changes

## Payment test result

## Run log / timeline result

## Regression check

## Bugs found

## Next recommended patch

STOP after report.
