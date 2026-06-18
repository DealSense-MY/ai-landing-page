# PHASE_6D_CRITICAL_FIXES.md
# DealSense Prospects Operator — Phase 6D
# Run: claude --model claude-fable-5 "Execute sprints/PHASE_6D_CRITICAL_FIXES.md"

## OBJECTIVE
4 critical fixes. Read ALL files carefully before touching anything.

## CORE RULES
- No auto-send, no Baileys
- Preserve all data
- English only
- Minimum patch — do not rewrite

---

## FIX 1 — CLOSED WON LOCK COLOR: GREEN NOT RED

### Problem
CLOSED WON locked card still shows red lock banner and red border.

### Root cause
applyLockedUI() adds .card-locked class but does NOT add .closed-won-lock or .closed-lost-lock class.
CSS selectors .lock-banner.closed-won-lock and .card-locked.closed-won-lock exist but never get applied.

### Fix in public/app.js
Find applyLockedUI() function.
Add logic to apply color class based on lockReason:

```javascript
function applyLockedUI(lead) {
  // support both (lead) object and (id, lockReason) signature for backward compat
  const id = typeof lead === 'object' ? lead.id : lead;
  const lockReason = typeof lead === 'object' ? lead.lockReason : arguments[1];

  const card = document.getElementById('card-' + id);
  if (!card) return;

  card.classList.add('card-locked');

  // Apply color class based on lockReason
  if (lockReason === 'CLOSED_WON') {
    card.classList.add('closed-won-lock');
    card.classList.remove('closed-lost-lock');
  } else if (lockReason === 'CLOSED_LOST') {
    card.classList.add('closed-lost-lock');
    card.classList.remove('closed-won-lock');
  }

  // Disable action buttons
  const btnsToDisable = [
    'btn-yes', 'btn-edit', 'btn-ok', 'btn-no',
    'btn-replied', 'btn-followup', 'btn-close-won',
    'btn-close-lost', 'btn-confirm-sent'
  ];
  btnsToDisable.forEach(cls => {
    const btn = card.querySelector('.' + cls);
    if (btn) {
      btn.disabled = true;
      btn.classList.add('btn-locked');
    }
  });

  // Show lock banner
  const banner = document.getElementById('lock-banner-' + id);
  if (banner) {
    banner.style.display = 'block';
    // Apply color class to banner too
    if (lockReason === 'CLOSED_WON') {
      banner.classList.add('closed-won-lock');
    } else if (lockReason === 'CLOSED_LOST') {
      banner.classList.add('closed-lost-lock');
    }
  }
}
```

### Find all calls to applyLockedUI() and update:
- Where called as applyLockedUI(lead.id, lead.lockReason) → change to applyLockedUI(lead)
- Where called as applyLockedUI(id, lockReason) → change to applyLockedUI({id, lockReason})
- In openCardModal() → call applyLockedUI(lead) after populateLeadCard()

### Fix in style.css
Verify these selectors exist with GREEN color for CLOSED WON:

```css
/* CLOSED WON — GREEN */
.card-locked.closed-won-lock {
  border-color: rgba(47,111,78,0.5) !important;
}
.lock-banner.closed-won-lock {
  background: rgba(47,111,78,0.14) !important;
  border: 1px solid rgba(47,111,78,0.4) !important;
  color: #9FE0BE !important;
}
.lock-banner.closed-won-lock .lock-badge {
  background: rgba(47,111,78,0.2) !important;
  color: #9FE0BE !important;
}

/* CLOSED LOST — RED */
.card-locked.closed-lost-lock {
  border-color: rgba(163,22,33,0.5) !important;
}
.lock-banner.closed-lost-lock {
  background: rgba(122,16,24,0.18) !important;
  border: 1px solid rgba(163,22,33,0.45) !important;
  color: #FCA5A5 !important;
}
.lock-banner.closed-lost-lock .lock-badge {
  background: rgba(122,16,24,0.22) !important;
  color: #FCA5A5 !important;
}
```

