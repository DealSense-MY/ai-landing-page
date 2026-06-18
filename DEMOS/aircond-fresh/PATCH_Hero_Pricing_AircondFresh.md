# PATCH: Hero Fix + Pricing Overhaul
# AircondFresh Services
# Prepared by: Ith (Claude) — May 2026
# For: Cowork (Execution)

---

## ⚠️ BACA DULU

Ini adalah 2 patch berbeza dalam satu file:
1. PATCH A — Hero image fix (desktop)
2. PATCH B — Pricing section overhaul

Buat PATCH A dulu → test → baru PATCH B.
Jangan buat kedua-dua serentak.

---

## PATCH A — HERO IMAGE FIX (DESKTOP)

### Masalah yang dikenal pasti dari screenshot:

1. Hero image terpotong sebelah kanan — "COVER AREA" info tak visible
2. Logo navbar tidak load — placeholder kecil sahaja
3. Branding dalam image terpotong sebelah kiri
4. Floating card overlap bahagian bawah image
5. Image container terlalu narrow — image rasa compressed

---

### A1 — Hero Grid Fix

```css
/* SEBELUM */
.hero-inner {
  grid-template-columns: 1fr 1fr;
}

/* SELEPAS — bagi image lebih ruang */
.hero-inner {
  grid-template-columns: 1fr 1.1fr;
  gap: 40px;
  align-items: center;
}
```

---

### A2 — Hero Image Container Fix

```css
/* SELEPAS */
.hero-right {
  position: relative;
  width: 100%;
}

.hero-right img {
  width: 100%;
  height: auto;           /* JANGAN fixed height — biar natural */
  max-height: 580px;
  object-fit: contain;    /* contain — jangan crop aggressively */
  object-position: center;
  border-radius: var(--radius-lg);
  display: block;
}

/* Mobile */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-right {
    display: block;         /* JANGAN hide pada mobile */
    order: -1;              /* image dulu, text bawah */
    margin-bottom: 24px;
  }
  .hero-right img {
    max-height: 320px;
    object-fit: cover;
    object-position: top center;
  }
}
```

---

### A3 — Floating Card — Reposition

Floating card "Dipercayai Pelanggan" jangan overlap image.

```css
/* SELEPAS */
.hero-float-card {
  position: absolute;
  bottom: -16px;          /* lebih rendah sikit dari image */
  left: -20px;            /* sebelah kiri image */
  z-index: 3;
  background: var(--white);
  border-radius: var(--radius);
  padding: 12px 16px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 220px;
}
```

Kalau floating card masih disrupt composition — **remove terus**.
Lebih baik tiada floating card dari image terpotong.

---

### A4 — Navbar Logo Fix

```css
/* SELEPAS */
.nav-logo {
  height: 52px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
  flex-shrink: 0;
}
```

Semak juga image path:
```html
<!-- Pastikan path betul -->
<img src="Image/logo.png" alt="AircondFresh Services" class="nav-logo" />
```

Bukan `logo.png.png` atau path yang salah.

---

### A5 — Hero HTML Check

Pastikan hero-right ada actual img tag:
```html
<div class="hero-right reveal-right">
  <img 
    src="Image/hero-team.jpg" 
    alt="Team AircondFresh Services — Pakar Aircond Perak"
    class="hero-img"
    loading="eager"
  />
  <!-- floating card optional — remove kalau disrupt composition -->
</div>
```

---

## PATCH B — PRICING SECTION OVERHAUL

### Kenapa perlu overhaul:

Pricing sekarang ada 3 card generic (Basic/Deep/Overhaul).
Pricing sebenar jauh lebih detailed — ada 3 kategori berbeza.

### Struktur Baru — 3 Tab Pricing:

```
Tab 1: Servis & Cucian
Tab 2: Pemasangan
Tab 3: Pakej Lengkap
```

---

### B1 — HTML Structure Baru

Replace keseluruhan `<section id="pricing">` dengan ini:

```html
<!-- =====================
     PRICING SECTION
===================== -->
<section id="pricing">
  <div class="section-inner">
    <div class="section-label reveal">Harga & Pakej</div>
    <h2 class="section-title reveal">Harga Telus, Tiada Hidden Charges</h2>
    <p class="section-sub reveal">Semua harga adalah tetap dan telus. Tiada bayaran tersembunyi.</p>

    <!-- Tab Navigation -->
    <div class="pricing-tabs reveal">
      <button class="ptab active" onclick="switchTab('servis')">Servis & Cucian</button>
      <button class="ptab" onclick="switchTab('pasang')">Pemasangan</button>
      <button class="ptab" onclick="switchTab('pakej')">Pakej Lengkap</button>
    </div>

    <!-- TAB 1: SERVIS & CUCIAN -->
    <div class="ptab-content active" id="tab-servis">
      <div class="pricing-note reveal">
        Wall-Mounted Unit · <strong>#Percuma</strong> Penyelarasan Gas 20PSI
      </div>
      <div class="pricing-table-wrap reveal">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Kapasiti (HP)</th>
              <th>Minor Servis</th>
              <th>Major Servis</th>
              <th>Overhaul Servis</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1.0 HP</td><td>RM 120</td><td>RM 190</td><td>RM 270</td></tr>
            <tr><td>1.5 HP</td><td>RM 150</td><td>RM 210</td><td>RM 290</td></tr>
            <tr><td>2.0 HP</td><td>RM 180</td><td>RM 240</td><td>RM 320</td></tr>
            <tr><td>2.5 HP</td><td>RM 200</td><td>RM 300</td><td>RM 380</td></tr>
            <tr><td>3.0 HP</td><td>RM 220</td><td>RM 350</td><td>RM 430</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Servis breakdown -->
      <div class="servis-breakdown reveal">
        <div class="servis-card">
          <div class="servis-card-title">Minor Servis</div>
          <ul>
            <li>Mencuci unit indoor dan outdoor dengan kanvas</li>
            <li>Mencuci penapis dan sarung unit indoor</li>
            <li>Membersihkan saluran air keluar</li>
            <li>Menyelaras semula tekanan gas</li>
          </ul>
          <div class="servis-note">*Menggunakan chemical dan waterpump</div>
        </div>
        <div class="servis-card">
          <div class="servis-card-title">Major Servis</div>
          <ul>
            <li>Menyimpan kesemua gas pada unit outdoor</li>
            <li>Membawa turun unit indoor dan outdoor</li>
            <li>Mencuci penapis dan sarung unit indoor</li>
            <li>Membersihkan saluran air keluar</li>
            <li>Melakukan vakum pada saluran gas</li>
            <li>Menyelaras semula tekanan gas</li>
          </ul>
          <div class="servis-note">*Menggunakan chemical dan waterjet</div>
        </div>
        <div class="servis-card featured">
          <div class="servis-card-badge">Paling Lengkap</div>
          <div class="servis-card-title">Overhaul Servis</div>
          <ul>
            <li>Menyimpan kesemua gas pada unit outdoor</li>
            <li>Membawa turun unit indoor dan outdoor</li>
            <li>Meleraikan komponen unit indoor dan outdoor</li>
            <li>Mencuci unit secara terperinci termasuk papan litar elektronik</li>
            <li>Melakukan pemeriksaan menyeluruh setiap komponen</li>
            <li>Mencuci penapis dan sarung unit indoor</li>
            <li>Membersihkan saluran air keluar</li>
            <li>Melakukan vakum pada saluran gas</li>
            <li>Menyelaras semula tekanan gas</li>
          </ul>
          <div class="servis-note">*Menggunakan chemical dan waterjet</div>
        </div>
      </div>
      <div class="pricing-cta reveal">
        <a href="https://wa.me/60108388482?text=Salam%20AircondFresh%2C%20saya%20nak%20tanya%20pasal%20servis%20aircond." class="btn-wa-price">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.054 23.782a.5.5 0 0 0 .609.631l6.053-1.59A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.67-.518-5.188-1.42l-.362-.214-3.742.981.998-3.645-.235-.374A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Tanya Harga Servis via WhatsApp
        </a>
      </div>
    </div>

    <!-- TAB 2: PEMASANGAN -->
    <div class="ptab-content" id="tab-pasang">
      <div class="pricing-note reveal">
        Wall-Mounted Unit · Harga Pemasangan Standard
      </div>
      <div class="pricing-table-wrap reveal">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Kapasiti (HP)</th>
              <th>Harga Pemasangan</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1.0 HP</td><td>RM 350</td></tr>
            <tr><td>1.5 HP</td><td>RM 370</td></tr>
            <tr><td>2.0 HP</td><td>RM 420</td></tr>
            <tr><td>2.5 HP</td><td>RM 430</td></tr>
            <tr><td>3.0 HP</td><td>RM 450</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Percuma -->
      <div class="free-box reveal">
        <div class="free-title">#Percuma Termasuk Dalam Harga:</div>
        <ul>
          <li>Paip Copper 10 Kaki</li>
          <li>Paip Buangan 10 Kaki</li>
          <li>Kabel Tricore 10 Kaki</li>
          <li>15A Plug Top (1pc)</li>
          <li>Outdoor Bracket c/w Bolt and Nut (1 Set)</li>
        </ul>
      </div>

      <!-- Harga Tambahan -->
      <div class="extra-charges reveal">
        <div class="extra-title">*Nota: Harga Tambahan Jika Diperlukan</div>
        <div class="extra-grid">
          <div class="extra-item">
            <span class="extra-label">Pendawaian Baru dari DB (Suis 20A)</span>
            <span class="extra-price">RM 150.00 / set</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Kabel Tricore 1.5mm</span>
            <span class="extra-price">RM 3.00 / kaki</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Kabel Tricore 2.5mm</span>
            <span class="extra-price">RM 5.00 / kaki</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Paip Copper (1.0–1.5HP)</span>
            <span class="extra-price">RM 25.00 / kaki</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Paip Copper (1.5–3.0HP)</span>
            <span class="extra-price">RM 35.00 / kaki</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Gas Per 10PSI (1.0–1.5HP)</span>
            <span class="extra-price">RM 22.00</span>
          </div>
          <div class="extra-item">
            <span class="extra-label">Gas Per 10PSI (1.5–3.0HP)</span>
            <span class="extra-price">RM 28.00</span>
          </div>
        </div>
      </div>
      <div class="pricing-cta reveal">
        <a href="https://wa.me/60108388482?text=Salam%20AircondFresh%2C%20saya%20nak%20tanya%20pasal%20pemasangan%20aircond." class="btn-wa-price">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.054 23.782a.5.5 0 0 0 .609.631l6.053-1.59A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.67-.518-5.188-1.42l-.362-.214-3.742.981.998-3.645-.235-.374A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Tanya Harga Pemasangan via WhatsApp
        </a>
      </div>
    </div>

    <!-- TAB 3: PAKEJ LENGKAP -->
    <div class="ptab-content" id="tab-pakej">
      <div class="pricing-note reveal">
        Wall-Mounted Unit · Hanya untuk kediaman tidak melebihi 2 tingkat
      </div>

      <div class="pakej-grid reveal">
        <div class="pakej-card">
          <div class="pakej-name">Pakej A</div>
          <div class="pakej-desc">Buka Unit Sahaja</div>
          <table class="pakej-table">
            <tr><th>HP</th><th>Harga</th></tr>
            <tr><td>1.0</td><td>RM 350</td></tr>
            <tr><td>1.5</td><td>RM 370</td></tr>
            <tr><td>2.0</td><td>RM 420</td></tr>
            <tr><td>2.5</td><td>RM 430</td></tr>
            <tr><td>3.0</td><td>RM 450</td></tr>
          </table>
        </div>
        <div class="pakej-card">
          <div class="pakej-name">Pakej B</div>
          <div class="pakej-desc">Pasang Unit Sahaja</div>
          <table class="pakej-table">
            <tr><th>HP</th><th>Harga</th></tr>
            <tr><td>1.0</td><td>RM 110</td></tr>
            <tr><td>1.5</td><td>RM 120</td></tr>
            <tr><td>2.0</td><td>RM 140</td></tr>
            <tr><td>2.5</td><td>RM 150</td></tr>
            <tr><td>3.0</td><td>RM 170</td></tr>
          </table>
        </div>
        <div class="pakej-card">
          <div class="pakej-name">Pakej C</div>
          <div class="pakej-desc">Buka Dan Pasang</div>
          <table class="pakej-table">
            <tr><th>HP</th><th>Harga</th></tr>
            <tr><td>1.0</td><td>RM 420</td></tr>
            <tr><td>1.5</td><td>RM 450</td></tr>
            <tr><td>2.0</td><td>RM 510</td></tr>
            <tr><td>2.5</td><td>RM 530</td></tr>
            <tr><td>3.0</td><td>RM 560</td></tr>
          </table>
        </div>
        <div class="pakej-card featured">
          <div class="pakej-badge">Popular</div>
          <div class="pakej-name">Pakej D</div>
          <div class="pakej-desc">Servis Dan Pasang</div>
          <table class="pakej-table">
            <tr><th>HP</th><th>Harga</th></tr>
            <tr><td>1.0</td><td>RM 420</td></tr>
            <tr><td>1.5</td><td>RM 460</td></tr>
            <tr><td>2.0</td><td>RM 520</td></tr>
            <tr><td>2.5</td><td>RM 540</td></tr>
            <tr><td>3.0</td><td>RM 560</td></tr>
          </table>
          <div class="pakej-free">
            <strong>#Percuma:</strong> Cucian Chemical Major Servis + Kos Pemindahan ≤15km + 10 Kaki Paip & Kabel
          </div>
        </div>
        <div class="pakej-card featured">
          <div class="pakej-badge">Paling Lengkap</div>
          <div class="pakej-name">Pakej E</div>
          <div class="pakej-desc">Buka, Servis Dan Pasang</div>
          <table class="pakej-table">
            <tr><th>HP</th><th>Harga</th></tr>
            <tr><td>1.0</td><td>RM 450</td></tr>
            <tr><td>1.5</td><td>RM 480</td></tr>
            <tr><td>2.0</td><td>RM 540</td></tr>
            <tr><td>2.5</td><td>RM 560</td></tr>
            <tr><td>3.0</td><td>RM 590</td></tr>
          </table>
          <div class="pakej-free">
            <strong>#Percuma:</strong> Cucian Chemical Major Servis + Kos Pemindahan ≤15km + 10 Kaki Paip & Kabel
          </div>
        </div>
      </div>

      <div class="pakej-nota reveal">
        <p>*Setiap pakej adalah mengikut terma dan syarat</p>
        <p>*Harga tambahan bagi pemasangan yang memerlukan tambahan bahan asas</p>
      </div>
      <div class="pricing-cta reveal">
        <a href="https://wa.me/60108388482?text=Salam%20AircondFresh%2C%20saya%20nak%20tanya%20pasal%20pakej%20pemasangan%20aircond." class="btn-wa-price">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.864L.054 23.782a.5.5 0 0 0 .609.631l6.053-1.59A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.67-.518-5.188-1.42l-.362-.214-3.742.981.998-3.645-.235-.374A9.96 9.96 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
          Tanya Pakej via WhatsApp
        </a>
      </div>
    </div>
  </div>
</section>
```

