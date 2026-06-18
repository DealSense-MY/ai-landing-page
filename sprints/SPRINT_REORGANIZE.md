# SPRINT_AUDIT_ORGANIZE.md
# Landing Page Project — Full Audit & Organize
# Run: claude "Execute sprints/SPRINT_AUDIT_ORGANIZE.md"

## CRITICAL RULES — READ FIRST
- DO NOT DELETE any file
- DO NOT MODIFY any file content
- COPY only — never move or cut
- When in doubt, PRESERVE
- Old file = potentially newest product, treat with respect
- This is audit + organize only

---

## PHASE 1 — FULL AUDIT (READ ONLY)

Scan these locations recursively:

1. C:\Users\Selina\.claude\DealSense\
2. C:\Users\Selina\.claude\Claude\projects\Website\
3. C:\Users\Selina\.claude\Claude\projects\C--Users-Selina-Desktop-Claude-ai-landing-page-system-v2\

For every HTML file found:
- Record full path
- Record file size
- Record date modified
- Read first 50 lines — identify: business name, niche, brand color
- Classify: generator UI / demo page / blueprint / unknown

For every .md file found:
- Record full path
- Record date modified  
- Read first 20 lines — summarize purpose in 1 sentence
- Classify: sprint / memory / blueprint / roadmap / report / unknown

For every .js file found (not node_modules):
- Record full path
- Record date modified
- Identify: is this pipeline code / server / frontend / unknown

Write full audit to: sprints/AUDIT_REPORT.md
Format:

### HTML FILES
| File | Path | Size | Modified | Purpose | Business/Niche |
|------|------|------|----------|---------|----------------|

### MARKDOWN FILES  
| File | Path | Modified | Summary | Type |
|------|------|----------|---------|------|

### JS FILES
| File | Path | Modified | Purpose |
|------|------|----------|---------|

STOP — show AUDIT_REPORT.md and wait