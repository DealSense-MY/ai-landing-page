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

function buildWaLink(phoneNumber, whatsappMessage) {
  if (!phoneNumber) return '#'
  const num = phoneNumber.replace('+', '')
  if (!whatsappMessage) return `https://wa.me/${num}`
  return `https://wa.me/${num}?text=${encodeURIComponent(whatsappMessage)}`
}

function buildMapIframe(mapQuery, findUsTitle) {
  if (!mapQuery) return ''
  const encodedQuery = encodeURIComponent(mapQuery)
  return `
    <section class="map-section">
      <div class="container">
        <h2 class="section-title" data-i18n="findUsTitle">${escapeHTML(findUsTitle || 'Find Us')}</h2>
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
  const fallbackIcons = ['✓', '★', '⚡', '❤', '🔒', '💡', '🎯', '🏆']
  const items = benefits.map((b, i) => {
    const icon = (b && b.icon) ? b.icon : fallbackIcons[i % fallbackIcons.length]
    const title = (b && b.title) ? b.title : String(b)
    const desc = (b && b.description) ? b.description : ''
    return `
      <div class="benefit-card">
        <div class="benefit-icon" style="background: ${colorTheme.primary}20; color: ${colorTheme.primary};">
          ${escapeHTML(icon)}
        </div>
        <h3 class="benefit-title" data-i18n="benefit_title_${i}">${escapeHTML(title)}</h3>
        ${desc ? `<p class="benefit-desc" data-i18n="benefit_desc_${i}">${escapeHTML(desc)}</p>` : ''}
      </div>`
  }).join('')

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

function buildServicesSection(services, colorTheme, servicesTitle) {
  if (!services || services.length === 0) return ''
  const cards = services.map(s => `
      <div class="service-card">
        <div class="service-name">${escapeHTML(s.name)}</div>
        ${s.price ? `<div class="service-price">${escapeHTML(s.price)}</div>` : ''}
      </div>`).join('')

  return `
    <section class="services-section">
      <div class="container">
        <h2 class="section-title" data-i18n="servicesTitle">${escapeHTML(servicesTitle || 'Our Services')}</h2>
        <div class="services-grid">
          ${cards}
        </div>
      </div>
    </section>`
}

function buildGallerySection(galleryImages, galleryTitle) {
  if (!galleryImages || galleryImages.length === 0) return ''
  const imgs = galleryImages.map(url => `
      <div class="gallery-item">
        <img src="${escapeHTML(url)}" alt="Gallery" loading="lazy" onerror="this.parentElement.style.display='none'">
      </div>`).join('')

  return `
    <section class="gallery-section">
      <div class="container">
        <h2 class="section-title" data-i18n="galleryTitle">${escapeHTML(galleryTitle || 'Our Gallery')}</h2>
        <div class="gallery-grid">
          ${imgs}
        </div>
      </div>
    </section>`
}

function buildBeforeAfterSection(pairs, resultsTitle) {
  if (!pairs || pairs.length === 0) return ''
  const cards = pairs.map(p => `
      <div class="ba-pair">
        <div class="ba-card">
          <span class="ba-label ba-label--before">Before</span>
          <img src="${escapeHTML(p.before)}" alt="Before" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
        <div class="ba-card">
          <span class="ba-label ba-label--after">After</span>
          <img src="${escapeHTML(p.after)}" alt="After" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
      </div>`).join('')

  return `
    <section class="ba-section">
      <div class="container">
        <h2 class="section-title" data-i18n="resultsTitle">${escapeHTML(resultsTitle || 'Our Results')}</h2>
        <div class="ba-grid">
          ${cards}
        </div>
      </div>
    </section>`
}

function buildReviewsSection(reviews, reviewsTitle) {
  if (!reviews || reviews.length === 0) return ''
  const stars = n => `<span style="color:#FFD700;">${'★'.repeat(Math.min(5, Math.max(1, parseInt(n) || 5)))}</span>`
  const cards = reviews.map(r => `
      <div class="review-card">
        <div class="review-stars">${stars(r.rating)}</div>
        <p class="review-quote">"${escapeHTML(r.quote)}"</p>
        <div class="review-footer">
          <span class="review-name">${escapeHTML(r.name)}</span>
          ${r.date ? `<span class="review-date">${escapeHTML(r.date)}</span>` : ''}
        </div>
      </div>`).join('')

  return `
    <section class="reviews-section">
      <div class="container">
        <h2 class="section-title" data-i18n="reviewsTitle">${escapeHTML(reviewsTitle || 'What Our Customers Say')}</h2>
        <div class="reviews-grid">
          ${cards}
        </div>
      </div>
    </section>`
}

function buildSocialProofBadge(googleRating, totalReviews) {
  if (!googleRating) return ''
  const reviewText = totalReviews
    ? `<span class="review-count" data-i18n="googleReviewsText">· ${escapeHTML(totalReviews)} Google Reviews</span>`
    : ''
  return `<div class="social-proof-badge">
    <span class="star-icon">⭐</span>
    <strong>${escapeHTML(googleRating)}</strong>
    ${reviewText}
  </div>`
}

function buildUrgencyBadge(urgencyBadge) {
  if (!urgencyBadge) return ''
  return `<div class="urgency-badge" style="background: #ef4444; color: #fff;">
    ⚠️ Limited Slots Available — Act Now!
  </div>`
}

function buildWhatsAppFloat(waLink) {
  if (!waLink || waLink === '#') return ''
  return `
  <a href="${waLink}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>`
}

