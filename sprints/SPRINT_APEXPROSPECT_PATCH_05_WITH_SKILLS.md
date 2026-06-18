# SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md
# ApexProspect Patch 5: Integrated Skills + Phased Execution
# Run: claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"

## INSTRUCTION

This sprint integrates **engineering & productivity skills** into patch execution.

Before each major phase:
1. Pause execution
2. Request Ith run specific skill
3. Ith returns findings
4. Cowork incorporates findings into code
5. Continue to next phase

This prevents patch-on-patch issues and ensures solid architecture.

---

## MASTER WORKFLOW MAP

```
SKILL-PLANNING (Ith)
    ↓
ARCHITECTURE VALIDATION (Ith)
    ↓
PHASE 1-4: IMPORT FEATURE (Cowork)
    ↓
TESTING-STRATEGY (Ith)
    ↓
PHASE 5-8: AUDIT FEATURE (Cowork)
    ↓
CODE-REVIEW (Ith)
    ↓
PHASE 9: TEST + COMMIT (Cowork)
    ↓
MEMORY UPDATE (Ith)
    ↓
DONE
```

---

## PRE-EXECUTION: SKILL-PLANNING

**Cowork asks Ith:**

```
Ith, run skill: product-management:sprint-planning

Input:
- Projects: Nexus Landing Engine Phase 2, ApexProspect Patch 5, NEXUS Trading updates
- Duration: 1 week
- Team: 1 (Aliff)
- PTO: None
- Fixed meetings: None
- Current blockers: None

Output needed:
- Realistic capacity for PATCH 5 (hours)
- What else fits this week alongside PATCH 5?
- Risk if pushing too hard?
```

**Ith will return:**
- Sprint capacity (e.g., 12 hours for PATCH 5, 8 hours other projects)
- Risk assessment
- Recommendation: proceed with PATCH 5 phased approach

