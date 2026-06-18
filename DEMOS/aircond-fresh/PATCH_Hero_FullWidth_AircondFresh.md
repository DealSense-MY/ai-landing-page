# PATCH: CINEMATIC FULL-WIDTH HERO
# AircondFresh Services
# Prepared by: Ith (Claude) — May 2026
# For: Cowork (Execution)

---

## ⚠️ BACA DULU

Ini adalah HERO REDESIGN patch — bukan refinement biasa.
Patch ini OVERRIDE prompt refinement sebelum ni untuk HERO SECTION SAHAJA.

Semua section lain — JANGAN SENTUH.
Hanya ganti `<section id="hero">` dan CSS hero sahaja.

---

## KONSEP

```
SEBELUM (split layout):
┌─────────────────────────────────────┐
│ [Text kiri]    │  [Image kotak]     │
└─────────────────────────────────────┘

SELEPAS (cinematic full-width):
┌─────────────────────────────────────┐
│      hero-team.jpg (full width)     │
│   ░░░░ dark gradient overlay ░░░░   │
│                                     │
│  [Badge]                            │
│  [Headline besar]                   │
│  [Subheadline]                      │
│  [WA Button] [Lihat Servis]         │
│  [Trust items]                      │
└─────────────────────────────────────┘
```

Image jadi BACKGROUND penuh — kiri ke kanan.
Text overlay di atas dengan gradient untuk readability.
Nampak cinematic, premium, real contractor.

---

## STEP 1 — REPLACE CSS HERO

Cari dan REPLACE keseluruhan CSS block hero (dari `/* HERO — SPLIT LAYOUT */` sampai `/* TRUST BAR */`) dengan CSS baru ini:

```css
/* ===========================
   HERO — CINEMATIC FULL WIDTH
=========================== */
#hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 0;
}

/* Background Image */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Gradient Overlay — kiri gelap, kanan lebih visible */
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(7,21,16,0.92) 0%,
    rgba(7,21,16,0.80) 40%,
    rgba(7,21,16,0.45) 70%,
    rgba(7,21,16,0.15) 100%
  );
  z-index: 1;
}

/* Content Layer */
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1180px;
  margin: 0 auto;
  padding: 140px 24px 100px;
  width: 100%;
}

/* Content max width — jangan terlalu lebar */
.hero-left {
  max-width: 620px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(109,190,69,.18);
  border: 1px solid rgba(109,190,69,.40);
  color: var(--lime-green);
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 28px;
  letter-spacing: .4px;
  backdrop-filter: blur(8px);
}
.hero-badge .dot {
  width: 8px; height: 8px;
  background: var(--lime-green);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(.85); }
}

.hero-title {
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  color: var(--white);
  line-height: 1.12;
  margin-bottom: 20px;
  letter-spacing: -.5px;
}
.hero-title .accent { color: var(--lime-green); }

.hero-subtitle {
  font-size: clamp(15px, 1.6vw, 18px);
  color: rgba(255,255,255,.75);
  margin-bottom: 36px;
  line-height: 1.7;
  max-width: 500px;
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 40px;
}

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
  box-shadow: 0 8px 28px rgba(37,211,102,.4);
  transition: all var(--transition);
}
.btn-primary:hover {
  background: var(--wa-hover);
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(37,211,102,.5);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255,255,255,.1);
  color: var(--white);
  padding: 15px 28px;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid rgba(255,255,255,.3);
  backdrop-filter: blur(8px);
  transition: all var(--transition);
}
.btn-secondary:hover {
  background: rgba(255,255,255,.18);
  border-color: rgba(255,255,255,.6);
}

.hero-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.hero-trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255,255,255,.75);
  font-weight: 500;
}
.hero-trust-item .check {
  width: 20px; height: 20px;
  background: rgba(109,190,69,.25);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--lime-green);
  font-size: 11px; font-weight: 700;
  flex-shrink: 0;
}

/* ===========================
   HERO RESPONSIVE
=========================== */
@media (max-width: 900px) {
  .hero-inner {
    padding: 120px 24px 80px;
  }
  .hero-left {
    max-width: 100%;
  }
  /* Darken overlay lebih pada tablet — image background masih visible */
  .hero-bg::after {
    background: linear-gradient(
      180deg,
      rgba(7,21,16,0.88) 0%,
      rgba(7,21,16,0.75) 60%,
      rgba(7,21,16,0.65) 100%
    );
  }
}

@media (max-width: 600px) {
  .hero-inner {
    padding: 110px 20px 70px;
  }
  .hero-title {
    font-size: clamp(30px, 8vw, 42px);
  }
  /* Mobile — overlay lebih gelap supaya text readable */
  .hero-bg::after {
    background: rgba(7,21,16,0.85);
  }
  .hero-ctas {
    flex-direction: column;
  }
  .btn-primary, .btn-secondary {
    justify-content: center;
    width: 100%;
  }
}
```

