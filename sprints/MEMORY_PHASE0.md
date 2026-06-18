# MEMORY_PHASE0.md
# DealSense Guild — Phase 0 Memory File
# Baca ini sebelum execute mana-mana sprint Phase 0

## PROJECT STATE
- Engine: Nexus Landing Engine v2
- Repo: DealSense-MY/ai-landing-page
- Local path: C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\
- Hosting sekarang: Railway EXPIRED → migrate ke Render.com (free)
- Dashboard tool: tools\semi-auto-outreach\ (running localhost:3777)

## SPRINT EXECUTION ORDER — PHASE 0

Execute dalam urutan ini. Jangan lompat:

STEP 1 → SPRINT_FIX_LEADS.md
  Prompt: claude "Execute sprints/SPRINT_FIX_LEADS.md"
  Output: leads.json Zira status = PREVIEW_READY
  Time: ~5 minit

STEP 2 → SPRINT_RENDER_DEPLOY.md
  Prompt: claude "Execute sprints/SPRINT_RENDER_DEPLOY.md"
  Output: Engine live di https://[name].onrender.com
  Manual step: Aliff buat Render + UptimeRobot setup
  Time: ~20 minit

STEP 3 → SPRINT_ZIRA_PREVIEW.md
  Prompt: claude "Execute sprints/SPRINT_ZIRA_PREVIEW.md"
  Output: DEMOS\zira-beauty-spa-ipoh\zira-beauty-spa-ipoh-preview.html
  Time: ~15 minit

STEP 4 → SPRINT_SCREENSHOT_DM.md
  Prompt: claude "Execute sprints/SPRINT_SCREENSHOT_DM.md"
  Output: Screenshot ready, DM reviewed, sedia hantar
  Time: ~10 minit

STEP 5 → MANUAL (Aliff buat sendiri)
  Buka localhost:3777
  Klik APPROVE pada Zira card
  WA buka → tekan send
  DONE

## KEY FILES
- tools\semi-auto-outreach\data\leads.json → Zira lead data
- DEMOS\zira-beauty-spa-ipoh\ → preview HTML folder
- DEMOS\aurelia-glow-skincare\ → base demo untuk copy
- sprints\ → semua sprint files

## CLIENT DATA (Zira)
- Business: Zira Beauty Spa
- Location: Ipoh
- WA: 60165531496
- Offer: RM350 WhatsApp Booking Page
- Status target: PREVIEW_READY
- DM style: soft-sell BM, tanya dulu, no hard pitch

## CONSTRAINTS UNTUK SEMUA SPRINT
- DO NOT touch Railway / Cloudflare / production
- DO NOT contact client automatically
- DO NOT delete any files
- DO NOT send WA automatically — human approval WAJIB
- Build dalam folders yang betul sahaja

## PHASE 0 SELESAI BILA
- Render engine live + health check pass
- Zira preview HTML boleh buka di browser
- DM dihantar manual dari dashboard
- Zira reply (target: dalam 3 hari)
- RM350 masuk → unlock Phase 1
