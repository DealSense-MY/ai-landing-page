# FINAL REFINEMENT PATCH — PRODUCTION POLISH
# AircondFresh Services
# Prepared by: Ith (Claude) — May 2026
# For: Cowork (Execution)

---

## ⚠️ BACA DULU — WAJIB

Ini adalah FINAL CSS + SMALL HTML PATCH sahaja.
JANGAN redesign, JANGAN rebuild sections.
JANGAN ubah pricing, business info, WA links, JavaScript.
PRESERVE semua HTML structure, IDs, anchors, responsiveness.

Kerja dengan TARGETED — cari CSS class yang disebut, replace nilai sahaja.
Jangan rewrite keseluruhan CSS block kalau tak perlu.

---

## PATCH 1 — HERO OVERLAY (lighten)

Cari `.hero-bg::after` dalam CSS dan replace nilai gradient:

```css
/* REPLACE — hero overlay lebih terang */
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(7,21,16,0.82) 0%,
    rgba(7,21,16,0.65) 40%,
    rgba(7,21,16,0.30) 70%,
    rgba(7,21,16,0.08) 100%
  );
  z-index: 1;
}

/* Tablet */
@media (max-width: 900px) {
  .hero-bg::after {
    background: linear-gradient(
      180deg,
      rgba(7,21,16,0.80) 0%,
      rgba(7,21,16,0.68) 60%,
      rgba(7,21,16,0.60) 100%
    );
  }
}

/* Mobile — kekalkan gelap untuk readability */
@media (max-width: 600px) {
  .hero-bg::after {
    background: rgba(7,21,16,0.82);
  }
}
```

---

## PATCH 2 — HERO HEIGHT (reduce)

Cari `#hero` dalam CSS dan update:

```css
/* REPLACE */
#hero {
  position: relative;
  min-height: 88vh; /* WAS: 100vh */
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 0;
}
```

Cari `.hero-inner` dan update padding:

```css
/* REPLACE */
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  padding: 110px 24px 80px; /* WAS: 140px 24px 100px */
  width: 100%;
}
```

---

## PATCH 3 — HERO CONTENT WIDTH

Cari `.hero-left` dalam CSS dan update:

```css
/* REPLACE */
.hero-left {
  max-width: 560px; /* WAS: 620px — tighter untuk better readability rhythm */
}
```

---

## PATCH 4 — NAVBAR LOGO BALANCE

Cari `.nav-logo` dalam CSS dan update:

```css
/* REPLACE */
.nav-logo {
  height: 48px; /* slightly more balanced */
  width: auto;
  border-radius: 6px;
  object-fit: contain;
  flex-shrink: 0;
}
```

Cari `.nav-brand` dalam CSS dan update:

```css
/* REPLACE */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px; /* WAS: 11px */
}
```

---

## PATCH 5 — TOPBAR CLEANUP (buang emoji)

Cari topbar HTML dan REPLACE:

```html
<!-- REPLACE topbar div -->
<div class="topbar">
  <span>Sekitar Perak</span>
  <span>|</span>
  <span>KT0545349-H Berdaftar</span>
  <span>|</span>
  <span>
    <a href="https://wa.me/60108388482">010-8388482</a>
    &nbsp;/&nbsp;
    <a href="https://wa.me/60175690276">017-5690276</a>
  </span>
</div>
```

Update topbar CSS:

```css
/* REPLACE */
.topbar {
  background: var(--dark-green);
  color: rgba(255,255,255,.65);
  font-size: .75rem;
  text-align: center;
  padding: .38rem 1rem;
  letter-spacing: .04em;
  font-weight: 500;
}
```

---

## PATCH 6 — BUTTON SHADOW (reduce)

Cari `.btn-primary` dan update box-shadow:

```css
/* REPLACE */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--wa-green);
  color: var(--white);
  padding: 16px 30px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 4px 18px rgba(37,211,102,.28); /* WAS: 0 8px 28px rgba(37,211,102,.4) */
  transition: all var(--transition);
}
.btn-primary:hover {
  background: var(--wa-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37,211,102,.38); /* WAS: 0 12px 36px .5 */
}
```

---

## PATCH 7 — SERVICE CARD EMOJI (replace)

Cari semua `📲 Book Sekarang` dalam service cards HTML dan replace dengan:

```html
<!-- REPLACE semua btn-book yang ada emoji 📲 -->
<a href="[preserve existing WA link]" class="btn-book">
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="flex-shrink:0;display:inline-block;vertical-align:middle;margin-right:6px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.054 23.782a.5.5 0 0 0 .609.631l6.053-1.59A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.67-.518-5.188-1.42l-.362-.214-3.742.981.998-3.645-.235-.374A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg> Book Sekarang
</a>
```

**PENTING:** Preserve semua WA links yang berbeza untuk setiap service card. Jangan tukar link, tukar text dan icon sahaja.

---

## PATCH 8 — TRUST BAR SPACING

Cari `.trust-bar-inner` dan update:

```css
/* REPLACE */
.trust-bar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px; /* WAS: 0 24px */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
}
```

Cari `.trust-item` dan update:

```css
/* REPLACE */
.trust-item {
  display: flex;
  align-items: center;
  gap: 12px; /* WAS: 10px */
  padding: 12px 32px; /* WAS: 10px 28px */
  border-right: 1px solid rgba(255,255,255,.1);
  flex: 1;
  min-width: 180px;
  max-width: 280px;
  justify-content: center;
}
```

---

## PATCH 9 — TESTIMONIAL AVATAR (more subtle)

Cari CSS untuk testimonial avatar (`.testi-avatar` atau similar) dan update:

```css
/* REPLACE — jika ada gradient avatar */
.testi-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--off-white);
  border: 2px solid rgba(109,190,69,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: var(--dark-green);
  flex-shrink: 0;
}
```

---

## PATCH 10 — GALLERY HOVER (subtle)

Cari `.gallery-card:hover` dan update:

```css
/* REPLACE */
.gallery-card:hover {
  transform: translateY(-4px); /* WAS: scale(1.025) — lebih subtle */
  box-shadow: 0 10px 30px rgba(0,0,0,.25); /* WAS: 0 12px 36px .3 */
}
```

---

## PATCH 11 — FOOTER SPACING

Cari `footer` CSS dan update padding:

```css
/* REPLACE — tighten footer */
footer {
  background: var(--dark-green);
  padding: 52px 24px 0; /* WAS: mungkin lebih besar */
}
```

---

## PATCH 12 — ELECTRICAL WORK IMAGE (verify + fix)

Cari service card Electrical Work dalam HTML.
Verify ada `<img>` tag dengan path betul.

Patut ada:
```html
<img src="Image/Electrical-Work.jpg" alt="Electrical Work — AircondFresh Services" class="service-img" loading="lazy" />
```

Kalau belum ada — tambah sebelum `.service-icon-wrap` dalam Electrical Work card.
Semak nama file exact dalam folder Image/ — mungkin `.jpg`, `.jpeg`, atau `.png`.

---

## ✅ QUALITY CHECKLIST SEBELUM DECLARE SIAP

### Hero:
- [ ] Technician visible dalam hero background
- [ ] Van branding visible
- [ ] Text headline readable
- [ ] CTA buttons clear
- [ ] Hero height tidak terlalu tall pada desktop
- [ ] Mobile overlay masih gelap — text readable

### Navbar:
- [ ] Logo balanced — tidak terlalu besar atau kecil
- [ ] Topbar tiada emoji
- [ ] Nav links aligned properly

### Sections:
- [ ] Service cards — tiada emoji pada Book Sekarang button
- [ ] Electrical Work card ada gambar
- [ ] Gallery hover — subtle translateY, bukan scale
- [ ] Testimonial avatars — subtle, realistic
- [ ] Trust bar — breathing room cukup

### Final:
- [ ] Semua WA links functional
- [ ] Mobile responsive — test 375px, 768px
- [ ] Desktop — test 1280px, 1440px
- [ ] Tiada console errors
- [ ] Tiada layout breaking
- [ ] Feel: premium Malaysian contractor — realistic

---

## 📋 WORKFLOW

```
1. Apply CSS patches (1-4, 6, 8-11) — CSS only, no HTML
2. Apply HTML patches (5, 7, 12) — targeted HTML changes
3. Test desktop — hero, navbar, services, gallery
4. Test mobile — hero overlay, CTA buttons, spacing
5. Full checklist semak
6. Declare siap
```

---

## ⚠️ NOTA PENTING

- Jangan rewrite CSS block besar — cari dan update nilai sahaja
- Preserve semua WA message text dalam links
- Jangan ubah pricing section langsung
- Jangan ubah JavaScript
- Selepas patch siap — page ready untuk LIVE deploy

---

*Final patch prepared by Ith — ready untuk production deploy*
*Version: FINAL — May 2026*
