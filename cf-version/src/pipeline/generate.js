/**
 * generate.js — CF version.
 * Single AI call doctrine preserved: exactly one call to Anthropic per /generate request.
 * No /regenerate, no streaming, no backend /export.
 *
 * KEY CHANGE from Railway version:
 *   - Anthropic client is constructed per-request using env.ANTHROPIC_API_KEY
 *     (Workers don't have process.env at runtime; secrets come via the env binding)
 *   - Function signature: generate(normalized, decisions, env)
 */

import Anthropic from '@anthropic-ai/sdk'

const LANG_LABELS = {
  en: 'English',
  bm: 'Bahasa Malaysia',
  zh: 'Simplified Chinese',
}

const NICHE_SEED_COPY = {
  dental_clinic: {
    en: { headline: 'Your Perfect Smile Starts Here', sub: 'Professional dental care — comfortable, fast, and affordable', benefits: ['Pain-free treatments', 'Digital X-Ray technology', 'Same-day appointments', '10+ years experience'] },
    bm: { headline: 'Senyum Cantik Bermula Di Sini', sub: 'Rawatan pergigian profesional — selesa, pantas, dan berpatutan', benefits: ['Rawatan tanpa sakit', 'X-Ray digital', 'Temujanji hari sama', '10+ tahun pengalaman'] },
    zh: { headline: '从这里开始，拥有自信的笑容', sub: '专业牙科护理 — 舒适、快捷、实惠', benefits: ['无痛治疗', '数字X光技术', '当天预约', '10年以上经验'] },
  },
  clinic_gp: {
    en: { headline: 'Your Trusted Family Doctor', sub: 'Comprehensive healthcare for you and your family', benefits: ['Experienced GP doctor', 'Same-day appointments', 'Full medication coverage', 'Friendly & caring staff'] },
    bm: { headline: 'Doktor Keluarga Yang Anda Percayai', sub: 'Penjagaan kesihatan menyeluruh untuk anda dan keluarga', benefits: ['Doktor GP berpengalaman', 'Temujanji hari sama', 'Liputan ubatan penuh', 'Kakitangan mesra & prihatin'] },
    zh: { headline: '您信赖的家庭医生', sub: '为您和家人提供全面的医疗保健', benefits: ['经验丰富的全科医生', '当天预约', '全面用药覆盖', '亲切友善的员工'] },
  },
  clinic_aesthetic: {
    en: { headline: 'Glow Up. Feel Confident. Look Amazing.', sub: 'Premium aesthetic treatments tailored for your skin', benefits: ['Certified aesthetic doctors', 'FDA-approved treatments', 'Visible results fast', 'Personalised skin consultation'] },
    bm: { headline: 'Cantik, Yakin, dan Berseri.', sub: 'Rawatan estetik premium untuk kulit anda', benefits: ['Doktor estetik bertauliah', 'Rawatan diluluskan FDA', 'Keputusan nyata pantas', 'Konsultasi kulit peribadi'] },
    zh: { headline: '焕发光彩，自信满满。', sub: '为您量身定制的高级美容疗程', benefits: ['认证美容医生', 'FDA认可疗程', '快速见效', '个性化皮肤咨询'] },
  },
  aircond_service: {
    en: { headline: 'Keep Cool — Expert Aircond Service', sub: 'Fast, reliable air-conditioning repair, cleaning & installation', benefits: ['Same-day service available', 'All brands & models', 'Certified technicians', 'Transparent pricing'] },
    bm: { headline: 'Aircond Rosak? Kami Baiki Hari Ini!', sub: 'Servis, baik pulih & pasang aircond — pantas dan boleh dipercayai', benefits: ['Servis hari sama tersedia', 'Semua jenama & model', 'Juruteknik bertauliah', 'Harga telus'] },
    zh: { headline: '专业冷气服务，快速上门', sub: '冷气维修、清洗与安装 — 快捷可靠', benefits: ['当天上门服务', '所有品牌型号', '认证技术员', '透明定价'] },
  },
  bengkel_kereta: {
    en: { headline: 'Your Car Deserves the Best Care', sub: 'Professional car service, repair & maintenance you can trust', benefits: ['Experienced mechanics', 'All makes & models', 'Genuine spare parts', 'Free diagnostic check'] },
    bm: { headline: 'Kereta Anda, Jagaan Terbaik Kami', sub: 'Servis, baik pulih & penyelenggaraan kereta profesional', benefits: ['Mekanik berpengalaman', 'Semua jenis kereta', 'Alat ganti tulen', 'Pemeriksaan diagnostik percuma'] },
    zh: { headline: '专业汽车维修，信赖之选', sub: '汽车保养、维修与服务，专业可靠', benefits: ['经验丰富的技师', '各种品牌车型', '原装零件', '免费诊断检查'] },
  },
  katering_event: {
    en: { headline: 'Unforgettable Events Start With Great Food', sub: 'Premium catering for weddings, corporate events & celebrations', benefits: ['Custom menus available', 'Fresh, quality ingredients', 'Professional event setup', 'Handles 50–5000 pax'] },
    bm: { headline: 'Majlis Meriah, Hidangan Istimewa', sub: 'Katering premium untuk majlis perkahwinan, korporat & perayaan', benefits: ['Menu boleh disesuaikan', 'Bahan-bahan segar berkualiti', 'Persediaan majlis profesional', 'Boleh uruskan 50–5000 pax'] },
    zh: { headline: '精彩活动，从美食开始', sub: '婚宴、企业活动与庆典的高级餐饮服务', benefits: ['定制菜单', '新鲜优质食材', '专业活动布置', '可承接50至5000人'] },
  },
  restoran_cafe: {
    en: { headline: 'Where Every Bite Tells a Story', sub: 'Delicious food, warm ambiance, and memories worth making', benefits: ['Fresh ingredients daily', 'Dine-in & takeaway', 'Family-friendly space', 'Authentic flavours'] },
    bm: { headline: 'Setiap Suapan, Penuh Kenangan', sub: 'Makanan lazat, suasana mesra, dan kenangan indah untuk dikongsi', benefits: ['Bahan segar setiap hari', 'Makan dalam & bawa balik', 'Ruang mesra keluarga', 'Rasa autentik'] },
    zh: { headline: '每一口，都是故事', sub: '美味佳肴、温馨环境，留下美好回忆', benefits: ['每日新鲜食材', '堂食与外卖均可', '家庭友好空间', '地道风味'] },
  },
  saloon_barbershop: {
    en: { headline: 'Look Sharp. Feel Great.', sub: 'Expert cuts, styling & grooming for every look', benefits: ['Experienced stylists', 'All hair types welcome', 'Walk-ins accepted', 'Relaxing atmosphere'] },
    bm: { headline: 'Kemas, Bergaya, Yakin Diri.', sub: 'Gunting, styling & grooming pakar untuk setiap penampilan', benefits: ['Stylist berpengalaman', 'Semua jenis rambut', 'Boleh masuk tanpa temujanji', 'Suasana santai'] },
    zh: { headline: '型格造型，自信风采', sub: '专业剪发、造型与美容护理', benefits: ['经验丰富的造型师', '适合各种发型', '接受即兴到访', '轻松舒适的环境'] },
  },
  pusat_tuisyen: {
    en: { headline: "Unlock Your Child's Full Potential", sub: 'Result-focused tuition with experienced, caring tutors', benefits: ['Experienced qualified tutors', 'Small class sizes', 'Exam-focused syllabus', 'Regular progress reports'] },
    bm: { headline: 'Tingkatkan Potensi Anak Anda', sub: 'Tuisyen berorientasikan keputusan dengan guru-guru berpengalaman', benefits: ['Guru bertauliah berpengalaman', 'Kelas bersaiz kecil', 'Silibus fokus peperiksaan', 'Laporan kemajuan berkala'] },
    zh: { headline: '发掘孩子的无限潜能', sub: '注重成绩的补习中心，经验丰富关爱学生的导师', benefits: ['经验丰富的合格导师', '小班制教学', '针对考试的课程', '定期进度报告'] },
  },
}

