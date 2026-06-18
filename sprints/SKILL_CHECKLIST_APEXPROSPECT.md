# SKILL_CHECKLIST_APEXPROSPECT.md
# ApexProspect Patch 5 - Skill Requirements
# File: tools/semi-auto-outreach/sprints/SKILL_CHECKLIST_APEXPROSPECT.md

## PROJECT INFO

**Project Name:** ApexProspect Patch 5: Batch Import + Safe Audit Editor  
**Objective:** Enable AI-researched prospects to batch import (max 10), allow operator to edit fit scores + priority safely  
**Owner:** Aliff (DealSense)  
**Sprint File:** SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md  
**Estimated Duration:** 2-3 hours total, phased over 1-2 work sessions  
**Critical Data:** Zira Beauty Spa lead (must not be corrupted or lost)  
**Risk Level:** MEDIUM (first major patch after Master Audit doctrine change)  

---

## SKILLS REQUIRED (In Execution Order)

### SKILL 1: product-management:sprint-planning

```
Skill ID: product-management:sprint-planning

When: PRE (before PHASE 1)

Input:
- Projects: Nexus Landing Engine Phase 2, ApexProspect Patch 5, NEXUS Trading updates
- Duration: 1 week available
- Team: 1 (Aliff)
- PTO: None
- Blocking meetings: None
- Previous blockers: None

Expected Output:
- Realistic capacity hours for PATCH 5 (expect: 6-8 hours)
- What else fits alongside in same week
- Risk if over-committing
- Recommended pacing (e.g., "2-3 hours per session")

Use In: Determines project viability and scheduling

Blocker Risk: YES
(If output says <4 hours available, defer PATCH 5 to next week)
```

---

### SKILL 2: engineering:architecture

```
Skill ID: engineering:architecture

When: PRE (before PHASE 1)

Input:
- Current system: ApexProspect at localhost:3777
- Current storage: leads.json (local JSON file)
- Current endpoints: POST /generate, PATCH /api/leads/:id
- New endpoints: POST /api/leads/import/batch (max 10 prospects), PATCH /api/leads/:id/audit (fit score, priority, notes)
- Data mutations: 
  * Import: Add 0-10 new leads to leads.json
  * Audit: Update fitScore, priority, auditNotes for specific lead
- Safety concern: Will batch import corrupt existing leads (especially Zira)?
- Concurrency: Can 2 imports happen simultaneously? Risk?
- Future: Will JSON scale to 50+ leads? 200 leads?

Expected Output:
- Architecture Decision Record (ADR)
- Is JSON safe for this design? (expect YES for MVP)
- Race condition risk assessment (expect LOW if single-threaded)
- Zira lead safety verification (expect "not affected")
- Migration path if scaling to DB later (expect feasible)
- Any risk mitigations needed before coding? (expect none, or "add file locking")

Use In: Validates design is sound before PHASE 1

Blocker Risk: YES
(If output says "risky, use database instead" or "Zira lead at risk", address before proceeding)
```

---

### SKILL 3: engineering:testing-strategy (IMPORT FEATURE)

```
Skill ID: engineering:testing-strategy

When: Before PHASE 1-4 (import feature)

Input:
- Feature: Batch Import (POST /api/leads/import/batch)
- Requirements:
  * Accept JSON array of prospects (max 10)
  * Validate required fields: businessName, lokasi, whatsapp
  * Detect duplicates: by whatsapp OR by (businessName + lokasi)
  * Normalize data: sanitize WhatsApp number, trim strings
  * Persist: save to leads.json
  * Return: import log (success count, reject count, duplicate count, details)
  * Never modify existing leads (import is additive only)
- Data contracts:
  * Input: {"prospects": [{...}, {...}]}
  * Output: {"ok": true, "imported": 5, "duplicates": 2, "importLog": [...]}
  * Error: {"error": "description"}
- Edge cases:
  * Empty JSON array → error
  * >10 prospects → error
  * Missing businessName → reject that prospect, continue with others
  * Invalid WhatsApp format → reject
  * Duplicate WhatsApp (Zira same number) → skip, note in log
  * Valid prospect but matching (name + lokasi) → skip

Expected Output:
- Test matrix: 8-10 scenarios with inputs → expected outputs
- Validation rules: what makes a prospect valid/invalid
- Error messages: exact error responses for each fail case
- Test assertions: what to check in response
- Zira test case: "After import, Zira lead still there, unchanged"

Use In: Guides implementation of PHASE 1-4 (endpoint + JS + UI)
PHASE 1 code to pass all test scenarios

Blocker Risk: NO
```

---

### SKILL 4: engineering:testing-strategy (AUDIT FEATURE)

