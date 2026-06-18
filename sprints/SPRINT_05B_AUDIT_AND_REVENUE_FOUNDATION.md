# SPRINT_05B_AUDIT_AND_REVENUE_FOUNDATION.md
# ApexProspect — PATCH 05B Verification + Revenue-First Foundation Setup
# Run: claude "Execute sprints/SPRINT_05B_AUDIT_AND_REVENUE_FOUNDATION.md"

## ROLE

You are Claude Code CLI ("Cowork") working on ApexProspect by AUKIY.

PROJECT PATH: tools/semi-auto-outreach/
ENVIRONMENT: localhost:3777

---

## CONTEXT — WHERE WE ARE

PATCH 1 — PASS
PATCH 2 — PASS
PATCH 3 — PASS
PATCH 4 — PASS
PATCH 5 — Reported PASS, but NOT YET VERIFIED by real operator testing

This sprint does TWO things in sequence:

PART A — Verify PATCH 5 is actually complete (audit, test in browser, patch only if broken)
PART B — Set up Revenue-First foundation (skill library index + cost tracker) so future patches save tokens automatically

Do NOT skip PART A to rush to PART B. Verification comes first — it protects the Zira lead and the whole workflow.

---

## MANDATORY FIRST STEP — SKILL-FIRST CHECK

Before touching any code, do this in order:

1. Check if `DealSense/cowork-rules/COWORK_OPERATIONAL_RULES_V2.md` exists.
   - If exists: read it fully. Follow its rules for the rest of this sprint.
   - If NOT exists: note this in your report, proceed with this sprint's instructions as the source of truth.

2. Check if `DealSense/skill-library/DEALSENSE_SKILL_REGISTRY.md` exists.
   - If exists: read it. Identify any cached skill output relevant to:
     - testing-strategy (batch import patterns)
     - testing-strategy (audit editor patterns)
     - code-review (data safety checklist)
   - If a relevant cached skill is found: use it directly, do NOT re-request it. Note in report: "Cache hit: [name] — reused, saved ~1,500 tokens."
   - If NOT exists, or no relevant cache found: proceed to step 3.

3. For this sprint, the skills that matter are:
   - `engineering:testing-strategy` — to verify the import + audit workflows behave correctly under edge cases (only run fresh if not cached)
   - `engineering:code-review` — to check the explicit-field-assignment safety rule held in PATCH 5 code (only run fresh if not cached)

   Request these from Ith (Claude.ai chat) ONLY if no cached version exists. If you cannot reach Ith in this session, proceed with your own careful inspection instead and flag in the report: "Skill not available this session — manual inspection used instead."

4. Do not block the sprint waiting for skills. If a skill is unavailable, proceed manually and disclose it clearly in the final report. Never silently skip verification.

---

## PART A — VERIFY PATCH 5 (DO NOT REFACTOR, DO NOT REDESIGN)

### A1 — Import UI Inspection

Inspect `tools/semi-auto-outreach/public/index.html`:
- [ ] "IMPORT TOP 10" button exists with onclick handler
- [ ] Modal exists: textarea for JSON, IMPORT button, CANCEL button, result display div

Inspect `tools/semi-auto-outreach/public/style.css`:
- [ ] Modal/overlay/textarea/button styling exists and is usable (not invisible/broken)

If missing: note as **MISSING — PATCH NEEDED**, do not fix yet, continue inspection first.

### A2 — JS Wiring Check

Inspect `tools/semi-auto-outreach/public/app.js`:
- [ ] `openImportModal()` exists and opens the modal
- [ ] `closeImportModal()` exists and closes it
- [ ] `doImport()` exists, parses JSON, calls `POST /api/leads/import/batch`, handles response, shows result, reloads leads
- [ ] `showImportResult()` exists and displays imported/duplicate/error counts

Report each as WORKING / STUB / MISSING.

### A3 — Backend Route Check

Inspect `tools/semi-auto-outreach/server.js`:
- [ ] `POST /api/leads/import/batch` route exists
- [ ] Validates max 10 prospects per batch
- [ ] Validates required fields (businessName, lokasi, whatsapp)
- [ ] Detects duplicates (by whatsapp OR businessName+lokasi)
- [ ] Uses explicit field assignment (NOT `{...spread}` merge) when normalizing
- [ ] Returns `{ ok, imported, duplicates, errors }` shape

