# APEX_FINAL_REGRESSION_CHECKLIST.md
Generated: 2026-06-18 | Status: ALL PASS

This checklist must be run before any future patch to verify nothing regressed.

---

## SECTION 1 — Dashboard

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | localhost:3777 opens | 200 OK, page loads | ✅ PASS |
| 2 | Header visible (ApexProspect, BY AUKIY, AUKIY LOCAL MODE) | All 3 present | ✅ PASS |
| 3 | Logo visible or fallback AP | Image or AP text | ✅ PASS (fallback AP) |
| 4 | Safety banner visible | Sticky top banner, English | ✅ PASS |
| 5 | Start Here panel visible | Panel with 4 action buttons | ✅ PASS (added) |
| 6 | Manual Workflow panel opens/closes | 10-step list, closes on ✕ | ✅ PASS (added) |
| 7 | Tabs render with counts | 9 tabs, counts correct | ✅ PASS |
| 8 | Metrics row (Daily Tracker) aligned | All stats visible | ✅ PASS |
| 9 | Next Actions panel visible, hide/show works | Panel collapses | ✅ PASS |

## SECTION 2 — Table

| # | Test | Expected | Result |
|---|------|----------|--------|
| 10 | Click ALL tab | Shows all leads | ✅ PASS |
| 11 | Click NEW tab | Shows only NEW status leads | ✅ PASS |
| 12 | Click CLOSED WON tab | Shows CLOSED_WON leads | ✅ PASS |
| 13 | Click CLOSED LOST tab | Shows CLOSED_LOST leads | ✅ PASS |
| 14 | Row click opens modal | Modal appears with lead data | ✅ PASS |
| 15 | CLOSED_LOST pill is red | #FCA5A5 red color | ✅ PASS (fixed) |
| 16 | CLOSED_WON pill is green | #4ADE80 green color | ✅ PASS |

## SECTION 3 — Prospect Modal

| # | Test | Expected | Result |
|---|------|----------|--------|
| 17 | Business name visible at top | Pipeline header shows name | ✅ PASS |
| 18 | WhatsApp visible in meta | Meta section shows number | ✅ PASS |
| 19 | Status/deal/lock badges visible | Pipeline header badges | ✅ PASS |
| 20 | Current Step / Next Action shown | Pipeline next-action line | ✅ PASS |
| 21 | Landing Page Preview section has heading | "LANDING PAGE PREVIEW" label | ✅ PASS (fixed) |
| 22 | DM Draft section — English helper text | English only | ✅ PASS (fixed) |
| 23 | Locked record shows LOCKED banner | Lock banner with reason | ✅ PASS |
| 24 | Locked record: action buttons disabled | btn-locked class applied | ✅ PASS |
| 25 | Locked record: Amendment available | Textarea + Add Amendment btn | ✅ PASS |

## SECTION 4 — Add Lead

| # | Test | Expected | Result |
|---|------|----------|--------|
| 26 | Open Add Lead form | Form panel appears | ✅ PASS |
| 27 | Save "UI Final Test Spa" | ok: true, id assigned | ✅ PASS (curl confirmed) |
| 28 | Lead appears in leads list | found: true, status: NEW | ✅ PASS (curl confirmed) |

## SECTION 5 — Import JSON

| # | Test | Expected | Result |
|---|------|----------|--------|
| 29 | Import test clinic JSON | imported: 1, skipped: 0 | ✅ PASS (curl confirmed) |
| 30 | Re-import same clinic (dedup) | imported: 0, skipped: 1 | ✅ PASS (curl confirmed) |

## SECTION 6 — Export

| # | Test | Expected | Result |
|---|------|----------|--------|
| 31 | CSV export | Headers + rows, valid CSV | ✅ PASS (curl confirmed) |
| 32 | JSON export | Array with events/amendments | ✅ PASS (8 records, has events) |
| 33 | Logs export | JSON array of events | ✅ PASS (34 log entries) |

## SECTION 7 — Lock Guard

| # | Test | Expected | Result |
|---|------|----------|--------|
| 34 | PATCH on locked lead | 403 "Lead is locked (CLOSED_WON)" | ✅ PASS |
| 35 | Mark-paid on locked lead | 403 "cannot modify payment fields" | ✅ PASS |
| 36 | Audit PATCH on locked lead | 403 "Lead is locked and cannot be edited" | ✅ PASS |
| 37 | Event POST on locked lead | ok: true (events always allowed) | ✅ PASS |
| 38 | Amendment POST on locked lead | ok: true (amendments always allowed) | ✅ PASS |
| 39 | Audit PATCH on unlocked lead | success: true, auditScore computed | ✅ PASS |

## SECTION 8 — WhatsApp Safety

| # | Test | Expected | Result |
|---|------|----------|--------|
| 40 | Approve & Open WhatsApp | Opens wa.me URL only, no auto-send | ✅ PASS (code review) |
| 41 | Confirm Sent is separate step | Separate button, separate event | ✅ PASS (code review) |
| 42 | Empty DM draft shows warning | English warning text | ✅ PASS (fixed) |

---

## HOW TO RUN THESE TESTS

```bash
# Lock guard tests
curl -s -X PATCH http://localhost:3777/api/leads/<locked-id> -H "Content-Type: application/json" -d '{"status":"NEW"}'
# Expect: {"error":"Lead is locked (CLOSED_WON) — cannot edit"}

curl -s -X POST http://localhost:3777/api/leads/<locked-id>/mark-paid -H "Content-Type: application/json" -d '{"paidAmount":350}'
# Expect: {"error":"Lead is locked (CLOSED_WON) — cannot modify payment fields"}

# Add Lead test
curl -s -X POST http://localhost:3777/api/leads -H "Content-Type: application/json" \
  -d '{"businessName":"Test Spa","location":"Ipoh","niche":"Beauty","whatsappNumber":"60123456789"}'
# Expect: {"ok":true,"lead":{...}}

# Import test
curl -s -X POST http://localhost:3777/api/leads/import -H "Content-Type: application/json" \
  -d '{"leads":[{"businessName":"Test Clinic","location":"Ipoh","niche":"Clinic","whatsappNumber":"601234"}]}'
# Expect: {"ok":true,"imported":1,"skipped":0,...}
```

---

## SECTIONS LOCKED — DO NOT RE-EDIT

- server.js: lock guards (PATCH, mark-paid, audit), queueWrite, export routes
- app.js: esc(), safeHref(), safeClass(), isLocked(), openContact(), handleYes/handleOk
- style.css: .status-CLOSED_WON, .closed-won-lock, .lock-banner variants
- index.html: safety-banner, header, start-here-panel, workflow-panel structure
