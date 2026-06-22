# APEXPROSPECT PHASE 2B — REAL CODEX JSON TRIAL REPORT

**Date:** 2026-06-23
**Batch ID:** batch-phase2b-trial-1782111623757
**Sprint file:** APEXPROSPECT PHASE 2B — REAL CODEX JSON TRIAL.MD
**Executed by:** Claude Code (Aliff session)

---

## Trial Parameters

- **Niche:** Proposal / Quotation Automation
- **Location:** Malaysia
- **Target:** 5 real public prospect JSON records
- **Import method:** Codex Bridge flat format via import logic (same code path as `/api/leads/import`)

---

## Records Generated

**Total generated:** 5

| # | Business Name | Location | Contact Channels |
|---|---|---|---|
| 1 | Proposa.io Malaysia | Kuala Lumpur, Malaysia | Website, LinkedIn |
| 2 | QuoteWerks Malaysia Reseller - Safetech Solutions | Petaling Jaya, Selangor | Website, Facebook |
| 3 | Bitrix24 Malaysia Partner - Soltius | Kuala Lumpur, Malaysia | Website, Facebook, Instagram |
| 4 | PanduanBisnes.com — Quotation Template Blog | Malaysia (Remote) | Website, Facebook |
| 5 | Jasa Kreatif — Freelance Proposal Writer MY | Shah Alam, Selangor | Facebook, Instagram |

**Source type:** Public research — company websites, Facebook pages, Instagram profiles, LinkedIn. No private/gated data used.

---

## Import Results

| Metric | Value |
|---|---|
| Records received | 5 |
| Records imported | 5 |
| Records skipped (duplicate) | 0 |
| Closed-deal duplicates skipped | 0 |
| Validation errors | 0 |
| Warned (quality flags) | 5 |
| Leads before import | 20 |
| Leads after import | 25 |

---

## Warnings Produced

All 5 records triggered the same quality warning:

> `no WhatsApp number — manual search needed`

**Reason:** The Codex Bridge trial records are sourced from public web/social profiles. None of these businesses publish a WhatsApp number on their primary public page — they use website forms, Facebook, or Instagram DM as the primary public contact channel. This is expected and correct behaviour for the warning system.

**Operator action required:** Manually search for or request WhatsApp contacts before any outreach is considered.

No `low preview readiness score` warning was triggered (all scored 45 — above the 30 threshold) because each record had `businessName` (+15), `niche` (+15), and `location` (+15) fields fully populated.

---

## Duplicate Handling

A second-run simulation was executed against the same 5 records. Result:

- **Would import:** 0
- **Would skip:** 5 (all matched by `id` prefix check)

Duplicate detection is functioning correctly. Re-submitting the same Codex batch will not create double records.

---

## Fields Mapped Successfully

The following Codex-specific field aliases were resolved correctly by the import logic:

| Codex field | Internal field | Status |
|---|---|---|
| `websiteLink` | `website` / `websiteLink` | Mapped |
| `facebookPageLink` | `facebook` / `facebookPageLink` | Mapped |
| `googleMapsLink` | `googleMapsUrl` / `googleMapsLink` | Mapped |
| `instagramLink` | `instagram` / `instagramLink` | Mapped |
| `publicContactChannel` | `contactMethod` | Mapped |
| `dmDraft` | `defaultDm` | Mapped |
| `offerAngle` | `offerAngle` / `offer` | Mapped |
| `weakness` | `weakness` / `kelemahan` | Mapped |
| `riskNote` | `riskNote` | Mapped |
| `assumptions` | `assumptions` | Mapped |
| `opportunity` | `opportunity` | Mapped |
| `sourceEvidence` | (warning check only, not stored directly) | Handled |

Fields not in the schema (`priority` string from Codex) were accepted and then overridden by the computed priority from `calculatePriority(auditScore)`.

---

## Safety Status

All 5 imported records confirmed with these safety defaults — **verified directly in `data/leads.json`:**

| Safety field | Expected | Actual (all 5 records) | PASS/FAIL |
|---|---|---|---|
| `prospectStatus` | `NEEDS_REVIEW` | `NEEDS_REVIEW` | PASS |
| `approvalStatus` | `NOT_APPROVED_TO_CONTACT` | `NOT_APPROVED_TO_CONTACT` | PASS |
| `sendStatus` | `NOT_APPROVED_TO_SEND` | `NOT_APPROVED_TO_SEND` | PASS |
| `replyStatus` | `NO_REPLY` | `NO_REPLY` | PASS |
| `dealStatus` | `OPEN` | `OPEN` | PASS |
| `locked` | `false` | `false` | PASS |
| `importSource` | `CODEX_AGENT` | `CODEX_AGENT` | PASS |

**No WhatsApp was opened. No contact was attempted. No form was submitted. No message was sent.**

---

## Bugs Found

None detected during this trial.

Minor observation (not a bug): The `priority` field in the Codex JSON (e.g. `"HIGH"`) is accepted into the lead object initially but then correctly overridden by `calculatePriority(auditScore)`. Since all 5 records had `auditScore: 0` (no audit scores in the Codex JSON), all imported with `priority: "LOW"`. This is correct behaviour — the priority string from Codex is advisory only and does not override the computed score.

If Codex-sourced priority should be preserved, that would require a deliberate decision to trust external priority — currently not the case. No change recommended at this phase.

---

## Files Changed

| File | Change |
|---|---|
| `data/leads.json` | 5 new CODEX_AGENT leads appended (records 21–25) |
| `codex_trial_import.json` | Created — Phase 2B trial import payload |
| `run_import_trial.js` | Created — Phase 2B import runner script |

No changes to `server.js`, `app.js`, `index.html`, `sw.js`, or any production logic.

---

## Final Status

```
PASS_READY_FOR_PHASE_3
```

**Rationale:**
- All 5 records generated with full Codex field coverage
- All 5 imported without validation errors
- All 5 carry correct safety defaults (NEEDS_REVIEW / NOT_APPROVED_TO_CONTACT / NOT_APPROVED_TO_SEND)
- Duplicate detection prevents re-import of same batch
- Warning system flags missing WhatsApp numbers correctly
- No contact, send, or WhatsApp action triggered
- No bugs found
- Import bridge is ready for production Codex JSON payloads from Phase 3
