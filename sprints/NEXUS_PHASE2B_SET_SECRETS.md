# NEXUS_PHASE2B_SET_SECRETS.md

NexusLandingEngine CF Version — Set Wrangler Secrets

Run: `claude "Read sprints/MEMORY.md then execute sprints/NEXUS_PHASE2B_SET_SECRETS.md"`

Pre-req: NEXUS_PHASE2_DEPLOY_PREP.md phases 0–3 complete (wrangler.toml has real KV IDs).

---

## CONTEXT

Two secrets must be set on Cloudflare before the worker can run:

1. `ANTHROPIC_API_KEY` — the sk-ant-... key used for AI generation
2. `APP_API_KEY` — the frontend auth token (any random string)

These cannot be set non-interactively. This sprint guides you through the process
step by step and verifies both are set before moving on.

---

## RULES

- Work ONLY inside `DealSense/07_NexusLandingEngine/cf-version/`
- Do NOT commit secrets to any file
- Do NOT put secrets in wrangler.toml [vars] — they go via `wrangler secret put`
- STOP after each phase and wait for confirmation

---

## PHASE 1 — GENERATE APP_API_KEY (if you don't have one)

If you don't already have an APP_API_KEY, generate one now:

```bash
cd DealSense/07_NexusLandingEngine/cf-version
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output. Save it somewhere safe (password manager, .env.local — NOT in git).

STOP — confirm you have a key ready. Wait for "continue".

---

## PHASE 2 — SET ANTHROPIC_API_KEY

```bash
cd DealSense/07_NexusLandingEngine/cf-version
npm run secret:anthropic
```

Wrangler will prompt:

```
Enter a secret value: ›
```

Paste your `sk-ant-...` key and press Enter.

Expected output:

```
✅ Success! Uploaded secret ANTHROPIC_API_KEY
```

STOP — paste the success line. Wait for "continue".

---

## PHASE 3 — SET APP_API_KEY

```bash
npm run secret:appkey
```

Wrangler will prompt:

```
Enter a secret value: ›
```

Paste the APP_API_KEY from Phase 1 and press Enter.

Expected output:

```
✅ Success! Uploaded secret APP_API_KEY
```

STOP — paste the success line. Wait for "continue".

---

## PHASE 4 — VERIFY SECRETS ARE SET

List the secrets on the worker to confirm both are registered:

```bash
npx wrangler secret list
```

Expected output includes both:

```
ANTHROPIC_API_KEY
APP_API_KEY
```

STOP — paste the list output. Wait for "continue".

---

## PHASE 5 — UPDATE MEMORY.md

After both secrets confirmed, add to `sprints/MEMORY.md`:

```
NEXUS_CF_PHASE2B_SECRETS — DONE ✅ notes: ANTHROPIC_API_KEY + APP_API_KEY set via wrangler secret put; verified via wrangler secret list
```

Update `LAST UPDATED` and `CURRENT PHASE` lines.

Then proceed to: `claude "Read sprints/MEMORY.md then execute sprints/NEXUS_PHASE2C_DEPLOY.md"`

STOP — sprint complete.
