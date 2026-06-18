# SPRINT_05B_PATCH5_VERIFY.md
# DealSense — ApexProspect PATCH 5 Live Verification (Gap-Fill Only)
# Run: claude "Read DEALSENSE_MASTER_SKILL.md then execute sprints/SPRINT_05B_PATCH5_VERIFY.md"

## SKILL-FIRST CHECK
Before starting, re-read DEALSENSE_MASTER_SKILL.md Section 2 (Architecture Doctrine)
and Section 4 (Verification-Before-Patch Protocol). This sprint exists because
Section 4 step 2 (live browser test) was skipped in the prior PATCH 5 report —
a `new Function()` syntax check was reported as "verified programmatically" but
that only confirms the code parses, not that it works.

## INSTRUCTION
This is a VERIFICATION-ONLY sprint. Do NOT write new features. Do NOT refactor.
Only fix something if a check below FAILS, and if so, apply the SMALLEST possible
fix per Section 4 ("patch only what's confirmed broken"), then re-test that one
item before continuing.

Execute phase by phase. After each phase: report, then STOP.
Wait for "continue" before next phase.

## PRE-CHECK
1. Backup data files first:
   ```
   cd tools/semi-auto-outreach
   copy data\leads.json data\leads.json.bak
   copy data\run-log.json data\run-log.json.bak
   ```
2. Start the server: `npm start` (confirm it actually boots on localhost:3777,
   paste the console output)

---

## PHASE 1 — AUDIT EDITOR: LIVE WRITE TEST

In the running browser (not code reading):

1. Open any non-locked lead (status NOT CLOSED_WON / CLOSED_LOST) in the modal
2. Note current auditScore / previewReadinessScore / priority shown on screen
   (paste exact values)
3. Edit all 5 numeric score fields (Website, Mobile, CTA, Social, Review) to
   new distinct test values
4. Edit both array fields (Weakness, Opportunity) with new comma-separated
   test values
5. Click "Save Audit"
6. Report exactly what happens on screen — does it refresh live without
   closing the modal? What do auditScore/previewReadinessScore/priority show now?
7. Open `data/leads.json` directly and paste the before/after JSON for this
   lead's `audit`, `auditScore`, `previewReadinessScore`, `priority` fields
8. Open `data/run-log.json` and paste the newest entry — confirm eventType
   is `AUDIT_UPDATED` and metadata reflects the actual change

If any of steps 5-8 fail to behave as described in the original PATCH 5 report,
STOP and report the exact discrepancy. Do not patch yet — wait for Aliff review.

If all pass: STOP — report PASS, wait for "continue".

---

## PHASE 2 — LOCKED LEAD GATE TEST

1. Open a lead with status CLOSED_WON or CLOSED_LOST in the browser
   (if none exists, report that and skip to Phase 3 rather than fabricating one)
2. Confirm in the actual rendered UI — not the code — whether the 5 numeric
   inputs, 2 array textareas, and Save Audit button are visibly disabled
3. Attempt to click into a field anyway and try Save — report what happens
4. Paste a screenshot description or exact DOM state if possible

If broken: identify smallest fix (likely a missing `disabled` attribute binding
or missing `isLocked()` check), apply it, re-test this phase only, report.

STOP — report PASS/FAIL, wait for "continue".

---

## PHASE 3 — REGRESSION: ZIRA LEAD + WHATSAPP APPROVE FLOW

This is the one check that must NEVER silently break (per master skill Section 2
and Section 4).

1. Confirm Zira Beauty Spa lead card still renders in the dashboard
2. Confirm her data is intact (businessName, whatsappNumber, previewPath unchanged)
3. Click Approve (or YES) on her card
4. Confirm WhatsApp opens (wa.me link) with the prefilled DM message intact
5. Confirm `openContact()` function in app.js was NOT modified by PATCH 5
   (diff check against git history if available, or just confirm by reading
   the function and comparing to known-good behavior)

If this is broken in ANY way, this is CRITICAL severity — stop immediately,
do not attempt a fix without explicit Aliff approval first, report exact
diff/cause only.

STOP — report PASS/FAIL, wait for "continue".

---

## PHASE 4 — IMPORT + TOP10 SPOT-CHECK (lightweight, not full re-run)

Since this was reported as "not re-run (already passing)" from a prior session:

1. Run one fresh test import (2-3 sample prospects via the import UI)
2. Confirm dedupe logic actually triggers if you import a duplicate
   (reuse one existing id or businessName+whatsapp combo)
3. Confirm Top 10 ranking updates and displays after import
4. Confirm closed-deal duplicates are excluded from Top 10 (if a CLOSED_WON/LOST
   lead exists, try duplicating it and confirm it's reported separately, not ranked)

STOP — report PASS/FAIL, wait for "continue".

---

## PHASE 5 — FINAL VERDICT

Summarize all 4 phases in this format:

```
PATCH 5 VERIFICATION RESULT

Phase 1 (Audit Editor live write):     PASS / FAIL — [one line evidence]
Phase 2 (Locked lead gate):            PASS / FAIL — [one line evidence]
Phase 3 (Zira + WhatsApp regression):  PASS / FAIL — [one line evidence]
Phase 4 (Import + Top10 spot-check):   PASS / FAIL — [one line evidence]

OVERALL VERDICT: COMPLETE / INCOMPLETE / COMPLETE AFTER FIXES

Fixes applied this session (if any): [list, smallest-fix-only per Section 4]
Files touched: [list — should still be only the 3 from original PATCH 5,
                flag clearly if anything else was touched]
```

Restore note: if `data/leads.json.bak` or `data/run-log.json.bak` were never
needed (no corruption occurred), confirm they can be deleted; otherwise keep
them and report why.

STOP — done. Do NOT proceed to PATCH 6 or Part B (revenue foundation files)
until Aliff explicitly reviews this verdict.
