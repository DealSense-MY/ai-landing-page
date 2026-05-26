/**
 * buildJSON.js — Merges normalized input + decisions + AI content into a
 * clean, flat JSON object for the frontend state.
 */

export function buildJSON(normalized, decisions, aiContent) {
  return {
    // From normalize
    productName: normalized.productName,
    niche: normalized.niche,
    tone: normalized.tone,
    features: normalized.features,
    inputBenefits: normalized.benefits,
    imageUrl: normalized.imageUrl,
    phoneNumber: normalized.phoneNumber,
    address: normalized.address,
    mapQuery: normalized.mapQuery,
    outputLang: normalized.outputLang,

    // From decide
    colorTheme: decisions.colorTheme,
    layout: decisions.layout,
    ctaStyle: decisions.ctaStyle,
    urgencyBadge: decisions.urgencyBadge,
    fontFamily: decisions.fontFamily,

    // From AI
    headline: aiContent.headline,
    subheadline: aiContent.subheadline,
    ctaText: aiContent.ctaText,
    navbarCta: aiContent.navbarCta,
    footerCta: aiContent.footerCta,
    whatsappCta: aiContent.whatsappCta,
    benefits: aiContent.benefits,
    multilingual: aiContent.multilingual,
    langs: aiContent.langs,
  }
}
