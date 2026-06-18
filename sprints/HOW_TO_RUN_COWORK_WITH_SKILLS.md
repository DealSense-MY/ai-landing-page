# HOW_TO_RUN_COWORK_WITH_SKILLS.md
# Instructions for Aliff to Execute Projects Using Skill-First Protocol
# File: DealSense/cowork-rules/HOW_TO_RUN_COWORK_WITH_SKILLS.md

## QUICK START

To execute **any project** with the new skill-first protocol:

```bash
claude "Execute sprints/[SPRINT_FILENAME] using skill-first protocol"
```

Cowork will automatically:
1. Read COWORK_OPERATIONAL_RULES
2. Run INIT_SKILL_CHECK
3. Request Ith execute all required skills
4. Document findings
5. Wait for your approval before PHASE 1
6. Execute phases with skill guidance
7. Verify everything before final commit

---

## FULL WORKFLOW (Step by Step for Aliff)

### Step 1: Prepare Project Folder

Before telling Cowork to run:

```bash
# Example for ApexProspect
C:\Users\Selina\.claude\DealSense\
├── cowork-rules/
│   ├── COWORK_OPERATIONAL_RULES.md     ← Master rules
│   ├── INIT_SKILL_CHECK.md             ← Init script
│   └── SKILL_CHECKLIST_TEMPLATE.md     ← For new projects
│
└── 07_NexusLandingEngine/
    └── tools/semi-auto-outreach/
        └── sprints/
            ├── SKILL_CHECKLIST_APEXPROSPECT.md    ← Project-specific
            └── SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md
```

**Checklist:**
- [ ] Sprint file exists? (SPRINT_*.md)
- [ ] Skill checklist exists? (SKILL_CHECKLIST_*.md)
- [ ] Both in correct folder (sprints/)?
- [ ] cowork-rules/ folder has the 3 master files?
- [ ] Latest code committed to GitHub?

---

### Step 2: Tell Cowork to Start

**Command format:**

```bash
claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md using skill-first protocol"
```

Or simply:

```bash
claude "Execute [SPRINT_FILENAME]"
```

