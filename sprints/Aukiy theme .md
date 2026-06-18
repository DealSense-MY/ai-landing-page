You are Claude Code.

PROJECT:
tools/semi-auto-outreach/

TASK:
Restyle the semi-auto outreach dashboard into AUKIY Premium Operator Theme.

Goal:
The dashboard must feel like a premium founder/operator cockpit, not a generic dev tool.

Brand style:
AUKIY / DealSense operator system.

Visual direction:

* deep matte black
* graphite panels
* dark crimson accent
* quiet authority
* premium software cockpit
* disciplined layout
* calm, serious, professional
* high trust
* no cheap SaaS colors

---

DO NOT MODIFY:

* approval flow
* WhatsApp flow
* DM copy
* server logic
* lead data
* decision logic
* auto-send rules

This is a visual/theme patch only.

---

CURRENT PROBLEM

Current dashboard uses:

* bright red alert bar
* green approve button
* orange edit button
* blue follow-up button
* generic dark dashboard style

This does not match AUKIY product identity.

Replace it with a premium restrained theme.

---

AUKIY THEME TOKENS

In CSS, define root variables:

:root {
--bg-main: #050505;
--bg-elevated: #0B0B0D;
--bg-panel: #111114;
--bg-card: #151519;
--bg-soft: #1A1A1F;

--border-subtle: rgba(255,255,255,0.08);
--border-strong: rgba(255,255,255,0.14);

--text-main: #F4F1EA;
--text-muted: #A8A29A;
--text-soft: #78716C;

--accent-crimson: #7A1018;
--accent-crimson-bright: #A31621;
--accent-crimson-soft: rgba(122,16,24,0.22);

--warning-bg: rgba(122,16,24,0.18);
--warning-border: rgba(163,22,33,0.45);

--success-muted: #2F6F4E;
--danger-muted: #7A1018;

--radius-card: 18px;
--radius-button: 14px;

--shadow-premium: 0 18px 60px rgba(0,0,0,0.45);
}

---

BODY STYLE

Use:

* background: radial subtle dark gradient or solid matte black
* text color: warm off-white
* font: system sans-serif
* no bright colors
* no playful UI

Example:

body {
background:
radial-gradient(circle at top, rgba(122,16,24,0.18), transparent 34%),
#050505;
color: var(--text-main);
}

---

TOP WARNING BAR

Current bright red bar is too loud.

Replace with premium warning strip:

Background:
rgba(122,16,24,0.22)

Border:
1px solid rgba(163,22,33,0.45)

Text:
warm white

Copy may remain the same:
“HUMAN APPROVAL REQUIRED — This tool only prepares and opens messages. It does NOT silently send anything.”

But styling must feel premium, not alarm app.

---

HEADER

Brand header should show:

DealSense Operator Lite

Badge:
AUKIY LOCAL MODE

Style:

* black / graphite
* crimson border
* small uppercase label
* premium spacing

---

LEAD CARD

Restyle lead card:

.card {
background: linear-gradient(180deg, #151519, #101014);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-card);
box-shadow: var(--shadow-premium);
}

Use subtle crimson highlight only for important states.

---

STATUS BADGE

Current green APPROVED_TO_SEND looks cheap.

Replace with muted premium badge.

For APPROVED_TO_SEND:

* background: rgba(47,111,78,0.16)
* border: 1px solid rgba(47,111,78,0.45)
* color: #9FE0BE

But do not use bright green.

For PREVIEW_READY:

* background: rgba(122,16,24,0.18)
* border: crimson
* color: warm white

---

BUTTONS

Replace button colors.

Primary button:
APPROVE & OPEN WHATSAPP

Style:

* dark crimson background
* subtle crimson border
* warm white text
* hover: slightly brighter crimson
* no bright green

Example:

.btn-primary {
background: linear-gradient(180deg, #A31621, #7A1018);
color: #F4F1EA;
border: 1px solid rgba(255,255,255,0.12);
}

Edit button:

* graphite background
* muted amber border only if needed
* no bright orange

Redo / No button:

* dark graphite with crimson border
* no bright red

Follow-up / Mark Replied:

* graphite / muted slate
* no bright blue

---

DM DRAFT AREA

The DM area should feel like a premium operator console.

Textarea:

* background: #0B0B0D
* border: 1px solid var(--border-subtle)
* focus border: crimson
* text: warm white
* border radius 14px
* min-height 220px

DM helper text:

* muted stone
* uppercase small label
* letter spacing slight

Character count:

* muted
* not bright blue

---

RIGHT OPERATOR MEMORY PANEL

If right panel exists or is added later, style it with same theme:

* graphite panel
* crimson section dividers
* small uppercase labels
* warm white text
* muted notes

This should feel like:
operator cockpit / decision system / premium internal tool.

---

VISUAL RULES

Avoid:

* bright green
* bright orange
* bright blue
* neon
* cyberpunk glow
* generic Bootstrap look
* playful color palette
* heavy shadows with random colors

Use:

* matte black
* graphite
* dark crimson
* warm white
* muted text
* subtle border
* disciplined spacing

---

FILES TO PATCH

Inspect and patch only:

tools/semi-auto-outreach/public/style.css
tools/semi-auto-outreach/public/index.html only if class names are needed
tools/semi-auto-outreach/public/app.js only if button labels/classes need adjustment

Prefer CSS-only patch if possible.

---

PHASE CONTROL

PHASE 1:
Audit current CSS/classes.
Do not modify files.
Report exact selectors/classes to patch.
STOP.

PHASE 2:
Apply AUKIY theme patch.
Report files changed.
STOP.

PHASE 3:
Visual test report:

* warning bar premium
* approve button no longer bright green
* edit button no longer bright orange
* card looks premium
* DM area readable
* mobile still usable
* no logic changed

STOP.

---

IMPORTANT:
Do not change business logic.
Do not change DM copy.
Do not change approval behavior.
Do not add auto-send.
