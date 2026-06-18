# SPRINT_AUKIY_THEME.md
# DealSense — Restyle: AUKIY Premium Operator Theme
# Run: claude "Execute sprints/SPRINT_AUKIY_THEME.md"

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

## CONSTRAINTS — WAJIB IKUT
- DO NOT change business logic
- DO NOT change DM copy
- DO NOT change approval behavior
- DO NOT add auto-send
- DO NOT touch server.js, leads.json, atau outreach-log.json
- CSS-only patch diutamakan
- Touch app.js hanya jika button label/class perlu tukar

---

## CONTEXT
Project: tools/semi-auto-outreach/
Files to patch:
- tools/semi-auto-outreach/public/style.css  ← MAIN TARGET
- tools/semi-auto-outreach/public/index.html ← jika class name perlu
- tools/semi-auto-outreach/public/app.js     ← jika button label/class perlu

---

## AUKIY THEME TOKENS

Define in CSS :root —

```css
:root {
  --bg-main:       #050505;
  --bg-elevated:   #0B0B0D;
  --bg-panel:      #111114;
  --bg-card:       #151519;
  --bg-soft:       #1A1A1F;

  --border-subtle: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);

  --text-main:     #F4F1EA;
  --text-muted:    #A8A29A;
  --text-soft:     #78716C;

  --accent-crimson:       #7A1018;
  --accent-crimson-bright:#A31621;
  --accent-crimson-soft:  rgba(122,16,24,0.22);

  --warning-bg:     rgba(122,16,24,0.18);
  --warning-border: rgba(163,22,33,0.45);

  --success-muted: #2F6F4E;
  --danger-muted:  #7A1018;

  --radius-card:   18px;
  --radius-button: 14px;

  --shadow-premium: 0 18px 60px rgba(0,0,0,0.45);
}
```

---

## PHASE 1 — AUDIT

Read these files:
1. tools/semi-auto-outreach/public/style.css
2. tools/semi-auto-outreach/public/index.html
3. tools/semi-auto-outreach/public/app.js

Report:
- Semua CSS selectors yang perlu diubah
- Class names untuk buttons (btn-yes, btn-edit, btn-no, btn-replied, btn-followup)
- Status badge classes
- Warning bar selector
- Header selector
- Card selector
- Textarea selector

Do NOT modify anything.
STOP — tunggu "continue".

---

## PHASE 2 — APPLY THEME

Patch style.css dengan AUKIY theme. Guna CSS variables dari atas.

### Body
```css
body {
  background:
    radial-gradient(circle at top, rgba(122,16,24,0.18), transparent 34%),
    #050505;
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
}
```

