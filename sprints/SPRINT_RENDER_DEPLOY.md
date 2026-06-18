# SPRINT_RENDER_DEPLOY.md
# DealSense — Deploy Nexus Landing Engine ke Render.com (Free Tier)
# Run: claude "Read sprints/MEMORY.md then execute sprints/SPRINT_RENDER_DEPLOY.md"

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

## CONSTRAINTS
- DO NOT touch cf-version/ folder
- DO NOT modify pipeline/ or public/ production logic
- DO NOT delete any files
- DO NOT change any business logic
- Render deploy only — backend Express server

---

## PHASE 1 — PRE-FLIGHT CHECK

Check these files exist and report content summary:
1. package.json (root) — check start script, main entry point
2. server.js atau index.js (root) — confirm Express entry file name
3. .env or .env.example — list env var names (NOT values)
4. .gitignore — confirm node_modules and .env are ignored

Report:
- Entry file name (server.js / index.js / app.js)
- Start command in package.json
- List of required env vars
- Any file missing that Render needs

DO NOT modify anything.
STOP — tunggu "continue".

---

## PHASE 2 — RENDER CONFIG FILES

Buat 2 files baru di project root:

### FILE 1: render.yaml
```yaml
services:
  - type: web
    name: nexus-landing-engine
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: APP_API_KEY
        sync: false
      - key: PORT
        value: 10000
```

### FILE 2: .health (add health endpoint ke server entry file)

Dalam server.js / index.js (mana yang betul dari Phase 1), tambah SEBELUM existing routes:
```javascript
// Health check — untuk UptimeRobot keep-alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', ts: Date.now() });
});
```

Pastikan PORT dibaca dari environment:
Cari line `app.listen(PORT` atau `app.listen(3000` — pastikan guna:
```javascript
const PORT = process.env.PORT || 3000;
```

Commit: "chore: add render.yaml + health endpoint for Render deploy"
Push ke GitHub.
Report: exact lines changed, line numbers.
STOP — tunggu "continue".

---

## PHASE 3 — RENDER DASHBOARD INSTRUCTION (MANUAL)

Ini steps yang Aliff buat sendiri di browser — bukan Cowork:

```
STEP 1 — Create Render account
  → https://render.com
  → Sign up with GitHub (sama account dengan DealSense-MY)
  → No credit card needed

STEP 2 — New Web Service
  → Dashboard → New → Web Service
  → Connect repository: DealSense-MY/ai-landing-page
  → Branch: main
  → Runtime: Node
  → Build Command: npm install
  → Start Command: npm start
  → Plan: Free

STEP 3 — Set Environment Variables
  → Environment tab → Add these:
    ANTHROPIC_API_KEY = [paste key dari Railway lama]
    APP_API_KEY       = [sama dengan Railway lama]
    NODE_ENV          = production

STEP 4 — Deploy
  → Klik "Create Web Service"
  → Tunggu build ~2-3 minit
  → Copy URL: https://nexus-landing-engine.onrender.com (atau nama yang Render bagi)

STEP 5 — UptimeRobot (prevent sleep)
  → https://uptimerobot.com
  → Sign up free
  → New Monitor:
      Type: HTTP(s)
      Friendly Name: Nexus Landing Engine
      URL: https://[your-render-url]/health
      Monitoring Interval: 5 minutes
  → Create Monitor
```

Report template untuk Aliff paste balik ke Ith selepas deploy:
```
RENDER URL: https://_____________.onrender.com
UPTIME ROBOT: [configured / not yet]
HEALTH CHECK: [pass / fail]
ENV VARS SET: [yes / no]
```

STOP — tunggu Aliff confirm URL dari Render dashboard.

---

## PHASE 4 — VERIFY DEPLOY

Selepas Aliff paste URL, verify:

```bash
curl -s https://[RENDER_URL]/health
```

Expected: `{"status":"ok","ts":...}`

Then test generate endpoint:
```bash
curl -s -X POST https://[RENDER_URL]/api/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: [APP_API_KEY]" \
  -d '{"businessName":"Test","niche":"dental","tone":"professional","lang":"EN"}'
```

Report:
- [ ] Health check returns 200
- [ ] Generate endpoint responds (even if slow — first call wakes container)
- [ ] No 500 errors

If fail: paste error log dari Render dashboard.
STOP — done.
