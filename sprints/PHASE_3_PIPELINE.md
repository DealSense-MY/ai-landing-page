# PHASE_3_PIPELINE.md
# Nexus Landing Engine — Phase 3: Pipeline Updates
# Run: claude "Read MEMORY.md then execute PHASE_3_PIPELINE.md"

## PRE-CHECK
Read MEMORY.md. If PHASE 3 is DONE, stop immediately and tell user.
Confirm PHASE 2 is DONE before proceeding.
Read pipeline/normalize.js, pipeline/generate.js, pipeline/buildHTML.js before changes.

---

## TASK 1 — UPDATE normalize.js

Add all new fields to the normalize function with proper defaults:

- tagline: string, trim, default ''
- email: string, validate format if provided (must contain @ and .), default ''
- phone: string, default ''
- operatingHours: string, default ''
- ownerName: string, default ''
- yearsInOperation: string, default ''
- googleRating: string, default ''
- totalReviews: string, default ''
- services: parse from textarea string
  - split by newline
  - each line split by '|' into { name: string, price: string }
  - filter empty lines
  - default []
- customerReviews: array of { name, rating, quote, date }
  - skip entries where name AND quote are both empty
  - default []
- logoUrl: string, default ''
- galleryImages: array of up to 3 URLs, filter empty strings, default []
- beforeAfterImages: array of up to 2 { before, after } pairs
  - filter pairs where either URL is empty
  - default []

---

## TASK 2 — UPDATE generate.js

### Add niche seed copy for all new niches

Add to NICHE_SEED_COPY object. Each niche needs EN, BM, ZH hints for:
- headline
- subheadline
- benefit hints (3-4 items)

Niches to add:
1. clinic_gp — general clinic, health, doctor, medication
2. clinic_aesthetic — beauty, skin, treatment, glow
3. aircond_service — cooling, repair, maintenance, installation
4. bengkel_kereta — car repair, service, engine, tyre
5. katering_event — food, catering, events, wedding
6. restoran_cafe — dining, food, ambiance, taste
7. saloon_barbershop — hair, grooming, style, cut
8. pusat_tuisyen — education, tuition, exam, results

### Update buildMonolingualPrompt and buildMultilingualPrompt

Add these fields to the prompt context block:

```
- tagline: if provided, use as brand voice/slogan hint
- ownerName: if provided, mention once in hero section as "Led by [name]"
- yearsInOperation: if provided, use as "[X]+ years experience" in benefits
- googleRating: if provided, include as social proof data
- totalReviews: if provided, include alongside rating
- services: if array not empty, instruct AI to generate Services section
  with cards showing name + price
- customerReviews: if array not empty, use as real testimonials in page
- operatingHours: if provided, include in contact section
- email: if provided, include in contact section
- phone: if provided, include in contact section
- galleryImages: if array not empty, instruct AI to include gallery section
- beforeAfterImages: if array not empty, instruct AI to include before/after section
```

### Add WhatsApp pre-filled message to prompt

Instruct AI to generate a whatsappMessage field in the JSON response.
Message must be:
- In the primary output language (first language in outputLang)
- Niche-appropriate greeting + booking intent
- Max 100 characters
- URL-encoded format ready for wa.me link

Example for dental_clinic EN:
"Hi, I'd like to book an appointment at [businessName]. Is there a slot available?"

Example for dental_clinic BM:
"Salam, saya ingin buat temujanji di [businessName]. Ada slot yang available?"

---

## TASK 3 — UPDATE buildHTML.js

### Add new HTML sections

1. SOCIAL PROOF BADGE (in hero section)
   - Render if googleRating is not empty
   - Format: ⭐ [rating] · [totalReviews] Google Reviews
   - Style: small pill badge, gold star color, near hero headline

2. SERVICES SECTION
   - Render only if services array is not empty
   - Grid layout, 2-3 columns responsive
   - Each card: service name (bold) + price (muted, smaller)
   - Section title: "Our Services" / "Perkhidmatan Kami" / "我们的服务"

3. GALLERY SECTION
   - Render only if galleryImages array is not empty
   - 3-column image grid, images crop to square
   - Section title: "Our Gallery" / "Galeri Kami"

4. BEFORE / AFTER SECTION
   - Render only if beforeAfterImages array is not empty
   - Side by side cards per pair
   - "Before" label top-left, "After" label top-left (different color)
   - Section title: "Our Results" / "Hasil Kami"

5. CUSTOMER REVIEWS SECTION
   - Render only if customerReviews array is not empty
   - Card layout: quote text + star rating + name + date
   - Section title: "What Our Customers Say"

6. WHATSAPP CTA — UPGRADE ALL INSTANCES
   Find every WhatsApp button/link in generated HTML.
   Replace href format:
   FROM: https://wa.me/[number]
   TO: https://wa.me/[number]?text=[urlEncodedMessage]

   Use the whatsappMessage field from AI response.
   Apply URL encoding: encodeURIComponent(whatsappMessage)

7. WHATSAPP FLOATING BUTTON
   Add to every generated page, after </footer>:

   ```html
   <a href="https://wa.me/[number]?text=[message]"
      class="whatsapp-float"
      target="_blank"
      aria-label="WhatsApp">
     <svg><!-- WhatsApp SVG icon --></svg>
   </a>
   ```

   CSS for .whatsapp-float:
   - position: fixed, bottom: 24px, right: 24px
   - width: 56px, height: 56px, border-radius: 50%
   - background: #25D366
   - display flex, align-items center, justify-content center
   - box-shadow: 0 4px 12px rgba(0,0,0,0.3)
   - z-index: 999
   - SVG icon: white, 28px

8. WHATSAPP HERO BUTTON — UPGRADE
   In hero section, ensure WhatsApp button:
   - Uses #25D366 green color
   - Has WhatsApp SVG icon (not chat bubble)
   - Text: "WhatsApp Kami" / "WhatsApp Us" / "WhatsApp联系"
   - Uses pre-filled message URL

9. CONTACT SECTION UPDATE
   Add to contact section if provided:
   - email with mailto: link
   - phone (landline) with tel: link
   - operatingHours as text with clock icon
   - ownerName as "Led by [name]" or "Doktor: [name]"

10. PAGE META TITLE
    Set <title> tag to: "[businessName] — [tagline or niche label]"
    Add <meta name="description"> with subheadline content

---

## DONE — UPDATE MEMORY.md

After all tasks complete:
1. Update MEMORY.md: PHASE 3 — DONE ✅ commit: [hash]
2. Commit: "feat: phase 3 — pipeline upgrade, new sections, whatsapp prefill"
3. Report: all tasks completed, any issues
4. Stop and wait for instructions.
