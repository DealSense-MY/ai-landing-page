# SPRINT_CF_MIGRATION.md
# Cloudflare Migration — Audit & Plan Only
# Run: claude "Execute sprints/SPRINT_CF_MIGRATION.md"

## RULES
- READ ONLY audit first
- No code modification yet
- No file deletion
- Report only

---

## PHASE 1 — AUDIT CURRENT STRUCTURE

Read these files completely:
1. server.js
2. pipeline/normalize.js
3. pipeline/generate.js
4. pipeline/buildHTML.js
5. public/index.html
6. public/js/stateManager.js
7. package.json
8. railway.json (if exists)

For each file, identify:
- Does it use Express? Which routes?
- Does it use Node.js built-ins (fs, path, crypto)?
- Does it use environment variables?
- Can it run in Cloudflare Worker (V8 isolate, no Node.js)?

## PHASE 2 — CLASSIFY FILES

Classify every file as:
- CLOUDFLARE_PAGES_READY — static, no server needed
- WORKER_REFACTOR_NEEDED — uses Node.js/Express, must rewrite
- KEEP_AS_IS — pure logic, portable

Output table:
| File | Classification | Reason |
|------|---------------|--------|

## PHASE 3 — PROPOSED CF STRUCTURE

Propose this structure:
```
nexus-landing-engine-cf/
├── public/                    ← Cloudflare Pages (static)
│   ├── index.html
│   ├── js/
│   └── assets/
├── functions/                 ← Cloudflare Pages Functions
│   └── api/
│       └── generate.js        ← POST /generate handler
├── wrangler.toml              ← CF config
└── package.json
```

## PHASE 4 — IDENTIFY GAPS

List exactly what needs to change for Worker:
- Express routes → CF fetch handler
- Any Node.js APIs that don't exist in V8 isolate
- Environment variables needed
- Demo storage strategy (KV? R2? URL param?)

## OUTPUT
Write full report to: sprints/CF_MIGRATION_PLAN.md

Structure:
1. Railway-dependent parts (must refactor)
2. Cloudflare Pages ready files (deploy as-is)
3. Worker refactor requirements (exact changes)
4. Proposed folder structure
5. Environment variables list
6. Migration steps (numbered)
7. Risk list
8. Recommended next action

STOP — show plan, wait for approval before any code change.