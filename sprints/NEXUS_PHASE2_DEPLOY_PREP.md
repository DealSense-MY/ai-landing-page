# NEXUS_PHASE2_DEPLOY_PREP.md

NexusLandingEngine CF Version — Phase 2 Deploy Prep

Run: `claude "Read sprints/MEMORY.md then execute sprints/NEXUS_PHASE2_DEPLOY_PREP.md"`

Pre-audit: CF_PRE_PHASE2_AUDIT.md (2026-06-09) — code is complete, deploy blocked only by config

---

## CONTEXT

Phase 2 (frontend integration) is ALREADY DONE per CF_PRE_PHASE2_AUDIT.md.
`cf-version/` is code-complete. Two deploy-time blockers remain:

1. KV namespace IDs in `wrangler.toml` are placeholder strings — `wrangler deploy` will fail
2. Secrets (`ANTHROPIC_API_KEY`, `APP_API_KEY`) not yet set on Cloudflare

This sprint resolves both blockers and deploys the worker.

---

## RULES

- Work ONLY inside `DealSense/07_NexusLandingEngine/cf-version/`
- Do NOT modify any source files (worker.js, pipeline/\*, public/\*)
- Only `wrangler.toml` gets edited (to paste KV IDs)
- STOP after each phase, wait for confirmation

---

## PRE-CONDITION CHECK

Before starting, verify wrangler is logged in:

```bash
cd DealSense/07_NexusLandingEngine/cf-version
npx wrangler whoami
```

If output shows "You are not authenticated", run:

```bash
npx wrangler login
```

This opens a browser OAuth flow. Complete it, then re-run `whoami` to confirm.

STOP — paste `whoami` output. Wait for confirmation.

---

## PHASE 1 — INSTALL DEPENDENCIES

```bash
cd DealSense/07_NexusLandingEngine/cf-version
npm install
```

Confirm `node_modules/` created and no errors.

STOP — paste install output. Wait for "continue".

---

## PHASE 2 — CREATE KV NAMESPACES

Run all 4 commands. Each prints a namespace ID — **copy every ID exactly**.

```bash
npm run kv:create-demo
```

→ Copy the `id:` value. Label it: **DEMO_STORE id**

```bash
npm run kv:create-demo-preview
```

→ Copy the `id:` value. Label it: **DEMO_STORE preview_id**

```bash
npm run kv:create-history
```

→ Copy the `id:` value. Label it: **HISTORY_STORE id**

```bash
npm run kv:create-history-preview
```

→ Copy the `id:` value. Label it: **HISTORY_STORE preview_id**

STOP — paste all 4 IDs. Wait for "continue".

---

## PHASE 3 — UPDATE wrangler.toml

Edit `cf-version/wrangler.toml`. Replace the 4 placeholder values with the real IDs from Phase 2:

```toml
[[kv_namespaces]]
binding = "DEMO_STORE"
id = "<DEMO_STORE id from Phase 2>"
preview_id = "<DEMO_STORE preview_id from Phase 2>"

[[kv_namespaces]]
binding = "HISTORY_STORE"
id = "<HISTORY_STORE id from Phase 2>"
preview_id = "<HISTORY_STORE preview_id from Phase 2>"
```

After editing, confirm no placeholder strings remain:

```bash
grep "REPLACE_WITH" wrangler.toml
```

Expected output: (empty — no matches)

STOP — paste grep output. Wait for "continue".

---

## PHASE 4 — SET SECRETS

Run each command. Wrangler will prompt for the value — paste it and press Enter.

**ANTHROPIC_API_KEY** (your sk-ant-... key):

```bash
npm run secret:anthropic
```

**APP_API_KEY** (any random string, used as frontend auth token):

```bash
npm run secret:appkey
```

Generate a strong APP_API_KEY if you don't have one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

STOP — confirm both secrets set (wrangler prints "✅ Success"). Wait for "continue".

---

## PHASE 5 — LOCAL DEV SMOKE TEST (optional but recommended)

```bash
npm run dev
```

Wrangler starts a local dev server (default: <http://localhost:8787>).

Open browser → <http://localhost:8787>

Verify:

- [ ] Page loads (index.html served)
- [ ] No console errors
- [ ] Can fill the form and click Generate (requires ANTHROPIC_API_KEY to work in dev)

Ctrl+C to stop dev server when done.

STOP — report result. Wait for "continue".

---

## PHASE 6 — DEPLOY

```bash
npm run deploy
```

Wrangler bundles, uploads static assets, and deploys the worker.

Expected output includes:

```text
✅ Successfully published your Worker to
  https://nexus-landing-engine.<your-subdomain>.workers.dev
```

STOP — paste the deployed URL. Wait for "continue".

---

## PHASE 7 — SMOKE TEST LIVE URL

With the deployed URL from Phase 6:

1. Open `https://nexus-landing-engine.<subdomain>.workers.dev` in browser
2. Verify page loads correctly
3. Test POST /generate — fill the form, click Generate, confirm AI response arrives
4. Confirm a demo is saved: click History tab, confirm entry appears
5. Test GET /demo/:id — click the demo link from history, confirm it loads

Report each check as PASS or FAIL.

STOP — paste results. Wait for "continue".

---

## PHASE 8 — MEMORY.md UPDATE

After successful deploy, update `sprints/MEMORY.md`:

```text
NEXUS_CF_PHASE2_DEPLOY — DONE ✅ notes: KV namespaces created (DEMO_STORE + HISTORY_STORE),
secrets set (ANTHROPIC_API_KEY + APP_API_KEY), wrangler.toml IDs updated,
deployed to workers.dev — URL: <paste URL here>
```

Also update `LAST UPDATED` and `CURRENT PHASE` lines.

STOP — sprint complete.

---

## ADVISORY — Cloudflare Plan

Free Workers plan has a **10ms CPU time limit**. AI generation calls take 3–8s.
If generation returns a 1101 error on the live URL, you need Workers Paid plan
($5/month) for the Unbound CPU limit.

Railway version remains live as fallback until CF is confirmed stable.

---

## BLOCKER REFERENCE (from CF_PRE_PHASE2_AUDIT.md)

| Blocker | Fix |
| --- | --- |
| KV IDs are placeholders | Phase 2 + Phase 3 above |
| Secrets not set | Phase 4 above |
| Paid plan needed for AI calls | Advisory — upgrade if 1101 errors appear |
