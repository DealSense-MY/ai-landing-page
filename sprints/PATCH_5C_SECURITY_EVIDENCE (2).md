# CONTINUATION PROMPT — DealSense Nexus Phase 2 + Client Ready

## STATUS (as of 2026-06-18)

✅ PATCH 5C LOCKED SAFE
- XSS hardening (esc() + safeHref()) verified with evidence
- Regression tests PASS (Zira + import + WA flow)
- MEMORY.md updated: PATCH_05B + PATCH_05C entries
- .bak files safe to delete

## NEXT PHASES (PRIORITY ORDER)

### PHASE 1: NEXUS PHASE 2 — Cloudflare Deploy
**Sprint:** `NEXUS_PHASE2_DEPLOY_PREP.md`
**Phases:** 4 (verify code → KV setup → deploy → DNS + test)
**Duration:** ~45 min
**Critical Decision:** Cloudflare paid upgrade ($5/month) at Phase 3

**Status before start:**
- [ ] AircondFresh preview still live on Railway? (check Phase 1)
- [ ] Wrangler CLI installed? (check Phase 1)
- [ ] Domain registrar: Exabytes / Shinjiru / other? (needed Phase 4)

**Target outcome:**
- Nexus landing engine live on Cloudflare Workers
- AircondFresh client preview tested + working
- DNS pointing to Workers
- Ready for first paying client (RM350 tier)

---

### PHASE 2: RM350 CLIENT READINESS CHECKLIST
**After Nexus Phase 2 complete**, run audit sprint:
- [ ] Pricing tiers locked in (Basic RM299 / Std RM499 / Prem RM799)
- [ ] Client onboarding flow mapped (intake → preview → approval → deploy)
- [ ] Invoice/payment template ready (email template + manual invoice for first 3)
- [ ] Domain setup automation (DNS setup guide for client domains)
- [ ] WhatsApp support response template (client inquiry handoff)
- [ ] Maintenance service agreement (~RM50-80/bulan, what's included?)
- [ ] First client target: Zira Beauty Spa (existing preview ready) or cold outreach?

---

## REFERENCE DOCS (load these first)

- `DealSense/skill-library/DEALSENSE_MASTER_SKILL.md` — architecture doctrine + skill-first protocol
- `DealSense/skill-library/cowork-skills/` — 11 skills (data-safety, stop-conditions, output-capping, etc.)
- `BLUEPRINT_PHASE_GATE.md` — Phase 0 acceptance criteria (landing page + import + preview)
- `BLUEPRINT_DATA_SCHEMA.md` — lead record schema (preserve old fields, add new)
- `BLUEPRINT_PROSPECTS_OPERATOR.md` — ApexProspect system identity + preserve rules

---

## DECISION AWAITING ALIFF

Before Cowork executes NEXUS Phase 2:

1. **Cloudflare paid upgrade:** Now or later?
   - `wrangler deploy` will timeout on free plan (10ms CPU limit)
   - Needed for Phase 3 to complete
   - Cost: $5/month (negligible vs RM350 client revenue)

2. **AircondFresh status:**
   - Still live on Railway?
   - Or already down/migrated?

3. **Domain registrar:**
   - Current: Exabytes / Shinjiru / other?
   - Plan after deploy: Cloudflare nameservers or DNS update only?

---

## EXECUTION FLOW (Recommended)