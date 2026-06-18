# PATCH_6_EXECUTE_LOCAL_PATH_RECOVERY.md

You are Claude Code.

PROJECT:
Landing Page PWA / Customer Acquisition System

ACTIVE CHANNEL:
13_BUILD_EXECUTION__APEXPROSPECT

MISSION:
Actually execute PATCH 6 Lock Hardening in the local repository.

IMPORTANT:
The previous attempt failed because you could not find `server.js`.
Do NOT create another plan.
Do NOT create another sprint file.
Do NOT create a bash script.
Do NOT use `/mnt/user-data/outputs/` as the target repo.
Do NOT say "ready" without patching.
First locate the real local project file, then patch it.

---

# TARGET APP

ApexProspect Operator PWA

Expected local app:
localhost:3777

Expected project area may be one of these, but do not assume blindly:

- DealSense/07_NexusLandingEngine/tools/semi-auto-outreach
- C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach
- C:\Users\Selina\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach

You must discover the real path.

---

# STEP 1 — LOCATE SERVER.JS

Run path discovery from the current workspace.

Use PowerShell or shell commands appropriate to the environment.

Suggested PowerShell commands:

```powershell
pwd
Get-ChildItem -Recurse -Filter server.js -ErrorAction SilentlyContinue | Select-Object FullName
Get-ChildItem -Recurse -Filter package.json -ErrorAction SilentlyContinue | Select-Object FullName
```

Find the `server.js` that contains ApexProspect routes.

Confirm by searching inside candidate files for:

- `PATCH /api/leads/:id`
- `mark-paid`
- `/api/leads/:id/events`
- `leads.json`
- `localhost:3777`

Suggested PowerShell search:

```powershell
Select-String -Path "FULL_PATH_TO_SERVER_JS" -Pattern "app.patch\('/api/leads/:id'|app.patch\(\"/api/leads/:id\"|mark-paid|/api/leads/:id/events|leads.json" -CaseSensitive:$false
```

If multiple `server.js` files exist:
Choose the one that contains both:
- `PATCH /api/leads/:id`
- `mark-paid`

If no file is found:
STOP and report:
- current working directory
- files/folders visible
- exact commands run
- request Aliff to open Claude Code in the correct project folder

Do not create scripts.

---

# STEP 2 — PATCH 6A

In the real ApexProspect `server.js`, find route:

`PATCH /api/leads/:id`

After the lead is found and before any mutation/write, add a full server-side lock guard.

Required behavior:

```js
if (lead.locked) {
  return res.status(403).json({
    success: false,
    error: 'Lead is locked',
    code: 'LEAD_LOCKED'
  });
}
```

Rules:
- Guard must be after lead existence check.
- Guard must be before any writes to status, reply, followUpDate, scheduleStatus, previewClicked, or other mutable fields.
- Preserve existing explicit field assignment.
- Do not refactor the full route.
- Do not block event route.
- Do not block amendment route if one exists.

---

# STEP 3 — PATCH 6B

In the same `server.js`, find route:

`POST /api/leads/:id/mark-paid`

Normalize the lock guard so ANY locked lead is blocked.

Required behavior:

```js
if (lead.locked) {
  return res.status(403).json({
    success: false,
    error: 'Lead is locked',
    code: 'LEAD_LOCKED'
  });
}
```

Rules:
- Guard must be after lead existence check.
- Guard must be before payment mutation.
- Remove or replace any weaker guard that only checks `CLOSED_WON` / `CLOSED_LOST`.
- Do not change payment behavior for unlocked leads.

---

# ROUTES NOT TO BLOCK

Do NOT add lock guard to:

`POST /api/leads/:id/events`

Reason:
Events should remain available for audit trail.

Do NOT block amendments endpoint if it exists.

Reason:
Locked records must still accept amendments/corrections.

---

# TESTING

After patching, run the app or verify existing app.

Minimum checks:

1. `localhost:3777` still loads.
2. Existing leads still load.
3. Locked lead direct PATCH returns HTTP 403.
4. Locked lead mark-paid returns HTTP 403.
5. Event route still works or is unchanged.
6. Unlocked lead workflow still works.
7. No auto-send was added.
8. WhatsApp flow unchanged.
9. No data loss.

If possible, use a locked test lead.

If no locked test lead exists:
Do not damage real data.
Either create a temporary test lead safely or report that manual locked-route testing requires a locked test lead.

---

# CURL / POWERSHELL TEST EXAMPLES

Adjust lead ID to a locked test lead.

PowerShell example:

```powershell
Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:3777/api/leads/LOCKED_TEST_ID" `
  -ContentType "application/json" `
  -Body '{"status":"REPLIED","replyText":"should not save"}'
```

Expected:
HTTP 403 with `LEAD_LOCKED`.

Mark paid example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3777/api/leads/LOCKED_TEST_ID/mark-paid" `
  -ContentType "application/json" `
  -Body '{"amount":397,"paymentStatus":"PAID"}'
```

Expected:
HTTP 403 with `LEAD_LOCKED`.

---

# REPORT FORMAT

Return:

# PATCH 6 LOCAL EXECUTION REPORT

1. Current working directory
2. server.js discovered path
3. Files changed
4. Exact routes changed
5. Old behavior
6. New behavior
7. Locked PATCH test result
8. Locked mark-paid test result
9. Event route unchanged confirmation
10. Amendment route unchanged confirmation if applicable
11. Unlocked lead regression result
12. localhost:3777 verification
13. WhatsApp safety confirmation
14. No auto-send confirmation
15. Any issue found
16. Recommended next action

STOP AFTER REPORT.

Do not create another sprint file.
Do not deploy.
Do not implement AI provider.
Do not touch Nexus cf-version.
Do not ask for API keys.
