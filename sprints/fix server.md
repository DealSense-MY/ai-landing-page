You are Claude Code working in repository DealSense-MY/ai-landing-page.

CURRENT PROBLEM:
Render deploy build succeeds, but runtime fails with:
Error: EACCES: permission denied, mkdir '/app/data'
at server.js:42:28

PHASE 1 — Fix Render writable data directory

TASK:
Fix server.js so it does not try to create /app/data on Render.

REQUIREMENTS:

1. Inspect server.js around line 42.
2. Find any hardcoded absolute path such as /app/data.
3. Replace it with a safe writable project-relative data directory:
   const DATA_DIR = path.join(process.cwd(), 'data');
4. Ensure the correct path import exists based on current module style:

   * If ESM: import path from 'path';
   * If CommonJS: const path = require('path');
5. Keep fs.mkdirSync(DATA_DIR, { recursive: true }) working.
6. Do not change existing API routes.
7. Keep GET /health unchanged.
8. Keep POST /generate unchanged.
9. Do not modify business logic unless required for the Render path fix.
10. Do not expose, print, commit, or hardcode any API keys.

PHASE 2 — Environment variable readiness

TASK:
Verify the app expects these environment variables:

* ANTHROPIC_API_KEY
* APP_API_KEY
* NODE_ENV=production

REQUIREMENTS:

1. Confirm whether server.js reads ANTHROPIC_API_KEY.
2. Confirm whether server.js reads APP_API_KEY.
3. Confirm whether NODE_ENV is safe to set to production.
4. If there is a .env.example file, update it with variable names only, no real secrets.
5. If there is no .env.example file, create one with:
   ANTHROPIC_API_KEY=
   APP_API_KEY=
   NODE_ENV=production
6. Never write real API keys into .env.example.
7. Never commit .env or real secret values.

PHASE 3 — Render API key setup guidance

IMPORTANT:
Do not ask me to paste secrets into the repo.
Do not hardcode secrets.
Do not commit secrets.

Give me one of these two safe options:

OPTION A — Manual Render Dashboard:
Tell me exactly where to enter these values:

* Render Dashboard → ai-landing-page → Environment
* ANTHROPIC_API_KEY = my existing Anthropic key
* APP_API_KEY = my existing app key
* NODE_ENV = production

OPTION B — Render CLI/API:
Only if Render CLI/API is already configured locally, provide commands using placeholder values like:
render env set ANTHROPIC_API_KEY="PASTE_KEY_HERE"
render env set APP_API_KEY="PASTE_KEY_HERE"
render env set NODE_ENV="production"

Do not run secret-setting commands unless I explicitly confirm and provide the values locally in the terminal.

PHASE 4 — Verify locally

Run safe checks:

1. npm install if needed
2. npm start or syntax check if practical
3. Confirm app can start without trying to mkdir /app/data
4. Confirm /health route exists

PHASE 5 — Commit and push

If code changes are needed:

1. Commit with message:
   fix: use writable data directory for Render
2. Push to main.

OUTPUT REPORT:

* Root cause
* Files changed
* Exact lines changed
* Whether .env.example was created/updated
* Commit hash
* Pushed to main: yes/no
* Next manual Render steps for Aliff
