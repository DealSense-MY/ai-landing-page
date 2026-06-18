# APEXPROSPECT_MASTER_REVIEW_REPAIR_LOCKDOWN.md

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
Perform a disciplined master review, repair, and lockdown of ApexProspect UI/functionality.

Aliff is tired of repeated patches causing regressions.
Your job is to stop the patch-chaos.

This is NOT a redesign.
This is NOT a rewrite.
This is NOT a SaaS build.
This is NOT an AI provider implementation.
This is a controlled audit → lock → repair → verify → final lockdown process.

---

# MAIN OBJECTIVE

Make ApexProspect usable as Aliff's private operator system for real prospect outreach.

Core workflow:

1. Add or Import Prospect
2. Review Prospect
3. Generate / Attach Preview
4. Prepare DM Draft
5. Approve & Open WhatsApp
6. Aliff manually presses Send
7. Confirm Sent
8. Track Reply
9. Follow Up / Closed Won / Closed Lost
10. Payment / Delivery / Amendment

The app must be clear enough that an operator knows where to start and what to do next.

---

# NON-NEGOTIABLE RULES

1. Do not rewrite the app.
2. Do not refactor globally.
3. Do not redesign from scratch.
4. Do not add SaaS features.
5. Do not add login.
6. Do not add billing.
7. Do not add cloud database.
8. Do not add AI provider.
9. Do not ask for API keys.
10. Do not deploy.
11. Do not touch Nexus cf-version.
12. No auto-send.
13. No hidden WhatsApp sending.
14. No Baileys active sending.
15. Approve only opens WhatsApp with a prefilled message.
16. Aliff manually presses Send.
17. Confirm Sent only after manual send.
18. Locked records are view-only except events/amendments.
19. Corrections after lock must be amendments.
20. App must run with no API key.
21. English-only visible UI.
22. Do not re-edit locked working sections unless a test proves they are broken.

---

# REQUIRED FILES TO INSPECT FIRST

Before any edit, inspect:

- tools/semi-auto-outreach/server.js
- tools/semi-auto-outreach/public/index.html
- tools/semi-auto-outreach/public/app.js
- tools/semi-auto-outreach/public/style.css
- tools/semi-auto-outreach/package.json
- tools/semi-auto-outreach/data/leads.json
- tools/semi-auto-outreach/data/run-log.json
- tools/semi-auto-outreach/public/assets/ if present

If the path is different, locate the real app folder that runs localhost:3777.

Do not assume.
Do not work in `/mnt/user-data/outputs/`.
Do not create patch files instead of patching the real repo.

---

# REQUIRED OUTPUT FILES TO CREATE INSIDE THE PROJECT

Create these documentation files inside:

tools/semi-auto-outreach/

1. APEX_LOCKED_BASELINE.md
2. APEX_REPAIR_AUDIT.md
3. APEX_FINAL_REGRESSION_CHECKLIST.md

These files are documentation only.
They help prevent future re-editing of stable parts.

---

# PHASE 0 — CHECKPOINT / SAFETY BACKUP

Before edits:

1. Run:
   git status

2. If git is available:
   Create checkpoint commit if there are changes:
   - stage only existing current state if safe
   - commit message:
     `checkpoint: before apex master repair lockdown`

3. If git is not available:
   Create a backup copy of the app folder:
   `tools/semi-auto-outreach_BACKUP_before_master_repair`

4. Report checkpoint method used.

STOP if backup/checkpoint cannot be created.

---

# PHASE 1 — MASTER AUDIT ONLY

Do not edit during Phase 1.

Audit all visible and functional areas:

## A. Header / Brand

Check:
- AUKIY logo asset exists and displays.
- ApexProspect text visible.
- BY AUKIY visible.
- AUKIY LOCAL MODE visible.
- Header badges do not confuse automation state.
- No Malay copy.

## B. Safety Banner

Check:
- Human approval warning visible.
- States that system prepares/opens messages only.
- States no silent send.
- English-only.

## C. Start Flow / Operator Guidance

Check:
- Operator knows where to start.
- Add Lead visible.
- Import JSON visible.
- Next recommended prospect clear.
- Manual workflow guide exists or is needed.

## D. Pipeline Tabs

Check:
- ALL
- NEW
- NEEDS REVIEW
- APPROVED
- CONTACTED
- REPLIED
- FOLLOW-UP
- CLOSED WON
- CLOSED LOST

Check counts and visual style.

