// Copied verbatim from production pipeline/decide.js — pure deterministic logic.
// No Node.js dependencies. Safe to run in Cloudflare V8 isolate unchanged.

const NICHE_COLOR_MAP = {
  dental_clinic: { primary: '#1a6fc4', secondary: '#e8f4fd', accent: '#0d5aa7', text: '#1a2332', light: '#f0f8ff', name: 'blue' },
  beauty: { primary: '#d63384', secondary: '#fce4ec', accent: '#a91e5b', text: '#2d1b29', light: '#fdf0f6', name: 'pink' },
  'F&B': { primary: '#e65c00', secondary: '#fff3e0', accent: '#bf4c00', text: '#2d1a00', light: '#fff8f0', name: 'orange' },
  digital: { primary: '#6366f1', secondary: '#eef2ff', accent: '#4f46e5', text: '#1e1b4b', light: '#f5f3ff', name: 'indigo' },
  retail: { primary: '#059669', secondary: '#ecfdf5', accent: '#047857', text: '#064e3b', light: '#f0fdf4', name: 'green' },
  education: { primary: '#0891b2', secondary: '#e0f7fa', accent: '#0e7490', text: '#0c4a6e', light: '#f0fdff', name: 'cyan' },
  general: { primary: '#6366f1', secondary: '#eef2ff', accent: '#4f46e5', text: '#1e1b4b', light: '#f5f3ff', name: 'indigo' },
}

const NICHE_LAYOUT_MAP = {
  dental_clinic: 'hero_left',
  beauty: 'hero_center',
  'F&B': 'hero_center',
  digital: 'hero_left',
  retail: 'hero_left',
  education: 'hero_center',
  general: 'hero_left',
}

export function decide(normalized) {
  const { niche, tone } = normalized

  const colorTheme = NICHE_COLOR_MAP[niche] || NICHE_COLOR_MAP.general
  const layout = NICHE_LAYOUT_MAP[niche] || 'hero_left'
  const ctaStyle = 'whatsapp_only'
  const urgencyBadge = tone === 'urgent'

  let fontFamily = "'Segoe UI', system-ui, -apple-system, sans-serif"
  if (niche === 'beauty') fontFamily = "'Georgia', 'Times New Roman', serif"

  return { colorTheme, layout, ctaStyle, urgencyBadge, fontFamily }
}
