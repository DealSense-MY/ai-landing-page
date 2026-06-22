# APEXPROSPECT PHASE 2 — IMPORT VALIDATION REPORT

## Status: COMPLETE
## Date: 2026-06-22

## Files Changed
- server.js — NEEDS_REVIEW added to KNOWN_STATUSES; websiteLink/facebookPageLink/
  instagramLink/googleMapsLink Codex aliases mapped in extraction + lead object;
  validation error messages enriched; importWarnings[] per lead; warned/warnedList in response
- public/app.js — empty-object pre-flight guard; large-batch confirm; warned count
  in summary bar; warnedList block in result HTML

## Functions Changed
- POST /api/leads/import — NEEDS_REVIEW now a known status (no more NEW→NEEDS_REVIEW
  double-conversion); Codex field names resolved at extraction; richer validation errors;
  importWarnings[] attached to each low-quality lead; warned+warnedList in response
- submitImport() — empty-object guard before server round-trip; large-batch confirm
  dialog; warned count in import summary; warnings list rendered before Top 10 table

## How To Test
1. Import Phase 1B sample JSON — imports cleanly, 0 warnings (has WA + sourceEvidence)
2. Import JSON with missing businessName — error: "missing businessName — required field"
3. Import JSON with empty objects `[{}]` — client alert fires, nothing sent to server
4. Import JSON with googleMapsLink field — recognized, mapped, not rejected
5. Import JSON with facebookPageLink but no whatsappNumber — imports with warning:
   "no WhatsApp number — manual search needed"
6. Import JSON with no sourceEvidence — imports with warning: "no source evidence URLs"
7. Import 101 records — confirm dialog appears before sending

## Codex Field Alias Coverage
| Codex field      | Server alias chain                                      | Mapped |
|------------------|---------------------------------------------------------|--------|
| whatsappNumber   | src.whatsapp \|\| src.whatsappNumber                   | ✓      |
| websiteLink      | src.website \|\| src.websiteLink                       | ✓      |
| facebookPageLink | src.facebook \|\| src.facebookUrl \|\| src.facebookPageLink | ✓ |
| instagramLink    | src.instagram \|\| src.instagramUrl \|\| src.instagramLink  | ✓ |
| googleMapsLink   | src.googleMapsUrl \|\| src.googleMapsLink              | ✓      |

## Quality Warning Triggers
| Condition                          | Warning message                                        |
|------------------------------------|--------------------------------------------------------|
| whatsappNumber empty               | no WhatsApp number — manual search needed              |
| previewReadinessScore < 30         | low preview readiness score (N) — incomplete data      |
| sourceEvidence[] empty or missing  | no source evidence URLs — verify manually              |

## Final Status
IMPORT VALIDATION: HARDENED
Codex agent JSON imports correctly with full field alias support,
enriched validation errors, and quality warnings for incomplete records.
Operators see actionable feedback for every failure and every low-quality import.
