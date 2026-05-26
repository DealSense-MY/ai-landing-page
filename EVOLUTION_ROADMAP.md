# Nexus Landing Engine — Evolution Roadmap

## Phase MVP (Current — SHIPPED)

Core features complete and deployed:

- [x] AI-powered landing page generation via Claude API
- [x] 7 niche templates (dental, beauty, F&B, digital, retail, education, general)
- [x] 3 tone modes (warm professional, casual, urgent)
- [x] Live editor (headline, subheadline, CTA, image, phone, address)
- [x] Desktop / Mobile preview toggle
- [x] Demo link generation and sharing
- [x] HTML export (client-side Blob download)
- [x] **UI language toggle (EN / BM)** — interface i18n with data-i18n attributes
- [x] **Output language selector** — 7 options: EN, BM, ZH, EN+BM, EN+ZH, ZH+BM, EN+BM+ZH
- [x] **Multilingual page output** — bilingual/trilingual with JS lang toggle + fade transition
- [x] x-api-key security middleware
- [x] Railway deployment config (Nixpacks + ON_FAILURE restart)
- [x] Demo pages: BM-only dental, EN+BM+ZH trilingual dental

---

## Phase 1 — Polish & Conversion Lift

Target: improve demo quality and operator experience.

- [ ] Persistent demo storage (Railway Volume or Supabase storage)
- [ ] Custom domain support (`yourpage.nexus.my`)
- [ ] QR code generation for each demo link
- [ ] Niche-specific urgency copy per language (expand NICHE_SEED_COPY)
- [ ] Section reordering via drag-and-drop in Live Editor
- [ ] Color theme override in form (user picks primary color)
- [ ] More niches: clinic_general, law_firm, fitness, property_agent

---

## Phase 2 — Multi-Page & Templates

- [ ] Template library: save generated pages as reusable templates
- [ ] Multi-section editor (add/remove sections from Live Editor)
- [ ] Video hero section support (YouTube/Vimeo embed)
- [ ] Testimonials section (AI-generated or user-input)
- [ ] FAQ section with accordion
- [ ] Pricing table section

---

## Phase 3 — SaaS & Auth

- [ ] User accounts (Supabase Auth)
- [ ] Per-user page library (saved pages, history)
- [ ] Subdomain hosting (`business-name.nexus.my`)
- [ ] Analytics: page views, WhatsApp click tracking
- [ ] Webhook: notify on WhatsApp CTA click (connect to CRM)
- [ ] Team collaboration: share page editor with team

---

## Phase 4 — White-Label & API

- [ ] White-label mode: remove branding, custom logo
- [ ] REST API for agencies to generate pages programmatically
- [ ] Zapier / Make integration
- [ ] Bulk generation: upload CSV → generate N pages
- [ ] Agency dashboard: manage client pages

---

## Multilingual Architecture Notes

Multilingual output is a **core MVP feature**, not a future add-on.

The current implementation:
- Single Claude API call returns all language variants in one JSON response (efficient)
- `buildHTML.js` injects i18n `<script>` + lang toggle buttons only when `outputLang` contains `+`
- Fade transition on language switch (opacity 0.6 → 1, 150ms delay)
- `data-i18n` attributes on all translatable elements
- Language buttons in navbar, styled to match brand color

Future multilingual improvements:
- RTL support (Arabic, Urdu) via `dir="rtl"` on `<html>`
- Tamil (TA) as 4th language for full Malaysian trilingual+
- Locale-aware number formatting (phone, prices)
- Language detection via browser `navigator.language`
