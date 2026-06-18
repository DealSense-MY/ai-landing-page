# APEX_SAFETY_SCAN_CHECKLIST.md

ApexProspect — Full Safety Scan (Post PATCH 5C)

Run: `claude "Read sprints/MEMORY.md then execute sprints/APEX_SAFETY_SCAN_CHECKLIST.md"`

State: PATCH 5C complete. Server stable at localhost:3777. 990 lines.

---

## PURPOSE

Systematic safety scan of all attack surfaces in ApexProspect BEFORE writing PATCH 6.
Covers: XSS, injection, path traversal, data integrity, lock bypasses, schema gaps.

Findings are graded: ✅ SAFE | ⚠ LOW | 🟡 MEDIUM | 🔴 HIGH

---

## SCAN AREA 1 — Frontend Output Safety (app.js)

### 1.1 HTML escape function

- `esc()` at line 253 — encodes all 5 HTML-special chars (`&`, `<`, `>`, `"`, `'`) ✅ SAFE
- PATCH 5C confirmed this is correct.

### 1.2 URL safety function

- `safeHref()` at line 262 — whitelist `http:`/`https:`, allows `/path`, rejects `javascript:` ✅ SAFE
- Applied to preview link href at line 465.

### 1.3 CSS class safety

- `safeClass()` at line 271 — strips non-alphanumeric to `[A-Z0-9_-]` ✅ SAFE

### 1.4 innerHTML injection points

All `innerHTML` writes that include data values:

| Line | Data source | esc() applied? | Verdict |
|------|-------------|----------------|---------|
| 115 | PIPELINE_TABS (static const) | n/a static | ✅ SAFE |
| 142 | leads array (buildRow) | check buildRow | see 1.5 |
| 178 | buildLeadCard(lead) | see 1.5 | see 1.5 |
| 465 | resolvedPreviewUrl | esc(safeHref()) | ✅ SAFE |
| 469 | l.id | esc() | ✅ SAFE |
| 494 | l.previewClickCount | esc() | needs verify |
| 699 | e.metadata entries | esc(k) + esc(v) | ✅ SAFE |
| 702 | event metadata key/val | esc() both | ✅ SAFE |
| 732 | amendments list | needs verify | needs verify |
| 1056–1068 | payment section fields | needs verify | needs verify |
| 1266–1315 | import summary + top10 | esc() on names | ✅ SAFE |
| 1605 | smart panel actions | needs verify | needs verify |
| 1669 | unknown context | needs verify | needs verify |
| 1872 | payment actions | esc(l.id) in onclick | ✅ SAFE |

### 1.5 buildLeadCard — primary injection surface

`buildLeadCard` at line 291 renders all lead fields into HTML.
This is the highest-risk function — every field from `leads.json` passes through it.

---

## SCAN AREA 2 — Server-Side Input Handling (server.js)

### 2.1 Explicit field assignment

All routes use explicit field extraction — no `Object.assign(lead, req.body)` found. ✅ SAFE

### 2.2 Numeric coercion

- Line 916-917: `paidAmount = Number(req.body.paidAmount) || 0` — coerced ✅ SAFE
- Line 841: audit score fields: `Math.min(100, Math.max(0, Number(...) || 0))` — clamped ✅ SAFE

### 2.3 Array validation

- Line 846: audit array fields: `Array.isArray(req.body[f]) ? req.body[f] : []` ✅ SAFE
  - ⚠ LOW: array items are not sanitized — a crafted import could place `"<script>"` strings
    in `weakness[]`, `opportunity[]`, `missingFields[]`. These render via esc() in UI so XSS
    is blocked, but the raw data is dirty.

### 2.4 Path traversal

- All file paths use `path.join(__dirname, 'data', ...)` — anchored, no user input in path ✅ SAFE
- DEMOS_BASE is `path.join(__dirname, '../../DEMOS')` — static, not user-controlled ✅ SAFE
- No user-supplied filenames used in any `fs.*` call ✅ SAFE

### 2.5 Lock guard coverage

- `PATCH /api/leads/:id/audit` — lock guard present (added in PATCH 5B verify) ✅ SAFE
- Other write routes: need verification

### 2.6 No shell execution

- No `exec`, `spawn`, `child_process` found ✅ SAFE

---

## SCAN AREA 3 — Lock Guard Coverage

Every route that writes to a lead must check `if (lead.locked) return 403`.

Routes to verify:

| Route | Lock guard? |
|-------|-------------|
| `PATCH /api/leads/:id` (status update) | verify |
| `POST /api/leads/:id/events` | n/a (events allowed on locked) |
| `PATCH /api/leads/:id/lock` | n/a (this IS the lock route) |
| `PATCH /api/leads/:id/unlock` | n/a |
| `POST /api/leads/:id/payment` | verify |
| `PATCH /api/leads/:id/audit` | ✅ confirmed |
| `POST /api/leads/batch-import` | n/a (creates new records) |

---

## SCAN AREA 4 — Data Integrity

### 4.1 ID uniqueness

- Import deduplication uses 4-key system ✅ SAFE
- New leads: `slug(name) + '-' + Date.now()` — time-based, not UUID
  - ⚠ LOW: two rapid imports of same-named business could get same id (same ms)
  - Acceptable for single-user localhost tool

### 4.2 JSON persistence

- `safeWriteJSON` uses synchronous `writeFileSync` ✅ no partial write
- `queueWrite` serializes concurrent writes ✅ no race condition

### 4.3 Run log

- Every state change writes to run-log.json ✅ event trail intact

---

## SCAN AREA 5 — Export Safety

- CSV export at line 970-983: uses server-side `esc` (CSV double-quote escape) ✅ SAFE
- No HTML injection into CSV possible

---

## EXECUTION CHECKLIST

When Claude executes this sprint, perform these live reads:

- [ ] Read app.js lines 291-500 — audit buildLeadCard for unescaped fields
- [ ] Read app.js lines 730-740 — audit amendments render
- [ ] Read app.js lines 1050-1080 — audit payment section render
- [ ] Read app.js lines 1600-1620 — audit smart panel render
- [ ] Read app.js lines 1665-1685 — audit line 1669 context
- [ ] Read server.js lines 315-365 — verify lock guard on PATCH /api/leads/:id
- [ ] Read server.js lines 905-940 — verify lock guard on POST payment route
- [ ] Deliver FINAL VERDICT in report format below

---

## REPORT FORMAT

### XSS Surface Summary
### Lock Guard Summary
### Data Integrity Summary
### Findings List (graded)
### Recommended PATCH 6 Targets (from findings only)
### VERDICT: CLEAN / ISSUES FOUND

STOP AFTER REPORT.
