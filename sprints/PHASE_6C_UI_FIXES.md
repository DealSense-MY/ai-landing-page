# PHASE_6C_UI_FIXES.md
# DealSense Prospects Operator — Phase 6C
# Run: claude --model claude-fable-5 "Execute sprints/PHASE_6C_UI_FIXES.md"

## OBJECTIVE
8 targeted UI fixes. Inspect before editing. Minimum patch.

## CORE RULES
- No auto-send, no Baileys
- Preserve all data — leads.json untouched
- Preserve all business logic
- English only — no Bahasa Malaysia in any UI text
- Inspect files before editing

---

## FIX 1 — REMOVE SCHEDULED FROM PIPELINE TABS

In public/app.js, find PIPELINE_TABS array.
Remove the SCHEDULED entry.

SCHEDULED is not a pipeline stage — it is a scheduling attribute.
Leads in SCHEDULED state should show in their actual prospect status tab (NEW, CONTACTED, etc).

Also remove SCHEDULED tab from index.html if hardcoded there.

---

## FIX 2 — MODAL CARD DATA NOT LOADING

Current bug: When modal opens, card shows empty DM draft, no preview link, missing data.

Root cause: buildLeadCard() relies on DOM elements being present before attachEvents() runs.
In modal context, the HTML is injected into #card-modal-content but events may fire before DOM is ready.

Fix in openCardModal():
```javascript
function openCardModal(id) {
  const lead = _allLeads.find(l => l.id === id);
  if (!lead) return;
  const content = document.getElementById('card-modal-content');
  // Build full card HTML
  content.innerHTML = buildLeadCard(lead);
  // Apply locked UI if needed
  if (lead.locked) applyLockedUI(lead.id, lead.lockReason);
  // Restore DM draft and other dynamic content
  populateLeadCard(lead);
  // Attach events after DOM ready
  attachEvents(lead);
  // Apply preview section
  renderPreviewSection(lead.id, lead.previewStatus, lead.previewUrl);
  // Show modal
  document.getElementById('card-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
```

Ensure populateLeadCard() and renderPreviewSection() work correctly when called inside modal context.
These functions use document.getElementById() — they will work as long as IDs are unique.
IDs in buildLeadCard() use lead.id as suffix — confirm no duplicate IDs when modal is open.

---

## FIX 3 — LOCKED STATE IN MODAL

Current bug: CLOSED WON locked card in modal still shows active buttons.

Fix: In openCardModal(), after building card HTML, call applyLockedUI() if lead.locked === true.

applyLockedUI() must:
- Disable buttons by ID using lead.id suffix
- Add .card-locked class to card element
- Show lock banner with correct color (green for CLOSED_WON, red for CLOSED_LOST)

Also fix color classes in applyLockedUI():
```javascript
function applyLockedUI(id, lockReason) {
  const card = document.getElementById('card-' + id);
  if (!card) return;
  card.classList.add('card-locked');
  // Color by reason
  if (lockReason === 'CLOSED_WON') {
    card.classList.add('closed-won-lock');
  } else if (lockReason === 'CLOSED_LOST') {
    card.classList.add('closed-lost-lock');
  }
  // Disable action buttons
  ['btn-yes','btn-edit','btn-ok','btn-no','btn-replied',
   'btn-followup','btn-close-won','btn-close-lost','btn-confirm-sent'
  ].forEach(cls => {
    const btn = card.querySelector('.' + cls);
    if (btn) { btn.disabled = true; btn.classList.add('btn-locked'); }
  });
  // Show lock banner
  const banner = document.getElementById('lock-banner-' + id);
  if (banner) banner.style.display = 'block';
}
```

---

## FIX 4 — AGENT SCHEDULE: REPEAT EVERY 7 DAYS

In agent schedule panel, add toggle below datetime field:

```html
<div class="agent-schedule-row">
  <label>Repeat:</label>
  <label class="toggle-label">
    <input type="checkbox" id="agent-run-repeat">
    <span>Every 7 days automatically</span>
  </label>
</div>
```

