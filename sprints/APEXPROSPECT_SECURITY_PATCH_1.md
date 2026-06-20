# APEXPROSPECT SECURITY PATCH 1

# OPERATOR PASSWORD + API WRITE GUARD + LOCAL BACKUP

ROLE:
You are Claude Code working on ApexProspect by AUKIY.

PROJECT PATH:
C:\Users\Selina\.claude\DealSense\07_NexusLandingEngine\tools\semi-auto-outreach\

SERVER:
localhost:3777

MISSION:
Add minimum security protection before the operator dashboard is exposed through ngrok / phone testing.

DO NOT:

* redesign the app
* refactor globally
* add SaaS login
* add user accounts
* add database
* add OAuth
* add external auth service
* break current localhost workflow
* break WhatsApp approval flow
* add auto-send

CORE RULES:

* No auto-send
* Human approval required
* WhatsApp opens only
* Operator manually presses send
* Preserve all existing working features
* Patch only

CURRENT RISK:
ApexProspect has no login gate. If exposed via ngrok, anyone with the URL could access prospect data or trigger write actions.

GOAL:
Add simple operator protection suitable for MVP.

---

## PATCH A — ENV PASSWORD

Add support for:

APEX_OPERATOR_PASSWORD

Use .env if already supported.
If dotenv is not installed, install/use dotenv safely only if needed.

Default behavior:

* If APEX_OPERATOR_PASSWORD is not set, allow localhost development but show console warning:
  "WARNING: APEX_OPERATOR_PASSWORD not set. Dashboard is unprotected."

Do not hardcode password.

---

## PATCH B — SIMPLE PASSWORD GATE

Protect dashboard access.

Requirement:
When operator opens dashboard:

* If authenticated, show normal app.
* If not authenticated, show simple password screen.

Implementation can be simple:

* POST /api/operator-login
* Body: { password: "..." }
* If correct, set httpOnly cookie or session token.
* If wrong, return 401.

Preferred:
Use secure httpOnly cookie if simple.

If cookie/session is too big for patch:
Use localStorage token only as fallback, but explain risk in report.

---

## PATCH C — PROTECT WRITE API ROUTES

All write/mutation routes must require operator auth.

Protect at minimum:

* POST /api/leads
* PATCH /api/leads/:id
* PATCH /api/leads/:id/audit
* POST /api/leads/:id/mark-paid
* POST /api/leads/:id/archive
* POST /api/leads/:id/restore
* POST /api/leads/:id/soft-delete
* POST event/amendment routes if present
* import routes
* delete/history routes if present

Read routes may remain accessible only after dashboard auth if easy.
Do not expose data publicly if auth is enabled.

Return:
401 JSON:
{ "success": false, "error": "Unauthorized" }

---

## PATCH D — LOCALHOST SAFETY

Do not force ngrok.
Do not add public deployment.

Keep app working on:
localhost:3777

If host is 127.0.0.1 or localhost and no password is set:
allow but warn.

If accessed from non-localhost and no password is set:
block access with message:
"Operator password required before remote access."

---

## PATCH E — BACKUP BEFORE WRITE

Before destructive/high-risk actions, create backup copies.

Backup these files if they exist:

* data/leads.json
* data/run-log.json
* data/outreach-log.json

Backup location:
data/backups/

Filename format:
YYYYMMDD-HHmmss-leads.json
YYYYMMDD-HHmmss-run-log.json
YYYYMMDD-HHmmss-outreach-log.json

Create backup before:

* soft delete
* archive
* import batch
* mark paid
* audit patch
* lead update

Do not overcomplicate.
Keep backup helper small.

---

## PATCH F — SECURITY BANNER

Add small dashboard banner/status:

If protected:
"Operator Protected"

If password missing:
"Local Mode: No Operator Password Set"

If remote blocked:
show clear message.

Do not redesign UI.

---

## PATCH G — TESTS

Run and report:

1. Server starts localhost:3777
2. With no APEX_OPERATOR_PASSWORD:

   * localhost still opens
   * console warning appears
3. With APEX_OPERATOR_PASSWORD set:

   * dashboard requires password
   * wrong password fails
   * correct password opens dashboard
4. Write API without auth returns 401
5. Write API with auth works
6. Existing leads still load after auth
7. Audit PATCH still works after auth
8. Mark paid still works after auth
9. Archive/restore/soft-delete still works if present
10. Backup files are created before write action
11. WhatsApp flow unchanged
12. No auto-send added
13. Import/export unchanged
14. Lock guards unchanged
15. Existing 35-item regression still mostly intact

---

## REPORT FORMAT

Return:

1. Files changed
2. Auth method used
3. Env variable required
4. Protected routes list
5. Backup result
6. Localhost behavior
7. Remote/ngrok behavior
8. Regression result
9. Any bugs found
10. Final verdict

STOP AFTER REPORT.
