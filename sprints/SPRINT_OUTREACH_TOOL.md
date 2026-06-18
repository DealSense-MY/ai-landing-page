# SPRINT_OUTREACH_TOOL.md
# DealSense — Build: Semi-Auto Outreach Approval Dashboard (MVP)
# Run: claude "Execute sprints/SPRINT_OUTREACH_TOOL.md"

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

---

## CONSTRAINTS — WAJIB IKUT
- DO NOT touch Railway, Cloudflare, atau production files
- DO NOT contact any business automatically
- DO NOT use unofficial WhatsApp automation atau spam tools
- DO NOT send any DM automatically — human approval WAJIB
- DO NOT delete old folders
- DO NOT require Anthropic API key
- Build dalam folder baru sahaja: tools/semi-auto-outreach

---

## PHASE 1 — INSPECT FOLDER

Check sama ada folder `tools` sudah wujud dalam project root:
```
dir tools
```

Report:
- Adakah folder `tools` wujud?
- Adakah folder `tools/semi-auto-outreach` dah ada?
- Adakah ada konflik dengan file lain?

Jangan ubah apa-apa lagi.
STOP — tunggu "continue".

---

## PHASE 2 — BUILD MVP FILES

Buat folder dan semua files berikut dalam:
`tools/semi-auto-outreach/`

---

### FILE 1: package.json