function getLangsFromCode(outputLang) {
  return outputLang.split('+')
}

function buildContextBlock(normalized) {
  const {
    tagline, ownerName, yearsInOperation, googleRating, totalReviews,
    services, customerReviews, operatingHours, email, landline,
    galleryImages, beforeAfterImages, productName, outputLang,
  } = normalized

  const primaryLang = outputLang.split('+')[0]
  const lines = []

  if (tagline) lines.push(`- Brand tagline/slogan: "${tagline}" — use as brand voice hint`)
  if (ownerName) lines.push(`- Owner/Doctor name: "${ownerName}" — mention once in hero as "Led by ${ownerName}"`)
  if (yearsInOperation) lines.push(`- Years in operation: ${yearsInOperation} — use as "${yearsInOperation}+ years experience" in benefits`)
  if (googleRating) lines.push(`- Google rating: ${googleRating}${totalReviews ? ` (${totalReviews} reviews)` : ''} — include as social proof`)
  if (services.length > 0) lines.push(`- Services list provided (${services.length} items) — instruct that a Services section with cards should be included`)
  if (customerReviews.length > 0) lines.push(`- ${customerReviews.length} real customer reviews provided — use as testimonials`)
  if (operatingHours) lines.push(`- Operating hours: ${operatingHours} — include in contact section`)
  if (email) lines.push(`- Email: ${email} — include in contact section`)
  if (landline) lines.push(`- Landline: ${landline} — include in contact section`)
  if (galleryImages.length > 0) lines.push(`- ${galleryImages.length} gallery images provided — instruct that a Gallery section should be included`)
  if (beforeAfterImages.length > 0) lines.push(`- ${beforeAfterImages.length} before/after image pair(s) provided — instruct that a Before/After Results section should be included`)

  const waHints = {
    en: `Hi, I'd like to book an appointment at ${productName}. Is there a slot available?`,
    bm: `Salam, saya ingin buat temujanji di ${productName}. Ada slot yang available?`,
    zh: `您好，我想在${productName}预约。请问有空档吗？`,
  }
  const waExample = waHints[primaryLang] || waHints.en
  lines.push(`- Generate a "whatsappMessage" field: niche-appropriate greeting in ${LANG_LABELS[primaryLang] || 'English'}, max 100 chars, booking intent. Example: "${waExample}"`)

  return lines.length ? '\nAdditional context:\n' + lines.join('\n') : ''
}