## E. Status Pills

Check:
- CLOSED_WON = green
- CLOSED_LOST = red
- NEW / OPEN = neutral
- REPLIED / CONTACTED / APPROVED = clear
- NO_REPLY = neutral

## F. Metrics Row

Check:
- readable
- aligned
- not cramped
- not floating strangely

Metrics:
- DM sent
- Outreach target
- Follow-ups target
- Previews marked
- Replies
- Won
- Lost
- Total Paid Revenue
- Paid Deals
- Unpaid Active

## G. Next Actions

Check:
- Answers “what should I do now?”
- Shows prospect name
- Shows missing step
- Shows recommended action
- Has working Hide/Show

## H. Prospect Table

Check:
- Business name visible
- Location visible
- Prospect status visible
- Reply status visible
- Deal status visible
- Last action visible
- Score visible
- Row click opens correct modal

## I. Prospect Modal Header

Check:
- Business/contact identity visible at top-left.
- Business name visible.
- Contact person/nickname if available.
- WhatsApp number visible.
- Status visible.
- Locked status visible if locked.

## J. Preview / Screenshot / Landing Page Section

Check:
- Section not just plain labels.
- Open Preview button if preview exists.
- Open Screenshot button if screenshot exists.
- Generate Preview / Generate Landing Page button visible if supported.
- Clear empty state if preview not generated.
- No API required.

## K. DM Draft Section

Check:
- DM draft text visible/editable if unlocked.
- Empty draft warning if empty.
- Approve blocked/warns if draft empty.
- Helper text English-only.
- Approve & Open WhatsApp manual flow clear.

## L. Button Groups

Check:
- Outreach buttons grouped.
- Reply handling buttons grouped.
- Outcome buttons grouped.
- Record control buttons grouped.
- Only one primary next action appears visually dominant.

## M. Locked Record Behavior

Check:
- Locked banner visible.
- lockReason visible.
- lockedAt visible.
- edit/approve/payment mutation disabled or blocked.
- amendment remains available.
- server-side lock guards still present.

## N. Amendments

Check:
- Existing amendments display.
- Locked record has textarea + Add Amendment button.
- Add Amendment works.
- Does not unlock record.

## O. Payment & Revenue

Check:
- Section displays correctly.
- Mark paid is blocked for locked records.
- No broken empty box.

## P. Run Log

Check:
- Run log visible or expandable.
- Events display if present.
- Logs export/open works.

## Q. Add Lead

Check:
- Button opens form.
- Minimum fields exist.
- Save creates local lead.
- Lead appears in table.
- Lead appears in correct tab.
- No API required.

## R. Import JSON

Check:
- Panel opens.
- Paste JSON works.
- Browse file works if implemented.
- Sample JSON works.
- Validation summary appears.
- Imported lead appears.
- No API required.

## S. Export Buttons

Check:
- CSV works.
- JSON works.
- Logs works.
- Export includes events/locked/amendments if present.

## T. English-Only UI

Search all visible UI text for Malay or mixed copy.

No Malay text should remain.

---

# PHASE 1 OUTPUT

Create:

tools/semi-auto-outreach/APEX_REPAIR_AUDIT.md

Include:

1. Stable areas
2. Broken areas
3. Risk areas
4. Files likely involved
5. Recommended repair phases
6. Sections that must not be re-edited

Also print report in terminal/chat.

---

# PHASE 2 — LOCK STABLE AREAS

Based on Phase 1 audit, create:

tools/semi-auto-outreach/APEX_LOCKED_BASELINE.md

This file must list:

## LOCKED — DO NOT RE-EDIT WITHOUT REGRESSION PROOF

Example sections if they pass:

- Server-side lock guard PATCH /api/leads/:id
- Server-side mark-paid lock guard
- Event route unrestricted
- No auto-send doctrine
- WhatsApp openContact/manual send flow
- Explicit field assignment
- XSS escaped rendering
- Local JSON storage
- No-API runtime
- English-only copy if verified
- Logo header if verified
- Closed lost red pill if verified

For each locked item include:

- file/function/selector
- why it is locked
- test evidence
- what future patches must not change

Important:
If an area is not verified, do not lock it.
Mark as:
`UNLOCKED — NEEDS REPAIR`

---

# PHASE 3 — PRIORITY REPAIR PLAN

After audit and baseline lock, repair in this exact order:

## Repair Group 1 — Critical Operator Understanding

