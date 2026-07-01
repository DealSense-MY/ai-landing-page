'use strict';

// Niche classifier — returns a category key from free-text niche/category string
function classifyNiche(raw) {
  if (!raw) return 'general';
  const s = raw.toLowerCase();
  if (/beauty|spa|facial|skin|wellness|salon|muslimah|lash|brow|nail|eyelash|bridal|makeup|boutique|hair|barber/.test(s)) return 'beauty';
  if (/clinic|dental|doktor|doctor|klinik|physio|perubatan/.test(s)) return 'clinic';
  if (/renov|contractor|kontraktor|bina|construction|plumb|electr|aircond|interior|cabinet|furniture|kitchen|wardrobe/.test(s)) return 'contractor';
  if (/cafe|food|makan|restoran|restaurant|catering|kedai makan/.test(s)) return 'food';
  return 'general';
}

// ═════════════════════════════════════════════════════════════════════════════
// CTA DOCTRINE LOCK (P0E):
// First-contact copy must remain permission-based, soft, local Malaysian, and
// preview-first. Do not weaken this into a hard website sales pitch unless Aliff
// explicitly approves. The default CTA asks permission to send a preview — it is
// never a price-first or hard-close pitch. validateSafeFirstContactCopy() below
// enforces this at generation time; unsafe copy falls back to a safe template.
// (Note: P0E intentionally supersedes the P0D proof-led/no-permission CTA rule.)
// ═════════════════════════════════════════════════════════════════════════════

// Phrases that must never appear in first-contact outreach copy.
const FORBIDDEN_COPY_PHRASES = [
  'saya tengah test', 'tengah test idea', 'tengah test satu konsep',
  'ai', 'automation', 'apexprospect', 'system', 'funnel', 'conversion',
  'lead generation', 'landing page engine', 'landing page', 'digital transformation',
  'guaranteed', 'guarantee', 'confirm ramai customer', 'confirm ramai',
  'pasti naik sales', 'sales naik', 'naikkan sales', 'kami boleh naikkan sales',
  'kami bantu bisnes grow', 'agency besar', 'website murah', 'nak website',
  'ranking',
];

// At least one of these permission-style phrases must appear in a first-contact DM.
const PERMISSION_PHRASES = [
  'boleh saya', 'kalau saya hantar', 'boleh saya tunjuk', 'boleh saya share',
  'boleh saya hantar', 'tengok dulu', 'tak perlu komit', 'kalau tak sesuai',
  'boleh?',
];

// Soft, permission-based CTAs (preview-first). The default first contact draws
// from this bank. Never a price-first or hard-close pitch.
const SAFE_CTA_BANK = {
  mostNatural:      'Boleh saya tunjuk satu contoh ringkas macam mana info servis tu boleh disusun supaya customer lebih senang tanya harga dan booking?',
  safestFirst:      'Kalau tak sesuai, tak apa. Saya cuma nak tunjuk satu preview ringkas sebab saya nampak ada ruang kecil untuk kemaskan flow customer.',
  previewPermission:'Kalau saya hantar satu contoh preview yang lebih kemas untuk flow customer WhatsApp, boleh?',
  softPermission:   'Boleh saya share satu contoh pendek untuk tengok dulu?',
  noPressure:       'Tak perlu komit apa-apa dulu. Tengok dulu pun cukup.',
  ownerFriendly:    'Kalau nampak sesuai, baru kita bincang lanjut. Kalau tak sesuai, tak apa.',
  whatsappFlow:     'Boleh saya tunjuk contoh susunan yang buat customer lebih mudah tekan WhatsApp untuk tanya atau booking?',
  serviceClarity:   'Nak saya tunjuk contoh macam mana info servis boleh dibuat lebih jelas untuk customer baru?',
};

// Customer-side friction hooks — sharper than "bisnes perlukan website".
const SAFE_HOOK_BANK = [
  'Customer mungkin berminat, tapi tak terus WhatsApp sebab info servis belum cukup jelas.',
  'Bila customer kena cari terlalu lama untuk faham servis, mereka mudah berhenti separuh jalan.',
  'Servis nampak ada, cuma susunan info boleh dibuat lebih meyakinkan untuk customer baru.',
  'Kadang bukan customer tak berminat, cuma mereka tak nampak langkah jelas untuk tanya harga atau booking.',
  'Kalau customer boleh faham servis, lokasi dan cara booking dalam 10 saat, mereka lebih senang tekan WhatsApp.',
  'Customer local biasanya nak cepat faham: servis apa, area mana, harga anggaran, dan macam mana nak booking.',
  'Ramai customer tak tanya bukan sebab tak berminat, tapi sebab info yang mereka cari belum cukup jelas.',
];

// Default safe observation when a specific weakness is missing.
const DEFAULT_SAFE_OBSERVATION = 'info servis dan langkah untuk customer bertanya boleh dibuat lebih jelas.';