function buildMonolingualPrompt(normalized, decisions, lang) {
  const { productName, niche, tone, features, benefits } = normalized
  const { colorTheme, urgencyBadge } = decisions

  const toneDescription = {
    warm_professional: 'warm, trustworthy, and professional — builds confidence',
    casual: 'friendly, approachable, and conversational — feels personal',
    urgent: 'urgent, action-driving, and compelling — creates FOMO',
  }[tone] || 'professional and clear'

  const langLabel = LANG_LABELS[lang] || 'English'
  const featuresList = features.length ? features.join(', ') : 'quality service, expertise, reliability'
  const benefitsList = benefits.length ? benefits.join(', ') : 'great value, trusted results'

  const styleGuide = lang === 'bm'
    ? 'Style: emotional, direct, problem-first. Use conversational BM that resonates with Malaysian locals.'
    : lang === 'zh'
      ? 'Style: professional, precise, trust-focused. Use Simplified Chinese suitable for Malaysian Chinese audience.'
      : 'Style: professional and clear, conversion-optimized for English-speaking audience.'

  const seedCopy = NICHE_SEED_COPY[niche]?.[lang]
  const seedHint = seedCopy
    ? `\nExample copy style for this niche (use as style reference, not literal copy):\n  Headline: "${seedCopy.headline}"\n  Sub: "${seedCopy.sub}"`
    : ''

  const contextBlock = buildContextBlock(normalized)
  const hasUserReviews = normalized.customerReviews && normalized.customerReviews.length > 0
  const reviewsInstruction = hasUserReviews
    ? `- "reviews": Format the ${normalized.customerReviews.length} provided customer reviews as-is into the reviews array`
    : `- "reviews": Generate 3 realistic customer reviews for a ${niche.replace(/_/g, ' ')} business. Use realistic Malaysian names, niche-specific quotes (2-3 sentences each), rating: 5, dates like "1 month ago", "2 months ago", "3 months ago". Write in ${LANG_LABELS[lang] || 'English'}.`

  return `You are an expert conversion copywriter specializing in Malaysian small business landing pages.

Generate compelling copy in ${langLabel} for a landing page:
- Business Name: ${productName}
- Industry/Niche: ${niche.replace(/_/g, ' ')}
- Tone: ${toneDescription}
- Key Features: ${featuresList}
- Key Benefits: ${benefitsList}
- Color Theme: ${colorTheme.name}
${urgencyBadge ? '- IMPORTANT: Include urgency and scarcity in the copy.' : ''}
${styleGuide}${seedHint}${contextBlock}

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "headline": "Powerful headline (max 10 words)",
  "subheadline": "Supporting subheadline (max 20 words)",
  "ctaText": "CTA button text (max 5 words, starts with a verb)",
  "navbarCta": "Navbar CTA button text (short, with emoji)",
  "footerCta": "Footer section CTA headline (max 8 words)",
  "whatsappCta": "WhatsApp floating button text",
  "whatsappMessage": "Pre-filled WhatsApp message (max 100 chars, booking intent, URL-encode ready)",
  "benefits": [
    { "icon": "✓", "title": "Benefit title (3-5 words)", "description": "1-2 sentence explanation" },
    { "icon": "★", "title": "Benefit title (3-5 words)", "description": "1-2 sentence explanation" },
    { "icon": "⚡", "title": "Benefit title (3-5 words)", "description": "1-2 sentence explanation" },
    { "icon": "❤", "title": "Benefit title (3-5 words)", "description": "1-2 sentence explanation" }
  ],
  "whyChooseTitle": "Section title for benefits",
  "whatWeOfferTitle": "Section title for features",
  "servicesTitle": "Section title for services",
  "galleryTitle": "Section title for gallery",
  "resultsTitle": "Section title for before/after",
  "reviewsTitle": "Section title for testimonials",
  "findUsTitle": "Map section title",
  "footerGetStarted": "Footer CTA subtitle (max 15 words)",
  "readyTitle": "Footer CTA main heading (max 8 words)",
  "reviews": [
    { "name": "Customer name", "rating": 5, "quote": "Review quote (2-3 sentences)", "date": "X months ago" }
  ]
}

Additional instructions:
${reviewsInstruction}

Return ONLY the JSON, nothing else.`
}