Fix:
- Start Here panel if missing.
- Manual workflow guide if missing.
- Header mode clarity.
- Next Actions clarity.
- Prospect modal Current Step / Next Action.

## Repair Group 2 — Prospect Modal Identity and Workflow

Fix:
- Business/contact name top-left.
- WhatsApp/contact visibility.
- Status/locked visibility.
- Button grouping by workflow.

## Repair Group 3 — Preview Section

Fix:
- Preview/Screenshot labels.
- Generate Preview / Open Preview / Open Screenshot button states.
- Empty state.
- Local-only, no API.

## Repair Group 4 — Locked Record UI + Amendments

Fix:
- Locked banner.
- Disabled blocked actions.
- Add amendment textarea/button.
- Existing amendment display.

## Repair Group 5 — Add/Import/Export Verification

Fix only if broken:
- Add Lead
- Import JSON
- CSV
- JSON
- Logs
- Show/Hide Next Actions

## Repair Group 6 — Visual Consistency

Fix only if broken:
- English-only copy
- CLOSED_LOST red pill
- AUKIY logo
- Metrics alignment
- Tabs alignment

Do not jump to visual polish before operator flow works.

---

# PHASE 4 — REPAIR EXECUTION RULES

For each repair group:

1. Inspect relevant code.
2. Make minimal edits.
3. Run/refresh localhost.
4. Test affected area.
5. Verify locked baseline items were not changed.
6. Update APEX_REPAIR_AUDIT.md with result.
7. Do not move to next group if current group breaks locked baseline.

Do not edit stable locked areas unless broken by test.

---

# PHASE 5 — REQUIRED IMPLEMENTATION DETAILS

## A. Start Here Panel

Add near top of dashboard:

Title:
Start Here

Subtitle:
Move one prospect from review to manual WhatsApp outreach.

Actions:
- Add Prospect
- Import Prospects
- Review Next Prospect
- Open Manual Workflow

Each action must work or clearly explain if unavailable.

## B. Manual Workflow Panel

Steps:
1. Add or import prospect
2. Review business details
3. Generate or attach landing page preview
4. Write or paste DM Draft
5. Click Approve & Open WhatsApp
6. Press Send manually in WhatsApp
7. Return and click Confirm Sent
8. Mark Replied when prospect responds
9. Follow up or close won/lost
10. Record payment/delivery/amendment

Safety note:
This system prepares and opens messages only. It never sends messages automatically.

## C. Header Mode

Replace confusing automation wording if needed.

Use:
- Operator Ready
- Manual Mode
- No Auto-Send

Do not imply automatic AI agent unless real safe implementation exists.

## D. Pipeline Legend

Add compact explanation:
- NEW: not reviewed yet
- NEEDS REVIEW: requires operator check
- APPROVED: DM approved but not sent
- CONTACTED: manually sent and confirmed
- REPLIED: prospect replied
- FOLLOW-UP: follow-up needed
- CLOSED WON: deal won and locked
- CLOSED LOST: deal lost and locked

## E. Prospect Modal Header

At top-left:
- businessName
- contactName/nickname if available
- WhatsApp
- location
- prospectStatus
- dealStatus
- locked badge if locked

Never hide business identity.

## F. Current Step / Next Action

Show in modal:
- Current Step
- Recommended Next Action
- Reason
- Safety note if WhatsApp involved

## G. Preview Section

Use title:
Landing Page Preview

Show:
- Preview status
- Generate Preview button if supported
- Open Preview button if URL exists
- Open Screenshot button if URL exists
- Empty state if not available

If local generator is not connected:
Show:
Local preview generator is not connected yet.

Do not call external AI/API.

## H. Locked Record UI

Show:
LOCKED RECORD
Reason:
Locked at:
Direct edits are disabled. Add amendments for corrections.

Blocked actions must be disabled or show:
Record is locked. Add an amendment instead.

## I. Amendments

For locked records:
- textarea
- Add Amendment button
- existing amendments list

Must remain usable even when record is locked.

## J. English-Only UI

No Malay visible text.

Replace all Malay/mixed copy.

## K. Closed Lost Pill

CLOSED_LOST status/deal pill must be red/danger style.

## L. Logo

AUKIY logo should display if asset available.
Fallback AP is allowed only if image missing.

---

# PHASE 6 — FUNCTION TESTS

Run these tests after repairs:

## Dashboard

