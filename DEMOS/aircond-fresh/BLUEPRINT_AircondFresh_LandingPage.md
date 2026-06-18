# BLUEPRINT: AircondFresh Services — Premium Landing Page Upgrade
**Version:** 1.0  
**Prepared by:** Ith (Claude)  
**For:** Cowork (Execution)  
**Date:** May 2026

---

## 0. BACA DULU SEBELUM START

Baca skill berikut sebelum tulis sebarang kod:
- `frontend-design` SKILL.md
- `copywriting-emosi` SKILL.md (jika ada)

Kerja secara **PROGRESSIVE** — satu section pada satu masa.  
Jangan rewrite seluruh page sekaligus.  
Audit dulu → upgrade section by section → test → proceed.

---

## 1. MAKLUMAT BISNES (REAL — JANGAN UBAH)

| Field | Value |
|---|---|
| Nama Bisnes | AircondFresh Services |
| WhatsApp 1 | 010-8388482 |
| WhatsApp 2 | 017-5690276 |
| Email | aircondfreshservices@gmail.com |
| Facebook | https://web.facebook.com/aircondfreshservices |
| Kawasan Servis | Sekitar Perak |
| Bahasa | BM Utama, English Sub |

**WA Link format:**
- `https://wa.me/60108388482`
- `https://wa.me/60175690276`

---

## 2. ASSETS YANG ADA (DALAM FOLDER)

Guna HANYA asset ini — jangan guna stock photo atau AI image:

| File | Guna Untuk |
|---|---|
| `logo.png` | Navbar + Footer branding |
| `hero-team.jpg` | **PRIMARY HERO IMAGE** — guna sebagai hero utama |
| `indoor-cleaning.jpg` | Showcase servis cleaning indoor unit |
| `outdoor-service.jpg` | Showcase servis outdoor unit |
| `gas-checking.jpg` | Tunjukkan expertise teknikal |
| `residential-service.jpg` | Section servis rumah kediaman |
| `office-installation.jpg` | Section servis pejabat/komersial |
| `technical-closeup.jpg` | Trust/craftsmanship section |

**PENTING — Hero Image Rule:**  
`hero-team.jpg` mengandungi branding sebenar syarikat, nombor telefon sebenar, dan identiti bisnes. JANGAN gantikan dengan stock visual. Adapt dengan:
- Responsive cropping
- Subtle dark overlay untuk readability
- Proper visual hierarchy
- Preserve keterlihatan technician dan branding

---

## 3. DESIGN SYSTEM

### Color Palette
```css
:root {
  --dark-green: #071510;
  --mid-green: #0f241b;
  --lime-green: #6DBE45;
  --lime-light: #82d95b;
  --yellow: #d8b24a;
  --off-white: #f7faf7;
  --text-dark: #121212;
  --text-muted: #6b7280;
  --white: #ffffff;
}
```

### Typography
- **Headings:** 700–800 weight
- **Body:** 400–500 weight  
- **Buttons:** 600 weight
- Pilih Google Font yang distinctive — bukan Inter atau Roboto

### Design Direction
- Premium local contractor — bukan corporate asing
- Clean spacing + strong hierarchy
- Trust-first — realism over flashy
- Mobile experience adalah PRIORITY UTAMA

### ELAK:
- Excessive blur / glow effects
- Heavy animations
- Futuristic/glassy overload
- Generic template feel
- Excessive emojis
- Fake certifications atau statistik

---

## 4. CONTENT SPECIFICATION

### Hero Section
**Headline:** "Aircond Tak Sejuk? Kami Datang Servis Terus Ke Rumah Anda."  
**Subheadline:** "Servis Aircond Professional — Bersih, Kemas & Fast Response Sekitar Perak"  
**Layout:** Premium split — kiri: headline + CTA + trust indicators | kanan: hero-team.jpg  
**CTA:** WhatsApp button yang visible above fold

### Services
**Primary:**
1. Aircond Service
2. Repair / Baik Pulih
3. Installation / Pasang Baru

**Secondary:**
4. Gas Top-Up
5. Electrical Work

### Pricing (3 Package Cards)
| Package | Label |
|---|---|
| Basic Clean | Standard |
| Deep Clean | Most Popular ⭐ |
| Full Overhaul | Premium |

