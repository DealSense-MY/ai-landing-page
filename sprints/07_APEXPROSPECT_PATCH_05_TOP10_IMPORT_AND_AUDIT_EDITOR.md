# 07_APEXPROSPECT_PATCH_05_TOP10_IMPORT_AND_AUDIT_EDITOR.md

ROLE

You are Claude Sonnet running inside Claude Code.

PROJECT

ApexProspect by AUKIY

PATH

tools/semi-auto-outreach/

ENVIRONMENT

localhost:3777

---

# PROJECT MISSION

ApexProspect is NOT a CRM.

ApexProspect is an AI-Assisted Prospect-to-Revenue Operating System.

Primary flow:

Prospect
↓
Audit
↓
Score
↓
Outreach
↓
Reply
↓
Preview
↓
Payment
↓
Delivery
↓
Closed Won

Human responsibilities:

* Review
* Approve
* Send
* Collect Payment
* Deliver

AI responsibilities:

* Import
* Audit
* Score
* Rank
* Draft
* Suggest

Do not add:

* CRM features
* SaaS features
* Multi-user features
* Auto-send
* Hidden automation

---

# CURRENT PATCH STATUS

PATCH 1
Preview Builder
PASS

PATCH 2
Payment / Revenue
PASS

PATCH 3
REJECTED_NEEDS_REWORK Dead-End
PASS

PATCH 4
Audit Score + Preview Readiness
PASS

System currently stable.

---

# MISSION

Implement PATCH 5.

Deliver ONLY:

1. Safe Audit Editor
2. Batch Top10 Prospect Import

No other work.

---

# PATCH SURFACE RULE

Target files only:

* server.js
* public/app.js
* public/style.css

Do not modify any other file unless absolutely required.

If another file must be changed:

Explain why before changing it.

---

# UNIVERSAL ROBUST EXPRESS RULE

When adding functionality:

1. Data Layer
2. Pure Functions
3. Thin Routes
4. Explicit Assignment
5. Safe Persistence
6. Standard JSON Response
7. Error Safe

Keep routes small.

Avoid giant route handlers.

---

# SCHEMA RULE

Whenever a field is added:

Must exist in:

1. migrateLeadRecord()
2. POST /api/leads creation flow
3. import flow
4. API layer
5. UI layer

Never add a field to only one layer.

---

# EVENT RULE

Every state-changing operation must create an event.

Write event into:

* lead.events[]
* run-log.json

using existing event architecture.

Required events:

AUDIT_UPDATED

BATCH_PROSPECT_IMPORTED

---

# LANDING PAGE DATA PROTECTION RULE

Do not destroy existing landingPageEngineData.

When importing:

* preserve populated values
* fill missing values only
* do not overwrite preview-ready records
* do not remove existing preview URLs

---

# EXPLICIT ASSIGNMENT RULE

Never:

```js
lead = {
  ...lead,
  ...req.body
}
```

Never:

```js
Object.assign(lead, req.body)
```

Never:

```js
Object.assign(lead.audit, req.body)
```

Update fields individually.

---

# PATCH A

SAFE AUDIT SUB-OBJECT ENDPOINT

Create:

PATCH /api/leads/:id/audit

Purpose:

Update ONLY:

websiteScore
mobileScore
ctaScore
socialScore
reviewScore

weakness[]
opportunity[]
missingFields[]

---

# REQUIRED IMPLEMENTATION

Use defensive initialization:

```js
lead.audit = lead.audit || {
  websiteScore: 0,
  mobileScore: 0,
  ctaScore: 0,
  socialScore: 0,
  reviewScore: 0,
  weakness: [],
  opportunity: [],
  missingFields: []
};
```

Use:

```js
const numericFields = [
  'websiteScore',
  'mobileScore',
  'ctaScore',
  'socialScore',
  'reviewScore'
];
```

Use:

```js
const arrayFields = [
  'weakness',
  'opportunity',
  'missingFields'
];
```

Update fields individually.

No blanket merge.

After update:

Recalculate:

* auditScore
* previewReadinessScore
* priority

using existing Patch 4 functions.

Persist using existing safe write flow.

Create event:

AUDIT_UPDATED

Return:

```json
{
  "success": true,
  "data": {}
}
```

404 if lead not found.

500 if exception.

No crash path.

---

# PATCH B

AUDIT EDITOR UI

Inside lead modal:

Add editable fields:

websiteScore
mobileScore
ctaScore
socialScore
reviewScore

weakness

opportunity

missingFields

Add:

Save Audit

button.

When clicked:

PATCH /api/leads/:id/audit

Refresh:

* auditScore
* previewReadinessScore
* priority

without full page reload if possible.

Do not redesign modal.

Do not redesign layout.

Patch only.

---

# PATCH C

BATCH TOP10 IMPORT

Purpose:

Import AI-generated prospect batches.

No scraping.

No AI API.

No external services.

Import only.

---

# ACCEPTED IMPORT FORMAT

Format A

```json
{
  "operatorLiteLeadData": {},
  "landingPageEngineData": {},
  "audit": {}
}
```

Format B

Existing flat lead format.

Must remain compatible.

Do not break current import system.

---

# REQUIRED VALIDATION

Required:

businessName
niche
location

AND

At least one contact source:

whatsapp
phone
website
facebook
instagram
googleMapsUrl

If invalid:

Reject that record only.

Continue processing remaining records.

---

# REQUIRED NORMALIZATION

Generate id if missing.

Normalize phone numbers.

Apply migration defaults.

Apply:

auditScore

previewReadinessScore

priority

paymentStatus

timeline

landingPageEngineData

Run:

calculateAuditScore()

calculatePreviewReadinessScore()

calculatePriority()

getMissingPreviewFields()

---

# REQUIRED DEDUPLICATION

Use existing dedupe system if available.

Otherwise:

Skip duplicate records using:

1. id
2. businessName + whatsapp
3. businessName + location
4. website

Do not overwrite existing records.

Skip duplicates.

Report them.

---

# IMPORT EVENT

Create:

BATCH_PROSPECT_IMPORTED

Store:

batchId
importedAt

source: "manual_batch_import"

Write to:

* lead.events[]
* run-log.json

---

# TOP10 RANKING

After import:

Sort:

1. previewReadinessScore DESC
2. auditScore DESC
3. HIGH > MEDIUM > LOW

Return:

Top10 ranked prospects.

---

# UI

Add:

Batch Import Panel

Simple only.

Requirements:

* JSON textarea
* Import button
* Import result summary
* Top10 preview list

No Kanban.

No CRM redesign.

No dashboard redesign.

---

# ACCEPTANCE TEST

Create test batch:

Prospect A:
Complete record

Prospect B:
Partial record

Prospect C:
Invalid record

Verify:

✓ import works

✓ invalid skipped

✓ duplicates skipped

✓ audit editor saves

✓ auditScore recalculates

✓ previewReadinessScore recalculates

✓ priority recalculates

✓ Top10 ranking works

✓ preview generation still works

✓ payment flow still works

✓ WhatsApp approval flow still works

✓ no auto-send

✓ localhost:3777 still runs

✓ Zira lead unchanged

✓ exports unchanged

✓ Closed Won lock unchanged

---

# REPORT FORMAT

## Files Changed

## Routes Added

## UI Changes

## Validation Rules

## Dedupe Rules

## Import Test Result

## Audit Editor Test Result

## Top10 Ranking Result

## Regression Checks

## Bugs Found

## Next Recommended Patch

STOP AFTER REPORT.
S