1. localhost:3777 opens.
2. Header visible.
3. Logo visible or fallback works.
4. Safety banner visible.
5. Start Here visible.
6. Manual Workflow accessible.
7. Tabs filter correctly.
8. Counts make sense.
9. Metrics aligned.
10. Next Actions hide/show works.

## Table

1. Click ALL.
2. Click NEW.
3. Click CLOSED WON.
4. Click CLOSED LOST.
5. Row click opens correct modal.
6. CLOSED_LOST pills red.
7. CLOSED_WON pills green.

## Modal

1. Business name visible.
2. Contact/WhatsApp visible.
3. Current Step visible.
4. Preview section clear.
5. DM Draft section clear.
6. Button groups clear.
7. Locked banner visible for locked records.
8. Amendments usable for locked records.

## Add Lead

1. Open Add Lead.
2. Add safe test lead:
   Business: UI Final Test Spa
   Location: Ipoh
   Niche: Beauty Spa / Facial
   WhatsApp: 60123456789
   DM Draft: Test outreach draft.
3. Save.
4. Confirm appears in table.
5. Confirm appears in NEW tab.
6. Open modal.
7. Confirm business/contact visible.

## Import JSON

Test with:

```json
[
  {
    "businessName": "Import Final Test Clinic",
    "location": "Ipoh",
    "niche": "Beauty Clinic",
    "whatsappNumber": "60198765432",
    "weakness": "Active social posts but no booking page",
    "offerAngle": "Mini booking landing page with WhatsApp CTA",
    "defaultDm": "Hi, I noticed your clinic is active online. I can help create a simple booking page so customers can view services and WhatsApp you directly."
  }
]
```

Confirm:
- import success
- table updates
- no duplicate crash
- no API required

## Export

1. CSV downloads.
2. JSON downloads.
3. Logs downloads/opens.
4. Export includes locked/events/amendments if present.

## Lock Guard

1. Locked record cannot be edited in UI.
2. Direct API PATCH on locked record returns 403.
3. Mark-paid on locked record returns 403.
4. Event route remains available.
5. Amendment remains available.

## WhatsApp Safety

1. Approve & Open WhatsApp opens prefilled WhatsApp only.
2. It does not send automatically.
3. Confirm Sent remains separate.
4. Empty DM draft blocks/warns before WhatsApp.

---

# PHASE 7 — FINAL LOCKDOWN

After all tests pass, update:

tools/semi-auto-outreach/APEX_LOCKED_BASELINE.md

Add final sections that are now locked:

- Header / logo
- English-only copy
- Status pill colors
- Start Here flow
- Manual workflow panel
- Pipeline tabs
- Next Actions
- Prospect modal identity header
- Preview section
- DM Draft section
- Locked record banner
- Amendments UI
- Add Lead
- Import JSON
- CSV/JSON/Logs
- Metrics row

For each locked section:
- file/function/selector
- test evidence
- future edit restriction

Create:

tools/semi-auto-outreach/APEX_FINAL_REGRESSION_CHECKLIST.md

Include all final tests above.

---

# PHASE 8 — FINAL REPORT

Return:

# APEXPROSPECT MASTER REVIEW / REPAIR / LOCKDOWN REPORT

1. Current working directory
2. Files inspected
3. Files changed
4. Backup/checkpoint method
5. Master audit summary
6. Stable sections locked
7. Broken sections repaired
8. Start Here result
9. Manual Workflow result
10. Header/manual mode result
11. English-only result
12. AUKIY logo result
13. Status pill result
14. Metrics row result
15. Next Actions result
16. Prospect table result
17. Modal identity header result
18. Preview/generate section result
19. DM Draft result
20. Locked record UI result
21. Amendment result
22. Add Lead test result
23. Import JSON test result
24. CSV export result
25. JSON export result
26. Logs result
27. Show/Hide result
28. Server-side lock guard result
29. WhatsApp safety confirmation
30. No-API confirmation
31. No auto-send confirmation
32. Data integrity confirmation
33. Remaining issues
34. Sections now locked and must not be re-edited
35. Recommended next action

STOP AFTER REPORT.

Do not proceed to AI provider.
Do not proceed to Cloudflare deploy.
Do not add SaaS features.
Do not create new architecture.

---

# FINAL DECISION RULE

If everything passes:
ApexProspect becomes stable operator tool.

Next action after this should be:
Use the system with 5–10 real prospects.

Not more UI patching unless a real operator blocker appears.
