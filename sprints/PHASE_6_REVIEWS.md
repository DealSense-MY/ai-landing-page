# PHASE_6_REVIEWS.md
# Nexus Landing Engine — Phase 6: Reviews + Social Proof
# Run: claude "Read MEMORY.md then execute PHASE_6_REVIEWS.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 6 is DONE, stop immediately and tell user.
Confirm PHASE 5 is DONE before proceeding.
Read pipeline/buildHTML.js and pipeline/generate.js before changes.

---

## TASK 1 — SOCIAL PROOF BADGE IN HERO (buildHTML.js)

Render only if googleRating is not empty.

Add below hero headline, above CTA button:

```html
<div class="social-proof-badge">
  <span class="star-icon">⭐</span>
  <strong>[googleRating]</strong>
  <span class="review-count">· [totalReviews] Google Reviews</span>
</div>
```

CSS:
- display: inline-flex, align-items: center, gap: 6px
- background: rgba(255,255,255,0.15)
- border: 1px solid rgba(255,255,255,0.3)
- border-radius: 20px
- padding: 6px 14px
- font-size: 14px
- color: white (on dark hero) or dark (on light hero)
- star-icon: color #FFD700

For multilingual pages, add i18n key for "Google Reviews" text.

---

## TASK 2 — CUSTOMER REVIEWS SECTION (buildHTML.js)

Render only if customerReviews array is not empty.
Place after Benefits section, before Find Us section.

Section structure:
```html
<section class="reviews-section">
  <h2>What Our Customers Say</h2>
  <div class="reviews-grid">
    [for each review:]
    <div class="review-card">
      <div class="review-stars">[render stars based on rating]</div>
      <p class="review-quote">"[quote]"</p>
      <div class="review-footer">
        <span class="review-name">[name]</span>
        <span class="review-date">[date]</span>
      </div>
    </div>
  </div>
</section>
```

CSS:
- reviews-grid: 3 columns desktop, 1 column mobile
- review-card: white background, subtle shadow, border-radius 12px, padding 20px
- review-stars: gold color #FFD700
- review-quote: italic, font-size 15px, line-height 1.6
- review-name: font-weight bold
- review-date: muted color, font-size 13px

Section title translations:
- EN: "What Our Customers Say"
- BM: "Kata Pelanggan Kami"
- ZH: "客户评价"

---

## TASK 3 — UPDATE generate.js PROMPT

For customerReviews, instruct AI:
- If customerReviews provided: use them as-is, format into review cards
- If customerReviews empty: generate 3 realistic reviews matching niche
  - Names should be realistic Malaysian names
  - Quotes should be 2-3 sentences, specific to niche
  - Ratings: 5 stars each
  - Dates: "2 months ago", "3 months ago", "1 month ago"

Add reviews to AI JSON response as:
```json
"reviews": [
  { "name": "...", "rating": 5, "quote": "...", "date": "..." }
]
```

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 6 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 6 — reviews section + social proof badge"
3. Report: tasks completed, any issues
4. Stop and wait for instructions.
