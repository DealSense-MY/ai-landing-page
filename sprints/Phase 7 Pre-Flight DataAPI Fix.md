You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Run Phase 7 Pre-Flight Data/API Fix.

Goal:
Fix the minimum required data/API issues before implementing Phase 7 Workflow Engine.

Do NOT implement Phase 7 yet.

---

CURRENT AUDIT FINDINGS

1. CRITICAL:
   Zira Beauty Spa has prospectStatus: "NEW" in leads.json even though she was contacted 2 days ago.

This will break Phase 7 Smart Action Panel because the follow-up overdue logic checks:

prospectStatus === "CONTACTED"

Fix:
Update Zira lead:

prospectStatus: "CONTACTED"

Do not change unrelated fields.

---

2. HIGH:
   PATCH /api/leads/:id in server.js does not yet accept these preview tracking fields:

* previewClicked
* previewClickCount
* lastPreviewClickedAt

Phase 7 "Mark Preview Sent" / tracking features may silently fail unless PATCH accepts and persists these fields.

Fix:
Extend PATCH /api/leads/:id allowlist/update logic to accept and save:

previewClicked
previewClickCount
lastPreviewClickedAt

Do not rewrite server.js.
Do not change unrelated API behavior.

---

3. DOC NAMING GAP:
   previewRenderer.js does not exist.

The audit spec referenced previewRenderer.js, but current renderer logic lives inline in app.js.

This is not a bug.

Do not create previewRenderer.js.
Do not refactor renderer files now.

Just mention this in report.

---

FILES TO INSPECT

* data/leads.json
* server.js
* public/app.js only if needed for field name confirmation

---

DO NOT MODIFY

* Phase 7 code
* workflow engine
* smart panel UI
* approval flow
* WhatsApp flow
* auto-send behavior
* DM copy
* preview generation logic
* tab logic
* import/export logic
* schedule logic

This is a surgical pre-flight patch only.

---

PATCH REQUIREMENTS

A) Update Zira record

Find lead:

id: "zira-beauty-spa-ipoh"

Set:

prospectStatus: "CONTACTED"

Keep existing contacted timestamp / last action fields untouched unless already present and obviously related.

Do not invent new timestamps unless required.

---

B) Extend PATCH /api/leads/:id

Allow these fields to be updated:

previewClicked
previewClickCount
lastPreviewClickedAt

Requirements:

* Preserve existing allowed fields
* Do not remove existing update support
* Do not break current PATCH behavior
* Do not add new npm packages
* Do not change response shape unless necessary

---

C) Verify

After patch, verify:

1. Zira lead now has prospectStatus: "CONTACTED"
2. GET /api/leads returns Zira as CONTACTED
3. PATCH /api/leads/zira-beauty-spa-ipoh accepts previewClicked
4. PATCH /api/leads/zira-beauty-spa-ipoh accepts previewClickCount
5. PATCH /api/leads/zira-beauty-spa-ipoh accepts lastPreviewClickedAt
6. Existing PATCH fields still work
7. Dashboard still loads at localhost:3777
8. No auto-send added
9. Approval/WhatsApp flow unchanged
10. No Phase 7 implementation started

---

REPORT FORMAT

Return:

1. Files inspected
2. Files changed
3. Zira old prospectStatus
4. Zira new prospectStatus
5. PATCH fields added
6. Test results
7. Confirmation:

   * Phase 7 not implemented
   * approval flow unchanged
   * WhatsApp flow unchanged
   * no auto-send added
   * no new npm packages
8. Note:

   * previewRenderer.js does not exist; renderer logic is inline in app.js; no refactor done

STOP.
