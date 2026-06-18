# GUILD_EXECUTION_ORDER.md
# DealSense — Master Execution Checklist
# Ith (Claude.ai) generated | Untuk Aliff — ikut order ni

## STATUS KEY
[ ] = belum
[→] = in progress
[✓] = done

---

## SPRINT 1 — ENGINE HIDUP SEMULA (Render Deploy)
File: sprints/SPRINT_RENDER_DEPLOY.md
Cowork prompt:
```
claude "Execute sprints/SPRINT_RENDER_DEPLOY.md"
```
Steps:
[ ] Phase 1 — Pre-flight check (Cowork)
[ ] Phase 2 — Add render.yaml + health endpoint (Cowork)
[ ] Phase 3 — Manual: buka Render.com, deploy, set env vars (ALIFF buat sendiri)
[ ] Phase 3 — Manual: set UptimeRobot ping setiap 5 minit (ALIFF buat sendiri)
[ ] Phase 4 — Verify deploy + paste URL balik ke Ith

Output expected: Engine live di https://[name].onrender.com

---

## SPRINT 2 — ZIRA PREVIEW HTML
File: sprints/SPRINT_ZIRA_PREVIEW.md
Cowork prompt:
```
claude "Execute sprints/SPRINT_ZIRA_PREVIEW.md"
```
Steps:
[ ] Phase 1 — Read base demo (Cowork)
[ ] Phase 2 — Build Zira preview HTML (Cowork)
[ ] Phase 3 — Update leads.json previewPath (Cowork)

Output expected:
DEMOS\zira-beauty-spa-ipoh\zira-beauty-spa-ipoh-preview.html

Lepas siap: Screenshot mobile view, ready untuk DM

---

## SPRINT 3 — OUTREACH TOOL BUILD
File: sprints/SPRINT_OUTREACH_TOOL.md (SUDAH ADA dalam sprints/)
Cowork prompt:
```
claude "Execute sprints/SPRINT_OUTREACH_TOOL.md"
```
Steps:
[ ] Phase 1 — Inspect folder
[ ] Phase 2 — Build MVP files
[ ] Phase 3 — Syntax check
[ ] Phase 4 — Final report

Note: Leads.json dah ada Zira data dari Sprint 2.

---

## SPRINT 4 — AUKIY THEME (Operator Dashboard styling)
File: sprints/SPRINT_AUKIY_THEME.md (SUDAH ADA dalam sprints/)
Cowork prompt:
```
claude "Execute sprints/SPRINT_AUKIY_THEME.md"
```
Steps:
[ ] Phase 1 — Audit
[ ] Phase 2 — Apply theme
[ ] Phase 3 — Visual verify

---

## MANUAL ACTION — HANTAR DM ZIRA
Buat sendiri selepas Sprint 3 & 4 done:
[ ] cd tools/semi-auto-outreach
[ ] npm install
[ ] npm start
[ ] Buka http://localhost:3777
[ ] Ambil screenshot preview Zira (iPhone 12 Pro view)
[ ] Update screenshotPath dalam leads.json
[ ] Dashboard → Zira card → EDIT → update WA number Zira
[ ] Tekan YES atau OK → WhatsApp dibuka
[ ] KAU yang tekan send

---

## SELEPAS DM DIHANTAR
[ ] Tunggu reply Zira (1-3 hari)
[ ] Kalau reply → Dashboard → Mark Replied → paste reply
[ ] Kalau tak reply dalam 3 hari → Follow-Up Draft → hantar
[ ] Kalau interested → close RM350 → bayar Cloudflare Workers Paid ($5)

---

## NOTES UNTUK ITH REVIEW
Selepas setiap sprint selesai, upload SPRINT_REPORT atau paste output ke sini.
Ith akan audit dan generate sprint seterusnya kalau ada issue.

ResponseOps BM style untuk DM:
- Soft-sell, problem-first
- Tanya dulu: "Boleh saya tunjuk screenshot?"
- Jangan pitch harga dalam DM pertama
- Default DM Zira dah ada dalam leads.json — review dan edit kalau perlu