---

### B2 — CSS Baru untuk Pricing

Tambah CSS ini dalam `<style>` tag:

```css
/* ===========================
   PRICING TABS
=========================== */
.pricing-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 32px 0 24px;
  flex-wrap: wrap;
}
.ptab {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  border: 2px solid rgba(109,190,69,.3);
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}
.ptab:hover { border-color: var(--lime-green); color: var(--lime-green); }
.ptab.active {
  background: var(--lime-green);
  border-color: var(--lime-green);
  color: var(--white);
}
.ptab-content { display: none; }
.ptab-content.active { display: block; }

/* ===========================
   PRICING TABLE
=========================== */
.pricing-note {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.pricing-note strong { color: var(--lime-green); }

.pricing-table-wrap {
  overflow-x: auto;
  margin-bottom: 32px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}
.pricing-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.pricing-table th {
  background: var(--dark-green);
  color: var(--white);
  padding: 14px 20px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .3px;
}
.pricing-table td {
  padding: 13px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,.06);
  color: var(--text-dark);
  font-weight: 500;
}
.pricing-table tbody tr:nth-child(even) { background: var(--off-white); }
.pricing-table tbody tr:hover { background: rgba(109,190,69,.08); }
.pricing-table td:first-child { font-weight: 700; color: var(--dark-green); }

/* ===========================
   SERVIS BREAKDOWN CARDS
=========================== */
.servis-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
.servis-card {
  background: var(--off-white);
  border-radius: var(--radius);
  padding: 20px;
  border: 1px solid rgba(0,0,0,.06);
  position: relative;
}
.servis-card.featured {
  border-color: var(--lime-green);
  background: rgba(109,190,69,.04);
}
.servis-card-badge {
  display: inline-block;
  background: var(--lime-green);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  margin-bottom: 8px;
  letter-spacing: .3px;
}
.servis-card-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--dark-green);
  margin-bottom: 12px;
}
.servis-card ul {
  list-style: none;
  padding: 0;
  margin-bottom: 12px;
}
.servis-card ul li {
  font-size: 13px;
  color: var(--text-muted);
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
  line-height: 1.5;
}
.servis-card ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--lime-green);
  font-weight: 700;
  font-size: 12px;
}
.servis-note {
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
  border-top: 1px solid rgba(0,0,0,.08);
  padding-top: 8px;
  margin-top: 8px;
}

/* ===========================
   PEMASANGAN — FREE BOX
=========================== */
.free-box {
  background: rgba(109,190,69,.08);
  border: 1px solid rgba(109,190,69,.25);
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-bottom: 24px;
}
.free-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--lime-green);
  margin-bottom: 12px;
}
.free-box ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.free-box ul li {
  font-size: 13px;
  color: var(--text-dark);
  padding-left: 16px;
  position: relative;
}
.free-box ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--lime-green);
  font-weight: 700;
}

/* ===========================
   EXTRA CHARGES
=========================== */
.extra-charges {
  background: var(--off-white);
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-bottom: 28px;
}
.extra-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
}
.extra-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.extra-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--white);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0,0,0,.06);
  gap: 8px;
}
.extra-label { font-size: 13px; color: var(--text-muted); }
.extra-price { font-size: 13px; font-weight: 700; color: var(--dark-green); white-space: nowrap; }

/* ===========================
   PAKEJ GRID
=========================== */
.pakej-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.pakej-card {
  background: var(--off-white);
  border-radius: var(--radius);
  padding: 20px;
  border: 1px solid rgba(0,0,0,.06);
  position: relative;
}
.pakej-card.featured {
  border-color: var(--lime-green);
  background: rgba(109,190,69,.04);
}
.pakej-badge {
  display: inline-block;
  background: var(--lime-green);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  margin-bottom: 8px;
}
.pakej-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--dark-green);
  margin-bottom: 4px;
}
.pakej-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.pakej-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 12px;
}
.pakej-table th {
  background: var(--dark-green);
  color: var(--white);
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
}
.pakej-table td {
  padding: 7px 12px;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.pakej-table tbody tr:nth-child(even) { background: rgba(0,0,0,.03); }
.pakej-free {
  font-size: 12px;
  color: var(--lime-green);
  background: rgba(109,190,69,.08);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 10px;
  line-height: 1.5;
}
.pakej-nota {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  margin-bottom: 24px;
}
.pakej-nota p { margin-bottom: 4px; }

/* ===========================
   PRICING CTA
=========================== */
.btn-wa-price {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--wa-green);
  color: var(--white);
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 15px;
  transition: background var(--transition), transform var(--transition);
  box-shadow: 0 4px 20px rgba(37,211,102,.3);
}
.btn-wa-price:hover {
  background: var(--wa-hover);
  transform: translateY(-2px);
}
.pricing-cta {
  text-align: center;
  padding: 8px 0 16px;
}

/* ===========================
   RESPONSIVE PRICING
=========================== */
@media (max-width: 900px) {
  .servis-breakdown { grid-template-columns: 1fr; }
  .pakej-grid { grid-template-columns: repeat(2, 1fr); }
  .extra-grid { grid-template-columns: 1fr; }
  .free-box ul { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .pakej-grid { grid-template-columns: 1fr; }
  .pricing-tabs { gap: 6px; }
  .ptab { padding: 8px 16px; font-size: 13px; }
}
```

