# Sprint Report — Nexus Landing Engine Full Upgrade

Date: 2026-05-26

---

## Upgrade 1 — UI Language Toggle (EN/BM)

**What changed:** `public/index.html`

- Added `.header-right` wrapper div in `<header>` to hold both the status badge and the new toggle
- Added `#ui-lang-toggle` with two buttons: `EN` (active by default) and `BM`
- Added `.ui-lang-btn` and `.ui-lang-btn.active` CSS to existing `<style>` block
- Added `data-i18n` attributes to all user-facing interface elements:
  - Panel header, section titles, all form labels, hints, button text
  - Loading overlay text, empty state text, editor panel labels
- Added `data-i18n-opt` attributes on all `<select>` `<option>` elements for niche/tone selectors
- Added `UI` translation object with full EN and BM translations (labels, placeholders, toasts, errors, select options)
- Added `setUILang(l)` function (exposed as `window.setUILang`) that:
  1. Updates active state on toggle buttons
  2. Updates all `[data-i18n]` element textContent
  3. Updates all `[data-i18n-opt]` option text
  4. Updates `placeholder` attributes on all form inputs

**How it works:** Default is EN. Clicking BM calls `setUILang('bm')` which replaces all labelled text in-place. No page reload needed.

---

## Upgrade 2 — Output Language Selector (7 options)

**What changed:** `public/index.html` (within the form)

- Added new form section above Generate button: "Output Language" (i18n key: `section_lang` / BM: "Bahasa Output")
- Added `.lang-output-grid` with 7 buttons in a 2-column grid:
  - 🇬🇧 English (EN only) — active by default
  - 🇲🇾 Bahasa Malaysia (BM only)
  - 🇨🇳 中文 (ZH only)
  - 🇬🇧🇲🇾 EN + BM (Bilingual)
  - 🇬🇧🇨🇳 EN + ZH (Bilingual)
  - 🇨🇳🇲🇾 ZH + BM (Bilingual)
  - 🌐 EN + BM + ZH (Trilingual) — spans full width
- Added `selectedOutputLang` state variable (default `'en'`)
- Button click handler updates active state and `selectedOutputLang`
- `outputLang` is included in the POST payload sent to `/generate`

---

## Multilingual Output — How the Generated Page Works

For **single-language** outputs (`en`, `bm`, `zh`): page is a standard static HTML, no JS toggle needed.

For **bilingual/trilingual** outputs (`en+bm`, `en+zh`, `zh+bm`, `en+bm+zh`):
- Navbar includes language toggle buttons (e.g. [EN] [BM] [中文])
- All text elements have `data-i18n` attributes
- Page includes a `const T = { en: {...}, bm: {...}, zh: {...} }` translation object
- `setLang(l)` function applies translations with a 150ms opacity fade transition
- Default language is the first in the `outputLang` code (e.g. `en` for `en+bm+zh`)

---

## Upgrade 3 — Backend Multilingual Generation

**Files changed:** `pipeline/generate.js`, `pipeline/buildHTML.js`, `pipeline/normalize.js`, `pipeline/buildJSON.js`, `public/js/apiService.js`

### normalize.js
- Added `outputLang` field: validates against `['en','bm','zh','en+bm','en+zh','zh+bm','en+bm+zh']`, defaults to `'en'`

### generate.js
- Rewrote `buildPrompt` into `buildMonolingualPrompt` and `buildMultilingualPrompt`
- For monolingual: single API call, returns all copy fields in target language
- For multilingual: single API call requesting JSON with one key per language code
- AI response includes: `headline`, `subheadline`, `ctaText`, `navbarCta`, `footerCta`, `whatsappCta`, `whyChooseTitle`, `whatWeOfferTitle`, `findUsTitle`, `readyTitle`, `footerGetStarted`, `benefits[]`
- Niche-aware seed copy for `dental_clinic` in EN, BM, ZH (used as prompt style hint)
- Language style guidance embedded in prompt: BM = emotional/direct, ZH = professional/precise, EN = conversion-optimized

### buildHTML.js
- Added `buildLangToggleButtons(langs)` — generates navbar toggle buttons
- Added `buildI18nScript(multilingual, langs, allBenefitsByLang)` — generates `<script>` with `const T = {...}` and `setLang()` function
- All static text strings in generated HTML now use `data-i18n` attributes
- Lang toggle CSS only injected when `isMultilingual === true`
- i18n script only injected when `isMultilingual === true`

