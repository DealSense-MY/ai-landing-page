# SPRINT_ZIRA_PREVIEW.md
# DealSense — Build: Zira Beauty Spa Preview HTML
# Run: claude "Execute sprints/SPRINT_ZIRA_PREVIEW.md"

## INSTRUCTION
Execute phase by phase.
After each phase: report, then STOP.
Wait for "continue" before next phase.

## CONSTRAINTS
- DO NOT touch Railway, Cloudflare, atau production files
- DO NOT contact client
- DO NOT publish publicly
- DO NOT delete old folders
- DO NOT rebuild engine — buat static HTML sahaja
- DO NOT require API key atau npm install
- Build dalam: DEMOS\zira-beauty-spa-ipoh\

---

## CONTEXT
Client: Zira Beauty Spa, Ipoh
Niche: Beauty Spa / Facial
Offer: WhatsApp Booking Page (RM350 setup)
Weakness: Promo ada dalam posts, tapi tiada page booking yang jelas

Base demo: DEMOS\aurelia-glow-skincare\
Output folder: DEMOS\zira-beauty-spa-ipoh\
Output file: zira-beauty-spa-ipoh-preview.html

ResponseOps BM copywriting principles (proven):
- Emosional, direct, problem-first
- Soft-sell — tanya dulu, jangan pitch hard
- Customer journey: nampak info → faham → tap WhatsApp → tanya

---

## PHASE 1 — READ BASE DEMO

Read this file first:
DEMOS\aurelia-glow-skincare\[find the .html file inside]

Report:
- Exact filename
- Color scheme used (primary, secondary)
- Sections present
- WhatsApp link format
- Any hardcoded business names to replace
- Line count

DO NOT modify anything.
STOP — tunggu "continue".

---

## PHASE 2 — BUILD ZIRA PREVIEW

Create folder: DEMOS\zira-beauty-spa-ipoh\

Copy base demo HTML, rename ke: zira-beauty-spa-ipoh-preview.html

Apply ALL changes below:

### META
```html
<title>Zira Beauty Spa Ipoh | Page Booking WhatsApp</title>
<meta name="description" content="Zira Beauty Spa Ipoh — tanya pakej dan booking slot melalui WhatsApp.">
```

### WATERMARK — tambah terus selepas <body> tag
```html
<div style="
  position:fixed;top:0;left:0;right:0;z-index:9999;
  background:rgba(122,16,24,0.92);color:#fff;
  text-align:center;padding:8px 16px;
  font-size:12px;font-weight:700;letter-spacing:2px;
  pointer-events:none;">
  ⚠ PREVIEW SAHAJA — Belum Live | Dibina oleh DealSense-MY
</div>
<div style="height:36px;"></div>
```

### HERO
- Headline: Zira Beauty Spa Ipoh
- Sub: Servis facial & beauty treatment dengan booking mudah melalui WhatsApp.
- CTA 1: WhatsApp untuk Booking
- CTA 2: Tanya Pakej Terkini
- Semua link: https://wa.me/60XXXXXXXXX?text=Hi%20Zira%20Beauty%20Spa%2C%20saya%20nak%20tanya%20pakej%20dan%20slot%20booking

### PROBLEM / BENEFIT (selepas hero)
Tak perlu scroll banyak post untuk cari info.
Semua servis, pakej dan cara booking ada dalam satu page ringkas.

### SERVICES (4 cards)
1. Facial Treatment — Tanya via WhatsApp
2. Beauty Spa Service — Tanya via WhatsApp
3. Promo & Pakej Terkini — Tanya via WhatsApp
4. Consultation via WhatsApp — Percuma

Format: nama bold, harga muted kecil di bawah.

### WHY CHOOSE (4 points)
- Sesuai untuk customer sekitar Ipoh
- Mudah tanya slot melalui WhatsApp
- Servis disusun supaya senang faham
- Customer boleh lihat info utama sebelum booking

### TRUST / ABOUT
Preview page ini disediakan untuk tunjuk bagaimana info Zira Beauty Spa
boleh disusun dalam satu booking page yang lebih kemas dan mudah digunakan.

### FAQ (3 items)
Q: Boleh tanya pakej terkini?
A: Boleh, tekan button WhatsApp untuk tanya pakej terkini.

Q: Boleh booking melalui WhatsApp?
A: Ya, customer boleh terus tekan WhatsApp untuk tanya slot atau booking.

Q: Page ini untuk apa?
A: Untuk bantu customer nampak servis, lokasi dan cara booking dalam satu page ringkas.

### FINAL CTA
Nak tanya pakej atau booking slot?
Tekan WhatsApp untuk terus bertanya.
Button: Tanya Pakej Sekarang → sama WA link

### FOOTER
Zira Beauty Spa Ipoh
© 2025 Zira Beauty Spa. Page ini adalah preview yang disediakan oleh DealSense-MY.

### WAJIB REMOVE / HIDE
- Semua fake reviews / testimonials
- Semua fake specific pricing (RM XXX)
- Semua fake awards / certificates
- Nama business lama dari base demo
- Social media links yang ada nama lama

### COLOR — kekal color dari base demo, jangan tukar design

---

Commit: "feat: Zira Beauty Spa preview page — RM350 client"
Push ke GitHub.

Report:
- Output file path (full path)
- Sections yang ditukar
- Business names yang diganti
- Boleh buka direct dalam browser? (yes/no)
- Screenshot instruction: "Buka dalam Chrome > F12 > Toggle Device Toolbar > iPhone 12 Pro > screenshot"
- Unknowns (nombor WA, pakej actual, etc.)

STOP — tunggu "continue".

---

## PHASE 3 — UPDATE LEADS.JSON

Update file: tools\semi-auto-outreach\data\leads.json

Cari lead id: "zira-beauty-spa-ipoh"
Update field sahaja:
- previewPath: full path ke zira-beauty-spa-ipoh-preview.html
- status: "PREVIEW_READY"

Jangan ubah field lain.

Report: confirm update done.
STOP — done.
