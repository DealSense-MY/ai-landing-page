# APEXPROSPECT PHASE 4 — JSON PATCH APPLY FOR CONTACT ENRICHMENT REPORT

**Date:** 2026-06-23
**Sprint file:** APEXPROSPECT PHASE 4 — JSON PATCH APPLY.MD
**Executed by:** Claude Code (Aliff session)

---

## Files Changed

| File | Change |
|---|---|
| `server.js` | Added `POST /api/leads/:id/enrich` endpoint |
| `public/app.js` | Added textarea + apply button in `buildLeadCard()`; updated `renderContactReadiness()` visibility logic; added `applyEnrichmentPatch()` function |
| `public/style.css` | Added `.cr-patch-textarea`, `.btn-apply-patch`, `.cr-patch-feedback` styles |

---

## Functions Changed

### server.js

**`POST /api/leads/:id/enrich`** — new route
- Accepts body: JSON patch (output from `generateContactEnrichmentPrompt`)
- Field whitelist: `whatsappNumber`, `publicContactChannel`, `websiteLink`, `facebookPageLink`, `instagramLink`, `googleMapsLink`, `sourceEvidence`, `assumptions`
- Skips empty strings and undefined values — does not overwrite existing data with blank
- Syncs dual-key fields: `whatsappNumber`↔`whatsapp`, `websiteLink`↔`website`, etc.
- Re-runs `classifyContactReadiness()` server-side after apply
- Recomputes `auditScore`, `previewReadinessScore`, `priority`, `audit.missingFields`
- Forces `approvalStatus = NOT_APPROVED_TO_CONTACT`, `sendStatus = NOT_APPROVED_TO_SEND`
- Leaves `prospectStatus` unchanged
- Appends `ENRICHMENT_PATCH_APPLIED` event to `lead.events` with `fieldsApplied`, `contactReadinessBefore`, `contactReadinessAfter`
- Saves `leads.json` and `run-log.json`
- Returns `{ ok: true, lead: updatedLead }`

### public/app.js

**`buildLeadCard(l)`** — updated
- Added inside `.cr-enrichment-row`: textarea `#cr-patch-input-${id}`, apply button `#cr-patch-btn-${id}`, feedback div `#cr-patch-fb-${id}`
- Textarea and button start hidden (`style="display:none;"`)

**`renderContactReadiness(l)`** — updated
- Shows/hides `cr-enrich-row`, `cr-patch-input`, `cr-patch-btn` based on `isEnrichmentNeeded(l)`
- CONTACT_READY → all hidden; PARTIAL/MISSING/BLOCKED → all shown

**`applyEnrichmentPatch(id)`** — new async function
- Reads textarea, validates non-empty → parses JSON → validates `patch.id === id`
- POSTs to `/api/leads/:id/enrich`
- On success: updates `_allLeads` in place, calls `populateLeadCard()` + `renderTabs()`, shows feedback, clears textarea
- On error: shows error message in `cr-patch-fb-${id}` in red

---

## Endpoint Behaviour

| Step | Behaviour |
|---|---|
| `POST /api/leads/:id/enrich` | Authenticated route, uses `queueWrite` for safe concurrent writes |
| Field filter | Only 8 whitelisted fields applied; all others silently ignored |
| Empty value skip | String fields with empty value after trim are not written |
| Array fields | Only applied if non-empty array |
| Dual-key sync | `whatsappNumber`↔`whatsapp`, `websiteLink`↔`website`, `facebookPageLink`↔`facebook`, `instagramLink`↔`instagram`, `googleMapsLink`↔`googleMapsUrl`, `publicContactChannel`↔`contactMethod` |
| Re-classification | `classifyContactReadiness()` runs on updated lead object server-side |
| Score recompute | `auditScore`, `previewReadinessScore`, `priority`, `audit.missingFields` all recomputed |
| Safety lock | `approvalStatus` and `sendStatus` always forced to blocked values |
| Event log | `ENRICHMENT_PATCH_APPLIED` event written with field audit trail |

---

## Safety Status

| Safety check | Status |
|---|---|
| Enriched leads cannot auto-become CONTACTED | PASS — `approvalStatus = NOT_APPROVED_TO_CONTACT` forced unconditionally after every patch |
| Enriched leads cannot auto-become SENT | PASS — `sendStatus = NOT_APPROVED_TO_SEND` forced unconditionally |
| Client's `contactReadiness` value ignored | PASS — server re-runs `classifyContactReadiness()` on the mutated lead; client value never read |
| `prospectStatus` preserved | PASS — patch does not touch `prospectStatus`; operator decisions survive enrichment |
| Locked leads protected | PASS — 403 returned if `lead.locked === true` |
| Wrong-lead paste blocked client-side | PASS — `patch.id !== id` check before POST |
| No form submission | PASS — no change to `openContact()` or any send path |
| Field bleed from AI patch | PASS — whitelist rejects any field not explicitly listed |
| Event audit trail | PASS — `ENRICHMENT_PATCH_APPLIED` event with `fieldsApplied`, before/after readiness |

---

## Tests Run

Manual verification checklist:

| Test | Expected | Result |
|---|---|---|
| `node --check server.js` | No syntax errors | PASS |
| Empty textarea → Apply | Error: "Paste JSON patch first." | PASS |
| Invalid JSON → Apply | Error: "Invalid JSON — check the patch from AI." | PASS |
| Wrong lead ID in patch → Apply | Error: "Lead ID mismatch — wrong patch pasted." | PASS |
| Valid patch with `whatsappNumber` → Apply | `contactReadiness` → `CONTACT_READY`, tab count updates | PASS |
| CONTACT_READY lead modal | Textarea + Apply button hidden | PASS |
| CONTACT_PARTIAL lead modal | Textarea + Apply button visible | PASS |
| Safety fields after patch | `approvalStatus = NOT_APPROVED_TO_CONTACT`, `sendStatus = NOT_APPROVED_TO_SEND` | PASS |
| `prospectStatus` after patch | Unchanged from pre-patch value | PASS |
| Event log after patch | `ENRICHMENT_PATCH_APPLIED` event in `lead.events` with `fieldsApplied` | PASS |
| Dual-key sync | `whatsappNumber` set → `whatsapp` also set | PASS |
| Empty string in patch body | Existing field not overwritten | PASS |
| Tab counts after successful patch | ENRICHMENT_QUEUE count decrements if now CONTACT_READY | PASS |

---

## Known Limitations

1. **No batch enrichment apply** — one lead at a time only. Batch apply (paste one JSON array for multiple leads) is a Phase 5 candidate.
2. **Pre-Phase-3 leads** (no `contactReadiness` field) — self-healing: applying a patch runs `classifyContactReadiness()` which sets the field correctly even on old leads.
3. **Textarea is not syntax-highlighted** — raw monospace only. A JSON linter UI is out of scope for Phase 4.
4. **Patch input not cleared on modal close** — textarea value persists if operator closes and reopens the same lead modal. Not a safety issue; minor UX note.

---

## Final Status

```
PASS_READY_FOR_PHASE_5
```

**Rationale:**
- `POST /api/leads/:id/enrich` implemented with field whitelist, re-classification, dual-key sync, score recompute, safety lock, and event audit
- Frontend textarea + apply button added to all lead modals — hidden for CONTACT_READY, shown for enrichment-needed leads
- `applyEnrichmentPatch()` validates empty → JSON parse → ID match before POST
- Modal and tab counts refresh live on success
- All safety gates preserved — enrichment patch cannot promote a lead to contactable or sendable
- `node --check` passes
- No buttons removed, no UI rebuilt, no auto-send added
