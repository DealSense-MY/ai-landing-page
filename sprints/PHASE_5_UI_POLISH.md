# PHASE_5_UI_POLISH.md
# Nexus Landing Engine — Phase 5: UI Polish
# Run: claude "Read MEMORY.md then execute PHASE_5_UI_POLISH.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 5 is DONE, stop immediately and tell user.
Confirm PHASE 4 is DONE before proceeding.
Read pipeline/buildHTML.js and public/index.html before changes.

---

## TASK 1 — BENEFIT CARDS (buildHTML.js)

Current: benefit cards have icon + one line text only.
Fix: AI prompt already generates description — ensure buildHTML.js
renders it below the benefit title.

Each benefit card structure:
```html
<div class="benefit-card">
  <div class="benefit-icon">[icon]</div>
  <h3 class="benefit-title">[title]</h3>
  <p class="benefit-desc">[description — 1-2 sentences]</p>
</div>
```

Update generate.js prompt to ensure each benefit item returns:
{ icon, title, description } — not just a string.

Update buildHTML.js to render description if present.

---

## TASK 2 — HERO IMAGE RATIO FIX (buildHTML.js)

Current: text side dominates, image too small on desktop.
Fix: balance to 50/50 or 55/45 (text/image) on desktop.

CSS change in generated page:
```css
.hero-content { flex: 1; }
.hero-image { flex: 1; max-width: 50%; }
.hero-image img { width: 100%; height: 400px; object-fit: cover; border-radius: 12px; }
```

---

## TASK 3 — FOOTER UPGRADE (buildHTML.js)

Current footer: address + WhatsApp link only.
Upgrade footer to include if provided:
- Phone (landline) with ☎ icon + tel: link
- Email with ✉ icon + mailto: link
- Operating hours with 🕐 icon
- Owner/Doctor name with 👨‍⚕️ icon (for clinic niches)

Layout: 2-column grid on desktop, single column on mobile.

---

## TASK 4 — PAGE META TITLE (buildHTML.js)

Set in <head>:
```html
<title>[businessName] — [tagline if exists, else niche label]</title>
<meta name="description" content="[subheadline from AI]">
<meta property="og:title" content="[businessName]">
<meta property="og:description" content="[subheadline]">
<meta property="og:image" content="[heroImageUrl if exists]">
```

---

## TASK 5 — DEMO URL COPY BUTTON (public/index.html)

Find the Share Link button / demo URL display area.
Add a Copy button next to the demo URL:

```html
<button id="copy-demo-url" onclick="copyDemoUrl()">
  📋 Copy URL
</button>
```

JS function:
```javascript
function copyDemoUrl() {
  const url = document.getElementById('demo-url-display').textContent;
  navigator.clipboard.writeText(url).then(() => {
    document.getElementById('copy-demo-url').textContent = '✅ Copied!';
    setTimeout(() => {
      document.getElementById('copy-demo-url').textContent = '📋 Copy URL';
    }, 2000);
  });
}
```

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 5 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 5 — UI polish, hero ratio, footer, meta, copy button"
3. Report: tasks completed, any issues
4. Stop and wait for instructions.
