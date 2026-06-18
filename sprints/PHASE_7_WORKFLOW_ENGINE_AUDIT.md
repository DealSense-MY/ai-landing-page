# PHASE_7_WORKFLOW_ENGINE_AUDIT.md
# DealSense — Phase 7: Workflow Engine AUDIT ONLY
# Run: claude "Read sprints/MEMORY.md then execute sprints/PHASE_7_WORKFLOW_ENGINE_AUDIT.md"

## INSTRUCTION
AUDIT ONLY. Do NOT modify any files. Do NOT write any code.
Report only. Wait for Aliff approval before any implementation.

---

## CONTEXT

Post-security verification passed (Phase 6D confirmed):
- Zira preview renders correctly
- WA CTA uses 60165531496
- WA links digits-only (.replace(/[^0-9]/g, ''))
- Generated HTML not broken
- No raw unsafe businessName injection
- Dashboard loads localhost:3777
- Approval/WA/outreach logic unchanged
- No auto-send added

Phase 7 adds: Workflow Engine (status transitions, AutoLog events, lock enforcement)

---

## STEP 1 — READ SPRINT FILE

Read: sprints/PHASE_7_WORKFLOW_ENGINE.md

Extract and report:
- Phase 7 objective (1-2 sentences)
- All features listed
- All files it plans to modify
- Acceptance criteria if listed

---

## STEP 2 — INSPECT CURRENT APP STATE

Read these files:
- tools/semi-auto-outreach/server.js
- tools/semi-auto-outreach/public/app.js
- tools/semi-auto-outreach/public/index.html
- tools/semi-auto-outreach/public/style.css
- tools/semi-auto-outreach/modules/previewBuilder.js
- tools/semi-auto-outreach/modules/previewRenderer.js
- tools/semi-auto-outreach/modules/postbackOperator.js (if exists)
- tools/semi-auto-outreach/modules/importValidator.js (if exists)
- tools/semi-auto-outreach/data/leads.json

Report for each file:
- Exists: YES / NO
- Relevant functions found (names only)
- Current Zira lead prospectStatus value

---

## STEP 3 — CONFIRM PHASE 6D INTACT

Check and report PASS / FAIL:

- [ ] previewRenderer.js WA sanitization uses .replace(/[^0-9]/g, '')
- [ ] No .replace('+','') remaining in previewRenderer.js
- [ ] CLOSED WON lock banner exists in app.js or index.html
- [ ] Zira DM modal is populated (search: dm-modal or defaultDm)
- [ ] Zira lead exists in leads.json with previewPath populated
- [ ] openContact() function unchanged in app.js

---

## STEP 4 — INTEGRATION POINT MAP

For each Phase 7 feature found in PHASE_7_WORKFLOW_ENGINE.md:

Map exactly:
- Which existing function it hooks into
- Which file it modifies
- Whether it touches approve / WA open / outreach logic
- Whether it risks data mutation in leads.json

---

## STEP 5 — RISK ANALYSIS

Flag each risk as: CRITICAL / HIGH / MEDIUM / LOW

Check for:
1. Status guard blocking approve if Zira prospectStatus is unexpected value
2. Event write failure blocking WA open
3. Schema migration overwriting Zira existing fields
4. Lock logic blocking DM edit unexpectedly
5. Race condition in server.js (read → modify → write)
6. Phase 6D WA digits-only fix being overwritten
7. Any new dependency added without npm install

---

## STEP 6 — FINAL REPORT

Return in this exact format:

```
PHASE 7 AUDIT REPORT
====================

1. PHASE 7 SUMMARY
   What it adds: [list]

2. FILES LIKELY TO CHANGE
   [file] — [reason]

3. INTEGRATION POINTS
   [feature] → hooks into [function] in [file]

4. RISKS
   [CRITICAL/HIGH/MEDIUM/LOW] — [description]

5. MUST NOT TOUCH
   - openContact() in app.js
   - previewRenderer.js digits-only WA fix
   - Zira lead data in leads.json
   - AUKIY theme in style.css
   - Port 3777

6. RECOMMENDED IMPLEMENTATION ORDER
   Step 1: [lowest risk first]
   Step 2: ...

7. PHASE 6D INTACT
   PASS / FAIL per check

CONFIRM: NO FILES MODIFIED.
```

STOP. Wait for Aliff approval before any implementation.
