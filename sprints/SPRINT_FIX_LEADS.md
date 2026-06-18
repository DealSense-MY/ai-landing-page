# SPRINT_FIX_LEADS.md
# DealSense — Hotfix: Betulkan leads.json untuk Zira
# Run: claude "Execute sprints/SPRINT_FIX_LEADS.md"

## INSTRUCTION
Quick fix — execute terus, no phase gating needed.
Satu file sahaja. Report lepas siap.

## CONSTRAINTS
- DO NOT ubah field lain selain yang disebut
- DO NOT delete lead
- DO NOT touch server.js, app.js, style.css
- Edit leads.json sahaja

---

## TASK — FIX ZIRA LEAD RECORD

Read file: tools\semi-auto-outreach\data\leads.json

Cari object dengan id: "zira-beauty-spa-ipoh"

Betulkan field-field ini sahaja:

1. status: tukar dari "CLOSED_LOST" → "PREVIEW_READY"

2. previewPath: pastikan value ini (jangan tukar kalau dah sama):
   "C:\\Users\\Selina\\.claude\\DealSense\\07_NexusLandingEngine\\DEMOS\\zira-beauty-spa-ipoh\\zira-beauty-spa-ipoh-preview.html"

3. platform: tukar dari "UNKNOWN" → "Facebook"
   (Zira Beauty Spa aktif di Facebook — ini assumption berdasarkan DM draft yang sebut Facebook)

4. contactMethod: tukar dari "UNKNOWN" → "WhatsApp"

Jangan ubah:
- id
- businessName
- whatsappNumber (60165531496 — kekal)
- defaultDm
- weakness
- offerAngle
- location
- niche

Selepas edit, verify JSON valid (no syntax error).

Report:
- Fields yang diubah + nilai lama → nilai baru
- JSON valid: yes/no
- Screenshot instruction: restart npm start lepas edit supaya dashboard refresh