Save repeat preference to localStorage with schedule:
```javascript
const schedule = {
  datetime: ...,
  niche: ...,
  location: ...,
  count: ...,
  repeat: document.getElementById('agent-run-repeat').checked,
  repeatDays: 7,
  savedAt: new Date().toISOString()
};
```

On page load, restore repeat checkbox state from localStorage.

---

## FIX 5 — AGENT SCHEDULE: BUTTON RESTRUCTURE

### Remove: "💾 Simpan Schedule" button

### Replace with two buttons:

**Button 1 — Find Now (primary action):**
```html
<button class="btn-find-now" onclick="handleFindNow()">
  🔍 Find Prospects Now
</button>
```

When clicked:
- Read current niche + location + count from panel fields
- Generate a prompt string
- Copy prompt to clipboard
- Show instruction: "Prompt copied. Paste into ChatGPT agent to find prospects."
- Also show the prompt in a readonly textarea so operator can review

```javascript
function handleFindNow() {
  const niche = document.getElementById('agent-run-niche').value || 'Beauty Spa';
  const location = document.getElementById('agent-run-location').value || 'Ipoh';
  const count = document.getElementById('agent-run-count').value || '30';
  const prompt = `You are DEALSENSE FAST PROSPECT JSON AGENT.\nFind ${count} prospects in ${location} for niche: ${niche}.\nOutput full JSON array with operatorLiteLeadData and landingPageEngineData.\nFollow all rules in your system prompt.`;
  navigator.clipboard.writeText(prompt).catch(() => {});
  document.getElementById('agent-prompt-output').value = prompt;
  document.getElementById('agent-prompt-row').style.display = 'block';
  document.getElementById('agent-schedule-status').textContent = '✓ Prompt copied. Paste into ChatGPT agent.';
}
```

Add prompt output row in panel:
```html
<div id="agent-prompt-row" style="display:none;" class="agent-schedule-row agent-prompt-row">
  <label>Prompt:</label>
  <textarea id="agent-prompt-output" readonly rows="4"></textarea>
</div>
```

**Button 2 — Save Schedule (secondary):**
```html
<button class="btn-save-schedule" onclick="saveAgentSchedule()">
  💾 Save Schedule
</button>
```

### Date/time picker layout:
Put datetime input on LEFT, add a small "📅 Pick" label on RIGHT side as visual hint.
No functional change to datetime input — just label adjustment.

### Button order in action row:
```
[🔍 Find Prospects Now]  [💾 Save Schedule]  [Clear]  [Close]
```

---

## FIX 6 — IMPORT: CONSOLIDATE INTO "+ ADD LEAD"

### Remove from header:
- Remove "↑ Import" button from header bar entirely

### Add Import as tab inside "+ Add Lead" panel:

When "+ Add Lead" is clicked, show panel with two tabs:
```
[+ Add Lead]  [↑ Import JSON]
```

Tab 1 — Add Lead: existing add lead form (unchanged)
Tab 2 — Import JSON: import panel (moved from header)

Tab switching: click tab label to switch.
Active tab has crimson underline/highlight.

HTML structure:
```html
<div class="add-lead-tabs">
  <button class="add-lead-tab active" onclick="switchAddLeadTab('add')">+ Add Lead</button>
  <button class="add-lead-tab" onclick="switchAddLeadTab('import')">↑ Import JSON</button>
</div>
<div id="add-lead-content" class="add-lead-content">
  <!-- existing add lead form -->
</div>
<div id="import-content" class="import-content" style="display:none;">
  <!-- import panel moved here -->
</div>
```

---

## FIX 7 — IMPORT UI: SINGLE UNIFIED SECTION

Current: Two separate areas (dropzone + textarea below it — looks like duplicate).

New: One unified import area:

