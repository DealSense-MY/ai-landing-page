const fs   = require('fs');
const path = require('path');

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const DEMOS_BASE    = path.join(__dirname, '../../../DEMOS');
const BASE_TEMPLATE = path.join(DEMOS_BASE, 'aurelia-glow-skincare', 'aurelia-glow-v2-LATEST.html');

function buildPreviewHTML(lead) {
  if (!fs.existsSync(BASE_TEMPLATE)) throw new Error('Base template not found: ' + BASE_TEMPLATE);

  let html = fs.readFileSync(BASE_TEMPLATE, 'utf8');
  const data    = lead.landingPageEngineData || {};
  const info    = data.businessInfo  || {};
  const content = data.content       || {};
  const contact = data.contactMedia  || {};

  const businessName    = info.productBusinessName || lead.businessName || 'Business';
  const safeName        = escapeHtml(businessName);
  const waNumberRaw     = contact.whatsappNumber || lead.whatsapp || '';
  const waNumber        = waNumberRaw.replace(/[^0-9]/g, '');
  const waLink          = waNumber
    ? `https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(businessName)}%2C%20saya%20nak%20tanya%20pakej%20dan%20slot%20booking`
    : 'https://wa.me/60XXXXXXXXX';

  // Build services list
  const servicesFormatted = content.servicesFormatted || [];
  const servicesHTML = servicesFormatted.length > 0
    ? servicesFormatted.map(s => {
        const [name, price] = s.split('|').map(x => x.trim());
        return `<div class="service-card"><strong>${escapeHtml(name)}</strong>${price ? `<span>${escapeHtml(price)}</span>` : ''}</div>`;
      }).join('')
    : '<div class="service-card"><strong>Hubungi kami untuk pakej terkini</strong></div>';

  // Replace business name occurrences — callback form prevents $-pattern injection
  html = html.replace(/Aurelia Glow[^<]*/g, () => safeName);
  html = html.replace(/Aurelia Beauty[^<]*/g, () => safeName);
  const safeSlug = (lead.id || businessName.toLowerCase().replace(/\s+/g, '-')).replace(/[^a-z0-9_-]/gi, '');
  html = html.replace(/aurelia-glow/g, () => safeSlug);

  // Replace WA links
  html = html.replace(/https:\/\/wa\.me\/[^\s"']*/g, () => waLink);

  // Replace page title
  html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${safeName} | WhatsApp Booking Page Preview</title>`);

  // Inject PREVIEW watermark immediately after <body>
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
  const rawSlug = lead.id || lead.businessName.toLowerCase().replace(/\s+/g, '-');
  const slug    = String(rawSlug).replace(/[^a-z0-9_-]/gi, '').slice(0, 64);
  if (!slug) throw new Error('Invalid lead slug — cannot save preview');

  const outDir = path.resolve(DEMOS_BASE, slug);
  const base   = path.resolve(DEMOS_BASE);
  if (!outDir.startsWith(base + path.sep) && outDir !== base) {
    throw new Error('Path traversal blocked for slug: ' + rawSlug);
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filename = `${slug}-preview.html`;
  const filepath = path.join(outDir, filename);
  fs.writeFileSync(filepath, html, 'utf8');

  return { slug, filepath, filename };
}

module.exports = { buildPreviewHTML, savePreview };
