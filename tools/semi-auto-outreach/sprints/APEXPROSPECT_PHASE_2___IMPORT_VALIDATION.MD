# APEXPROSPECT_PHASE_2___IMPORT_VALIDATION.MD
# ApexProspect Phase 2 — Import Validation & UX Hardening
# Run: claude "Execute sprints/APEXPROSPECT_PHASE_2___IMPORT_VALIDATION.MD"

## ROLE
You are working on ApexProspect by AUKIY.

## GOAL
Harden the import flow so operators get clear, actionable feedback when
Codex agent JSON is malformed, missing required fields, or partially valid.
Currently errors are shown but UX is minimal — operator has no guidance on
what went wrong or how to fix it.

## PROJECT PATH
C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach\

## CURRENT STATE (from Phase 1B audit)
- submitImport() in public/app.js parses JSON client-side, POSTs to /api/leads/import
- Server validates: businessName, niche, location required; at least one contact field
- Errors returned as `data.errors[]` with businessName + reasons[]
- UI shows errors in import-errors-block list
- Top 10 ranking table shown after successful import
- `NEEDS_REVIEW` not in server KNOWN_STATUSES — gets downgraded to NEW then
  re-overridden by safety defaults (functional but confusing)

## RULES — WAJIB IKUT
- Do not remove working import/export/review/payment/log functionality
- Do not rebuild the whole UI
- Do not change WhatsApp send behavior
- Do not auto-send or auto-contact
- Patch small and safely
- Preserve all existing error reporting — only ADD to it

---

## STEP 1 — ADD NEEDS_REVIEW TO SERVER KNOWN_STATUSES

In server.js, find the KNOWN_STATUSES set inside POST /api/leads/import (around line 678).

Current:
```javascript
const KNOWN_STATUSES = new Set([
  'NEW','PREVIEW_READY','APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND',
  'SENT_MANUAL_CONFIRMATION_NEEDED','REPLIED','FOLLOW_UP_NEEDED',
  'REJECTED_NEEDS_REWORK','CLOSED_WON','CLOSED_LOST'
]);
```

Add 'NEEDS_REVIEW' to the set:
```javascript
const KNOWN_STATUSES = new Set([
  'NEW','NEEDS_REVIEW','PREVIEW_READY','APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND',
  'SENT_MANUAL_CONFIRMATION_NEEDED','REPLIED','FOLLOW_UP_NEEDED',
  'REJECTED_NEEDS_REWORK','CLOSED_WON','CLOSED_LOST'
]);
```

This eliminates the unnecessary NEW→NEEDS_REVIEW double-conversion found in
Phase 1B smoke test T8.

---

## STEP 2 — IMPROVE CLIENT-SIDE PRE-VALIDATION IN submitImport()

In public/app.js, find submitImport() (around line 1325).

After the JSON.parse and array check, add a client-side pre-flight check
BEFORE sending to server. This gives instant feedback without a round-trip.

Add this block after `if (!Array.isArray(parsed)) { ... }`:

```javascript
// Client-side pre-flight: warn if array is suspiciously large or empty objects
const emptyRecords = parsed.filter(r => !r || typeof r !== 'object' || Object.keys(r).length === 0);
if (emptyRecords.length > 0) {
  alert(`Import contains ${emptyRecords.length} empty object(s). Paste valid Codex agent JSON.`);
  return;
}
if (parsed.length > 100) {
  const go = confirm(`Large import: ${parsed.length} records. Continue?`);
  if (!go) return;
}
```

Keep all existing behavior after this block unchanged.

---

## STEP 3 — ENRICH SERVER VALIDATION ERRORS WITH FIELD HINTS

In server.js, find the validation section inside POST /api/leads/import
(the block that builds validationErrors[], around line 624).

Current validation only flags missing businessName/niche/location/contact.

Add field-level hints to make errors actionable. Replace the validation block:

```javascript
const validationErrors = [];
if (!businessName) validationErrors.push('missing businessName — required field');
if (!niche)        validationErrors.push('missing niche — required field');
if (!location)     validationErrors.push('missing location — required field (use "location" or "lokasi")');

const wa       = (src.whatsapp || src.whatsappNumber || '').replace(/[^0-9+]/g, '');
const phone    = (src.phone    || '').replace(/[^0-9+]/g, '');
const facebook = (src.facebook  || src.facebookUrl  || src.facebookPageLink || '').trim();
const instagram = (src.instagram || src.instagramUrl || src.instagramLink   || '').trim();
const gmapsUrl  = (src.googleMapsUrl || src.googleMapsLink || '').trim();
const hasContact = wa || phone || facebook || instagram || website || gmapsUrl;
if (!hasContact) validationErrors.push(
  'missing contact — need at least one of: whatsappNumber, phone, facebookPageLink, instagramLink, websiteLink, googleMapsLink'
);
```

Key changes:
- Added `src.facebookPageLink` fallback (Codex schema uses this field name)
- Added `src.instagramLink` fallback (Codex schema uses this field name)
- Added `src.googleMapsLink` fallback (Codex schema uses this field name)
- Error messages now name the exact field expected

---

## STEP 4 — ADD WARNINGS TO IMPORT RESPONSE FOR LOW-QUALITY RECORDS

In server.js, after the safety defaults block (after line 767), add a
quality warning check before pushing to existing[]:

```javascript
// Quality warnings — imported but flagged for operator attention
const warnings = [];
if (!lead.whatsappNumber) warnings.push('no WhatsApp number — manual search needed');
if ((lead.previewReadinessScore || 0) < 30) warnings.push(`low preview readiness score (${lead.previewReadinessScore || 0}) — incomplete data`);
if ((lead.sourceEvidence || []).length === 0) warnings.push('no source evidence URLs — verify manually');
if (warnings.length > 0) lead.importWarnings = warnings;
```

