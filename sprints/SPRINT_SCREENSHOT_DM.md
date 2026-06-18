# SPRINT_SCREENSHOT_DM.md
# DealSense — Final Step: Screenshot + Prep DM untuk Zira
# Run: claude "Execute sprints/SPRINT_SCREENSHOT_DM.md"
# JALANKAN SELEPAS SPRINT_ZIRA_PREVIEW.md selesai

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

## CONSTRAINTS
- DO NOT contact client
- DO NOT send message automatically
- DO NOT modify preview HTML
- Prepare sahaja — human sends

---

## PHASE 1 — VERIFY PREVIEW FILE

Check file exists:
DEMOS\zira-beauty-spa-ipoh\zira-beauty-spa-ipoh-preview.html

Report:
- File exists: yes/no
- File size (KB)
- Line count
- Watermark text present: yes/no (grep "PREVIEW SAHAJA")
- WhatsApp link format: confirm contains "wa.me/60XXXXXXXXX"
- Business name "Zira Beauty Spa" appears in file: yes/no
- Any leftover "Aurelia Glow" text: yes/no (grep case-insensitive)

If file missing: report "SPRINT_ZIRA_PREVIEW.md perlu dijalankan dulu"
STOP — tunggu "continue".

---

## PHASE 2 — UPDATE SCREENSHOT PATH

Selepas Aliff ambil screenshot manual (instruction di bawah),
update leads.json field screenshotPath.

Instruction untuk Aliff (buat sendiri):
```
CARA AMBIL SCREENSHOT MOBILE VIEW:
1. Buka file dalam Chrome:
   File → Open File → pilih zira-beauty-spa-ipoh-preview.html
2. Tekan F12 (DevTools)
3. Klik icon Toggle Device Toolbar (Ctrl+Shift+M)
4. Pilih device: iPhone 12 Pro
5. Scroll dari atas ke bawah, screenshot setiap section
6. Atau guna Windows Snipping Tool (Win+Shift+S)
7. Save dalam folder:
   DEMOS\zira-beauty-spa-ipoh\screenshots\
   Nama file: zira-preview-mobile.png
```

Selepas Aliff hantar path screenshot, update leads.json:
```json
"screenshotPath": "C:\\Users\\Selina\\.claude\\DealSense\\07_NexusLandingEngine\\DEMOS\\zira-beauty-spa-ipoh\\screenshots\\zira-preview-mobile.png"
```

STOP — tunggu "continue" (atau tunggu Aliff hantar path).

---

## PHASE 3 — REVIEW DM DRAFT

Read leads.json, extract field defaultDm untuk Zira.

Print DM draft dalam full.

Report:
- Character count
- Adakah mention "Zira Beauty Spa" by name: yes/no
- Adakah ada hard pitch harga (RM xxx): yes/no (kalau ada, flag untuk edit)
- Adakah tone soft-sell (tanya dulu, bukan terus pitch): yes/no
- Cadangan edit kalau ada (optional)

Reminder kepada Aliff:
```
FLOW HANTAR DM:
1. Buka http://localhost:3777
2. Pastikan npm start dah running (cd tools/semi-auto-outreach && npm start)
3. Klik EDIT pada Zira card
4. Review DM — edit kalau perlu
5. Klik OK → WA akan buka dengan message
6. KAU yang tekan send dalam WA
7. Lepas send → klik "Mark Replied" bila dapat reply
```

STOP — done. Sedia untuk hantar.

---

## CHECKLIST FINAL SEBELUM SEND

Aliff verify sendiri:
- [ ] Preview HTML boleh buka dalam browser
- [ ] Watermark PREVIEW SAHAJA nampak
- [ ] Nombor WA Zira dalam leads.json betul (60165531496)
- [ ] DM draft dah review, tone OK
- [ ] Dashboard running di localhost:3777
- [ ] Screenshot preview dah ada (optional tapi bagus)

Bila semua check — tekan APPROVE dalam dashboard.