function buildMultilingualPrompt(normalized, decisions, langs) {
  const { productName, niche, tone, features, benefits } = normalized
  const { colorTheme, urgencyBadge } = decisions

  const toneDescription = {
    warm_professional: 'warm, trustworthy, and professional',
    casual: 'friendly, approachable, and conversational',
    urgent: 'urgent, action-driving, and compelling',
  }[tone] || 'professional and clear'

  const featuresList = features.length ? features.join(', ') : 'quality service, expertise, reliability'
  const benefitsList = benefits.length ? benefits.join(', ') : 'great value, trusted results'
  const langLabels = langs.map(l => LANG_LABELS[l] || l).join(', ')

  const langInstructions = langs.map(l => {
    const styleGuide = l === 'bm'
      ? 'BM: emotional, direct, problem-first, conversational Malaysian style'
      : l === 'zh'
        ? 'ZH: professional, precise, trust-focused Simplified Chinese'
        : 'EN: professional, conversion-optimized English'
    return `  - "${l}": ${styleGuide}`
  }).join('\n')

  const contextBlock = buildContextBlock(normalized)

  const exampleObj = langs.reduce((acc, l) => {
    acc[l] = {
      headline: `[headline in ${LANG_LABELS[l] || l}]`,
      subheadline: `[subheadline in ${LANG_LABELS[l] || l}]`,
      ctaText: `[CTA in ${LANG_LABELS[l] || l}]`,
      navbarCta: `[navbar CTA in ${LANG_LABELS[l] || l}]`,
      footerCta: `[footer CTA heading in ${LANG_LABELS[l] || l}]`,
      whatsappCta: `[WhatsApp CTA in ${LANG_LABELS[l] || l}]`,
      whatsappMessage: `[pre-filled WhatsApp message in ${LANG_LABELS[l] || l}, max 100 chars]`,
      benefits: [
        { icon: '✓', title: `[benefit title]`, description: `[1-2 sentence description]` },
        { icon: '★', title: `[benefit title]`, description: `[1-2 sentence description]` },
        { icon: '⚡', title: `[benefit title]`, description: `[1-2 sentence description]` },
        { icon: '❤', title: `[benefit title]`, description: `[1-2 sentence description]` },
      ],
      whyChooseTitle: `[section title in ${LANG_LABELS[l] || l}]`,
      whatWeOfferTitle: `[section title in ${LANG_LABELS[l] || l}]`,
      servicesTitle: `[services section title in ${LANG_LABELS[l] || l}]`,
      galleryTitle: `[gallery section title in ${LANG_LABELS[l] || l}]`,
      resultsTitle: `[before/after section title in ${LANG_LABELS[l] || l}]`,
      reviewsTitle: `[reviews section title in ${LANG_LABELS[l] || l}]`,
      findUsTitle: `[map title in ${LANG_LABELS[l] || l}]`,
      readyTitle: `[footer heading in ${LANG_LABELS[l] || l}]`,
      footerGetStarted: `[footer subtitle in ${LANG_LABELS[l] || l}]`,
      reviews: [
        { name: '[Malaysian name]', rating: 5, quote: `[review quote in ${LANG_LABELS[l] || l}]`, date: '1 month ago' },
        { name: '[Malaysian name]', rating: 5, quote: `[review quote in ${LANG_LABELS[l] || l}]`, date: '2 months ago' },
        { name: '[Malaysian name]', rating: 5, quote: `[review quote in ${LANG_LABELS[l] || l}]`, date: '3 months ago' },
      ],
    }
    return acc
  }, {})

  const hasUserReviewsML = normalized.customerReviews && normalized.customerReviews.length > 0
  const reviewsInstructionML = hasUserReviewsML
    ? `- reviews: Format the ${normalized.customerReviews.length} provided customer reviews as-is.`
    : `- reviews: Generate 3 realistic reviews per language using Malaysian names, niche-specific quotes (2-3 sentences), rating: 5.`

  return `You are an expert multilingual conversion copywriter for Malaysian small businesses.

Generate landing page copy in these languages: ${langLabels}
- Business Name: ${productName}
- Industry/Niche: ${niche.replace(/_/g, ' ')}
- Tone: ${toneDescription}
- Key Features: ${featuresList}
- Key Benefits: ${benefitsList}
${urgencyBadge ? '- Include urgency/scarcity messaging.' : ''}
${contextBlock}

Language style guidelines:
${langInstructions}

Return ONLY a valid JSON object where each top-level key is a language code:
${JSON.stringify(exampleObj, null, 2)}

Rules:
- Each language version must be fully written in that language (no mixing)
- benefits must be an array of exactly 4 objects with keys: icon (emoji), title (3-5 words), description (1-2 sentences)
- reviews must be an array of exactly 3 objects with keys: name, rating (number), quote, date
- ${reviewsInstructionML}
- whatsappMessage must be max 100 characters, booking intent, in that language
- Return ONLY the JSON object, no markdown, no explanation`
}

