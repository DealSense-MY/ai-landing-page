# 05_APEXPROSPECT_PATCH_04_AUDIT_SCORE_PREVIEW_READINESS

ROLE:
You are Claude Code CLI.

PROJECT:
ApexProspect by AUKIY
Path: tools/semi-auto-outreach/
Localhost: 3777

MISSION:
Add minimal Audit Score + Preview Readiness fields so ApexProspect can rank prospects and identify which leads are ready for landing page preview generation.

DO NOT rewrite.
DO NOT refactor widely.
DO NOT add auto-send.
DO NOT break WhatsApp approval flow.
DO NOT break payment/revenue patch.
DO NOT break preview generation.
DO NOT manually edit live data files.

---

# CURRENT PATCH STATE

PATCH 1:
PASS — previewBuilder confirmed working.

PATCH 2:
PASS — payment/revenue tracking added.

PATCH 3:
PASS — REJECTED_NEEDS_REWORK dead-end fixed.
Smart Panel now has priority bucket: "P2 — Needs Rewrite"

Now implement PATCH 4 only.

---

# BUSINESS GOAL

ApexProspect must help Aliff choose the best prospects, not just store leads.

This patch should help answer:

1. Is this prospect worth contacting?
2. Is the data enough to generate a preview?
3. What is missing before preview?

---

# ⚠️ CRITICAL REQUIREMENT 1 — SAFE MIGRATION FOR EXISTING LEADS

Zira Beauty Spa and any other existing lead in leads.json was created BEFORE this schema existed.
These records do NOT have the new `audit` object or score fields.

YOU MUST defensively handle missing/undefined fields. This is not optional.

Rules:

* `migrateLeadRecord()` MUST backfill the full `audit: {...}` object with safe defaults
  for any lead that doesn't already have it, BEFORE any score calculation runs.
* `calculateAuditScore(lead)` and `calculatePreviewReadinessScore(lead)` MUST NOT
  assume `lead.audit` or any sub-field exists. Use safe access
  (e.g. `lead.audit?.websiteScore || 0`, or check-and-default at function entry).
* Test explicitly: load Zira's CURRENT record (as it exists right now, without
  manually editing it first) through the migration + scoring path and confirm:
  - No crash / no thrown error / no unhandled exception in server console
  - No malformed response sent to frontend
  - Zira ends up with `auditScore: 0` (or a calculated value if her record happens
    to have partial matching fields) — never `undefined`, `NaN`, or missing entirely

If ANY existing lead causes a crash or error during this test, STOP, do not proceed
to UI/Smart Panel work, and report the exact error + lead id + stack trace instead.

---

# ⚠️ CRITICAL REQUIREMENT 2 — NO COLLIDING "P2" LABELS IN SMART PANEL

Patch 3 already created a Smart Panel priority bucket called:

```
P2 — Needs Rewrite
```

This patch is about to propose:

```
P2 — Missing preview data
```

These are TWO DIFFERENT MEANINGS using the SAME LABEL ("P2"). This is a real UX bug
if both ship as-is — the operator will not be able to tell which P2 a lead belongs to
at a glance.

YOU MUST resolve this naming collision before implementing the Smart Panel section
of this patch. Do one of the following (pick whichever is lowest-risk given current
Smart Panel architecture):

OPTION A (preferred if low risk):
Rename to distinct labels, e.g.:
* "P2 — Needs Rewrite" (existing, from Patch 3 — leave as is)
* "P2 — Missing Preview Data" → rename to "P3 — Missing Preview Data"
  (or another tier number that does not already exist)

OPTION B (if renaming existing Patch 3 label is safer):
Keep this patch's label as "P2" and rename Patch 3's bucket instead — but only
if Patch 3's label is not already referenced elsewhere (CSS class, saved view,
documentation) in a way that would break.

OPTION C (if both must coexist under same tier for a real architectural reason):
Keep both as "P2" but add a clear sub-label distinguishing them, e.g.:
"P2 — Needs Rewrite" and "P2 — Needs Data" rendered as visually separate
sections/headers within the panel, never merged into one undifferentiated list.

