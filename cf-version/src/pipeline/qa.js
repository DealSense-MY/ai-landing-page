// Copied verbatim from production pipeline/qa.js — pure string inspection.
// No Node.js dependencies. Safe to run in Cloudflare V8 isolate unchanged.

export function qa(html) {
  const warnings = []

  if (!html || typeof html !== 'string') {
    warnings.push('QA: HTML is empty or not a string.')
    return warnings
  }

  if (!html.includes('wa.me/')) warnings.push('QA: No WhatsApp (wa.me) link found.')
  if (!html.includes('name="viewport"')) warnings.push('QA: Missing <meta name="viewport"> tag.')
  if ((html.match(/<a\s[^>]*href/gi) || []).length < 1) warnings.push('QA: No anchor/CTA buttons found.')
  if (!html.includes('<title>') || !html.includes('</title>')) warnings.push('QA: Missing <title> tag.')
  if (!html.includes('<h1')) warnings.push('QA: No <h1> heading found.')
  if (!html.includes('charset')) warnings.push('QA: Missing charset meta tag.')
  if (html.length < 2000) warnings.push(`QA: HTML is very short (${html.length} chars).`)

  return warnings
}
