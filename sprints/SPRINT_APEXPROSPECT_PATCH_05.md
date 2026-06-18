# SPRINT_APEXPROSPECT_PATCH_05.md
# ApexProspect Patch 5: Batch Import + Safe Audit Editor
# Run: claude "Read sprints/MEMORY.md then execute sprints/SPRINT_APEXPROSPECT_PATCH_05.md"

## INSTRUCTION
Execute phase by phase.
After each phase: commit, push, report, then STOP.
Wait for "continue" before next phase.

## PRE-CHECK
Read these files before starting:
1. tools/semi-auto-outreach/server.js
2. tools/semi-auto-outreach/data/leads.json
3. tools/semi-auto-outreach/public/app.js
4. tools/semi-auto-outreach/public/index.html
5. tools/semi-auto-outreach/public/style.css

Report:
- [ ] server.js exists and has POST/PATCH routes?
- [ ] leads.json has Zira lead intact?
- [ ] Port 3777 in server.js?
- [ ] No existing import endpoint?

Do NOT modify. Just inspect.
STOP — wait for "continue".

---

## PHASE 1 — ADD BATCH IMPORT ENDPOINT

In `tools/semi-auto-outreach/server.js`:

Find line: `app.patch('/api/leads/:id',`

Before this line, add these helper functions (after `ensureDataFiles()`):

```javascript
function validateProspect(p, index) {
  const errors = [];
  
  if (!p.businessName || typeof p.businessName !== 'string' || p.businessName.trim() === '') {
    errors.push('businessName required');
  }
  if (!p.lokasi || typeof p.lokasi !== 'string' || p.lokasi.trim() === '') {
    errors.push('lokasi required');
  }
  if (!p.whatsapp || typeof p.whatsapp !== 'string' || p.whatsapp.trim() === '') {
    errors.push('whatsapp required');
  }
  
  const waClean = p.whatsapp.replace(/[^0-9+]/g, '');
  if (waClean.length < 10) {
    errors.push('whatsapp must be 10+ digits');
  }
  
  if (!p.niche || p.niche.trim() === '') {
    errors.push('niche recommended');
  }
  if (!p.defaultDm || p.defaultDm.trim() === '') {
    errors.push('defaultDm recommended');
  }
  
  return { valid: errors.length === 0, errors };
}

function generateLeadId(businessName, lokasi) {
  const clean = (str) => str.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${clean(businessName)}-${clean(lokasi)}`;
}

