# APEXPROSPECT PHASE 6 — APPROVAL PACKET + SEND BATCH REVIEW REPORT

**Date:** 2026-06-23
**Sprint file:** APEXPROSPECT PHASE 6 — APPROVAL PACKET.md
**Executed by:** Claude Code (Aliff session)

---

## Files Changed

| File | Change |
|---|---|
| `server.js` | Added `POST /api/leads/:id/approve` endpoint |
| `public/app.js` | Added `SEND_BATCH_REVIEW` tab; `isReadyToApprove()`; `setApprovalSectionVisible()`; updated `switchTab()` + `renderLeads()`; added `generateApprovalPacket()`, `renderApprovalSection()`, `setApprovalDecision()`, `batchApprove()` |
| `public/index.html` | Added `#approval-review-section` div with batch controls, summary, and packet list |
| `public/style.css` | Added Phase 6 CSS: approval section, packet cards, decision buttons, summary chips |

---

## Functions Changed

### server.js

**`POST /api/leads/:id/approve`** — new route
- Accepts `{ decision }` — one of: `APPROVE`, `EDIT_MESSAGE`, `HOLD`, `REJECT`, `NEEDS_MORE_ENRICHMENT`
- Returns 400 for invalid decision, 404 if not found, 403 if locked
- Decision state transitions:
  - `APPROVE` → `approvalStatus = APPROVED_TO_CONTACT`, `sendStatus = APPROVED_TO_SEND`, `sendPrepStatus = READY_TO_SEND_MANUAL`, `approvedAt`, `approvedBy = Aliff`
  - `EDIT_MESSAGE` → `approvalStatus = APPROVED_TO_CONTACT`, `sendStatus = NOT_APPROVED_TO_SEND`, `sendPrepStatus = EDIT_REQUIRED_BEFORE_SEND`
  - `HOLD` → both NOT_APPROVED, `sendPrepStatus = ON_HOLD`
  - `REJECT` → both NOT_APPROVED, `sendPrepStatus = REJECTED`, `prospectStatus = REJECTED_NEEDS_REWORK`
  - `NEEDS_MORE_ENRICHMENT` → both NOT_APPROVED, `sendPrepStatus = NEEDS_MORE_ENRICHMENT`
- Writes `APPROVAL_DECISION` event to `lead.events` and `run-log.json`
- Returns `{ ok: true, lead: updatedLead }`

### public/app.js

**`isReadyToApprove(l)`** — new filter function
- Returns true if: contactReadiness is CONTACT_READY or CONTACT_PARTIAL, sendStatus ≠ APPROVED_TO_SEND, approvalStatus ≠ APPROVED_TO_CONTACT, prospectStatus not CLOSED_WON/CLOSED_LOST, not archived

**`SEND_BATCH_REVIEW` tab** — added to `PIPELINE_TABS`
- `sendBatchReview: true` flag — custom filter like `enrichmentQueue`
- Tab count = `_allLeads.filter(isReadyToApprove).length`

**`setApprovalSectionVisible(visible)`** — new helper
- Shows/hides `#approval-review-section`

**`switchTab(key)`** — updated
- `SEND_BATCH_REVIEW` → `setApprovalSectionVisible(true)`, calls `renderApprovalSection()`, renders filtered leads

**`renderLeads(leads)`** — updated
- Same show/hide logic for initial load

**`generateApprovalPacket(lead)`** — new function
- Computes display-ready packet: businessName, niche, location, contactChannel, sourceEvidence, assumptions, weakness, opportunity, offerAngle, riskNote, draftMessage, recommendedChannel, contactReadiness, approvalStatus

**`renderApprovalSection()`** — new function
- Reads `_allLeads.filter(isReadyToApprove)`
- Renders one `.approval-packet-card` per lead with all packet fields + 5-option decision row
- Per-card feedback div `#apc-fb-${id}`

**`setApprovalDecision(id, decision)`** — new function
- Stores decision in `_approvalSelections[id]`
- Highlights selected button in the card's decision row

**`batchApprove(forceDecision)`** — new async function
- If `forceDecision` passed (toolbar buttons): applies that decision to ALL ready-to-approve leads
- If no forceDecision: applies only leads with a decision in `_approvalSelections`
- Sequential POST loop to `/api/leads/:id/approve`
- Updates `_allLeads` in place on success
- Shows per-card feedback
- After loop: refreshes tabs + table + cards
- Renders summary: approved / edit / held / rejected / needs enrichment / still awaiting / errors

---

## Approval Packet Behaviour

| Field | Source |
|---|---|
| businessName | `lead.businessName` |
| niche | `lead.niche` |
| location | `lead.lokasi` or `lead.location` |
| contactChannel | `lead.whatsappNumber` or `lead.publicContactChannel` |
| sourceEvidence | `lead.sourceEvidence` (array joined with `;`) |
| assumptions | `lead.assumptions` (array joined with `;`) |
| weakness | `lead.weakness` |
| opportunity | `lead.opportunity` |
| offerAngle | `lead.offerAngle` |
| riskNote | `lead.riskNote` |
| draftMessage | `lead.lastApprovedMessage` or `lead.generatedMessage` |
| recommendedChannel | `lead.recommendedChannel` or inferred from WhatsApp |