```
Skill ID: engineering:testing-strategy

When: Before PHASE 5-8 (audit feature)

Input:
- Feature: Safe Audit Editor (PATCH /api/leads/:id/audit)
- Requirements:
  * Update fitScore (0-100 integer, optional)
  * Update priority (HIGH/MEDIUM/LOW enum, optional)
  * Update auditNotes (string, optional, max 500 chars)
  * Use EXPLICIT field assignment (never blanket merge objects)
  * Log event to lead.events[] array
  * Persist to leads.json
- Data contracts:
  * Input: {"fitScore": 75, "priority": "HIGH", "auditNotes": "..."}
  * Output: {"ok": true, "lead": {...updated lead...}}
  * Error: {"error": "description"}
- Validation rules:
  * fitScore must be 0-100 (if provided)
  * priority must be one of: HIGH, MEDIUM, LOW (if provided)
  * auditNotes must be string (if provided)
- Edge cases:
  * Only fitScore provided → update fitScore, keep old priority/notes
  * fitScore = 101 (invalid) → reject, don't save
  * fitScore = -1 (invalid) → reject
  * priority = "URGENT" (invalid enum) → reject
  * Lead not found → 404 error
  * Empty auditNotes → allowed (clear the notes)
  * Concurrent audits (2 at same time) → last write wins (acceptable for MVP)

Expected Output:
- Test matrix: 8-10 scenarios
- Validation rules per field
- Error messages per fail case
- Test assertions
- Concurrency behavior expected

Use In: Guides PHASE 5-8 implementation

Blocker Risk: NO
```

---

### SKILL 5: engineering:code-review

```
Skill ID: engineering:code-review

When: Before PHASE 9 testing (before local testing)

Input:
- Files to review:
  * server.js (all new/modified code)
  * public/app.js (all new/modified code)
  * public/index.html (all new/modified code)
- Focus areas:
  1. Data safety: any `{...spread}` merges? (should use explicit assignment)
  2. Zira lead safety: will Zira data be lost/corrupted?
  3. Error handling: all error paths have proper response?
  4. Input validation: validateProspect() correct?
  5. Event logging: all state changes logged to events[]?
  6. Explicit field assignment: verified no blanket merge?
  7. JSON persistence: file writes look safe?
  8. Duplicate detection logic: correct?

Expected Output:
- Issues found (if any), severity (blocking / nice-to-have)
- Code snippets highlighting issues
- Fix recommendations
- Data safety verdict: SAFE or RISKY
- Readiness for testing: YES or NO

Use In: Gates PHASE 9 (no testing until code review passes)

Blocker Risk: YES
(If code review says RISKY or BLOCKING ISSUES, must fix before testing)
```

---

## SKILL EXECUTION CHECKLIST

During INIT_SKILL_CHECK, Cowork will fill this in:

- [ ] **Skill 1: product-management:sprint-planning**
  - Status: ⏳ [PENDING / ✅ COMPLETE]
  - Capacity approved: ⏳ [YES / NO / CONDITIONAL]
  - Key finding: [Aliff has X hours available]
  - Blocker: ⏳ [CLEAR / BLOCKED]

- [ ] **Skill 2: engineering:architecture**
  - Status: ⏳ [PENDING / ✅ COMPLETE]
  - ADR: ⏳ [Link to findings]
  - JSON safe: ⏳ [YES / NO]
  - Zira safe: ⏳ [YES / NO]
  - Blocker: ⏳ [CLEAR / BLOCKED]

- [ ] **Skill 3: engineering:testing-strategy (IMPORT)**
  - Status: ⏳ [PENDING / ✅ COMPLETE]
  - Test matrix: ⏳ [X scenarios]
  - Validation rules: ⏳ [documented]
  - Blocker: ⏳ [CLEAR / BLOCKED]

- [ ] **Skill 4: engineering:testing-strategy (AUDIT)**
  - Status: ⏳ [PENDING / ✅ COMPLETE]
  - Test matrix: ⏳ [X scenarios]
  - Validation rules: ⏳ [documented]
  - Blocker: ⏳ [CLEAR / BLOCKED]

- [ ] **Skill 5: engineering:code-review**
  - Status: ⏳ [PENDING / ✅ COMPLETE]
  - Issues found: ⏳ [0 / X]
  - Data safety: ⏳ [SAFE / RISKY]
  - Readiness: ⏳ [CLEAR FOR TESTING / FIX FIRST]

---

## APPROVAL GATES

### Gate 1: After INIT_SKILL_CHECK (Before PHASE 1)