### A4 — Audit Editor Check

Inspect lead card rendering in `app.js` / `index.html`:
- [ ] Fit Score slider (0-100) present
- [ ] Priority dropdown (HIGH/MEDIUM/LOW) present
- [ ] Audit Notes textarea present
- [ ] SAVE AUDIT button present and wired

Inspect `server.js`:
- [ ] `PATCH /api/leads/:id/audit` route exists
- [ ] Uses explicit field assignment only
- [ ] Logs event to `lead.events[]`

### A5 — LIVE BROWSER TEST (Required — do not skip)

Run:
```
cd tools/semi-auto-outreach
npm start
```

Open `http://localhost:3777` and test manually:

1. Click "IMPORT TOP 10" → modal opens?
2. Paste this test batch:
```json
[
  {
    "businessName": "Test Dental Clinic",
    "lokasi": "Ipoh",
    "niche": "Dental",
    "whatsapp": "601234567890",
    "defaultDm": "Hi Test Dental, saya ada proposal..."
  },
  {
    "businessName": "Test Spa",
    "lokasi": "Ipoh",
    "niche": "Spa",
    "whatsapp": "601234567891",
    "defaultDm": "Hi Test Spa, saya ada proposal..."
  },
  {
    "businessName": "",
    "lokasi": "Ipoh"
  }
]
```
3. Click IMPORT → does result show "Imported: 2, Rejected: 1"?
4. Close modal → do the 2 new leads appear in the dashboard?
5. Open "Test Dental Clinic" → set Fit Score to 75, Priority to HIGH, Notes to "Good fit" → click SAVE AUDIT → success message?
6. Refresh page (F5) → are Fit Score/Priority/Notes still there?

Report PASS/FAIL for each of the 6 steps above. If FAIL anywhere, capture the exact error (console error, broken UI, missing element).

### A6 — Regression Check (Zira + existing flows)

- [ ] Zira Beauty Spa lead still visible, data unchanged
- [ ] Zira's "Approve" button still opens WhatsApp correctly
- [ ] Preview generation still works (any lead)
- [ ] `events[]` array still logs actions in leads.json
- [ ] No data loss in `leads.json` after import test (check Zira record byte-for-byte status field unchanged)

### A7 — Patch ONLY If Broken

If A1-A6 reveal something broken or missing:
- Apply the SMALLEST possible fix
- Use explicit field assignment, existing event architecture, existing scoring functions — no new architecture
- Re-test that specific step after fixing
- Commit: `fix: [specific description]`

If everything passes: do NOT modify any code. Just report PASS.

### A8 — PART A Verdict

Report clearly:
```
PATCH 5 VERIFICATION VERDICT: [COMPLETE / COMPLETE AFTER SMALL FIXES / INCOMPLETE]
Files changed (if any): [list]
Zira data integrity: [CONFIRMED INTACT / ISSUE FOUND]
```

**STOP here. Wait for "continue" before Part B.**

---

## PART B — REVENUE-FIRST FOUNDATION SETUP

Only proceed after Aliff says "continue" following Part A report.

### B1 — Create Skill Library Index

Create folder if not exists: `DealSense/skill-library/`

Create file: `DealSense/skill-library/LIBRARY_INDEX.md`

```markdown
# DealSense Skill Library Index
# Cowork checks this FIRST before requesting testing-strategy or code-review skills

## TESTING PATTERNS

### BATCH_IMPORT_PATTERNS
Applies to: any batch import with validation + dedup
Reusability: HIGH
Source: ApexProspect PATCH 5 / PATCH 05B
Token cost if fresh: ~1,500
Status: ACTIVE

### AUDIT_EDITOR_PATTERNS
Applies to: any feature with manual scoring/rating fields + persistence
Reusability: HIGH
Source: ApexProspect PATCH 5
Token cost if fresh: ~1,500
Status: ACTIVE

## CODE REVIEW PATTERNS

### DATA_SAFETY_CHECKLIST
Applies to: ANY project with JSON persistence (explicit field assignment, race conditions, no silent data loss)
Reusability: CRITICAL — always check this first
Source: ApexProspect PATCH 5 / PATCH 05B
Token cost if fresh: ~1,200
Status: ACTIVE

## HOW TO USE THIS FILE

Before requesting a testing-strategy or code-review skill from Ith:
1. Check the patterns above
2. If applicable to current task: reuse directly, log "Cache hit: [name]"
3. If not applicable or doesn't exist: request fresh from Ith, then ADD a new entry here after
```

