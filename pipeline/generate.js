/**
 * generate.js — Single AI call to Anthropic Claude API.
 * Generates multilingual copy based on outputLang field.
 * This is the ONLY place in the entire system that calls the LLM.
 */

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Language code → human label for prompt clarity
const LANG_LABELS = {
  en: 'English',
  bm: 'Bahasa Malaysia',
  zh: 'Simplified Chinese',
}

// Niche-aware seed copy by language (used as style guidance in prompt)
const NICHE_SEED_COPY = {
  dental_clinic: {
    en: {
      headline: 'Your Perfect Smile Starts Here',
      sub: 'Professional dental care — comfortable, fast, and affordable',
      cta: 'Book via WhatsApp',
      navbar_cta: '📱 WhatsApp Us',
      footer_cta: 'Contact Us Now',
    },
    bm: {
      headline: 'Senyum Cantik Bermula Di Sini',
      sub: 'Rawatan pergigian profesional — selesa, pantas, dan berpatutan',
      cta: 'Buat Temujanji via WhatsApp',
      navbar_cta: '📱 WhatsApp Kami',
      footer_cta: 'Hubungi Kami Sekarang',
      urgency: 'Slot terhad — tempah sekarang!',
    },
    zh: {
      headline: '从这里开始，拥有自信的笑容',
      sub: '专业牙科护理 — 舒适、快捷、实惠',
      cta: 'WhatsApp 预约',
      navbar_cta: '📱 WhatsApp 联系',
      footer_cta: '立即联系我们',
    },
  },
}

const WA_CTA_BY_LANG = {
  en: '📱 Contact Us on WhatsApp',
  bm: '📱 Hubungi Kami via WhatsApp',
  zh: '📱 WhatsApp 联系我们',
}

function getLangsFromCode(outputLang) {
  return outputLang.split('+')
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

  return `You are an expert conversion copywriter specializing in Malaysian small business landing pages.

Generate compelling copy in ${langLabel} for a landing page:
- Business Name: ${productName}
- Industry/Niche: ${niche.replace(/_/g, ' ')}
- Tone: ${toneDescription}
- Key Features: ${featuresList}
- Key Benefits: ${benefitsList}
- Color Theme: ${colorTheme.name}
${urgencyBadge ? '- IMPORTANT: Include urgency and scarcity in the copy.' : ''}
${styleGuide}${seedHint}

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "headline": "Powerful headline (max 10 words)",
  "subheadline": "Supporting subheadline (max 20 words)",
  "ctaText": "CTA button text (max 5 words, starts with a verb)",
  "navbarCta": "Navbar CTA button text (short, with emoji)",
  "footerCta": "Footer section CTA headline (max 8 words)",
  "whatsappCta": "WhatsApp floating button text",
  "benefits": [
    "Benefit tagline 1 (5-10 words)",
    "Benefit tagline 2 (5-10 words)",
    "Benefit tagline 3 (5-10 words)",
    "Benefit tagline 4 (5-10 words)"
  ],
  "whyChooseTitle": "Section title for benefits (e.g. 'Why Choose Us?')",
  "whatWeOfferTitle": "Section title for features (e.g. 'What We Offer')",
  "findUsTitle": "Map section title (e.g. 'Find Us')",
  "footerGetStarted": "Footer CTA subtitle (max 15 words)",
  "readyTitle": "Footer CTA main heading (max 8 words)"
}

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

  const exampleObj = langs.reduce((acc, l) => {
    acc[l] = {
      headline: `[headline in ${LANG_LABELS[l] || l}]`,
      subheadline: `[subheadline in ${LANG_LABELS[l] || l}]`,
      ctaText: `[CTA in ${LANG_LABELS[l] || l}]`,
      navbarCta: `[navbar CTA in ${LANG_LABELS[l] || l}]`,
      footerCta: `[footer CTA heading in ${LANG_LABELS[l] || l}]`,
      whatsappCta: `[WhatsApp CTA in ${LANG_LABELS[l] || l}]`,
      benefits: [`[benefit 1]`, `[benefit 2]`, `[benefit 3]`, `[benefit 4]`],
      whyChooseTitle: `[section title in ${LANG_LABELS[l] || l}]`,
      whatWeOfferTitle: `[section title in ${LANG_LABELS[l] || l}]`,
      findUsTitle: `[map title in ${LANG_LABELS[l] || l}]`,
      readyTitle: `[footer heading in ${LANG_LABELS[l] || l}]`,
      footerGetStarted: `[footer subtitle in ${LANG_LABELS[l] || l}]`,
    }
    return acc
  }, {})

  return `You are an expert multilingual conversion copywriter for Malaysian small businesses.

Generate landing page copy in these languages: ${langLabels}
- Business Name: ${productName}
- Industry/Niche: ${niche.replace(/_/g, ' ')}
- Tone: ${toneDescription}
- Key Features: ${featuresList}
- Key Benefits: ${benefitsList}
${urgencyBadge ? '- Include urgency/scarcity messaging.' : ''}

Language style guidelines:
${langInstructions}

Return ONLY a valid JSON object where each top-level key is a language code:
${JSON.stringify(exampleObj, null, 2)}

Rules:
- Each language version must be fully written in that language (no mixing)
- benefits must be an array of exactly 4 strings
- Return ONLY the JSON object, no markdown, no explanation`
}

async function callClaude(prompt) {
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
  const benefits = parsed.benefits.map(b => String(b).trim()).filter(Boolean)
  if (benefits.length < 2) throw new Error('AI returned fewer than 2 benefits.')
  return {
    headline: String(parsed.headline).trim(),
    subheadline: String(parsed.subheadline).trim(),
    ctaText: String(parsed.ctaText).trim(),
    navbarCta: String(parsed.navbarCta || '📱 WhatsApp Us').trim(),
    footerCta: String(parsed.footerCta || 'Contact Us Now').trim(),
    whatsappCta: String(parsed.whatsappCta || '📱 Contact Us on WhatsApp').trim(),
    whyChooseTitle: String(parsed.whyChooseTitle || 'Why Choose Us?').trim(),
    whatWeOfferTitle: String(parsed.whatWeOfferTitle || 'What We Offer').trim(),
    findUsTitle: String(parsed.findUsTitle || 'Find Us').trim(),
    readyTitle: String(parsed.readyTitle || 'Ready to Get Started?').trim(),
    footerGetStarted: String(parsed.footerGetStarted || 'Contact us now and let us help you.').trim(),
    benefits,
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

export async function generate(normalized, decisions) {
  const { outputLang } = normalized
  const langs = getLangsFromCode(outputLang)
  const isMultilingual = langs.length > 1

  if (isMultilingual) {
    const prompt = buildMultilingualPrompt(normalized, decisions, langs)
    const parsed = await callClaude(prompt)
    const multilingual = validateMultilingual(parsed, langs)
    // Return primary lang content at top level + full multilingual map
    const primary = multilingual[langs[0]]
    return { ...primary, multilingual, langs }
  } else {
    const lang = langs[0]
    const prompt = buildMonolingualPrompt(normalized, decisions, lang)
    const parsed = await callClaude(prompt)
    const content = validateMonolingual(parsed)
    return { ...content, multilingual: null, langs }
  }
}
