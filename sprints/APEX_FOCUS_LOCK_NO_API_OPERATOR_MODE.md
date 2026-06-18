# APEX_FOCUS_LOCK_NO_API_OPERATOR_MODE.md

You are Claude Code.

PROJECT:
Landing Page PWA / Customer Acquisition System

CURRENT ACTIVE BUILD CHANNEL:
13_BUILD_EXECUTION__APEXPROSPECT

MAIN LOCAL APP:
localhost:3777

MAIN OBJECTIVE:
Help Aliff use ApexProspect as a private operator system to get prospects, create/audit landing page previews, prepare outreach, track replies, move prospects toward payment, and support manual execution.

IMPORTANT CONTEXT:
This system is NOT intended to be sold as SaaS.
This system is for Aliff's own operator use.

The current priority is:
Prospect
→ Audit
→ DM Draft
→ Preview
→ Approve & Open WhatsApp
→ Aliff manually sends
→ Confirm Sent
→ Track Reply
→ Proposal / Payment
→ Delivery

DO NOT move the project toward SaaS, public generator, login system, billing, or client self-service dashboard.

---

# FOCUS LOCK

ApexProspect Core must remain:

- no API key required
- no runtime AI dependency
- local/private operator tool
- manual WhatsApp workflow
- human last-click send
- local JSON storage unless already changed safely
- usable even when AI provider is unavailable

AI may exist only as optional helper later.

Default mode must be:

AI_PROVIDER=none

If AI is added later, it must be optional and must not block the app.

---

# CRITICAL SEPARATION

There are two separate lanes:

## Lane A — ApexProspect Core

Purpose:
Aliff's private operator dashboard.

Allowed:
- import prospect
- store prospect
- edit prospect
- manual/rule-based audit
- DM draft
- paste AI-generated text manually
- preview landing page from saved data/template
- Approve & Open WhatsApp
- manual send by Aliff
- Confirm Sent
- Mark Replied
- Follow-Up Draft
- Closed Won / Closed Lost
- AutoLog
- AutoLock
- Amendments
- export JSON/CSV

Not allowed:
- API key requirement
- auto-send
- hidden WhatsApp sending
- Baileys active sending
- forced Claude/OpenAI/OpenRouter call
- SaaS architecture
- public client generator
- login/billing
- Cloudflare paid dependency as core requirement

## Lane B — Nexus AI Generator / cf-version

Purpose:
Optional future AI-powered landing page generation lane.

This lane may use:
- ANTHROPIC_API_KEY
- APP_API_KEY
- Cloudflare deploy
- /generate endpoint
- paid AI generation

But this lane is optional and must not be treated as required for ApexProspect Core.

DO NOT ask Aliff to set Anthropic secrets or deploy Cloudflare as a requirement for ApexProspect Core.

---

# CURRENT DECISION

Stop treating `npm run secret:anthropic`, `npm run secret:appkey`, or `npm run deploy` as the next required step for ApexProspect.

Those commands belong only to the optional Nexus AI Generator / Cloudflare lane.

For current execution, focus on making localhost:3777 stable and useful for manual prospect execution.

---

# MISSION

Perform a focus audit only.

Do not build new features unless there is an obvious small safety patch required.

Inspect the current project and report:

1. Which files belong to ApexProspect Core.
2. Which files belong to Nexus AI Generator / cf-version.
3. Whether localhost:3777 can run without API keys.
4. Whether any ApexProspect Core code currently requires ANTHROPIC_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY, or similar.
5. Whether any UI copy implies the app requires AI/API to work.
6. Whether `/generate` or AI generation is hard-wired into the operator workflow.
7. Whether there is any auto-send or hidden WhatsApp sending.
8. Whether current WhatsApp flow remains manual.
9. What is the safest next small patch, if any.

---

# IF A PATCH IS NEEDED

Only patch if needed to enforce focus.

Allowed patches:
- add clear comments / docs explaining lane separation
- add `.env.example` with `AI_PROVIDER=none`
- add UI copy that says AI generation is optional/manual
- prevent app crash when API keys are missing
- make AI buttons disabled/optional if no provider configured
- rename confusing copy that implies SaaS or live AI requirement
- create `APEXSYSTEM_FOCUS_DOCTRINE.md`

Not allowed patches:
- implement AI provider
- implement OpenRouter
- implement Claude
- implement Ollama
- implement Meta/Llama
- implement SaaS login
- implement billing
- implement cloud database
- run Cloudflare deploy
- ask for Anthropic key
- ask for OpenRouter key
- change WhatsApp sending behavior
- add auto-send

---

# DOCTRINE TO PRESERVE

1. ApexProspect must work with no API key.
2. AI is optional, not required.
3. Human approval is required before outreach.
4. Approve is not Sent.
5. WhatsApp may open with prefilled message only.
6. Aliff manually presses Send.
7. Confirm Sent is clicked only after manual send.
8. AI can draft, score, summarize, and recommend only.
9. AI must never send WhatsApp.
10. Locked records are view-only.
11. Corrections after lock are amendments.
12. Export should include events, locked status, lockedAt, lockReason, and amendments.
13. Do not overbuild.
14. Do not rewrite globally.
15. Patch only what is needed.

---

# OPTIONAL FUTURE AI DOCTRINE

If Aliff later chooses AI automation, the adapter design should be provider-agnostic:

Default:
AI_PROVIDER=none

Future optional providers:
- OpenRouter with Hermes for agentic drafting/reasoning
- Ollama as local/private fallback
- Claude/ChatGPT as premium review
- Meta/Llama via OpenRouter/Ollama if useful

But do not implement this now.

Future AI must only create:
- draft
- score
- summary
- recommendation
- suggested next action

Future AI must never:
- send WhatsApp
- mark sent
- close won/lost automatically
- overwrite locked records
- change price without approval

---

# LOCALHOST VERIFICATION

Always verify:

1. App opens at localhost:3777.
2. No server crash.
3. No console-breaking error.
4. Existing lead data still loads.
5. WhatsApp flow opens only prefilled message.
6. No auto-send exists.
7. Confirm Sent is manual.
8. Closed Won/Lost lock behavior remains safe if already implemented.
9. App still works without API keys.
10. Refresh does not lose state.

---

# REPORT FORMAT

Return:

# Apex Focus Audit Report

1. Files inspected
2. ApexProspect Core files identified
3. Nexus AI Generator / cf-version files identified
4. API key dependency check
5. No-API runtime result
6. WhatsApp safety result
7. UI copy risk
8. Any hard-wired AI/generate dependency found
9. Patch applied, if any
10. Files changed, if any
11. Localhost verification result
12. Remaining risk
13. Recommended next action

STOP AFTER REPORT.

Do not proceed to deploy.
Do not ask for API keys.
Do not implement AI provider.
Do not start new architecture.
