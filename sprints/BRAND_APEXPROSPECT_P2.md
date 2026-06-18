# AUKIY_OPERATOR_LITE_FAST_BUILD_AUDIT.md

# AUKIY / DEALSENSE OPERATOR LITE

## FAST BUILD + REUSE FIRST AUDIT PROMPT

You are acting as:

* Senior Product Architect
* Senior UI Designer
* Senior Systems Auditor
* ResponseOps Integration Auditor

---

# MISSION

Before building anything new:

AUDIT EVERYTHING THAT ALREADY EXISTS.

The objective is:

Build the next version of DealSense Operator Lite as fast as possible using existing assets, existing modules, existing skills, existing workflows and existing code.

DO NOT rebuild functionality that already exists somewhere in ResponseOps.

DO NOT create duplicate systems.

DO NOT overengineer.

Prefer reuse over creation.

Prefer integration over rebuilding.

Prefer simple local architecture over complex infrastructure.

---

# SECTION 1

## RESPONSEOPS REUSE AUDIT

Audit all existing ResponseOps folders, modules, skills, prompts and workflows.

Look for anything reusable for:

1. Lead Management
2. Prospect Tracking
3. Follow-up Tracking
4. CRM-style Status Management
5. Outreach Pipelines
6. JSON Storage
7. Import / Export
8. Prompt Generation
9. Proposal Tracking
10. Client Tracking
11. Landing Page Engine Integration
12. Research Workflows
13. Agent Workflows
14. Semi-Auto Outreach Systems

For every reusable asset found:

Provide:

* Name
* Location
* Purpose
* Reusability Score (1-10)
* Recommended Action

Example:

FOUND:
tools/semi-auto-outreach

Purpose:
Human approval outreach workflow

Reuse Score:
10/10

Recommendation:
Integrate directly.

---

# SECTION 2

## CURRENT OPERATOR LITE AUDIT

Audit current architecture.

Answer:

1. Where is lead data stored?
2. Where is Zira Beauty Spa stored?
3. Is data hardcoded?
4. Is there JSON persistence?
5. Is there import capability?
6. Is there export capability?
7. Is there multi-lead support?
8. Is there follow-up tracking?
9. Is there reply tracking?
10. Is there status persistence?

Map exact files.

Show current architecture diagram.

Identify bottlenecks.

Identify scalability limitations.

---

# SECTION 3

## FASTEST SCALABLE ARCHITECTURE

Design the fastest path from:

Current:
Single-lead outreach demo

To:

Multi-lead outreach operator

Requirements:

* Local-first
* Cheap
* No database required initially
* Human approval required
* JSON-based if possible
* Easy migration later

Recommend:

* Folder structure
* Data structure
* Workflow
* Status model
* Import model
* Export model
* Follow-up model

Provide architecture diagram.

---

# SECTION 4

## UI POLISH AUDIT

Keep current layout.

DO NOT redesign.

Audit:

* Typography
* Color hierarchy
* Label/value hierarchy
* Status hierarchy
* Button hierarchy
* Card hierarchy
* White space
* Information density

Goal:

Move from:

9.2/10

To:

9.7/10

---

# AUKIY VISUAL DOCTRINE

Built In Silence.

Systems Over Noise.

The dashboard must feel:

* Calm
* Executive
* Disciplined
* Premium
* Enterprise
* Infrastructure-grade

NOT:

* Gaming
* Crypto
* Cyberpunk
* Startup SaaS
* Esports
* Trendy UI

---

# UI REFINEMENT TARGETS

## Label / Value Hierarchy

Improve distinction between:

Field Labels

Examples:

LOKASI
NICHE
WHATSAPP
CONTACT
PROFILE URL
OFFER

and

Actual Values

Examples:

Ipoh
Beauty Spa
60165531496

Labels should be:

* smaller
* uppercase
* slightly brighter than current version
* weight 700
* muted

Values should be:

* larger
* brighter
* weight 500
* easier to scan

---

## Header Review

Audit whether:

DealSense Operator Lite

should remain

or become

AUKIY Outreach Console

Provide recommendation.

---

## Status Simplification

Review:

APPROVED_TO_SEND

Should display as:

APPROVED

while preserving internal logic.

---

## Preview Path

Replace:

Full Windows path display

with

Filename display only.

Preserve full path internally if needed.

---

## Textarea Readability

Audit:

DM Draft readability

and recommend minimal improvements.

---

# VISUAL WEIGHT AUDIT

Reduce visual noise.

Every visible element must justify its existence.

Prefer:

Fewer stronger signals

instead of

Many weak signals.

The dashboard should feel:

* calm
* expensive
* intentional
* trustworthy

---

# SECTION 5

## IMPORT SYSTEM

Design the simplest possible:

IMPORT LEADS

Support:

### Option A

Import JSON file.

### Option B

Paste JSON.

### Option C

Manual lead form.

Minimum required fields:

* Business Name
* Contact Method
* WhatsApp

Everything else optional.

---

# SECTION 6

## LEAD DATA STRUCTURE

Preferred local structure:

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

Recommend best implementation.

---

# SECTION 7

## MULTI-LEAD CONTROL PANEL

Design:

Lead Selector

or

Lead List

Must show:

* Business Name
* Niche
* Location
* Status
* Reply Status
* Last Contacted

Selecting a lead should load the current card.

Do not redesign the card.

---

# SECTION 8

## FOLLOW-UP SYSTEM

Design lightweight follow-up workflow.

Statuses:

NEW

PREVIEW_READY

APPROVED

SENT

REPLIED

FOLLOW_UP

INTERESTED

NOT_INTERESTED

CLOSED

Store:

* Last Contacted
* Next Follow-up Date
* Reply Notes
* Important Data

Must persist locally.

Must survive refresh.

Must not require database.

---

# SECTION 9

## LANDING PAGE ENGINE INTEGRATION

Audit possibility to connect:

Landing Page Engine

*

Operator Lite

Desired flow:

Lead
↓
Research
↓
Generate Preview
↓
Store Preview Path
↓
Generate DM
↓
Approve
↓
Open WhatsApp
↓
Track Follow-up

Explain:

Fastest implementation path.

Cheapest implementation path.

Lowest-risk implementation path.

---

# SECTION 10

## EXPORT SYSTEM

Design:

EXPORT LEADS

Support:

* JSON
* CSV

Export:

* business name
* niche
* whatsapp
* status
* reply status
* notes
* next follow-up date
* offer

---

# SECTION 11

## BUILD PRIORITY ANALYSIS

Rank:

Priority 1

Priority 2

Priority 3

Based on:

* Maximum revenue impact
* Minimum development effort
* Fastest path to outreach execution

---

# SAFETY RULES

Never auto-send messages.

Never contact leads automatically.

Never bypass approval.

Never remove human approval.

Never change WhatsApp approval flow without justification.

Prefer:

Simple
Local
Reliable
Maintainable

over

Complex
Automated
Fragile

systems.

---

# OUTPUT FORMAT

PHASE 1
ResponseOps Reuse Audit

PHASE 2
Operator Lite Architecture Audit

PHASE 3
Fastest Scalable Architecture

PHASE 4
UI Polish Audit

PHASE 5
Implementation Roadmap

PHASE 6
Exact Files To Modify

STOP.

Wait for approval before modifying any code.
