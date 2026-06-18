# BLUEPRINT_PHASE_GATE.md
# DealSense — Phase Gate & Acceptance Criteria
# Dibaca oleh: Claude Code CLI sebelum proceed setiap phase
# Dibuat oleh: Ith (Claude.ai)

---

## DOKTRIN

Setiap phase MESTI pass acceptance criteria sebelum proceed ke phase seterusnya.
Jika phase fail → STOP → report → tunggu Aliff.
Jangan proceed kalau ada broken behavior dari phase sebelum.

---

## PHASE 1 — Inspect & Stabilize

MVM target: App masih run, data lama selamat.

Acceptance:
- [ ] `npm start` → app run di localhost:3777
- [ ] Zira lead card masih nampak dalam dashboard
- [ ] Approve button masih buka WA
- [ ] DM draft masih boleh edit
- [ ] UI title tukar ke "DealSense Prospects Operator"
- [ ] Tiada data loss dalam leads.json

Rollback: Jika title rename break UI → revert title change, report.

---

## PHASE 2 — Pipeline Tabs + Prospect Table

MVM target: Operator boleh tengok workload by status.

Acceptance:
- [ ] Pipeline tabs render: ALL / NEW / PREVIEW_READY / APPROVED / CONTACTED / REPLIED / CLOSED
- [ ] Status counter update correctly
- [ ] Filter by status berfungsi
- [ ] Zira lead display dalam tab yang betul (ikut status)
- [ ] Approve button disable selepas status APPROVED atau CONTACTED

Rollback: Jika tabs break existing card layout → revert tabs, keep existing card view.

---

## PHASE 3 — Import 10 Prospect JSON

MVM target: Boleh import JSON dari Alt (ChatGPT agent) terus.

Acceptance:
- [ ] Import button visible dalam dashboard
- [ ] Boleh paste JSON array → click import
- [ ] Validation check: id, businessName, whatsapp WAJIB ada
- [ ] Auto-generate id jika missing (dari businessName + lokasi)
- [ ] Duplicate detection berfungsi → tunjuk warning
- [ ] leads.json update selepas import
- [ ] Prospect table refresh tanpa reload page
- [ ] Zira lead lama TIDAK terpadam

Rollback: Jika import corrupt leads.json → restore dari backup yang dibuat sebelum import.

---

## PHASE 4 — Fast Hustle Preview Builder

MVM target: Boleh generate preview HTML dari prospect data.

Acceptance:
- [ ] "Generate Preview" button visible dalam prospect card
- [ ] Click → generate preview HTML dalam DEMOS/ folder
- [ ] Preview ada watermark "PREVIEW SAHAJA — Belum Live"
- [ ] previewPath update dalam leads.json
- [ ] previewStatus tukar ke "READY"
- [ ] Preview boleh buka dalam browser
- [ ] Tiada fake price, fake review, fake awards dalam preview
- [ ] WA button dalam preview guna nombor yang betul

Rollback: Jika preview generation fail → previewStatus kekal "NOT_BUILT", tunjuk error message.

---

## PHASE 5 — Message Flow + AutoLog

MVM target: Approve flow lengkap dengan tracking.

Acceptance:
- [ ] DM draft auto-include trackedPreviewUrl (jika preview siap)
- [ ] "Copy DM" button berfungsi
- [ ] "Approve" → buka WA dengan prefilled DM
- [ ] "Confirm Sent" button berasingan dari Approve
- [ ] Confirm Sent → contactedAt timestamp saved
- [ ] "Mark Replied" → replyStatus = REPLIED + repliedAt saved
- [ ] "Closed Won" → dealStatus = WON + locked = true
- [ ] "Closed Lost" → dealStatus = LOST + locked = true
- [ ] Run Log timeline visible dalam prospect card (collapsible)
- [ ] Setiap button action create event dalam events[]
- [ ] Locked record → show amendment box, block silent edits

Rollback: Jika AutoLog break WA open → disable AutoLog, kekal WA open behavior.

---

## PHASE 6 — Schedule + Operation Control (OPTIONAL MVM)

Buat hanya jika Phase 1-5 semua pass.
Boleh skip jika masa tidak cukup.

Acceptance:
- [ ] Master ON/OFF toggle visible
- [ ] OFF state → approve button disabled
- [ ] Schedule tab → tunjuk scheduled prospects
- [ ] Export backup → download leads.json + run-log.json

---

## PHASE 7+ — Future (Jangan buat dalam MVM)

- Workflow automation engine
- Baileys WhatsApp integration
- SaaS multi-user
- Cloud database

---

## ROLLBACK MASTER PLAN

Sebelum setiap phase, Claude Code CLI MESTI:
1. Backup leads.json → leads.json.bak
2. Note semua files yang akan diubah
3. Jika phase fail → restore dari .bak
4. Report exact error + file + line number

---

## STOP CONDITIONS

Claude Code CLI MESTI stop dan report tanpa proceed jika:
- leads.json corrupt atau data loss
- localhost:3777 tidak boleh start
- Approve button tidak buka WA
- DM draft hilang
- Zira lead hilang dari dashboard

---

## FINAL ACCEPTANCE — SEBELUM HANTAR REPORT

Aliff verify sendiri:
- [ ] Buka localhost:3777
- [ ] Import 3 test prospects
- [ ] Generate 1 preview
- [ ] Click Approve → WA buka dengan DM + preview link
- [ ] Click Confirm Sent → status update
- [ ] Click Mark Replied → status update
- [ ] Click Closed Won → record locked
- [ ] Export backup → file downloaded

Bila semua pass → Phase 0 MVM complete → sedia untuk RM350 pertama.