// Niche-aware vocabulary for the body of the outreach. Each entry shapes the
// gap line, the offer description, and the outcome so the copy sounds natural
// for that kind of local business (per P0C spec direction).
const NICHE_COPY = {
  beauty: {
    noun:        'spa/beauty',
    gap:         'belum ada page ringkas yang tunjuk servis, pakej, lokasi dan cara booking dengan jelas',
    outcome:     'customer yang berminat senang tengok pakej, tanya slot dan terus WhatsApp untuk booking',
    offerDetail: 'nampak macam mini shop page, ada servis/pakej, lokasi, dan butang WhatsApp booking',
    shows:       'pakej/servis, lokasi dan butang WhatsApp booking dalam satu page',
    problem:     'Customer baru biasanya mahu nampak pakej, lokasi dan cara booking sebelum mereka tanya slot.',
    value:       'customer senang faham servis dan terus WhatsApp untuk booking bila berminat',
  },
  clinic: {
    noun:        'klinik',
    gap:         'belum ada page ringkas yang tunjuk servis, lokasi dan cara nak tanya appointment dengan jelas',
    outcome:     'patient yang berminat lebih senang faham servis dan terus WhatsApp untuk tanya temujanji',
    offerDetail: 'ada servis, lokasi, dan butang WhatsApp untuk tanya appointment',
    shows:       'servis, lokasi dan butang WhatsApp untuk tanya appointment dalam satu page',
    problem:     'Patient biasanya mahu nampak servis dan cara nak tanya appointment sebelum mereka WhatsApp.',
    value:       'patient senang faham servis dan terus WhatsApp untuk tanya temujanji',
  },
  contractor: {
    noun:        'servis/kontraktor',
    gap:         'belum ada page ringkas yang tunjuk servis, portfolio, area servis dan cara nak minta quotation',
    outcome:     'customer senang tengok contoh kerja, tanya bajet/projek dan terus WhatsApp untuk quotation',
    offerDetail: 'ada servis, portfolio, area servis, dan butang WhatsApp inquiry',
    shows:       'servis, portfolio, area servis dan butang WhatsApp inquiry dalam satu page',
    problem:     'Customer biasanya mahu semak contoh kerja dan area servis sebelum mereka tanya quotation.',
    value:       'customer senang semak portfolio dan terus WhatsApp untuk tanya bajet/projek',
  },
  food: {
    noun:        'kedai makan',
    gap:         'belum ada page ringkas yang tunjuk menu, lokasi, waktu operasi dan cara nak order',
    outcome:     'customer senang tengok menu, tahu waktu operasi dan terus WhatsApp untuk order/booking',
    offerDetail: 'ada menu, lokasi, waktu operasi, dan butang WhatsApp order',
    shows:       'menu, lokasi, waktu operasi dan butang WhatsApp order dalam satu page',
    problem:     'Customer biasanya mahu tengok menu dan waktu operasi sebelum mereka order.',
    value:       'customer senang tengok menu dulu dan terus WhatsApp untuk order',
  },
  general: {
    noun:        'bisnes',
    gap:         'belum ada page ringkas yang tunjuk servis, lokasi dan cara nak hubungi dengan jelas',
    outcome:     'customer yang berminat lebih senang faham bisnes dan terus WhatsApp untuk booking',
    offerDetail: 'ada servis/offer, lokasi, dan butang WhatsApp booking',
    shows:       'servis/offer, lokasi dan butang WhatsApp booking dalam satu page',
    problem:     'Customer baru biasanya mahu nampak servis, lokasi dan cara hubungi sebelum mereka tanya.',
    value:       'customer senang faham servis dan terus WhatsApp bila berminat',
  },
};

// ── Preview shareability classifier ──────────────────────────────────────────
// A preview is SHAREABLE only when it is an absolute http(s) URL on a non-local
// host — something a prospect can actually open from a WhatsApp message.
// Relative /previews paths, file:// and C:\ paths, and localhost/127.0.0.1 are
// treated as LOCAL_ONLY. Blank/placeholder => NO_PREVIEW. (P0D shareability rule.)
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
const PLACEHOLDER_PREVIEW = /^(unknown|n\/a|na|null|undefined|-|ready|not_built|pending|tbd)$/i;

