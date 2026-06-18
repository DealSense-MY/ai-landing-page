You are Claude Code CLI.

PROJECT:
C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\

TASK:
Master Audit — ApexProspect Dashboard.

AUDIT ONLY. Do NOT modify any files. Do NOT fix anything yet.
Read everything. Report everything. Stop.

---

OBJECTIVE

Find every known and hidden bug in the current dashboard.
We will fix everything in one clean sprint after this audit.
Do not patch anything now.

---

STEP 1 — READ ALL FILES

Read these files fully:

* tools/semi-auto-outreach/public/app.js
* tools/semi-auto-outreach/public/index.html
* tools/semi-auto-outreach/public/style.css
* tools/semi-auto-outreach/server.js
* tools/semi-auto-outreach/data/leads.json
* tools/semi-auto-outreach/modules/previewBuilder.js (if exists)
* tools/semi-auto-outreach/modules/postbackOperator.js (if exists)
* tools/semi-auto-outreach/modules/importValidator.js (if exists)

Report for each file:
- Exists: YES / NO
- Line count
- Last known function / purpose

---

STEP 2 — LEADS DATA AUDIT

Read data/leads.json.

For each lead record, report:

| Field | Value |
|-------|-------|
| id | |
| businessName | |
| prospectStatus | |
| status | |
| dealStatus | |
| locked | |
| lockReason | |
| defaultDm | empty or has content |
| previewPath | empty or has content |
| previewUrl | empty or has content |
| whatsapp | empty or has content |

Flag leads where:
- prospectStatus and status fields conflict
- locked field missing
- defaultDm is empty
- whatsapp number missing

---

STEP 3 — MODAL BUG AUDIT

Check app.js for the prospect modal population function
(likely openCardModal, populateLeadCard, renderModal or similar).

Report:

1. Function name that opens/populates the modal
2. What field is read for the DM textarea
3. Whether DM fallback chain exists:
   lead.defaultDm → lead.lastApprovedMessage → lead.approvedMessage
   → lead.dmDraft → lead.outreachMessage → lead.message → ""
4. Whether DM shows empty state if all fields empty
5. What field is read for prospect/business name in modal title
6. Whether getLeadStatus() helper exists
7. Whether getNextAction() helper exists
8. Whether isLeadClosedOrLocked() exists and what fields it checks
9. Whether applyLockedUI() exists
10. Whether openCardModal() calls applyLockedUI() after rendering
11. Whether locked buttons are disabled visually AND functionally
12. Whether APPROVE button still shows red primary on locked leads
13. Whether colored dot exists near close button — explained or not

---

STEP 4 — LOCK BUG AUDIT

Check if a lead is correctly detected as locked when ANY of these is true:

lead.locked === true
lead.prospectStatus === "CLOSED_WON" or "CLOSED_LOST"
lead.status === "CLOSED_WON" or "CLOSED_LOST"
lead.dealStatus === "CLOSED_WON" or "CLOSED_LOST"
lead.pipelineStatus === "CLOSED_WON" or "CLOSED_LOST"
lead.lockReason === "CLOSED_WON" or "CLOSED_LOST"

Report:
- Current lock detection logic (exact code)
- Fields currently checked
- Fields NOT checked that should be
- Whether click handlers use lock detection
- Whether CSS-only is relied on for disabling buttons

---

STEP 5 — WHATSAPP / APPROVAL FLOW AUDIT

Find openContact() or equivalent WA open function.

Report:
- Function name
- How WA number is read
- Whether digits-only sanitization exists: .replace(/[^0-9]/g, '')
- Whether auto-send exists (flag if yes)
- Whether human approval gate is intact
- Whether any patch has accidentally broken this flow

---

STEP 6 — BRANDING AUDIT

Check index.html and style.css.

Report:
1. Current browser <title> text
2. Current header h1 text
3. Whether BY AUKIY sub-brand line is visible
4. Whether AUKIY LOCAL MODE badge is present
5. Whether brand icon / fallback CSS mark is present
6. Whether --apex-* CSS tokens are defined
7. Whether old --accent-crimson tokens conflict with new --apex tokens
8. Whether any DealSense branding remains visible

---

STEP 7 — SMART PANEL / WORKFLOW ENGINE AUDIT

Check if Phase 7 Workflow Engine UI was implemented.

Report:
1. Whether Smart Action Panel exists in DOM/JS
2. Whether Daily Tracker UI exists
3. Whether stale lead detection logic exists
4. Whether follow-up overdue detection exists
5. Whether Smart Panel click uses openCardModal(id) — not scrollIntoView
6. Whether any Phase 7 logic breaks existing modal or card behavior

---

STEP 8 — PIPELINE / TAB AUDIT

Report:
1. Whether pipeline tabs exist (ALL / NEW / PREVIEW_READY / CONTACTED etc.)
2. Whether tab filter works correctly
3. Whether status counters update correctly
4. Whether Zira appears in correct tab

---

STEP 9 — PREVIEW LINK AUDIT

Report:
1. Whether preview link appears in modal
2. What field is used: previewUrl / previewPath / previewFile / preview
3. Whether fallback chain exists
4. Whether preview open button works
5. Whether copy preview link works
6. Whether Generate Landing Page button exists and is connected

---

STEP 10 — SERVER / API AUDIT

Read server.js.

Report:
1. Active port
2. PATCH /api/leads/:id — what fields are accepted
3. Whether previewClicked, previewClickCount, lastPreviewClickedAt are accepted
4. Whether race condition exists (read → modify → write without lock)
5. Whether any endpoint auto-sends anything
6. Whether static file serving is correct for public/ folder

---

STEP 11 — FULL BUG LIST

After all steps, compile a complete bug list:

Format each bug as:

BUG-[N]
Severity: CRITICAL / HIGH / MEDIUM / LOW
Location: [file] → [function/line]
Problem: [what is wrong]
Impact: [what breaks for operator]
Fix needed: [what needs to change]

---

STEP 12 — RECOMMENDED FIX SPRINT ORDER

After bug list, recommend fix order:

Group bugs into:

GROUP A — Fix first (CRITICAL, blocks operator)
GROUP B — Fix second (HIGH, causes confusion)
GROUP C — Fix third (MEDIUM, polish)
GROUP D — Skip for now (LOW, cosmetic)

---

CONFIRM AT END

State clearly:
- Total files read
- Total leads audited
- Total bugs found
- NO FILES MODIFIED

STOP. Wait for Aliff approval before any fixes.
