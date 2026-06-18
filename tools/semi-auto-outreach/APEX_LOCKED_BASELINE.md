# APEX_LOCKED_BASELINE.md
Generated: 2026-06-18 | Status: PARTIAL — updated after Phase 7

---

## LOCKED — DO NOT RE-EDIT WITHOUT REGRESSION PROOF

### 1. Server-side lock guard — PATCH /api/leads/:id
- **File**: server.js:325
- **Why locked**: Prevents editing locked records (CLOSED_WON/LOST). Tested: curl returns 403.
- **Test evidence**: `curl -X PATCH .../zira-beauty-spa-ipoh` → `{"error":"Lead is locked (CLOSED_WON) — cannot edit"}`
- **Do not change**: The `if (leads[idx].locked) return res.status(403)` guard must remain as first check after findIndex

### 2. Server-side lock guard — POST /api/leads/:id/mark-paid
- **File**: server.js:913
- **Why locked**: Prevents payment modification on locked records. HTTP 403 (not 409).
- **Test evidence**: `curl -X POST .../zira-beauty-spa-ipoh/mark-paid` → `{"error":"Lead is locked (CLOSED_WON) — cannot modify payment fields"}`
- **Do not change**: `if (lead.locked) return res.status(403)` — unified check, no partial lockReason logic

### 3. Server-side lock guard — PATCH /api/leads/:id/audit
- **File**: server.js:829
- **Why locked**: Audit scores blocked for locked records.
- **Test evidence**: Code inspection — `if (lead.locked) return res.status(403)`
- **Do not change**: Guard present before numericFields/arrayFields loop

### 4. Write queue serialization
- **File**: server.js:19-32 (`writeQueue`, `queueWrite`)
- **Why locked**: Prevents concurrent write race conditions on leads.json.
- **Test evidence**: All mutation routes (PATCH, POST import, POST events, POST lock, POST amendments, POST mark-paid) use queueWrite.
- **Do not change**: All write handlers must stay inside `queueWrite(() => {...})`

### 5. XSS escaping — esc() function
- **File**: app.js:253-260
- **Why locked**: Sanitizes all user data before DOM insertion. Covers &, <, >, ", '.
- **Test evidence**: Code inspection — all innerHTML in buildLeadCard, renderTable, renderSmartPanel use esc()
- **Do not change**: Never bypass esc() when inserting lead data into HTML

### 6. safeHref() URL sanitization
- **File**: app.js:262-269
- **Why locked**: Prevents javascript: protocol injection in preview/profile links.
- **Test evidence**: Only http/https and /relative paths allowed
- **Do not change**: All href/src built from user data must use safeHref()

### 7. WhatsApp manual open flow
- **File**: app.js:778-802 (`openContact`)
- **Why locked**: Opens wa.me with prefilled message — never sends automatically.
- **Test evidence**: Code inspection — window.open(wa.me) only, no Baileys, no auto-send
- **Do not change**: No silent send. Human presses Send in WhatsApp.

### 8. isLocked() multi-field check
- **File**: app.js:804-813
- **Why locked**: Checks locked flag AND all status fields for CLOSED_WON/LOST across all field variants.
- **Test evidence**: Code inspection — checks lead.locked, prospectStatus, status, dealStatus, pipelineStatus, lockReason
- **Do not change**: Must check all 5 fields to catch legacy records

### 9. Amendment route — no lock restriction
- **File**: server.js:770 (POST /api/leads/:id/amendments)
- **Why locked**: Amendments must remain usable even for locked records (corrections after lock).
- **Test evidence**: No locked check in this route — by design
- **Do not change**: Do not add a locked guard to this route

### 10. Local JSON storage — no cloud, no DB
- **File**: server.js:9-11 (LEADS_FILE, LOG_FILE, RUN_LOG_FILE)
- **Why locked**: App must run offline with no API key. All data in local JSON files.
- **Test evidence**: Zero external API calls in server.js or app.js
- **Do not change**: No cloud DB, no auth, no API keys

### 11. Export routes
- **File**: server.js:957 (JSON), server.js:969 (CSV), app.js:1156 (Logs)
- **Why locked**: All three exports confirmed working.
- **Test evidence**: Routes present and functional
- **Do not change**: Do not modify export field lists without testing

### 12. Safety banner
- **File**: index.html:11-13
- **Why locked**: Operator safety reminder — visible, sticky, English.
- **Test evidence**: Present at top of page, z-index:100
- **Do not change**: Must remain visible and English-only

### 13. Header identity (ApexProspect + BY AUKIY + AUKIY LOCAL MODE)
- **File**: index.html:15-26
- **Why locked**: Brand identity confirmed present.
- **Test evidence**: Markup present with fallback AP if image missing
- **Do not change**: Logo fallback (AP text) is correct behavior when image missing

### 14. CLOSED_WON green styling (modal)
- **File**: style.css:1328, 1333
- **Why locked**: Green lock banner and card border for won deals confirmed present.
- **Test evidence**: .status-CLOSED_WON, .closed-won-lock, .lock-banner.closed-won-lock
- **Do not change**: Green color #9FE0BE / #4ADE80 for won deals

---

## UNLOCKED — NEEDS REPAIR (repaired in this session)

| Area | File | Status |
|------|------|--------|
| Start Here panel | index.html | REPAIRED — added |
| Manual Workflow panel | index.html | REPAIRED — added |
| Malay text in app.js | app.js | REPAIRED — all English |
| CLOSED_LOST table pill | style.css | REPAIRED — now red |
| Preview section heading | app.js | REPAIRED — "Landing Page Preview" |

---

## LOCKED AFTER REPAIR (Phase 7 additions)

### 15. English-only UI
- **File**: app.js (all helper/hint/reason strings)
- **Why locked**: All Malay text replaced with English in this session.
- **Do not change**: No Malay text in any visible UI string

### 16. CLOSED_LOST red pill (table)
- **File**: style.css (pill-CLOSED_LOST)
- **Why locked**: Now red (#FCA5A5) matching modal style
- **Do not change**: CLOSED_LOST must be red in both table and modal

### 17. Start Here panel
- **File**: index.html
- **Why locked**: Added operator quick-start panel with 4 action buttons
- **Do not change**: Position above pipeline tabs, below header

### 18. Manual Workflow panel
- **File**: index.html
- **Why locked**: 10-step workflow with safety note
- **Do not change**: Collapsible, English-only, no automation implied