---

### B3 — JavaScript Tab Switch

Tambah dalam `<script>` tag:

```javascript
// ── Pricing tab switch
function switchTab(tab) {
  document.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  event.target.classList.add('active');
}
```

---

## ✅ CHECKLIST SEBELUM DECLARE SIAP

### Patch A — Hero:
- [ ] hero-team.jpg visible — desktop DAN mobile
- [ ] Image tidak terpotong terlalu aggressively
- [ ] Logo navbar load dengan betul — height 52px, width auto
- [ ] Floating card tidak overlap image
- [ ] Mobile — image stack atas, text bawah

### Patch B — Pricing:
- [ ] 3 tab berfungsi — Servis, Pemasangan, Pakej
- [ ] Semua harga tepat ikut pricing sheet
- [ ] Table responsive pada mobile
- [ ] Pakej D dan E ada "Popular" / "Paling Lengkap" badge
- [ ] Percuma items listed dengan betul
- [ ] Extra charges section ada
- [ ] WA button berfungsi pada setiap tab
- [ ] Tiada harga yang salah atau direka-reka

---

*Patch ini disediakan oleh Ith berdasarkan pricing sheet sebenar AircondFresh Services*
*Semua harga adalah dari dokumen rasmi syarikat*
*Version: 1.0 — May 2026*
