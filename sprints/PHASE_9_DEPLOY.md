# PHASE_9_DEPLOY.md
# Nexus Landing Engine — Phase 9: Deploy + Verify
# Run: claude "Read MEMORY.md then execute PHASE_9_DEPLOY.md"

## PRE-CHECK
Read MEMORY.md. Confirm PHASES 1-8 are all DONE before proceeding.
If any phase is not DONE, stop and tell user which phase is incomplete.

---

## TASK 1 — FINAL GIT PUSH

```bash
git add .
git status
git commit -m "feat: full upgrade — form fields, whatsapp CTA, history panel, reviews, security"
git push origin main
```

Report: commit hash and push status.

---

## TASK 2 — RAILWAY DEPLOY

```bash
railway up --detach
```

Wait for "Uploaded" confirmation.
Report: build log URL from Railway.

---

## TASK 3 — VERIFY LIVE SITE

After deploy (~2 minutes), verify these on live URL:

1. GET / — loads generator UI
   - [ ] Niche dropdown has 10 options
   - [ ] Output Language is dropdown (not button grid)
   - [ ] New form fields visible (tagline, email, phone, etc)
   - [ ] History tab visible

2. POST /generate — generate a test dental page
   - [ ] Page generates successfully
   - [ ] WhatsApp floating button appears on generated page
   - [ ] WhatsApp button is green with icon
   - [ ] Click WhatsApp → pre-filled message appears
   - [ ] Social proof badge visible if googleRating filled
   - [ ] Page meta title is business name

3. GET /history — returns JSON array
   - [ ] Generated page appears in history
   - [ ] History tab shows entry

4. DELETE /history/:id — delete the test entry
   - [ ] Entry removed from history list

5. GET / — x-api-key injection
   - [ ] View page source → window._appApiKey is set

---

## TASK 4 — RAILWAY VOLUME REMINDER

After deploy, remind user:

"IMPORTANT: To make demo pages and history persistent across deploys,
you need to set up a Railway Volume:

1. Go to railway.app → project ai-landing-page → service web
2. Click Settings tab
3. Scroll to Volumes section
4. Click Add Volume
5. Mount path: /app/data
6. Click Add
7. Railway will redeploy automatically

Without this, history and demos will be cleared on each redeploy."

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 9 — DONE ✅ commit: [hash]
2. Update MEMORY.md: ALL PHASES COMPLETE ✅
3. Report:
   - Live URL
   - All verification checkboxes pass/fail
   - Railway Volume reminder
   - Any remaining issues
4. Stop and wait for further instructions.
