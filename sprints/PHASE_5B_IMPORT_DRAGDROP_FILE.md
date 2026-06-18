# PHASE_5B_IMPORT_DRAGDROP_FILE.md

Claude Code, execute Phase 5B only.

PROJECT:
DealSense Prospects Operator

LOCAL APP:
http://localhost:3777

CURRENT STATUS:
Phase 1-5: COMPLETE
MVM: PASS
Import JSON via textarea: working

PHASE 5B OBJECTIVE:
Upgrade existing Import modal to support:
1. Drag and drop JSON file
2. Click to browse and select JSON file
3. Keep existing paste textarea (do not remove)

CORE RULES:
- Do not rewrite import logic
- Do not change validation logic
- Do not change duplicate check logic
- Keep existing paste textarea working
- Keep localhost:3777 working
- Preserve all Phase 1-5 behavior
- No auto-send
- No Baileys
- Patch import modal only

---

## TASK — UPGRADE IMPORT MODAL

Inspect current import modal in public/index.html and public/app.js.

Upgrade the modal to have 3 input methods:

### Method 1 — Drag & Drop Zone

Add a drag-and-drop zone ABOVE the existing textarea:

```
┌─────────────────────────────────────┐
│                                     │
│   📁 Drag & drop JSON file here     │
│   or click to browse                │
│                                     │
└─────────────────────────────────────┘
```

Behavior:
- dragover → highlight zone (border color change)
- dragleave → remove highlight
- drop → read file → parse JSON → fill textarea with content
- click on zone → open file picker (hidden input type=file)
- file picker → select .json file → read → parse → fill textarea
- if parse fails → show error: "File bukan JSON yang valid."
- if parse success → show success: "File loaded. Semak content dan klik Import."
- after file loaded → textarea shows JSON content (auto-filled)
- operator can still edit textarea before importing

### Method 2 — File Browse Button

Add button below drag zone:
"📂 Browse File"

Opens file picker, same behavior as clicking the zone.

### Method 3 — Paste (existing textarea)

Keep existing textarea.
Placeholder text update:
"Paste JSON array di sini, atau drag & drop file di atas..."

---

## CSS REQUIREMENTS

Drag zone styles:
```css
.import-dropzone {
  border: 2px dashed var(--border-strong, rgba(255,255,255,0.14));
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 14px;
  color: var(--text-muted, #A8A29A);
  font-size: 14px;
}
.import-dropzone.drag-over {
  border-color: #A31621;
  background: rgba(122,16,24,0.12);
  color: #F4F1EA;
}
.import-dropzone-icon {
  font-size: 28px;
  margin-bottom: 8px;
  display: block;
}
.import-dropzone-hint {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 4px;
}
.btn-browse {
  background: var(--bg-soft, #1A1A1F);
  border: 1px solid var(--border-strong, rgba(255,255,255,0.14));
  color: var(--text-muted, #A8A29A);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 14px;
  transition: all 0.15s;
}
.btn-browse:hover {
  border-color: #A31621;
  color: #F4F1EA;
}
```

---

## JS REQUIREMENTS

Add these functions in public/app.js:

```javascript
function initImportDropzone() {
  const zone = document.getElementById('import-dropzone');
  const fileInput = document.getElementById('import-file-input');
  const textarea = document.getElementById('import-textarea');
  const feedback = document.getElementById('import-file-feedback');

  if (!zone || !fileInput || !textarea) return;

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) readImportFile(file);
  });

  zone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readImportFile(file);
    fileInput.value = '';
  });
}

function readImportFile(file) {
  const textarea = document.getElementById('import-textarea');
  const feedback = document.getElementById('import-file-feedback');

  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    if (feedback) {
      feedback.textContent = '⚠ File mesti .json';
      feedback.style.color = '#FCA5A5';
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      JSON.parse(content); // validate only
      if (textarea) textarea.value = content;
      if (feedback) {
        feedback.textContent = '✓ File loaded. Semak content dan klik Import.';
        feedback.style.color = '#9FE0BE';
      }
    } catch (err) {
      if (feedback) {
        feedback.textContent = '⚠ File bukan JSON yang valid.';
        feedback.style.color = '#FCA5A5';
      }
    }
  };
  reader.readAsText(file);
}
```

Call initImportDropzone() when modal opens.

---

## HTML STRUCTURE FOR IMPORT MODAL

Update existing import modal to include:

```html
<!-- Hidden file input -->
<input type="file" id="import-file-input" accept=".json,application/json"
  style="display:none;">

<!-- Drag zone -->
<div class="import-dropzone" id="import-dropzone">
  <span class="import-dropzone-icon">📁</span>
  Drag & drop fail JSON di sini
  <div class="import-dropzone-hint">atau klik untuk pilih fail</div>
</div>

<!-- Browse button -->
<button class="btn-browse" onclick="document.getElementById('import-file-input').click()">
  📂 Browse Fail JSON
</button>

<!-- File feedback -->
<div id="import-file-feedback" style="font-size:12px; margin-bottom:10px; min-height:16px;"></div>

<!-- Existing textarea — keep, update placeholder only -->
<textarea id="import-textarea"
  placeholder="Paste JSON array di sini, atau drag & drop fail di atas..."
  ...existing attributes...
></textarea>
```

---

## ACCEPTANCE CRITERIA

After Phase 5B:
1. npm start runs without error.
2. localhost:3777 loads.
3. Import button still visible in header.
4. Import modal opens.
5. Drag zone visible in modal.
6. Browse button visible in modal.
7. Existing textarea still present.
8. Drag JSON file onto zone → file content loads into textarea.
9. Click zone → file picker opens → select JSON → content loads.
10. Click Browse → file picker opens → select JSON → content loads.
11. Non-JSON file → error message shown.
12. Invalid JSON → error message shown.
13. Valid JSON file → success message + textarea filled.
14. Operator can still edit textarea after file load.
15. Click Import Prospects → imports correctly.
16. Duplicate check still works.
17. All Phase 1-5 behavior preserved.
18. No auto-send added.
19. Browser console no breaking errors.

---

## MANUAL TEST CHECKLIST

1. Open localhost:3777
2. Click ↑ Import button
3. Confirm drag zone visible
4. Confirm Browse button visible
5. Confirm textarea still there
6. Save this as test.json and drag onto zone:
```json
[{"operatorLiteLeadData":{"id":"dragtest-spa-ipoh","businessName":"DragTest Spa","lokasi":"Ipoh","niche":"Beauty Spa","whatsapp":"60199999999","kelemahan":"Tiada booking page","offer":"Page Booking WhatsApp / Mini Website Booking WhatsApp RM350","defaultDm":"Hi DragTest Spa, saya Aliff.","humanDecision":"PENDING"}}]
```
7. Confirm textarea auto-filled with JSON content
8. Confirm success message shown
9. Click Import Prospects
10. Confirm "Imported 1 prospects"
11. Confirm DragTest Spa in NEW tab
12. Drag same file again → confirm "Skipped 1 duplicate"
13. Try drag a .txt file → confirm error message
14. All existing leads (Zira, LockTest) still intact

---

## REPORT BACK FORMAT

Phase 5B Build Report
1. Files changed
2. Drag zone implementation
3. File reader implementation
4. Browse button implementation
5. Textarea preserved
6. Test results
7. Any issues
8. Safe to declare Phase 5B complete

STOP after report.
DO NOT proceed to Phase 6.
