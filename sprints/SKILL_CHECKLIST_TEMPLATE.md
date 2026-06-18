# SKILL_CHECKLIST_TEMPLATE.md
# Template for Project-Specific Skill Checklists
# File: DealSense/cowork-rules/SKILL_CHECKLIST_TEMPLATE.md

## HOW TO USE THIS TEMPLATE

For each new sprint/project, create a file:
```
SKILL_CHECKLIST_{PROJECT_NAME}.md
```

Copy this template and fill in the blanks.

Example:
```
SKILL_CHECKLIST_NEXUS.md
SKILL_CHECKLIST_APEXPROSPECT.md
SKILL_CHECKLIST_RESPONSEOPS.md
```

Place it in the project's `sprints/` folder.

---

## TEMPLATE START HERE ↓

---

# SKILL_CHECKLIST_[PROJECT_NAME]
# DealSense Project Skill Requirements
# File: [PROJECT_FOLDER]/sprints/SKILL_CHECKLIST_[PROJECT_NAME].md

## PROJECT INFO

**Project Name:** [e.g., "ApexProspect Patch 5"]  
**Objective:** [What is this project trying to accomplish?]  
**Owner:** [Aliff / Team]  
**Sprint File:** [e.g., "SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"]  
**Estimated Duration:** [e.g., "2-3 hours total, phased over 2 days"]  
**Critical Data:** [What data absolutely cannot be lost? e.g., "Zira lead, leads.json"]  
**Risk Level:** [LOW / MEDIUM / HIGH]  

---

## SKILLS REQUIRED

List each skill in execution order. Cowork will request Ith run them in this order.

### SKILL 1: [NAME]

```
Skill ID: [e.g., "product-management:sprint-planning"]

Input Parameters:
- Project: [name]
- Duration: [e.g., "1 week"]
- Team: [e.g., "1 (Aliff)"]
- Other projects this week: [list]
- Constraints: [e.g., "Must preserve Zira lead"]

Expected Output:
- Realistic capacity hours for this project
- What else fits in the same week
- Risk assessment
- Recommended approach

Use In Phase: [e.g., "PRE (before PHASE 1)"]

Blocker Risk: [YES / NO]
(If YES, and skill says "don't proceed", project is blocked)
```

### SKILL 2: [NAME]

```
Skill ID: [e.g., "engineering:architecture"]

Input Parameters:
- Current state: [describe existing system]
- New changes: [describe what you're adding]
- Data mutations: [what data will change?]
- Migration concerns: [any future scaling considerations?]

Expected Output:
- Architecture Decision Record (ADR)
- Trade-offs documented
- Risk assessment
- Mitigation recommendations

Use In Phase: [e.g., "PRE (before PHASE 1)"]

Blocker Risk: [YES / NO]
```

### SKILL 3: [NAME]

```
Skill ID: [e.g., "engineering:testing-strategy"]

Input Parameters:
- Feature: [name the feature being built]
- Requirements: [list key requirements]
- Data contracts: [what endpoints, data models?]
- Edge cases: [any special scenarios?]

Expected Output:
- Test matrix (inputs → expected outputs)
- Validation rules per field
- Edge cases to handle
- Error scenarios

Use In Phase: [e.g., "Before PHASE 1-4 (import feature)"]

Blocker Risk: [NO]
(Test strategy guides code, doesn't block it)
```

### SKILL N: [NAME]

```
[Follow same format]
```

---

## SKILL EXECUTION CHECKLIST

During INIT_SKILL_CHECK, Cowork will mark these:

- [ ] Skill 1: [NAME] - Status: ✅ COMPLETE
  - Key findings: [summary]
  - Any "DON'T PROCEED" warnings? [YES / NO]
  
- [ ] Skill 2: [NAME] - Status: ✅ COMPLETE
  - Key findings: [summary]
  - Any "DON'T PROCEED" warnings? [YES / NO]

- [ ] Skill N: [NAME] - Status: ✅ COMPLETE
  - Key findings: [summary]
  - Any "DON'T PROCEED" warnings? [YES / NO]

---

## FINDINGS INTEGRATION

How will each skill's output guide implementation?

**Skill 1 → Output:** Capacity = 8 hours  
**Integration:** Cowork knows to split project into phases of 2-3 hours each

**Skill 2 → Output:** "No race condition risk, JSON safe"  
**Integration:** Cowork doesn't add file locking, proceeds with simpler design

**Skill 3 → Output:** Test matrix with 5 scenarios  
**Integration:** Cowork codes PHASE 1-4 to pass these exact 5 test scenarios

---

## CRITICAL GATES (APPROVAL REQUIRED)

These are points where Cowork MUST wait for Aliff approval:

- [ ] **After INIT_SKILL_CHECK** (before PHASE 1)
  - Aliff reviews all skill findings
  - Aliff says "continue" or "stop"

- [ ] **After Code Review** (before PHASE 9 testing)
  - Ith runs `engineering:code-review`
  - Aliff approves code safety
  - Aliff says "continue" or "fix first"

- [ ] **After Local Testing** (before final commit)
  - All test scenarios pass
  - Aliff approves test results
  - Aliff says "continue" or "retest"

---

## ROLLBACK CRITERIA

If any of these happen, Cowork MUST stop and report:

- Data loss detected (even potential)
- Skill output says "DON'T PROCEED"
- Test scenario fails
- Syntax error in code
- [PROJECT]-specific critical data missing

Example: If Zira lead disappears, **IMMEDIATE ROLLBACK** required.

---

## TIMELINE ESTIMATE

| Phase | Time | Skill Guidance |
|-------|------|---|
| INIT_SKILL_CHECK | 15 min | All required skills |
| PHASE 1-4 | 45 min | Skill 3 (test matrix) |
| PHASE 5-8 | 45 min | Skill 3 (test matrix) |
| PHASE 9 | 15 min | Code review + testing |
| TOTAL | ~2 hours | All skills inform each phase |

---

## SUCCESS CRITERIA

Project is successful when:

- [ ] All phases complete without errors
- [ ] All test scenarios pass
- [ ] Code review passes
- [ ] All commits pushed to GitHub
- [ ] Critical data (Zira lead, etc.) intact
- [ ] Aliff confirms functionality in person

---

## NOTES

[Any special considerations for this project?]

Example:
- "First patch after Master Audit doctrine — prove skill-first works"
- "Zira is live test client — zero tolerance for data loss"
- "This enables ResponseOps upsell — quality critical"

---

## TEMPLATE END

---

## HOW TO CREATE SPECIFIC CHECKLIST

1. Copy this template
2. Replace all `[BRACKETED_TEXT]` with project specifics
3. List each required skill
4. For each skill, fill in Input + Expected Output
5. Save as `SKILL_CHECKLIST_{PROJECT}.md` in project's `sprints/` folder
6. Cowork reads this during INIT_SKILL_CHECK
7. Cowork requests Ith run each skill in order

---

## EXAMPLE: ApexProspect Patch 5

See: `SKILL_CHECKLIST_APEXPROSPECT.md` (next file)

This is what a completed checklist looks like.