```
┌─────────────────────────────────────────┐
│                                         │
│   📁 Drag & drop JSON file here         │
│      or click to select file            │
│                                         │
│   ─────────── or paste below ─────────  │
│                                         │
│   [textarea for paste]                  │
│                                         │
└─────────────────────────────────────────┘

        [Import Prospects]  [📂 Browse File]  [Cancel]
```

Browse File button: centered between Import Prospects and Cancel.

Remove duplicate dropzone/textarea — only ONE of each.

Update placeholder text:
"Paste JSON array here, or drag & drop file above..."

---

## FIX 8 — ALL UI TEXT: ENGLISH ONLY

Replace ALL Bahasa Malaysia text in index.html, app.js, style.css with English.

Key replacements (not exhaustive — find all BM text):

| BM | English |
|---|---|
| Tambah Lead Baru | Add New Lead |
| Tambah Lead | Add Lead |
| Batal | Cancel |
| Tutup | Close |
| Simpan Schedule | Save Schedule |
| Simpan Reply | Save Reply |
| Tambah nota pembetulan / correction note... | Add correction note... |
| Paste reply di sini... | Paste reply here... |
| Import Prospects dari ChatGPT Agent | Import Prospects from ChatGPT Agent |
| Tarikh & Masa | Date & Time |
| Niche Target | Niche Target |
| Lokasi | Location |
| Bilangan Prospects | Number of Prospects |
| Drag & drop fail JSON di sini | Drag & drop JSON file here |
| atau klik untuk pilih fail | or click to select file |
| Browse Fail JSON | Browse JSON File |
| Set masa untuk agent... | Set time for agent... |
| Setiap 7 hari secara automatik | Every 7 days automatically |
| Prompt disalin... | Prompt copied... |
| Schedule disimpan | Schedule saved |
| Tiada | None |
| Belum ada | Not set |

Search for any remaining BM text and replace.
Do NOT change data values in leads.json — only UI display text.

---

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads in English only.
3. No SCHEDULED tab in pipeline bar.
4. Click any table row → modal opens with FULL card data (DM draft, preview link).
5. CLOSED WON locked card in modal → buttons disabled, GREEN lock banner.
6. CLOSED LOST locked card in modal → buttons disabled, RED lock banner.
7. Agent Schedule panel has "Repeat every 7 days" checkbox.
8. "Find Prospects Now" button copies prompt to clipboard + shows prompt.
9. "Save Schedule" button saves to localStorage.
10. Header has NO import button.
11. "+ Add Lead" opens panel with two tabs: Add Lead and Import JSON.
12. Import panel is single unified section (dropzone + paste textarea).
13. Browse File button centered between Import and Cancel.
14. All UI text in English.
15. All pipeline tabs still work (minus SCHEDULED).
16. Modal close: X button, click outside, Escape key.
17. All Phase 1-6B behavior preserved.
18. No auto-send added.
19. Browser console no breaking errors.
20. Refresh → all state preserved.

---

## MANUAL TEST CHECKLIST

1. Open localhost:3777 — confirm ALL text is English
2. Confirm no SCHEDULED tab in pipeline
3. Click Zira row → modal opens → confirm DM draft visible with full content
4. Scroll modal → confirm preview link visible
5. Click CLOSED WON tab → click LockTest row → modal opens → confirm GREEN lock banner + buttons disabled
6. Try clicking APPROVE on locked card → confirm blocked
7. Click Agent Run button → panel opens → fill fields → click "Find Prospects Now"
8. Confirm prompt copied + prompt textarea visible
9. Check "Repeat every 7 days" → click Save Schedule → button label updates
10. Refresh → repeat checkbox restored, schedule label shows
11. Click "+ Add Lead" → confirm two tabs visible
12. Click "Import JSON" tab → confirm single unified import area
13. Confirm Browse File button centered at bottom
14. Drag JSON file → loads into textarea
15. All existing functionality preserved

REPORT BACK: Phase 6C Build Report
STOP after Phase 6C. DO NOT proceed to Phase 7 until Aliff approves.