```json
{
  "name": "dealsense-approval-sender-lite",
  "version": "1.0.0",
  "description": "DealSense Semi-Auto Outreach Approval Dashboard — local tool only",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

### FILE 2: server.js

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3777;

const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');
const LOG_FILE = path.join(__dirname, 'data', 'outreach-log.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data files exist
function ensureDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
  }
}

// GET all leads
app.get('/api/leads', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: 'Cannot read leads.json' });
  }
});

// PATCH lead status + log entry
app.patch('/api/leads/:id', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const { status, approvedMessage, reply } = req.body;
    if (status) leads[idx].status = status;
    if (approvedMessage) leads[idx].lastApprovedMessage = approvedMessage;

    // Write log entry
    log.push({
      timestamp: new Date().toISOString(),
      leadId: req.params.id,
      businessName: leads[idx].businessName,
      action: status,
      message: approvedMessage || null,
      reply: reply || null
    });

    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
    res.json({ ok: true, lead: leads[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

ensureDataFiles();
app.listen(PORT, () => {
  console.log(`\n✅ DealSense Approval Sender Lite`);
  console.log(`📋 Dashboard: http://localhost:${PORT}`);
  console.log(`⚠  Human approval required before any message is sent.\n`);
});
```

---

### FILE 3: data/leads.json

```json
[
  {
    "id": "zira-beauty-spa-ipoh",
    "businessName": "Zira Beauty Spa",
    "location": "Ipoh",
    "niche": "Beauty Spa / Facial",
    "platform": "UNKNOWN",
    "contactMethod": "UNKNOWN",
    "whatsappNumber": "",
    "profileUrl": "",
    "weakness": "Promo/pakej ada dalam post, tapi tiada page booking jelas",
    "offerAngle": "Page Booking WhatsApp / Mini Website Booking WhatsApp RM350",
    "previewPath": "C:\\Users\\Selina\\.claude\\DealSense\\07_NexusLandingEngine\\DEMOS\\zira-beauty-spa-ipoh\\zira-beauty-spa-ipoh-preview.html",
    "screenshotPath": "",
    "status": "PREVIEW_READY",
    "defaultDm": "Hi Zira Beauty Spa, saya Aliff.\n\nSaya ada buat satu preview ringkas untuk Zira — page booking WhatsApp yang susun servis, pakej, info utama dan button WhatsApp dalam satu page.\n\nSaya perasan sekarang customer mungkin perlu scroll post untuk cari info/pakej. Jadi saya cuba susun jadi satu page yang lebih mudah untuk customer tengok sebelum tanya slot.\n\nIni cuma preview, belum publish public.\n\nBoleh saya tunjuk screenshot preview?"
  }
]
```

---

### FILE 4: data/outreach-log.json

```json
[]
```

---

### FILE 5: public/style.css

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.safety-banner {
  background: #dc2626;
  color: #fff;
  text-align: center;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header {
  background: #1e293b;
  padding: 16px 24px;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header h1 {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
}

.app-header .badge {
  background: #0ea5e9;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}

.leads-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.lead-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
}

.lead-card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.lead-card-header h2 {
  font-size: 17px;
  font-weight: 700;
  color: #f1f5f9;
}

.status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.status-NEW { background: #334155; color: #94a3b8; }
.status-PREVIEW_READY { background: #0c4a6e; color: #7dd3fc; }
.status-APPROVED_TO_SEND, .status-APPROVED_EDITED_TO_SEND { background: #14532d; color: #86efac; }
.status-SENT_MANUAL_CONFIRMATION_NEEDED { background: #713f12; color: #fde68a; }
.status-REPLIED { background: #1e3a5f; color: #93c5fd; }
.status-FOLLOW_UP_NEEDED { background: #451a03; color: #fdba74; }
.status-REJECTED_NEEDS_REWORK { background: #450a0a; color: #fca5a5; }
.status-CLOSED_WON { background: #052e16; color: #4ade80; }
.status-CLOSED_LOST { background: #1c1917; color: #78716c; }

.lead-meta {
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  border-bottom: 1px solid #334155;
}

@media (max-width: 600px) {
  .lead-meta { grid-template-columns: 1fr; }
}

.meta-item label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}

.meta-item span {
  font-size: 14px;
  color: #cbd5e1;
}

.meta-item span.unknown {
  color: #ef4444;
  font-style: italic;
}

.preview-path-row {
  padding: 12px 20px;
  background: #0f172a;
  border-bottom: 1px solid #334155;
  font-size: 12px;
  color: #64748b;
  word-break: break-all;
}

.preview-path-row strong { color: #94a3b8; }

.dm-panel {
  padding: 20px;
  border-bottom: 1px solid #334155;
}

.dm-panel label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.dm-textarea {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 160px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.dm-textarea:focus { outline: none; border-color: #0ea5e9; }
.dm-textarea[readonly] { opacity: 0.75; cursor: default; }

.char-count {
  font-size: 11px;
  color: #64748b;
  margin-top: 6px;
  text-align: right;
}

.action-bar {
  padding: 16px 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.3px;
}

.btn:hover { opacity: 0.85; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn-yes { background: #16a34a; color: #fff; }
.btn-edit { background: #d97706; color: #fff; }
.btn-ok { background: #0ea5e9; color: #fff; display: none; }
.btn-no { background: #334155; color: #94a3b8; }
.btn-replied { background: #1e3a5f; color: #93c5fd; border: 1px solid #334155; }
.btn-followup { background: #1e293b; color: #94a3b8; border: 1px solid #334155; }

.feedback-box {
  margin: 0 20px 16px;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  display: none;
}

.feedback-success { background: #052e16; border: 1px solid #14532d; color: #86efac; }
.feedback-warning { background: #451a03; border: 1px solid #92400e; color: #fde68a; }
.feedback-error { background: #450a0a; border: 1px solid #991b1b; color: #fca5a5; }
.feedback-info { background: #0c4a6e; border: 1px solid #075985; color: #7dd3fc; }

.reply-input-box {
  margin: 0 20px 16px;
  display: none;
}

.reply-input-box textarea {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.reply-input-box label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-save-reply {
  margin-top: 8px;
  background: #1e3a5f;
  color: #93c5fd;
  border: 1px solid #334155;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #475569;
}

.empty-state h2 { font-size: 18px; margin-bottom: 8px; }
.empty-state p { font-size: 14px; }
```

---

### FILE 6: public/index.html

```html
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DealSense Approval Sender Lite</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="safety-banner">
  ⚠ HUMAN APPROVAL REQUIRED — This tool only prepares and opens messages. It does NOT silently send anything.
</div>

<header class="app-header">
  <h1>DealSense Approval Sender Lite</h1>
  <span class="badge">LOCAL ONLY</span>
</header>

<main class="container">
  <div class="leads-grid" id="leads-grid">
    <div class="empty-state">
      <h2>Loading leads...</h2>
      <p>Connecting to local server on port 3777.</p>
    </div>
  </div>
</main>

<script src="app.js"></script>
</body>
</html>
```

---

### FILE 7: public/app.js