**Cowork checks:**
- [ ] All skills complete (Skill 1-5)
- [ ] No "BLOCKED" status
- [ ] No "DON'T PROCEED" warnings
- [ ] Capacity confirmed (Skill 1)
- [ ] Architecture validated (Skill 2)

**Cowork reports to Aliff:**
```
✅ INIT_SKILL_CHECK COMPLETE

Project: ApexProspect Patch 5
All skills executed: YES
Blockers found: NO
Recommendation: PROCEED TO PHASE 1

Aliff, type "continue" to proceed, or "stop" to halt.
```

**Aliff decision:** "continue" or "stop"

If **"continue":** Proceed to PHASE 1  
If **"stop":** Project halted, ask why

---

### Gate 2: After Code Review (Before PHASE 9 Testing)

**Cowork checks (after PHASE 1-8 complete):**
- [ ] Skill 5 (code-review) executed
- [ ] Data safety verdict: SAFE
- [ ] No blocking issues
- [ ] All issues (if any) fixed

**Cowork reports:**
```
✅ CODE REVIEW COMPLETE

Issues found: 0
Data safety: SAFE
Zira lead: PROTECTED
Readiness: GREEN FOR TESTING

Aliff, approve testing? ("continue" / "review findings")
```

**Aliff decision:** "continue" or ask for more info

---

### Gate 3: After Local Testing (Before Final Commit)

**Cowork checks (after PHASE 9A complete):**
- [ ] Test 1 (Import valid): ✅ PASS
- [ ] Test 2 (Import duplicates): ✅ PASS
- [ ] Test 3 (Invalid JSON): ✅ PASS
- [ ] Test 4 (Audit fields save): ✅ PASS
- [ ] Test 5 (Zira preserved): ✅ PASS

All 5/5 tests pass → Ready for final commit

**Cowork reports:**
```
✅ LOCAL TESTING COMPLETE

All 5 scenarios PASSED
Zira lead verified intact
No errors or regressions

Ready for final commit? ("continue" / "retest")
```

**Aliff decision:** "continue" or "retest"

---

## INTEGRATION WITH PHASES

**How skill outputs guide each phase:**

| Skill | Output | → Guides Phase |
|-------|--------|---|
| Skill 1 (capacity) | "8 hours available" | Phasing: split into 2-3 hour sessions |
| Skill 2 (architecture) | "JSON safe, no race condition" | PHASE 0: don't add file locking |
| Skill 3 (test import) | "8 test scenarios" | PHASE 1-4: code to pass all 8 |
| Skill 4 (test audit) | "7 test scenarios" | PHASE 5-8: code to pass all 7 |
| Skill 5 (code review) | "No issues, data safe" | PHASE 9: proceed to testing |

---

## CRITICAL DATA PROTECTION

**Zira Beauty Spa Lead**

Must be verified at these points:

- [ ] **Before PHASE 1:** Zira in leads.json? ✅ YES
- [ ] **After import (PHASE 4):** Zira still there? ✅ YES
- [ ] **After audit (PHASE 8):** Zira unchanged? ✅ YES
- [ ] **Before commit (PHASE 9B):** Zira intact? ✅ YES
- [ ] **After push:** Zira on GitHub? ✅ YES

If Zira is missing at ANY point: **IMMEDIATE ROLLBACK**

---

## SUCCESS CRITERIA

Project complete when:

- ✅ INIT_SKILL_CHECK passes (all skills green)
- ✅ All 9 phases complete without errors
- ✅ All test scenarios pass (import + audit + preservation)
- ✅ Code review: SAFE verdict
- ✅ Final commit pushed to GitHub
- ✅ Zira lead verified intact
- ✅ Aliff confirms functionality works in person

---

## TIMELINE

| Activity | Time | Gate |
|----------|------|------|
| INIT_SKILL_CHECK (5 skills) | 15 min | Gate 1: Continue? |
| PHASE 0 inspect | 5 min | |
| PHASE 1-4 import feature | 45 min | |
| PHASE 5-8 audit feature | 45 min | |
| Code review (Skill 5) | 10 min | Gate 2: Safe? |
| PHASE 9A local testing | 10 min | Gate 3: Pass? |
| PHASE 9B commit + push | 5 min | |
| **TOTAL** | **~2.5 hours** | |

Realistically: 2-3 work sessions (1-2 hours each)

---

## NOTES

- **First major patch** after Master Audit doctrine change — this proves the skill-first method works
- **Zira is live test client** — zero tolerance for data loss
- **ApexProspect is stepping stone** to ResponseOps upsell
- **Skills are non-negotiable** — every single one runs, no skipping

---

**This checklist is ACTIVE for Cowork PATCH 5 execution.**

**Cowork will reference this during INIT_SKILL_CHECK.**