---

## Batch Review Behaviour

| Step | Behaviour |
|---|---|
| Tab switch to "Ready to Approve" | `#approval-review-section` shown; all CONTACT_READY/PARTIAL + not-approved leads rendered as packets |
| Per-card decision | Click APPROVE / EDIT_MESSAGE / HOLD / REJECT / NEEDS MORE ENRICHMENT → stored in `_approvalSelections` |
| Toolbar "Approve Selected" | Applies `APPROVE` to all leads with that decision selected |
| Toolbar "Hold / Reject / Needs More" | Force-applies that decision to ALL ready-to-approve leads |
| After batch | Tab counts update, table refreshes, summary shown |

---

## Safety Status

| Safety check | Status |
|---|---|
| No WhatsApp opens automatically | PASS — approval only sets state; no `openWhatsApp()` call |
| No message sent automatically | PASS — `sendPrepStatus = READY_TO_SEND_MANUAL` — operator must explicitly trigger send later |
| No auto-contact | PASS — approval sets `approvalStatus = APPROVED_TO_CONTACT` only; no contact function called |
| REJECT resets prospectStatus | PASS — `prospectStatus = REJECTED_NEEDS_REWORK` prevents stale APPROVED state |
| Locked leads protected | PASS — server returns 403 if `lead.locked === true` |
| Event audit trail | PASS — `APPROVAL_DECISION` event with before/after status written to `lead.events` + `run-log.json` |
| No fake CONTACTED / REPLIED / revenue states | PASS — no such fields touched |
| EDIT_MESSAGE path safe | PASS — `sendStatus = NOT_APPROVED_TO_SEND` even when `approvalStatus = APPROVED_TO_CONTACT` |

---

## No-Auto-Send Confirmation

- `POST /api/leads/:id/approve` with `decision = APPROVE` sets `sendPrepStatus = READY_TO_SEND_MANUAL`
- No WhatsApp URL is opened. No `window.open()` call. No form is submitted.
- The existing `openWhatsApp()` / manual send path is unchanged and still requires explicit operator action.
- An approved lead will appear in the existing `APPROVED` tab (prospectStatus-based) only after a separate operator action updates `prospectStatus` to `APPROVED_TO_SEND` — the approval endpoint does not do this.

---

## Tests Run

| Test | Expected | Result |
|---|---|---|
| `node --check server.js` | No syntax errors | PASS |
| Switch to "Ready to Approve" tab | `#approval-review-section` shown, batch/enrich section hidden | PASS |
| Switch to any other tab | `#approval-review-section` hidden | PASS |
| Tab count — CONTACT_READY + not approved | Count matches `isReadyToApprove` filter | PASS |
| Click APPROVE on card | Button highlighted, stored in `_approvalSelections` | PASS |
| Click HOLD on card | Button highlighted, stored | PASS |
| "Approve Selected" with no selections | Error: "No decisions selected..." | PASS |
| "Approve Selected" with APPROVE decision | POST → `approvalStatus = APPROVED_TO_CONTACT`, `sendPrepStatus = READY_TO_SEND_MANUAL` | PASS |
| "Hold Selected" toolbar button | Force HOLD on all ready-to-approve leads | PASS |
| REJECT decision | `prospectStatus = REJECTED_NEEDS_REWORK`, both NOT_APPROVED | PASS |
| NEEDS_MORE_ENRICHMENT decision | Both NOT_APPROVED, `sendPrepStatus = NEEDS_MORE_ENRICHMENT` | PASS |
| After batch — tab count updates | `renderTabs()` called; count decrements for approved leads | PASS |
| Summary after batch | Correct per-decision counts shown | PASS |
| Locked lead → approve | Server returns 403; FAIL logged in card feedback | PASS |
| No WhatsApp opened | No `openWhatsApp()` call anywhere in Phase 6 code | PASS |
| Event log | `APPROVAL_DECISION` event in `lead.events` and `run-log.json` | PASS |

---

## Known Limitations

1. **EDIT_MESSAGE path is state-only** — `sendStatus = NOT_APPROVED_TO_SEND` prevents send, but no UI to edit the draft message is added in Phase 6. Phase 7 candidate.
2. **`recommendedChannel` field** — inferred from whatsapp presence if not set. Operator should set it during enrichment for accuracy.
3. **Approval packet is read-only** — fields displayed but not editable inline. Editing is done via the existing lead modal.
4. **`_approvalSelections` cleared on page refresh** — selections not persisted. The approval state in `leads.json` is the source of truth.
5. **No per-lead APPROVE shortcut button** — only toolbar (force all) or per-card decision + "Approve Selected". Acceptable for Phase 6.

---

## Final Status

```
PASS_READY_FOR_PHASE_7
```

**Rationale:**
- `POST /api/leads/:id/approve` with 5 valid decisions implemented with event log, safety lock, no auto-send
- `SEND_BATCH_REVIEW` tab with `isReadyToApprove()` filter live
- `renderApprovalSection()` generates full approval packet per lead with decision buttons
- `batchApprove()` sequential POST loop with per-card feedback + aggregate summary
- All safety gates preserved — approval never triggers send, WhatsApp, or contact
- `node --check server.js` passes
- No buttons removed, no UI rebuilt, no auto-send added
