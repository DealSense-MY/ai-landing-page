# LOCK_SKILL_CADENCE_DECISION.md
# Run: claude "Execute sprints/LOCK_SKILL_CADENCE_DECISION.md"

## KEPUTUSAN ALIFF: VERSI B (DOWNGRADE) — DIPILIH

Buka `DealSense/skill-library/cowork-skills/skill-check-cadence/SKILL.md`.

Buang Versi A sepenuhnya dari fail (jangan simpan dua-dua lagi — fail kekal
satu versi sahaja supaya tak bercampur bila Cowork load skill ni nanti).

Tulis semula fail tu supaya isi rule jadi:

```
SKILL CHECK CADENCE (LOCKED)

Default: SKIP skill-first protocol untuk:
- Sprint kecil/bug-fix
- Verification-only sprint (contoh: SPRINT_05B_PATCH5_VERIFY)
- UI/style patch
- Sprint yang tidak ubah struktur data

WAJIB jalankan skill check (sekali sahaja, di permulaan, BUKAN every phase) bila:
- Struktur data leads.json berubah (field baru/field dibuang)
- Endpoint baru yang menulis/mengubah data
- Major patch yang sentuh payment flow atau WhatsApp approval logic

Bila wajib: panggil HANYA skill paling relevan (biasanya engineering:code-review
untuk data safety) — bukan semua 5-6 skill serentak.
```

Pastikan description di header SKILL.md (untuk auto-trigger) reflect rule
ringkas ni — pendek, bukan senarai panjang macam fail asal.

Report: fail dikemaskan, paste isi akhir SKILL.md untuk semakan.
STOP — done.
