# NexusLandingEngine — Cloudflare Worker Setup
Generated: 2026-06-08 | Phase 1 CF Migration

---

## Files Created

```
cf-version/
├── wrangler.toml                     ← CF config: KV bindings, name, compatibility
├── package.json                      ← deps: @anthropic-ai/sdk, nanoid, wrangler
├── SETUP.md                          ← this file
└── src/
    ├── worker.js                     ← Entry point (replaces Express server.js)
    └── pipeline/
        ├── normalize.js              ← KEEP_AS_IS — zero Node deps, verbatim copy
        ├── decide.js                 ← KEEP_AS_IS — pure logic, verbatim copy
        ├── generate.js               ← REFACTORED — env param instead of process.env
        ├── buildHTML.js              ← KEEP_AS_IS — pure string builder, verbatim copy
        ├── buildJSON.js              ← KEEP_AS_IS — pure object assembly, verbatim copy
        └── qa.js                     ← KEEP_AS_IS — pure string checks, verbatim copy
```

**Production files untouched.** All changes are isolated to `cf-version/`.

---

## KV Bindings Required

Two KV namespaces are needed:

| Binding name   | Purpose                          | Key pattern         |
|----------------|----------------------------------|---------------------|
| `DEMO_STORE`   | Stores generated HTML per demo   | `demo:<nanoid>`     |
| `HISTORY_STORE`| Stores history index as JSON     | `history:index`     |

### Create them (run once):

```bash
cd cf-version
npm install
npm run kv:create-demo
npm run kv:create-history
npm run kv:create-demo-preview
npm run kv:create-history-preview
```

Each command prints an `id`. Paste those IDs into `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "DEMO_STORE"
id = "paste-real-id-here"
preview_id = "paste-real-preview-id-here"

[[kv_namespaces]]
binding = "HISTORY_STORE"
id = "paste-real-id-here-2"
preview_id = "paste-real-preview-id-here-2"
```

---

## Environment Variables / Secrets

| Variable           | Type   | Where to set                         | Notes                              |
|--------------------|--------|--------------------------------------|------------------------------------|
| `ANTHROPIC_API_KEY`| Secret | `npm run secret:anthropic`           | Required — AI calls fail without it|
| `APP_API_KEY`      | Secret | `npm run secret:appkey`              | Optional — omit for open dev mode  |

Secrets are set via Wrangler and stored encrypted in CF dashboard. They are never in `wrangler.toml`.

---

## How to Test Locally

```bash
cd cf-version
npm install

# Set secrets for local dev (stored in .dev.vars — do NOT commit this file)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .dev.vars
echo "APP_API_KEY=your-test-key" >> .dev.vars

# Start local worker
npm run dev
# → Worker runs at http://localhost:8787
```

### Test POST /generate:
```bash
curl -X POST http://localhost:8787/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-test-key" \
  -d '{
    "productName": "SmilePro Dental",
    "niche": "dental_clinic",
    "tone": "warm_professional",
    "phoneNumber": "+60123456789",
    "outputLang": "en"
  }'
# → { html: "...", json: {...}, id: "abc1234567" }
```

### Test GET /demo/:id:
```bash
curl http://localhost:8787/demo/abc1234567
# → HTML page in browser
```

### Test GET /history:
```bash
curl http://localhost:8787/history -H "x-api-key: your-test-key"
# → [...] array of history entries
```

---

## Deploy to Production

```bash
cd cf-version
npm run deploy
# → Deployed to https://nexus-landing-engine.<your-account>.workers.dev
```

For a custom domain, add a route in the CF dashboard under Workers → your worker → Routes.

---

## API Surface (preserved from Railway version)

| Method   | Path             | Auth required | Description                     |
|----------|------------------|---------------|---------------------------------|
| POST     | `/generate`      | Yes           | Generate landing page           |
| GET      | `/demo/:id`      | No            | Retrieve saved demo HTML        |
| GET      | `/history`       | Yes           | List all generated demos        |
| DELETE   | `/history/:id`   | Yes           | Delete a demo from KV           |

Response shape is **preserved**: `POST /generate` returns `{ html, json, id }` — identical to Railway version.

---

## What Changed vs Railway

| Concern             | Railway (server.js)                     | CF Worker (worker.js)                          |
|---------------------|-----------------------------------------|------------------------------------------------|
| Server framework    | Express                                 | Native Fetch API (`export default { fetch }`)  |
| Routing             | `app.get/post/delete`                   | Manual `pathname` + `method` matching           |
| Storage             | `fs.writeFileSync` to `/app/data`       | `env.DEMO_STORE.put` / `env.HISTORY_STORE.put` |
| Secrets             | `process.env.ANTHROPIC_API_KEY`         | `env.ANTHROPIC_API_KEY` (Worker binding)        |
| Persistence         | Requires Railway Volume mount           | KV is globally persistent by default            |
| Demo TTL            | Forever (until deleted)                 | 90 days (configurable via `DEMO_TTL_SECONDS`)   |
| History index       | JSON file on disk                       | Single KV key `history:index`, capped at 500    |
| generate() signature| `generate(normalized, decisions)`       | `generate(normalized, decisions, env)`          |

**Doctrines preserved:**
- One AI call per `/generate` request (in `generate.js`)
- No `/regenerate` endpoint
- No backend `/export`
- Response shape: `{ html, json, id }`

---

## Unresolved Risks

### 1. History index race condition (LOW — same as Railway)
KV's `get → modify → put` on `history:index` is not atomic. Under concurrent `/generate` requests, two Workers could read the same old value and write conflicting updates — one write wins, the other is silently dropped. Mitigation options: Durable Objects (atomic state), or accept the loss (history is a convenience index, not critical data — demos themselves are safely stored by unique key).

### 2. KV value size limit (MEDIUM)
`history:index` is a single JSON blob. KV values are capped at **25 MB**. At ~500 entries × ~300 bytes each = ~150 KB, well within limits. But if entries grow (longer businessName/niche), monitor size. The `HISTORY_MAX = 500` cap in `worker.js` prevents runaway growth.

### 3. Worker CPU time limit (LOW)
Workers have a 30s CPU time limit (paid plan) or 10ms (free plan without Unbound). The Anthropic API call takes 3–8s. **Free plan will not work** — paid plan (Workers Paid) or Cloudflare AI Gateway is required.

### 4. Static assets not wired (PHASE 2 TASK)
`wrangler.toml` has `[site] bucket = "./public"` but the `public/` folder and form UI are not yet copied into `cf-version/`. The worker currently returns 404 for `/` and static files. The existing `public/index.html` and `public/js/` need to be copied and `worker.js` needs a static asset handler added (using `env.ASSETS.fetch(request)` from the Workers Sites binding).

### 5. `APP_API_KEY` injection into index.html
The Railway `server.js` dynamically injects `window._appApiKey` into `index.html` at request time. The CF Worker currently does not do this — `/` returns 404. Once static assets are wired (Phase 2), this injection needs to be replicated in `worker.js` by intercepting the `/` route and injecting the script tag before serving the HTML.

### 6. KV eventual consistency (VERY LOW)
Cloudflare KV uses eventual consistency with a ~60s propagation window globally. A demo written in one region may not be readable in another region within that window. For a Malaysian-focused product served primarily from the same CF region, this is negligible in practice.
