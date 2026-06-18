# SPRINT_PATCH_ZIRA_DM.md
# DealSense — Patch: Customer POV Softselling DM untuk Zira Beauty Spa
# Run: claude "Execute sprints/SPRINT_PATCH_ZIRA_DM.md"

## INSTRUCTION
Single-task patch. Execute terus, no phase gate.
Selepas siap: report dan STOP.

---

## CONSTRAINTS — WAJIB IKUT
- DO NOT modify approval flow
- DO NOT modify WhatsApp open flow
- DO NOT change server.js atau API logic
- DO NOT add auto-send behavior
- DO NOT touch Railway, Cloudflare, production files
- Only edit DM draft text dan CTA helper text

---

## TASK 1 — PATCH leads.json

File: `tools/semi-auto-outreach/data/leads.json`

Cari field `"defaultDm"` dalam Zira lead object.
Replace nilai dia dengan DM baru ini (exact copy, termasuk newlines):

```
Hi puan, saya cuba tengok Zira Beauty Spa dari sudut customer baru yang berminat nak tahu pakej.\n\nSaya nampak Zira memang aktif letak promo dan pakej di Facebook. Cuma sebagai customer baru, saya masih perlu scroll beberapa post dulu untuk faham pakej, lokasi dan cara booking.\n\nBenda ni kecil, tapi kadang-kadang cukup untuk buat customer tangguh WhatsApp walaupun dia sebenarnya berminat.\n\nJadi saya susun satu preview ringkas — servis, pakej, promo, lokasi dan button WhatsApp booking dalam satu page.\n\nBoleh saya share preview ni untuk puan tengok sendiri dari sudut customer?\n\nKalau sesuai baru teruskan. Kalau tak sesuai pun tak apa.
```

---

## TASK 2 — PATCH app.js (CTA helper text)

File: `tools/semi-auto-outreach/public/app.js`

Dalam function `buildLeadCard()`, cari label untuk DM panel.
Baris ni (atau yang serupa):
```javascript
<label>✏️ DM Draft — edit sebelum approve</label>
```

Replace label text sahaja kepada:
```javascript
<label>✏️ DM Draft — Customer POV Softselling: mesej bermula seperti pemerhatian customer baru, bukan sales pitch. Hook utama ialah customer mungkin berminat tetapi tangguh WhatsApp kerana perlu scroll untuk faham pakej, lokasi dan cara booking.</label>
```

---

## TASK 3 — VERIFY

Semak leads.json — confirm DM baru ada dan whatsappNumber masih `60165531496`.
Semak app.js — confirm label updated.
Confirm tiada perubahan pada:
- server.js
- approval logic (handleYes, handleOk, handleNo)
- openContact() function
- PATCH /api/leads endpoint

---

## REPORT FORMAT

```
✅ FILE CHANGED:
   [list files yang diedit]

✅ DM DRAFT AFTER PATCH:
   [paste exact DM]

✅ CTA HELPER TEXT AFTER PATCH:
   [paste exact label text]

✅ APPROVAL/WA FLOW: UNCHANGED
✅ AUTO-SEND: NOT ADDED
✅ SERVER LOGIC: UNCHANGED
```

STOP — done.
