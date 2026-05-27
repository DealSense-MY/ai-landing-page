# PHASE_4_WHATSAPP.md
# Nexus Landing Engine — Phase 4: WhatsApp CTA UI Upgrade
# Run: claude "Read MEMORY.md then execute PHASE_4_WHATSAPP.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 4 is DONE, stop immediately and tell user.
Confirm PHASE 3 is DONE before proceeding.
Read public/index.html and public/js/previewRenderer.js before changes.

---

## CONTEXT
Phase 3 already handled WhatsApp upgrades in GENERATED pages (buildHTML.js).
This phase handles WhatsApp display in the LIVE EDITOR preview (client-side).

---

## TASK 1 — UPDATE previewRenderer.js

When rebuilding preview client-side after editing:
- Find where WhatsApp buttons/links are rendered
- Ensure href uses: https://wa.me/[number]?text=[encodedMessage]
- Read whatsappMessage from stateManager editedValues
- Apply encodeURIComponent() before appending to URL

---

## TASK 2 — UPDATE stateManager.js

Add to editedValues initial shape and reset():
- tagline: ''
- email: ''
- phone: ''
- operatingHours: ''
- ownerName: ''
- yearsInOperation: ''
- googleRating: ''
- totalReviews: ''
- services: []
- customerReviews: []
- logoUrl: ''
- galleryImages: []
- beforeAfterImages: []
- whatsappMessage: ''

---

## TASK 3 — UPDATE apiService.js

After successful generate, extract from server response JSON and store in stateManager:
- whatsappMessage
- googleRating
- totalReviews
- services
- customerReviews
- galleryImages
- beforeAfterImages
- tagline
- email
- phone
- operatingHours
- ownerName

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 4 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 4 — whatsapp CTA client-side + state sync"
3. Report: tasks completed, any issues
4. Stop and wait for instructions.
