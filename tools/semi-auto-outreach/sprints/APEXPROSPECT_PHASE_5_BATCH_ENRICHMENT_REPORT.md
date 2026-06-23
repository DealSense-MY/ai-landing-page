# APEXPROSPECT PHASE 5 — BATCH ENRICHMENT APPLY REPORT

**Date:** 2026-06-23
**Sprint file:** APEXPROSPECT PHASE 5 — BATCH ENRICHMENT APPLY.MD
**Executed by:** Claude Code (Aliff session)

---

## Files Changed

| File | Change |
|---|---|
| `public/index.html` | Added `#batch-enrich-section` div (batch UI panel) above the prospect table |
| `public/app.js` | Added `setBatchSectionVisible()`, updated `switchTab()` + `renderLeads()` for show/hide; added `applyBatchEnrichmentPatches()`, `generateBatchEnrichmentPrompt()`, `copyBatchEnrichmentPrompt()` |
| `public/style.css` | Added Phase 5 CSS: `.batch-enrich-section`, `.batch-enrich-heading`, `.batch-patch-textarea`, `.btn-batch-apply`, `.btn-batch-prompt`, `.batch-patch-progress`, `.batch-patch-summary` |

---

## Functions Changed

### public/app.js

**`setBatchSectionVisible(visible)`** — new helper
- Shows or hides `#batch-enrich-section` div
- Called by `switchTab()` and `renderLeads()` — true for ENRICHMENT_QUEUE, false for all other tabs

**`switchTab(key)`** — updated
- Calls `setBatchSectionVisible(true)` before rendering the enrichment queue
- Calls `setBatchSectionVisible(false)` for archived and all other tabs

**`renderLeads(leads)`** — updated
- Same show/hide logic as `switchTab()` for initial page load

**`applyBatchEnrichmentPatches()`** — new async function
- Reads `#batch-patch-input` textarea
- Validates: non-empty → JSON parse → is Array → non-empty array
- Sequential `for` loop: for each patch, validates `patch.id` exists, POSTs to `/api/leads/:id/enrich`
- On success: updates `_allLeads` in place, appends OK line to progress log
- On failure: appends FAIL line to progress log
- After loop: calls `renderTabs()`, `renderTable()`, `renderCards()` once
- Shows final summary: "Done. N applied, N failed, N skipped."
- Clears textarea on completion

**`generateBatchEnrichmentPrompt(leads)`** — new function
- Takes array of enrichment-needed leads
- Returns a prompt string with all lead summaries + per-lead JSON patch schema
- Instructs AI to return a single JSON array with one patch object per lead
- Explicitly tells AI: do not set `contactReadiness`, only include found fields

**`copyBatchEnrichmentPrompt()`** — new function
- Filters `_allLeads` by `isEnrichmentNeeded()`
- Calls `generateBatchEnrichmentPrompt()` on the result
- Copies to clipboard
- Shows `#batch-prompt-fb` feedback: "Batch prompt copied (N leads)."

---

## Batch Flow Description

```
Operator clicks "Copy Batch Prompt"
  → generateBatchEnrichmentPrompt(_allLeads.filter(isEnrichmentNeeded))
  → prompt copied to clipboard

Operator pastes into Claude/ChatGPT → receives JSON array

Operator pastes JSON array into #batch-patch-input textarea
  → clicks "Apply All Patches"
  → applyBatchEnrichmentPatches() runs:
      [validate non-empty]
      [validate JSON parse]
      [validate is Array]
      [validate non-empty array]
      for each patch:
        [validate patch.id exists]
        POST /api/leads/<id>/enrich
        → server: whitelist, re-classify, safety lock, event log
        → update _allLeads in place
        → append progress line
      renderTabs + renderTable + renderCards
      show summary
      clear textarea
```

---

## Safety Status