// Build lang toggle buttons for the navbar
function buildLangToggleButtons(langs) {
  const langLabels = { en: 'EN', bm: 'BM', zh: '中文' }
  return langs.map((l, i) => `<button class="lang-toggle-btn${i === 0 ? ' active' : ''}" onclick="setLang('${l}')">${langLabels[l] || l.toUpperCase()}</button>`).join('')
}

// Build the <script> block for multilingual i18n
function buildI18nScript(multilingual, langs, allBenefitsByLang) {
  const T = {}
  for (const lang of langs) {
    const c = multilingual[lang]
    const googleReviewsText = { en: 'Google Reviews', bm: 'Ulasan Google', zh: '谷歌评价' }
    T[lang] = {
      headline: c.headline,
      subheadline: c.subheadline,
      ctaText: c.ctaText,
      navbarCta: c.navbarCta,
      footerCta: c.footerCta,
      whatsappCta: c.whatsappCta,
      whyChooseTitle: c.whyChooseTitle,
      whatWeOfferTitle: c.whatWeOfferTitle,
      servicesTitle: c.servicesTitle,
      galleryTitle: c.galleryTitle,
      resultsTitle: c.resultsTitle,
      reviewsTitle: c.reviewsTitle,
      findUsTitle: c.findUsTitle,
      readyTitle: c.readyTitle,
      footerGetStarted: c.footerGetStarted,
      googleReviewsText: googleReviewsText[lang] || 'Google Reviews',
    }
    const benefits = allBenefitsByLang[lang] || []
    benefits.forEach((b, i) => {
      T[lang][`benefit_title_${i}`] = (b && b.title) ? b.title : String(b)
      if (b && b.description) T[lang][`benefit_desc_${i}`] = b.description
    })
  }

  return `<script>
  const T = ${JSON.stringify(T, null, 2)};
  let currentLang = '${langs[0]}';

  function setLang(l) {
    if (!T[l]) return;
    currentLang = l;
    document.querySelectorAll('.lang-toggle-btn').forEach(b => {
      b.classList.toggle('active', b.textContent === (l === 'zh' ? '中文' : l.toUpperCase()));
    });
    document.body.style.opacity = '0.6';
    document.body.style.transition = 'opacity 0.2s';
    setTimeout(() => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (T[l][k] !== undefined) el.textContent = T[l][k];
      });
      document.querySelectorAll('[data-i18n-href]').forEach(el => {
        const k = el.getAttribute('data-i18n-href');
        if (T[l][k] !== undefined) el.textContent = T[l][k];
      });
      document.body.style.opacity = '1';
    }, 150);
  }
<\/script>`
}