Also update the response to include a `warned` count and `warnedList`:

Find the response block (around line 792) and add:
```javascript
const warned = importedLeads.filter(l => l.importWarnings && l.importWarnings.length > 0);
```

Add to the res.json() response object:
```javascript
warned:      warned.length,
warnedList:  warned.map(l => ({ businessName: l.businessName, warnings: l.importWarnings })),
```

---

## STEP 5 — SHOW WARNINGS IN IMPORT RESULT UI

In public/app.js, find the import result HTML builder in submitImport()
(around line 1344).

After the existing `summaryParts` array, add a warned count:

```javascript
if ((data.warned || 0) > 0) {
  summaryParts.push(`<span class="import-stat-warn">${data.warned} imported with warnings</span>`);
}
```

After the closed-deal duplicates block and before the Top 10 block, add:

```javascript
// ── Import warnings ──
if ((data.warnedList || []).length) {
  html += `<div class="import-warn-block"><strong>⚠ Imported with warnings (review these first):</strong><ul class="import-err-list">` +
    data.warnedList.map(w =>
      `<li><strong>${esc(w.businessName)}</strong>: ${w.warnings.map(esc).join(' · ')}</li>`
    ).join('') +
    `</ul></div>`;
}
```

---

## STEP 6 — VERIFY CODEX FIELD NAME ALIASES ARE ALL MAPPED

The Codex schema (from Phase 1) uses these field names:
- `googleMapsLink` (not googleMapsUrl)
- `facebookPageLink` (not facebook/facebookUrl)
- `instagramLink` (not instagram/instagramUrl)
- `websiteLink` (not website)
- `whatsappNumber` (already mapped)

In server.js, find the field extraction block (around line 631-636) and
confirm or add these aliases:

```javascript
const wa        = (src.whatsapp || src.whatsappNumber || '').replace(/[^0-9+]/g, '');
const phone     = (src.phone    || '').replace(/[^0-9+]/g, '');
const facebook  = (src.facebook  || src.facebookUrl  || src.facebookPageLink || '').trim();
const instagram = (src.instagram || src.instagramUrl || src.instagramLink    || '').trim();
const gmapsUrl  = (src.googleMapsUrl || src.googleMapsLink || '').trim();
const website   = (src.website || src.websiteLink || '').trim().toLowerCase();
```

Also map these Codex fields into the lead object inside migrateLeadRecord():
```javascript
googleMapsUrl:  gmapsUrl,
facebookPageLink: facebook,
instagramLink:  instagram,
websiteLink:    website,
```

Add these to the lead object construction block (around line 689-743).

---

## STEP 7 — CREATE REPORT FILE

Create file: `sprints/APEXPROSPECT_PHASE_2_IMPORT_VALIDATION_REPORT.md`

```markdown
# APEXPROSPECT PHASE 2 — IMPORT VALIDATION REPORT

## Status: COMPLETE
## Date: [today]

## Files Changed
- server.js — NEEDS_REVIEW added to KNOWN_STATUSES; Codex field aliases mapped;
  validation errors enriched; import warnings added
- public/app.js — client-side pre-flight validation; warnings shown in result UI

## Functions Changed
- POST /api/leads/import — NEEDS_REVIEW recognised; Codex field aliases resolved;
  richer validation errors; importWarnings[] per lead; warnedList in response
- submitImport() — empty-object guard; large-batch confirm; warned count in summary;
  warnedList block in result HTML

## How To Test
1. Import the Phase 1B sample JSON — should import cleanly, no warnings
2. Import JSON with missing businessName — should show: "missing businessName — required field"
3. Import JSON with empty objects {} — should alert immediately, not send to server
4. Import JSON with no sourceEvidence — should import but show warning
5. Import JSON with googleMapsLink field — should be recognized and mapped

## Codex Field Alias Coverage
| Codex field      | Server alias chain                              | Mapped |
|------------------|-------------------------------------------------|--------|
| whatsappNumber   | src.whatsapp || src.whatsappNumber              | ✓      |
| facebookPageLink | src.facebook || src.facebookUrl || src.facebookPageLink | ✓ |
| instagramLink    | src.instagram || src.instagramUrl || src.instagramLink | ✓ |
| googleMapsLink   | src.googleMapsUrl || src.googleMapsLink         | ✓      |
| websiteLink      | src.website || src.websiteLink                  | ✓      |

## Final Status
IMPORT VALIDATION: HARDENED
Codex agent JSON imports correctly with full field alias support,
enriched validation errors, and quality warnings for incomplete records.
```

---

## STEP 8 — GIT COMMIT

```bash
cd C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine
git add tools/semi-auto-outreach/public/app.js
git add tools/semi-auto-outreach/server.js
git add tools/semi-auto-outreach/sprints/APEXPROSPECT_PHASE_2_IMPORT_VALIDATION_REPORT.md
git commit -m "feat: phase 2 import validation — Codex field aliases, enriched errors, quality warnings"
git push
```

Report commit hash.

STOP AFTER REPORT.

---

## FINAL REPORT FORMAT

```
✅ STEP 1 — NEEDS_REVIEW added to KNOWN_STATUSES: [confirmed]
✅ STEP 2 — Client pre-flight validation added: [confirmed]
✅ STEP 3 — Server validation errors enriched with field hints: [confirmed]
✅ STEP 4 — Import warnings added (no WA, low score, no evidence): [confirmed]
✅ STEP 5 — Warnings shown in import result UI: [confirmed]
✅ STEP 6 — Codex field aliases mapped in server: [confirmed]
✅ STEP 7 — Report file created
✅ STEP 8 — Git: [commit hash]

IMPORT VALIDATION: HARDENED
```