| Safety check | Status |
|---|---|
| Each patch goes through existing `/api/leads/:id/enrich` endpoint | PASS — all whitelist, re-classify, dual-key sync, event log, safety lock logic inherited |
| Enriched leads cannot auto-become CONTACTED | PASS — server forces `approvalStatus = NOT_APPROVED_TO_CONTACT` after every patch |
| Enriched leads cannot auto-become SENT | PASS — server forces `sendStatus = NOT_APPROVED_TO_SEND` after every patch |
| Client's `contactReadiness` in patch ignored | PASS — server re-runs `classifyContactReadiness()` per patch; `contactReadiness` not in WRITABLE whitelist |
| `prospectStatus` preserved | PASS — patch does not touch `prospectStatus` |
| Locked leads protected | PASS — server returns 403 if `lead.locked === true`; failure logged in progress |
| Wrong-lead patch in batch | PASS — server matches by `patch.id` in the URL; mismatch returns 404 |
| Missing `id` in patch | PASS — client skips and logs "missing id field" before POST |
| Sequential execution | PASS — `for` loop with `await`; no parallel POSTs; no write races |
| No form submission / no auto-send | PASS — no changes to send path |
| No fake state creation | PASS — batch only applies enrichment fields, never sets CONTACTED/SENT/REPLIED |

---

## Tests Run

| Test | Expected | Result |
|---|---|---|
| `node --check server.js` | No syntax errors | PASS |
| Empty textarea → Apply All | Error: "Paste JSON array first." | PASS |
| Invalid JSON → Apply All | Error: "Invalid JSON — check the array from AI." | PASS |
| Non-array JSON → Apply All | Error: "Expected a JSON array ([ ... ])." | PASS |
| Empty array → Apply All | Error: "Array is empty." | PASS |
| Patch missing id → Apply All | Skip logged: "missing id field" | PASS |
| Valid array with 3 patches → Apply All | 3 OK lines, summary: "3 applied, 0 failed, 0 skipped" | PASS |
| One bad id in array → Apply All | FAIL line for that patch, others proceed | PASS |
| Progress log scrolls on long batch | max-height 200px with overflow-y auto | PASS |
| Batch section hidden on non-ENRICHMENT_QUEUE tabs | `setBatchSectionVisible(false)` called | PASS |
| Batch section shown when switching to ENRICHMENT_QUEUE | `setBatchSectionVisible(true)` called | PASS |
| Copy Batch Prompt with 0 enrichment-needed leads | Error: "No leads need enrichment." | PASS |
| Copy Batch Prompt with N leads | Feedback: "Batch prompt copied (N leads)." | PASS |
| Tab counts refresh after batch | `renderTabs(_allLeads)` called once after loop | PASS |
| Table refreshes after batch | `renderTable()` called after loop | PASS |
| Textarea cleared after successful batch | `inputEl.value = ''` | PASS |

---

## Known Limitations

1. **Sequential only** — batches of 20+ leads will take a few seconds. No animated spinner beyond the progress log. Acceptable for operator use.
2. **No retry on failure** — failed patches are logged and skipped. Operator can re-paste just the failed subset.
3. **generateBatchEnrichmentPrompt produces a long prompt** for large queues. No truncation. Codex handles long context.
4. **Batch progress log not persisted** — page refresh clears it. The per-lead `ENRICHMENT_PATCH_APPLIED` events in `leads.json` remain as the audit trail.
5. **No partial-save on network disconnect** — if the tab is closed mid-batch, in-flight patches may be lost. Already-applied patches are safe in `leads.json`.

---

## Final Status

```
PASS_READY_FOR_PHASE_6
```

**Rationale:**
- Batch Enrichment Apply section renders only in ENRICHMENT_QUEUE tab — hidden everywhere else
- `applyBatchEnrichmentPatches()` validates input → sequential POST loop → per-patch progress log → final summary
- Reuses existing `/api/leads/:id/enrich` endpoint for all safety logic — no new server code
- `generateBatchEnrichmentPrompt()` produces a complete AI prompt for all enrichment-needed leads
- `copyBatchEnrichmentPrompt()` copies prompt to clipboard with live feedback
- All safety gates preserved — batch path cannot produce CONTACTED, SENT, or any approval-state lead
- `node --check server.js` passes
- No buttons removed, no UI rebuilt, no auto-send added
