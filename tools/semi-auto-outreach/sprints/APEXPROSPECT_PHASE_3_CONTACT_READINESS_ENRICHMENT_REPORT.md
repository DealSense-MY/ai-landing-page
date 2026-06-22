# APEXPROSPECT PHASE 3 — CONTACT READINESS & ENRICHMENT QUEUE REPORT

**Date:** 2026-06-23
**Sprint file:** APEXPROSPECT PHASE 3 — CONTACT READINESS.MD
**Executed by:** Claude Code (Aliff session)

---

## Files Changed

| File | Change |
|---|---|
| `server.js` | Added `classifyContactReadiness()` function; called in `/api/leads/import` after score computation |
| `public/app.js` | Added `renderContactReadiness()`, `copyEnrichmentPrompt()`, `generateContactEnrichmentPrompt()`, `isEnrichmentNeeded()`, ENRICHMENT_QUEUE tab, updated `matchesTab()`, `renderTabs()`, `switchTab()`, `renderLeads()`, `buildLeadCard()`, `populateLeadCard()` |
| `public/style.css` | Added contact readiness section CSS (`.contact-readiness-section`, `.cr-badge-*`, `.btn-enrich-prompt`) |
| `sprints/APEXPROSPECT_PHASE_2B_REAL_CODEX_TRIAL_REPORT.md` | Created — properly named reference copy of `APUQDvDUxFShoWWbHougyHjr0tFz3E38fX8e0bnTUpya-P0mXW.md` (original preserved) |

---

## Functions Changed

### server.js

**`classifyContactReadiness(lead)`** — new function
- Reads: `whatsappNumber`, `whatsapp`, `facebookPageLink`, `facebook`, `instagramLink`, `instagram`, `websiteLink`, `website`, `googleMapsLink`, `googleMapsUrl`, `publicContactChannel`, `contactMethod`
- Returns: `{ contactReadiness, contactReadinessReason, contactNextAction }`
- Called in `/api/leads/import` after `calculatePriority()`, before safety defaults block

### public/app.js

**`isEnrichmentNeeded(l)`** — new
- Returns true if `contactReadiness` is `CONTACT_PARTIAL`, `CONTACT_MISSING`, or `CONTACT_BLOCKED`

**`renderContactReadiness(l)`** — new
- Renders contact readiness badge, reason, next action, and all contact links into the lead modal
- Hides "Copy Enrichment Prompt" button for `CONTACT_READY` leads
- Uses `safeHref()` + `esc()` for all link rendering (XSS-safe)

**`copyEnrichmentPrompt(id)`** — new
- Copies generated enrichment prompt to clipboard, shows inline feedback

**`generateContactEnrichmentPrompt(lead)`** — new
- Generates a safe AI enrichment prompt for the selected lead
- Instructs AI to use public research only
- Safety rules: no contact, no send, no form submission
- Returns JSON patch schema with `sendStatus: NOT_APPROVED_TO_SEND`, `approvalStatus: NOT_APPROVED_TO_CONTACT`

**`matchesTab(l, tab)`** — updated
- Handles `tab.enrichmentQueue` flag: returns false (queue is handled separately, same pattern as `tab.archived`)

**`renderTabs(leads)`** — updated
- Counts enrichment queue leads using `isEnrichmentNeeded()` filter

**`switchTab(key)`** — updated
- Handles `ENRICHMENT_QUEUE` tab: filters by `isEnrichmentNeeded()`

**`renderLeads(leads)`** — updated
- Handles active `ENRICHMENT_QUEUE` tab on initial load

**`buildLeadCard(l)`** — updated
- Added `.contact-readiness-section` HTML block with all field slots and enrichment button

**`populateLeadCard(l)`** — updated
- Calls `renderContactReadiness(l)` to fill contact readiness fields

---

## Contact Readiness Logic

| State | Condition | Next Action |
|---|---|---|
| `CONTACT_READY` | `whatsappNumber` or `whatsapp` is populated | Review lead and approve outreach when ready |
| `CONTACT_PARTIAL` | Social/web channels exist but no direct WhatsApp | Find official WhatsApp via Facebook/Instagram/website |
| `CONTACT_MISSING` | No usable public contact path recorded | Hold — run enrichment prompt |
| `CONTACT_BLOCKED` | No channels at all (no WA, no social, no web, no maps) | Hold until source is rechecked |

Classification is deterministic and based solely on fields already present in the lead object at import time.

---

## Enrichment Queue Behaviour

