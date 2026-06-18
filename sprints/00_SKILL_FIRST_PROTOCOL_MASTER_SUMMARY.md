# SKILL-FIRST PROTOCOL: COMPLETE SETUP
# Master Summary & Quick Reference
# Created for: DealSense Projects + Claude Code (Cowork)

---

## 🎯 WHAT'S BEEN CREATED

5 core documents + 3 execution sprints + 1 quick guide:

### **Core Rule Documents** (Save to DealSense/cowork-rules/)

1. **COWORK_OPERATIONAL_RULES.md** ⭐⭐⭐
   - Master rulebook for how Cowork must operate
   - 15 rules covering: skill-first doctrine, data safety, approval gates, rollback
   - Reference: "When in doubt about how to execute, read this"
   - **Size:** ~4 KB, 200 lines

2. **INIT_SKILL_CHECK.md** ⭐⭐⭐
   - Initialization script that Cowork runs FIRST
   - 8-step process: acknowledge → identify project → locate checklist → request skills → review → report → wait for approval → pre-flight
   - Ensures no project starts without skill validation
   - **Size:** ~3 KB, 200 lines

3. **SKILL_CHECKLIST_TEMPLATE.md** ⭐⭐
   - Template for creating project-specific skill checklists
   - Shows what fields to fill for each skill
   - Copy + customize for any new project
   - **Size:** ~3 KB, 150 lines

### **Project-Specific Files**

4. **SKILL_CHECKLIST_APEXPROSPECT.md** ⭐⭐⭐
   - ApexProspect Patch 5 skill requirements
   - Lists 5 specific skills needed, with inputs + expected outputs
   - 3 approval gates (before PHASE 1, before testing, before commit)
   - Save to: `tools/semi-auto-outreach/sprints/`
   - **Size:** ~5 KB, 250 lines

### **Execution Sprints** (Ready for Cowork)

5. **SPRINT_APEXPROSPECT_PATCH_05.md**
   - Phase-by-phase execution WITHOUT skill integration
   - 9 phases: pre-check → implement → test → commit
   - Fast track, ~80 minutes
   - Good for routine patches after first one proves pattern
   - **Size:** ~6 KB, 400 lines

6. **SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md** ⭐⭐⭐
   - Phase-by-phase execution WITH skill integration
   - 9 phases + skill checkpoints before major work
   - Slower but safer: ~140 minutes
   - **RECOMMENDED for PATCH 5** (first major patch, Zira safety critical)
   - **Size:** ~7 KB, 450 lines

### **Quick Guides**

7. **SKILL_INTEGRATION_QUICK_GUIDE.md**
   - One-page reference for skill timing + purpose
   - Time breakdown per phase
   - When each skill runs
   - Quick decision tree
   - **Size:** ~4 KB, 200 lines

8. **HOW_TO_RUN_COWORK_WITH_SKILLS.md** ⭐⭐⭐
   - Step-by-step instructions for YOU (Aliff) to execute projects
   - Example interactions between you, Cowork, and Ith
   - Troubleshooting
   - Timeline expectations
   - **REQUIRED READING before first execution**
   - **Size:** ~6 KB, 350 lines

---

## 📁 FOLDER STRUCTURE (After Setup)

```
C:\Users\Selina\.claude\DealSense\

├── cowork-rules/                    ← NEW FOLDER
│   ├── COWORK_OPERATIONAL_RULES.md  ← Master rules (READ FIRST)
│   ├── INIT_SKILL_CHECK.md          ← Init script (Cowork runs this)
│   ├── SKILL_CHECKLIST_TEMPLATE.md  ← Template for new projects
│   └── HOW_TO_RUN_COWORK_WITH_SKILLS.md ← Instructions for Aliff (READ SECOND)
│
├── cowork-logs/                     ← NEW FOLDER (auto-created)
│   ├── APEXPROSPECT_PATCH_5_SKILL_CHECK_FINDINGS.md (auto-generated)
│   ├── APEXPROSPECT_PATCH_5_EXECUTION_LOG.md (auto-generated)
│   └── [future project logs]
│
├── 07_NexusLandingEngine/
│   ├── sprints/
│   │   ├── MEMORY.md
│   │   ├── MEMORY_FIX.md
│   │   ├── SKILL_CHECKLIST_NEXUS.md          ← Create for Nexus Phase 2
│   │   ├── SPRINT_FIX_COLOR.md
│   │   ├── SPRINT_OUTREACH_TOOL.md
│   │   ├── SPRINT_AUKIY_THEME.md
│   │   ├── SPRINT_OPERATOR_AUDIT.md
│   │   ├── SPRINT_ARCHITECTURE_LOCK.md
│   │   ├── BLUEPRINT_PHASE_GATE.md
│   │   ├── BLUEPRINT_DATA_SCHEMA.md
│   │   ├── BLUEPRINT_PROSPECTS_OPERATOR.md
│   │   └── [more sprints]
│   ├── pipeline/
│   ├── public/
│   └── tools/
│       └── semi-auto-outreach/
│           ├── sprints/
│           │   ├── SKILL_CHECKLIST_APEXPROSPECT.md  ← ApexProspect skills
│           │   ├── SPRINT_APEXPROSPECT_PATCH_05.md  ← Fast track (optional)
│           │   └── SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md ← Use this!
│           ├── server.js
│           ├── public/
│           │   ├── index.html
│           │   ├── app.js
│           │   └── style.css
│           └── data/
│               ├── leads.json
│               └── outreach-log.json
│
└── [other DealSense projects]
```

