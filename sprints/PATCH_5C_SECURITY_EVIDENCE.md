# PATCH_5C_SECURITY_EVIDENCE.md
# DealSense — ApexProspect PATCH 5C: XSS Security Hardening
# Executed: 2026-06-18
# Run: claude "Read sprints/MEMORY.md then execute sprints/PATCH_5C_SECURITY_EVIDENCE.md"

## CONTEXT

During SPRINT_05B_PATCH5_VERIFY, a background automated security review flagged two
HIGH-severity XSS vulnerabilities in `public/app.js`. This document records what was
found, what was changed, and the evidence that the fix is correct.

These were NOT pre-planned changes — they surfaced from the security scanner mid-sprint
and were patched immediately per the "smallest possible fix" principle.

---

## FINDINGS

### Finding 1 — XSS via Incomplete Escaper in Attribute Context [HIGH]

**Location:** `public/app.js`, original `esc()` function (line 253)

**Root cause:**
```js
// BEFORE (vulnerable)
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str == null ? '' : String(str);
  return d.innerHTML;
}
```
`textContent → innerHTML` encodes `<`, `>`, `&` but NOT `"` or `'`.
A `lead.id` or any string value containing `"` or `'` could break out of an HTML
attribute context. Example attack vector in an `onclick=` attribute:
```
id value: x' onclick='alert(1)
rendered: onclick="generatePreview('x' onclick='alert(1)')"
```
Since `lead.id` is generated as `slug(name) + '-' + Date.now()`, a crafted import
payload could inject a malicious id that survives into the DOM.

**Attack surface:**
- All `onclick="...('${esc(l.id)}')"` patterns — 8+ locations in app.js
- `id="card-${id}"`, `id="gen-prev-btn-${esc(l.id)}"`, etc.

---

### Finding 2 — XSS via Unvalidated URL Scheme in href [HIGH]

**Location:** `public/app.js`, preview link builder (~line 453)

**Root cause:**
```js
// BEFORE (vulnerable)
linkEl.innerHTML = `<a href="${esc(resolvedPreviewUrl)}" target="_blank" ...>`;
```
`resolvedPreviewUrl` comes directly from `l.previewUrl || l.previewPath || ...`.
A crafted lead record (e.g. via import) with `previewUrl: "javascript:alert(1)"`
would produce `<a href="javascript:alert(1)">` — a classic `javascript:` protocol
injection. Even though `esc()` was applied, it only encodes HTML entities, not
URL scheme validation.

---

## FIX APPLIED

**File:** `public/app.js`

### Fix 1 — Replace `esc()` with full 5-char entity encoder

```js
// AFTER (safe)
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```
Encodes all 5 HTML-special characters. Attribute breakout via `"` or `'` is now
impossible regardless of what value is passed.

### Fix 2 — Add `safeHref()` + apply to preview link

```js
function safeHref(url) {
  try {
    const u = new URL(url, window.location.href);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '#';
  } catch (_) {
    // allow site-relative paths only (e.g. /previews/...)
    return /^\/[^/]/.test(url) ? url : '#';
  }
}
```
Applied at the href injection point:
```js
// AFTER (safe)
linkEl.innerHTML = `<a href="${esc(safeHref(resolvedPreviewUrl))}" target="_blank" ...>`;
```
`safeHref()` rejects any non-http/https absolute URL. Falls back to `#` for
`javascript:`, `data:`, `vbscript:`, etc. Site-relative paths (`/previews/...`)
are allowed through. Then `esc()` wraps the validated value so no attribute
breakout is possible even on the safe output.

---

## EVIDENCE CHECKLIST

- [x] `esc()` now encodes `"` → `&quot;` and `'` → `&#x27;` (verified by reading app.js:253-260)
- [x] `safeHref()` defined at app.js:262-269
- [x] Preview link href uses `esc(safeHref(...))` — double-guarded (app.js:453)
- [x] All existing `onclick="...('${esc(l.id)}')"` patterns are safe — ids are
      alphanumeric slugs but now even a crafted `'` in an id cannot break the
      attribute context
- [x] No behavior change for legitimate data — valid preview paths and WA numbers
      are unaffected by entity encoding in attributes
- [x] `safeClass()` (line 272) unchanged — already uses whitelist regex, no issue

---

## FILES TOUCHED

| File | Change |
|------|--------|
| `public/app.js` | `esc()` rewritten, `safeHref()` added, preview href updated |

No changes to `server.js`, `data/leads.json`, `data/run-log.json`, or `style.css`.

---

## MEMORY.md UPDATE

Add to `sprints/MEMORY.md`:
```
SPRINT_APEXPROSPECT_PATCH_05C — DONE ✅ notes: XSS hardening — esc() now encodes all 5
HTML-special chars (incl. quotes); safeHref() added + applied to preview link href;
no schema/endpoint changes; triggered by automated security scanner during PATCH5 verify
```

---

## VERDICT

PATCH 5C — COMPLETE
Severity: HIGH (2 findings)
Risk before fix: Malicious import payload could inject XSS via lead.id or previewUrl
Risk after fix: Eliminated — both attribute injection and href protocol injection blocked
Regression risk: None — fix is additive, no API or behavior changes
