# PHASE_6B_UI_RESTRUCTURE.md
# DealSense Prospects Operator — Phase 6B
# Run: claude --model claude-fable-5 "Execute sprints/PHASE_6B_UI_RESTRUCTURE.md"

## OBJECTIVE
5 UI changes. Patch only — do not rewrite.

## CORE RULES
- Preserve all business logic
- Preserve all data — leads.json untouched
- No auto-send, no Baileys
- Inspect files before editing

---

## CHANGE 1 — PROSPECT CARDS: HIDDEN + POPUP MODAL

### Current behavior
- All cards render visible below table
- Click row → scroll to card

### New behavior
- Cards section hidden by default (display:none)
- Click table row → open modal overlay with that lead's card
- Modal: dark overlay background, card centered/floating
- Close modal: click outside overlay OR click X button on modal
- One modal at a time only

### Implementation

#### HTML — add modal container after table section in index.html:
```html
<div id="card-modal-overlay" class="card-modal-overlay" onclick="handleModalOverlayClick(event)" style="display:none;">
  <div class="card-modal-box" id="card-modal-box">
    <button class="card-modal-close" onclick="closeCardModal()">✕</button>
    <div id="card-modal-content"></div>
  </div>
</div>
```

#### CSS — add modal styles:
```css
.card-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.card-modal-box {
  background: var(--bg-card, #151519);
  border: 1px solid var(--border-subtle, rgba(255,255,255,0.08));
  border-radius: 18px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 0;
}
.card-modal-close {
  position: sticky;
  top: 12px;
  float: right;
  margin: 12px 16px 0 0;
  background: var(--bg-soft, #1A1A1F);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted, #A8A29A);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-modal-close:hover {
  background: var(--accent-crimson-soft);
  color: var(--text-main);
}
```

#### JS — add these functions:

```javascript
function openCardModal(id) {
  const lead = _allLeads.find(l => l.id === id);
  if (!lead) return;
  const content = document.getElementById('card-modal-content');
  content.innerHTML = buildLeadCard(lead);
  attachEvents(lead);
  document.getElementById('card-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // highlight table row
  document.querySelectorAll('.prospect-table tbody tr').forEach(r => {
    r.classList.toggle('selected-row', r.dataset.id === id);
  });
}

function closeCardModal() {
  document.getElementById('card-modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('.prospect-table tbody tr').forEach(r => {
    r.classList.remove('selected-row');
  });
}

function handleModalOverlayClick(e) {
  if (e.target.id === 'card-modal-overlay') closeCardModal();
}
```

#### Update selectProspect() → call openCardModal() instead of scroll:
```javascript
function selectProspect(id) {
  openCardModal(id);
}
```

#### Hide old PROSPECT CARDS section:
- Remove or hide `<div class="leads-grid" id="leads-grid">` section label and container
- Cards now render inside modal only
- `renderCards()` still builds HTML but only used by openCardModal()

#### Close modal on Escape key:
```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCardModal();
});
```

---

## CHANGE 2 — SCHEDULE: MOVE TO HEADER

### Remove from card
- Remove entire SCHEDULE section from buildLeadCard() in app.js
- Remove renderScheduleBox(), toggleSchedulePicker(), handleConfirmSchedule(), handleUnschedule() — or keep as dead code with comment "// deprecated Phase 6B"
- Remove .schedule-box CSS or mark as unused

### Add to header
Add Schedule button in header bar, right side, between Operation toggle and "+ Add Lead":

```html
<button class="btn-agent-schedule" id="btn-agent-schedule" onclick="toggleAgentSchedule()">
  🗓 Agent Run: OFF
</button>
```

#### Agent Schedule Modal/Panel:
When clicked → show simple panel below header:

```html
<div id="agent-schedule-panel" class="agent-schedule-panel" style="display:none;">
  <div class="agent-schedule-inner">
    <h3>🤖 Schedule Agent Prospect Run</h3>
    <p>Set masa untuk agent (ChatGPT/Alt) cari 30 prospects baru secara automatik.</p>
    <div class="agent-schedule-row">
      <label>Tarikh & Masa:</label>
      <input type="datetime-local" id="agent-run-datetime">
    </div>
    <div class="agent-schedule-row">
      <label>Niche Target:</label>
      <input type="text" id="agent-run-niche" placeholder="Beauty Spa, Klinik, Dental..." value="Beauty Spa / Facial">
    </div>
    <div class="agent-schedule-row">
      <label>Lokasi:</label>
      <input type="text" id="agent-run-location" placeholder="Ipoh, Perak" value="Ipoh">
    </div>
    <div class="agent-schedule-row">
      <label>Bilangan Prospects:</label>
      <input type="number" id="agent-run-count" value="30" min="5" max="50">
    </div>
    <div class="agent-schedule-actions">
      <button onclick="saveAgentSchedule()">💾 Simpan Schedule</button>
      <button onclick="clearAgentSchedule()">🗑 Clear</button>
      <button onclick="toggleAgentSchedule()">Tutup</button>
    </div>
    <div id="agent-schedule-status"></div>
  </div>
</div>
```