```javascript
const STATUSES = [
  'NEW','PREVIEW_READY','APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND',
  'SENT_MANUAL_CONFIRMATION_NEEDED','REPLIED','FOLLOW_UP_NEEDED',
  'REJECTED_NEEDS_REWORK','CLOSED_WON','CLOSED_LOST'
];

async function loadLeads() {
  try {
    const res = await fetch('/api/leads');
    const leads = await res.json();
    renderLeads(leads);
  } catch (e) {
    document.getElementById('leads-grid').innerHTML = `
      <div class="empty-state">
        <h2>⚠ Cannot connect to server</h2>
        <p>Pastikan server running: <strong>npm start</strong> dalam folder tools/semi-auto-outreach</p>
      </div>`;
  }
}

function renderLeads(leads) {
  const grid = document.getElementById('leads-grid');
  if (!leads.length) {
    grid.innerHTML = `<div class="empty-state"><h2>No leads yet</h2><p>Add leads in data/leads.json</p></div>`;
    return;
  }
  grid.innerHTML = leads.map(lead => buildLeadCard(lead)).join('');
  leads.forEach(lead => attachEvents(lead));
}

function buildLeadCard(l) {
  const dm = l.defaultDm || '';
  const statusClass = 'status-' + (l.status || 'NEW').replace(/_/g,'-').replace(/([A-Z])/g,'-$1').replace(/^-/,'').toUpperCase();
  // simpler: just use status as-is for class
  const sc = 'status-' + l.status;
  return `
  <div class="lead-card" id="card-${l.id}">
    <div class="lead-card-header">
      <h2>📋 ${l.businessName}</h2>
      <span class="status-badge ${sc}" id="badge-${l.id}">${l.status}</span>
    </div>

    <div class="lead-meta">
      <div class="meta-item"><label>Lokasi</label><span>${l.location || '—'}</span></div>
      <div class="meta-item"><label>Niche</label><span>${l.niche || '—'}</span></div>
      <div class="meta-item"><label>Platform</label><span class="${!l.platform || l.platform==='UNKNOWN' ? 'unknown':''}">${l.platform || 'UNKNOWN'}</span></div>
      <div class="meta-item"><label>Contact</label><span class="${!l.contactMethod || l.contactMethod==='UNKNOWN' ? 'unknown':''}">${l.contactMethod || 'UNKNOWN'}</span></div>
      <div class="meta-item"><label>WhatsApp</label><span class="${!l.whatsappNumber ? 'unknown':''}">${l.whatsappNumber || 'Belum ada'}</span></div>
      <div class="meta-item"><label>Profile URL</label><span class="${!l.profileUrl ? 'unknown':''}">${l.profileUrl || 'Belum ada'}</span></div>
      <div class="meta-item"><label>Kelemahan</label><span>${l.weakness || '—'}</span></div>
      <div class="meta-item"><label>Offer</label><span>${l.offerAngle || '—'}</span></div>
    </div>

    <div class="preview-path-row">
      <strong>Preview:</strong> ${l.previewPath || 'Tiada'} &nbsp;|&nbsp;
      <strong>Screenshot:</strong> ${l.screenshotPath || 'Tiada'}
    </div>

    <div class="dm-panel">
      <label>✏️ DM Draft — edit sebelum approve</label>
      <textarea class="dm-textarea" id="dm-${l.id}" readonly>${dm}</textarea>
      <div class="char-count" id="cc-${l.id}">${dm.length} chars</div>
    </div>

    <div class="action-bar">
      <button class="btn btn-yes" onclick="handleYes('${l.id}')">✅ YES — Approve & Open</button>
      <button class="btn btn-edit" onclick="handleEdit('${l.id}')">✏️ EDIT</button>
      <button class="btn btn-ok" id="btn-ok-${l.id}" onclick="handleOk('${l.id}')">✅ OK — Save & Open</button>
      <button class="btn btn-no" onclick="handleNo('${l.id}')">❌ NO</button>
      <button class="btn btn-replied" onclick="handleReplied('${l.id}')">💬 Mark Replied</button>
      <button class="btn btn-followup" onclick="handleFollowUp('${l.id}')">🔄 Follow-Up Draft</button>
    </div>

    <div class="feedback-box" id="fb-${l.id}"></div>

    <div class="reply-input-box" id="reply-box-${l.id}">
      <label>Paste reply dari client:</label>
      <textarea id="reply-text-${l.id}" placeholder="Paste reply di sini..."></textarea>
      <button class="btn-save-reply" onclick="saveReply('${l.id}')">Simpan Reply</button>
    </div>
  </div>`;
}

function attachEvents(lead) {
  const ta = document.getElementById('dm-' + lead.id);
  const cc = document.getElementById('cc-' + lead.id);
  if (ta && cc) {
    ta.addEventListener('input', () => { cc.textContent = ta.value.length + ' chars'; });
  }
}

function showFeedback(id, type, msg) {
  const fb = document.getElementById('fb-' + id);
  fb.className = 'feedback-box feedback-' + type;
  fb.innerHTML = msg;
  fb.style.display = 'block';
}

async function patchLead(id, body) {
  const res = await fetch('/api/leads/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

function getLeadData(id) {
  // Re-read from DOM (lead card fields)
  return {
    whatsappNumber: document.querySelector(`#card-${id} .meta-item:nth-child(5) span`)?.textContent?.trim(),
    profileUrl: document.querySelector(`#card-${id} .meta-item:nth-child(6) span`)?.textContent?.trim(),
    businessName: document.querySelector(`#card-${id} .lead-card-header h2`)?.textContent?.replace('📋 ','').trim()
  };
}

