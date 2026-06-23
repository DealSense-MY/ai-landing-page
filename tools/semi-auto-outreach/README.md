# DealSense Approval Sender Lite

Local dashboard untuk Aliff approve dan hantar outreach DM ke prospects.
**Ini bukan automation. Semua hantar kena human approval dulu.**

> **⚠ SECURITY WARNING**
> ApexProspect contains prospect/contact/draft data.
> Do NOT expose publicly without setting `APEX_OPERATOR_PASSWORD` in `.env`.
> By default the server binds to `127.0.0.1` (localhost only) — safe for local use.
> See `sprints/APEXPROSPECT_PHASE_8_LOCAL_PRIVATE_ACCESS_GUIDE.md` for remote access options.

---

## Install

```bash
cd tools/semi-auto-outreach
npm install
```

## Run

```bash
npm start
```

Buka browser: **http://localhost:3777**

---

## Flow

1. Dashboard tunjuk lead cards
2. Baca DM draft yang dah ada
3. Pilih:
   - **YES** → Approve dan buka WhatsApp/copy untuk FB
   - **EDIT** → Edit message dulu, pastu **OK** untuk approve
   - **NO** → Reject, DM tak dihantar
4. Bila dapat reply → tekan **Mark Replied**, paste reply
5. Nak follow up → tekan **Follow-Up Draft**, edit, OK

---

## Apa tool ni TIDAK buat

- ❌ Tidak hantar message secara automatik
- ❌ Tidak guna WhatsApp unofficial API
- ❌ Tidak spam
- ❌ Tidak sentuh Railway / Cloudflare
- ❌ Tidak require internet (kecuali buka wa.me)

---

## Tambah Lead Baru

Edit `data/leads.json`, tambah object baru:

```json
{
  "id": "nama-business-lowercase-dash",
  "businessName": "Nama Business",
  "location": "Ipoh",
  "niche": "Niche",
  "platform": "Instagram",
  "contactMethod": "WhatsApp",
  "whatsappNumber": "601XXXXXXXXX",
  "profileUrl": "https://instagram.com/handle",
  "weakness": "Describe kelemahan",
  "offerAngle": "Offer angle",
  "previewPath": "path\\to\\preview.html",
  "screenshotPath": "",
  "status": "PREVIEW_READY",
  "defaultDm": "Hi [Business], saya Aliff..."
}
```

Restart server selepas edit.

---

## Data Files

- `data/leads.json` — semua leads
- `data/outreach-log.json` — log setiap action (auto-updated)
