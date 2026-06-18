# COWORK_OPERATIONAL_RULES.md
# Master Rules for Claude Code (Cowork) Execution
# Saved in: DealSense/cowork-rules/COWORK_OPERATIONAL_RULES.md

> **DIPECAHKAN:** Rules dalam fail ini telah dipecah jadi skill berasingan
> di `DealSense/skill-library/cowork-skills/`. Fail ini dikekal sebagai
> rujukan sejarah/lengkap sahaja. Untuk kerja sebenar, load skill spesifik
> dari folder cowork-skills/ ikut keperluan, bukan fail ini.

## STATUS: REFERENCE ONLY (superseded by cowork-skills/) 🟡

This is the **master rulebook** for how Claude Code must operate on DealSense projects.

All sprints inherit these rules. No exceptions.

---

## RULE 1: SKILL-FIRST DOCTRINE

**BEFORE executing ANY sprint/project/patch:**

1. Cowork MUST read the project's **skill checklist**
2. Cowork MUST request Ith run each required skill
3. Cowork MUST wait for Ith to provide skill findings
4. Cowork MUST document all skill outputs
5. **ONLY THEN** proceed to execution phases

**Why:** Prevents bugs, regressions, data loss, and patch-on-patch cycles.

---

## RULE 2: INITIALIZATION PROTOCOL (ALWAYS FIRST)

Before PHASE 1 of ANY sprint:

```
STEP 1: Cowork reads COWORK_OPERATIONAL_RULES.md (this file)
STEP 2: Cowork identifies project folder + sprint file
STEP 3: Cowork checks if SKILL_CHECKLIST_{PROJECT}.md exists
STEP 4: Cowork requests Ith execute INIT_SKILL_CHECK.md
STEP 5: Ith runs all required skills
STEP 6: Ith provides findings document
STEP 7: Cowork reviews findings + reports to Aliff
STEP 8: Aliff approves ("continue") → PHASE 1 begins
```

**This is non-negotiable.** No exceptions for "urgent" or "simple" projects.

---

## RULE 3: PROJECT FOLDER STRUCTURE

All DealSense projects follow this structure:

```
C:\Users\Selina\.claude\DealSense\
├── cowork-rules/                    ← NEW
│   ├── COWORK_OPERATIONAL_RULES.md  ← This file
│   ├── INIT_SKILL_CHECK.md          ← Initialization script
│   └── SKILL_CHECKLIST_TEMPLATE.md  ← For creating project checklists
│
├── 07_NexusLandingEngine/
│   ├── sprints/
│   │   ├── MEMORY.md
│   │   ├── SKILL_CHECKLIST_NEXUS.md ← Project-specific
│   │   └── SPRINT_*.md
│   ├── pipeline/
│   ├── public/
│   └── tools/
│       └── semi-auto-outreach/      ← ApexProspect
│           ├── sprints/
│           │   └── SKILL_CHECKLIST_APEXPROSPECT.md
│           ├── server.js
│           ├── public/
│           └── data/
│
└── cowork-logs/                     ← NEW
    ├── PATCH_5_SKILL_CHECK_FINDINGS.md
    ├── PATCH_5_EXECUTION_LOG.md
    └── ...
```

---

## RULE 4: SKILL CHECKLIST REQUIREMENT

Every project MUST have a `SKILL_CHECKLIST_{PROJECT}.md` file.

This defines:
- Which skills are required
- In what order
- What outputs are expected
- How outputs guide implementation

Example:
```
Project: ApexProspect Patch 5
File: tools/semi-auto-outreach/sprints/SKILL_CHECKLIST_APEXPROSPECT.md

Skills (in order):
1. product-management:sprint-planning → Realistic capacity
2. engineering:architecture → Design validation
3. engineering:testing-strategy → Test matrix for import
4. engineering:testing-strategy → Test matrix for audit
5. engineering:code-review → Safety check
6. productivity:memory-management → Document completion
```

Cowork uses this to know exactly which skills to request.

---

## RULE 5: EXECUTION GUARDRAILS

During any execution:

✅ **DO:**
- Read skill outputs carefully
- Incorporate findings into code
- Test against skill-provided test matrices
- Commit after each phase
- Report status clearly
- Stop and wait for "continue"

❌ **DON'T:**
- Skip skill checks (even if "urgent")
- Ignore skill warnings
- Code without test matrix guidance
- Merge objects with `...spread` operator
- Deploy without code review
- Assume data is safe without verification

---

## RULE 6: DATA SAFETY RULES

For any project touching data (leads.json, databases, etc):

1. **Before any code:** Run `engineering:architecture` to validate design
2. **Before any endpoint:** List data mutations in skill checklist
3. **During code:** Use explicit field assignment (no blanket merge)
4. **After code:** Run `engineering:code-review` to audit safety
5. **Before commit:** Verify "important lead" (Zira) is untouched
6. **After commit:** Log verification in execution log

**Golden Rule:** If data structure changes, you **MUST** get architecture review.

---

## RULE 7: COMMIT MESSAGE FORMAT

Every commit MUST include:

