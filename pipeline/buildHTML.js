/**
 * buildHTML.js — Builds a complete, conversion-optimized landing page HTML string.
 * Supports monolingual and multilingual (bilingual/trilingual) output.
 */

function escapeHTML(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function buildMapIframe(mapQuery) {
  if (!mapQuery) return ''
  const encodedQuery = encodeURIComponent(mapQuery)
  return `
    <section class="map-section">
      <div class="container">
        <h2 class="section-title" data-i18n="findUsTitle">Find Us</h2>
        <div class="map-wrapper">
          <iframe
            src="https://maps.google.com/maps?q=${encodedQuery}&output=embed&z=15"
            width="100%"
            height="350"
            style="border:0; border-radius: 12px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Business Location">
          </iframe>
        </div>
        <p class="map-address">${escapeHTML(mapQuery)}</p>
      </div>
    </section>`
}

function buildBenefitsSection(benefits, colorTheme, whyChooseTitle) {
  const icons = ['✓', '★', '⚡', '❤', '🔒', '💡', '🎯', '🏆']
  const items = benefits.map((b, i) => `
      <div class="benefit-card">
        <div class="benefit-icon" style="background: ${colorTheme.primary}20; color: ${colorTheme.primary};">
          ${icons[i % icons.length]}
        </div>
        <p class="benefit-text" data-i18n="benefit_${i}">${escapeHTML(b)}</p>
      </div>`).join('')

  return `
    <section class="benefits-section" style="background: ${colorTheme.secondary};">
      <div class="container">
        <h2 class="section-title" style="color: ${colorTheme.text};" data-i18n="whyChooseTitle">${escapeHTML(whyChooseTitle)}</h2>
        <div class="benefits-grid">
          ${items}
        </div>
      </div>
    </section>`
}

function buildFeaturesSection(features, colorTheme, whatWeOfferTitle) {
  if (!features || features.length === 0) return ''
  const items = features.map(f => `
      <li class="feature-item">
        <span class="feature-bullet" style="color: ${colorTheme.primary};">▸</span>
        <span>${escapeHTML(f)}</span>
      </li>`).join('')

  return `
    <section class="features-section">
      <div class="container">
        <h2 class="section-title" data-i18n="whatWeOfferTitle">${escapeHTML(whatWeOfferTitle)}</h2>
        <ul class="features-list">
          ${items}
        </ul>
      </div>
    </section>`
}

function buildUrgencyBadge(urgencyBadge) {
  if (!urgencyBadge) return ''
  return `<div class="urgency-badge" style="background: #ef4444; color: #fff;">
    ⚠️ Limited Slots Available — Act Now!
  </div>`
}

// Build lang toggle buttons for the navbar
function buildLangToggleButtons(langs) {
  const langLabels = { en: 'EN', bm: 'BM', zh: '中文' }
  return langs.map((l, i) => `<button class="lang-toggle-btn${i === 0 ? ' active' : ''}" onclick="setLang('${l}')">${langLabels[l] || l.toUpperCase()}</button>`).join('')
}

// Build the <script> block for multilingual i18n
function buildI18nScript(multilingual, langs, allBenefitsByLang) {
  // Build translation object
  const T = {}
  for (const lang of langs) {
    const c = multilingual[lang]
    T[lang] = {
      headline: c.headline,
      subheadline: c.subheadline,
      ctaText: c.ctaText,
      navbarCta: c.navbarCta,
      footerCta: c.footerCta,
      whatsappCta: c.whatsappCta,
      whyChooseTitle: c.whyChooseTitle,
      whatWeOfferTitle: c.whatWeOfferTitle,
      findUsTitle: c.findUsTitle,
      readyTitle: c.readyTitle,
      footerGetStarted: c.footerGetStarted,
    }
    // Add benefit translations
    const benefits = allBenefitsByLang[lang] || []
    benefits.forEach((b, i) => { T[lang][`benefit_${i}`] = b })
  }

  return `<script>
  const T = ${JSON.stringify(T, null, 2)};
  let currentLang = '${langs[0]}';

  function setLang(l) {
    if (!T[l]) return;
    currentLang = l;
    // Toggle active state on buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(b => {
      b.classList.toggle('active', b.textContent === (l === 'zh' ? '中文' : l.toUpperCase()));
    });
    // Fade transition
    document.body.style.opacity = '0.6';
    document.body.style.transition = 'opacity 0.2s';
    setTimeout(() => {
      // Update all data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (T[l][k] !== undefined) el.textContent = T[l][k];
      });
      // Update hrefs that have data-i18n-href
      document.querySelectorAll('[data-i18n-href]').forEach(el => {
        const k = el.getAttribute('data-i18n-href');
        if (T[l][k] !== undefined) el.textContent = T[l][k];
      });
      document.body.style.opacity = '1';
    }, 150);
  }
<\/script>`
}

export function buildHTML(normalized, decisions, aiContent) {
  const { productName, niche, features, benefits: inputBenefits, imageUrl, phoneNumber, address, mapQuery, outputLang } = normalized
  const { colorTheme, layout, fontFamily, urgencyBadge } = decisions
  const { headline, subheadline, ctaText, navbarCta, footerCta, whatsappCta,
          whyChooseTitle, whatWeOfferTitle, findUsTitle, readyTitle, footerGetStarted,
          benefits: aiBenefits, multilingual, langs } = aiContent

  const heroImage = imageUrl || '/assets/placeholder.svg'
  const waLink = phoneNumber ? `https://wa.me/${phoneNumber.replace('+', '')}` : '#'
  const isHeroCenter = layout === 'hero_center'
  const isMultilingual = multilingual !== null && langs && langs.length > 1

  const allBenefits = aiBenefits && aiBenefits.length > 0
    ? aiBenefits
    : (inputBenefits.length > 0 ? inputBenefits : ['Quality Service', 'Trusted Expertise', 'Great Results', 'Customer Satisfaction'])

  // For multilingual: build benefit map per language
  const allBenefitsByLang = {}
  if (isMultilingual) {
    for (const l of langs) {
      allBenefitsByLang[l] = multilingual[l].benefits && multilingual[l].benefits.length > 0
        ? multilingual[l].benefits
        : allBenefits
    }
  }

  const resolvedNavbarCta = navbarCta || '📱 WhatsApp Us'
  const resolvedFooterCta = footerCta || 'Contact Us Now'
  const resolvedWhyChooseTitle = whyChooseTitle || 'Why Choose Us?'
  const resolvedWhatWeOfferTitle = whatWeOfferTitle || 'What We Offer'
  const resolvedFindUsTitle = findUsTitle || 'Find Us'
  const resolvedReadyTitle = readyTitle || 'Ready to Get Started?'
  const resolvedFooterGetStarted = footerGetStarted || 'Contact us now and let us help you achieve the results you deserve.'

  // Lang toggle HTML (only for multilingual)
  const langToggleHTML = isMultilingual ? `
    <div class="lang-toggle-wrap">
      ${buildLangToggleButtons(langs)}
    </div>` : ''

  // Lang toggle CSS (only needed for multilingual)
  const langToggleCSS = isMultilingual ? `
    .lang-toggle-wrap { display: flex; gap: 6px; }
    .lang-toggle-btn {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1.5px solid rgba(255,255,255,0.4);
      background: transparent;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      transition: all 0.2s;
    }
    .lang-toggle-btn.active, .lang-toggle-btn:hover {
      background: rgba(255,255,255,0.2);
      color: #fff;
      border-color: rgba(255,255,255,0.8);
    }` : ''

  // i18n script (only for multilingual)
  const i18nScript = isMultilingual ? buildI18nScript(multilingual, langs, allBenefitsByLang) : ''

  return `<!DOCTYPE html>
<html lang="${langs ? langs[0] : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(subheadline)}">
  <title>${escapeHTML(productName)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: ${colorTheme.primary};
      --secondary: ${colorTheme.secondary};
      --accent: ${colorTheme.accent};
      --text: ${colorTheme.text};
      --light: ${colorTheme.light};
      --font: ${fontFamily};
    }

    body {
      font-family: var(--font);
      color: var(--text);
      background: #fff;
      line-height: 1.6;
      overflow-x: hidden;
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

    .urgency-badge {
      text-align: center;
      padding: 10px 20px;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
    }

    .navbar {
      background: #fff;
      border-bottom: 1px solid ${colorTheme.secondary};
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .navbar .container { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .navbar-brand { font-size: 1.25rem; font-weight: 700; color: var(--primary); text-decoration: none; }
    .navbar-right { display: flex; align-items: center; gap: 12px; }
    .navbar-cta {
      background: var(--primary);
      color: #fff;
      padding: 10px 22px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s, transform 0.2s;
      white-space: nowrap;
    }
    .navbar-cta:hover { background: var(--accent); transform: translateY(-1px); }

    ${langToggleCSS}

    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: #fff;
      padding: 80px 0;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%; right: -10%;
      width: 600px; height: 600px;
      background: rgba(255,255,255,0.06);
      border-radius: 50%;
    }
    .hero .container {
      display: flex;
      align-items: center;
      gap: 60px;
      ${isHeroCenter ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'}
      position: relative;
      z-index: 1;
    }
    .hero-content { flex: 1; }
    .hero-tag {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      color: #fff;
      padding: 4px 14px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .hero-headline {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
      text-shadow: 0 2px 12px rgba(0,0,0,0.15);
    }
    .hero-subheadline {
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      opacity: 0.9;
      margin-bottom: 36px;
      max-width: 520px;
      ${isHeroCenter ? 'margin-left: auto; margin-right: auto;' : ''}
    }
    .hero-cta-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      ${isHeroCenter ? 'justify-content: center;' : ''}
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #fff;
      color: var(--primary);
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 1.05rem;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
    .hero-image-wrap {
      flex: 0 0 420px;
      max-width: 420px;
      ${isHeroCenter ? 'width: 100%; max-width: 500px;' : ''}
    }
    .hero-image-wrap img {
      width: 100%;
      height: 320px;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.3);
    }

    .benefits-section { padding: 80px 0; }
    .section-title {
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 48px;
      color: var(--text);
    }
    .section-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: var(--primary);
      margin: 12px auto 0;
      border-radius: 2px;
    }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
    .benefit-card {
      background: #fff;
      border-radius: 16px;
      padding: 28px 24px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
    .benefit-icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 16px;
    }
    .benefit-text { font-size: 0.97rem; color: #444; font-weight: 500; line-height: 1.5; }

    .features-section { padding: 72px 0; background: var(--light); }
    .features-list {
      list-style: none;
      max-width: 700px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fff;
      padding: 18px 20px;
      border-radius: 10px;
      font-size: 0.97rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .feature-bullet { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }

    .map-section { padding: 72px 0; background: #fff; }
    .map-wrapper { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .map-address { text-align: center; margin-top: 16px; color: #666; font-size: 0.95rem; }

    .footer-cta {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: #fff;
      padding: 72px 20px;
      text-align: center;
    }
    .footer-cta h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; margin-bottom: 16px; }
    .footer-cta p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 36px; max-width: 500px; margin-left: auto; margin-right: auto; }

    .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px 20px; font-size: 0.85rem; }
    .footer a { color: var(--primary); text-decoration: none; }

    @media (max-width: 768px) {
      .hero { padding: 60px 0; }
      .hero .container { flex-direction: column !important; text-align: center !important; gap: 40px; }
      .hero-image-wrap { flex: unset; max-width: 100%; width: 100%; }
      .hero-cta-group { justify-content: center !important; }
      .hero-subheadline { margin-left: auto; margin-right: auto; }
      .benefits-grid { grid-template-columns: 1fr 1fr; }
      .navbar .container { gap: 8px; }
      .navbar-right { gap: 8px; }
    }
    @media (max-width: 480px) {
      .benefits-grid { grid-template-columns: 1fr; }
      .features-list { grid-template-columns: 1fr; }
      .hero-headline { font-size: 1.9rem; }
      .btn-primary { padding: 14px 24px; font-size: 0.95rem; }
    }
  </style>
</head>
<body>
  ${buildUrgencyBadge(urgencyBadge)}

  <nav class="navbar">
    <div class="container">
      <a href="#" class="navbar-brand">${escapeHTML(productName)}</a>
      <div class="navbar-right">
        ${langToggleHTML}
        <a href="${waLink}" class="navbar-cta" target="_blank" rel="noopener" data-i18n="navbarCta">
          ${escapeHTML(resolvedNavbarCta)}
        </a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-tag">${escapeHTML(niche.replace(/_/g, ' '))}</span>
        <h1 class="hero-headline" data-i18n="headline">${escapeHTML(headline)}</h1>
        <p class="hero-subheadline" data-i18n="subheadline">${escapeHTML(subheadline)}</p>
        <div class="hero-cta-group">
          <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
            <span>💬</span>
            <span data-i18n="ctaText">${escapeHTML(ctaText)}</span>
          </a>
        </div>
      </div>
      <div class="hero-image-wrap">
        <img src="${escapeHTML(heroImage)}" alt="${escapeHTML(productName)}" loading="eager" onerror="this.src='/assets/placeholder.svg'">
      </div>
    </div>
  </section>

  ${buildBenefitsSection(allBenefits, colorTheme, resolvedWhyChooseTitle)}

  ${buildFeaturesSection(features, colorTheme, resolvedWhatWeOfferTitle)}

  ${buildMapIframe(mapQuery)}

  <section class="footer-cta">
    <div class="container">
      <h2 data-i18n="readyTitle">${escapeHTML(resolvedReadyTitle)}</h2>
      <p data-i18n="footerGetStarted">${escapeHTML(resolvedFooterGetStarted)}</p>
      <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
        <span>💬</span>
        <span data-i18n="ctaText">${escapeHTML(ctaText)}</span>
      </a>
    </div>
  </section>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${escapeHTML(productName)}${address ? ` · ${escapeHTML(address)}` : ''}${phoneNumber ? ` · <a href="${waLink}" target="_blank">WhatsApp</a>` : ''}</p>
  </footer>

  ${i18nScript}
</body>
</html>`
}
