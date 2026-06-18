You are Claude Code CLI.

PROJECT:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\

TASK:
Proceed with Phase 7 — Workflow Engine Phase 2, with architecture corrections from Phase 1 audit.

Sprint file:
C:\Users\Selina.claude\DealSense\07_NexusLandingEngine\sprints\PHASE_7_WORKFLOW_ENGINE.md

Phase 1 audit is approved with corrections.

---

CRITICAL CORRECTIONS FROM PHASE 1

1. Smart Panel click behavior

Do NOT use scrollIntoView().

Reason:
Lead cards are not visible card nodes for scrolling. The current architecture uses modal rendering, and cards may live in hidden/template storage.

Correct behavior:
Smart Panel item click must call:

openCardModal(leadId)

The action should open the full lead modal for that lead.

---

2. FOLLOW_UP_SENT event gap

handleFollowUp() creates a follow-up draft/status but does not log FOLLOW_UP_SENT.

For Phase 7 Daily Tracker to count follow-ups correctly, add safe event logging only when follow-up is actually confirmed/sent, not when draft is merely created.

Do not auto-send.
Do not change WhatsApp send doctrine.

Expected doctrine:

* Draft follow-up = no FOLLOW_UP_SENT event yet
* Human confirms/sends follow-up = log FOLLOW_UP_SENT

If existing confirm-sent flow has enough context to detect follow-up status, use it carefully.
If not safe, report the gap before patching.

---

3. Zira test reality

Today is 2026-06-15.
Zira lastActionAt is 2026-06-14.
Zira should NOT appear as stale or follow-up overdue yet.

Do not force Zira into overdue state.

For manual test only, create or use a separate test lead if needed:

Workflow Test Spa
prospectStatus: CONTACTED
lastActionAt: 2026-06-08

This is only for testing stale/follow-up detection.
Do not corrupt real Zira data.

---

PHASE 2 GOAL

Implement Workflow Engine UI only.

Add:

* Smart Action Panel
* Daily Tracker UI
* Stale / Follow-up indicators
* Preview tracking indicator display
* Empty states for when no leads qualify

Do not implement heavy logic yet unless required for display wiring.

---

DO NOT MODIFY

* approval/WhatsApp flow
* auto-send rules
* DM copy
* preview generation logic
* import/export flow
* schedule logic
* locked CLOSED_WON behavior
* Phase 6D fixes

---

SMART PANEL REQUIREMENTS

Smart Panel should show action buckets such as:

1. Follow-up overdue
2. Stale leads
3. Preview sent / not clicked
4. Needs DM approval
5. Today’s scheduled actions

Each item must:

* show lead name
* show reason
* show recommended next action
* on click call openCardModal(leadId)

Do not use scrollIntoView().

---

DAILY TRACKER UI REQUIREMENTS

Show simple counters:

* DMs approved/sent today
* Follow-ups sent today
* Previews sent today
* Replies received
* Closed won
* Closed lost

If data is missing, show 0 honestly.

Do not invent activity.

---

EMPTY STATE REQUIREMENT

If Zira does not appear in overdue/stale, that is correct.

Show empty state like:

“No overdue follow-ups right now.”

Do not fake overdue data.

---

FILES LIKELY TO PATCH

* public/index.html
* public/app.js
* public/style.css

Only touch server.js if absolutely required for event/log support.

---

PHASE CONTROL

Implement Phase 2 UI only.

After implementation, report:

1. Files changed
2. Smart Panel UI added: yes/no
3. Daily Tracker UI added: yes/no
4. Smart Panel click uses openCardModal(id): yes/no
5. scrollIntoView not used: yes/no
6. Empty states implemented: yes/no
7. Approval/WA flow unchanged: yes/no
8. Auto-send not added: yes/no
9. Phase 6D fixes preserved: yes/no

Then STOP and print:

=== PHASE 2 COMPLETE — WAITING FOR HUMAN APPROVAL ===
