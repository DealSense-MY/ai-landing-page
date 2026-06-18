# SPRINT_TOKEN_SAVING_SKILLS.md
# DealSense — Cipta 4 Skill Tambahan untuk Maksimumkan Penjimatan Token
# Run: claude "Execute sprints/SPRINT_TOKEN_SAVING_SKILLS.md"

## SKILL-FIRST CHECK
Sprint ni DIKECUALIKAN dari skill-check-cadence (ia reorganization-only,
bukan ubah data/payment/WA logic). Jangan panggil skill apa-apa untuk
execute sprint ni sendiri.

## INSTRUCTION
Cipta 4 skill BARU format SKILL.md rasmi, letak dalam folder yang SAMA
dengan 7 skill sedia ada (`DealSense/skill-library/cowork-skills/`),
supaya semua skill rules — yang lama (data safety, stop conditions, dll)
dan yang baru (token-saving) — berada dalam SATU sistem rujukan yang
konsisten, bukan dua sistem berasingan.

Ini REORGANIZATION-ONLY. Tiada kod produk diubah (server.js/app.js/style.css
tidak disentuh). Hanya cipta fail skill + update INDEX.md.

Execute phase by phase. Lepas setiap phase: report, then STOP.
Tunggu "continue" sebelum phase seterusnya.

---

## KENAPA 4 SKILL NI

Berdasarkan research (rujukan: Anthropic Claude Code best practices docs +
KDnuggets/Analytics Vidhya/MindStudio token optimization guides, 2026),
4 punca pembaziran token tambahan dikenal pasti — berasingan dari isu
skill-check overhead yang sudah dibaiki:

1. Tool output / log mentah membanjiri context tanpa had
2. Explore/audit fail besar terus mengotorkan context utama (tiada subagent)
3. Context lama terkumpul merentas sesi panjang tanpa di-reset
4. Skop sprint terlalu luas (banyak phase/fail sekali) berbanding keperluan sebenar

Setiap satu jadi SATU skill, trigger spesifik, supaya Cowork load bila
relevan sahaja — sejajar prinsip yang sama dengan 7 skill sebelum ni.

---

## PHASE 1 — CIPTA SKILL: output-capping

Folder: `DealSense/skill-library/cowork-skills/output-capping/SKILL.md`

```markdown
---
name: output-capping
description: Trigger sebelum menjalankan sebarang command bash, log dump,
  atau pembacaan fail besar (>200 baris) semasa sprint Cowork. Mengehadkan
  saiz output yang masuk context supaya tidak membanjiri sesi.
---

# Output Capping

## Bila Guna
- Sebelum run command yang mungkin hasilkan output panjang (test log,
  build output, curl response, directory listing besar)
- Sebelum baca fail >200 baris secara penuh

## Rules
1. Had output bash kepada ~8000 token / ~150-200 baris. Jika command
   berpotensi keluarkan lebih, tapis dahulu:
   ```
   command 2>&1 | grep -E "FAIL|ERROR|Error" | head -50
   ```
2. Jangan `cat` fail besar penuh kalau cuma perlu satu bahagian — guna
   `view_range` atau `sed -n 'START,ENDp'` untuk baca segmen relevan sahaja.
3. Untuk directory listing, guna `ls` ringkas bukan `find` rekursif penuh
   melainkan benar-benar perlu.
4. Jika output terpaksa panjang (contoh: full stack trace untuk debug
   kritikal), nyatakan sebab dalam report sebelum paste.

## Contoh
Salah: `npm test` (paste 2000 baris log penuh)
Betul: `npm test 2>&1 | grep -A 5 -E "FAIL|ERROR" | head -100`
```

STOP — tunggu "continue".

---

## PHASE 2 — CIPTA SKILL: subagent-explore

Folder: `DealSense/skill-library/cowork-skills/subagent-explore/SKILL.md`

