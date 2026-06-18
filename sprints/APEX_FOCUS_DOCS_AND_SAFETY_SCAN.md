# APEX_FOCUS_DOCS_AND_SAFETY_SCAN.md

You are Claude Code.

PROJECT:
Landing Page PWA / Customer Acquisition System

ACTIVE CHANNEL:
13_BUILD_EXECUTION__APEXPROSPECT

MAIN LOCAL APP:
localhost:3777

MISSION:
Execute Option C + Option A only.

Purpose:
1. Quick safety scan of ApexProspect Core.
2. Confirm no hidden API/key dependency.
3. Confirm no hidden WhatsApp auto-send.
4. Add documentation files to lock the no-API operator doctrine and lane separation.

DO NOT build new features.
DO NOT deploy.
DO NOT ask for API keys.
DO NOT implement AI provider.
DO NOT touch Cloudflare deployment flow.
DO NOT redesign.
DO NOT refactor globally.

---

# CURRENT DECISION

ApexProspect Core is NOT SaaS.

ApexProspect Core is Aliff's private operator tool for:

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

ApexProspect Core must work with:

- no API key
- no runtime AI dependency
- no Cloudflare dependency
- no Anthropic dependency
- no OpenRouter dependency
- no Ollama dependency
- no Meta/Llama dependency
- no auto-send
- no hidden WhatsApp sending

---

# TASK A — QUICK SAFETY SCAN

Inspect ApexProspect Core files, especially:

- tools/semi-auto-outreach/server.js
- tools/semi-auto-outreach/public/app.js
- tools/semi-auto-outreach/public/index.html
- tools/semi-auto-outreach/public/style.css
- tools/semi-auto-outreach/package.json
- tools/semi-auto-outreach/data/leads.json
- tools/semi-auto-outreach/data/run-log.json

Check and report:

1. Does localhost:3777 require any API key?
2. Does the app require ANTHROPIC_API_KEY?
3. Does the app require OPENAI_API_KEY?
4. Does the app require OPENROUTER_API_KEY?
5. Does the app require OLLAMA_HOST?
6. Does the app require Cloudflare secrets?
7. Does any code auto-send WhatsApp?
8. Does any code use Baileys or WhatsApp Web automation?
9. Does Approve only open WhatsApp prefilled link?
10. Does Confirm Sent remain a manual action?
11. Does UI copy imply AI is required?
12. Does any `/generate` AI endpoint block ApexProspect Core from working?

Important:
If any item fails, STOP and report before patching.
Only patch documentation if the scan is clean.

---

# TASK B — ADD .env.example FILES

If safety scan is clean, create:

## 1. tools/semi-auto-outreach/.env.example

Content:

```env
# ApexProspect Core — NO API KEYS REQUIRED
# This app is Aliff's private local operator tool.
# It must work without Anthropic, OpenAI, OpenRouter, Ollama, Meta/Llama, or Cloudflare secrets.
#
# Core workflow:
# Prospect -> Audit -> DM Draft -> Preview -> Approve & Open WhatsApp
# -> Aliff manually sends -> Confirm Sent -> Track Reply -> Payment -> Delivery
#
# Data:
# Prospect data is stored locally in data/leads.json
# Run/event logs are stored locally in data/run-log.json
#
# WhatsApp:
# Manual only.
# The app may open a prefilled WhatsApp link.
# Aliff must manually press Send.
# Confirm Sent must be clicked only after manual send.
#
# AI:
# AI is optional and not implemented as a required runtime dependency.
# External AI tools may be used manually via copy-paste.
#
AI_PROVIDER=none
```

## 2. cf-version/.env.example

Content:

```env
# Nexus AI Generator — OPTIONAL LANE
# This folder is separate from ApexProspect Core.
# It may be used later for Cloudflare Workers / AI-powered /generate.
#
# ApexProspect Core at localhost:3777 does NOT require these secrets.
# Do not run secret setup or deployment as part of ApexProspect Core.
#
# Required only if intentionally using the optional Nexus AI Generator lane:
ANTHROPIC_API_KEY=sk-ant-[your-key-here]
APP_API_KEY=[generated-private-app-key]
```

