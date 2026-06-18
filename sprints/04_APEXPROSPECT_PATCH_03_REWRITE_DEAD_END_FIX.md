# 04_APEXPROSPECT_PATCH_03_REWRITE_DEAD_END_FIX

ROLE:
You are Claude Code CLI.

PROJECT:
ApexProspect by AUKIY
Path: tools/semi-auto-outreach/
Localhost: 3777

MISSION:
Fix the REJECTED_NEEDS_REWORK dead-end so leads that need DM rewrite remain actionable.

DO NOT rewrite.
DO NOT refactor widely.
DO NOT add auto-send.
DO NOT break WhatsApp approval flow.
DO NOT break payment/revenue patch.
DO NOT break preview generation.
DO NOT manually edit live data files.

---

# CURRENT PATCH STATE

PATCH 1:
PASS — Preview Builder restored/confirmed.

PATCH 2:
PASS — Payment / revenue added.

Confirmed:

* paymentStatus
* dealValue
* paidAmount
* Mark Paid
* PAYMENT_RECEIVED event
* Revenue summary
* no auto-send

Now implement PATCH 3 only.

---

# PROBLEM

Current issue:

`handleNo()` or equivalent "No / Rewrite DM" action sets status:

```text
REJECTED_NEEDS_REWORK
```

But the system does not surface this lead properly in:

* pipeline tab
* Smart Panel
* next action
* operator priority

So the lead becomes stuck.

---

# BUSINESS GOAL

When Aliff rejects a DM draft, the system must clearly show:

```text
Rewrite DM and re-approve.
```

This allows the operator to continue:

Draft rejected
↓
Rewrite DM
↓
Approve again
↓
Open WhatsApp
↓
Manual send

---

# PATCH REQUIREMENTS

## 1. Next Action

Update next-action logic so:

```text
REJECTED_NEEDS_REWORK
```

returns:

```text
Rewrite DM and re-approve.
```

---

## 2. Smart Panel Visibility

Surface these leads in Smart Panel / priority system.

Suggested priority:

```text
P2 — Needs Rewrite
```

or nearest existing priority group.

The operator should not need to search manually.

---

## 3. Pipeline / Tab Visibility

Make sure `REJECTED_NEEDS_REWORK` appears in a useful tab.

Acceptable options:

* Needs Review
* Follow-up
* Draft Issues
* Active

Do NOT hide under UNKNOWN.

---

## 4. Timeline Event

When user rejects a DM draft / requests rewrite, log:

```text
DM_REWRITE_REQUESTED
```

Event payload should include:

* old status
* new status
* timestamp
* optional reason if available

If current handleNo() already logs another event, keep it and add/rename only if low risk.

---

## 5. Re-Approval Path

Ensure lead can move from:

```text
REJECTED_NEEDS_REWORK
```

back to:

```text
APPROVED_TO_SEND
```

or current approval status using existing approve flow.

Do not block approve buttons permanently.

---

## 6. UI Copy

Where status appears, use readable label:

```text
Needs DM Rewrite
```

Where next action appears:

```text
Rewrite DM and re-approve.
```

---

# VERIFICATION TEST

Use a safe test lead.

Flow:

1. Load lead.
2. Click reject/no/rewrite DM action.
3. Confirm status becomes `REJECTED_NEEDS_REWORK`.
4. Confirm timeline logs `DM_REWRITE_REQUESTED`.
5. Confirm Smart Panel shows the lead as needing rewrite.
6. Confirm next action says:
   `Rewrite DM and re-approve.`
7. Edit/rewrite DM.
8. Approve again.
9. Confirm WhatsApp flow still requires manual send.
10. Confirm no auto-send added.
11. Confirm payment/revenue fields still visible.
12. Confirm preview generation still works.

---

# REPORT BACK

Return:

## Files changed

## Exact changes made

## Smart Panel result

## Pipeline/tab result

## Timeline event result

## Re-approval test result

## Regression check

## Bugs found

## Next recommended patch

STOP after report.