### buildJSON.js
- Added `outputLang`, `navbarCta`, `footerCta`, `whatsappCta`, `multilingual`, `langs` to returned JSON

---

## Upgrade 4 — StateManager

**File:** `public/js/stateManager.js`

- Added `outputLang: 'en'` to `editedValues` initial shape and `reset()` method
- `apiService.js` now picks up `outputLang` from server response JSON and stores in `editedValues`

---

## Upgrade 5 — Security

**File:** `server.js`

- Added `requireApiKey` middleware on `POST /generate`:
  - If `APP_API_KEY` env var is set, client must send matching `x-api-key` header
  - Returns `401` if missing or wrong
  - If `APP_API_KEY` is not set, middleware passes (dev mode — no key required)
- Improved `GET /demo/:id` path sanitization:
  - Strips all characters except alphanumeric, hyphen, underscore
  - Resolves path and checks it starts with `demoStorageDir + path.sep` (path traversal guard)
  - Returns 400 for empty/invalid IDs
- `escapeHTML()` verified present in both `previewRenderer.js` (client) and `buildHTML.js` (server) — all user-provided strings are escaped before HTML injection
- `express.json({ limit: '1mb' })` added to prevent large payload attacks

---

## Upgrade 6 — Railway Config

**Files created:** `railway.json`, `DEPLOY_CHECKLIST.md`

### railway.json
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": { "restartPolicyType": "ON_FAILURE" }
}
```

### Environment Variables Required

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `APP_API_KEY` | Frontend auth key (x-api-key header) |
| `PORT` | Set automatically by Railway |

---

## Upgrade 7 — Demo Files

| File | Path | Description |
|---|---|---|
| BM Dental | `demo-storage/klinik-dentis-bm.html` | Klinik Pergigian Dr. Ahmad — BM only |
| Trilingual | `demo-storage/smilecare-trilingual.html` | SmileCare Dental — EN + BM + ZH with live toggle |

**Demo URLs (once deployed):**
- `/demo/klinik-dentis-bm`
- `/demo/smilecare-trilingual`

---

## Upgrade 8 — Evolution Roadmap

**File:** `EVOLUTION_ROADMAP.md`

- Phase MVP marked as complete (multilingual included as core, not future)
- Phase 1-4 roadmap defined: Polish → Multi-Page → SaaS → White-Label
- Multilingual architecture notes documenting design decisions

---

## Known Issues / TODOs

1. **Demo storage is ephemeral on Railway** — files in `demo-storage/` are cleared on each redeploy. For production persistence, attach a Railway Volume or use external storage (e.g. Supabase Storage, R2).

2. **Frontend `x-api-key` source** — `apiService.js` reads `window._appApiKey`. This needs to be set somewhere (e.g. injected by server into `index.html` as a `<script>` tag, or passed via a meta tag). Currently it defaults to empty string, which is fine when `APP_API_KEY` is not set (dev mode).

3. **Live Editor multilingual** — The live editor (`editorController.js` / `previewRenderer.js`) rebuilds HTML client-side from JSON, which doesn't include the multilingual `T` object. After editing, only the primary language is shown in the client-side rebuilt preview. Server-generated HTML (from `/demo/:id`) retains full multilingual support.

4. **Select option i18n in form** — The `<select>` for niche uses `data-i18n-opt` on `<option>` elements. The selected value (e.g. `dental_clinic`) is not affected — only the display text changes.

---

## NEXT ACTION — Railway Deploy Steps

```
1. git init && git add . && git commit -m "Initial commit: Nexus Landing Engine v2 multilingual"
2. Create GitHub repo → push
3. Railway dashboard → New Project → Deploy from GitHub
4. Set env vars:
   ANTHROPIC_API_KEY=sk-ant-...
   APP_API_KEY=$(openssl rand -hex 32)
5. Wait for build → check logs for "AI Landing Page System v2 running on..."
6. Visit Railway-assigned URL → test form → verify multilingual toggle on generated page
7. Test demo links: /demo/klinik-dentis-bm and /demo/smilecare-trilingual
```