---

## 🚀 QUICK START (TL;DR)

### For Aliff (You)

**Before running PATCH 5:**

1. **Read these (5 min):**
   - `cowork-rules/COWORK_OPERATIONAL_RULES.md` (understand the rules)
   - `cowork-rules/HOW_TO_RUN_COWORK_WITH_SKILLS.md` (understand workflow)

2. **Copy files to DealSense folder (1 min):**
   - Download all 5 core documents
   - Save to: `DealSense/cowork-rules/`
   - Copy `SKILL_CHECKLIST_APEXPROSPECT.md` to `tools/semi-auto-outreach/sprints/`
   - Copy both SPRINT files to `tools/semi-auto-outreach/sprints/`

3. **Tell Cowork to start (1 min):**
   ```bash
   claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"
   ```

4. **Follow the protocol:**
   - Cowork runs INIT_SKILL_CHECK
   - You (as Ith) run 5 skills when Cowork asks (~15 min)
   - Approve with "continue" at gates
   - Cowork executes phases with skill guidance
   - Test locally (Cowork does this, you approve)
   - Final commit + done ✅

---

### For Cowork (Claude Code)

**You MUST do this:**

1. Before ANY project: Read `COWORK_OPERATIONAL_RULES.md`
2. At start of ANY sprint: Run `INIT_SKILL_CHECK.md` from beginning
3. Request Ith execute each skill in `SKILL_CHECKLIST_{PROJECT}.md`
4. Document all findings
5. Wait for approval gates before proceeding
6. Execute phases guided by skill outputs
7. Test thoroughly before final commit

**You MUST NOT do this:**

- Skip INIT_SKILL_CHECK
- Skip any required skill
- Proceed past a blocker warning
- Commit without approval
- Use blanket object merge (`{...obj}`)
- Assume data is safe without verification

---

## 📋 WHAT EACH FILE DOES

| File | Purpose | Read By | When |
|------|---------|---------|------|
| COWORK_OPERATIONAL_RULES.md | Master rules | Cowork + Aliff | Before everything |
| INIT_SKILL_CHECK.md | Initialization | Cowork | Start of every project |
| SKILL_CHECKLIST_TEMPLATE.md | For new projects | Aliff (to create new) | When adding new project |
| SKILL_CHECKLIST_APEXPROSPECT.md | PATCH 5 skills | Cowork + Aliff | Before PATCH 5 |
| SPRINT_APEXPROSPECT_PATCH_05.md | Fast execution | Cowork | Alternative path (optional) |
| SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md | Safe execution | Cowork | **USE THIS** for PATCH 5 |
| SKILL_INTEGRATION_QUICK_GUIDE.md | Reference | Aliff (bookmark) | Quick lookup |
| HOW_TO_RUN_COWORK_WITH_SKILLS.md | Instructions | Aliff (before running) | Before first execution |

---

## 🎯 APPROVAL GATES FOR PATCH 5

**You MUST approve at 3 gates:**

### Gate 1: INIT_SKILL_CHECK (Before PHASE 1)
Cowork runs all 5 skills → documents findings → asks: "Continue to PHASE 1?"

**You approve:** `continue` or `stop`

### Gate 2: CODE REVIEW (Before PHASE 9 Testing)
Cowork completes PHASE 1-8 → runs code-review → asks: "Code safe? Continue to testing?"

**You approve:** `continue` or `fix first`

### Gate 3: TESTING PASSED (Before Final Commit)
Cowork tests locally → 5 scenarios all pass → asks: "Ready for final commit?"

**You approve:** `continue` or `retest`

---

## ✅ CRITICAL CHECKPOINTS

**Before telling Cowork to start:**

- [ ] All 8 files downloaded to DealSense folder?
- [ ] cowork-rules/ folder exists with 4 files?
- [ ] SKILL_CHECKLIST_APEXPROSPECT.md in tools/semi-auto-outreach/sprints/?
- [ ] SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md in same sprints/ folder?
- [ ] Latest code committed to GitHub (backup)?
- [ ] You've read HOW_TO_RUN_COWORK_WITH_SKILLS.md?
- [ ] You understand the 3 approval gates?

**During execution:**

