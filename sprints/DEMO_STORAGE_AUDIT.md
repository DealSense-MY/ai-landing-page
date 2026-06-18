# DEMO_STORAGE_AUDIT.md
**Audited by:** Claude Code CLI | **Date:** 2026-06-08 | **Source:** server.js

---

## 1. How POST /generate saves demo HTML

**Lines 52–90 of server.js**

1. Pipeline runs: `normalize` → `decide` → `generate` (Claude API call) → `buildHTML` → `buildJSON` → `qa`
2. A 10-character random ID is generated via `nanoid(10)`, sanitized to `[a-zA-Z0-9_-]` only
3. The HTML string is written to disk:
   ```
   DEMO_DIR/{safeId}.html
   ```
4. A history entry `{ id, businessName, niche, outputLang, demoUrl, createdAt }` is prepended to `history.json`
5. Response to client: `{ html, json, id }` — the full HTML is also returned in-response for immediate preview

---

## 2. How GET /demo/:id retrieves it

**Lines 92–110 of server.js**

1. The `:id` param is sanitized to `[a-zA-Z0-9_-]` only (path traversal guard)
2. Resolves `DEMO_DIR/{id}.html` and verifies the resolved path stays inside `DEMO_DIR` (double-check against `../` attacks)
3. If file exists → `res.sendFile(resolved)` — serves the raw HTML file directly
4. If not found → 404

---

## 3. Storage type

| Layer | Mechanism |
|-------|-----------|
| Demo HTML files | **Filesystem** — `DEMO_DIR = DATA_DIR/demos/` |
| History index | **Filesystem** — `HISTORY_FILE = DATA_DIR/history.json` |
| In-memory cache | **None** — every read/write hits disk directly |
| External database | **None** — no DB, no S3, no KV |

Storage path resolution (server.js lines 33–35):
```js
const DATA_DIR   = process.env.DATA_DIR || '/app/data'
const DEMO_DIR   = path.join(DATA_DIR, 'demos')
const HISTORY_FILE = path.join(DATA_DIR, 'history.json')
```

---

## 4. Is storage persistent across restarts?

### Short answer: **Only if a Railway Volume is mounted at `/app/data`**

| Scenario | Persistent? | Why |
|----------|-------------|-----|
| Local dev (Windows) | Yes — until you delete it | `DATA_DIR` falls back to `/app/data`; on Windows this resolves locally and stays |
| Railway — **without Volume** | ❌ NO | Railway containers are ephemeral. Each redeploy = fresh container = `/app/data` doesn't exist → `mkdirSync` creates an empty one → all demos and history lost |
| Railway — **with Volume mounted at `/app/data`** | ✅ YES | Volume persists across restarts and redeploys |

### The `DEPLOY_CHECKLIST.md` already notes this (line ~20):
> `demo-storage/` is ephemeral on Railway (cleared on redeploy). For persistence, use Railway Volume or external storage.

---

## 5. Current status on Railway

- `ANTHROPIC_API_KEY` — **NOT SET** (known blocker from audit)
- `APP_API_KEY` — **NOT SET** (server runs in open dev mode without it)
- Railway Volume — **NOT CONFIRMED mounted** (storage is likely ephemeral right now)

---

## 6. What needs to happen before storage is reliable on Railway

1. **Set env vars** in Railway dashboard → Variables:
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `APP_API_KEY=<random 32-char string>`

2. **Add Railway Volume** → Storage → Add Volume → mount path: `/app/data`
   - Without this, every redeploy wipes all generated demos and history

3. **Optional**: set `DATA_DIR` env var if you want a different mount path (default `/app/data` is fine)

---

*Stop — audit complete.*