**Cowork decision:** 
- If capacity < 15 hours for PATCH 5 → proceed (it's 9 phases, 1-2 per session)
- If capacity < 8 hours → split across 2 weeks

**STOP — wait for Ith sprint-planning output.**

---

## PRE-EXECUTION: ARCHITECTURE VALIDATION

**Cowork asks Ith:**

```
Ith, run skill: engineering:architecture

Current state:
- ApexProspect: tools/semi-auto-outreach/
- Storage: leads.json (local, 1 file)
- Routes: POST /generate, PATCH /api/leads/:id
- New routes: POST /api/leads/import/batch, PATCH /api/leads/:id/audit

Decision needed:
1. JSON persistence safe for batch import (10 prospects)?
2. Race condition risk if 2 imports simultaneous?
3. Migration path: JSON → database (future)?
4. Risk of "audit endpoint" breaking "approve endpoint"?

Output: ADR with trade-offs, risks, mitigation.
```

**Ith will return:**
- Architecture Decision Record (ADR)
- Trade-offs (JSON vs DB, synchronous vs async)
- Risk mitigation (file locking, validation)
- Future migration path

**Cowork decision:**
- If ADR says "proceed with JSON" → safe to code
- If ADR says "add file locking" → add before PHASE 1
- If ADR flags race condition → add mutex/queue

**STOP — wait for Ith architecture output. If needs file locking, add first.**

---

## PHASE 0 — PRE-FLIGHT CHECK

Read these files:
1. tools/semi-auto-outreach/server.js
2. tools/semi-auto-outreach/data/leads.json
3. tools/semi-auto-outreach/public/app.js

Verify:
- [ ] server.js has POST /generate route? (preserve)
- [ ] server.js has PATCH /api/leads/:id route? (preserve)
- [ ] leads.json has Zira lead intact?
- [ ] No import endpoint exists yet?
- [ ] No audit endpoint exists yet?

Report answers. Do NOT modify.

**STOP — wait for "continue".**

---

## PHASE 1-4: BUILD IMPORT FEATURE

### Before PHASE 1: Request Testing Strategy

**Cowork asks Ith:**

```
Ith, run skill: engineering:testing-strategy

Feature: Batch Import (POST /api/leads/import/batch)

Requirements:
- Accept JSON array (max 10 prospects)
- Validate required fields (businessName, lokasi, whatsapp)
- Detect duplicates (by whatsapp, by name+lokasi)
- Normalize data before save
- Persist to leads.json
- Return import log with success/reject/duplicate counts

Test scenarios needed:
1. Valid 5 prospects → all imported
2. 1 duplicate (whatsapp match) → 4 imported, 1 skipped
3. Invalid JSON → error 400
4. Empty array → error 400
5. 15 prospects (>10) → error 400
6. Missing required field → reject that prospect
7. Zira lead still there after import

Output: Test matrix (inputs, expected outputs, assertions)
```

**Ith will return:**
- Detailed test plan
- Edge cases to handle
- Validation checklist

**Cowork uses this to:**
- Guide code implementation (know what to test)
- Know exact error messages to return
- Prevent bugs before they happen

---

### PHASE 1-4: EXECUTE IMPORT (per original sprint)

Use test strategy from Ith to guide code:

**PHASE 1:** Add endpoint + helpers (validateProspect, normalizeImportedProspect, generateLeadId)
- Code to pass Test Scenario 6 (reject invalid)
- Code to pass Test Scenario 5 (>10 limit)

**PHASE 2:** Add import modal UI
- HTML structure for JSON textarea
- Open/close modal functions

**PHASE 3:** Add import JS
- doImport() function
- JSON parse + validation (use test scenarios 3-4)
- POST to /api/leads/import/batch

**PHASE 4:** Add import CSS
- Modal styling
- Textarea styling

After each phase:
- [ ] Commit: `git commit -m "feat: phase X - [feature]"`
- [ ] Push: `git push`
- [ ] Report: what works, what's next

**STOP after PHASE 4 — wait for "continue".**

---

## PHASE 5-8: BUILD AUDIT FEATURE

### Before PHASE 5: Testing Strategy (Audit)

**Cowork asks Ith:**

```
Ith, run skill: engineering:testing-strategy

Feature: Safe Audit Editor (PATCH /api/leads/:id/audit)

Requirements:
- Update fitScore (0-100, integer)
- Update priority (HIGH/MEDIUM/LOW, enum)
- Update auditNotes (string, max 500 chars)
- Use EXPLICIT field assignment (never merge objects)
- Log event to lead.events[]
- Persist to leads.json

Test scenarios:
1. Valid audit (fitScore=75, priority=HIGH, notes="Good fit") → saved
2. fitScore=101 (invalid) → reject, don't save
3. fitScore=-1 (invalid) → reject
4. priority=URGENT (invalid enum) → reject
5. auditNotes=empty string → save as empty (allow)
6. Only fitScore provided → save fitScore, keep old priority/notes
7. Lead doesn't exist → 404 error
8. Concurrent audits → last write wins (no lock needed for MVP)

Output: Test matrix + edge cases
```

**Ith will return:**
- Validation rules per field
- Error scenarios
- Atomicity notes

---

### PHASE 5-8: EXECUTE AUDIT

**PHASE 5:** Add audit endpoint
- PATCH /api/leads/:id/audit
- Explicit field validation + assignment
- Event logging
- Code to pass Test Scenarios 1-7

**PHASE 6:** Add audit UI
- Fit Score slider (0-100)
- Priority dropdown (HIGH/MEDIUM/LOW)
- Notes textarea
- Save button

**PHASE 7:** Add audit JS
- attachAuditHandlers() function
- Slider update display
- Save button → PATCH endpoint
- Show success/error feedback

**PHASE 8:** Add audit CSS
- Slider styling
- Dropdown styling
- Notes textarea styling
- Button styling

After each phase:
- [ ] Commit
- [ ] Push
- [ ] Report

**STOP after PHASE 8 — wait for "continue".**

---

## PHASE 9: TEST + CODE REVIEW

### Before Testing: Code Review

**Cowork asks Ith:**

```
Ith, run skill: engineering:code-review

Review these files before testing:
- tools/semi-auto-outreach/server.js (all changes)
- tools/semi-auto-outreach/public/app.js (all changes)
- tools/semi-auto-outreach/public/index.html (all changes)

Focus on:
1. Data safety: no blanket object merge?
2. Zira lead data: will it be lost or corrupted?
3. Explicit field assignment: validateProspect, normalizeImportedProspect?
4. Error handling: all error paths have proper response?
5. SQL injection risk (N/A for JSON), but input sanitization?
6. Event logging: all state changes logged?

Output: Issues found + severity + fix recommendation
```

**Ith will return:**
- List of issues (if any)
- Code snippets to fix
- Severity (blocking vs. nice-to-have)

**Cowork decision:**
- If blocking issues → fix before testing
- If nice-to-have → log as tech debt
- If all clear → proceed to testing

---

### PHASE 9A: LOCAL TESTING

Start server:
```bash
cd tools/semi-auto-outreach
npm start
```

**Test 1: Import Valid Prospects**
- Open http://localhost:3777
- Click "IMPORT TOP 10"
- Paste 2 valid prospects (see sprint for JSON template)
- Click IMPORT
- Expected: ✅ 2 imported, dashboard refreshes, new leads visible

**Test 2: Import with Duplicate**
- Paste same 2 prospects again + 1 new
- Click IMPORT
- Expected: ✅ 2 skipped (duplicate), 1 imported, log shows counts

**Test 3: Import Invalid JSON**
- Paste: `{invalid json`
- Click IMPORT
- Expected: ❌ JSON parse error message

**Test 4: Edit Audit Fields**
- Pick any new prospect
- Set Fit Score to 75
- Set Priority to HIGH
- Add notes: "Good fit for dental niche"
- Click SAVE AUDIT
- Expected: ✅ Audit saved message
- Refresh page
- Expected: Fit Score still 75, Priority still HIGH, notes still there

**Test 5: Zira Lead Preserved**
- Scroll to Zira Beauty Spa in list
- Verify all fields intact
- Try approve button → should still work
- Expected: ✅ Zira workflow unchanged

Kill server: `Ctrl+C`

Report all 5 tests: PASS/FAIL

**If any FAIL:**
- Note which test
- Identify which phase caused it
- Report for re-run

**If all PASS → proceed to commit.**

---

### PHASE 9B: FINAL COMMIT

```bash
cd tools/semi-auto-outreach
git add server.js public/app.js public/index.html public/style.css
git commit -m "feat: patch 5 — batch import + safe audit editor

Changes:
- POST /api/leads/import/batch (max 10 prospects, validation, dedup)
- PATCH /api/leads/:id/audit (fit score, priority, notes)
- Import modal UI with JSON paste
- Audit fields in lead cards (slider, dropdown, textarea)
- Explicit field assignment (no blanket merge)
- Event logging for all changes
- All Zira lead workflow preserved
- Tested: import duplicates, invalid JSON, audit persistence

Verified by:
- engineering:code-review (no data loss risks)
- engineering:testing-strategy (all scenarios covered)
- Local tests (5/5 pass)
"
git push
```

Report:
- [ ] Commit hash
- [ ] Files changed
- [ ] Push successful
- [ ] GitHub confirms new commits

**STOP — PATCH 5 COMPLETE.**

---

## POST-EXECUTION: MEMORY UPDATE

**Cowork asks Ith:**

```
Ith, run skill: productivity:memory-management

Update Claude's memory with:

1. ApexProspect PATCH 5 status: COMPLETE
   - Batch import (POST /api/leads/import/batch) working
   - Audit editor (PATCH /api/leads/:id/audit) working
   - Zira lead preserved
   - Tests passing
   - Live at localhost:3777

2. Next patch priorities:
   - Preview generation button
   - Lead export (CSV)
   - WhatsApp reply tracking

3. ResponseOps positioning: future upsell to landing engine clients

4. Data: After 1 week, Aliff will have ~20 imported prospects
   - Track fit scores distribution
   - Monitor conversion: imported → preview → contacted
   - Validate if target niches (dental, spa) convert well
```

**Ith will add to memory:**
- PATCH 5 complete ✅
- Zira workflow safe ✅
- Ready for PATCH 6 planning
- Future feature priorities

---

## ROLLBACK (if needed at any point)

```bash
cd tools/semi-auto-outreach
git reset --hard HEAD~1
git push -f
```

Report exact error + which phase broke.

---

## SKILL USAGE SUMMARY

| Skill | When | Input | Output | Used For |
|-------|------|-------|--------|----------|
| **sprint-planning** | PRE | Projects + capacity | Hours per task | Know if realistic |
| **architecture** | PRE | Current + new design | ADR + risks | Validate before code |
| **testing-strategy** | Before PHASE 1 | Feature requirements | Test matrix | Guide implementation |
| **testing-strategy** | Before PHASE 5 | Audit requirements | Test matrix | Guide audit code |
| **code-review** | Before PHASE 9 | All new code | Issues + fixes | Safety before commit |
| **memory-management** | POST | Completion + next steps | Updated memory | Track progress |

---

## EXECUTION FLOW (SIMPLE VERSION)

1. **Ith:** sprint-planning → "You have 15 hours, PATCH 5 is 8 hours, go"
2. **Ith:** architecture → "JSON safe, no race condition risk, proceed"
3. **Cowork:** PHASE 0 inspect (no changes)
4. **Ith:** testing-strategy (import) → test matrix
5. **Cowork:** PHASE 1-4 (import, guided by tests)
6. **Ith:** testing-strategy (audit) → test matrix
7. **Cowork:** PHASE 5-8 (audit, guided by tests)
8. **Ith:** code-review → "All clear, proceed to test"
9. **Cowork:** PHASE 9A testing (5 scenarios, all pass)
10. **Cowork:** PHASE 9B commit + push
11. **Ith:** memory-management → "PATCH 5 ✅ in memory"
12. **DONE** ✅

---

**TO EXECUTE:**

Aliff asks Ith to run this sprint:

```
claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"
```

Cowork pauses at skill checkpoints, waits for Ith findings, then continues.

This prevents rushing, catches bugs early, and keeps Zira lead safe.

**Ready?**
