APPROVED — Proceed to Phase B only.

Task:
Implement DM Draft Clarity Patch.

Scope:
Patch only the Prospect Modal DM Draft section, labels, helper text, fallback field mapping, preview fallback, and locked note clarity.

Allowed files:

* public/app.js
* public/style.css if needed for DM section/helper styling
* public/index.html only if required

Do NOT modify:

* server.js
* data/leads.json
* import/export logic
* AI DM generation
* LandingEngine bridge
* Next Actions logic
* approval/WhatsApp open behavior
* auto-send rules

Required fixes:

1. Rename DM section label:
   From:
   DM DRAFT — Customer POV Softselling

To:
FIRST OUTREACH DM DRAFT

2. Add helper text:
   "Ini ialah mesej WhatsApp pertama untuk prospect ini. Semak, edit jika perlu, kemudian approve untuk buka WhatsApp. Sistem tidak hantar mesej secara automatik."

3. Add flow hint:
   "Flow: Review → Edit/Remake → Approve → WhatsApp opens → Human presses Send"

4. Add DM fallback chain:
   lead.defaultDm
   lead.lastApprovedMessage
   lead.approvedMessage
   lead.dmDraft
   lead.outreachMessage
   lead.message
   ""

5. If DM is blank, show clear empty-state/placeholder:
   "DM draft belum tersedia. Gunakan Remake CTA atau edit manual sebelum approve."

6. Rename APPROVE button to:
   APPROVE & OPEN WHATSAPP

7. Rename REJECT button to:
   REMAKE CTA

8. Add helper note:
   "Remake CTA = buat semula ayat outreach. Ini bukan reject prospect."

9. Add approve helper:
   "WhatsApp akan dibuka dengan mesej siap isi. Anda masih perlu tekan Send sendiri."

10. Add Follow-Up Draft helper:
    "Follow-Up Draft digunakan selepas prospect sudah contacted tetapi belum reply."

11. Add Mark Replied helper:
    "Gunakan ini hanya bila prospect sudah membalas mesej."

12. Add status-based action hint:
    NEW:
    "Next step: Generate preview or prepare first outreach DM."

PREVIEW_READY:
"Next step: Review DM and approve outreach."

CONTACTED:
"Next step: Wait for reply or prepare follow-up."

REPLIED:
"Next step: Use ResponseOps / close path."

CLOSED_WON / CLOSED_LOST:
"Lead locked. View only."

13. Preview fallback chain:
    lead.previewUrl
    lead.previewPath
    lead.previewFile
    lead.preview
    ""

14. Locked note should explicitly say:
    "Lead locked — no outreach action available."

15. Preserve security:

* use textarea.value for DM
* use textContent for display text
* no unsafe innerHTML with raw lead data
* safe preview href assignment

16. Preserve behavior:

* Approve still opens WhatsApp only
* no auto-send
* human still manually presses Send
* lock guard remains functional

After implementation, STOP and report:

1. Files changed
2. Section renamed: yes/no
3. Helper text added: yes/no
4. DM fallback chain added: yes/no
5. Empty state added: yes/no
6. APPROVE renamed: yes/no
7. REJECT renamed to REMAKE CTA: yes/no
8. Preview fallback chain added: yes/no
9. Locked note improved: yes/no
10. Approval/WhatsApp behavior unchanged: yes/no
11. Auto-send not added: yes/no

STOP.
