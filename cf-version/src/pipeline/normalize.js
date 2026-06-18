// Copied verbatim from production pipeline/normalize.js — no Node.js dependencies.
// Safe to run in Cloudflare V8 isolate unchanged.

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

function parseServicesField(value) {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'string') {
          const [name, price = ''] = item.split('|').map(s => s.trim())
          return { name, price }
        }
        const name = String(item.name || item.title || '').trim()
        const price = String(item.price || item.cost || '').trim()
        return { name, price }
      })
      .filter(s => s.name)
  }
  if (typeof value !== 'string') return []
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name, price = ''] = line.split('|').map(s => s.trim())
      return { name, price }
    })
    .filter(s => s.name)
}

function parseCustomerReviews(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(r => r && (String(r.name || '').trim() || String(r.quote || '').trim()))
    .map(r => ({
      name: String(r.name || '').trim(),
      rating: String(r.rating || '5').trim(),
      quote: String(r.quote || '').trim(),
      date: String(r.date || '').trim(),
    }))
}

function validateEmail(email) {
  if (!email) return ''
  const trimmed = String(email).trim()
  if (trimmed && (!trimmed.includes('@') || !trimmed.includes('.'))) {
    throw new Error(`Invalid email format: "${trimmed}".`)
  }
  return trimmed
}

const VALID_TONES = ['warm_professional', 'casual', 'urgent']
const VALID_NICHES = [
  'dental_clinic', 'clinic_gp', 'clinic_aesthetic',
  'aircond_service', 'bengkel_kereta', 'katering_event',
  'restoran_cafe', 'saloon_barbershop', 'pusat_tuisyen', 'general',
]
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

  const tagline = String(input.tagline || '').trim()
  const email = validateEmail(input.email)
  const landline = String(input.landline || '').trim()
  const operatingHours = String(input.operatingHours || '').trim()
  const ownerName = String(input.ownerName || '').trim()
  const yearsInOperation = String(input.yearsInOperation || '').trim()
  const googleRating = String(input.googleRating || '').trim()
  const totalReviews = String(input.totalReviews || '').trim()

  const services = parseServicesField(input.services)
  const customerReviews = parseCustomerReviews(input.customerReviews)

  const imageUrl = String(input.imageUrl || '').trim()
  const logoUrl = String(input.logoUrl || '').trim()

  const galleryImages = Array.isArray(input.gallery)
    ? input.gallery.map(u => String(u).trim()).filter(Boolean).slice(0, 3)
    : []

  const beforeAfterImages = Array.isArray(input.beforeAfter)
    ? input.beforeAfter
        .filter(p => p && (String(p.before || '').trim() || String(p.after || '').trim()))
        .map(p => ({ before: String(p.before || '').trim(), after: String(p.after || '').trim() }))
        .slice(0, 2)
    : []

  let phoneNumber = ''
  if (input.phoneNumber) {
    phoneNumber = normalizePhone(String(input.phoneNumber).trim())
  }

  const address = String(input.address || '').trim()
  const mapQuery = String(input.mapQuery || '').trim() || address

  let outputLang = String(input.outputLang || 'en').trim().toLowerCase()
  if (!VALID_OUTPUT_LANGS.includes(outputLang)) outputLang = 'en'

  const brandColor = (input.brandColor && /^#[0-9a-fA-F]{6}$/.test(input.brandColor))
    ? input.brandColor
    : '#2563eb'

  return {
    productName, tagline, email, landline, operatingHours, ownerName,
    yearsInOperation, googleRating, totalReviews, niche, tone,
    features, benefits, services, customerReviews, imageUrl, logoUrl,
    galleryImages, beforeAfterImages, phoneNumber, address, mapQuery,
    outputLang, brandColor,
  }
}