```
git commit -m "feat/fix: [feature name]

[Description of changes]

Verified by:
- [SKILL 1]: [brief output]
- [SKILL 2]: [brief output]
- Local testing: [X/X scenarios pass]
- Data safety: [verified/issues found]
"
```

This documents which skills validated each commit.

---

## RULE 8: STOP CONDITIONS

Cowork MUST STOP and report (without proceeding) if:

- [ ] Data loss risk detected (even potential)
- [ ] Syntax error in any file
- [ ] Zira lead or critical data missing
- [ ] Skill output says "do not proceed"
- [ ] Test scenario fails
- [ ] Commit push fails
- [ ] Any file unreadable or corrupted

**When stopped:** Report exact error + which phase → wait for Aliff approval to continue/rollback.

---

## RULE 9: SKILL INTEGRATION CADENCE

| Project Size | Skill Check Frequency |
|---|---|
| **Bug fix (<1 hour)** | Before + After |
| **Small patch (2-3 hours)** | Before + Every 2 phases + After |
| **Major patch (4+ hours)** | Before + Every phase + After |
| **New feature (6+ hours)** | Before + Every phase + Code review + After |

For PATCH 5: Major patch → skill checks before every 2 phases + code review before testing.

---

## RULE 10: MEMORY & DOCUMENTATION

After every completed sprint:

1. Cowork generates **EXECUTION_LOG** (what happened, errors, fixes)
2. Cowork requests Ith run `productivity:memory-management` 
3. Ith updates memory with completion status
4. Log saved to: `cowork-logs/[PROJECT]_[PHASE]_LOG.md`

This creates an audit trail + future reference.

---

## RULE 11: ROLLBACK PROTOCOL

If execution fails at any point:

```
1. Cowork reports: "PHASE X failed, reason: [error]"
2. Aliff decides: "Fix and retry" OR "Rollback"
3. If rollback:
   git reset --hard HEAD~[N commits to undo]
   git push -f
4. Cowork reports rollback complete
5. Aliff can retry PHASE X or defer project
```

All rollbacks logged in execution log.

---

## RULE 12: APPROVAL GATES

Cowork MUST get Aliff approval ("continue") at these gates:

- ✋ After INIT_SKILL_CHECK (before PHASE 1)
- ✋ After CODE_REVIEW (before PHASE 9 testing)
- ✋ After LOCAL_TESTING (before final commit)

No gate = no proceed. This is non-negotiable.

---

## RULE 13: PROJECT PRIORITY

Cowork honors project sequencing:

1. **Highest:** Nexus Landing Engine (revenue path)
2. **High:** ApexProspect (operator workflow)
3. **Medium:** ResponseOps (future upsell prep)
4. **Low:** DarkUser tools (bonus)

If Aliff says "start PATCH 5", Cowork starts PATCH 5 (don't do other projects until it's done).

---

## RULE 14: COMMUNICATION PROTOCOL

Cowork reports status in this format:

```
✅ INIT_SKILL_CHECK complete
   - sprint-planning: GREEN (8 hours estimated)
   - architecture: GREEN (no risks)
   - testing-strategy (import): GREEN (5 test scenarios)
   - testing-strategy (audit): GREEN (4 test scenarios)

Ready for PHASE 1? [waiting for "continue"]
```

Clear, scannable, no fluff.

---

## RULE 15: FAILURE MODES & RECOVERY

**Scenario 1: Skill output says "DON'T PROCEED"**
- Cowork stops
- Reports blocker + recommendation
- Waits for Aliff to unblock

**Scenario 2: Test fails**
- Cowork identifies which phase caused it
- Cowork re-runs that phase with fix
- Re-tests
- If still fails → report to Aliff

**Scenario 3: Data corruption detected**
- Cowork IMMEDIATELY rolls back
- Reports data corruption + scope
- Waits for Aliff safety review
- Does NOT proceed without explicit approval

---

## SETUP CHECKLIST FOR ALIFF

Before any sprint execution:

- [ ] Read COWORK_OPERATIONAL_RULES.md (this file)
- [ ] Confirm project has SKILL_CHECKLIST_{PROJECT}.md
- [ ] Confirm sprints/ folder has skill checklist
- [ ] Confirm cowork-logs/ folder exists (for execution logs)
- [ ] Confirm latest code backed up on GitHub
- [ ] Tell Cowork: "Execute [SPRINT_FILE] using skill-first protocol"

---

## ACTIVATION

**This rulebook is ACTIVE effective immediately.**

All future Cowork executions must follow these rules.

For existing projects (Nexus, ApexProspect):
- Create skill checklists
- Cowork will re-initialize with skill checks on next sprint

---

## COWORK ACKNOWLEDGMENT

When Cowork starts any sprint, it must report:

```
✅ COWORK_OPERATIONAL_RULES acknowledged
✅ Skill-first doctrine understood
✅ Initialization protocol active
✅ Ready to proceed with INIT_SKILL_CHECK
```

If Cowork does NOT acknowledge, **do not proceed**. Ask Aliff to clarify rules.

---

**Last Updated:** 2026-06-17  
**Authority:** Aliff (DealSense founder)  
**Status:** ACTIVE 🟢  
**Version:** 1.0
