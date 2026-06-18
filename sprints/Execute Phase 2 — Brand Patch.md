You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Execute Phase 2 — Brand Patch.

Goal:
Rename the visible product/platform branding from:

DealSense Prospects Operator

to:

ApexProspect
BY AUKIY

This is a BRANDING PATCH ONLY.

---

IMPORTANT SAFETY RULES

Do NOT modify:

* prospect names
* businessName
* lead IDs
* phone numbers
* locations
* statuses
* data/leads.json
* server.js
* WhatsApp flow
* approval flow
* auto-send rules
* DM Draft logic
* import/export logic
* Next Actions logic
* pipeline status logic

This patch must only affect visible branding and visual style.

---

FILES ALLOWED

Allowed to modify:

* public/index.html
* public/style.css

Allowed only if needed:

* create folder public/assets/

Do NOT modify public/app.js unless absolutely required for visible brand string, but previous audit says brand is static HTML only.

---

BRAND UPDATE

Replace visible product name:

From:
DealSense Prospects Operator

To:
ApexProspect

Add sub-brand line:

BY AUKIY

Browser title should become:

ApexProspect by AUKIY

Keep badge:

AUKIY LOCAL MODE

---

HEADER LAYOUT

Current header:

DealSense Prospects Operator
AUKIY LOCAL MODE
Operation ON / Agent Run / Add Lead / CSV / JSON / Logs

New header should show:

[Brand Icon] ApexProspect
BY AUKIY

AUKIY LOCAL MODE badge stays visible.

Header action buttons remain unchanged.

Do not remove:

* Operation ON
* Agent Run
* Add Lead
* CSV
* JSON
* Logs

---

ICON SUPPORT

Create support for this image path:

public/assets/apexprospect-icon.png

If image exists, show it in the header.

If image does not exist, use fallback CSS mark:

* square/rounded dark container
* red abstract A / AP mark
* premium AUKIY style
* must not break layout

Example concept:
A red Apex/A symbol beside the product name.

Do not require the image file to exist for UI to work.

---

STYLE DIRECTION

Keep AUKIY premium theme:

* matte black
* graphite panels
* crimson/red accent
* warm white text
* operator cockpit feel
* serious and premium
* no neon
* no cheap SaaS blue/green
* no playful style

Suggested CSS tokens if needed:

:root {
--apex-bg: #050505;
--apex-surface: #080B0D;
--apex-card: #101114;
--apex-panel: #151519;
--apex-border: #242428;

--apex-primary-red: #9D0F18;
--apex-accent-red: #FF4D4D;
--apex-success: #2E6A4F;
--apex-warning: #C49A3A;
--apex-info: #3A5A8C;

--apex-text-primary: #E8E8E8;
--apex-text-secondary: #8A8A8A;
--apex-muted: #5F5F5F;

--apex-radius: 14px;
--apex-radius-lg: 20px;
--apex-shadow: 0 18px 60px rgba(0,0,0,0.45);
}

Use existing AUKIY tokens if already present. Do not duplicate unnecessarily if tokens already exist.

---

TYPOGRAPHY

Use safe font fallback only:

"Space Grotesk", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

For BY AUKIY / badges:

"JetBrains Mono", "SFMono-Regular", Consolas, monospace

Do NOT import external fonts from CDN.

---

VISUAL PATCH AREAS

Restyle only where needed:

1. Header
2. Brand icon container
3. Product name
4. BY AUKIY sub-brand
5. AUKIY LOCAL MODE badge
6. Top safety / human approval banner if needed to match brand
7. Button color polish only if already in style.css
8. Tabs/badges polish only if already in style.css

Do not change layout logic.

Do not change button behavior.

Do not remove labels.

---

EXPECTED RESULT

The dashboard should feel like:

ApexProspect
BY AUKIY

Not:

DealSense Prospects Operator

DealSense can remain as internal/company context, but visible product/platform name must be ApexProspect.

---

IMPLEMENTATION STEPS

1. Open public/index.html
2. Replace browser title
3. Replace header h1/product name
4. Add BY AUKIY sub-brand line
5. Add brand icon wrapper with image fallback
6. Open public/style.css
7. Add/adjust styles for:

   * .brand-wrap or equivalent
   * .brand-mark
   * .brand-title
   * .brand-subtitle
   * .badge
   * .app-header
8. Create public/assets/ folder if needed
9. Do not modify public/app.js unless brand text exists there

---

REPORT AFTER PATCH

Return:

1. Files changed
2. Browser title changed to ApexProspect by AUKIY: yes/no
3. Header product name changed to ApexProspect: yes/no
4. BY AUKIY visible: yes/no
5. AUKIY LOCAL MODE badge preserved: yes/no
6. Brand icon support added: yes/no
7. public/assets folder created: yes/no
8. Prospect names untouched: yes/no
9. data/leads.json untouched: yes/no
10. server.js untouched: yes/no
11. public/app.js untouched or explain why changed
12. WhatsApp/approval flow unchanged: yes/no
13. Auto-send not added: yes/no

STOP and wait for human approval.

Print:

=== PHASE 2 BRAND PATCH COMPLETE — WAITING FOR HUMAN APPROVAL ===