If exact folder path is different, locate `cf-version` under `DealSense/07_NexusLandingEngine/`.

---

# TASK C — ADD FOCUS DOCTRINE DOC

Create:

tools/semi-auto-outreach/APEXSYSTEM_FOCUS_DOCTRINE.md

Content:

```md
# APEXSYSTEM FOCUS DOCTRINE

## Status

ApexProspect Core is a private operator system for Aliff.

It is NOT SaaS.
It is NOT a public AI generator.
It is NOT a client self-service dashboard.

---

## Core Purpose

ApexProspect exists to help Aliff:

1. Manage prospects
2. Audit prospect weaknesses
3. Prepare DM drafts
4. Prepare or attach landing page previews
5. Open WhatsApp with a prefilled message
6. Manually send outreach
7. Confirm sent manually
8. Track replies
9. Move leads toward proposal/payment
10. Support delivery handoff

---

## Non-Negotiable Rules

1. No auto-send.
2. No hidden sending.
3. No Baileys active sending.
4. Approve is not Sent.
5. Approve may only open WhatsApp with a prefilled message.
6. Aliff manually presses Send.
7. Confirm Sent happens only after manual send.
8. Closed Won and Closed Lost must lock the record.
9. Locked records are view-only.
10. Corrections after lock must be amendments.
11. App must work with no API key.
12. AI is optional, not required.
13. No SaaS architecture.
14. No login/billing/cloud database unless explicitly approved later.
15. Do not deploy optional AI lanes as part of ApexProspect Core.

---

## Lane Separation

### Lane A — ApexProspect Core

Local/manual/private operator system.

Must work with:

- AI_PROVIDER=none
- local JSON storage
- manual WhatsApp workflow
- no API keys
- no Cloudflare dependency

### Lane B — Nexus AI Generator

Optional future lane.

May use:

- ANTHROPIC_API_KEY
- APP_API_KEY
- Cloudflare Worker
- /generate endpoint

This lane must never be treated as required for ApexProspect Core.

---

## Optional Future AI Adapter Doctrine

Future AI may draft, score, summarize, classify, and recommend.

Future AI must never:

- send WhatsApp
- click Send
- mark Sent
- close Won/Lost
- overwrite locked records
- change pricing without Aliff approval

Potential future providers:

- OpenRouter + Hermes
- Ollama
- Claude
- ChatGPT
- Meta/Llama via OpenRouter or Ollama

Default remains:

AI_PROVIDER=none

---

## Final Rule

If a feature does not help prospecting, outreach, payment, delivery, or revenue, defer it.
```

---

# TASK D — OPTIONAL ROOT NOTE

If appropriate and low-risk, create:

tools/semi-auto-outreach/README_FOCUS.md

Content can briefly point to:
- `.env.example`
- `APEXSYSTEM_FOCUS_DOCTRINE.md`
- localhost:3777
- no-API requirement

Do not modify existing README unless necessary.

---

# REGRESSION RULES

Do not modify existing app logic unless scan finds a critical safety issue.

Must remain true:

1. App opens at localhost:3777.
2. Existing lead data loads.
3. Pipeline/prospect table still loads if already present.
4. Approve opens WhatsApp only.
5. No auto-send.
6. Confirm Sent remains manual.
7. Closed Won/Lost lock behavior remains unchanged.
8. App runs without API keys.
9. No data loss.
10. No deployment started.

---

# REPORT FORMAT

Return:

# Apex Focus Docs + Safety Scan Report

1. Files inspected
2. Safety scan result
3. API key dependency result
4. WhatsApp auto-send result
5. Confirm Sent manual result
6. UI copy risk result
7. Files created
8. Files modified
9. Localhost verification
10. Any issue found
11. Whether ApexProspect Core remains no-API ready
12. Recommended next action

STOP AFTER REPORT.

Do not proceed to Cloudflare secrets.
Do not proceed to deploy.
Do not implement AI provider.