function isShareableUrl(raw) {
  if (!raw || typeof raw !== 'string') return false;
  const v = raw.trim();
  if (!v || PLACEHOLDER_PREVIEW.test(v)) return false;
  if (!/^https?:\/\//i.test(v)) return false; // must be absolute http(s)
  try {
    const host = new URL(v).hostname.toLowerCase();
    if (LOCAL_HOSTS.includes(host)) return false;
    // Treat private LAN ranges as non-shareable too.
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
    return true;
  } catch (_) {
    return false;
  }
}

// Returns { state: 'SHAREABLE_PREVIEW'|'LOCAL_ONLY_PREVIEW'|'NO_PREVIEW', url: string|null }
function classifyPreview(lead) {
  // Prefer explicit public/shareable fields, then tracked/relative ones.
  const shareCandidates = [lead.shareablePreviewUrl, lead.publicPreviewUrl];
  for (const c of shareCandidates) {
    if (isShareableUrl(c)) return { state: 'SHAREABLE_PREVIEW', url: c.trim() };
  }
  // trackedPreviewUrl / previewUrl could in theory be absolute https — honor that.
  const maybe = [lead.trackedPreviewUrl, lead.previewUrl];
  for (const c of maybe) {
    if (isShareableUrl(c)) return { state: 'SHAREABLE_PREVIEW', url: c.trim() };
  }
  // Any non-empty preview signal that is NOT shareable => local-only.
  const localSignals = [lead.trackedPreviewUrl, lead.previewUrl, lead.previewPath]
    .map(v => (typeof v === 'string' ? v.trim() : ''))
    .filter(v => v && !PLACEHOLDER_PREVIEW.test(v));
  if (localSignals.length || lead.previewStatus === 'READY') {
    return { state: 'LOCAL_ONLY_PREVIEW', url: null };
  }
  return { state: 'NO_PREVIEW', url: null };
}

// ═════════════════════════════════════════════════════════════════════════════
// PREVIEW-FIRST DIRECT OUTREACH DOCTRINE (CTA_VARIANTS sprint):
// A SEPARATE, opt-in outreach mode (PREVIEW_FIRST_DIRECT_DEALSENSE) for warm
// first contact when a SHAREABLE preview link already exists. Unlike the P0E
// permission-first doctrine above, these messages intentionally LEAD with the
// prepared preview link and a clear business benefit, then mention "harga khas"
// only near the end. They are NOT validated against the P0E permission-phrase
// requirement — they have their own forbidden-phrase guard
// (PF_FORBIDDEN_PHRASES). The legacy 5 modes below keep P0E behavior untouched.
//
// SAFETY: this mode only changes COPY GENERATION. It does not auto-send, does
// not open WhatsApp, does not mutate prospectStatus, and never invents a fake
// link — when no shareable preview exists it returns the permission-style
// fallback (PF_FALLBACK) that asks to send a preview once ready.
// ═════════════════════════════════════════════════════════════════════════════

// Forbidden phrases for preview-first variants (sprint FORBIDDEN PHRASES list).
// Checked as case-insensitive substrings; if any appears the variant is dropped
// to the safe permission-based fallback.
const PF_FORBIDDEN_PHRASES = [
  'saya tengah test', 'mini booking page concept', 'automation', 'ai',
  'apexprospect', 'landing page engine', 'saya bina tool', 'confirm naik sales',
  'confirm dapat customer', 'website yang memikat customer',
  'berminat tak mempunyai website sendiri', 'guarantee booking', 'guarantee order',
];

// Preview-first variant catalogue (sprint VARIANT 01–15). Each messageTemplate
// uses [BUSINESS_NAME] and [PREVIEW_LINK] placeholders interpolated at build
// time. id/label/riskLevel/bestFor mirror the sprint spec.
// [PRICE_LINE] is interpolated at build time: a price/discount-bearing line when
// pricing is approved in config (isPriceConfigured), else the neutral
// "Saya boleh terangkan harga setup yang sesuai." (DOCTRINE_LOCK price rule).
// Variant ids re-aligned to the DOCTRINE_LOCK slug set; the 5 extra variants
// from the CTA_VARIANTS sprint keep pf-prefixed ids as additional rotation.
const PREVIEW_FIRST_VARIANTS = [
  { id: 'preview_first_balanced', label: 'Balanced Preview First',   riskLevel: 'SAFE',   bestFor: 'General local business with preview ready',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada sediakan satu contoh website ringkas untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya buat preview ini supaya tuan/puan boleh nampak macam mana customer boleh faham servis, pakej, lokasi dan terus klik WhatsApp untuk tanya atau booking.\n\nPada pandangan saya, kalau [BUSINESS_NAME] ada website yang tersusun macam ini, customer baru akan lebih mudah faham apa yang ditawarkan sebelum mereka WhatsApp.\n\nKalau tuan/puan berminat untuk jadikan website ini milik [BUSINESS_NAME], boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_potential', label: 'Strong Business Potential', riskLevel: 'SAFE',   bestFor: 'Business with visible active service/page',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat satu preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nTujuan website ini simple — bantu customer cepat faham servis, pakej, lokasi dan terus klik WhatsApp untuk tanya atau booking.\n\nSaya nampak [BUSINESS_NAME] ada potensi yang bagus untuk dipersembahkan dengan lebih kemas secara online.\n\nKalau tuan/puan berminat, boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_direct_owner', label: 'Direct Owner View',     riskLevel: 'SAFE',   bestFor: 'Owner who may appreciate direct preview',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya nak tunjuk satu website preview yang saya sediakan untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini saya susun supaya customer boleh terus nampak servis, pakej, lokasi dan butang WhatsApp untuk booking.\n\nKalau [BUSINESS_NAME] guna website seperti ini, customer akan lebih mudah faham sebelum bertanya atau buat booking.\n\nJika tuan/puan berminat untuk memiliki website ini, boleh balas mesej ini dan saya terangkan langkah seterusnya. [PRICE_LINE]' },
  { id: 'preview_first_whatsapp_flow', label: 'WhatsApp Booking Flow', riskLevel: 'SAFE',   bestFor: 'WhatsApp-driven business',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat satu contoh website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nFokus website ini ialah mudahkan customer faham servis dan terus klik WhatsApp untuk tanya harga atau booking.\n\nSaya susun page ini supaya customer tak perlu cari info terlalu lama — servis, pakej, lokasi dan contact semua nampak lebih jelas.\n\nKalau tuan/puan berminat untuk guna website ini bagi [BUSINESS_NAME], boleh reply mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_short', label: 'Short Preview First',          riskLevel: 'SAFE',   bestFor: 'WhatsApp outreach where short message is preferred',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini bantu customer cepat faham servis, pakej, lokasi dan terus klik WhatsApp untuk tanya atau booking.\n\nKalau tuan/puan berminat untuk guna website ini bagi [BUSINESS_NAME], boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_customer_clarity', label: 'Customer Clarity',  riskLevel: 'SAFE',   bestFor: 'Service business with unclear service info',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada sediakan preview website ringkas untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya susun website ini dari sudut customer baru — supaya mereka cepat nampak servis apa yang ditawarkan, lokasi bisnes, dan cara untuk terus WhatsApp.\n\nKadang customer berminat, tapi mereka perlukan info yang jelas sebelum bertanya atau booking.\n\nKalau tuan/puan rasa website macam ini sesuai untuk [BUSINESS_NAME], boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_local_trust', label: 'Local Trust Page',       riskLevel: 'SAFE',   bestFor: 'Local businesses needing stronger first impression',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat contoh website ringkas untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya susun website ini supaya customer baru boleh nampak bisnes tuan/puan dengan lebih kemas dan mudah faham.\n\nBila servis, lokasi dan WhatsApp tersusun dalam satu page, customer lebih senang faham dan terus bertanya.\n\nKalau tuan/puan berminat untuk jadikan website ini milik [BUSINESS_NAME], boleh reply mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_owner_benefit', label: 'Owner Benefit First',  riskLevel: 'SAFE',   bestFor: 'Owner who cares about booking/order flow',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya nak share satu preview website yang saya sediakan untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya buatkan susunan ini supaya customer lebih mudah faham servis dan terus ke WhatsApp tanpa perlu tanya banyak kali benda asas seperti lokasi, pakej atau cara booking.\n\nWebsite macam ini boleh bantu bisnes nampak lebih tersusun di mata customer baru.\n\nKalau tuan/puan berminat, boleh reply mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_simple_ownership', label: 'Simple Website Ownership', riskLevel: 'SAFE', bestFor: 'Business with no existing website or weak web presence',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat contoh website ringkas untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini boleh jadi tempat customer lihat servis, pakej, lokasi dan terus tekan WhatsApp untuk bertanya atau booking.\n\nJadi bila customer baru tanya tentang bisnes, tuan/puan boleh terus share satu link yang nampak lebih kemas dan mudah faham.\n\nKalau berminat untuk jadikan website ini milik [BUSINESS_NAME], boleh reply mesej ini. [PRICE_LINE]' },
  { id: 'preview_first_impression', label: 'First Impression',        riskLevel: 'SAFE',   bestFor: 'Business with weak online presentation',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada buat satu preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya sediakan preview ini supaya [BUSINESS_NAME] nampak lebih kemas bila customer baru cari info servis.\n\nDalam website ini, customer boleh nampak servis, lokasi dan butang WhatsApp untuk tanya atau booking dengan lebih jelas.\n\nKalau tuan/puan berminat untuk guna website ini, boleh reply mesej ini dan saya terangkan pilihan setup yang sesuai. [PRICE_LINE]' },
  // ── Extra variants retained from CTA_VARIANTS sprint (pf-prefixed ids) ──
  { id: 'pf_service_package', label: 'Service Package Clarity',       riskLevel: 'SAFE',   bestFor: 'Spa, beauty, salon, clinic, service package business',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya sediakan satu preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini dibuat supaya customer boleh semak servis, pakej, lokasi dan cara booking dengan lebih mudah.\n\nUntuk bisnes servis macam [BUSINESS_NAME], customer biasanya nak faham dulu apa yang sesuai sebelum mereka WhatsApp.\n\nKalau susunan info lebih jelas, customer lebih senang bertanya dan buat booking.\n\nKalau tuan/puan berminat, boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'pf_soft_direct', label: 'Soft Direct Preview',               riskLevel: 'SAFE',   bestFor: 'First contact with unknown owner',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada sediakan satu contoh website ringkas untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nTak perlu komit apa-apa dulu. Saya cuma nak tunjuk macam mana info servis, lokasi dan WhatsApp boleh nampak lebih kemas dari sudut customer.\n\nKalau tuan/puan rasa preview ini sesuai untuk [BUSINESS_NAME], boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'pf_customer_journey', label: 'Customer Journey',             riskLevel: 'SAFE',   bestFor: 'Business with many services/packages',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada sediakan preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nSaya susun website ini ikut flow customer — mula-mula mereka nampak servis, kemudian pakej atau info penting, lokasi, dan akhir sekali terus klik WhatsApp untuk tanya atau booking.\n\nTujuannya supaya customer tak keliru dan lebih mudah faham sebelum hubungi [BUSINESS_NAME].\n\nKalau tuan/puan berminat untuk guna website ini, boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'pf_promo_ready', label: 'Promo Ready Website',               riskLevel: 'SAFE',   bestFor: 'Business that can run promos/packages',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya ada sediakan preview website untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini boleh bantu susun servis, pakej, lokasi, promo dan butang WhatsApp dalam satu page yang mudah customer faham.\n\nKalau [BUSINESS_NAME] nak buat promo atau push booking, link macam ini lebih senang share dekat customer.\n\nKalau tuan/puan berminat, boleh balas mesej ini. [PRICE_LINE]' },
  { id: 'pf_direct_sales', label: 'Direct Sales Offer',               riskLevel: 'MEDIUM', bestFor: 'Warm lead, manual review only',
    messageTemplate: 'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.\n\nSaya dah sediakan satu website preview untuk [BUSINESS_NAME]:\n[PREVIEW_LINK]\n\nWebsite ini dibuat untuk bantu customer lebih cepat faham servis, pakej, lokasi dan terus WhatsApp untuk booking.\n\nSaya rasa website seperti ini boleh jadi aset yang berguna untuk [BUSINESS_NAME], terutama bila customer baru nak tengok info sebelum buat keputusan.\n\nKalau tuan/puan mahu website ini siap digunakan untuk bisnes, boleh balas mesej ini. [PRICE_LINE]' },
];

// Price-gating (DOCTRINE_LOCK). A lead/offer is price-configured ONLY when one
// of these explicit fields is set; quotedAmount/dealValue do NOT count (they are
// internal tracking, not approved-to-quote signals).
function isPriceConfigured(lead) {
  if (!lead || typeof lead !== 'object') return false;
  if (lead.discountApproved === true) return true;
  if (lead.specialPriceApproved === true) return true;
  const offerPrice = lead.offerPrice;
  if (offerPrice !== undefined && offerPrice !== null && String(offerPrice).trim() !== '') return true;
  const priceRange = lead.priceRange;
  if (priceRange !== undefined && priceRange !== null && String(priceRange).trim() !== '') return true;
  return false;
}

// The gated [PRICE_LINE]. When pricing is approved, offer a special setup price;
// otherwise the neutral "explain a suitable setup price" line. Never promises a
// discount unless config allows it.
function priceLine(lead) {
  if (isPriceConfigured(lead)) {
    return 'Saya boleh bagi harga khas untuk setup awal.';
  }
  return 'Saya boleh terangkan harga setup yang sesuai.';
}

// Fallback when no shareable preview link exists — never claims a website is
// already prepared; promises to send the preview once ready. (DOCTRINE_LOCK
// "PREVIEW EXISTENCE RULE" fallback wording.)
function previewFirstFallback(businessName) {
  const name = businessName || 'bisnes tuan/puan';
  return join([
    'Hi Assalamualaikum tuan/puan, saya Aliff dari DealSense.my.',
    '',
    `Saya sedang sediakan satu contoh website ringkas untuk ${name}, supaya customer boleh lebih mudah nampak servis, lokasi dan butang WhatsApp untuk tanya atau booking.`,
    '',
    'Bila preview siap, saya boleh hantar di sini untuk tuan/puan tengok dulu.',
  ]);
}

// Validate a preview-first draft against the sprint's forbidden-phrase list
// (NOT the P0E permission requirement — this mode is intentionally direct).
function validatePreviewFirstCopy(copy) {
  const lc = String(copy || '').toLowerCase();
  const reasons = [];
  for (const phrase of PF_FORBIDDEN_PHRASES) {
    // 'ai' is a 2-char token — word-boundary it to avoid false hits (e.g. "pakai").
    if (phrase.length <= 3) {
      if (new RegExp('\\b' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(lc)) {
        reasons.push('forbidden:' + phrase);
      }
    } else if (lc.includes(phrase)) {
      reasons.push('forbidden:' + phrase);
    }
  }
  return { ok: reasons.length === 0, reasons };
}

/**
 * Build a preview-first direct outreach variant for a lead.
 * Picks variant by index (rotation) when a SHAREABLE preview exists; otherwise
 * returns the permission-style fallback. Never invents a fake link.
 *
 * @param {object} lead
 * @param {number} [variantIndex=0] which of the 15 variants to use (mod 15)
 * @returns {{ draft, mode, modeLabel, variantId, riskLevel, previewState, sendReady, copySafety }}
 */
function generatePreviewFirstVariant(lead, variantIndex = 0) {
  const name = (lead.businessName || '').trim() || 'bisnes tuan/puan';
  const { state, url } = classifyPreview(lead);

  // No shareable link → honest fallback. Do not pretend a preview exists.
  if (state !== 'SHAREABLE_PREVIEW' || !url) {
    const draft = previewFirstFallback(lead.businessName ? name : '');
    return {
      draft, mode: 'PREVIEW_FIRST_DIRECT_DEALSENSE',
      modeLabel: 'Preview First Direct (awaiting preview)',
      variantId: 'pf-fallback', riskLevel: 'SAFE',
      previewState: state, sendReady: false, copySafety: 'FALLBACK:no-shareable-preview',
    };
  }

  const idx = ((Number(variantIndex) || 0) % PREVIEW_FIRST_VARIANTS.length + PREVIEW_FIRST_VARIANTS.length) % PREVIEW_FIRST_VARIANTS.length;
  const v = PREVIEW_FIRST_VARIANTS[idx];
  let draft = v.messageTemplate
    .replace(/\[BUSINESS_NAME\]/g, name)
    .replace(/\[PREVIEW_LINK\]/g, url)
    .replace(/\[PRICE_LINE\]/g, priceLine(lead))
    .trim();

  // Sprint forbidden-phrase guard. If somehow tripped (e.g. business name
  // contains a banned token), drop to the safe fallback.
  const check = validatePreviewFirstCopy(draft);
  if (!check.ok) {
    return {
      draft: previewFirstFallback(lead.businessName ? name : ''),
      mode: 'PREVIEW_FIRST_DIRECT_DEALSENSE',
      modeLabel: 'Preview First Direct (safe fallback)',
      variantId: 'pf-fallback', riskLevel: 'SAFE',
      previewState: state, sendReady: false, copySafety: 'FALLBACK:' + check.reasons.join('|'),
    };
  }

  return {
    draft, mode: 'PREVIEW_FIRST_DIRECT_DEALSENSE',
    modeLabel: 'Preview First Direct — ' + v.label,
    variantId: v.id, riskLevel: v.riskLevel,
    previewState: state, sendReady: true, copySafety: 'OK',
  };
}

// ── Variant modes ────────────────────────────────────────────────────────────
const MODES = [
  'PREVIEW_FIRST_DIRECT',
  'PROBLEM_TO_PROOF',
  'SOFT_PROFESSIONAL',
  'VALUE_FIRST',
  'SHORT_WHATSAPP_PROOF',
];

// Opt-in preview-first direct mode (CTA_VARIANTS sprint). Kept OUT of MODES so
// the legacy rotation/validation path is untouched; routed explicitly by id.
const PREVIEW_FIRST_MODE = 'PREVIEW_FIRST_DIRECT_DEALSENSE';
// P0E labels: describe the first-contact version each mode now generates.
// (Mode keys retained from P0D for rotation/envelope compatibility.)
const MODE_LABELS = {
  PREVIEW_FIRST_DIRECT:  'Most Natural',
  PROBLEM_TO_PROOF:      'Strong Friction',
  SOFT_PROFESSIONAL:     'Safest First Contact',
  VALUE_FIRST:           'Preview Permission',
  SHORT_WHATSAPP_PROOF:  'Very Soft',
};

const IMPROVE_CLOSINGS = [
  'Kalau mahu dibuat tambah baik, saya boleh adjust ikut gaya bisnes.',
  'Kalau ada bahagian yang puan/tuan mahu ubah, saya boleh kemaskan ikut cara puan/tuan.',
  'Puan/tuan boleh tengok dulu, kemudian saya boleh adjust ikut gaya bisnes.',
  'Kalau nampak ada potensi, saya boleh bantu kemaskan supaya lebih kena dengan bisnes puan/tuan.',
];

function greet(name, location) {
  return location ? `Hi ${name}, saya Aliff dari ${location}.` : `Hi ${name}, saya Aliff.`;
}

function join(parts) {
  return parts.filter(p => p !== null && p !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ── P0E safety validation ────────────────────────────────────────────────────
// Lightweight local check: first-contact copy must contain NO forbidden phrase
// and at least ONE permission phrase. Returns { ok, reasons }.
function validateSafeFirstContactCopy(copy) {
  const reasons = [];
  const lc = String(copy || '').toLowerCase();
  for (const phrase of FORBIDDEN_COPY_PHRASES) {
    // Word-boundary check for short tokens like "ai" to avoid false hits
    // (e.g. "pakai", "saiz"); substring for multi-word phrases.
    if (phrase.length <= 3) {
      if (new RegExp('\\b' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(lc)) {
        reasons.push('forbidden:' + phrase);
      }
    } else if (lc.includes(phrase)) {
      reasons.push('forbidden:' + phrase);
    }
  }
  const hasPermission = PERMISSION_PHRASES.some(p => lc.includes(p));
  if (!hasPermission) reasons.push('missing-permission-cta');
  return { ok: reasons.length === 0, reasons };
}

// The safest first-contact DM — always valid, always ready to send.
function safeFirstContactFallback(lead) {
  const name = (lead.businessName || 'bisnes ni').trim();
  return join([
    `Hi ${name}, saya perasan ${DEFAULT_SAFE_OBSERVATION}`,
    '',
    'Dari sudut customer, mereka biasanya nak cepat faham servis, lokasi dan cara tanya atau booking.',
    '',
    'Kalau saya hantar satu preview ringkas untuk tunjuk susunan yang lebih kemas, boleh? Tak perlu komit apa-apa dulu.',
  ]);
}

// Niche-aware "service" noun for first-contact body. Falls back to "servis".
function serviceNoun(lead) {
  const cat = classifyNiche(lead.niche || lead.category || '');
  const map = { beauty: 'servis spa/beauty', clinic: 'servis klinik', contractor: 'servis', food: 'servis makanan', general: 'servis' };
  return map[cat] || 'servis';
}

// The five P0E first-contact DM versions, keyed by mode. Each is permission-based
// and preview-first. (Mode names retained from P0D so app.js/server rotation and
// the response envelope stay backward-compatible.)
const FIRST_CONTACT_VERSIONS = {
  // Version A — Most Natural
  PREVIEW_FIRST_DIRECT(lead, name, svc) {
    return join([
      `Hi ${name}, saya perasan info ${svc} boleh dibuat lebih mudah faham untuk customer baru.`,
      '',
      'Dari sudut customer, mereka biasanya nak cepat tahu servis apa, area mana, dan macam mana nak tanya atau booking.',
      '',
      'Boleh saya tunjuk satu contoh ringkas macam mana info tu boleh disusun lebih kemas untuk flow WhatsApp?',
    ]);
  },
  // Version D — Strong Customer Friction
  PROBLEM_TO_PROOF(lead, name) {
    return join([
      `Hi ${name}, saya perasan customer mungkin perlu cari sendiri beberapa info sebelum tanya servis.`,
      '',
      'Dari sudut customer baru, kalau langkah untuk tanya harga atau booking lebih jelas, mereka lebih senang terus WhatsApp.',
      '',
      'Boleh saya tunjuk satu contoh ringkas susunan flow customer tu?',
    ]);
  },
  // Version B — Safest First Contact
  SOFT_PROFESSIONAL(lead, name) {
    return join([
      `Hi ${name}, saya perasan page bisnes ni ada ruang kecil untuk kemaskan info servis dan cara customer bertanya.`,
      '',
      'Saya boleh tunjuk satu preview ringkas dari sudut customer — supaya info servis, lokasi dan WhatsApp nampak lebih jelas.',
      '',
      'Kalau tak sesuai, tak apa. Boleh saya hantar contoh tu di sini?',
    ]);
  },
  // Version C — Preview Permission
  VALUE_FIRST(lead, name) {
    return join([
      `Hi ${name}, saya nampak servis ni sesuai kalau info penting disusun dalam satu page ringkas yang mudah customer faham.`,
      '',
      'Kadang customer cuma nak cepat nampak servis, harga anggaran atau cara booking.',
      '',
      'Kalau saya hantar satu contoh preview yang lebih kemas untuk flow customer WhatsApp, boleh?',
    ]);
  },
  // Version E — Very Soft / Low Pressure
  SHORT_WHATSAPP_PROOF(lead, name) {
    return join([
      `Hi ${name}, saya Aliff.`,
      '',
      'Saya ada nampak satu ruang kecil yang mungkin boleh buat info servis dan WhatsApp nampak lebih kemas untuk customer.',
      '',
      'Saya boleh share satu contoh pendek untuk tengok dulu. Tak perlu komit apa-apa. Kalau tak sesuai, tak apa.',
      '',
      'Boleh saya hantar di sini?',
    ]);
  },
};

// Build one P0E first-contact variant for a given mode. Returns
// { draft, mode, modeLabel, previewState, sendReady }. previewState/sendReady are
// retained for response-shape compatibility; first contact never auto-sends.
function generateVariant(lead, requestedMode) {
  const name = (lead.businessName || 'bisnes ni').trim();
  const svc  = serviceNoun(lead);
  const mode = MODES.includes(requestedMode) ? requestedMode : 'SOFT_PROFESSIONAL';

  let draft;
  try {
    const builder = FIRST_CONTACT_VERSIONS[mode] || FIRST_CONTACT_VERSIONS.SOFT_PROFESSIONAL;
    draft = builder(lead, name, svc);
  } catch (_) {
    draft = safeFirstContactFallback(lead);
  }

  // CTA Doctrine Lock enforcement: never emit unsafe first-contact copy.
  const check = validateSafeFirstContactCopy(draft);
  let copySafety = 'OK';
  if (!check.ok) {
    draft = safeFirstContactFallback(lead);
    copySafety = 'FALLBACK:' + check.reasons.join('|');
  }

  // previewState kept informational; first contact is permission-based, not link-first.
  const { state } = classifyPreview(lead);
  return {
    draft,
    mode,
    modeLabel: MODE_LABELS[mode],
    previewState: state,
    sendReady: false,
    copySafety,
  };
}

// ── P0E follow-up, price-reply, and mini-preview copy banks ───────────────────
function followUpTemplates(lead) {
  const name = (lead.businessName || 'bisnes ni').trim();
  return {
    after24h:       `Hi ${name}, saya follow up sikit ya. Saya cuma nak tunjuk satu preview ringkas macam mana info servis dan WhatsApp boleh disusun lebih kemas untuk customer. Kalau belum sesuai sekarang, tak apa.`,
    ownerWantsLook: 'Boleh, saya hantar contoh ringkas dulu ya. Fokus dia cuma untuk bagi customer lebih senang faham servis, lokasi dan cara tanya atau booking melalui WhatsApp.',
    ownerLaterLook: 'Baik, tak apa. Saya hantar ringkas saja supaya senang tengok bila free. Kalau rasa sesuai, baru kita bincang lanjut.',
  };
}

// Price replies use placeholders so Aliff fills the real numbers before sending.
function priceReplyTemplates() {
  return {
    simple:     'Harga untuk versi ringkas ialah [PRICE]. Siap dalam [DELIVERY TIME]. Dalam tu termasuk susunan info servis, CTA WhatsApp, dan copy yang lebih mudah customer faham. Bayaran boleh melalui [PAYMENT METHOD]. Kalau nak tengok preview dulu, boleh.',
    trustSafe:  'Untuk skop basic, [PRICE]. Saya susunkan info penting seperti servis, lokasi, cara tanya harga dan button WhatsApp supaya customer lebih mudah faham. Anggaran siap [DELIVERY TIME]. Bayaran melalui [PAYMENT METHOD]. Tak perlu decide sekarang, boleh tengok preview dulu.',
    lowPressure:'Boleh. Range ringkas saya letak [PRICE], siap sekitar [DELIVERY TIME]. Fokus dia bukan page besar, cuma page kemas untuk customer faham servis dan terus WhatsApp. Kalau selepas tengok preview rasa sesuai, baru proceed. Bayaran boleh melalui [PAYMENT METHOD].',
  };
}

function miniPreviewCopy(lead) {
  const name = (lead.businessName || 'bisnes ni').trim();
  const svc  = serviceNoun(lead).replace(/^servis\s*/, '') || 'servis';
  return {
    heroHeadline:     `Servis ${svc} Yang Mudah Customer Faham`,
    subheadline:      'Info servis, lokasi dan cara booking disusun ringkas supaya customer lebih senang tanya melalui WhatsApp.',
    trustLine:        'Info jelas. Susunan kemas. Senang customer buat keputusan.',
    serviceTitle:     'Servis Yang Ditawarkan',
    serviceDesc:      'Lihat servis utama, pilihan yang sesuai, dan cara untuk tanya maklumat lanjut dengan mudah.',
    ctaButton:        'Tanya Melalui WhatsApp',
    whatsappCta:      `Hi, saya nak tanya tentang servis ${name}. Boleh share info lanjut?`,
    faqs: [
      { q: 'Macam mana nak buat booking?', a: 'Tekan butang WhatsApp dan beritahu servis yang anda berminat.' },
      { q: 'Boleh tanya harga dulu?',      a: 'Boleh. Customer boleh tanya harga atau pakej yang sesuai melalui WhatsApp.' },
      { q: 'Di mana lokasi servis?',        a: 'Maklumat lokasi boleh diletakkan dengan jelas supaya customer mudah rujuk sebelum booking.' },
    ],
    closingCta:       'Nak tanya servis atau booking? Tekan WhatsApp dan kami bantu jawab.',
  };
}

/**
 * Generate a soft, natural BM WhatsApp DM draft from lead data.
 * Deterministic and local — no external API calls.
 *
 * Structure (P0C spec): greeting → local credibility → "Saya perasan" hook
 * (observed gap) → clear outcome → clear offer → low-pressure CTA → soft exit.
 * Makes no guarantees and never claims a preview already exists.
 *
 * @param {object} lead
 * @returns {string}
 */
function generateSoftDmDraft(lead) {
  // P0E default = Version B (Safest First Contact). Permission-based, preview-
  // first, validated against the CTA Doctrine Lock. Used by /generate-dm (no
  // mode) and import-time auto-draft.
  return generateVariant(lead, 'SOFT_PROFESSIONAL').draft;
}

/**
 * Safe fallback — guaranteed no forbidden phrases, always returns a string.
 * Called if generateSoftDmDraft throws.
 *
 * @param {object} lead
 * @returns {string}
 */
function fallbackDmDraft(lead) {
  // P0E: the safe, permission-based first-contact fallback.
  return safeFirstContactFallback(lead);
}

module.exports = {
  generateSoftDmDraft,
  fallbackDmDraft,
  generateVariant,
  classifyPreview,
  MODES,
  MODE_LABELS,
  // Preview-first direct outreach (CTA_VARIANTS sprint)
  generatePreviewFirstVariant,
  validatePreviewFirstCopy,
  previewFirstFallback,
  isPriceConfigured,
  priceLine,
  PREVIEW_FIRST_VARIANTS,
  PREVIEW_FIRST_MODE,
  PF_FORBIDDEN_PHRASES,
  // P0E doctrine surface (optional, non-breaking)
  validateSafeFirstContactCopy,
  safeFirstContactFallback,
  followUpTemplates,
  priceReplyTemplates,
  miniPreviewCopy,
  SAFE_CTA_BANK,
  SAFE_HOOK_BANK,
  FORBIDDEN_COPY_PHRASES,
  PERMISSION_PHRASES,
};
