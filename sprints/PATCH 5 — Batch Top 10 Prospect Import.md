# 06_APEXPROSPECT_PATCH_05_BATCH_TOP10_PROSPECT_IMPORT

ROLE:
You are Claude Code CLI.

PROJECT:
ApexProspect by AUKIY
Path: tools/semi-auto-outreach/
Localhost: 3777

MISSION:
Add a safe Batch Top 10 Prospect Import flow so ApexProspect can accept AI-researched prospects that already include operator data + landingPageEngineData.

DO NOT rewrite.
DO NOT refactor widely.
DO NOT add auto-send.
DO NOT add scraping automation yet.
DO NOT add external AI calls yet.
DO NOT break WhatsApp approval flow.
DO NOT break preview generation.
DO NOT break payment/revenue.
DO NOT manually edit live data files except through the app/API.

---

# CURRENT PATCH STATE

PATCH 1:
PASS — previewBuilder confirmed working.

PATCH 2:
PASS — payment/revenue tracking added.

PATCH 3:
PASS — REJECTED_NEEDS_REWORK dead-end fixed.

PATCH 4:
PASS — auditScore + previewReadinessScore added.

Now implement PATCH 5 only.

---

# BUSINESS GOAL

ApexProspect must support this workflow:

AI / Agent researches prospects externally
↓
AI returns 10 structured prospect records
↓
Aliff imports JSON into ApexProspect
↓
System validates records
↓
System stores operator data + landingPageEngineData
↓
System calculates auditScore + previewReadinessScore
↓
System ranks Top 10
↓
Aliff reviews, approves outreach, and sends manually

This patch does NOT need real scraping yet.

It only needs a stable import structure for Top 10 prospect data.

---

# REQUIRED IMPORT FORMAT

Support importing an array of prospects.

Each record may contain:

```js
{
  operatorLiteLeadData: {
    id,
    businessName,
    niche,
    location,
    whatsapp,
    phone,
    website,
    facebook,
    instagram,
    googleMapsUrl,
    sourceUrl,
    status,
    defaultDm,
    followUpDraft,
    weakness,
    opportunity
  },

  landingPageEngineData: {
    businessName,
    niche,
    headline,
    subheadline,
    services,
    packages,
    trustPoints,
    painPoints,
    faq,
    cta,
    location,
    whatsapp,
    brandColors,
    socialLinks,
    sourceEvidence
  },

  audit: {
    websiteScore,
    mobileScore,
    ctaScore,
    socialScore,
    reviewScore,
    weakness,
    opportunity,
    missingFields
  }
}
```

Also continue supporting existing flat import format if already supported.

Do not break Format A / Format B import.

---

# REQUIRED VALIDATION

For each imported prospect:

Required minimum:

* businessName
* niche
* location

At least one contact/source:

* whatsapp OR phone OR facebook OR instagram OR website OR googleMapsUrl

If missing required fields:

* reject that record
* include reason in import report
* continue importing other valid records

---

# REQUIRED NORMALIZATION

On import:

1. Generate stable id if missing.
2. Normalize WhatsApp/phone to digits only where used for wa.me.
3. Default status:

Use `NEW`.

Do NOT use `DISCOVERED` — that status does not exist anywhere in the current
pipeline, tabs, or Smart Panel logic. It only appears in early planning
documents and was never implemented. If an imported lead is given a status
that no existing tab/filter/Smart Panel bucket checks for, it will silently
disappear from the operator's view after import. Confirm in the report that
every imported lead's status is a value already recognized by the existing
tab/filter system before this patch is considered complete.

4. Ensure all new schema fields exist:

* auditScore
* previewReadinessScore
* priority
* paymentStatus
* timeline/events
* landingPageEngineData

5. Run existing scoring functions:

* calculateAuditScore
* calculatePreviewReadinessScore
* calculatePriority
* getMissingPreviewFields

6. Add event:

```text
BATCH_PROSPECT_IMPORTED
```

Event payload:

* batchId
* source
* importedAt

---

# REQUIRED IMPORT REPORT

After import, return:

```js
{
  ok: true,
  batchId,
  received,
  imported,
  skipped,
  duplicates,
  errors: [],
  top10: []
}
```

Top10 should be sorted by:

1. previewReadinessScore descending
2. auditScore descending
3. priority HIGH > MEDIUM > LOW

---

# REQUIRED UI

Add simple UI section:

```text
Batch Top 10 Import
```

It can be basic:

* Textarea for JSON paste
* Import button
* Result summary
* Top 10 list after import

Do not create complex scraping UI.

Optional but useful:

* Download sample JSON button / show sample schema

---

# DEDUPLICATION

Prevent duplicate leads.

Use existing dedupe if available.

Suggested dedupe keys:

* id
* businessName + whatsapp
* businessName + location
* website

If duplicate:

* skip
* count as duplicate
* include in report

Additionally: if a matched duplicate corresponds to an existing lead whose
status/dealStatus/pipelineStatus is CLOSED_WON or CLOSED_LOST, the imported
record MUST be skipped and reported as a "closed deal duplicate" — it must
NOT be allowed into the Top 10 ranking list even if its score is high. A
business that already closed (won or lost) is not a fresh prospect. Report
these separately from normal duplicates so the operator can see why.

Do not overwrite existing lead unless existing import system already supports safe merge.

---

# VERIFICATION TEST

Create a safe test JSON array with 3 prospects:

1. Complete prospect
2. Missing whatsapp but has facebook/website
3. Invalid prospect missing businessName

Test:

* valid records import
* invalid record rejected with reason
* duplicates skipped
* auditScore calculated
* previewReadinessScore calculated
* missingFields populated
* top10 returned
* UI shows import result
* lead card shows audit section
* preview generation works for imported complete prospect
* WhatsApp flow still manual only
* no auto-send added
* payment fields still present
* existing Zira lead unaffected

---

# REPORT BACK

Return:

## Files changed

## Import format supported

## Validation rules added

## Deduplication behavior — include count and list of any "closed deal
## duplicates" found (matches against existing CLOSED_WON/CLOSED_LOST leads)
## and confirm none of them entered the Top 10 ranking

## UI changes

## Test JSON used

## Import test result

## Top10 ranking result

## Regression check

## Bugs found

## Next recommended patch

STOP after report.
