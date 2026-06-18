# PATCH_11_APEXPROSPECT_INSERT_AUKIY_LOGO_ASSET.md

You are Claude Code.

PROJECT:
Landing Page PWA / Customer Acquisition System

ACTIVE CHANNEL:
13_BUILD_EXECUTION__APEXPROSPECT

APP:
ApexProspect Operator PWA

LOCAL APP:
http://localhost:3777

MISSION:
Insert the provided AUKIY logo into the ApexProspect UI as the actual brand icon.

This is a small branding asset patch only.

Do NOT redesign the whole UI.
Do NOT refactor globally.
Do NOT change app logic.
Do NOT add AI provider.
Do NOT deploy.
Do NOT touch Nexus cf-version.
Do NOT change WhatsApp workflow.
Do NOT add auto-send.

---

# CURRENT ISSUE

ApexProspect header still shows fallback text/icon:

AP

The real AUKIY logo has not been added as an image asset.

Expected:
Use the provided AUKIY red abstract A logo as the app brand icon in the header.

---

# PROVIDED LOGO

Aliff will provide/download the image file as:

aukiy-logo.png

Use this file as the brand logo.

Target project asset path:

tools/semi-auto-outreach/public/assets/aukiy-logo.png

If `public/assets/` does not exist, create it.

---

# FILES TO INSPECT

Inspect before editing:

- tools/semi-auto-outreach/public/index.html
- tools/semi-auto-outreach/public/app.js
- tools/semi-auto-outreach/public/style.css
- tools/semi-auto-outreach/public/assets/ if exists

Likely files changed:

- public/index.html
- public/style.css
- public/assets/aukiy-logo.png

Only touch app.js if the header is rendered dynamically there.

Do not touch server.js.

---

# REQUIRED UI BEHAVIOR

In header branding area:

Replace or supplement the current fallback `AP` badge with the actual logo image.

Preferred header structure:

- Logo image on left
- Text:
  ApexProspect
  BY AUKIY
- Badge:
  AUKIY LOCAL MODE

Logo should:
- fit cleanly in the current header
- not stretch
- preserve aspect ratio
- be readable at small size
- match dark tactical UI
- not make header too tall
- not break mobile/responsive layout

Recommended display size:
- desktop: 44px to 56px square
- mobile: 36px to 44px square

Use CSS object-fit: contain.

---

# FALLBACK RULE

If logo file fails to load, keep fallback text:

AP

Do not leave broken image icon.

Implementation options:
- use image with onerror fallback
- or keep AP badge behind/near image as fallback
- or CSS fallback if image missing

Simple is fine.

---

# DO NOT CHANGE

Do not change:

1. pipeline tabs
2. prospect table
3. Add Lead behavior
4. Import JSON behavior
5. CSV/JSON/Logs export
6. WhatsApp open logic
7. Confirm Sent logic
8. Locked record logic
9. API routes
10. data files

---

# ACCEPTANCE CRITERIA

Patch is accepted only if:

1. localhost:3777 opens.
2. Header shows AUKIY logo image.
3. ApexProspect name remains visible.
4. BY AUKIY remains visible.
5. AUKIY LOCAL MODE badge remains visible.
6. Logo is not stretched or blurry.
7. Header layout remains clean.
8. App still loads existing leads.
9. Tabs/table still work.
10. No console-breaking errors.
11. No data changed.
12. No API key required.
13. No WhatsApp behavior changed.
14. No auto-send added.

---

# MANUAL VERIFICATION CHECKLIST

At localhost:3777:

1. Refresh browser hard reload.
2. Confirm AUKIY logo appears in header.
3. Confirm fallback AP is not the primary visible icon anymore.
4. Confirm ApexProspect text remains aligned.
5. Confirm AUKIY LOCAL MODE badge remains aligned.
6. Confirm table still loads.
7. Open a prospect modal.
8. Confirm no layout break.
9. Confirm no console error for missing image.
10. Confirm no WhatsApp logic changed.

---

# REPORT FORMAT

Return:

# PATCH 11 AUKIY LOGO ASSET REPORT

1. Files inspected
2. Files changed
3. Asset path created
4. Header markup updated
5. CSS updated
6. Fallback behavior
7. localhost verification
8. Header visual result
9. Regression check result
10. Any remaining issue
11. Recommended next action

STOP AFTER REPORT.

Do not proceed to AI provider.
Do not proceed to Cloudflare deploy.
Do not add SaaS features.
