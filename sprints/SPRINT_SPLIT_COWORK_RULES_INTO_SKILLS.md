# SPRINT_SPLIT_COWORK_RULES_INTO_SKILLS.md
# DealSense — Pecahkan COWORK_OPERATIONAL_RULES.md jadi Skill Berasingan (Format Rasmi)
# Run: claude "Execute sprints/SPRINT_SPLIT_COWORK_RULES_INTO_SKILLS.md"

## SKILL-FIRST CHECK
SPRINT INI DIKECUALIKAN dari Rule 1 (skill-first doctrine) sendiri —
sebab sprint ni tujuannya membaiki overhead skill-first itu sendiri.
Jangan panggil skill apa-apa untuk execute sprint ni. Terus baca + tulis fail.

## INSTRUCTION
Ini REORGANIZATION-ONLY sprint. Tidak menulis kod baru, tidak ubah server.js/
app.js/style.css. Hanya memecahkan SATU fail rules (COWORK_OPERATIONAL_RULES.md)
jadi BEBERAPA fail skill format rasmi, supaya boleh di-load satu-satu mengikut
keperluan — bukan dibaca semua serentak setiap sprint.

Execute phase by phase. Lepas setiap phase: report, then STOP.
Tunggu "continue" sebelum phase seterusnya.

---

## KENAPA SPRINT NI WUJUD

Fail asal `COWORK_OPERATIONAL_RULES.md` (15 rules) dipanggil PENUH setiap kali
sprint dijalankan (Rule 2 Step 1). Ditambah Rule 1/9 yang wajibkan 5-6 skill
dipanggil SETIAP sprint, every phase untuk major patch. Ini punca overhead
token tinggi — bukan jimat, tapi multiply cost.

Penyelesaian: pecah jadi skill kecil format SKILL.md rasmi (sama struktur
dengan /mnt/skills/public/ atau /mnt/skills/user/nexus-pwa/), supaya
satu skill = satu fungsi spesifik, ada description trigger yang jelas,
dan hanya di-load bila benar-benar relevan kepada task semasa — bukan
semuanya sekali setiap kali.

---

## PHASE 1 — AUDIT KANDUNGAN ASAL

Baca `DealSense/cowork-rules/COWORK_OPERATIONAL_RULES.md` penuh.

Untuk setiap Rule (1-15), kategorikan:
- Rule number + nama ringkas
- Adakah ia: (a) PROTOCOL (langkah wajib ikut), (b) GUARDRAIL (do/don't list),
  (c) FORMAT (templat output/commit/report), atau (d) REFERENCE (struktur folder,
  jadual priority)
- Cadangan: skill mana rule ni patut masuk (rujuk pemetaan PHASE 2 di bawah)

Jangan tulis apa-apa fail lagi. Report kategorisasi penuh.
STOP — tunggu "continue".

---

## PHASE 2 — PECAHKAN JADI SKILL BERASINGAN

Cipta struktur baru:
```
DealSense/skill-library/cowork-skills/
├── data-safety-guardrails/
│   └── SKILL.md          ← Rule 6 (data safety) + bahagian Rule 5 yg relevan
├── stop-conditions/
│   └── SKILL.md          ← Rule 8 (bila wajib stop)
├── rollback-protocol/
│   └── SKILL.md          ← Rule 11 (rollback steps)
├── commit-report-format/
│   └── SKILL.md          ← Rule 7 (commit message) + Rule 14 (status report format)
├── approval-gates/
│   └── SKILL.md          ← Rule 12 (bila wajib tunggu Aliff)
├── project-priority/
│   └── SKILL.md          ← Rule 13 (urutan project)
└── skill-check-cadence/
    └── SKILL.md          ← Rule 1, 2, 4, 9, 15 (skill-first, DISERTAKAN
                              cadangan downgrade — lihat nota di bawah)
```

Setiap `SKILL.md` MESTI ikut format rasmi (rujuk contoh sedia ada dalam
`/mnt/skills/user/nexus-pwa/SKILL.md` untuk struktur):

```markdown
---
name: [nama-skill]
description: [Bila skill ni patut trigger — spesifik, bukan umum.
  Sebut keyword/situasi konkrit, bukan "guna untuk semua project".]
---

# [Nama Skill]

## Bila Guna
[Trigger conditions spesifik]

## Rules
[Isi rule yang relevan dari fail asal — pendek, padat]

## Contoh
[1 contoh ringkas jika ada]
```

### NOTA KHUSUS — skill-check-cadence/SKILL.md

Fail asal Rule 1 + Rule 9 wajibkan 5-6 skill dipanggil SETIAP sprint, every
phase untuk major patch. Ini overhead tinggi.

Dalam skill ni, tulis DUA versi cadangan (jangan pilih sendiri, bagi Aliff
yang decide selepas tengok):

**Versi A — Strict (macam asal):** semua 5-6 skill wajib, every phase major patch.

**Versi B — Downgrade:** skill check SEKALI sahaja di permulaan major patch
(bukan every phase), dan untuk bug-fix/sprint kecil/verification-only sprint
(macam SPRINT_05B_PATCH5_VERIFY), skill-first protocol DI-SKIP terus.

Tandakan jelas: "MENUNGGU KEPUTUSAN ALIFF — Versi A atau B" di bahagian atas
fail ni. Jangan padam Versi A, simpan kedua-dua untuk perbandingan.

Lepas semua 7 folder + SKILL.md dicipta, report:
- Senarai lengkap fail dicipta
- Mana-mana Rule dari fail asal yang TIDAK masuk mana-mana skill (jika ada,
  sebab kenapa — contoh Rule 3 struktur folder mungkin jadi REFERENCE.md
  biasa, bukan skill, sebab ia tak ada "trigger condition")

STOP — tunggu "continue".

---

## PHASE 3 — PRESERVE FAIL ASAL + LINK

JANGAN delete `COWORK_OPERATIONAL_RULES.md` asal.

1. Tambah nota di bahagian paling atas fail asal:
   ```
   > **DIPECAHKAN:** Rules dalam fail ni telah dipecah jadi skill berasingan
   > di `DealSense/skill-library/cowork-skills/`. Fail ni dikekal sebagai
   > rujukan sejarah/lengkap sahaja. Untuk kerja sebenar, load skill spesifik
   > dari folder cowork-skills/ ikut keperluan, bukan fail ni.
   ```
2. Cipta SATU fail index: `DealSense/skill-library/cowork-skills/INDEX.md`
   — senarai semua 7 skill + 1 baris description bila guna setiap satu.

STOP — tunggu "continue".

---

## PHASE 4 — FINAL REPORT

Format:
```
✅ SKILLS CREATED (format rasmi SKILL.md):
   [senarai 7 fail + path]

✅ INDEX.md created at: [path]

✅ ORIGINAL FILE preserved + annotated: [path]

⚠ RULES NOT MAPPED (jika ada): [senarai + sebab]

⚠ MENUNGGU KEPUTUSAN ALIFF:
   skill-check-cadence/SKILL.md ada 2 versi (A=strict, B=downgrade) —
   Aliff perlu pilih sebelum skill ni digunakan dalam sprint akan datang.

📋 NEXT STEP:
   Aliff review setiap SKILL.md, confirm description trigger tepat,
   pilih Versi A/B untuk skill-check-cadence, baru gunakan dalam
   sprint PATCH 6 / 05B seterusnya.
```

STOP — done. Tunggu Aliff review sebelum guna skill-skill ni dalam
sprint sebenar.
