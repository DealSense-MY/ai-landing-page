# PHASE_4B_PREVIEW_ENGINE_INTEGRATED.md
# DealSense Prospects Operator — Phase 4B
# Fast Hustle Preview Engine — Integrated dengan Dashboard
# Run: claude --model claude-fable-5 "Read sprints/BLUEPRINT_PROSPECTS_OPERATOR.md sprints/BLUEPRINT_DATA_SCHEMA.md then execute sprints/PHASE_4B_PREVIEW_ENGINE_INTEGRATED.md"

## CURRENT STATUS
Phase 1-5B: COMPLETE
Preview sekarang: manual (SPRINT_ZIRA_PREVIEW.md — copy dari base demo)
Target: Generate preview terus dari dashboard → prospect card

## PHASE 4B OBJECTIVE
Add "Generate Preview" button dalam setiap prospect card.
Click → generate HTML preview dari landingPageEngineData dalam leads.json.
Save ke DEMOS folder.
Update previewPath + previewStatus dalam dashboard.

CORE RULES:
- No AI API call untuk generate preview dalam phase ini
- Use static template approach (fill template dengan data prospect)
- Use existing DEMOS/aurelia-glow-skincare sebagai base template
- Add PREVIEW watermark wajib
- No fake data — kosong field = placeholder text sahaja
- Preserve all Phase 1-5B behavior

---

## TASK 1 — Preview Template Engine (server-side)

Create: tools/semi-auto-outreach/modules/previewBuilder.js

