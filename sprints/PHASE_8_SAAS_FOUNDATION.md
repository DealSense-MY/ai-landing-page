# PHASE_8_SAAS_FOUNDATION.md
# DealSense Prospects Operator — Phase 8
# Run: claude --model claude-fable-5 "Read sprints/BLUEPRINT_PROSPECTS_OPERATOR.md then execute sprints/PHASE_8_SAAS_FOUNDATION.md"

## CURRENT STATUS
Phase 1-7: COMPLETE

## PHASE 8 OBJECTIVE
SaaS-Ready Foundation — modularize, config, placeholders, final cleanup.

This is NOT a rewrite.
This is a cleanup and future-proofing sprint.

CORE RULES:
- Do not break any existing functionality
- Do not change UI
- Do not change data structure
- Do not remove any features
- Refactor carefully — test after each file change
- Add placeholders for future modules — disabled, documented

---

## TASK 1 — Config File

Create: tools/semi-auto-outreach/config.json

```json
{
  "app": {
    "name": "DealSense Prospects Operator",
    "version": "1.0.0",
    "port": 3777,
    "locale": "ms-MY"
  },
  "operation": {
    "workingHoursStart": 9,
    "workingHoursEnd": 21,
    "timezone": "Asia/Kuala_Lumpur",
    "dailyOutreachTarget": 5,
    "dailyFollowUpTarget": 3,
    "staleProspectDays": 5,
    "followUpOverdueDays": 3
  },
  "paths": {
    "demosFolder": "../../../../DEMOS",
    "dataFolder": "./data"
  },
  "features": {
    "scheduleEnabled": true,
    "workflowSuggestionsEnabled": true,
    "previewTrackingEnabled": false,
    "baileysBridgeEnabled": false,
    "multiUserEnabled": false,
    "cloudSyncEnabled": false
  },
  "future": {
    "baileysBridge": {
      "enabled": false,
      "note": "Baileys WhatsApp bridge — disabled until Phase 9. Enable only after official WhatsApp Business API setup."
    },
    "cloudSync": {
      "enabled": false,
      "note": "Cloud sync — disabled until SaaS launch. Local-first always."
    },
    "multiUser": {
      "enabled": false,
      "note": "Multi-user support — disabled until billing system ready."
    }
  }
}
```

In server.js: load config.json at startup, use config values instead of hardcoded values where safe.

---

## TASK 2 — Modules Folder

Create: tools/semi-auto-outreach/modules/

Extract these as separate module files:

### modules/postbackOperator.js
Move AutoLog helper functions:
- addLogEvent()
- createEvent()
- updateProspectStatusFromEvent()

### modules/importValidator.js
Move import validation logic:
- validateProspect()
- generateId()
- checkDuplicate()
- normalizeProspect()

### modules/lockManager.js
Move lock/amendment logic:
- lockProspect()
- addAmendment()
- isProspectLocked()

Keep server.js as entry point — require() these modules.
Do not break existing API endpoints.

---

## TASK 3 — Baileys Adapter Placeholder

Create: tools/semi-auto-outreach/modules/baileysBridge.js

Content:
```javascript
/**
 * BAILEYS BRIDGE — DISABLED
 *
 * Future WhatsApp automation bridge.
 * DO NOT ENABLE until:
 * 1. WhatsApp Business API officially approved
 * 2. Aliff explicitly enables in config.json
 * 3. Full testing in isolated environment
 *
 * Status: PLACEHOLDER ONLY
 * Auto-send: DISABLED
 */

const config = require('../config.json');

function isBailleysEnabled() {
  return config.features.baileysBridgeEnabled === true;
}

async function sendViaWA(number, message) {
  if (!isBailleysEnabled()) {
    console.log('[BaileysBridge] Disabled. Use manual WA flow.');
    return { sent: false, reason: 'disabled' };
  }
  // Future: implement Baileys send here
  throw new Error('BaileysBridge not yet implemented.');
}

module.exports = { isBailleysEnabled, sendViaWA };
```

This file must NOT be called anywhere in active code.
It is documentation + future scaffold only.

---

## TASK 4 — Final Cleanup

### server.js cleanup:
- Remove any console.log debug statements
- Add structured startup log:
  ```
  [DealSense] Starting Prospects Operator v1.0.0
  [DealSense] Port: 3777
  [DealSense] Data: ./data/leads.json
  [DealSense] Operation: ACTIVE
  ```
- Add graceful shutdown handler (SIGTERM, SIGINT)

### leads.json cleanup:
- Remove test leads: locktest-business-*, test-import-spa-ipoh, test lead
- Keep: zira-beauty-spa-ipoh only
- Create clean backup: data/leads.json.clean.bak

### package.json:
- Add version: "1.0.0"
- Add description: "DealSense Prospects Operator — Local Sales OS"
- Add scripts:
  - "start": "node server.js"
  - "backup": "node -e \"require('fs').copyFileSync('data/leads.json','data/leads.backup.json')\""

---

## TASK 5 — README Update

Update or create: tools/semi-auto-outreach/README.md

```markdown
# DealSense Prospects Operator v1.0.0

Local-first sales operating system for DealSense-MY.

## Quick Start
cd tools/semi-auto-outreach
npm install
npm start
Open: http://localhost:3777

## Features
- Pipeline tabs (New → Contacted → Replied → Closed)
- Import prospects from ChatGPT agent (drag & drop JSON)
- AutoLog — every action recorded
- Confirm Sent — approve ≠ sent
- AutoLock — closed records protected
- Amendments — corrections on locked records
- Schedule — queue prospects for later
- Workflow suggestions — smart next action panel
- Export backup — leads + run log

## Safety Rules
- No auto-send
- No Baileys active
- Human approval required for every message
- Public data only

## Data Files
- data/leads.json — prospect database
- data/run-log.json — global event log
- data/outreach-log.json — legacy log (preserved)

## Config
Edit config.json to change:
- Working hours
- Daily targets
- Feature flags

## Future Modules (disabled)
- baileysBridge.js — WhatsApp automation (disabled)
- Cloud sync (disabled)
- Multi-user (disabled)
```

---

## ACCEPTANCE CRITERIA

1. npm start runs without error.
2. localhost:3777 loads.
3. config.json exists and loads correctly.
4. modules/ folder exists with 3 module files.
5. baileysBridge.js exists but NOT called anywhere active.
6. server.js uses config values.
7. Startup log shows version + port.
8. Test leads removed from leads.json.
9. Zira lead intact.
10. package.json updated.
11. README.md updated.
12. All Phase 1-7 behavior preserved.
13. No auto-send added.
14. No Baileys enabled.
15. Browser console no breaking errors.

REPORT BACK: Phase 8 Build Report
STOP after Phase 8.
This is the final phase of FABLE_BUILD_SPEC.
Report: "DealSense Prospects Operator v1.0.0 — BUILD COMPLETE"