---

## STEP 2 — REPLACE HTML HERO SECTION

Cari `<section id="hero">` sampai `</section>` (hero section) dan REPLACE dengan:

```html
<!-- =====================
     HERO — CINEMATIC FULL WIDTH
===================== -->
<section id="hero">
  <!-- Background Image Layer -->
  <div class="hero-bg">
    <img
      src="Image/hero-team.jpg"
      alt="Team AircondFresh Services — Pakar Aircond Perak"
      loading="eager"
    />
  </div>

  <!-- Content Layer -->
  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-badge reveal">
        <div class="dot"></div>
        KT0545349-H · Bertauliah & Berpengalaman
      </div>
      <h1 class="hero-title reveal">
        Aircond Tak Sejuk?<br>
        Kami Datang Servis<br>
        <span class="accent">Terus Ke Rumah Anda.</span>
      </h1>
      <p class="hero-subtitle reveal">
        Servis Aircond Professional — Bersih, Kemas & Fast Response Sekitar Perak.
        Harga telus, tiada hidden charges, dijamin puas hati.
      </p>
      <div class="hero-ctas reveal">
        <a href="https://wa.me/60108388482?text=Salam%2C%20saya%20nak%20tempah%20servis%20aircond.%20Boleh%20bagi%20quote%3F" class="btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.054 23.782a.5.5 0 0 0 .609.631l6.053-1.59A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.67-.518-5.188-1.42l-.362-.214-3.742.981.998-3.645-.235-.374A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Tempah Sekarang — Free Quote
        </a>
        <a href="#services" class="btn-secondary">
          Lihat Servis Kami ↓
        </a>
      </div>
      <div class="hero-trust-row reveal">
        <div class="hero-trust-item">
          <div class="check">✓</div>Fast Response
        </div>
        <div class="hero-trust-item">
          <div class="check">✓</div>Harga Telus
        </div>
        <div class="hero-trust-item">
          <div class="check">✓</div>Dijamin Puas Hati
        </div>
        <div class="hero-trust-item">
          <div class="check">✓</div>Lesen Rasmi
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## STEP 3 — BUANG CSS LAMA HERO

Cari dan BUANG CSS lama ini yang dah tak relevan:
- `.hero-right` — dah tak ada
- `.hero-img` — dah tak ada
- `.hero-right img` — dah tak ada

Jangan buang CSS lain.

---

## ✅ CHECKLIST SEBELUM DECLARE SIAP

- [ ] hero-team.jpg visible sebagai full-width background
- [ ] Gradient overlay — text readable tapi image masih nampak
- [ ] Technician dalam image visible — bukan hilang dalam gelap
- [ ] Branding "AIRCOND FRESH SERVICES" dalam image visible
- [ ] Headline, subtitle, CTA semua readable
- [ ] WA button berfungsi
- [ ] Mobile — overlay gelap sikit, text readable, CTA stack vertical
- [ ] Tablet — balanced, image masih nampak
- [ ] Desktop — cinematic, premium, WOW
- [ ] Trust bar section bawah hero — tidak terjejas
- [ ] Semua section lain — tidak berubah

---

## ⚠️ NOTA PENTING

Overlay gradient adalah kunci.
Kalau image terlalu gelap — kurangkan opacity dalam `rgba(7,21,16,X)`.
Kalau text tak readable — naikkan opacity.

Target: Image 40-50% visible pada desktop, text 100% readable.

---

*Patch ini menggantikan hero split layout dengan cinematic full-width hero*
*Section lain tidak terjejas*
*Version: 1.0 — May 2026*