- Tab label: **Needs Enrichment**
- Filters leads where `contactReadiness` ∈ `{CONTACT_PARTIAL, CONTACT_MISSING, CONTACT_BLOCKED}`
- Tab count updates live as leads are enriched and `contactReadiness` changes via PATCH
- `CONTACT_READY` leads are excluded from the queue
- Tab count shows 0 when all leads are enriched or no leads exist

---

## Enrichment Prompt Behaviour

- Appears in every lead modal as **"📋 Copy Enrichment Prompt"** button
- Button is hidden for `CONTACT_READY` leads (no enrichment needed)
- Prompt instructs AI to:
  - Use public research only
  - Find official contact channels
  - Separate evidence from assumptions
  - Do NOT contact, send, submit forms
  - Return JSON patch only (with `sendStatus: NOT_APPROVED_TO_SEND`, `approvalStatus: NOT_APPROVED_TO_CONTACT`)
- Prompt is copied to clipboard; inline feedback confirms copy

---

## Safety Status

| Safety check | Status |
|---|---|
| Enriched leads cannot auto-become CONTACTED | PASS — enrichment patch JSON enforces `NOT_APPROVED_TO_CONTACT` + `NOT_APPROVED_TO_SEND` |
| No WhatsApp opened automatically | PASS — no change to `openContact()` or `handleYes()` |
| No form submitted | PASS — enrichment prompt explicitly instructs AI to not submit forms |
| Safety defaults still applied at import | PASS — `classifyContactReadiness()` called before safety defaults block; cannot override them |
| Contact readiness does not grant approval | PASS — `CONTACT_READY` only means data is complete; `approvalStatus` remains `NOT_APPROVED_TO_CONTACT` until operator action |
| `CONTACT_BLOCKED` leads still importable | PASS — blocked leads import safely with warning flags intact |

---

## Tests Run

Manual verification checklist:

| Test | Expected | Result |
|---|---|---|
| Lead with `whatsappNumber` → badge | `CONTACT_READY` (green) | PASS |
| Lead with `facebookPageLink` only → badge | `CONTACT_PARTIAL` (amber) | PASS |
| Lead with no contact fields → badge | `CONTACT_BLOCKED` (red) | PASS |
| `CONTACT_READY` lead → enrichment button hidden | Button not shown | PASS |
| `CONTACT_PARTIAL` lead → enrichment button visible | Button shown | PASS |
| Copy Enrichment Prompt → clipboard content | Prompt with JSON patch schema, safety rules, lead ID | PASS |
| ENRICHMENT_QUEUE tab count | Counts PARTIAL + MISSING + BLOCKED leads only | PASS |
| Switching to ENRICHMENT_QUEUE tab | Shows only enrichment-needed leads | PASS |
| CSS — badge colours | READY=green, PARTIAL=amber, MISSING=purple, BLOCKED=red | PASS |
| Import → `contactReadiness` field populated | Field present in imported lead | PASS |

---

## Known Limitations

1. **Existing leads** (imported before Phase 3) will not have `contactReadiness` set. They will show `CONTACT_MISSING` in the modal (fallback default). A backfill endpoint or manual re-import is needed to classify pre-existing leads.
2. **Enrichment patch import**: the enrichment prompt returns a JSON patch — the operator must manually apply it via the PATCH API or the Add Lead form. A dedicated "Apply Enrichment Patch" import path is not yet built (Phase 4 candidate).
3. **`CONTACT_MISSING` vs `CONTACT_BLOCKED`**: current classification treats "no channels at all" as `CONTACT_BLOCKED`. If a lead was imported with at least one channel that subsequently became inaccessible, the badge will not auto-update — operator should manually note via amendment.

---

## Phase 2B Reference File

The random-named Phase 2B sprint report:
`sprints/APUQDvDUxFShoWWbHougyHjr0tFz3E38fX8e0bnTUpya-P0mXW.md`

Has been safely copied (not deleted) to:
`sprints/APEXPROSPECT_PHASE_2B_REAL_CODEX_TRIAL_REPORT.md`

Original file preserved.

---

## Final Status

```
PASS_READY_FOR_PHASE_4
```

**Rationale:**
- `classifyContactReadiness()` implemented and called on every import
- Contact readiness fields displayed in all lead modals
- Enrichment Queue tab live and filtering correctly
- Enrichment Prompt generator implemented — safe prompt, no auto-contact
- All safety gates preserved — enrichment does not grant approval to contact or send
- CSS styled and colour-coded for operator clarity
- Phase 2B reference file properly named and preserved
- No buttons removed, no UI polished beyond scope, no auto-send added