### B2 — Create Client Cost Tracker

Create file: `DealSense/skill-library/CLIENT_COST_TRACKER.md`

```markdown
# Client Cost & Margin Tracker

| Client | Date | Project | Type | Tokens Used | Price (RM) | Margin (RM) | Notes |
|--------|------|---------|------|-------------|-------------|-------------|-------|
| Zira Beauty Spa | (fill actual date) | Nexus Landing | Landing Page | (estimate or TBD) | 350 | TBD | First real client |

## Summary
- Total revenue this month: RM (calculate)
- Total margin this month: RM (calculate)
- Status: (PROFITABLE / NEEDS REVIEW)

## Rule for Cowork
After completing any client-facing project (landing page, preview, etc.), add a row here with actual token usage if known, or mark "TBD" if not tracked yet. Do not block project completion waiting for this — it's tracking, not a gate.
```

### B3 — Add Safety Rules to Cowork Rules File

Check if `DealSense/cowork-rules/COWORK_OPERATIONAL_RULES_V2.md` exists.

- If exists: append the following as new rules (do not renumber existing rules, just continue the sequence).
- If does NOT exist: create the file fresh with just these rules plus a header noting it's the first version.

```markdown
## REVENUE-FIRST RULES

Rule [N]: Check Library First
Before requesting testing-strategy or code-review skill, check DealSense/skill-library/LIBRARY_INDEX.md. If an applicable cached pattern exists, reuse it instead of requesting fresh.

Rule [N+1]: Track Cost Per Client Project
After completing a client-facing deliverable, log it in DealSense/skill-library/CLIENT_COST_TRACKER.md (tokens, price, margin). If exact token count isn't available, mark TBD — never skip the row entirely.

Rule [N+2]: Safety Fallback — Never Block on Cache
If a cached skill file is missing, corrupted, or doesn't fit the current task: fall back to requesting fresh from Ith. Log it as "Cache miss: [name] — fresh request used." Never let a missing cache file stop a project.
```

### B4 — Confirm Setup

After creating the 3 files/edits above, verify:
- [ ] `DealSense/skill-library/LIBRARY_INDEX.md` exists and readable
- [ ] `DealSense/skill-library/CLIENT_COST_TRACKER.md` exists and readable
- [ ] `DealSense/cowork-rules/COWORK_OPERATIONAL_RULES_V2.md` exists with new rules appended

Commit: `feat: revenue-first foundation — skill library index + cost tracker + safety rules`

---

## FINAL REPORT FORMAT

```
=== PART A: PATCH 5 VERIFICATION ===
Import UI: [PASS/FAIL]
Import Wiring: [PASS/FAIL]
Backend Route: [PASS/FAIL]
Audit Editor: [PASS/FAIL]
Live Browser Test: [PASS/FAIL — list which of 6 steps failed if any]
Regression Check: [PASS/FAIL]
Patches applied: [list or "none needed"]
VERDICT: [PATCH 5 COMPLETE / COMPLETE AFTER FIXES / INCOMPLETE]

=== SKILL USAGE THIS SESSION ===
Cached skills reused: [list, or "none — first run, library now seeded"]
Fresh skills requested: [list, or "none available this session — manual inspection used"]

=== PART B: REVENUE-FIRST FOUNDATION ===
LIBRARY_INDEX.md: [CREATED/UPDATED]
CLIENT_COST_TRACKER.md: [CREATED/UPDATED]
COWORK_OPERATIONAL_RULES_V2.md: [CREATED/UPDATED]

=== READY FOR NEXT STEP ===
[Outreach Intelligence / Nexus Phase 2 / other — your recommendation]
```

---

## SAFETY RULES (NON-NEGOTIABLE)

- Never modify Zira Beauty Spa's existing data
- Never add auto-send WhatsApp logic
- Never use `{...spread}` merges on lead records — explicit field assignment only
- Never skip the live browser test in A5 — code inspection alone is not sufficient
- Never proceed to Part B if Part A verdict is INCOMPLETE without Aliff's explicit "continue"
- Stop after Part A report and wait for "continue"
- Stop after Part B report — sprint complete

STOP.
