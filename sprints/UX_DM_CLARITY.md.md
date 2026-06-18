You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Patch the Prospect Modal DM Draft section so the operator clearly understands its function and can use it for first outreach.

This is a UI/UX clarity patch only.

Do NOT add AI DM generation.
Do NOT change WhatsApp sending logic.
Do NOT auto-send.
Do NOT change server logic unless absolutely required.
Do NOT change lead data model unless required for display fallback.
Do NOT refactor the whole app.

---

PROBLEM

The current DM Draft section is confusing.

The operator does not clearly understand:

1. What DM Draft is for
2. Whether it is the first outreach message
3. Whether it will auto-send
4. Whether the message can be edited
5. What happens when Approve is clicked
6. What “Remake / Reject” means
7. What Follow-Up Draft is for
8. Why DM Draft must not be empty

---

GOAL

Make the DM Draft section self-explanatory inside the prospect modal.

The operator should understand immediately:

DM Draft = first WhatsApp outreach message prepared for this prospect.

Flow:

Review message
↓
Edit if needed
↓
Remake if message is weak
↓
Approve & Open WhatsApp
↓
Human manually presses Send

---

REQUIRED UI COPY

Rename the section heading to:

FIRST OUTREACH DM DRAFT

Add helper text under heading:

"Ini ialah mesej WhatsApp pertama untuk prospect ini. Semak, edit jika perlu, kemudian approve untuk buka WhatsApp. Sistem tidak hantar mesej secara automatik."

Add small pipeline note:

"Flow: Review → Edit/Remake → Approve → WhatsApp opens → Human presses Send"

---

DM TEXTAREA

Ensure the DM textarea:

* is visible
* is not too small
* minimum height: 220px
* shows the actual DM draft if data exists
* uses textarea.value
* does not use unsafe innerHTML

If no DM draft exists, show placeholder:

"DM draft belum tersedia. Gunakan Remake CTA atau edit manual sebelum approve."

---

DM FIELD FALLBACK

When populating the modal, use this fallback chain:

lead.defaultDm
lead.lastApprovedMessage
lead.approvedMessage
lead.dmDraft
lead.outreachMessage
lead.message
""

If all are empty, do not silently show blank.
Show clear empty state message.

---

BUTTON LABELS

Update confusing labels:

Current "REJECT" or similar wording should become:

REMAKE CTA

or:

REDO MESSAGE

Preferred label:

REMAKE CTA

Add helper tooltip/text:

"Remake CTA = buat semula ayat outreach. Ini bukan reject prospect."

Approve button should clearly say:

APPROVE & OPEN WHATSAPP

Add helper text near button:

"WhatsApp akan dibuka dengan mesej siap isi. Anda masih perlu tekan Send sendiri."

Edit button should say:

EDIT MANUALLY

Follow-up button should say:

FOLLOW-UP DRAFT

Add helper text:

"Follow-Up Draft digunakan selepas prospect sudah contacted tetapi belum reply."

Mark Replied button should say:

MARK REPLIED

Add helper text:

"Gunakan ini hanya bila prospect sudah membalas mesej."

---

STATUS-BASED BUTTON CLARITY

Show different action hint based on status:

If status/prospectStatus is NEW:
"Next step: Generate preview or prepare first outreach DM."

If PREVIEW_READY:
"Next step: Review DM and approve outreach."

If CONTACTED:
"Next step: Wait for reply or prepare follow-up."

If REPLIED:
"Next step: Use ResponseOps / close path."

If CLOSED_WON or CLOSED_LOST:
"Lead locked. View only."

---

LOCKED LEADS

If lead is CLOSED_WON or CLOSED_LOST:

* DM textarea should be read-only
* APPROVE disabled
* EDIT disabled
* REMAKE CTA disabled
* FOLLOW-UP DRAFT disabled
* MARK REPLIED disabled
* show lock note:

"Lead locked — no outreach action available."

Do not rely only on CSS.
Also guard click handlers if needed.

---

PREVIEW LINK CONNECTION

Inside the DM Draft section or just above it, show:

PREVIEW LANDING PAGE

If preview exists:

* show "Preview ready"
* show Open Preview button
* show Copy Preview Link button

If no preview exists:

* show "No preview yet"
* show Generate Landing Page button if existing generator function exists
* if generator function does not exist, show disabled button with note:
  "Generate function not connected yet."

Do not remove existing preview data.

Use fallback chain:

lead.previewUrl
lead.previewPath
lead.previewFile
lead.preview
""

---

SECURITY

Preserve XSS safety.

Use:

* textContent for display
* textarea.value for DM draft
* safe href assignment for preview links
* no unsafe innerHTML with raw lead data

---

FILES TO INSPECT

* public/app.js
* public/index.html
* public/style.css
* data/leads.json only for field confirmation

---

PHASE CONTROL

PHASE A — AUDIT ONLY

Do not modify files.

Report:

1. Current DM textarea ID/selector
2. Current function that populates DM draft
3. Current field name being read
4. Whether fallback chain exists
5. Current button labels
6. Current preview link field mapping
7. Whether CLOSED_WON lock guards apply to DM buttons
8. Exact files/functions to patch
9. Confirmation no files modified

STOP.

---

PHASE B — IMPLEMENT DM DRAFT CLARITY PATCH

Patch only the DM Draft section and related labels/helpers.

After patch, report:

1. Files changed
2. Section renamed to FIRST OUTREACH DM DRAFT: yes/no
3. Helper text added: yes/no
4. Textarea min-height 220px: yes/no
5. DM fallback chain added: yes/no
6. Empty state added: yes/no
7. REJECT renamed to REMAKE CTA: yes/no
8. Approve helper added: yes/no
9. Follow-Up / Mark Replied helpers added: yes/no
10. Locked lead DM buttons disabled: yes/no
11. Preview link display added/restored: yes/no
12. Approval/WhatsApp flow unchanged: yes/no
13. Auto-send not added: yes/no

STOP.

---

PHASE C — TEST REPORT

Verify:

1. Zira modal shows DM draft
2. DM Draft section explains its function
3. Approve button clearly explains WhatsApp opens but does not auto-send
4. Remake CTA label is clear
5. Follow-Up Draft explanation is clear
6. Mark Replied explanation is clear
7. Preview link appears if available
8. Closed Won lead has locked DM/action state
9. Dashboard still loads at localhost:3777
10. No auto-send added
11. No approval/WhatsApp regression

STOP and print:

=== DM DRAFT CLARITY PATCH COMPLETE — WAITING FOR HUMAN APPROVAL ===
