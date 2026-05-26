/**
 * previewRenderer.js — Controls the preview iframe.
 *
 * Mode 1: setHTML(html)    → directly sets iframe.srcdoc (initial server render)
 * Mode 2: render(data)     → calls buildHTMLFromJSON(data) → sets iframe.srcdoc (live editing)
 * Export: exportHTML()     → Blob download, no backend
 */

// ── Escape helper (mirrors server-side escapeHTML) ──────────────────────────
function escapeHTML(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// ── Build map iframe snippet ─────────────────────────────────────────────────
function buildMapIframe(mapQuery) {
  if (!mapQuery) return ''
  const encodedQuery = encodeURIComponent(mapQuery)
  return `
    <section class="map-section">
      <div class="container">
        <h2 class="section-title">Find Us</h2>
        <div class="map-wrapper">
          <iframe
            src="https://maps.google.com/maps?q=${encodedQuery}&output=embed&z=15"
            width="100%" height="350"
            style="border:0;border-radius:12px;"
            allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Business Location">
          </iframe>
        </div>
        <p class="map-address">${escapeHTML(mapQuery)}</p>
      </div>
    </section>`
}

// ── Build HTML string from JSON data (client-side template) ─────────────────
function buildHTMLFromJSON(d) {
  const colorTheme = d.colorTheme || {
    primary: '#6366f1', secondary: '#eef2ff', accent: '#4f46e5',
    text: '#1e1b4b', light: '#f5f3ff', name: 'indigo',
  }
  const fontFamily = d.fontFamily || "'Segoe UI', system-ui, sans-serif"
  const isCenter = d.layout === 'hero_center'

  const waPhone = (d.phoneNumber || '').replace('+', '')
  const waMsg = d.whatsappMessage ? `?text=${encodeURIComponent(d.whatsappMessage)}` : ''
  const waLink = waPhone ? `https://wa.me/${waPhone}${waMsg}` : '#'
  const heroImage = d.imageUrl || '/assets/placeholder.svg'
  const allBenefits = (d.benefits && d.benefits.length > 0)
    ? d.benefits
    : (d.inputBenefits && d.inputBenefits.length > 0 ? d.inputBenefits : ['Quality Service', 'Trusted Expertise', 'Great Results', 'Customer Satisfaction'])

  const benefitIcons = ['✓', '★', '⚡', '❤', '🔒', '💡', '🎯', '🏆']
  const benefitCards = allBenefits.map((b, i) => `
    <div class="benefit-card">
      <div class="benefit-icon" style="background:${colorTheme.primary}20;color:${colorTheme.primary};">${benefitIcons[i % benefitIcons.length]}</div>
      <p class="benefit-text">${escapeHTML(b)}</p>
    </div>`).join('')

  const featureItems = (d.features && d.features.length > 0)
    ? d.features.map(f => `<li class="feature-item"><span class="feature-bullet" style="color:${colorTheme.primary};">▸</span><span>${escapeHTML(f)}</span></li>`).join('')
    : ''

  const featuresSection = featureItems ? `
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">What We Offer</h2>
        <ul class="features-list">${featureItems}</ul>
      </div>
    </section>` : ''

  const urgencyBar = d.urgencyBadge
    ? `<div class="urgency-badge" style="background:#ef4444;color:#fff;">⚠️ Limited Slots Available — Act Now!</div>`
    : ''

  const mapSection = (d.mapQuery || d.address) ? buildMapIframe(d.mapQuery || d.address) : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(d.productName || 'Landing Page')}</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--primary:${colorTheme.primary};--secondary:${colorTheme.secondary};--accent:${colorTheme.accent};--text:${colorTheme.text};--light:${colorTheme.light}}
    body{font-family:${fontFamily};color:var(--text);background:#fff;line-height:1.6;overflow-x:hidden}
    .container{max-width:1100px;margin:0 auto;padding:0 20px}
    .urgency-badge{text-align:center;padding:10px 20px;font-weight:700;font-size:.95rem;letter-spacing:.5px}
    .navbar{background:#fff;border-bottom:1px solid var(--secondary);padding:16px 0;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.06)}
    .navbar .container{display:flex;align-items:center;justify-content:space-between}
    .navbar-brand{font-size:1.25rem;font-weight:700;color:var(--primary);text-decoration:none}
    .navbar-cta{background:var(--primary);color:#fff;padding:10px 22px;border-radius:50px;text-decoration:none;font-weight:600;font-size:.9rem;transition:background .2s,transform .2s}
    .navbar-cta:hover{background:var(--accent);transform:translateY(-1px)}
    .hero{background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%);color:#fff;padding:80px 0;position:relative;overflow:hidden}
    .hero::before{content:'';position:absolute;top:-50%;right:-10%;width:600px;height:600px;background:rgba(255,255,255,.06);border-radius:50%}
    .hero .container{display:flex;align-items:center;gap:60px;${isCenter ? 'flex-direction:column;text-align:center;' : 'flex-direction:row;'}position:relative;z-index:1}
    .hero-content{flex:1}
    .hero-tag{display:inline-block;background:rgba(255,255,255,.2);color:#fff;padding:4px 14px;border-radius:50px;font-size:.8rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px}
    .hero-headline{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;line-height:1.2;margin-bottom:20px;text-shadow:0 2px 12px rgba(0,0,0,.15)}
    .hero-subheadline{font-size:clamp(1rem,2.5vw,1.2rem);opacity:.9;margin-bottom:36px;max-width:520px;${isCenter ? 'margin-left:auto;margin-right:auto;' : ''}}
    .hero-cta-group{display:flex;gap:16px;flex-wrap:wrap;${isCenter ? 'justify-content:center;' : ''}}
    .btn-primary{display:inline-flex;align-items:center;gap:10px;background:#fff;color:var(--primary);padding:16px 32px;border-radius:50px;font-size:1.05rem;font-weight:700;text-decoration:none;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 20px rgba(0,0,0,.2)}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.25)}
    .hero-image-wrap{flex:0 0 420px;max-width:420px;${isCenter ? 'width:100%;max-width:500px;' : ''}}
    .hero-image-wrap img{width:100%;height:320px;object-fit:cover;border-radius:20px;box-shadow:0 16px 48px rgba(0,0,0,.3)}
    .benefits-section{padding:80px 0;background:var(--secondary)}
    .section-title{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;text-align:center;margin-bottom:48px;color:var(--text)}
    .section-title::after{content:'';display:block;width:60px;height:4px;background:var(--primary);margin:12px auto 0;border-radius:2px}
    .benefits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}
    .benefit-card{background:#fff;border-radius:16px;padding:28px 24px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,.06);transition:transform .2s,box-shadow .2s}
    .benefit-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.1)}
    .benefit-icon{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 16px}
    .benefit-text{font-size:.97rem;color:#444;font-weight:500;line-height:1.5}
    .features-section{padding:72px 0;background:var(--light)}
    .features-list{list-style:none;max-width:700px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
    .feature-item{display:flex;align-items:flex-start;gap:12px;background:#fff;padding:18px 20px;border-radius:10px;font-size:.97rem;box-shadow:0 2px 8px rgba(0,0,0,.05)}
    .feature-bullet{font-size:1.1rem;flex-shrink:0;margin-top:1px}
    .map-section{padding:72px 0;background:#fff}
    .map-wrapper{border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.1)}
    .map-address{text-align:center;margin-top:16px;color:#666;font-size:.95rem}
    .footer-cta{background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%);color:#fff;padding:72px 20px;text-align:center}
    .footer-cta h2{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:800;margin-bottom:16px}
    .footer-cta p{font-size:1.1rem;opacity:.9;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto}
    .footer{background:#1a1a2e;color:#aaa;text-align:center;padding:24px 20px;font-size:.85rem}
    .footer a{color:var(--primary);text-decoration:none}
    @media(max-width:768px){.hero{padding:60px 0}.hero .container{flex-direction:column!important;text-align:center!important;gap:40px}.hero-image-wrap{flex:unset;max-width:100%;width:100%}.hero-cta-group{justify-content:center!important}.hero-subheadline{margin-left:auto;margin-right:auto}.benefits-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:480px){.benefits-grid{grid-template-columns:1fr}.features-list{grid-template-columns:1fr}.hero-headline{font-size:1.9rem}.btn-primary{padding:14px 24px;font-size:.95rem}}
  </style>
</head>
<body>
  ${urgencyBar}
  <nav class="navbar">
    <div class="container">
      <a href="#" class="navbar-brand">${escapeHTML(d.productName || 'Business')}</a>
      <a href="${waLink}" class="navbar-cta" target="_blank" rel="noopener">📱 WhatsApp Us</a>
    </div>
  </nav>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-tag">${escapeHTML((d.niche || 'general').replace(/_/g, ' '))}</span>
        <h1 class="hero-headline">${escapeHTML(d.headline || d.productName || '')}</h1>
        <p class="hero-subheadline">${escapeHTML(d.subheadline || '')}</p>
        <div class="hero-cta-group">
          <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
            <span>💬</span> ${escapeHTML(d.ctaText || 'Contact Us')}
          </a>
        </div>
      </div>
      <div class="hero-image-wrap">
        <img src="${escapeHTML(heroImage)}" alt="${escapeHTML(d.productName || '')}" loading="eager" onerror="this.src='/assets/placeholder.svg'">
      </div>
    </div>
  </section>
  <section class="benefits-section">
    <div class="container">
      <h2 class="section-title" style="color:${colorTheme.text};">Why Choose Us?</h2>
      <div class="benefits-grid">${benefitCards}</div>
    </div>
  </section>
  ${featuresSection}
  ${mapSection}
  <section class="footer-cta">
    <div class="container">
      <h2>Ready to Get Started?</h2>
      <p>Contact us now and let us help you achieve the results you deserve.</p>
      <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
        <span>💬</span> ${escapeHTML(d.ctaText || 'Contact Us')}
      </a>
    </div>
  </section>
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${escapeHTML(d.productName || '')}${d.address ? ` · ${escapeHTML(d.address)}` : ''}${waPhone ? ` · <a href="${waLink}" target="_blank">WhatsApp</a>` : ''}</p>
  </footer>
</body>
</html>`
}

// ── Renderer singleton ───────────────────────────────────────────────────────
export const previewRenderer = {
  _iframe: null,
  _currentHTML: '',

  init(iframeEl) {
    this._iframe = iframeEl
  },

  /** Mode 1: directly inject raw server HTML */
  setHTML(html) {
    this._currentHTML = html
    if (this._iframe) {
      this._iframe.srcdoc = html
    }
  },

  /** Mode 2: rebuild HTML from JSON data (live editor, zero fetch) */
  render(data) {
    const html = buildHTMLFromJSON(data)
    this._currentHTML = html
    if (this._iframe) {
      this._iframe.srcdoc = html
    }
  },

  /** Client-side Blob download — no backend involved */
  exportHTML() {
    if (!this._currentHTML) {
      alert('Nothing to export yet. Generate a landing page first.')
      return
    }
    const blob = new Blob([this._currentHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `landing-page-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}
