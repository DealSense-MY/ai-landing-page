# PHASE_7_HISTORY.md
# Nexus Landing Engine — Phase 7: History Panel + Railway Volume
# Run: claude "Read MEMORY.md then execute PHASE_7_HISTORY.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 7 is DONE, stop immediately and tell user.
Confirm PHASE 6 is DONE before proceeding.
Read server.js, public/index.html, public/js/stateManager.js before changes.

---

## CONTEXT
Railway ephemeral storage wipes files on redeploy.
This phase moves demo-storage/ to a persistent path and adds History panel.

PERSISTENT STORAGE PATH: /app/data/
- /app/data/demos/        ← all generated demo HTML files
- /app/data/history.json  ← history index

Railway Volume must be mounted at /app/data before this works.
NOTE TO DEVELOPER: After this phase, go to Railway dashboard →
Service → Settings → Volumes → Add Volume → Mount path: /app/data

---

## TASK 1 — UPDATE server.js: STORAGE PATHS

Find all references to demo-storage/ directory.
Replace with persistent path logic:

```javascript
const DATA_DIR = process.env.DATA_DIR || '/app/data';
const DEMO_DIR = path.join(DATA_DIR, 'demos');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Ensure directories exist on startup
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DEMO_DIR)) fs.mkdirSync(DEMO_DIR, { recursive: true });
```

Update all demo file read/write operations to use DEMO_DIR.

---

## TASK 2 — UPDATE server.js: HISTORY TRACKING

After every successful POST /generate:
1. Read existing history.json (or create empty array if not exists)
2. Add new entry:
```javascript
{
  id: demoId,           // nanoid generated
  businessName: data.businessName,
  niche: data.niche,
  outputLang: data.outputLang,
  demoUrl: `/demo/${demoId}`,
  createdAt: new Date().toISOString()
}
```
3. Prepend to array (newest first)
4. Write back to history.json

Add new API endpoints:

GET /history
- Read history.json
- Return JSON array
- Return [] if file not exists

DELETE /history/:id
- Read history.json
- Remove entry with matching id
- Delete demo HTML file from DEMO_DIR
- Write updated history.json
- Return { success: true }

---

## TASK 3 — ADD HISTORY TAB (public/index.html)

Add third tab to mobile tab bar AND desktop layout:

```html
<button class="mobile-tab" id="tab-history"
  onclick="setMobileTab('history')">
  🕐 <span data-i18n="tab_history">History</span>
</button>
```

Add i18n: tab_history — EN: "History" / BM: "Sejarah"

Add history panel div (hidden by default):

```html
<div id="history-panel" class="history-panel" style="display:none;">
  <div class="history-header">
    <h3 data-i18n="history_title">Generated Pages</h3>
    <button onclick="loadHistory()" class="refresh-btn">🔄</button>
  </div>
  <div id="history-list" class="history-list">
    <p class="history-empty">Loading...</p>
  </div>
</div>
```

CSS for history panel:
- Same width as form panel (left panel)
- Scrollable, padding 16px
- history-list: flex column, gap 12px

Each history entry rendered as:
```html
<div class="history-entry">
  <div class="history-info">
    <span class="history-name">[businessName]</span>
    <span class="history-meta">[niche] · [date formatted]</span>
  </div>
  <div class="history-actions">
    <button onclick="copyHistoryUrl('[demoUrl]')" class="btn-copy">📋</button>
    <button onclick="viewHistoryUrl('[demoUrl]')" class="btn-view">👁</button>
    <button onclick="deleteHistory('[id]')" class="btn-delete">🗑</button>
  </div>
</div>
```

CSS for history-entry:
- display: flex, justify-content: space-between, align-items: center
- padding: 12px, border-radius: 8px
- background: var(--bg-secondary)
- history-name: font-weight bold, font-size 14px
- history-meta: muted color, font-size 12px
- history-actions: display flex, gap 8px
- action buttons: small, icon only, 32px square

---

## TASK 4 — ADD HISTORY JS (public/index.html or new file)

Add these functions:

```javascript
async function loadHistory() {
  const res = await fetch('/history');
  const entries = await res.json();
  const list = document.getElementById('history-list');

  if (entries.length === 0) {
    list.innerHTML = '<p class="history-empty">No pages generated yet.</p>';
    return;
  }

  list.innerHTML = entries.map(e => `
    <div class="history-entry">
      <div class="history-info">
        <span class="history-name">${escapeHTML(e.businessName)}</span>
        <span class="history-meta">${e.niche} · ${formatDate(e.createdAt)}</span>
      </div>
      <div class="history-actions">
        <button onclick="copyHistoryUrl('${e.demoUrl}')" class="btn-copy" title="Copy URL">📋</button>
        <button onclick="viewHistoryUrl('${e.demoUrl}')" class="btn-view" title="View">👁</button>
        <button onclick="deleteHistory('${e.id}')" class="btn-delete" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

function copyHistoryUrl(demoUrl) {
  const full = window.location.origin + demoUrl;
  navigator.clipboard.writeText(full).then(() => {
    showToast('URL copied!');
  });
}

function viewHistoryUrl(demoUrl) {
  window.open(demoUrl, '_blank');
}

async function deleteHistory(id) {
  if (!confirm('Delete this page?')) return;
  await fetch(`/history/${id}`, { method: 'DELETE' });
  loadHistory();
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}
```

Call loadHistory() when tab-history is clicked.

---

## TASK 5 — UPDATE setMobileTab() FOR HISTORY

In setMobileTab function, add history panel handling:

```javascript
const historyPanel = document.getElementById('history-panel');

if (tab === 'history') {
  formPanel.style.display = 'none';
  previewPanel.style.display = 'none';
  historyPanel.style.display = 'block';
  stickyGenerate.style.display = 'none';
  loadHistory(); // auto-load when tab opens
} else {
  historyPanel.style.display = 'none';
  // existing form/preview logic
}
```

Also update desktop layout — history panel accessible via tab or sidebar button.

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 7 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 7 — history panel + persistent storage"
3. Report:
   - All tasks completed
   - IMPORTANT: Remind user to set up Railway Volume:
     Railway Dashboard → Service web → Settings → Volumes
     → Add Volume → Mount path: /app/data
4. Stop and wait for instructions.
