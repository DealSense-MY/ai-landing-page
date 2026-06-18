// Copied verbatim from production pipeline/buildJSON.js — pure object assembly.
// No Node.js dependencies. Safe to run in Cloudflare V8 isolate unchanged.

export function buildJSON(normalized, decisions, aiContent) {
  return {
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
    colorTheme: decisions.colorTheme,
    layout: decisions.layout,
    ctaStyle: decisions.ctaStyle,
    urgencyBadge: decisions.urgencyBadge,
    fontFamily: decisions.fontFamily,
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
