# PATCH + REFINEMENT BLUEPRINT
# AircondFresh Services — Production Polish
# Prepared by: Ith (Claude) — May 2026
# For: Cowork (Execution)

---

## ⚠️ BACA DULU — SEBELUM START

Ini adalah **REFINEMENT + PATCH** pass — BUKAN redesign.

Preserve:
- Semua structure HTML sedia ada
- Semua WA links yang functional
- Semua responsiveness
- Semua JavaScript functionality
- Color palette dan design system

Kerja **PROGRESSIVE** — section by section.
Jangan rewrite seluruh page sekaligus.

---

## 🔴 PATCH KRITIKAL — BUAT INI DULU (sebelum refinement)

### PATCH 1 — Image Path Fix (KRITIKAL)

Semua image path perlu disemak dan diperbetulkan.

**Masalah ditemui:**
```html
<!-- SALAH — double extension -->
<img src="Image/logo.png.png" ...>

<!-- BETUL -->
<img src="Image/logo.png" ...>
```

**Semak dan betulkan SEMUA image paths:**
- `logo.png` — navbar dan footer
- `hero-team.jpg` — hero section
- `indoor-cleaning.jpg` — gallery
- `outdoor-service.jpg` — gallery
- `gas-checking.jpg` — gallery
- `residential-service.jpg` — gallery
- `office-installation.jpg` — gallery
- `technical-closeup.jpg` — gallery

Pastikan semua path konsisten dengan struktur folder sebenar.

---

### PATCH 2 — Hero Image Integration (KRITIKAL)

Hero section sekarang hanya guna background gradient.
`hero-team.jpg` belum diintegrate sebagai actual image dalam hero.

**Masalah:**
- Hero image tersembunyi atau tidak wujud dalam HTML
- Trust asset paling kuat tidak visible

**Fix yang diperlukan:**
- Integrate `hero-team.jpg` sebagai actual `<img>` dalam `.hero-right`
- Pastikan image visible pada SEMUA screen sizes
- Stack layout secara vertical pada mobile — JANGAN hide image
- Responsive cropping yang proper
- Subtle dark overlay untuk readability teks
- Preserve keterlihatan technician dan branding syarikat

**CSS yang diperlukan:**
```css
.hero-right img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

/* Mobile — JANGAN hide */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-right {
    display: block; /* JANGAN display:none */
    order: -1; /* image dulu, text bawah */
  }
}
```

---

### PATCH 3 — Gallery Real Images

Gallery section perlu assign gambar sebenar syarikat.

**Assign image ini ke gallery cards:**

| Image File | Caption |
|---|---|
| `indoor-cleaning.jpg` | Servis & Cuci Unit Indoor |
| `outdoor-service.jpg` | Servis Unit Outdoor |
| `gas-checking.jpg` | Semakan & Top-Up Gas |
| `residential-service.jpg` | Servis Kediaman |
| `office-installation.jpg` | Pemasangan Pejabat |
| `technical-closeup.jpg` | Kerja Teknikal Profesional |

Pastikan semua gambar load dengan betul dan responsive.

---

### PATCH 4 — Copyright Year

```html
<!-- SALAH -->
© 2025 AircondFresh Services

<!-- BETUL -->
© 2026 AircondFresh Services
```

Betulkan di footer dan mana-mana tempat lain yang ada tahun.

---

## 🟡 REFINEMENT — BUAT SELEPAS PATCH SELESAI

### REFINEMENT 1 — Icon System

Kurangkan emoji berlebihan — ganti dengan SVG icons atau Lucide icons.

**Fokus pada:**
- Trust bar items
- Services section
- Problems section
- Contact section
- Footer nav links

**Elak tukar:**
- Floating WA button (dah ada SVG)
- Sticky mobile CTA bar

**Contoh replacement:**
```html
<!-- SEBELUM -->
❄️ Aircond Service

<!-- SELEPAS -->
<svg>... snowflake icon ...</svg> Aircond Service
```

Maintain clean contractor-business appearance.

---

### REFINEMENT 2 — Trust Bar

Improve visual hierarchy dalam trust bar.

**Sekarang:** Semua items rasa sama berat
**Target:** Visual emphasis pada items paling penting

Emphasize:
- Fast Response
- Perniagaan Berdaftar (KT0545349-H)
- Jaminan Kerja

Cara:
- Subtle typography hierarchy
- Cleaner spacing
- Slightly stronger visual weight pada key items
- Jangan over-style

---

### REFINEMENT 3 — Authenticity Fix

Buang atau ganti fake statistics.

**Cari dan ganti:**

| Sebelum | Selepas |
|---|---|
| "500+ Customers" | "Dipercayai Pelanggan Sekitar Perak" |
| "1000+ Units Serviced" | "Servis Rumah & Premis Sekitar Perak" |
| "98% Satisfaction Rate" | "Pelanggan Setia Kami Terus Kembali" |
| Mana-mana angka tidak verified | Positioning statement yang realistik |

Maintain authenticity — jangan invent nombor baru.

---

### REFINEMENT 4 — Pricing Section

Kurangkan SaaS/startup feel.
Jadikan lebih seperti contractor package yang realistik.

**Improve:**
- Package hierarchy lebih jelas
- Badge styling lebih subtle
- Language lebih contractor-focused
- Spacing dan readability