async function callClaude(prompt, env) {
  // Construct client per-request — Workers don't have process.env
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

  let rawContent = ''
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })
    rawContent = message.content[0]?.text || ''
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI response did not contain valid JSON object.')
    return JSON.parse(jsonMatch[0])
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Failed to parse AI response as JSON. Raw: ${rawContent.slice(0, 200)}`)
    }
    throw err
  }
}

function validateMonolingual(parsed) {
  if (!parsed.headline || !parsed.subheadline || !parsed.ctaText || !Array.isArray(parsed.benefits)) {
    throw new Error('AI response missing required fields: headline, subheadline, ctaText, benefits')
  }
  const benefits = parsed.benefits.map(b => {
    if (b && typeof b === 'object' && b.title) {
      return { icon: String(b.icon || '✓'), title: String(b.title).trim(), description: String(b.description || '').trim() }
    }
    return { icon: '✓', title: String(b).trim(), description: '' }
  }).filter(b => b.title)
  if (benefits.length < 2) throw new Error('AI returned fewer than 2 benefits.')
  return {
    headline: String(parsed.headline).trim(),
    subheadline: String(parsed.subheadline).trim(),
    ctaText: String(parsed.ctaText).trim(),
    navbarCta: String(parsed.navbarCta || '📱 WhatsApp Us').trim(),
    footerCta: String(parsed.footerCta || 'Contact Us Now').trim(),
    whatsappCta: String(parsed.whatsappCta || '📱 Contact Us on WhatsApp').trim(),
    whatsappMessage: String(parsed.whatsappMessage || '').trim(),
    whyChooseTitle: String(parsed.whyChooseTitle || 'Why Choose Us?').trim(),
    whatWeOfferTitle: String(parsed.whatWeOfferTitle || 'What We Offer').trim(),
    servicesTitle: String(parsed.servicesTitle || 'Our Services').trim(),
    galleryTitle: String(parsed.galleryTitle || 'Our Gallery').trim(),
    resultsTitle: String(parsed.resultsTitle || 'Our Results').trim(),
    reviewsTitle: String(parsed.reviewsTitle || 'What Our Customers Say').trim(),
    findUsTitle: String(parsed.findUsTitle || 'Find Us').trim(),
    readyTitle: String(parsed.readyTitle || 'Ready to Get Started?').trim(),
    footerGetStarted: String(parsed.footerGetStarted || 'Contact us now and let us help you.').trim(),
    benefits,
    reviews: Array.isArray(parsed.reviews)
      ? parsed.reviews
          .filter(r => r && (String(r.name || '').trim() || String(r.quote || '').trim()))
          .map(r => ({
            name: String(r.name || '').trim(),
            rating: String(r.rating || '5'),
            quote: String(r.quote || '').trim(),
            date: String(r.date || '').trim(),
          }))
      : [],
  }
}

function validateMultilingual(parsed, langs) {
  const result = {}
  for (const lang of langs) {
    if (!parsed[lang]) throw new Error(`AI response missing language: ${lang}`)
    result[lang] = validateMonolingual(parsed[lang])
  }
  return result
}

// env is passed through so callClaude can access ANTHROPIC_API_KEY
export async function generate(normalized, decisions, env) {
  const { outputLang } = normalized
  const langs = getLangsFromCode(outputLang)
  const isMultilingual = langs.length > 1

  if (isMultilingual) {
    const prompt = buildMultilingualPrompt(normalized, decisions, langs)
    const parsed = await callClaude(prompt, env)
    const multilingual = validateMultilingual(parsed, langs)
    const primary = multilingual[langs[0]]
    return { ...primary, multilingual, langs }
  } else {
    const lang = langs[0]
    const prompt = buildMonolingualPrompt(normalized, decisions, lang)
    const parsed = await callClaude(prompt, env)
    const content = validateMonolingual(parsed)
    return { ...content, multilingual: null, langs }
  }
}