(Cowork will recognize it's WITH_SKILLS version and auto-activate protocol)

---

### Step 3: Cowork Runs INIT_SKILL_CHECK

Cowork will print:

```
✅ COWORK_OPERATIONAL_RULES acknowledged
✅ Skill-first doctrine understood
✅ Initialization protocol active

PROJECT: ApexProspect Patch 5
SPRINT: SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md
SKILL_CHECKLIST: SKILL_CHECKLIST_APEXPROSPECT.md

Required skills (in order):
1. product-management:sprint-planning
2. engineering:architecture
3. engineering:testing-strategy (import)
4. engineering:testing-strategy (audit)
5. engineering:code-review

Requesting Ith to execute skills...
```

**Cowork will then ask Ith (Claude.ai in main chat):**

```
Ith, run skill: product-management:sprint-planning

Input: [detailed from SKILL_CHECKLIST]

Output needed: Realistic capacity hours, risk assessment
```

---

### Step 4: You (Ith) Respond with Skills

When Cowork asks for each skill, you (Ith) run it:

**Ith (you):**
```
Running skill: product-management:sprint-planning...
```

Then invoke the skill in Claude.ai and get the output. Copy the key findings back.

You'll do this for all 5 skills (takes ~10-15 minutes total).

---

### Step 5: Cowork Documents Findings

Cowork creates a findings document:

```
cowork-logs/APEXPROSPECT_PATCH_5_SKILL_CHECK_FINDINGS.md

Contents:
- Skill 1: sprint-planning → COMPLETE ✅ (capacity = 8 hours)
- Skill 2: architecture → COMPLETE ✅ (JSON safe, no race condition)
- Skill 3: testing-strategy (import) → COMPLETE ✅ (8 test scenarios)
- Skill 4: testing-strategy (audit) → COMPLETE ✅ (7 test scenarios)
- Skill 5: code-review → [pending, runs after PHASE 1-8]

APPROVAL GATE: Ready for PHASE 1?
[Waiting for Aliff approval...]
```

---

### Step 6: You Review & Approve

**You (Aliff) review findings:**

Are there any "DON'T PROCEED" warnings?
- If YES → Stop. Fix the issue. Have Cowork retry that skill.
- If NO → Approve with "continue"

**You type:**
```
continue
```

Cowork prints:
```
✅ Approval received

Ready to start PHASE 1

Project: ApexProspect Patch 5
Skill findings: All green ✅
Critical data: Zira lead [PROTECTED]
Next: PHASE 0 (pre-flight inspection)
```

---

### Step 7: Cowork Executes Phases

Cowork runs PHASE 0 (inspect), then PHASE 1:

```
═══ PHASE 1: ADD BATCH IMPORT ENDPOINT ═══

Reading skill findings...
Test matrix from Skill 3: [8 test scenarios documented]

Implementing:
- validateProspect() function
- normalizeImportedProspect() function
- POST /api/leads/import/batch endpoint

Coding guided by test scenarios...

✅ PHASE 1 COMPLETE
- Endpoint added
- Validation works
- No syntax errors

Commit: "feat: add batch import endpoint"
Pushing to GitHub...

✅ Pushed successfully

Cowork report:
- Endpoint added ✅
- Validation functions created ✅
- No errors ✅

STOP — waiting for "continue" before PHASE 2
```

**You type:** `continue`

Cowork continues to PHASE 2, etc.

---

### Step 8: Code Review (Mid-Execution)

After all phases code complete (PHASE 1-8), Cowork runs code review:

```
PHASE 9A: CODE REVIEW

Cowork: "Ith, run code review on all changes"

Ith (you): [run engineering:code-review skill]
→ Output: "No issues found, data safe ✅"

Cowork documents:
✅ Code review: SAFE
✅ No data loss risks
✅ Zira lead protected

STOP — waiting for approval before testing
```

**You type:** `continue`

Cowork proceeds to local testing.

---

### Step 9: Local Testing

Cowork starts server and runs 5 test scenarios:

```
✅ Test 1: Import 2 valid prospects → PASS
✅ Test 2: Import duplicates → PASS
✅ Test 3: Invalid JSON → PASS
✅ Test 4: Audit fields save → PASS
✅ Test 5: Zira preserved → PASS

5/5 PASS ✅

STOP — waiting for approval before final commit
```

**You type:** `continue`

---

### Step 10: Final Commit & Done

Cowork commits and pushes:

```
git commit -m "feat: patch 5 - batch import + safe audit

Verified by:
- product-management:sprint-planning (capacity OK)
- engineering:architecture (design safe)
- engineering:testing-strategy (test matrix passed)
- engineering:code-review (no data risk)
- Local testing (5/5 scenarios pass)
- Zira lead preserved ✅
"

git push

✅ PATCH 5 COMPLETE
✅ All tests passed
✅ Zira lead safe
✅ Code on GitHub
```

---

## EXECUTION SUMMARY

| Step | Time | Who | Action |
|------|------|-----|--------|
| 1 | 5 min | You (Aliff) | Prepare folders, confirm files exist |
| 2 | 1 min | You | Tell Cowork to start |
| 3 | 1 min | Cowork | Initialize, identify project |
| 4 | 10-15 min | You (Ith) | Run 5 skills for Cowork |
| 5 | 2 min | Cowork | Document findings |
| 6 | 5 min | You | Review + approve ("continue") |
| 7a | 45 min | Cowork | PHASE 0-4 (import feature) |
| 7b | 5 min | You | Review → "continue" |
| 7c | 45 min | Cowork | PHASE 5-8 (audit feature) |
| 8 | 5 min | You (Ith) | Run code-review skill |
| 9 | 10 min | Cowork | Test locally (5 scenarios) |
| 10 | 2 min | You | Approve → "continue" |
| 11 | 5 min | Cowork | Final commit + push |
| **TOTAL** | **~2.5 hours** | **Both** | **PATCH COMPLETE** |

---

## TYPICAL INTERACTION EXAMPLE

**You (Aliff):**
```
claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"
```

**Cowork:**
```
✅ Skill-first protocol active

Requesting Ith to run skills...
Ith, please execute:
1. product-management:sprint-planning (input: ...)
2. engineering:architecture (input: ...)
3. engineering:testing-strategy import (input: ...)
4. engineering:testing-strategy audit (input: ...)

[Waiting for skill outputs...]
```

**You (as Ith in Claude.ai main):**
```
Running skill: product-management:sprint-planning

[invoke skill in separate conversation]
[get output: capacity = 8 hours, all green]

Cowork, skill 1 complete:
- Capacity: 8 hours ✅
- Risk: LOW ✅
- Recommendation: PROCEED ✅

[continue with other skills...]
```

**Cowork (after all skills):**
```
✅ All skills complete

FINDINGS:
- Capacity: 8 hours (you have 10, GREEN ✅)
- Architecture: JSON safe (GREEN ✅)
- Test matrix import: 8 scenarios (READY ✅)
- Test matrix audit: 7 scenarios (READY ✅)

Ready for PHASE 1? [waiting for Aliff]
```

**You:**
```
continue
```

**Cowork:**
```
✅ Approved

PHASE 0: Pre-flight check...
PHASE 1: Add import endpoint...
[coding]
✅ PHASE 1 COMPLETE

Waiting for "continue" before PHASE 2
```

**You:**
```
continue
```

[Repeat for each phase]

**After PHASE 8:**

**You (as Ith):**
```
Running code-review skill...
[output: no issues, data safe]

Code review complete - safe to test ✅
```

**You:**
```
continue
```

**Cowork:**
```
PHASE 9: Testing...
✅ Test 1: PASS
✅ Test 2: PASS
✅ Test 3: PASS
✅ Test 4: PASS
✅ Test 5: PASS

Ready for final commit? [waiting]
```

**You:**
```
continue
```

**Cowork:**
```
✅ PATCH 5 COMPLETE
✅ All tests pass
✅ Zira safe
✅ Pushed to GitHub

Done!
```

---

## FOR FUTURE PROJECTS

Once PATCH 5 succeeds with this protocol:

**For PATCH 6 (and beyond):**

You can use the **FASTER VERSION** (skips some skill checks):

```bash
claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_06.md"
```

(Without `_WITH_SKILLS` suffix, Cowork will do simpler skill checks)

But **always use WITH_SKILLS for major patches** (first of its kind, critical data, new features).

---

## TROUBLESHOOTING

**Q: "Cowork is stuck waiting for me"**  
A: Type your response (usually "continue" or a skill output) in the Cowork conversation.

**Q: "Can I skip a skill?"**  
A: No. All skills in SKILL_CHECKLIST are mandatory. If you want to skip, edit the checklist first.

**Q: "A skill says DON'T PROCEED"**  
A: Stop. Report to Aliff. Fix the issue. Have Cowork retry that skill.

**Q: "Local testing fails"**  
A: Cowork will identify which test failed. You can:
- Have Cowork re-run that phase
- Or ask Cowork to debug (uses engineering:debug skill)

**Q: "I want to modify the sprint during execution"**  
A: Communicate with Cowork. Example: "Before PHASE 3, add a new validation rule..." Cowork will adjust if reasonable.

---

## KEY POINTS

1. **Skill-first is mandatory** — no exceptions for "urgent" projects
2. **Approval gates are real** — Cowork will wait for you to approve (usually "continue")
3. **Data safety first** — Zira lead (and all critical data) verified at every stage
4. **Phased execution** — each phase commits + pushes (no "oops, we broke something" surprises)
5. **Testing is final gate** — all test scenarios must pass before committing to GitHub

---

**You're now ready to execute any DealSense project with skill-first protocol.**

**Next step: Tell Cowork to start PATCH 5!** 🚀
