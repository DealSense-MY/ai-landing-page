# BLUEPRINT_PROSPECTS_OPERATOR.md
# DealSense — Prospects Operator System Blueprint
# Dibaca oleh: Claude Code CLI sebelum execute FABLE_BUILD_SPEC
# Dibuat oleh: Ith (Claude.ai)

---

## 1. IDENTITI SISTEM

System Name : DealSense AI-Powered Customer Acquisition System
App Name    : DealSense Prospects Operator
Port        : localhost:3777
Repo        : DealSense-MY/ai-landing-page
Local path  : C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\

---

## 2. FOLDER STRUCTURE (FINAL)

```
tools/
└── semi-auto-outreach/           ← JANGAN rename folder ini
    ├── server.js                 ← Entry point (PRESERVE, upgrade sahaja)
    ├── package.json              ← PRESERVE
    ├── data/
    │   ├── leads.json            ← Prospect database (PRESERVE data lama)
    │   ├── outreach-log.json     ← Action log (PRESERVE)
    │   └── run-log.json          ← NEW — AutoLog event store
    ├── public/
    │   ├── index.html            ← Dashboard UI (UPGRADE, jangan rewrite)
    │   ├── app.js                ← Frontend logic (UPGRADE)
    │   └── style.css             ← AUKIY theme (PRESERVE, tambah je)
    └── modules/                  ← NEW folder
        ├── postbackOperator.js   ← NEW — AutoLog + AutoLock
        ├── previewBuilder.js     ← NEW — Fast Hustle preview generator
        └── importValidator.js    ← NEW — JSON import + validation
```

## 3. PRESERVE RULES (WAJIB)

Claude Code CLI MESTI:
- Preserve semua data dalam leads.json — jangan delete Zira lead
- Preserve AUKIY theme dalam style.css
- Preserve port 3777
- Preserve approve → WA open behavior
- Preserve DM draft + edit flow
- INSPECT dulu sebelum tukar apa-apa

Claude Code CLI DILARANG:
- Rename folder tools/semi-auto-outreach
- Delete leads.json atau outreach-log.json
- Rewrite dari scratch tanpa inspect
- Tukar port
- Tambah auto-send tanpa human approval

---

## 4. UI RENAME

Tukar visible title sahaja:
DARI : DealSense Operator Lite
KE   : DealSense Prospects Operator

Tukar dalam:
- public/index.html → <h1> tag
- public/index.html → <title> tag
- app-header badge: "AUKIY LOCAL MODE" → kekal

---

## 5. DATA PATH

Semua data → tools/semi-auto-outreach/data/
Jangan buat data folder di luar path ini.
Jangan guna /app/data atau absolute path.
Guna: path.join(__dirname, 'data', 'leads.json')

---

## 6. ENVIRONMENT

Node.js        : semak version semasa, jangan paksa upgrade
Express        : kekal version dalam package.json
No new npm     : jangan tambah dependencies baru tanpa sebab
No database    : JSON file storage sahaja untuk MVM
No cloud       : local-first, no Supabase, no MongoDB dalam MVM

---

## 7. MIGRATION PLAN — DATA LAMA

Zira lead dalam leads.json ada schema lama.
Bila load leads.json, migrate in-memory:
- Tambah field baru dengan default value
- Jangan delete field lama
- Simpan balik dengan schema penuh
- Tulis migration note dalam console.log

Field baru yang perlu di-add ke records lama:
- events: []
- locked: false
- lockedAt: ""
- lockReason: ""
- amendments: []
- previewSlug: ""
- previewUrl: ""
- trackedPreviewUrl: ""
- previewClicked: false
- previewClickCount: 0
- prospectStatus: lead.status || "NEW"
- dealStatus: "OPEN"
- scheduleStatus: "NOT_SCHEDULED"

---

## 8. SAFETY RULES (NON-NEGOTIABLE)

1. Tiada auto-send WhatsApp
2. Tiada Baileys active dalam MVM
3. Approve button = buka WA link sahaja, manusia tekan send
4. Tracking = preview click sahaja
5. Tiada fake data dalam preview pages
6. Preview mesti ada PREVIEW watermark
7. Human approval sebelum apa-apa DM