function normalizeImportedProspect(p) {
  const id = generateLeadId(p.businessName, p.lokasi);
  return {
    id,
    businessName: p.businessName.trim(),
    lokasi: p.lokasi.trim(),
    niche: p.niche?.trim() || 'Umum',
    platform: p.platform?.trim() || 'UNKNOWN',
    contact: p.contact?.trim() || 'UNKNOWN',
    whatsapp: p.whatsapp.replace(/[^0-9]/g, '').slice(-10),
    profileUrl: p.profileUrl?.trim() || '',
    kelemahan: p.kelemahan?.trim() || '',
    offer: 'Page Booking WhatsApp / Mini Website Booking WhatsApp RM350',
    defaultDm: p.defaultDm?.trim() || '',
    followUpDraft: p.followUpDraft?.trim() || '',
    replyText: '',
    responseNotes: '',
    previewPath: '',
    previewStatus: 'NOT_BUILT',
    screenshotPath: '',
    prospectStatus: 'NEW',
    dealStatus: 'OPEN',
    replyStatus: 'NO_REPLY',
    dateAdded: new Date().toISOString(),
    approvedAt: '',
    contactedAt: '',
    repliedAt: '',
    closedAt: '',
    fitScore: 0,
    priority: '',
    auditNotes: '',
    events: [{ 
      eventType: 'LEAD_IMPORTED',
      timestamp: new Date().toISOString(),
      note: 'Batch import via API'
    }],
    locked: false
  };
}
```

Then add this endpoint right before `app.patch('/api/leads/:id',`:

```javascript
// POST /api/leads/import/batch
// Batch import from AI agent (max 10 prospects)
app.post('/api/leads/import/batch', (req, res) => {
  try {
    const { prospects } = req.body;
    
    if (!Array.isArray(prospects)) {
      return res.status(400).json({ error: 'prospects must be array' });
    }
    if (prospects.length === 0) {
      return res.status(400).json({ error: 'prospects array empty' });
    }
    if (prospects.length > 10) {
      return res.status(400).json({ error: `max 10 prospects, got ${prospects.length}` });
    }
    
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const importLog = [];
    const duplicates = [];
    let imported = 0;
    
    prospects.forEach((p, idx) => {
      const validation = validateProspect(p, idx);
      
      if (!validation.valid) {
        importLog.push({
          index: idx,
          businessName: p.businessName || 'Unknown',
          status: 'REJECTED',
          reason: validation.errors.join('; ')
        });
        return;
      }
      
      const existing = leads.find(l => 
        (l.whatsapp && l.whatsapp === p.whatsapp) ||
        (l.businessName === p.businessName && l.lokasi === p.lokasi)
      );
      
      if (existing) {
        duplicates.push({
          newProspect: p.businessName,
          existingId: existing.id,
          duplicateType: existing.whatsapp === p.whatsapp ? 'WHATSAPP' : 'NAME_LOCATION'
        });
        importLog.push({
          index: idx,
          businessName: p.businessName,
          status: 'DUPLICATE_SKIPPED',
          existingId: existing.id
        });
        return;
      }
      
      const newLead = normalizeImportedProspect(p);
      leads.push(newLead);
      imported++;
      
      importLog.push({
        index: idx,
        businessName: newLead.businessName,
        status: 'IMPORTED',
        leadId: newLead.id
      });
    });
    
    if (imported > 0) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    }
    
    res.json({
      ok: true,
      imported,
      duplicates: duplicates.length,
      total: prospects.length,
      importLog,
      duplicates
    });
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

Commit: "feat: add batch import endpoint (POST /api/leads/import/batch)"
Push to GitHub.
Report:
- [ ] Endpoint added
- [ ] Validation functions work
- [ ] No syntax errors

STOP — wait for "continue".

---

## PHASE 2 — ADD IMPORT UI

In `tools/semi-auto-outreach/public/index.html`:

Find `<header class="app-header">` section.

Right after `</header>`, add:

```html
<!-- IMPORT MODAL -->
<div class="import-modal" id="import-modal" style="display:none;">
  <div class="modal-overlay" onclick="closeImportModal()"></div>
  <div class="modal-box">
    <h2>📥 Import Top 10 Prospects</h2>
    <p class="modal-subtitle">Paste JSON array from Alt (ChatGPT research agent)</p>
    
    <textarea 
      id="import-json" 
      placeholder='[{"businessName":"Zira Beauty","lokasi":"Ipoh","niche":"Beauty","whatsapp":"601234567890","defaultDm":"Hi Zira..."},{"businessName":"Fresh Spa","lokasi":"Ipoh","niche":"Spa","whatsapp":"601234567891","defaultDm":"Hi Fresh..."}]'
      style="width:100%; height:280px; font-size:11px; padding:12px; border:1px solid rgba(255,255,255,0.1); border-radius:8px; background:#0f172a; color:#e2e8f0; font-family:monospace; resize:vertical;"
    ></textarea>
    
    <div style="margin-top:14px; display:flex; gap:8px;">
      <button onclick="doImport()" style="flex:1; padding:10px; background:#16a34a; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-size:14px;">
        ✅ IMPORT
      </button>
      <button onclick="closeImportModal()" style="flex:1; padding:10px; background:#334155; color:#94a3b8; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-size:14px;">
        ❌ CANCEL
      </button>
    </div>
    
    <div id="import-result" style="margin-top:14px; display:none; padding:12px; border-radius:8px; font-size:12px;"></div>
  </div>
</div>

<!-- IMPORT TOOLBAR -->
<div style="background:#1e293b; padding:12px 24px; border-bottom:1px solid #334155; display:flex; gap:10px; align-items:center;">
  <button onclick="openImportModal()" style="padding:8px 16px; background:#0ea5e9; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; font-size:13px;">
    📥 IMPORT TOP 10
  </button>
  <span style="font-size:11px; color:#64748b;">Batch import JSON from research</span>
</div>
```

Commit: "feat: add import modal UI"
Push to GitHub.
Report:
- [ ] Modal HTML added
- [ ] Import button visible on page
- [ ] No rendering errors

STOP — wait for "continue".

---

## PHASE 3 — ADD IMPORT JS

In `tools/semi-auto-outreach/public/app.js`:

At the END of the file, before closing `</script>`, add:

```javascript
// IMPORT MODAL FUNCTIONS
function openImportModal() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'block';
}

function closeImportModal() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'none';
  const ta = document.getElementById('import-json');
  if (ta) ta.value = '';
  const result = document.getElementById('import-result');
  if (result) result.style.display = 'none';
}

async function doImport() {
  const jsonText = document.getElementById('import-json').value.trim();
  const resultDiv = document.getElementById('import-result');
  
  if (!jsonText) {
    showImportResult('error', '⛔ JSON field is empty');
    return;
  }
  
  let prospects;
  try {
    prospects = JSON.parse(jsonText);
  } catch (e) {
    showImportResult('error', `❌ JSON parse error: ${e.message}`);
    return;
  }
  
  if (!Array.isArray(prospects)) {
    showImportResult('error', '❌ JSON must be array of prospects');
    return;
  }
  
  try {
    const res = await fetch('/api/leads/import/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prospects })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      showImportResult('error', `❌ ${data.error}`);
      return;
    }
    
    showImportResult('success', `
      ✅ IMPORT COMPLETE<br>
      Imported: <strong>${data.imported}</strong><br>
      Duplicates skipped: <strong>${data.duplicates}</strong><br>
      Total processed: <strong>${data.total}</strong>
    `);
    
    setTimeout(() => {
      loadLeads();
      closeImportModal();
    }, 2000);
    
  } catch (e) {
    showImportResult('error', `❌ Network error: ${e.message}`);
  }
}

function showImportResult(type, msg) {
  const div = document.getElementById('import-result');
  div.className = `feedback-${type}`;
  div.innerHTML = msg;
  div.style.display = 'block';
}
```

Commit: "feat: add import JS functions"
Push to GitHub.
Report:
- [ ] JS functions added
- [ ] No syntax errors
- [ ] Modal open/close works

STOP — wait for "continue".

---

## PHASE 4 — ADD IMPORT CSS

In `tools/semi-auto-outreach/public/style.css`:

At the END of the file, add:

```css
.import-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: none;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
}

.modal-box {
  position: relative;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  margin: 8% auto;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
}

.modal-box h2 {
  color: #f1f5f9;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

.modal-subtitle {
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 14px;
  display: block;
}
```

Commit: "feat: add import modal CSS styling"
Push to GitHub.
Report:
- [ ] CSS added
- [ ] Modal styles applied
- [ ] No rendering issues

STOP — wait for "continue".

---

## PHASE 5 — ADD AUDIT ENDPOINT

In `tools/semi-auto-outreach/server.js`:

Find: `app.patch('/api/leads/:id', (req, res) => {`

After this route ENDS (find closing `});`), add:

```javascript
// PATCH /api/leads/:id/audit
// Safe audit field update (fit score, priority, notes)
app.patch('/api/leads/:id/audit', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    const idx = leads.findIndex(l => l.id === req.params.id);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const lead = leads[idx];
    const { fitScore, priority, auditNotes } = req.body;
    
    // Explicit field assignment — NO blanket merge
    if (typeof fitScore === 'number' && fitScore >= 0 && fitScore <= 100) {
      lead.fitScore = fitScore;
    }
    
    if (priority && ['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
      lead.priority = priority;
    }
    
    if (typeof auditNotes === 'string') {
      lead.auditNotes = auditNotes.trim();
    }
    
    // Log audit action
    if (!lead.events) lead.events = [];
    lead.events.push({
      eventType: 'AUDIT_UPDATED',
      timestamp: new Date().toISOString(),
      note: `Fit: ${fitScore}, Priority: ${priority}`
    });
    
    lead.lastActionAt = new Date().toISOString();
    
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    res.json({ ok: true, lead });
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

Commit: "feat: add audit endpoint (PATCH /api/leads/:id/audit)"
Push to GitHub.
Report:
- [ ] Audit endpoint added
- [ ] Explicit field assignment used
- [ ] No syntax errors

STOP — wait for "continue".

---

## PHASE 6 — ADD AUDIT UI

In `tools/semi-auto-outreach/public/index.html`:

Find the `.lead-card` template (in `buildLeadCard` function output).

Find: `<div class="lead-meta">`

After the `</div>` closing this section, add:

```html
<div style="grid-column:1/-1; padding:12px 20px 0; border-top:1px solid rgba(255,255,255,0.08);">
  <label style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:10px;">📊 AUDIT</label>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px;">
    <div>
      <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Fit Score</label>
      <input 
        type="range" 
        class="audit-fit-score" 
        data-lead-id="${l.id}"
        min="0" max="100" value="${l.fitScore || 0}"
        style="width:100%; cursor:pointer;"
      />
      <span class="audit-fit-display" style="font-size:12px; color:#cbd5e1;">${l.fitScore || 0}</span>
    </div>
    <div>
      <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:4px;">Priority</label>
      <select 
        class="audit-priority" 
        data-lead-id="${l.id}"
        style="width:100%; padding:6px; background:#0f172a; border:1px solid #334155; color:#e2e8f0; border-radius:6px; font-size:12px;">
        <option value="">— Select —</option>
        <option value="HIGH" ${l.priority === 'HIGH' ? 'selected' : ''}>🔴 HIGH</option>
        <option value="MEDIUM" ${l.priority === 'MEDIUM' ? 'selected' : ''}>🟡 MEDIUM</option>
        <option value="LOW" ${l.priority === 'LOW' ? 'selected' : ''}>🟢 LOW</option>
      </select>
    </div>
  </div>
  <div style="margin-bottom:10px;">
    <textarea 
      class="audit-notes" 
      data-lead-id="${l.id}"
      placeholder="Audit notes (why high/low fit, gaps, etc)"
      style="width:100%; min-height:60px; padding:8px; background:#0f172a; border:1px solid #334155; color:#e2e8f0; border-radius:6px; font-size:12px; font-family:inherit; resize:vertical;"
    >${l.auditNotes || ''}</textarea>
  </div>
  <button class="btn-save-audit" data-lead-id="${l.id}" style="padding:8px 12px; background:#0ea5e9; color:#fff; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
    ✅ SAVE AUDIT
  </button>
</div>
```

**IMPORTANT:** Make sure this HTML is part of the `buildLeadCard()` function template string, using template literals `${...}` for dynamic values.

Commit: "feat: add audit UI fields"
Push to GitHub.
Report:
- [ ] Audit section visible in lead card
- [ ] Fit score slider renders
- [ ] Priority dropdown shows
- [ ] Notes textarea visible
- [ ] Save button visible

STOP — wait for "continue".

---

## PHASE 7 — ADD AUDIT JS

In `tools/semi-auto-outreach/public/app.js`:

Find the `attachEvents()` function.

Replace it with:

```javascript
function attachEvents(lead) {
  const ta = document.getElementById('dm-' + lead.id);
  const cc = document.getElementById('cc-' + lead.id);
  if (ta && cc) {
    ta.addEventListener('input', () => { cc.textContent = ta.value.length + ' chars'; });
  }
  attachAuditHandlers(lead);
}
```

Then add this new function after `attachEvents`:

```javascript
function attachAuditHandlers(lead) {
  const fitInput = document.querySelector(`.audit-fit-score[data-lead-id="${lead.id}"]`);
  const fitDisplay = document.querySelector(`.audit-fit-display[data-lead-id="${lead.id}"]`);
  const prioritySelect = document.querySelector(`.audit-priority[data-lead-id="${lead.id}"]`);
  const notesTA = document.querySelector(`.audit-notes[data-lead-id="${lead.id}"]`);
  const saveBtn = document.querySelector(`.btn-save-audit[data-lead-id="${lead.id}"]`);
  
  if (!fitInput || !saveBtn) return;
  
  // Update display when range changes
  fitInput.addEventListener('input', (e) => {
    if (fitDisplay) fitDisplay.textContent = e.target.value;
  });
  
  // Save button click
  saveBtn.addEventListener('click', async () => {
    const fitScore = fitInput ? parseInt(fitInput.value) : 0;
    const priority = prioritySelect ? prioritySelect.value : '';
    const auditNotes = notesTA ? notesTA.value : '';
    
    try {
      const res = await fetch(`/api/leads/${lead.id}/audit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitScore, priority, auditNotes })
      });
      
      if (!res.ok) {
        showFeedback(lead.id, 'error', '❌ Failed to save audit');
        return;
      }
      
      showFeedback(lead.id, 'success', '✅ Audit saved');
    } catch (e) {
      showFeedback(lead.id, 'error', `❌ ${e.message}`);
    }
  });
}
```

Commit: "feat: add audit JS handlers"
Push to GitHub.
Report:
- [ ] attachAuditHandlers added
- [ ] Fit slider updates display
- [ ] Save button attached to click event
- [ ] No syntax errors

STOP — wait for "continue".

---

## PHASE 8 — TEST LOCALLY

Start server:

```bash
cd tools/semi-auto-outreach
npm start
```

Wait for: `✅ DealSense Approval Sender Lite`

Then test:

### Test 1 — Import Works
Open browser: `http://localhost:3777`
- [ ] See "IMPORT TOP 10" button
- [ ] Click it → modal opens
- [ ] Modal has textarea for JSON
- [ ] Modal has IMPORT and CANCEL buttons

### Test 2 — Import 2 Prospects

Paste this in textarea:

```json
[
  {
    "businessName": "Smile Dental Ipoh",
    "lokasi": "Ipoh",
    "niche": "Dental",
    "whatsapp": "601234567890",
    "defaultDm": "Hi Smile Dental, saya Aliff dari DealSense..."
  },
  {
    "businessName": "Fresh Spa & Wellness",
    "lokasi": "Ipoh",
    "niche": "Spa",
    "whatsapp": "601234567891",
    "defaultDm": "Hi Fresh Spa, saya ada proposal untuk booking system..."
  }
]
```

Click IMPORT → should see:
- [ ] ✅ IMPORT COMPLETE
- [ ] Imported: 2
- [ ] Dashboard refreshes
- [ ] 2 new leads appear in list

### Test 3 — Edit Audit Fields

For any new prospect:
- [ ] Fit Score slider moves (0-100)
- [ ] Display updates as you slide
- [ ] Priority dropdown selectable
- [ ] Type in notes field
- [ ] Click "SAVE AUDIT" → ✅ message shows
- [ ] Refresh page → values still there

### Test 4 — Zira Lead Preserved

- [ ] Zira Beauty Spa still in dashboard
- [ ] Zira data unchanged
- [ ] Zira approve/mark replied still works

Kill server:
```
Ctrl+C
```

Report all 4 tests:
- [ ] Test 1: [PASS/FAIL]
- [ ] Test 2: [PASS/FAIL]
- [ ] Test 3: [PASS/FAIL]
- [ ] Test 4: [PASS/FAIL]

If any FAIL → identify which phase needs re-run.

STOP — wait for "continue".

---

## PHASE 9 — FINAL COMMIT & PUSH

Once all tests pass:

```bash
cd tools/semi-auto-outreach
git add server.js public/app.js public/index.html public/style.css
git commit -m "feat: patch 5 — batch import + safe audit editor

- POST /api/leads/import/batch (max 10, validation + dedup)
- PATCH /api/leads/:id/audit (fit score, priority, notes)
- Import modal UI with JSON paste
- Audit fields in lead cards
- Explicit field assignment (no data merge)
- All Zira workflow preserved
"
git push
```

Report:
- Commit hash
- Files changed count
- Push status (success/fail)

STOP — PATCH 5 COMPLETE.

---

## ROLLBACK (if needed)

```bash
cd tools/semi-auto-outreach
git reset --hard HEAD~1
git push -f
```

Then report exact error to Aliff.
