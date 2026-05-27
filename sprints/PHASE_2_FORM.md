# PHASE_2_FORM.md
# Nexus Landing Engine — Phase 2: New Form Fields
# Run: claude "Read MEMORY.md then execute PHASE_2_FORM.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 2 is DONE, stop immediately and tell user.
Confirm PHASE 1 is DONE before proceeding.
Read public/index.html before making any changes.

---

## TASK — ADD NEW FIELDS TO FORM

Style all new fields exactly like existing fields.
Add data-i18n attributes on all labels.
Add EN and BM translations in the UI object for all new labels.

### BUSINESS INFO SECTION (insert after Business Name field)

1. TAGLINE / SLOGAN
   - label: "TAGLINE / SLOGAN" | i18n key: label_tagline | BM: "TAGLINE / SLOGAN"
   - input type: text
   - placeholder EN: "e.g. Your Smile, Our Priority"
   - placeholder BM: "cth. Senyuman Anda, Keutamaan Kami"

2. EMAIL
   - label: "EMAIL" | i18n key: label_email | BM: "E-MEL"
   - input type: email
   - placeholder: "hello@example.com"

3. PHONE (LANDLINE)
   - label: "PHONE (LANDLINE)" | i18n key: label_phone | BM: "TELEFON (TALIAN TETAP)"
   - input type: text
   - placeholder: "e.g. 05-1234567"
   - hint EN: "Optional — for businesses with two numbers"
   - hint BM: "Pilihan — untuk bisnes dengan dua nombor"

4. OPERATING HOURS
   - label: "OPERATING HOURS" | i18n key: label_hours | BM: "JAM OPERASI"
   - input type: text
   - placeholder EN: "e.g. Mon-Sat 9am-6pm, Closed Sunday"
   - placeholder BM: "cth. Isnin-Sabtu 9pg-6ptg, Ahad Tutup"

5. DOCTOR / OWNER NAME
   - label: "DOCTOR / OWNER NAME" | i18n key: label_owner | BM: "NAMA DOKTOR / PEMILIK"
   - input type: text
   - placeholder EN: "e.g. Dr. Ahmad bin Ali"
   - hint EN: "Optional — adds trust signal in generated copy"
   - hint BM: "Pilihan — tambah kepercayaan dalam copy"

6. YEARS IN OPERATION
   - label: "YEARS IN OPERATION" | i18n key: label_years | BM: "TAHUN BEROPERASI"
   - input type: text
   - placeholder: "e.g. 10"
   - hint EN: "Used in copy as '10+ years experience'"
   - hint BM: "Digunakan sebagai '10+ tahun pengalaman'"

7. GOOGLE RATING
   - label: "GOOGLE RATING" | i18n key: label_rating | BM: "RATING GOOGLE"
   - input type: text
   - placeholder: "e.g. 4.9"
   - hint EN: "Star rating shown as social proof badge in hero"
   - hint BM: "Rating bintang untuk badge kepercayaan"

8. TOTAL REVIEWS
   - label: "TOTAL REVIEWS" | i18n key: label_reviews_count | BM: "JUMLAH ULASAN"
   - input type: text
   - placeholder: "e.g. 363"
   - hint EN: "Shown alongside Google rating"

### CONTENT SECTION (insert after Benefits field)

9. SERVICES (with optional price)
   - label: "SERVICES" | i18n key: label_services | BM: "PERKHIDMATAN"
   - textarea, 5 rows
   - placeholder EN:
     "One per line. Format: Service Name | Price (optional)
e.g.
Scaling & Polishing | RM80
Tooth Extraction | RM50-150
Consultation | Free"
   - placeholder BM: "Satu setiap baris. Format: Nama Servis | Harga (pilihan)"

10. CUSTOMER REVIEWS (3 entries)
    - section label: "CUSTOMER REVIEWS" | i18n key: label_cust_reviews | BM: "ULASAN PELANGGAN"
    - hint: "Optional — paste real Google reviews or leave blank"
    - 3 review entries, each has:
      a. Name input — placeholder: "Customer name"
      b. Rating select — options: ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐ / ⭐⭐⭐
      c. Quote textarea (2 rows) — placeholder: "What they said..."
      d. Date input — placeholder: "e.g. 3 months ago"

### CONTACT & MEDIA SECTION (insert after existing Image URL)

11. LOGO URL
    - label: "LOGO URL" | i18n key: label_logo | BM: "URL LOGO"
    - input type: text
    - placeholder: "https://example.com/logo.png"
    - hint: "Optional — your business logo"

12. GALLERY IMAGES (3 fields)
    - section label: "GALLERY IMAGES" | i18n key: label_gallery | BM: "GAMBAR GALERI"
    - 3 separate inputs labeled Gallery 1, Gallery 2, Gallery 3
    - placeholder: "https://i.imgur.com/example.jpg"

13. BEFORE / AFTER IMAGES (2 pairs)
    - section label: "BEFORE / AFTER" | i18n key: label_before_after | BM: "SEBELUM / SELEPAS"
    - 2 pairs, each pair has:
      a. Before URL input — placeholder: "Before image URL"
      b. After URL input — placeholder: "After image URL"

---

## DONE — UPDATE MEMORY.md

After all fields added:
1. Update MEMORY.md: PHASE 2 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 2 — new form fields"
3. Report: all fields added, any skipped and why
4. Stop and wait for instructions.