```markdown
---
name: subagent-explore
description: Trigger bila sprint memerlukan audit, investigasi, atau
  pembacaan banyak fail merentas codebase (contoh "audit semua fail dalam
  tools/", "scan struktur project", "cari semua tempat X digunakan") SEBELUM
  sebarang implementasi bermula.
---

# Subagent Explore

## Bila Guna
- Audit-only sprint (cth: SPRINT_OPERATOR_AUDIT, SPRINT_ARCHITECTURE_LOCK)
- "Cari semua tempat X" / "scan folder Y" / fasa investigasi sebelum patch
- Sebarang kerja yang perlu baca >3 fail hanya untuk faham konteks
  (bukan untuk edit terus)

## Rules
1. Delegasikan kerja "baca dan faham" kepada subagent berasingan —
   guna arahan jenis: "use subagent to investigate [topik], report
   findings only".
2. Subagent explore dalam context window berasingan, dan lapor balik
   RINGKASAN sahaja (bukan isi penuh fail yang dibaca) ke conversation utama.
3. Main session Cowork hanya terima output ringkasan subagent — tidak
   perlu baca fail mentah yang sama sekali lagi selepas itu, melainkan
   untuk edit langsung.
4. Untuk sprint AUDIT-ONLY (tiada kod ditulis), ini WAJIB — jangan baca
   semua fail terus dalam main context kalau tujuan cuma report.

## Contoh
Salah: Cowork baca server.js + app.js + index.html + style.css penuh
       dalam main context untuk audit, semua tu kekal dalam context
       sepanjang sprint.
Betul: "Use subagent to read server.js, app.js, index.html, style.css
       and report: data storage pattern, import capability, status
       persistence. Return findings only, not file contents."
```

STOP — tunggu "continue".

---

## PHASE 3 — CIPTA SKILL: context-reset-cadence

Folder: `DealSense/skill-library/cowork-skills/context-reset-cadence/SKILL.md`

```markdown
---
name: context-reset-cadence
description: Trigger selepas setiap phase sprint yang sudah commit + push,
  ATAU bila sesi sudah melepasi ~40 mesej / context terasa "berat" (respons
  lambat, mula keliru arahan awal). Menentukan bila wajar reset context
  berbanding sambung.
---

# Context Reset Cadence

## Bila Guna
- Selepas commit + push satu phase sprint, SEBELUM phase seterusnya
  bermula — jika phase seterusnya tidak perlu rujuk balik detail
  implementasi phase sebelum (cuma perlu tahu "phase lepas dah siap")
- Bila sesi Cowork sudah panjang (anggaran >40 pertukaran mesej) dan
  mula menunjukkan tanda context rot (jawapan kurang tepat, lupa
  arahan awal)

## Rules
1. Lepas setiap phase sprint selesai + STOP + report: jika phase
   seterusnya independent (tidak perlu detail kod phase lepas, cuma
   status "PASS"), cadangkan `/clear` sebelum "continue".
2. Pisahkan fasa PLANNING/AUDIT daripada fasa EXECUTION — guna context
   reset di antara dua fasa ni, bawa hanya keputusan/spec ringkas
   (bukan keseluruhan perbualan audit) ke fasa execution.
3. Jika ragu sama ada reset selamat (contoh: phase seterusnya perlu
   rujuk balik kod tepat dari phase sebelum), JANGAN reset — lebih
   baik bawa overhead kecil daripada hilang konteks kritikal.
4. Selepas reset, mulakan semula dengan ringkasan pendek status terkini
   (bukan replay penuh), guna /recap jika tersedia.

## Contoh
Phase 1 (audit kategorisasi) selesai → keputusan dicatat dalam report →
SEBELUM Phase 2 (cipta fail), boleh /clear kerana Phase 2 hanya perlukan
senarai pemetaan akhir (yang sudah dalam report), bukan proses pemikiran
penuh Phase 1.
```

STOP — tunggu "continue".

---

## PHASE 4 — CIPTA SKILL: scoped-sprint-sizing

Folder: `DealSense/skill-library/cowork-skills/scoped-sprint-sizing/SKILL.md`

