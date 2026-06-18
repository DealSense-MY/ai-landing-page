You are Claude Code CLI acting as MVP Builder for DealSense Semi-Auto Outreach Approval System.

MISSION:
Build a small local semi-auto approval system for Aliff’s Landing Page Engine / Client Getter workflow.

This is NOT a big SaaS.
This is NOT full automation.
This is a small MVP to help Aliff send outreach faster with human approval.

BUSINESS CONTEXT:
Project: DealSense Landing Page Engine / Customer Acquisition System
Goal: Close RM350 local business landing page clients fast.
Offer: Page Booking WhatsApp / Mini Website Booking WhatsApp
Flow: Lead → Preview → DM Draft → Human Approve/Edit → Send/Open → Track Status → Follow-up

IMPORTANT:
Human approval is mandatory before any message is sent.
Do not contact any business automatically without approval.
Do not use unofficial WhatsApp automation.
Do not use spam tools.
Do not send Facebook/Instagram DM automatically.
Do not overbuild.
Do not require Anthropic API for MVP.
Do not touch Railway or Cloudflare.
Do not delete old folders.

CANONICAL PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine

BUILD LOCATION:
Create this folder:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach

MVP NAME:
DealSense Approval Sender Lite

OBJECTIVE:
Create a local browser-based dashboard that lets Aliff:

1. View lead/prospect details
2. View generated DM message
3. View preview file path / screenshot path
4. Click YES / NO / EDIT
5. If YES: open WhatsApp wa.me link or copy message for FB/IG
6. If EDIT: allow editing message, then click OK to open/send flow
7. If NO: mark rejected and generate a new CTA/task suggestion
8. Track lead status in a local JSON file

CORE RULE:
The system must never silently send messages.
It may open WhatsApp Web / wa.me with prefilled message after Aliff clicks YES or OK.
For Facebook/Instagram, it should copy the approved message to clipboard and open the profile/page URL if available.
Final send button inside WhatsApp/FB/IG remains under Aliff’s control.

FILES TO CREATE:

1. package.json
2. server.js
3. public/index.html
4. public/app.js
5. public/style.css
6. data/leads.json
7. data/outreach-log.json
8. README.md

TECH:

* Node.js
* Express
* Localhost only
* File-based JSON storage
* No database
* No API key required
* Simple clean UI
* Mobile-friendly enough, but desktop first is okay

DEFAULT PORT:
3777

NPM SCRIPTS:

* npm start

DASHBOARD FEATURES:

A. Lead Card
Show:

* Business name
* Location
* Niche
* Platform
* Contact method
* WhatsApp number if known
* Facebook/Instagram URL if known
* Weakness identified
* Offer angle
* Preview file path
* Screenshot path
* Current status

B. DM Draft Panel
Show editable message textarea.

Default DM for Zira:
Hi Zira Beauty Spa, saya Aliff.

Saya ada buat satu preview ringkas untuk Zira — page booking WhatsApp yang susun servis, pakej, info utama dan button WhatsApp dalam satu page.

Saya perasan sekarang customer mungkin perlu scroll post untuk cari info/pakej. Jadi saya cuba susun jadi satu page yang lebih mudah untuk customer tengok sebelum tanya slot.

Ini cuma preview, belum publish public.

Boleh saya tunjuk screenshot preview?

C. Buttons

1. YES — Approve
   Action:

* Save status as APPROVED_TO_SEND
* Save approved message into outreach-log.json
* If WhatsApp number exists, open wa.me link with encoded message
* If WhatsApp number unknown but platform URL exists, copy message to clipboard and open platform URL
* If no contact exists, show warning: CONTACT UNKNOWN — HUMAN INPUT REQUIRED

2. EDIT
   Action:

* Enable textarea editing if not already enabled
* Show OK button

3. OK AFTER EDIT
   Action:

* Save edited message
* Save status as APPROVED_EDITED_TO_SEND
* Same open/copy behavior as YES

4. NO
   Action:

* Save status as REJECTED_NEEDS_REWORK
* Show new suggested action:
  “Regenerate DM angle or choose next lead.”
* Do not send/open anything

5. MARK REPLIED
   Action:

* Save status as REPLIED
* Show box for Aliff to paste reply
* Save reply into outreach-log.json

6. FOLLOW-UP DRAFT
   Action:
   Generate simple follow-up draft locally from template:
   “Hi, saya follow up saja tentang preview page booking WhatsApp yang saya buat untuk [business]. Kalau owner nak tengok, saya boleh share screenshot dulu.”

D. Status Tracking
Use simple statuses:

* NEW
* PREVIEW_READY
* APPROVED_TO_SEND
* APPROVED_EDITED_TO_SEND
* SENT_MANUAL_CONFIRMATION_NEEDED
* REPLIED
* FOLLOW_UP_NEEDED
* REJECTED_NEEDS_REWORK
* CLOSED_WON
* CLOSED_LOST

E. Data
Create initial lead:
{
"id": "zira-beauty-spa-ipoh",
"businessName": "Zira Beauty Spa",
"location": "Ipoh",
"niche": "Beauty Spa / Facial",
"platform": "UNKNOWN",
"contactMethod": "UNKNOWN",
"whatsappNumber": "",
"profileUrl": "",
"weakness": "Promo/pakej ada dalam post, tapi tiada page booking jelas",
"offerAngle": "Page Booking WhatsApp / Mini Website Booking WhatsApp RM350",
"previewPath": "C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\DEMOS\zira-beauty-spa-ipoh\zira-beauty-spa-ipoh-preview.html",
"screenshotPath": "",
"status": "PREVIEW_READY"
}

F. Local Safety Banner
At top of dashboard show:
“HUMAN APPROVAL REQUIRED — this tool only prepares and opens messages. It does not silently send.”

G. README
Explain:

* How to install
* How to run
* Local URL
* How YES/NO/EDIT flow works
* What the tool does not do
* How to add new leads manually in leads.json

PHASES:

PHASE 1 — Inspect current folder
Check if tools folder exists.
Do not modify unrelated files.

PHASE 2 — Build MVP files
Create the semi-auto outreach tool.

PHASE 3 — Test locally
Run basic syntax check if possible.
Do not run npm install unless needed.
If dependencies missing, tell Aliff:
“Run npm install inside tools/semi-auto-outreach.”

PHASE 4 — Output report
Report:

* Files created
* How to run
* Localhost URL
* What works
* What still requires human action
* Next execution step for Zira

OUTPUT RULES:
Be direct.
No long architecture.
No SaaS talk.
No deleting.
No migration.
No client contact.
Prioritize execution speed and RM350 close.
