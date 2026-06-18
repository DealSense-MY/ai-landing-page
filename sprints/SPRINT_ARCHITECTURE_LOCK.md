# SPRINT_ARCHITECTURE_LOCK.md
# DealSense — Phase 2.5: Architecture Lock Review
# Run: claude "Execute sprints/SPRINT_ARCHITECTURE_LOCK.md"

## INSTRUCTION
This is a REVIEW-ONLY sprint.
Do NOT modify any files.
Do NOT create any files.
Do NOT refactor code.
Do NOT change UI or workflow.
Report and validate only.

Priority: Preserve working Zira Beauty Spa workflow.

---

## OBJECTIVE

Validate future architecture for:
- Multi-lead support
- Import leads
- Reply persistence
- Follow-up tracking
- Export capability

While keeping unchanged:
- Current UI
- Current approval flow
- Current WhatsApp behavior
- Current preview workflow

---

## PART 1 — JSON STORAGE DESIGN

Show exact proposed JSON structure:
- Example file
- Example lead object
- Required fields vs optional fields

Explain how structure supports 1 / 10 / 50 / 200 leads without a database.

---

## PART 2 — DATA FLOW DIAGRAM

Show exact flow (ASCII diagram):

```
Lead Import → Lead Storage → Preview → DM Draft
→ Approval → Open WhatsApp → Reply Notes
→ Follow-up → Export
```

Map each step to exact file/function responsible.

---

## PART 3 — RISK ANALYSIS

For each risk, provide severity (LOW / MEDIUM / HIGH / CRITICAL):

1. What can break?
2. What can corrupt data?
3. What can create duplicate leads?
4. What can create race conditions?
5. How will data be protected?

---

## PART 4 — JSON RACE CONDITION FIX

Explain:
- Current issue in server.js (read → modify → write pattern)
- Why dangerous under concurrent requests
- Exact proposed fix
- Files affected
- Expected impact

Do not implement.

---

## PART 5 — REPLY PERSISTENCE

Show:
- How reply notes are stored
- Where they live (which file/field)
- How they survive page refresh
- How they survive server restart

Do not implement.

---

## PART 6 — FOLLOW-UP TRACKING

Show how follow-up system works:
- Status model: NEW → PREVIEW_READY → APPROVED → SENT → REPLIED → FOLLOW_UP → INTERESTED → NOT_INTERESTED → CLOSED
- How follow-up dates are stored
- How status transitions are triggered
- Where data persists

Do not implement.

---

## PART 7 — IMPORT SYSTEM OPTIONS

Compare:

**Option A — JSON File Import**
**Option B — Manual Lead Form**

For each: speed, safety, lines of code required.

Recommend which to build first and why.

Do not implement.

---

## PART 8 — RESPONSEOPS REUSE CHECK

Scan all existing folders in project root.

Confirm if any of these already exist:
- Lead management
- Outreach tracking
- JSON persistence pattern
- Import/export
- Status tracking

If found: show exact location + reuse recommendation.
If not found: confirm clean build needed.

---

## PART 9 — IMPLEMENTATION ORDER

Provide exact build sequence ranked by:
- Lowest risk first
- Highest revenue impact
- Fastest implementation

Format:
```
Step 1: [task] — Risk: LOW | Impact: HIGH | Est: X min
Step 2: [task] — Risk: LOW | Impact: HIGH | Est: X min
Step 3: [task] — Risk: MEDIUM | Impact: HIGH | Est: X min
Step 4: [task] — Risk: MEDIUM | Impact: MEDIUM | Est: X min
Step 5: [task] — Risk: LOW | Impact: MEDIUM | Est: X min
```

---

## SAFETY RULES
- No code written
- No files modified
- No files created
- Architecture review only

STOP after all parts.
Wait for approval before any implementation.
