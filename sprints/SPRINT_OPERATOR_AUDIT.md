# SPRINT_OPERATOR_AUDIT.md
# DealSense — Full Audit: Operator Lite Architecture + UI + Scalability
# Run: claude "Execute sprints/SPRINT_OPERATOR_AUDIT.md"

## INSTRUCTION
This is an AUDIT-ONLY sprint.
Do NOT modify any files.
Do NOT write any code.
Report only. Wait for approval before any implementation.

---

## YOUR ROLE
- Senior Product Architect
- Senior UI Designer
- Senior Systems Auditor

---

## PHASE 1 — RESPONSEOPS REUSE AUDIT

Scan these folders for anything reusable:
- tools/
- tools/semi-auto-outreach/
- Any ResponseOps folders if they exist

For each reusable asset found, report:
| Name | Location | Purpose | Reuse Score (1-10) | Recommendation |

Look for reusable modules in these categories:
1. Lead Management / CRM-style tracking
2. JSON storage patterns
3. Prompt generation
4. Follow-up tracking
5. Import / Export
6. Status management
7. Semi-auto outreach patterns

STOP after Phase 1 if instructed. Otherwise continue.

---

## PHASE 2 — CURRENT OPERATOR LITE ARCHITECTURE AUDIT

Read these files:
- tools/semi-auto-outreach/server.js
- tools/semi-auto-outreach/data/leads.json
- tools/semi-auto-outreach/public/app.js
- tools/semi-auto-outreach/public/index.html

Answer:
1. Where is lead data stored?
2. Is data hardcoded or JSON-persisted?
3. Is there import capability?
4. Is there export capability?
5. Is there multi-lead support?
6. Is there follow-up date tracking?
7. Is there reply tracking?
8. Is there status persistence across refresh?

Current architecture bottlenecks:
- What breaks if leads > 20?
- What's missing for real outreach workflow?
- What's hardest to maintain right now?

Show simple architecture diagram (ASCII is fine).

---

## PHASE 3 — FASTEST SCALABLE ARCHITECTURE DESIGN

Design the fastest path from current single-lead demo to multi-lead operator.

Requirements:
- Local-first
- No database required
- JSON-based persistence
- Human approval preserved
- Easy migration later

Recommend:
- Folder structure changes (if any)
- Updated lead data structure (see schema below)
- Status model
- Follow-up model
- Import model (JSON file / paste JSON / manual form)
- Export model (JSON + CSV)

Recommended lead schema:
```json
{
  "id": "",
  "name": "",
  "location": "",
  "niche": "",
  "platform": "",
  "contact": "",
  "whatsapp": "",
  "profileUrl": "",
  "weakness": "",
  "offer": "",
  "previewPath": "",
  "screenshotPath": "",
  "status": "",
  "dmDraft": "",
  "followUpDraft": "",
  "replyStatus": "",
  "lastContactedAt": "",
  "nextFollowUpAt": "",
  "replyNotes": "",
  "importantData": "",
  "createdAt": "",
  "updatedAt": ""
}
```

Status model to support:
NEW → PREVIEW_READY → APPROVED → SENT → REPLIED → FOLLOW_UP → INTERESTED → NOT_INTERESTED → CLOSED

Show architecture diagram.

---

## PHASE 4 — UI POLISH AUDIT

Read tools/semi-auto-outreach/public/style.css

Current estimated score: 9.2/10
Target: 9.7/10

Audit and report issues in:

**Label/Value Hierarchy**
- Labels (LOKASI, NICHE, WHATSAPP) — are they visually distinct from values?
- Values (Ipoh, Beauty Spa, 601xxx) — are they easy to scan?
- Target: labels smaller + muted, values brighter + easier to read

**Header**
- Should it remain "DealSense Operator Lite" or become "AUKIY Outreach Console"?
- Recommendation with reasoning.

**Status Display**
- Should APPROVED_TO_SEND display as "APPROVED" (shorter)?
- Impact on app.js if changed?

**Preview Path**
- Currently shows full Windows path — should show filename only
- How to implement without breaking internal logic?

**DM Textarea**
- Any readability improvements needed?

**Visual Noise**
- List any elements that add noise without value
- Recommend remove or reduce

Report only. No code changes.

---

## PHASE 5 — IMPLEMENTATION ROADMAP

Rank all improvements by:
- Maximum revenue/outreach impact
- Minimum development effort
- Fastest path to execution

Format:

**Priority 1 — High Impact, Low Effort**
[list items]

**Priority 2 — High Impact, Medium Effort**
[list items]

**Priority 3 — Medium Impact, High Effort**
[list items]

---

## PHASE 6 — EXACT FILES TO MODIFY

List exact files, exact changes needed, in order of execution.

Format:
```
FILE: tools/semi-auto-outreach/public/style.css
CHANGES: [list]

FILE: tools/semi-auto-outreach/public/app.js
CHANGES: [list]

FILE: tools/semi-auto-outreach/server.js
CHANGES: [list]
```

---

## SAFETY RULES
- Never auto-send messages
- Never bypass human approval
- Never remove WhatsApp approval flow
- Prefer simple, local, reliable over complex, automated, fragile

---

STOP after all phases.
Do NOT modify any files.
Wait for "continue" + approval before any implementation.