**Elak:**
- Flashy ribbons berlebihan
- Over-marketing language
- Startup/SaaS visual style

Kekalkan:
- Strong CTA visibility
- Clear package comparison
- 3 tier structure (Basic / Deep Clean / Full Overhaul)

---

### REFINEMENT 5 — Why Choose Us

Improve visual rhythm — kurang robotic, lebih premium.

**Cara:**
- Subtle staggered layout — alternate slight vertical offsets
- Improve spacing rhythm
- Maintain clean alignment

**Contoh offset:**
```css
.why-card:nth-child(even) {
  margin-top: 24px;
}
```

Kekalkan realistic dan professional feel.

---

### REFINEMENT 6 — Gallery Presentation

Improve image presentation sahaja — jangan restructure.

**Improve:**
- Slightly larger image heights
- Cleaner image ratios (consistent)
- Better mobile scaling
- Object-fit: cover untuk semua gallery images

```css
.gallery-img {
  width: 100%;
  height: 240px; /* atau 260px */
  object-fit: cover;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .gallery-img {
    height: 200px;
  }
}
```

---

### REFINEMENT 7 — Contact Section

Tambah trust microdetail — response time messaging.

**Tambah subtle text:**
```html
<p class="response-time">
  ✓ Biasanya membalas dalam masa 5–15 minit
</p>
```

**CSS:**
```css
.response-time {
  font-size: 13px;
  color: var(--lime-green);
  margin-top: 8px;
  opacity: 0.85;
}
```

Improve:
- CTA hierarchy
- Spacing
- Trust reassurance messaging

---

### REFINEMENT 8 — Floating WA Button

Subtle premium refinement sahaja.

**Improve:**
- Softer shadow
- Subtle hover interaction lebih clean

```css
.wa-float {
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.wa-float:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(37, 211, 102, 0.35);
}
```

**Elak:**
- Glowing effects berlebihan
- Heavy animations

---

### REFINEMENT 9 — Design System Consistency

Standardize border radius.

**Sistem yang perlu diikut:**
```css
--radius-sm: 12px;   /* badges, tags */
--radius:    16px;   /* cards, containers */
--radius-lg: 20px;   /* hero image, large containers */
--radius-pill: 999px; /* buttons sahaja */
```

Semak dan standardize pada:
- Cards (service, pricing, why, testi)
- Buttons
- Images
- Badges
- Containers

---

### REFINEMENT 10 — Typography

Improve readability.

**Target:**
- Body text minimum 14–15px
- Better line-height pada mobile
- Cleaner text spacing

```css
body {
  font-size: 15px;
  line-height: 1.7;
}

@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  p {
    line-height: 1.75;
  }
}
```

Preserve premium hierarchy — jangan flatten semua text sama saiz.

---

## ✅ QUALITY CHECKLIST — SEBELUM DECLARE SIAP

### Patch Checklist:
- [ ] `logo.png` load tanpa error (bukan `.png.png`)
- [ ] `hero-team.jpg` visible dalam hero — desktop DAN mobile
- [ ] Semua 6 gallery images load dengan betul
- [ ] Copyright tunjuk 2026

### Refinement Checklist:
- [ ] Emoji dikurangkan — SVG icons digunakan
- [ ] Trust bar ada visual hierarchy
- [ ] Tiada fake statistics
- [ ] Pricing rasa contractor, bukan SaaS
- [ ] Why Choose Us ada visual rhythm
- [ ] Gallery images consistent ratio
- [ ] Contact ada response-time text
- [ ] Floating WA button hover clean
- [ ] Border radius konsisten
- [ ] Body text minimum 14px

### Final Checklist:
- [ ] Semua WA links functional — format `wa.me/601XXXXXXXX`
- [ ] Mobile responsive — test 375px, 414px, 768px
- [ ] Desktop responsive — test 1280px, 1440px
- [ ] Sticky navbar berfungsi
- [ ] Smooth scroll berfungsi
- [ ] Sticky mobile CTA bar visible
- [ ] Tiada console errors
- [ ] Page load fast
- [ ] Feel: premium contractor — bukan startup/SaaS

---

## 📋 WORKFLOW ORDER

```
PATCH dulu (wajib):
1. Fix image paths → hero → gallery → copyright

REFINEMENT selepas patch stable:
2. Icon system
3. Trust bar hierarchy
4. Authenticity fix
5. Pricing refinement
6. Why Choose Us rhythm
7. Gallery presentation
8. Contact microdetails
9. Floating WA button
10. Design consistency
11. Typography

FINAL:
12. Full checklist semak
13. Test mobile + desktop
14. Declare siap
```

---

## 📌 NOTA PENTING UNTUK COWORK

1. Kerja **progressive** — satu section satu masa
2. **JANGAN hide** hero image pada mobile — ini trust asset utama
3. **JANGAN invent** statistik atau nombor baru
4. **JANGAN redesign** — ini polish pass sahaja
5. **PRESERVE** semua WA links dan JavaScript
6. Setiap step — verify responsiveness sebelum proceed
7. Output: single `index.html` file — production ready

---

*Patch ini disediakan oleh Ith berdasarkan audit penuh index.html*
*Untuk execution oleh Cowork*
*Version: 1.0 — May 2026*
