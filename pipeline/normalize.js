/**
 * normalize.js — Deterministic input normalization
 * Cleans and validates all incoming fields from the POST /generate request.
 */

function normalizePhone(phone) {
  if (!phone) return ''
  const cleaned = phone.replace(/[\s\-().]/g, '')
  if (!/^\+?\d{7,15}$/.test(cleaned)) {
    throw new Error(`Invalid phone number format: "${phone}". Expected 7–15 digits, optionally starting with +.`)
  }
  return cleaned
}

function parseArrayField(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value.split(',').map(v => v.trim()).filter(Boolean)
  }
  return []
}

const VALID_TONES = ['warm_professional', 'casual', 'urgent']
const VALID_NICHES = ['dental_clinic', 'beauty', 'F&B', 'digital', 'retail', 'education', 'general']
const VALID_OUTPUT_LANGS = ['en', 'bm', 'zh', 'en+bm', 'en+zh', 'zh+bm', 'en+bm+zh']

export function normalize(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Request body must be a JSON object.')
  }

  const productName = String(input.productName || '').trim()
  if (!productName) {
    throw new Error('"productName" is required and cannot be empty.')
  }

  let niche = String(input.niche || '').trim().toLowerCase()
  if (!VALID_NICHES.includes(niche)) niche = 'general'

  let tone = String(input.tone || '').trim().toLowerCase()
  if (!VALID_TONES.includes(tone)) tone = 'warm_professional'

  const features = parseArrayField(input.features)
  const benefits = parseArrayField(input.benefits)

  const imageUrl = String(input.imageUrl || '').trim()

  let phoneNumber = ''
  if (input.phoneNumber) {
    phoneNumber = normalizePhone(String(input.phoneNumber).trim())
  }

  const address = String(input.address || '').trim()
  const mapQuery = String(input.mapQuery || '').trim() || address

  let outputLang = String(input.outputLang || 'en').trim().toLowerCase()
  if (!VALID_OUTPUT_LANGS.includes(outputLang)) outputLang = 'en'

  return {
    productName,
    niche,
    tone,
    features,
    benefits,
    imageUrl,
    phoneNumber,
    address,
    mapQuery,
    outputLang,
  }
}
