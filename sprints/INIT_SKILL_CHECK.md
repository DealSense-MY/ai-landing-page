# INIT_SKILL_CHECK.md
# Cowork Initialization Protocol - RUN THIS FIRST
# File: DealSense/cowork-rules/INIT_SKILL_CHECK.md

## INSTRUCTION FOR COWORK

You are about to start a project on DealSense.

**BEFORE you execute ANY sprint phase:**

Run this initialization protocol completely.

Do NOT skip. Do NOT skip ahead to PHASE 1.

This takes ~15-20 minutes and prevents everything from breaking later.

---

## STEP 1: ACKNOWLEDGE RULES

Print:
```
✅ COWORK_OPERATIONAL_RULES acknowledged
✅ Skill-first doctrine understood
✅ Initialization protocol active
✅ Ready to begin INIT_SKILL_CHECK
```

If you cannot acknowledge all 4, **STOP** and ask Aliff for clarification.

---

## STEP 2: IDENTIFY PROJECT & SPRINT

You should have been given:
- Project name (e.g., "ApexProspect")
- Sprint file (e.g., "SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md")

Print:
```
PROJECT: [name]
SPRINT: [filename]
LOCATION: [folder path]
```

If you cannot identify these, **STOP** and ask for them.

---

## STEP 3: LOCATE SKILL CHECKLIST

Look for file:
```
SKILL_CHECKLIST_{PROJECT}.md
```

Example locations:
```
tools/semi-auto-outreach/sprints/SKILL_CHECKLIST_APEXPROSPECT.md
07_NexusLandingEngine/sprints/SKILL_CHECKLIST_NEXUS.md
```

**If checklist exists:**
- Read it completely
- Note all required skills in order

**If checklist DOES NOT exist:**
- Print: "⚠️ SKILL_CHECKLIST_{PROJECT}.md not found"
- Ask Aliff: "Should I create one or use default?"
- **DO NOT PROCEED** until this is resolved

---

## STEP 4: REQUEST SKILL EXECUTION

For each skill in the checklist, ask Ith (Claude.ai):

```
Ith, run skill: [SKILL_NAME]

Input: [Copy from SKILL_CHECKLIST]

Output needed: [Copy from SKILL_CHECKLIST]
```

**Wait for Ith to complete.**

Ith will provide findings in the chat.

Record findings in a new document:
```
File: cowork-logs/[PROJECT]_SKILL_CHECK_FINDINGS.md

Contents:
---
PROJECT: [name]
DATE: [today]
SKILLS EXECUTED:

1. [SKILL_1_NAME]
   Status: ✅ COMPLETE
   Key findings: [summary]
   
2. [SKILL_2_NAME]
   Status: ✅ COMPLETE
   Key findings: [summary]
   
[... more skills ...]

APPROVAL GATE: READY FOR PHASE 1? [yes/no]
---
```

---

## STEP 5: REVIEW FINDINGS

After Ith provides all skill findings:

**For each skill, check:**

- ✅ Did it complete successfully?
- ✅ Are there any "DON'T PROCEED" warnings?
- ✅ Are there code changes needed before PHASE 1?

**If ANY skill says "DON'T PROCEED":**
- Print the warning clearly
- Do NOT continue to phases
- Ask Aliff for guidance

**If ALL skills say "PROCEED":**
- Continue to STEP 6

---

## STEP 6: REPORT FINDINGS TO ALIFF

Print:

```
═══════════════════════════════════════════════
INIT_SKILL_CHECK COMPLETE
═══════════════════════════════════════════════

PROJECT: [name]
SPRINT: [filename]
DATE: [today]

SKILLS EXECUTED:
 ✅ [Skill 1]: [Status]
 ✅ [Skill 2]: [Status]
 ✅ [Skill 3]: [Status]
 ...

KEY FINDINGS:
- [Finding 1]
- [Finding 2]
- [Finding 3]

RISKS IDENTIFIED:
- [Risk 1] → Mitigation: [what to do]
- [Risk 2] → Mitigation: [what to do]

APPROVAL GATE:
Ready to proceed to PHASE 1? WAITING FOR ALIFF APPROVAL

Aliff, type "continue" to proceed, or "stop" to halt.
═══════════════════════════════════════════════
```

**STOP HERE.**

Do NOT proceed to PHASE 1 without Aliff saying "continue".

---

## STEP 7: WAIT FOR APPROVAL

Aliff will review findings.

Aliff may say:
- **"continue"** → Proceed to PHASE 1
- **"stop"** → Halt project
- **"fix X and retry"** → Go back and fix specific issue

**Wait for explicit approval before proceeding.**

---

## STEP 8: PRE-FLIGHT CHECK (FINAL)

Before starting PHASE 1, verify:

- [ ] Latest code is on GitHub (backup safe)
- [ ] Skill checklist findings documented
- [ ] All "DON'T PROCEED" items resolved
- [ ] Aliff explicitly said "continue"
- [ ] You understand what PHASE 1 does

Print:
```
✅ PRE-FLIGHT CHECK COMPLETE
✅ All blockers resolved
✅ Ready to start PHASE 1
```

Now you can proceed to PHASE 1 in the sprint file.

---

## TROUBLESHOOTING

**Q: "SKILL_CHECKLIST file doesn't exist"**  
A: Create it. Use SKILL_CHECKLIST_TEMPLATE.md as template.

**Q: "Ith is busy, how long do I wait?"**  
A: Skills usually take 5-10 minutes per skill. Wait.

**Q: "A skill output says 'DON'T PROCEED'"**  
A: Stop. Report to Aliff. Don't continue without approval.

**Q: "I don't understand a skill finding"**  
A: Ask Ith to explain it in simpler terms. Get clarification before proceeding.

**Q: "Can I skip a skill to save time?"**  
A: No. The skill-first doctrine has no exceptions.

---

## TIME ESTIMATE

- Step 1: 1 min (acknowledgment)
- Step 2: 1 min (identify project)
- Step 3: 2 min (locate checklist)
- Step 4: 10-15 min (wait for Ith to run skills)
- Step 5: 2 min (review findings)
- Step 6: 1 min (report)
- Step 7: [varies] (wait for Aliff)
- Step 8: 1 min (final check)

**Total: ~15-20 minutes** (plus wait time for Ith & Aliff)

---

## CHECKLIST FOR COWORK

Before saying "ready to start PHASE 1":

- [ ] COWORK_OPERATIONAL_RULES read & acknowledged
- [ ] Project name identified
- [ ] Sprint file located
- [ ] SKILL_CHECKLIST_{PROJECT}.md found
- [ ] All required skills executed by Ith
- [ ] Findings documented in cowork-logs/
- [ ] No "DON'T PROCEED" warnings
- [ ] Aliff explicitly approved ("continue")
- [ ] GitHub backup confirmed
- [ ] Pre-flight check passed

If ANY checkbox is unchecked: **DO NOT PROCEED.**

---

## AFTER INIT COMPLETE: NEXT STEPS

Once Aliff approves ("continue"):

1. Read PHASE 1 of sprint file
2. Execute PHASE 1 exactly as written
3. After PHASE 1: commit → push → report
4. **STOP** (wait for "continue" to PHASE 2)
5. Repeat for each phase

This is the **phased execution model** that prevents regressions.

---

**This is your initialization checklist.**

**Use it before EVERY project.**

**No exceptions.**

**Aliff: Once Cowork finishes INIT_SKILL_CHECK, review findings and say "continue".**