Use !important to override any existing conflicting rules.

---

## FIX 2 — MODAL CARD: DM DRAFT AND DATA EMPTY

### Problem
When modal opens, DM draft textarea is empty even though lead has defaultDm data.
Preview section also not showing.

### Root cause
populateLeadCard() uses document.getElementById('dm-' + id) to fill textarea.
buildLeadCard() creates textarea with id="dm-[id]".
The sequence matters — innerHTML must be set BEFORE calling populateLeadCard().

### Fix in public/app.js — openCardModal():

```javascript
function openCardModal(id) {
  const lead = _allLeads.find(l => l.id === id);
  if (!lead) return;

  const content = document.getElementById('card-modal-content');
  if (!content) return;

  // Step 1: Build and inject HTML first
  content.innerHTML = buildLeadCard(lead);

  // Step 2: Wait for DOM to be ready (microtask)
  setTimeout(() => {
    // Step 3: Populate dynamic content
    populateLeadCard(lead);

    // Step 4: Apply preview section
    if (typeof renderPreviewSection === 'function') {
      renderPreviewSection(lead.id, lead.previewStatus, lead.previewUrl);
    }

    // Step 5: Apply locked UI if needed
    if (lead.locked) {
      applyLockedUI(lead);
    }

    // Step 6: Render amendments
    if (typeof renderAmendmentsList === 'function') {
      renderAmendmentsList(lead.id, lead.amendments || []);
    }

    // Step 7: Attach events last
    attachEvents(lead);

    // Step 8: Update char count
    const ta = document.getElementById('dm-' + lead.id);
    const cc = document.getElementById('cc-' + lead.id);
    if (ta && cc) cc.textContent = ta.value.length + ' chars';
  }, 0);

  // Show modal
  document.getElementById('card-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Highlight row
  document.querySelectorAll('[data-id]').forEach(r => {
    r.classList.toggle('selected-row', r.dataset.id === id);
  });
}
```

### Also verify populateLeadCard() fills defaultDm:
Find populateLeadCard() — confirm it sets textarea value:
```javascript
const ta = document.getElementById('dm-' + lead.id);
if (ta) ta.value = lead.defaultDm || lead.lastApprovedMessage || '';
```
If this line is missing, add it.

---

## FIX 3 — MUTUAL EXCLUSIVE PANELS

### Problem
Agent Schedule panel and Add Lead panel both open at same time.
Both visible simultaneously — layout conflict.

### Fix in public/app.js

Create a central panel manager:

```javascript
const PANELS = {
  addLead: 'add-lead-panel',
  agentSchedule: 'agent-schedule-panel'
};

function closeAllPanels() {
  Object.values(PANELS).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function openPanel(panelKey) {
  closeAllPanels();
  const el = document.getElementById(PANELS[panelKey]);
  if (el) el.style.display = 'block';
}
```

Update toggleAddLead() to use openPanel:
```javascript
function toggleAddLead() {
  const panel = document.getElementById('add-lead-panel');
  if (panel.style.display === 'none' || panel.style.display === '') {
    openPanel('addLead');
  } else {
    closeAllPanels();
  }
}
```

Update toggleAgentSchedule() to use openPanel:
```javascript
function toggleAgentSchedule() {
  const panel = document.getElementById('agent-schedule-panel');
  if (panel.style.display === 'none' || panel.style.display === '') {
    openPanel('agentSchedule');
  } else {
    closeAllPanels();
  }
}
```

---

## FIX 4 — LAYOUT: SEPARATE AGENT SCHEDULE FROM ADD LEAD PANEL

### Problem
Agent Schedule panel renders INSIDE or immediately below Add Lead panel.
They appear merged — looks broken.

### Root cause
In index.html, agent-schedule-panel div is placed inside or adjacent to add-lead-panel div.

### Fix in index.html
Ensure these are SEPARATE top-level divs, NOT nested:

```html
<!-- Panel 1: Add Lead (with Import JSON tab) -->
<div id="add-lead-panel" style="display:none;">
  <div class="add-lead-tabs">
    <button class="add-lead-tab active" onclick="switchAddLeadTab('add')">+ Add Lead</button>
    <button class="add-lead-tab" onclick="switchAddLeadTab('import')">↑ Import JSON</button>
  </div>
  <div id="add-lead-content">
    <!-- Add Lead form here -->
  </div>
  <div id="import-content" style="display:none;">
    <!-- Import panel here -->
  </div>
</div>

<!-- Panel 2: Agent Schedule (SEPARATE — not inside Panel 1) -->
<div id="agent-schedule-panel" style="display:none;">
  <div class="agent-schedule-inner">
    <!-- Schedule form here -->
  </div>
</div>

<!-- Pipeline tabs and table BELOW both panels -->
<div class="pipeline-tabs">...</div>
<table>...</table>
```

Both panels must be siblings, not parent-child.
Both hidden by default (style="display:none").
Only ONE shows at a time (fixed by Fix 3).

---

## FIX 5 — IMPORT JSON TAB LAYOUT CLEANUP

### Problem
Import JSON tab looks broken — Schedule Agent panel content bleeds into it.

### After Fix 4 (panels separated), clean up Import tab:

Import tab content should be ONLY:

```html
<div id="import-content" style="display:none;">
  <h3>Import Prospects from ChatGPT Agent</h3>
  <p>Paste a JSON array, or drag & drop a JSON file.</p>

  <!-- Single unified import area -->
  <div class="import-unified-area" id="import-dropzone">
    <span class="import-dropzone-icon">📁</span>
    <div>Drag & drop JSON file here</div>
    <div class="import-dropzone-hint">or paste below</div>
  </div>

  <div class="import-divider">— or paste below —</div>

  <textarea id="import-textarea"
    placeholder="Paste JSON array here, or drag & drop file above...">
  </textarea>

  <!-- Action buttons -->
  <div class="import-actions">
    <button class="btn-import-primary" onclick="submitImport()">Import Prospects</button>
    <button class="btn-browse" onclick="document.getElementById('import-file-input').click()">📂 Browse File</button>
    <button class="btn-import-cancel" onclick="toggleAddLead()">Cancel</button>
  </div>

  <div id="import-file-feedback"></div>
  <div id="import-result"></div>

  <input type="file" id="import-file-input" accept=".json" style="display:none;">
</div>
```

Remove any duplicate dropzones, duplicate textareas, or duplicate buttons.

---

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads.
3. CLOSED WON locked card → GREEN lock banner in modal.
4. CLOSED LOST locked card → RED lock banner.
5. Open Zira modal → DM draft shows full text (719 chars).
6. Open Zira modal → preview link visible.
7. Open Zira modal → char count shows correctly.
8. Click Agent Run button → only schedule panel shows, Add Lead hidden.
9. Click + Add Lead → only add lead panel shows, Agent Schedule hidden.
10. Both panels cannot be open simultaneously.
11. Import JSON tab shows clean single import area only.
12. No Schedule Agent content inside Add Lead panel.
13. Browse File button centered between Import and Cancel.
14. All text English.
15. All pipeline tabs work.
16. All existing functionality preserved.
17. No auto-send added.
18. Browser console no breaking errors.

---

## MANUAL TEST

1. Open localhost:3777
2. Click CLOSED WON tab → click LockTest row → confirm GREEN banner
3. Click Zira row → confirm DM draft shows "Hi puan..."
4. Scroll modal → confirm preview link "zira-beauty-spa-ipoh-preview.html"
5. Close modal
6. Click Agent Run → schedule panel opens
7. Click + Add Lead → schedule panel closes, add lead panel opens
8. Click Agent Run again → add lead closes, schedule opens
9. Click + Add Lead → Import JSON tab → clean layout, no schedule content
10. Confirm Browse File between Import and Cancel buttons

REPORT BACK: Phase 6D Build Report
STOP after Phase 6D. DO NOT proceed to Phase 7 until Aliff approves.
