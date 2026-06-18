# APEX_REPAIR_AUDIT.md
Generated: 2026-06-18 | Auditor: Claude Code (APEX Master Review)

---

## 1. STABLE AREAS (Do Not Re-Edit)

| Area | File | Evidence |
|------|------|----------|
| Server-side lock guard — PATCH /api/leads/:id | server.js:325 | curl test returned 403 CLOSED_WON |
| Server-side lock guard — POST mark-paid | server.js:913 | curl test returned 403 CLOSED_WON |
| Server-side lock guard — PATCH /audit | server.js:829 | locked check before field writes |
| Write queue serialization (queueWrite) | server.js:29 | All mutation routes use queueWrite |
| XSS escaping (esc() function) | app.js:253 | All innerHTML uses esc() |
| safeHref() URL sanitization | app.js:262 | Protocol-check + relative path guard |
| safeClass() ID sanitization | app.js:271 | Used on all data-id attributes |
| WhatsApp manual open flow (openContact) | app.js:778 | Opens wa.me — no auto-send |
| Confirm Sent separation from Approve | app.js:829 | Separate button, separate event |
| isLocked() multi-field check | app.js:804 | Checks locked, prospectStatus, dealStatus, pipelineStatus, lockReason |
| Amendment route (unlocked for locked records) | server.js:770 | No locked check on amendments |
| Local JSON storage (no cloud, no DB) | server.js:9-11 | leads.json, outreach-log.json, run-log.json |
| No API key required at runtime | server.js, app.js | Zero external API calls |
| Export CSV | server.js:969 | Working GET /api/export/csv |
| Export JSON | server.js:957 | Working GET /api/export/json |
| Export Logs | app.js:1156 | Fetches /api/logs, downloads as file |
| Pipeline tabs (ALL/NEW/NEEDS REVIEW/etc.) | app.js:18 | 9 tabs defined, counts correct |
| Prospect table row click → modal | app.js:166 | selectProspect → openCardModal |
| Payment section render | app.js:1863 | renderPaymentSection() |
| Run Log Timeline | app.js:688 | renderRunLog(), toggleRunLog() |
| CLOSED_WON green pill (modal) | style.css:1328 | .status-CLOSED_WON green #9FE0BE |
| Lock banner CSS (modal) | style.css:743 | .lock-banner, .closed-won-lock, .closed-lost-lock |
| Safety banner (header) | index.html:11 | Visible, English, sticky |
| Header: ApexProspect + BY AUKIY + AUKIY LOCAL MODE | index.html:15-26 | Present and correct |
| Add Lead form (tab 1) | index.html:46, app.js:1392 | Working, English labels |
| Import JSON (tab 2 with dropzone) | index.html:91, app.js:1232 | Working, drag+drop + paste |

---

## 2. BROKEN / MISSING AREAS

| Area | File | Issue |
|------|------|-------|
| Start Here panel | index.html | MISSING — not implemented at all |
| Manual Workflow panel | index.html | MISSING — not implemented |
| Malay text: DM helper | app.js:336 | "Ini ialah mesej WhatsApp..." — Malay |
| Malay text: DM approve helper | app.js:345 | "WhatsApp akan dibuka..." — Malay |
| Malay text: DM remake helper | app.js:349 | "Rewrite DM = buat semula..." — Malay |
| Malay text: DM replied helper | app.js:351 | "Gunakan ini hanya bila..." — Malay |
| Malay text: DM followup helper | app.js:353 | "Follow-Up Draft digunakan selepas..." — Malay |
| Malay text: DM empty hint | app.js:572 | "DM draft belum tersedia. Gunakan REWRITE DM..." — Malay |
| Malay text: DM status hint (empty) | app.js:591 | "DM draft kosong. Klik EDIT..." — Malay |
| Malay text: DM placeholder | app.js:573 | "DM draft belum tersedia..." — Malay |
| Malay text: Smart panel reason P2 | app.js:1558 | "DM draft rejected — needs rewrite" (OK) |
| Malay text: Smart panel P5 reason | app.js:1584 | "Lead baru belum diReview" — Malay |
| Malay text: Smart panel P5 action | app.js:1585 | "Review lead baru" — partially Malay |
| Malay text: Smart panel P3 reason | app.js:1575 | "Preview belum dibuat" — Malay |
| Malay text: Smart panel P3 action | app.js:1576 | "Generate preview" (OK) |
| Malay text: Smart panel P2 action | app.js:1562 | "Hantar follow up" — Malay |
| Malay text: Smart panel P4 action | app.js:1580 | "Approve dan hantar sekarang" — Malay |
| Malay text: smart-panel-empty | app.js:1603 | "✓ Semua prospects up to date." — Malay |
| Malay text: Follow-up draft message | app.js:917 | "Hi, just following up..." (OK actually English) |
| CLOSED_LOST table pill color | style.css:685 | Grey (var(--text-soft)) — should be red #FCA5A5 |
| Preview section title | app.js:326 | Shows "Preview:" label only — no "Landing Page Preview" heading |
| STALE badge text | app.js:153 | "Tiada action dalam 5 hari" — Malay tooltip |
| DM flow hint | app.js:338 | "Flow: Review → Edit..." (OK — English already) |

---

## 3. RISK AREAS (Monitor but Do Not Change Unless Broken)

| Area | Risk |
|------|------|
| Agent Schedule panel | UI works but schedules nothing real — cosmetic only. Don't remove. |
| Operation ON/OFF toggle | Stored in localStorage — cleared on browser reset. Low risk. |
| Working Hours modal | Triggers after 9PM. Not critical for daytime use. |
| STALE badge | Shows after 5 days inactivity. Works correctly. |
| previewBuilder module | Not read in this session — only invoked via generate-preview route |

---

## 4. FILES INVOLVED

- `public/index.html` — Add Start Here panel, Manual Workflow panel
- `public/app.js` — Replace all Malay text with English
- `public/style.css` — Fix CLOSED_LOST table pill color
- `server.js` — NO changes needed (lock guards confirmed working)

---

## 5. RECOMMENDED REPAIR PHASES

1. **app.js** — English text pass (all Malay strings)
2. **style.css** — CLOSED_LOST pill red
3. **index.html** — Start Here panel + Manual Workflow panel
4. **Verification** — curl tests + visual check

---

## 6. SECTIONS THAT MUST NOT BE RE-EDITED

- server.js lock guards (PATCH, mark-paid, audit)
- app.js: esc(), safeHref(), safeClass(), isLocked(), openContact(), handleYes/handleOk flow
- style.css: .status-CLOSED_WON, .lock-banner, .closed-won-lock, .closed-lost-lock
- All export routes (CSV, JSON, Logs)
- Import JSON pipeline (submitImport, dedup logic)