#### Save to localStorage:
```javascript
const AGENT_SCHEDULE_KEY = 'dealsense_agent_schedule';

function saveAgentSchedule() {
  const schedule = {
    datetime: document.getElementById('agent-run-datetime').value,
    niche: document.getElementById('agent-run-niche').value,
    location: document.getElementById('agent-run-location').value,
    count: document.getElementById('agent-run-count').value,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(AGENT_SCHEDULE_KEY, JSON.stringify(schedule));
  document.getElementById('agent-schedule-status').textContent = '✓ Schedule disimpan.';
  document.getElementById('btn-agent-schedule').textContent = `🗓 Agent Run: ${schedule.datetime.replace('T',' ')}`;
}

function clearAgentSchedule() {
  localStorage.removeItem(AGENT_SCHEDULE_KEY);
  document.getElementById('agent-schedule-status').textContent = 'Schedule cleared.';
  document.getElementById('btn-agent-schedule').textContent = '🗓 Agent Run: OFF';
  document.getElementById('agent-run-datetime').value = '';
}

function toggleAgentSchedule() {
  const panel = document.getElementById('agent-schedule-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}
```

On page load — restore schedule from localStorage and update button label.

#### CSS for agent schedule panel:
```css
.btn-agent-schedule {
  background: var(--bg-soft, #1A1A1F);
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-agent-schedule:hover {
  border-color: var(--accent-crimson-bright);
  color: var(--text-main);
}
.agent-schedule-panel {
  background: var(--bg-elevated, #0B0B0D);
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 24px;
}
.agent-schedule-inner h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}
.agent-schedule-inner p {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.agent-schedule-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.agent-schedule-row label {
  font-size: 12px;
  color: var(--text-soft);
  min-width: 120px;
}
.agent-schedule-row input {
  background: var(--bg-soft);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  flex: 1;
}
.agent-schedule-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.agent-schedule-actions button {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-soft);
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}
.agent-schedule-actions button:first-child {
  background: linear-gradient(180deg, #2F6F4E, #1a4a33);
  color: #9FE0BE;
  border-color: rgba(47,111,78,0.4);
}
#agent-schedule-status {
  font-size: 12px;
  color: #9FE0BE;
  margin-top: 8px;
  min-height: 16px;
}
```

---

## CHANGE 3 — LOCKED COLOR FIX

### CLOSED WON → GREEN (not red)
In style.css, find and update:
```css
/* CLOSED WON — hijau */
.status-CLOSED_WON {
  background: rgba(47,111,78,0.16);
  border-color: rgba(47,111,78,0.45);
  color: #9FE0BE;
}

/* Lock banner untuk CLOSED WON — hijau */
.card-locked.closed-won-lock {
  border-color: rgba(47,111,78,0.4);
}
.lock-banner.closed-won-lock {
  background: rgba(47,111,78,0.14);
  border-color: rgba(47,111,78,0.4);
  color: #9FE0BE;
}
.lock-badge.closed-won-lock {
  background: rgba(47,111,78,0.2);
  color: #9FE0BE;
}
```

### CLOSED LOST → RED (merah)
```css
/* CLOSED LOST — merah */
.status-CLOSED_LOST {
  background: rgba(122,16,24,0.2);
  border-color: var(--warning-border);
  color: #FCA5A5;
}

.card-locked.closed-lost-lock {
  border-color: var(--warning-border);
}
.lock-banner.closed-lost-lock {
  background: rgba(122,16,24,0.18);
  border-color: var(--warning-border);
  color: #FCA5A5;
}
.lock-badge.closed-lost-lock {
  background: rgba(122,16,24,0.22);
  color: #FCA5A5;
}
```

In buildLeadCard() and applyLockedUI(), add class based on lockReason:
- lockReason === 'CLOSED_WON' → add class `closed-won-lock`
- lockReason === 'CLOSED_LOST' → add class `closed-lost-lock`

---

## CHANGE 4 — REMOVE SCHEDULE FROM CARD

In buildLeadCard() in app.js:
- Remove renderScheduleBox() call
- Remove SCHEDULE section HTML from card output
- Keep all other card sections intact

---

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads.
3. No cards visible on page load — only table.
4. Click table row → modal popup opens with that lead's card.
5. Modal has X button to close.
6. Click outside modal → closes.
7. Escape key → closes modal.
8. All card actions work inside modal (Approve, Edit, etc).
9. WA still opens correctly from modal.
10. Schedule section NOT in card anymore.
11. Agent Schedule button visible in header.
12. Click Agent Schedule → panel shows with fields.
13. Save schedule → button label updates.
14. Schedule saved to localStorage, persists on refresh.
15. CLOSED WON badge/lock → GREEN color.
16. CLOSED LOST badge/lock → RED color.
17. All pipeline tabs still work.
18. All Phase 1-6 behavior preserved.
19. No auto-send added.
20. Browser console no breaking errors.

---

## MANUAL TEST

1. Open localhost:3777
2. Confirm no cards visible below table
3. Click Zira row → modal pops up
4. Confirm card full content in modal
5. Click X → modal closes
6. Click outside modal → closes
7. Press Escape → closes
8. Click APPROVE in modal → WA opens
9. Click Agent Schedule button → panel opens
10. Fill datetime + niche + location → Save
11. Button label updates to scheduled time
12. Refresh → schedule still saved
13. Go to CLOSED WON tab → LockTest card → confirm GREEN lock banner
14. Confirm no SCHEDULE section in any card
15. All tabs + table still work

REPORT BACK: Phase 6B Build Report
STOP after Phase 6B. DO NOT proceed to Phase 7 until Aliff approves.
