# PHASE_1_NICHE.md
# Nexus Landing Engine — Phase 1: Niche List + Output Language Dropdown
# Run: claude "Read MEMORY.md then execute PHASE_1_NICHE.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 1 is DONE, stop immediately and tell user.
Read public/index.html before making any changes.

---

## TASK 1 — NICHE LIST UPGRADE

In public/index.html, find the niche <select> element.
Replace ALL existing <option> elements with these 10 only:

```html
<option value="dental_clinic">Klinik Pergigian</option>
<option value="clinic_gp">Klinik Am / GP</option>
<option value="clinic_aesthetic">Klinik Kecantikan / Aesthetic</option>
<option value="aircond_service">Aircond Service</option>
<option value="bengkel_kereta">Bengkel Kereta</option>
<option value="katering_event">Katering & Event</option>
<option value="restoran_cafe">Restoran & Café</option>
<option value="saloon_barbershop">Saloon & Barbershop</option>
<option value="pusat_tuisyen">Pusat Tuisyen</option>
<option value="general">Umum / General</option>
```

Update the UI i18n translation object — add BM labels:
```
dental_clinic: "Klinik Pergigian"
clinic_gp: "Klinik Am / GP"
clinic_aesthetic: "Klinik Kecantikan / Aesthetic"
aircond_service: "Servis Aircond"
bengkel_kereta: "Bengkel Kereta"
katering_event: "Katering & Event"
restoran_cafe: "Restoran & Kafe"
saloon_barbershop: "Saloon & Barbershop"
pusat_tuisyen: "Pusat Tuisyen"
general: "Umum / General"
```

---

## TASK 2 — OUTPUT LANGUAGE SELECTOR → DROPDOWN

In public/index.html, find the Output Language section.
Remove the existing button grid entirely.
Replace with a <select> dropdown styled exactly like Niche and Tone selectors.

```html
<select id="output-lang-select">
  <option value="en">🇬🇧 English</option>
  <option value="bm">🇲🇾 Bahasa Malaysia</option>
  <option value="zh">🇨🇳 中文</option>
  <option value="en+bm">EN + BM (Bilingual)</option>
  <option value="en+zh">EN + ZH (Bilingual)</option>
  <option value="zh+bm">ZH + BM (Bilingual)</option>
  <option value="en+bm+zh">🌐 EN + BM + ZH (Trilingual)</option>
</select>
```

- Default value: "en"
- On change: update selectedOutputLang variable
- Add i18n key: section_lang / BM: "Bahasa Output"
- Remove any JS that referenced the old button grid
- Ensure selectedOutputLang is still included in POST payload

---

## DONE — UPDATE MEMORY.md

After both tasks complete:
1. Update MEMORY.md: PHASE 1 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 1 — niche upgrade + output lang dropdown"
3. Report: tasks completed, any issues
4. Stop and wait for instructions.