```markdown
---
name: scoped-sprint-sizing
description: Trigger SEBELUM Ith menulis sprint file baru, atau sebelum
  Cowork menerima sprint dengan >3 phase untuk satu isu/fungsi tunggal.
  Menyemak sama ada skop sprint sepadan dengan saiz isu sebenar.
---

# Scoped Sprint Sizing

## Bila Guna
- Sebelum menulis/menerima sprint baru — semak dahulu: adakah isu ni
  betul-betul perlukan banyak phase, atau ia template default yang
  terlalu besar untuk masalah kecil?
- Bila satu sprint cuba "verify + fix + polish + dokumentasi" semua
  sekali untuk SATU bug kecil

## Rules
1. Bug-fix/verification tunggal (1 fungsi rosak) → MAX 1-2 phase.
   Jangan tulis 5 phase untuk isu yang sebenarnya satu fix.
2. Major patch (skema data berubah / endpoint baru) → phase dipisah
   ikut unit kerja sebenar (cth: 1 phase per fail diubah), bukan
   dipisah ikut "tahap proses" generik (audit→build→test→verify→report)
   jika kerja sebenar kecil.
3. Audit-only sprint (tiada kod ditulis) → gabung dengan subagent-explore
   skill, JANGAN buat audit sprint berasingan untuk setiap fail.
4. Sebelum execute, Cowork boleh tanya balik: "Sprint ni ada N phase
   untuk isu [X]. Berdasarkan saiz isu, adakah ini patut dipendekkan
   kepada [Y] phase?" — jika jawapan Aliff "ya", padam phase berlebihan
   dahulu sebelum mula.

## Contoh
Salah: Sprint 5-phase (pre-check, fix, test, verify, report) untuk
       satu CSS color tidak render.
Betul: Sprint 1-phase: "Baca buildHTML.js, cari sebab warna tak render,
       fix, commit, report." Selesai dalam satu phase jika isu memang kecil.
```

STOP — tunggu "continue".

---

## PHASE 5 — UPDATE INDEX.md

Buka `DealSense/skill-library/cowork-skills/INDEX.md` (yang sedia ada
dari sprint sebelum ni). TAMBAH 4 skill baru ni ke senarai — jangan
tulis semula dari kosong, kekalkan 7 entri lama, tambah 4 baru supaya
jadi 11 total.

Format tambahan:
```
8. output-capping — had saiz output command/log sebelum masuk context
9. subagent-explore — delegasikan audit/explore fail banyak ke subagent
10. context-reset-cadence — bila wajar /clear antara phase atau sesi panjang
11. scoped-sprint-sizing — semak skop sprint sepadan saiz isu sebenar
```

STOP — tunggu "continue".

---

## PHASE 6 — FINAL REPORT

Format:
```
✅ 4 SKILL BARU DICIPTA:
   8. DealSense/skill-library/cowork-skills/output-capping/SKILL.md
   9. DealSense/skill-library/cowork-skills/subagent-explore/SKILL.md
   10. DealSense/skill-library/cowork-skills/context-reset-cadence/SKILL.md
   11. DealSense/skill-library/cowork-skills/scoped-sprint-sizing/SKILL.md

✅ INDEX.md UPDATED — 11 skill total (7 lama + 4 baru), satu sistem rujukan

✅ TIADA kod produk disentuh (server.js/app.js/style.css/leads.json)

📋 RINGKASAN SISTEM SKILL PENUH SEKARANG:
   Data/Safety:     data-safety-guardrails, stop-conditions, rollback-protocol
   Process:         approval-gates, project-priority, skill-check-cadence
   Format:          commit-report-format
   Token-Saving:    output-capping, subagent-explore,
                     context-reset-cadence, scoped-sprint-sizing

⚠ NOTA JUJUR:
   Skill ni mengurangkan overhead BERULANG (skill-check redundant, output
   tak terkawal, audit yang mengotorkan context, sprint terlalu besar).
   Ia TIDAK menjamin nombor peratus penjimatan tertentu — penjimatan
   sebenar bergantung corak penggunaan dan hanya boleh diukur melalui
   "View usage" dashboard Anthropic, bandingkan sebelum/lepas untuk
   saiz kerja setanding.

📋 NEXT STEP:
   Aliff review 4 skill baru. Lepas approve, semua sprint akan datang
   (termasuk SPRINT_05B_PATCH5_VERIFY yang masih outstanding) automatik
   ikut 11 skill ni bila relevan.
```

STOP — done.