### Warning Bar (.safety-banner)
```css
.safety-banner {
  background: var(--warning-bg);
  border-bottom: 1px solid var(--warning-border);
  color: var(--text-main);
  text-align: center;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### Header (.app-header)
```css
.app-header {
  background: var(--bg-elevated);
  padding: 18px 28px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 14px;
}
.app-header h1 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.3px;
}
/* Change badge text to "AUKIY LOCAL MODE" in index.html */
.app-header .badge {
  background: var(--accent-crimson-soft);
  border: 1px solid var(--warning-border);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
```

### Lead Card (.lead-card)
```css
.lead-card {
  background: linear-gradient(180deg, #151519, #101014);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-premium);
  overflow: hidden;
}
.lead-card-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.lead-card-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}
```

### Status Badges
```css
.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border: 1px solid transparent;
}
.status-NEW                            { background: rgba(255,255,255,0.05); color: var(--text-soft); border-color: var(--border-subtle); }
.status-PREVIEW_READY                  { background: var(--warning-bg); border-color: var(--warning-border); color: var(--text-main); }
.status-APPROVED_TO_SEND,
.status-APPROVED_EDITED_TO_SEND        { background: rgba(47,111,78,0.16); border-color: rgba(47,111,78,0.45); color: #9FE0BE; }
.status-SENT_MANUAL_CONFIRMATION_NEEDED{ background: rgba(120,80,20,0.18); border-color: rgba(180,120,30,0.4); color: #D4A55A; }
.status-REPLIED                        { background: rgba(30,58,95,0.25); border-color: rgba(70,130,180,0.3); color: #93C5FD; }
.status-FOLLOW_UP_NEEDED               { background: rgba(100,60,20,0.2); border-color: rgba(150,90,30,0.35); color: #D4A55A; }
.status-REJECTED_NEEDS_REWORK          { background: rgba(122,16,24,0.2); border-color: var(--warning-border); color: #FCA5A5; }
.status-CLOSED_WON                     { background: rgba(47,111,78,0.12); border-color: rgba(47,111,78,0.3); color: #4ADE80; }
.status-CLOSED_LOST                    { background: rgba(30,30,30,0.4); border-color: var(--border-subtle); color: var(--text-soft); }
```

### Meta Panel (.lead-meta)
```css
.lead-meta {
  padding: 16px 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  border-bottom: 1px solid var(--border-subtle);
}
@media (max-width: 600px) { .lead-meta { grid-template-columns: 1fr; } }
.meta-item label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 3px;
}
.meta-item span { font-size: 13px; color: var(--text-muted); }
.meta-item span.unknown { color: var(--accent-crimson-bright); font-style: italic; }
```

### Preview Path Row
```css
.preview-path-row {
  padding: 10px 22px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
  font-size: 11px;
  color: var(--text-soft);
  word-break: break-all;
}
.preview-path-row strong { color: var(--text-muted); }
```

### DM Panel (.dm-panel)
```css
.dm-panel { padding: 20px 22px; border-bottom: 1px solid var(--border-subtle); }
.dm-panel label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 10px;
}
.dm-textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.65;
  resize: vertical;
  min-height: 220px;
  font-family: inherit;
  transition: border-color 0.2s;
}
.dm-textarea:focus { outline: none; border-color: var(--accent-crimson-bright); }
.dm-textarea[readonly] { opacity: 0.7; cursor: default; }
.char-count { font-size: 11px; color: var(--text-soft); margin-top: 6px; text-align: right; }
```

### Buttons (.action-bar)
```css
.action-bar { padding: 18px 22px; display: flex; gap: 10px; flex-wrap: wrap; }

.btn {
  padding: 10px 20px;
  border-radius: var(--radius-button);
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.4px;
}
.btn:hover  { opacity: 0.88; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

/* YES — Approve */
.btn-yes {
  background: linear-gradient(180deg, #A31621, #7A1018);
  color: #F4F1EA;
  border-color: rgba(255,255,255,0.1);
}
.btn-yes:hover { background: linear-gradient(180deg, #BC1C2A, #8E1320); }

/* EDIT */
.btn-edit {
  background: var(--bg-soft);
  color: var(--text-muted);
  border-color: var(--border-strong);
}

/* OK — Save & Open */
.btn-ok {
  background: linear-gradient(180deg, #A31621, #7A1018);
  color: #F4F1EA;
  border-color: rgba(255,255,255,0.1);
  display: none;
}

/* NO */
.btn-no {
  background: var(--bg-soft);
  color: var(--text-soft);
  border-color: var(--accent-crimson);
}

/* Mark Replied */
.btn-replied {
  background: var(--bg-soft);
  color: var(--text-muted);
  border-color: var(--border-subtle);
}

/* Follow-Up */
.btn-followup {
  background: var(--bg-elevated);
  color: var(--text-soft);
  border-color: var(--border-subtle);
}
```

### Feedback Boxes
```css
.feedback-box {
  margin: 0 22px 16px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  display: none;
}
.feedback-success { background: rgba(47,111,78,0.14); border: 1px solid rgba(47,111,78,0.4); color: #9FE0BE; }
.feedback-warning { background: var(--warning-bg); border: 1px solid var(--warning-border); color: #D4A55A; }
.feedback-error   { background: rgba(122,16,24,0.22); border: 1px solid var(--warning-border); color: #FCA5A5; }
.feedback-info    { background: rgba(30,58,95,0.2); border: 1px solid rgba(70,130,180,0.3); color: #93C5FD; }
```

### Reply Input Box
```css
.reply-input-box { margin: 0 22px 16px; display: none; }
.reply-input-box label {
  font-size: 10px; color: var(--text-soft); font-weight: 700;
  display: block; margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: 0.7px;
}
.reply-input-box textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}
.btn-save-reply {
  margin-top: 8px;
  background: var(--bg-soft);
  color: var(--text-muted);
  border: 1px solid var(--border-strong);
  padding: 7px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-save-reply:hover { border-color: var(--accent-crimson-bright); color: var(--text-main); }
```

### Empty State
```css
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-soft); }
.empty-state h2 { font-size: 17px; margin-bottom: 8px; color: var(--text-muted); }
.empty-state p  { font-size: 13px; }
```

Also patch index.html:
- Change `<h1>DealSense Approval Sender Lite</h1>` → `<h1>DealSense Operator Lite</h1>`
- Change `<span class="badge">LOCAL ONLY</span>` → `<span class="badge">AUKIY LOCAL MODE</span>`

Report: files changed, lines modified.
STOP — tunggu "continue".

---

## PHASE 3 — VISUAL VERIFY

Verify (tanpa run server, buat logic check je):

- [ ] Warning bar: no longer bright red → muted crimson strip
- [ ] Approve button (btn-yes): no longer bright green → dark crimson gradient
- [ ] Edit button (btn-edit): no longer bright orange → graphite
- [ ] No button (btn-no): dark graphite + crimson border
- [ ] Card: premium gradient + subtle border
- [ ] DM textarea: dark bg, crimson focus ring
- [ ] Status APPROVED_TO_SEND: muted green badge
- [ ] Status PREVIEW_READY: muted crimson badge
- [ ] Header: updated to "DealSense Operator Lite" + "AUKIY LOCAL MODE"
- [ ] No business logic changed
- [ ] No auto-send added

Report pass/fail each item.
STOP — done.
