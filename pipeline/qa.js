/**
 * qa.js — Non-blocking quality checks on the generated HTML.
 * Returns an array of warning strings. Empty array = all clear.
 */

export function qa(html) {
  const warnings = []

  if (!html || typeof html !== 'string') {
    warnings.push('QA: HTML is empty or not a string.')
    return warnings
  }

  // Check 1: Must contain a wa.me link (WhatsApp CTA)
  if (!html.includes('wa.me/')) {
    warnings.push('QA: No WhatsApp (wa.me) link found in HTML. CTA may be broken.')
  }

  // Check 2: Must have viewport meta tag for mobile responsiveness
  if (!html.includes('name="viewport"')) {
    warnings.push('QA: Missing <meta name="viewport"> tag. Page may not be mobile-responsive.')
  }

  // Check 3: Must have at least one anchor with href (CTA button)
  const anchorCount = (html.match(/<a\s[^>]*href/gi) || []).length
  if (anchorCount < 1) {
    warnings.push('QA: No anchor/CTA buttons found in HTML.')
  }

  // Check 4: Must have a <title> tag
  if (!html.includes('<title>') || !html.includes('</title>')) {
    warnings.push('QA: Missing <title> tag.')
  }

  // Check 5: Must have at least one heading (h1)
  if (!html.includes('<h1')) {
    warnings.push('QA: No <h1> heading found.')
  }

  // Check 6: Should have a charset declaration
  if (!html.includes('charset')) {
    warnings.push('QA: Missing charset meta tag.')
  }

  // Check 7: HTML should not be suspiciously short
  if (html.length < 2000) {
    warnings.push(`QA: HTML is very short (${html.length} chars). Possible generation issue.`)
  }

  return warnings
}