```javascript
const fs = require('fs');
const path = require('path');

const DEMOS_BASE = path.join(__dirname, '../../../../DEMOS');
const BASE_TEMPLATE = path.join(DEMOS_BASE, 'aurelia-glow-skincare');

function buildPreviewHTML(lead) {
  // Read base template
  const templateFiles = fs.readdirSync(BASE_TEMPLATE);
  const htmlFile = templateFiles.find(f => f.endsWith('.html'));
  if (!htmlFile) throw new Error('Base template HTML not found');

  let html = fs.readFileSync(path.join(BASE_TEMPLATE, htmlFile), 'utf8');
  const data = lead.landingPageEngineData || {};
  const info = data.businessInfo || {};
  const content = data.content || {};
  const contact = data.contactMedia || {};
  const ai = data.aiSuggested || {};

  const businessName = info.productBusinessName || lead.businessName || 'Business';
  const lokasi = lead.lokasi || info.address || '';
  const niche = info.niche || lead.niche || '';
  const waNumber = contact.whatsappNumber || lead.whatsapp || '';
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(businessName)}%2C%20saya%20nak%20tanya%20pakej%20dan%20slot%20booking`
    : 'https://wa.me/60XXXXXXXXX';

  // Build services list
  const servicesFormatted = content.servicesFormatted || [];
  const servicesHTML = servicesFormatted.length > 0
    ? servicesFormatted.map(s => {
        const [name, price] = s.split('|').map(x => x.trim());
        return `<div class="service-card"><strong>${name}</strong>${price ? `<span>${price}</span>` : ''}</div>`;
      }).join('')
    : '<div class="service-card"><strong>Hubungi kami untuk pakej terkini</strong></div>';

  // Replace content
  const replacements = {
    // Business name
    'Aurelia Glow': businessName,
    'Aurelia Beauty': businessName,
    'aurelia-glow': lead.id || businessName.toLowerCase().replace(/\s+/g, '-'),

    // WA links
    /https:\/\/wa\.me\/[^\s"']*/g: waLink,

    // Page title
    /<title>[^<]*<\/title>/: `<title>${businessName} | WhatsApp Booking Page Preview</title>`,
  };

  // Apply simple replacements
  html = html.replace(/Aurelia Glow[^<]*/g, businessName);
  html = html.replace(/Aurelia Beauty[^<]*/g, businessName);
  html = html.replace(/https:\/\/wa\.me\/[^\s"']*/g, waLink);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${businessName} | WhatsApp Booking Page Preview</title>`);

  // Inject watermark after <body> tag
  const watermark = `
<div style="position:fixed;top:0;left:0;right:0;z-index:9999;
  background:rgba(122,16,24,0.92);color:#fff;
  text-align:center;padding:8px 16px;
  font-size:12px;font-weight:700;letter-spacing:2px;
  pointer-events:none;">
  ⚠ PREVIEW SAHAJA — Belum Live | DealSense-MY
</div>
<div style="height:36px;"></div>`;

  html = html.replace(/<body[^>]*>/, match => match + watermark);

  return html;
}

function savePreview(lead, html) {
  const slug = lead.id || lead.businessName.toLowerCase().replace(/\s+/g,'-');
  const outDir = path.join(DEMOS_BASE, slug);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filename = `${slug}-preview.html`;
  const filepath = path.join(outDir, filename);
  fs.writeFileSync(filepath, html, 'utf8');

  return { slug, filepath, filename };
}

module.exports = { buildPreviewHTML, savePreview };
```

---

## TASK 2 — Backend Endpoint

In server.js, add:

```
POST /api/leads/:id/generate-preview
```

Logic:
1. Find lead by id
2. Call previewBuilder.buildPreviewHTML(lead)
3. Call previewBuilder.savePreview(lead, html)
4. Update lead fields:
   - previewSlug: slug
   - previewPath: filepath (full path)
   - previewUrl: `/previews/${slug}/${filename}`
   - previewStatus: "READY"
   - lastActionAt: now
5. Log event: PREVIEW_GENERATED
6. Save leads.json
7. Return: { ok: true, previewPath, previewUrl }

Also add static file serving for previews:
```javascript
app.use('/previews', express.static(DEMOS_BASE));
```

So preview accessible at:
http://localhost:3777/previews/[slug]/[slug]-preview.html

---

## TASK 3 — Frontend Button

In each unlocked prospect card, add button:

"🖼 Generate Preview"

Position: After Preview/Screenshot row, before DM Draft section.

Show only if: previewStatus === 'NOT_BUILT' OR previewStatus === ''

When clicked:
- Disable button, show: "Generating..."
- POST /api/leads/:id/generate-preview
- On success:
  - Update preview row: show filename as clickable link
  - Change button label: "✓ Preview Ready — Regenerate"
  - Show feedback: "Preview dijana. Klik link untuk tengok."
  - previewStatus in card updates to READY

When previewStatus = READY:
- Show: "✓ Preview Ready"
- Show clickable link to http://localhost:3777/previews/[slug]/[file]
- Show button: "Regenerate Preview"

---

## TASK 4 — Auto-append Preview Link to DM

When previewStatus = READY AND trackedPreviewUrl exists:
- Auto-append to DM textarea (if not already present):

```
\n\nLink preview: [previewUrl]
```

Do this when card loads, not on every keystroke.
If operator deletes it manually, do not re-add automatically.

---

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads.
3. "Generate Preview" button visible on unlocked cards.
4. Click → preview HTML generated in DEMOS folder.
5. Preview accessible at localhost:3777/previews/[slug]/[file].
6. Preview has PREVIEW watermark.
7. Preview shows business name (not "Aurelia Glow").
8. Preview shows correct WA link.
9. No fake prices, reviews, awards.
10. previewPath updated in leads.json.
11. previewStatus = READY after generate.
12. PREVIEW_GENERATED event logged.
13. Preview link visible in card.
14. DM draft auto-includes preview link.
15. Regenerate button works.
16. Locked cards do NOT show Generate Preview button.
17. All Phase 1-5B behavior preserved.
18. No auto-send added.

---

## MANUAL TEST CHECKLIST

1. Open localhost:3777
2. Go to Zira card
3. Confirm "Generate Preview" button visible
4. Click Generate Preview
5. Confirm "Generating..." shows
6. Confirm success feedback
7. Click preview link → opens in browser
8. Confirm PREVIEW watermark visible
9. Confirm "Zira Beauty Spa" shows (not Aurelia Glow)
10. Confirm WA button goes to 60165531496
11. Check DEMOS/zira-beauty-spa-ipoh/ folder → file exists
12. Check leads.json → previewStatus: "READY"
13. Check events → PREVIEW_GENERATED logged
14. Check DM draft → preview link appended

REPORT BACK: Phase 4B Build Report
STOP after Phase 4B. DO NOT proceed to Phase 6 until Aliff approves.