### Sections Wajib (ikut order ini):
1. **Navbar** — sticky, logo, nav links, WA button
2. **Hero** — split layout, hero-team.jpg, headline, WA CTA
3. **Trust Bar** — below hero, 3-4 trust indicators
4. **Common Problems** — masalah aircond biasa (no cooling, bising, bocor, etc)
5. **Services** — primary + secondary services dengan icons
6. **Why Choose Us** — 4 points kuat (pengalaman, peralatan, harga, response cepat)
7. **Pricing** — 3 package cards
8. **Gallery** — "Hasil Kerja Sebenar" — guna real work images sahaja
9. **Testimonials** — WhatsApp review style + Google review feel (realistic, bukan fake)
10. **Contact Section** — WA + call + email + FB link
11. **Footer** — alamat, phone, email, FB, copyright
12. **Sticky Mobile CTA Bar** — WA + Call buttons fixed bottom
13. **Floating WA Button** — desktop

---

## 5. UPGRADE WORKFLOW (WAJIB IKUT)

```
Step 1: Audit existing HTML
       ↓ Kenal pasti kelemahan UI/UX/conversion
Step 2: Upgrade Navbar
       ↓ Stable? Proceed
Step 3: Upgrade Hero
       ↓ Stable? Proceed
Step 4: Add Trust Bar
       ↓ Stable? Proceed
Step 5: Upgrade Services
       ↓ Stable? Proceed
Step 6: Add/Upgrade Pricing
       ↓ Stable? Proceed
Step 7: Add Why Choose Us
       ↓ Stable? Proceed
Step 8: Upgrade Gallery
       ↓ Stable? Proceed
Step 9: Upgrade Testimonials
       ↓ Stable? Proceed
Step 10: Upgrade Contact + Footer
        ↓ Stable? Proceed
Step 11: Add Sticky Mobile CTA + Floating WA
        ↓
Step 12: Final responsive polish + testing
```

**Setiap step:**
- Explain improvement strategy
- Provide complete updated HTML untuk section tu
- Provide complete updated CSS
- Verify responsiveness
- Preserve existing functionality

---

## 6. CONVERSION REQUIREMENTS

Setiap section mesti guide user ke arah **hubungi via WhatsApp.**

**CTA Placements:**
- Hero (above fold) — primary WA button
- After pricing cards — "Tanya Harga via WhatsApp"
- After testimonials — "Join Pelanggan Berpuas Hati Kami"
- Contact section — prominent WA button
- Sticky bottom bar (mobile) — always visible
- Floating button (desktop) — always visible

**Trust Signals:**
- Nombor telefon real (bukan placeholder)
- Gambar technician sebenar (bukan stock)
- Review style yang realistic
- Tiada fake awards atau certifications

---

## 7. MOBILE REQUIREMENTS (HIGHEST PRIORITY)

- Clean mobile spacing
- Readable typography minimum 16px body
- Strong CTA visibility
- Proper image cropping — no overflow
- Smooth scrolling
- Touch-friendly buttons minimum 44px height
- No horizontal scroll
- Fast loading — minimize heavy effects pada mobile

---

## 8. QUALITY CHECKLIST (SEBELUM HANTAR)

Sebelum declare siap, verify semua ni:

- [ ] Semua WA links functional (format: wa.me/601XXXXXXXX)
- [ ] hero-team.jpg load dan visible dengan betul
- [ ] Semua 7 images load tanpa broken
- [ ] Mobile responsive — test 375px, 414px, 768px
- [ ] Desktop responsive — test 1280px, 1440px
- [ ] Sticky navbar berfungsi
- [ ] Smooth scroll berfungsi
- [ ] Floating WA button visible
- [ ] Sticky mobile CTA bar visible
- [ ] Tiada Lorem Ipsum text
- [ ] Tiada placeholder content
- [ ] Nombor telefon real digunakan
- [ ] Email dan FB link betul
- [ ] Tiada console errors
- [ ] Page load fast (no unnecessary libraries)
- [ ] Premium feel — bukan generic template

---

## 9. OUTPUT

- **File:** `index.html` (single file — HTML + CSS + JS semua dalam satu)
- **Location:** Dalam folder project `aircondfresh/`
- **Standard:** Production-ready, boleh terus deploy
- **Test:** Buka dalam browser tanpa server — semua functions berfungsi

---

## 10. NOTA PENTING

1. **JANGAN invent** fake reviews, awards, certifications, atau statistics
2. **JANGAN guna** stock photos atau AI-generated images
3. **JANGAN** rebuild dari scratch — upgrade existing HTML progressively
4. **PRESERVE** semua WA links yang dah ada dan functional
5. **PRIORITIZE** mobile experience above everything else
6. Premium = spacing + typography + hierarchy + realism. BUKAN effects berlebihan.

---

*Blueprint ini disediakan oleh Ith untuk execution oleh Cowork.*  
*Sebarang pertanyaan teknikal — refer balik kepada Aliff untuk keputusan.*
