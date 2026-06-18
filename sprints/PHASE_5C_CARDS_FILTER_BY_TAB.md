# PHASE_5C_CARDS_FILTER_BY_TAB.md
# DealSense Prospects Operator — Phase 5C
# Run: claude --model claude-fable-5 "Execute sprints/PHASE_5C_CARDS_FILTER_BY_TAB.md"

## OBJECTIVE
Cards section patut tunjuk hanya leads dalam active tab sahaja.
Sekarang: semua cards render sekaligus — scroll panjang.
Target: Tab ALL → semua cards. Tab NEW → NEW cards sahaja. Etc.

## CONSTRAINT
- Patch app.js sahaja — minimum change
- Jangan touch server.js, style.css, index.html melainkan perlu
- Preserve semua behavior sedia ada
- No auto-send, no Baileys

---

## TASK — FILTER CARDS BY ACTIVE TAB

Inspect public/app.js.

Find: switchTab() function dan renderLeads() function.

Current behavior:
- switchTab() filters prospect TABLE by tab
- renderLeads() renders ALL cards regardless of tab

Fix:
- In renderLeads() atau switchTab(), filter leads sebelum pass ke buildLeadCard()
- Hanya render cards untuk leads yang match active tab
- ALL tab → render semua cards (unchanged)
- Other tabs → render only matching cards

Logic sama dengan getStatus() filter yang dah ada untuk table.

## EMPTY STATE

Jika tab active tiada leads:
- Table: "No prospects in this tab." (dah ada)
- Cards: tunjuk message yang sama:
```html
<div class="empty-tab-cards">
  No prospect cards in this tab.
</div>
```

Add CSS dalam style.css:
```css
.empty-tab-cards {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-soft, #78716C);
  font-size: 14px;
}
```

## SELECTED LEAD BEHAVIOR

Bila user klik row dalam table → scroll ke card.
Kalau tab tukar dan selected lead tidak dalam tab baru → deselect.
Jangan crash jika card tak ada dalam DOM.

## ACCEPTANCE CRITERIA

1. npm start without error.
2. localhost:3777 loads.
3. ALL tab → semua cards nampak.
4. NEW tab → hanya NEW cards.
5. CONTACTED tab → hanya CONTACTED cards.
6. REPLIED tab → hanya REPLIED cards.
7. CLOSED WON tab → hanya CLOSED WON cards.
8. SCHEDULED tab → hanya SCHEDULED cards.
9. Empty tab → empty state message dalam cards section.
10. Click table row → scroll ke card yang betul.
11. Tab switch → cards update immediately.
12. Refresh → active tab preserved, cards filter correctly.
13. All existing card behavior preserved (approve, edit, etc).
14. No auto-send added.

## MANUAL TEST

1. Open localhost:3777
2. ALL tab — confirm semua 4 cards nampak
3. Click NEW tab — confirm hanya NEW cards nampak
4. Click CLOSED WON tab — confirm hanya LockTest Business card
5. Click CONTACTED tab — confirm tiada card (Zira dah jadi NEW lepas unschedule)
6. Confirm empty state message nampak untuk empty tabs
7. Click row dalam table → scroll ke card betul

## REPORT
Phase 5C Build Report — files changed, behavior confirmed, safe to proceed.
STOP after report.
