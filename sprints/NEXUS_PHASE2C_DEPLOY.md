# NEXUS_PHASE2C_DEPLOY.md

NexusLandingEngine CF Version — Deploy + Smoke Test

Run: `claude "Read sprints/MEMORY.md then execute sprints/NEXUS_PHASE2C_DEPLOY.md"`

Pre-req: NEXUS_PHASE2B_SET_SECRETS.md complete (both secrets set and verified).

---

## CONTEXT

All blockers are resolved:

- KV namespace IDs: real IDs in wrangler.toml ✅
- Secrets: ANTHROPIC_API_KEY + APP_API_KEY set ✅

This sprint runs the deploy and verifies the live worker.

---

## RULES

- Work ONLY inside `DealSense/07_NexusLandingEngine/cf-version/`
- Do NOT modify any source files during this sprint
- STOP after each phase and wait for confirmation

---

## PHASE 1 — DEPLOY

```bash
cd DealSense/07_NexusLandingEngine/cf-version
npm run deploy
```

Wrangler bundles, uploads static assets to KV, and deploys the worker.

Expected output ends with something like:

```
✨ Success! Your worker nexus-landing-engine is deployed.

https://nexus-landing-engine.<your-subdomain>.workers.dev
```

STOP — paste the full deploy output including the URL. Wait for "continue".

---

## PHASE 2 — SMOKE TEST LIVE URL

With the URL from Phase 1, run these 5 checks manually in browser:

- [ ] 1. Page loads — open `https://nexus-landing-engine.<subdomain>.workers.dev`
- [ ] 2. No console errors — open DevTools → Console, verify clean
- [ ] 3. Generate — fill the form (business name, niche, location), click Generate,
         confirm AI response arrives within ~10s
- [ ] 4. History — click the History tab, confirm the generation appears as an entry
- [ ] 5. Demo link — click the demo link from history, confirm it loads the landing page

Report each check as PASS or FAIL.

**If Generate returns a `1101` error:**
This means the worker hit the 10ms CPU limit on the Free plan.
You need Workers Paid plan ($5/month) — upgrade at:
<https://dash.cloudflare.com/> → Workers & Pages → Your account → Billing

The Railway version remains live as fallback until CF is confirmed stable.

STOP — paste smoke test results. Wait for "continue".

---

## PHASE 3 — UPDATE MEMORY.md

After successful smoke test, update `sprints/MEMORY.md`:

```
NEXUS_CF_PHASE2C_DEPLOY — DONE ✅ notes: deployed to workers.dev — URL: <paste URL>;
smoke test: page load PASS, generate PASS, history PASS, demo link PASS
```

Also update `LAST UPDATED` and `CURRENT PHASE` lines.

If generate returned 1101 — note it:

```
NEXUS_CF_PHASE2C_DEPLOY — DONE ✅ notes: deployed to workers.dev — URL: <paste URL>;
page load PASS, generate FAIL (1101 CPU limit — Paid plan required), history N/A, demo N/A
```

STOP — sprint complete.

---

## ADVISORY — Cloudflare Plan

Free Workers plan: **10ms CPU time limit**. AI generation calls take 3–8s.

If you hit the 1101 error, upgrade to Workers Paid ($5/month) for the Unbound CPU limit.
The Railway version at the existing URL continues to work as fallback.