Do NOT silently leave two sections both labeled exactly "P2" with no way for
the operator to distinguish them. This must be explicitly resolved and reported.

---

# REQUIRED SCHEMA FIELDS

Add safe defaults in migrateLeadRecord() and POST /api/leads new creation:

```js
auditScore: 0,
previewReadinessScore: 0,
priority: "LOW",
audit: {
  websiteScore: 0,
  mobileScore: 0,
  ctaScore: 0,
  socialScore: 0,
  reviewScore: 0,
  weakness: [],
  opportunity: [],
  missingFields: []
}
```

Do not remove existing `fitScore` or `agentRank`.
If fitScore exists, keep it.

---

# SCORE RULES

Use simple scoring only.

## Audit Score

0–100 based on:

* websiteScore
* mobileScore
* ctaScore
* socialScore
* reviewScore

If no input, default 0.

Priority:

```text
80–100 = HIGH
50–79 = MEDIUM
0–49 = LOW
```

## Preview Readiness Score

Calculate based on required landing page data:

Required:

* businessName
* niche
* location
* whatsapp
* landingPageEngineData exists
* services or content exists
* CTA exists or whatsapp exists

Suggested scoring:

* businessName: 15
* niche: 15
* location: 15
* whatsapp: 20
* landingPageEngineData: 15
* services/content: 10
* CTA/contact: 10

Total 100.

---

# REQUIRED FUNCTIONS

Add helper functions if suitable:

```js
calculateAuditScore(lead)
calculatePreviewReadinessScore(lead)
calculatePriority(score)
getMissingPreviewFields(lead)
```

All four functions MUST use safe/defensive field access per CRITICAL REQUIREMENT 1
above. Do not assume any nested field exists.

Use them in migration or render flow safely.

Do not create complex AI logic yet.

---

# REQUIRED UI

In lead card/modal, show:

* Audit Score
* Preview Readiness Score
* Priority
* Missing Preview Fields
* Weakness
* Opportunity

Add simple editable fields if low risk:

* websiteScore
* mobileScore
* ctaScore
* socialScore
* reviewScore
* weakness
* opportunity

If editing fields is too risky, display only and report editing as next patch.

---

# PIPELINE RULE

A lead can be considered PREVIEW_READY if:

```text
previewReadinessScore >= 70
```

Do not automatically move status unless existing flow supports safe action.

Instead show recommended next action:

```text
Ready to generate preview.
```

If below 70:

```text
Complete missing preview data.
```

---

# SMART PANEL

Add or update Smart Panel logic, resolving the P2 naming collision per
CRITICAL REQUIREMENT 2 above:

* HIGH priority + previewReadinessScore >= 70:
  "P1 — Ready for preview/outreach"

* previewReadinessScore < 70:
  Use whichever non-colliding label was decided in CRITICAL REQUIREMENT 2
  (e.g. "P3 — Missing Preview Data" or "P2 — Needs Data" as a distinct
  sub-section from "P2 — Needs Rewrite")

Do not remove existing payment/rewrite priorities.

---

# VERIFICATION TEST

Use existing leads.

Confirm:

1. Server still runs.
2. Existing leads migrate safely — explicitly test Zira's actual current record,
   not a freshly seeded test lead.
3. No existing lead crashes because audit field is missing — show actual console
   output / response for Zira's record as proof, not just "yes/no".
4. Audit score displays.
5. Preview readiness score displays.
6. Missing fields display.
7. Payment section still works.
8. REJECTED_NEEDS_REWORK still appears in Needs Review / "P2 — Needs Rewrite".
9. Smart Panel shows NO two sections sharing an identical, undifferentiated
   "P2" label — confirm exact final label text for both buckets.
10. Preview generation still works.
11. WhatsApp flow still manual only.
12. No auto-send added.

---

# REPORT BACK

Return:

## Files changed

## Schema fields added

## Score functions added

## UI changes

## Smart Panel changes — include exact final label text used for both
## "Needs Rewrite" and "Missing Preview Data" buckets, and confirm they
## are visually/textually distinguishable

## Migration result — include actual proof Zira's existing record was
## tested through migration + scoring without crashing (show output)

## Verification result

## Bugs found

## Next recommended patch

STOP after report.