function buildContactDetails(normalized) {
  const { email, landline, operatingHours, ownerName } = normalized
  const items = []
  if (operatingHours) items.push(`<div class="contact-detail">🕐 ${escapeHTML(operatingHours)}</div>`)
  if (email) items.push(`<div class="contact-detail">✉️ <a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a></div>`)
  if (landline) items.push(`<div class="contact-detail">📞 <a href="tel:${escapeHTML(landline)}">${escapeHTML(landline)}</a></div>`)
  if (ownerName) items.push(`<div class="contact-detail">👤 Led by ${escapeHTML(ownerName)}</div>`)
  return items.join('\n        ')
}

export function buildHTML(normalized, decisions, aiContent) {
  const {
    productName, tagline, niche, features, benefits: inputBenefits,
    imageUrl, logoUrl, phoneNumber, address, mapQuery, outputLang,
    services, customerReviews, galleryImages, beforeAfterImages,
    googleRating, totalReviews,
  } = normalized
  const { colorTheme, layout, fontFamily, urgencyBadge } = decisions
  const {
    headline, subheadline, ctaText, navbarCta, footerCta, whatsappCta,
    whyChooseTitle, whatWeOfferTitle, servicesTitle, galleryTitle, resultsTitle, reviewsTitle,
    findUsTitle, readyTitle, footerGetStarted,
    whatsappMessage,
    benefits: aiBenefits, reviews: aiReviews, multilingual, langs,
  } = aiContent

  const heroImage = imageUrl || '/assets/placeholder.svg'
  const waLink = buildWaLink(phoneNumber, whatsappMessage)
  const isHeroCenter = layout === 'hero_center'
  const isMultilingual = multilingual !== null && langs && langs.length > 1

  const allBenefits = aiBenefits && aiBenefits.length > 0
    ? aiBenefits
    : (inputBenefits.length > 0 ? inputBenefits : ['Quality Service', 'Trusted Expertise', 'Great Results', 'Customer Satisfaction'])

  // User-provided reviews take priority; fall back to AI-generated
  const resolvedReviews = customerReviews && customerReviews.length > 0
    ? customerReviews
    : (aiReviews && aiReviews.length > 0 ? aiReviews : [])

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
  const resolvedServicesTitle = servicesTitle || 'Our Services'
  const resolvedGalleryTitle = galleryTitle || 'Our Gallery'
  const resolvedResultsTitle = resultsTitle || 'Our Results'
  const resolvedReviewsTitle = reviewsTitle || 'What Our Customers Say'
  const resolvedFindUsTitle = findUsTitle || 'Find Us'
  const resolvedReadyTitle = readyTitle || 'Ready to Get Started?'
  const resolvedFooterGetStarted = footerGetStarted || 'Contact us now and let us help you achieve the results you deserve.'

  const langToggleHTML = isMultilingual ? `
    <div class="lang-toggle-wrap">
      ${buildLangToggleButtons(langs)}
    </div>` : ''

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

  const i18nScript = isMultilingual ? buildI18nScript(multilingual, langs, allBenefitsByLang) : ''

  const pageTitle = tagline
    ? `${productName} — ${tagline}`
    : `${productName} — ${niche.replace(/_/g, ' ')}`

  const contactDetails = buildContactDetails(normalized)
  const navLogoImg = logoUrl
    ? `<img src="${escapeHTML(logoUrl)}" alt="${escapeHTML(productName)} logo" style="height:36px;object-fit:contain;margin-right:8px;">`
    : ''

  return `<!DOCTYPE html>
<html lang="${langs ? langs[0] : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(subheadline)}">
  <meta property="og:title" content="${escapeHTML(productName)}">
  <meta property="og:description" content="${escapeHTML(subheadline)}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHTML(imageUrl)}">` : ''}
  <title>${escapeHTML(pageTitle)}</title>
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
    .navbar-brand { display: flex; align-items: center; font-size: 1.25rem; font-weight: 700; color: var(--primary); text-decoration: none; }
    .navbar-right { display: flex; align-items: center; gap: 12px; }
    .navbar-cta {
      background: #25D366;
      color: #fff;
      padding: 10px 22px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s, transform 0.2s;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .navbar-cta:hover { background: #1da851; transform: translateY(-1px); }

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
    .social-proof-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.88rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .social-proof-badge .star-icon { color: #FFD700; }
    .social-proof-badge .review-count { opacity: 0.85; font-weight: 400; }
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
      background: #25D366;
      color: #fff;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 1.05rem;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); background: #1da851; }
    .hero-image-wrap {
      flex: 1;
      max-width: 50%;
      ${isHeroCenter ? 'width: 100%; max-width: 500px;' : ''}
    }
    .hero-image-wrap img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
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
    .benefit-title { font-size: 1rem; color: var(--text); font-weight: 700; margin-bottom: 8px; line-height: 1.4; }
    .benefit-desc { font-size: 0.88rem; color: #666; font-weight: 400; line-height: 1.5; }

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

    /* Services */
    .services-section { padding: 72px 0; background: #fff; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .service-card {
      background: var(--light, #f8f9ff);
      border: 1px solid ${colorTheme.secondary};
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .service-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .service-name { font-weight: 700; font-size: 1rem; color: var(--text); margin-bottom: 6px; }
    .service-price { font-size: 0.9rem; color: var(--primary); font-weight: 600; }

    /* Gallery */
    .gallery-section { padding: 72px 0; background: var(--light, #f8f9ff); }
    .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .gallery-item { aspect-ratio: 1; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .gallery-item img:hover { transform: scale(1.05); }

    /* Before / After */
    .ba-section { padding: 72px 0; background: #fff; }
    .ba-grid { display: flex; flex-direction: column; gap: 32px; }
    .ba-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .ba-card { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .ba-card img { width: 100%; height: 240px; object-fit: cover; display: block; }
    .ba-label {
      position: absolute;
      top: 12px; left: 12px;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ba-label--before { background: #6b7280; color: #fff; }
    .ba-label--after { background: #25D366; color: #fff; }

    /* Reviews */
    .reviews-section { padding: 72px 0; background: var(--light, #f8f9ff); }
    .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .review-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
    }
    .review-stars { font-size: 1.1rem; margin-bottom: 12px; }
    .review-quote { font-size: 0.94rem; color: #444; font-style: italic; line-height: 1.6; margin-bottom: 16px; flex: 1; }
    .review-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .review-name { font-weight: 700; color: var(--text); font-size: 0.9rem; }
    .review-date { color: #999; font-size: 0.8rem; }

    /* Contact details */
    .contact-details { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
    .contact-detail { font-size: 0.95rem; color: #666; }
    .contact-detail a { color: var(--primary); text-decoration: none; }
    .contact-detail a:hover { text-decoration: underline; }

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

    .footer { background: #1a1a2e; color: #aaa; padding: 40px 20px 24px; font-size: 0.85rem; }
    .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1100px; margin: 0 auto 24px; }
    .footer-col h4 { color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; }
    .footer-info-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 0.88rem; color: #999; }
    .footer-info-item a { color: #bbb; text-decoration: none; }
    .footer-info-item a:hover { color: #fff; }
    .footer-copy { text-align: center; border-top: 1px solid #2a2a3e; padding-top: 20px; max-width: 1100px; margin: 0 auto; }
    .footer a { color: var(--primary); text-decoration: none; }
    @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; gap: 20px; } }

    /* WhatsApp Float */
    .whatsapp-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #25D366;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 999;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .whatsapp-float:hover { transform: scale(1.1); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }

    @media (max-width: 768px) {
      .hero { padding: 60px 0; }
      .hero .container { flex-direction: column !important; text-align: center !important; gap: 40px; }
      .hero-image-wrap { flex: unset; max-width: 100%; width: 100%; }
      .hero-cta-group { justify-content: center !important; }
      .hero-subheadline { margin-left: auto; margin-right: auto; }
      .benefits-grid { grid-template-columns: 1fr 1fr; }
      .navbar .container { gap: 8px; }
      .navbar-right { gap: 8px; }
      .gallery-grid { grid-template-columns: 1fr 1fr; }
      .ba-pair { grid-template-columns: 1fr; }
      .services-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .benefits-grid { grid-template-columns: 1fr; }
      .features-list { grid-template-columns: 1fr; }
      .hero-headline { font-size: 1.9rem; }
      .btn-primary { padding: 14px 24px; font-size: 0.95rem; }
      .gallery-grid { grid-template-columns: 1fr; }
      .services-grid { grid-template-columns: 1fr; }
      .reviews-grid { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
  ${buildUrgencyBadge(urgencyBadge)}

  <nav class="navbar">
    <div class="container">
      <a href="#" class="navbar-brand">${navLogoImg}${escapeHTML(productName)}</a>
      <div class="navbar-right">
        ${langToggleHTML}
        <a href="${waLink}" class="navbar-cta" target="_blank" rel="noopener" data-i18n="navbarCta">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${escapeHTML(resolvedNavbarCta)}
        </a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-tag">${escapeHTML(niche.replace(/_/g, ' '))}</span>
        ${buildSocialProofBadge(googleRating, totalReviews)}
        <h1 class="hero-headline" data-i18n="headline">${escapeHTML(headline)}</h1>
        <p class="hero-subheadline" data-i18n="subheadline">${escapeHTML(subheadline)}</p>
        <div class="hero-cta-group">
          <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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

  ${buildServicesSection(services, colorTheme, resolvedServicesTitle)}

  ${buildGallerySection(galleryImages, resolvedGalleryTitle)}

  ${buildBeforeAfterSection(beforeAfterImages, resolvedResultsTitle)}

  ${buildReviewsSection(resolvedReviews, resolvedReviewsTitle)}

  ${buildMapIframe(mapQuery, resolvedFindUsTitle)}

  <section class="footer-cta">
    <div class="container">
      <h2 data-i18n="readyTitle">${escapeHTML(resolvedReadyTitle)}</h2>
      <p data-i18n="footerGetStarted">${escapeHTML(resolvedFooterGetStarted)}</p>
      <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span data-i18n="ctaText">${escapeHTML(ctaText)}</span>
      </a>
      ${contactDetails ? `<div class="contact-details">${contactDetails}</div>` : ''}
    </div>
  </section>

  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>${escapeHTML(productName)}</h4>
        ${address ? `<div class="footer-info-item">📍 ${escapeHTML(address)}</div>` : ''}
        ${normalized.operatingHours ? `<div class="footer-info-item">🕐 ${escapeHTML(normalized.operatingHours)}</div>` : ''}
        ${normalized.ownerName ? `<div class="footer-info-item">👨‍⚕️ Led by ${escapeHTML(normalized.ownerName)}</div>` : ''}
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        ${phoneNumber ? `<div class="footer-info-item">📱 <a href="${waLink}" target="_blank" rel="noopener">WhatsApp Us</a></div>` : ''}
        ${normalized.landline ? `<div class="footer-info-item">☎ <a href="tel:${escapeHTML(normalized.landline)}">${escapeHTML(normalized.landline)}</a></div>` : ''}
        ${normalized.email ? `<div class="footer-info-item">✉ <a href="mailto:${escapeHTML(normalized.email)}">${escapeHTML(normalized.email)}</a></div>` : ''}
      </div>
    </div>
    <div class="footer-copy">
      <p>&copy; ${new Date().getFullYear()} ${escapeHTML(productName)}. All rights reserved.</p>
    </div>
  </footer>

  ${buildWhatsAppFloat(waLink)}

  ${i18nScript}
</body>
</html>`
}
