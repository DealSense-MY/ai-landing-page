# PHASE_8_SECURITY.md
# Nexus Landing Engine — Phase 8: Security Fix
# Run: claude "Read MEMORY.md then execute PHASE_8_SECURITY.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 8 is DONE, stop immediately and tell user.
Confirm PHASE 7 is DONE before proceeding.
Read server.js and public/index.html before changes.

---

## CONTEXT
Current issue: apiService.js reads window._appApiKey but nothing sets it.
In dev mode (no APP_API_KEY env var) this is fine.
In production, the server must inject the key into index.html at serve time.

---

## TASK 1 — SERVER-SIDE KEY INJECTION (server.js)

Find the route that serves public/index.html (GET /).
Instead of serving as static file, read the file and inject the key:

```javascript
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // Inject app API key before </head>
  const appApiKey = process.env.APP_API_KEY || '';
  const injection = `<script>window._appApiKey = "${appApiKey}";</script>`;
  html = html.replace('</head>', injection + '</head>');

  res.send(html);
});
```

IMPORTANT: This route must come BEFORE express.static() middleware.
If static middleware is catching GET / first, reorder so this route is first.

---

## TASK 2 — VERIFY apiService.js

Check that apiService.js reads window._appApiKey and sends it as x-api-key header.
If not already done, add:

```javascript
const headers = {
  'Content-Type': 'application/json',
};

if (window._appApiKey) {
  headers['x-api-key'] = window._appApiKey;
}
```

---

## TASK 3 — VERIFY server.js MIDDLEWARE

Confirm requireApiKey middleware on POST /generate:
- If APP_API_KEY env var is set: check x-api-key header matches
- If APP_API_KEY not set: pass through (dev mode)
- Return 401 JSON if wrong: { error: 'Unauthorized' }

If not present, add it.

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 8 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 8 — security fix, api key injection"
3. Report: tasks completed, confirm key injection works
4. Stop and wait for instructions.