- [ ] Cowork acknowledges COWORK_OPERATIONAL_RULES?
- [ ] INIT_SKILL_CHECK completes without blockers?
- [ ] All 5 skills run successfully?
- [ ] You approve Gate 1 ("continue")?
- [ ] All PHASE 1-8 complete without errors?
- [ ] Code review says "SAFE"?
- [ ] You approve Gate 2 ("continue")?
- [ ] All 5 test scenarios pass?
- [ ] You approve Gate 3 ("continue")?
- [ ] Final commit pushed to GitHub?

**After execution:**

- [ ] Zira lead verified intact?
- [ ] All test scenarios passing?
- [ ] GitHub shows new commits?
- [ ] Execution log saved to cowork-logs/?
- [ ] You can start browser, test locally?

---

## 🔧 SKILL CHECKLIST (For Future Projects)

When you create a new project, use this template:

1. Copy `SKILL_CHECKLIST_TEMPLATE.md`
2. Fill in: project info, required skills, expected outputs
3. Save as: `SKILL_CHECKLIST_{PROJECT_NAME}.md`
4. Place in: project's `sprints/` folder
5. Cowork will find it during INIT_SKILL_CHECK

**Example for Nexus Phase 2:**

```
File: 07_NexusLandingEngine/sprints/SKILL_CHECKLIST_NEXUS.md

Skills needed:
1. sprint-planning (capacity check)
2. architecture (Cloudflare migration design)
3. testing-strategy (API endpoints)
4. data:analyze (landing page conversion metrics)
5. code-review (safety before deploment)
```

---

## 🚨 EMERGENCY ROLLBACK

If anything goes wrong:

```bash
cd tools/semi-auto-outreach
git reset --hard HEAD~1
git push -f
```

Then:
1. Report what broke
2. Cowork can retry that phase
3. Or defer project to next day

---

## 📊 WORKFLOW COMPARISON

### OLD WAY (Patch-on-Patch Problem)
```
Cowork: Code PATCH 5
→ Test in chat (incomplete)
→ Commit to GitHub
→ Aliff finds issue
→ "Need PATCH 5B"
→ Code PATCH 5B
→ Same issue appears again
→ "Need PATCH 5C"
[Endless cycle]
```

### NEW WAY (Skill-First Protocol)
```
Cowork: Run INIT_SKILL_CHECK
→ Execute 5 skills (complete analysis)
→ Gate 1: Aliff approves ("continue")
→ Code PHASE 1-8 (guided by test matrices)
→ Gate 2: Code review passes
→ Local testing (5 scenarios all pass)
→ Gate 3: Aliff approves final commit
→ Push to GitHub
[DONE, no surprises]
```

---

## 💡 PHILOSOPHY

**Why this matters:**

- **Before:** Hope code works → test → fix → patch
- **After:** Plan design → validate architecture → code to spec → test → confident commit

**Skill-first = fewer surprises = faster iteration = happier Aliff**

---

## 📞 SUPPORT

**If something is unclear:**

1. Check `COWORK_OPERATIONAL_RULES.md` (rules)
2. Check `HOW_TO_RUN_COWORK_WITH_SKILLS.md` (examples)
3. Check `SKILL_INTEGRATION_QUICK_GUIDE.md` (quick reference)

**If stuck during execution:**

- Cowork will say "STOP — waiting for approval" → you respond
- Don't be silent. Type your response (usually "continue").

**If a skill output is confusing:**

- Ask Ith to explain in simpler terms
- Get clarification before proceeding

---

## 🎬 READY TO START?

**Checklist before PATCH 5 execution:**

- [ ] Read COWORK_OPERATIONAL_RULES.md ✅
- [ ] Read HOW_TO_RUN_COWORK_WITH_SKILLS.md ✅
- [ ] Copy all 8 files to DealSense folder ✅
- [ ] Latest code backed up on GitHub ✅
- [ ] Cowork ready to execute ✅

**Then tell Cowork:**

```bash
claude "Execute sprints/SPRINT_APEXPROSPECT_PATCH_05_WITH_SKILLS.md"
```

**Cowork will do the rest.**

---

## 🌟 SUCCESS METRICS (After PATCH 5)

You'll know it worked if:

✅ INIT_SKILL_CHECK completed without blockers  
✅ All 5 skills provided valuable guidance  
✅ Code implemented to skill test matrices  
✅ All local tests passed (5/5)  
✅ Code review found zero data safety issues  
✅ Zira lead completely preserved  
✅ Final commit pushed to GitHub  
✅ No "PATCH 5B" needed  
✅ Confidence in production: HIGH  

---

**This is the new standard for DealSense development.**

**No more patch-on-patch cycles.**

**Skill-first, every time.**

🚀 **Ready to execute PATCH 5!**

---

**Last updated:** 2026-06-17  
**Status:** READY FOR PRODUCTION  
**Next step:** Download files → place in folders → tell Cowork to start
