You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Patch the existing prospect operator UI branding from DealSense Prospects Operator to ApexProspect by AUKIY.

This is a BRAND/UI PATCH ONLY.

Do not repair workflow bugs in this patch.
Do not change business logic.
Do not change data model.
Do not change approval flow.
Do not change WhatsApp flow.
Do not add auto-send.
Do not modify lead records.

---

BRAND DIRECTION

New product name:

ApexProspect

Sub-brand:

BY AUKIY

Positioning:

Prospect smarter.
Outreach better.
Close more.

Style:

* premium operator cockpit
* matte black
* deep graphite
* AUKIY red / crimson
* clean professional UI
* serious, quiet authority
* no cheap SaaS colors
* no neon
* no playful look

---

BRAND COLORS

Use these tokens in CSS if not already present:

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

---

TYPOGRAPHY

Use system-safe fallback:

font-family:
"Space Grotesk", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

For data labels / small badges:

"JetBrains Mono", "SFMono-Regular", Consolas, monospace;

Do not import external fonts from CDN.
Use font-family fallback only.

---

HEADER BRAND PATCH

Current header likely shows:

DealSense Prospects Operator
AUKIY LOCAL MODE

Replace visible product branding with:

ApexProspect
BY AUKIY

Keep local mode badge, but rename:

AUKIY LOCAL MODE

Header layout should be:

[Icon] ApexProspect
BY AUKIY

Right side:

* Operation ON
* Agent Run
* Add Lead
* CSV
* JSON
* Logs

---

LOGO / ICON

Add support for an app icon image:

Path:

public/assets/apexprospect-icon.png

If file exists:
Use it in header.

If file does not exist:
Fallback to a CSS/text mark:

A red abstract “A” mark in a square icon container.

Do not break UI if image missing.

Suggested HTML/class:

<div class="brand-mark">
  <img src="/assets/apexprospect-icon.png" alt="ApexProspect" onerror="this.style.display='none'; this.parentElement.classList.add('brand-mark-fallback');">
</div>

If using this approach, ensure fallback is visually acceptable.

---

HEADER STYLE

The header should feel like the brand board:

* matte black background
* subtle bottom border
* red accent badge
* compact premium spacing

Product name:

* large enough to read
* white / off-white
* strong weight

BY AUKIY:

* red
* small uppercase
* letter spacing
* mono or spaced style

Example visual:

ApexProspect
BY AUKIY

---

TOP WARNING BAR

Keep the human approval warning copy.

Restyle to match AUKIY:

* dark crimson background, not bright red
* subtle red border
* compact height
* uppercase small text
* white/off-white text

Do not remove warning.

---

BUTTON STYLE UPDATE

Keep existing button functions.

Only update styling.

Primary action:

* red/crimson gradient
* white text
* no bright green

Success / Closed Won:

* muted green
* not neon

Warning:

* muted gold

Info:

* muted blue

Neutral:

* graphite

Do not change button labels in this patch unless they are purely brand labels.

---

TABS / BADGES

Style tabs like ApexProspect brand board:

* pill shape
* black/graphite
* red active state
* muted count badge
* clean uppercase mono labels

Do not change tab logic.

---

TABLE STYLE

Table should feel like premium operator cockpit:

* dark graphite header
* subtle borders
* compact rows
* warm white text
* muted labels
* status badges clear

Do not change table data or logic.

---

MODAL STYLE

Update modal visual only:

* cleaner header
* brand-consistent close button
* status badge visible
* graphite panels
* crimson focus border
* no bright random colors

Do not change modal field binding or modal logic in this patch.

---

FILES TO INSPECT

Inspect first:

public/index.html
public/style.css
public/app.js

Possible file changes:

public/index.html
public/style.css
public/app.js only if header markup is generated from JS

Optional:
Create folder:
public/assets/

Do not modify server.js unless static assets are not served, but Express likely already serves public.

---

PHASE CONTROL

PHASE 1 — AUDIT ONLY

Do not modify files.

Report:

1. Where the product name is rendered
2. Where the header markup lives
3. Where current color tokens/styles live
4. Whether public/assets exists
5. Exact files to patch
6. Whether app.js generates any header/buttons dynamically
7. Confirmation no files modified

STOP.

---

PHASE 2 — BRAND PATCH

After approval only.

Patch:

1. Product name to ApexProspect
2. BY AUKIY sub-brand
3. Header icon support
4. AUKIY / ApexProspect CSS tokens
5. Warning bar style
6. Button styles
7. Tabs/badges styles
8. Table style
9. Modal visual style

Do not change workflow logic.

STOP and report:

* files changed
* product name updated
* icon support added
* no logic changed
* no approval/WA flow changed
* no auto-send added

---

PHASE 3 — VISUAL VERIFICATION

Verify:

1. Header shows ApexProspect
2. BY AUKIY visible
3. AUKIY LOCAL MODE badge still visible
4. Warning bar still visible
5. Buttons still work visually
6. Table still readable
7. Modal still opens
8. No logic changed
9. No auto-send added
10. Dashboard loads at localhost:3777

STOP.

---

IMPORTANT:
This patch is branding only.

Do not fix:

* Next Actions bugs
* Modal data bugs
* Import bugs
* Closed Won lock bugs
* ResponseOps bugs
* Phase 7 logic

Those will be handled in later patches.