async function openContact(id, message) {
  // Get lead from server for fresh data
  const res = await fetch('/api/leads');
  const leads = await res.json();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;

  const wa = lead.whatsappNumber;
  const url = lead.profileUrl;

  if (wa && wa !== 'Belum ada' && wa.trim() !== '') {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${wa}?text=${encoded}`, '_blank');
    showFeedback(id, 'success', `✅ WhatsApp dibuka untuk ${lead.businessName}. <strong>Kau yang tekan send.</strong>`);
  } else if (url && url !== 'Belum ada' && url.trim() !== '') {
    try { await navigator.clipboard.writeText(message); } catch(e) {}
    window.open(url, '_blank');
    showFeedback(id, 'warning', `⚠ Nombor WA tiada. Message disalin ke clipboard. Profile/page dibuka — <strong>paste dan hantar sendiri.</strong>`);
  } else {
    showFeedback(id, 'error', `⛔ CONTACT UNKNOWN — HUMAN INPUT REQUIRED. Tambah whatsappNumber atau profileUrl dalam leads.json dulu.`);
  }
}

async function handleYes(id) {
  const msg = document.getElementById('dm-' + id).value;
  await patchLead(id, { status: 'APPROVED_TO_SEND', approvedMessage: msg });
  document.getElementById('badge-' + id).textContent = 'APPROVED_TO_SEND';
  document.getElementById('badge-' + id).className = 'status-badge status-APPROVED_TO_SEND';
  await openContact(id, msg);
}

function handleEdit(id) {
  const ta = document.getElementById('dm-' + id);
  ta.removeAttribute('readonly');
  ta.focus();
  document.getElementById('btn-ok-' + id).style.display = 'inline-block';
  showFeedback(id, 'info', '✏️ Edit mode aktif. Ubah message, lepas tu tekan OK.');
}

async function handleOk(id) {
  const msg = document.getElementById('dm-' + id).value;
  document.getElementById('dm-' + id).setAttribute('readonly', true);
  document.getElementById('btn-ok-' + id).style.display = 'none';
  await patchLead(id, { status: 'APPROVED_EDITED_TO_SEND', approvedMessage: msg });
  document.getElementById('badge-' + id).textContent = 'APPROVED_EDITED_TO_SEND';
  document.getElementById('badge-' + id).className = 'status-badge status-APPROVED_EDITED_TO_SEND';
  await openContact(id, msg);
}

async function handleNo(id) {
  await patchLead(id, { status: 'REJECTED_NEEDS_REWORK' });
  document.getElementById('badge-' + id).textContent = 'REJECTED_NEEDS_REWORK';
  document.getElementById('badge-' + id).className = 'status-badge status-REJECTED_NEEDS_REWORK';
  showFeedback(id, 'warning', '❌ Lead ditanda REJECTED. Cadangan: tukar angle DM atau pilih lead lain.');
}

async function handleReplied(id) {
  await patchLead(id, { status: 'REPLIED' });
  document.getElementById('badge-' + id).textContent = 'REPLIED';
  document.getElementById('badge-' + id).className = 'status-badge status-REPLIED';
  document.getElementById('reply-box-' + id).style.display = 'block';
  showFeedback(id, 'success', '💬 Status ditukar ke REPLIED. Paste reply dari client di bawah.');
}

async function saveReply(id) {
  const reply = document.getElementById('reply-text-' + id).value;
  await patchLead(id, { reply });
  showFeedback(id, 'success', '✅ Reply disimpan dalam outreach-log.json.');
}

function handleFollowUp(id) {
  const res = fetch('/api/leads');
  res.then(r => r.json()).then(leads => {
    const lead = leads.find(l => l.id === id);
    const name = lead ? lead.businessName : 'business ini';
    const followUpMsg = `Hi, saya follow up saja tentang preview page booking WhatsApp yang saya buat untuk ${name}. Kalau owner nak tengok, saya boleh share screenshot dulu.`;
    document.getElementById('dm-' + id).value = followUpMsg;
    document.getElementById('dm-' + id).removeAttribute('readonly');
    document.getElementById('btn-ok-' + id).style.display = 'inline-block';
    document.getElementById('cc-' + id).textContent = followUpMsg.length + ' chars';
    showFeedback(id, 'info', '🔄 Follow-up draft diisi. Edit kalau perlu, lepas tu tekan OK.');
  });
}

loadLeads();
```

---

### FILE 8: README.md

```markdown
# DealSense Approval Sender Lite

Local dashboard untuk Aliff approve dan hantar outreach DM ke prospects.
**Ini bukan automation. Semua hantar kena human approval dulu.**

---

## Install

```bash
cd tools/semi-auto-outreach
npm install
```

## Run

```bash
npm start
```

Buka browser: **http://localhost:3777**

---

## Flow

1. Dashboard tunjuk lead cards
2. Baca DM draft yang dah ada
3. Pilih:
   - **YES** → Approve dan buka WhatsApp/copy untuk FB
   - **EDIT** → Edit message dulu, pastu **OK** untuk approve
   - **NO** → Reject, DM tak dihantar
4. Bila dapat reply → tekan **Mark Replied**, paste reply
5. Nak follow up → tekan **Follow-Up Draft**, edit, OK

---

## Apa tool ni TIDAK buat

- ❌ Tidak hantar message secara automatik
- ❌ Tidak guna WhatsApp unofficial API
- ❌ Tidak spam
- ❌ Tidak sentuh Railway / Cloudflare
- ❌ Tidak require internet (kecuali buka wa.me)

---

## Tambah Lead Baru

Edit `data/leads.json`, tambah object baru:

```json
{
  "id": "nama-business-lowercase-dash",
  "businessName": "Nama Business",
  "location": "Ipoh",
  "niche": "Niche",
  "platform": "Instagram",
  "contactMethod": "WhatsApp",
  "whatsappNumber": "601XXXXXXXXX",
  "profileUrl": "https://instagram.com/handle",
  "weakness": "Describe kelemahan",
  "offerAngle": "Offer angle",
  "previewPath": "path\\to\\preview.html",
  "screenshotPath": "",
  "status": "PREVIEW_READY",
  "defaultDm": "Hi [Business], saya Aliff..."
}
```

Restart server selepas edit.

---

## Data Files

- `data/leads.json` — semua leads
- `data/outreach-log.json` — log setiap action (auto-updated)
```

---

STOP — tunggu "continue".

---

## PHASE 3 — SYNTAX CHECK + DEPENDENCY REPORT

Selepas semua files dibuat:

1. Run syntax check untuk server.js:
```bash
node --check tools/semi-auto-outreach/server.js
```

2. Check sama ada express dah install:
```bash
ls tools/semi-auto-outreach/node_modules/express
```

Jika express TIDAK ada, jangan run npm install — report je:
```
⚠ Dependencies missing. Aliff perlu run:
cd tools/semi-auto-outreach
npm install
```

Jika express ada, cuba start server:
```bash
cd tools/semi-auto-outreach && node server.js &
```
Tunggu 2 saat, test:
```bash
curl -s http://localhost:3777/api/leads
```
Kill server selepas test.

STOP — tunggu "continue".

---

## PHASE 4 — FINAL REPORT

Report dalam format ini:

```
✅ FILES CREATED:
   tools/semi-auto-outreach/package.json
   tools/semi-auto-outreach/server.js
   tools/semi-auto-outreach/public/index.html
   tools/semi-auto-outreach/public/app.js
   tools/semi-auto-outreach/public/style.css
   tools/semi-auto-outreach/data/leads.json
   tools/semi-auto-outreach/data/outreach-log.json
   tools/semi-auto-outreach/README.md

🚀 HOW TO RUN:
   cd tools/semi-auto-outreach
   npm install   ← (jika belum)
   npm start
   Buka: http://localhost:3777

✅ WHAT WORKS:
   [list features yang confirmed working]

⚠ HUMAN ACTION REQUIRED:
   1. npm install jika belum
   2. Tambah nombor WA Zira dalam leads.json (field: whatsappNumber)
   3. Ambil screenshot preview Zira untuk dihantar ke client

📋 NEXT STEP UNTUK ZIRA:
   1. Buka preview HTML → screenshot mobile view
   2. Letak screenshot path dalam leads.json (field: screenshotPath)
   3. Tambah WA number Zira dalam leads.json
   4. Buka dashboard → tekan YES atau EDIT → WA akan dibuka dengan message
   5. Kau yang tekan send dalam WA
```

STOP — done.
