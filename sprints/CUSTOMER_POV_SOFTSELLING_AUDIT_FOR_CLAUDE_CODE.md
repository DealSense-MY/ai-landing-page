# CUSTOMER POV SOFTSELLING AUDIT — Zira Beauty Spa Outreach

## Purpose

This file is for Claude Code.

Use this audit to patch the **first WhatsApp outreach DM** inside the semi-auto outreach dashboard.

The goal is to make the first message feel like a **customer point-of-view observation**, not a seller pitch.

The message should create this reaction in the owner:

> “Dia tengok macam customer sebenar. Ini memang boleh jadi masalah.”

---

## Project Context

Project folder:

```text
tools/semi-auto-outreach/
```

Current system:

- Localhost dashboard running at `http://localhost:3777`
- Zira Beauty Spa lead exists
- WhatsApp number confirmed: `60165531496`
- Lead status: `PREVIEW_READY`
- Dashboard has a YES / approval flow
- WhatsApp opens with a DM draft
- Human still presses send manually

Do not rebuild the project.
Only patch the first outreach DM copy and CTA helper text.

---

## Core Doctrine

1. Human approval is mandatory.
2. No auto-send.
3. No automatic WhatsApp message.
4. No automatic outreach.
5. WhatsApp may only open after human approval.
6. Do not modify approval flow.
7. Do not modify WhatsApp open flow.
8. Do not change server logic.
9. Do not mention price in the first DM.
10. First DM must feel like a customer observation, not selling.

---

## Audit Verdict

The previous DM was professional and safe, but still sounded slightly like a service pitch.

The first outreach message needs to feel more like:

```text
“Saya cuba tengok bisnes puan dari sudut customer baru.”
```

Not like:

```text
“Saya jual landing page / website / marketing service.”
```

---

## What Must Change

### Old Angle

```text
Saya ada buat preview ringkas untuk Zira Beauty Spa.
```

This is acceptable, but it still starts from the seller’s action.

### Better Angle

```text
Saya cuba tengok Zira Beauty Spa dari sudut customer baru yang berminat nak tahu pakej.
```

This starts from the customer’s experience.

That makes the message feel more personal, more useful, and less like spam.

---

## Core Outreach Strategy

The first DM should follow this structure:

```text
Customer POV observation
↓
Specific friction
↓
Small consequence
↓
Simple preview solution
↓
Permission-based CTA
↓
No-pressure exit
```

---

## Main Positioning

Use this positioning internally:

```text
Promo Booking Link
```

Definition:

A simple shareable page/link that collects services, packages, promo, location, and WhatsApp booking in one place, so customers can understand faster and message the business more easily.

However, in the first DM, do not over-explain the product.
Focus on the customer experience first.

---

## First DM Objective

The first DM is not meant to close RM350 immediately.

The first DM is meant to get this response:

```text
Boleh, share la.
```

or:

```text
Boleh tengok dulu.
```

Do not mention:

- RM350
- RM700
- discount
- package price
- website
- landing page
- guaranteed booking
- guaranteed sales
- viral result

Price should only appear after the owner replies or asks.

---

## Customer POV Hook

Use this hook:

```text
Hi puan, saya cuba tengok Zira Beauty Spa dari sudut customer baru yang berminat nak tahu pakej.
```

Why this works:

- It does not sound like a sales opener.
- It sounds like a small business audit.
- It makes the owner imagine a real customer journey.
- It feels specific to Zira Beauty Spa.

---

## Specific Friction

Use this friction:

```text
Saya nampak Zira memang aktif letak promo dan pakej di Facebook. Cuma sebagai customer baru, saya masih perlu scroll beberapa post dulu untuk faham pakej, lokasi dan cara booking.
```

Why this works:

- It praises first: Zira is active.
- It does not insult the business.
- It identifies a realistic booking friction.
- It is specific to the current lead.

---

## Small Consequence

Use this line:

```text
Benda ni kecil, tapi kadang-kadang cukup untuk buat customer tangguh WhatsApp walaupun dia sebenarnya berminat.
```

Why this works:

- It avoids exaggerated claims.
- It connects friction to lost enquiry.
- It creates money clarity without sounding scammy.
- It makes the owner think: “Betul juga.”

---

## Preview Solution

Use this line:

```text
Jadi saya susun satu preview ringkas — servis, pakej, promo, lokasi dan button WhatsApp booking dalam satu page.
```

Why this works:

- It is simple.
- It does not sound technical.
- It describes what the owner gets.
- It keeps the offer small and safe.

---

## CTA

Use this CTA:

```text
Boleh saya share preview ni untuk puan tengok sendiri dari sudut customer?
```

Why this works:

- It is permission-based.
- It does not pressure the owner.
- It frames the preview as a customer experience review.
- It is stronger than a generic “boleh saya share preview?”

---

## No-Pressure Exit

Use this ending:

```text
Kalau sesuai baru teruskan. Kalau tak sesuai pun tak apa.
```

Why this works:

- It lowers resistance.
- It makes the message feel human.
- It increases spam resistance.
- It gives the owner permission to say no.

---

## Final First WhatsApp DM

Replace the current first WhatsApp DM draft with this exact message:

```text
Hi puan, saya cuba tengok Zira Beauty Spa dari sudut customer baru yang berminat nak tahu pakej.

Saya nampak Zira memang aktif letak promo dan pakej di Facebook. Cuma sebagai customer baru, saya masih perlu scroll beberapa post dulu untuk faham pakej, lokasi dan cara booking.

Benda ni kecil, tapi kadang-kadang cukup untuk buat customer tangguh WhatsApp walaupun dia sebenarnya berminat.

Jadi saya susun satu preview ringkas — servis, pakej, promo, lokasi dan button WhatsApp booking dalam satu page.

Boleh saya share preview ni untuk puan tengok sendiri dari sudut customer?

Kalau sesuai baru teruskan. Kalau tak sesuai pun tak apa.
```

---

## Dashboard CTA Helper Text

Replace/update the CTA helper text with this:

```text
First DM ini guna Customer POV Softselling: mesej bermula seperti pemerhatian customer baru, bukan sales pitch. Hook utama ialah customer mungkin berminat tetapi tangguh WhatsApp kerana perlu scroll untuk faham pakej, lokasi dan cara booking.
```

---

## Do Not Use These Words In First DM

Avoid:

```text
website
landing page
sales meletup
viral
confirm ramai customer
guaranteed booking
guaranteed sales
ranking Google
SEO guaranteed
cheap website
pakej murah
RM350
RM700
harga biasa
harga promosi
```

---

## Rules For Claude Code

- Keep Bahasa Melayu.
- First message must feel like customer observation, not selling.
- Do not mention price in first DM.
- Do not mention RM350.
- Do not mention RM700.
- Do not say “saya jual”.
- Do not say “website”.
- Do not sound like an agency pitch.
- Do not use hype words.
- Do not promise bookings.
- Do not promise sales.
- Do not promise viral results.
- Do not guarantee SEO ranking.
- Keep CTA permission-based.
- Keep no-pressure ending.
- Do not modify approval flow.
- Do not modify WhatsApp open flow.
- Do not auto-send messages.
- Do not change server logic.
- Only update first WhatsApp DM draft and CTA helper text.

---

## Expected Patch Scope

Files likely to inspect:

```text
tools/semi-auto-outreach/public/app.js
tools/semi-auto-outreach/data/leads.json
tools/semi-auto-outreach/public/index.html
tools/semi-auto-outreach/public/style.css
```

Only edit the file where the DM draft and CTA helper text are currently generated/stored.

Do not refactor unrelated files.

---

## Audit Score After Fix

Expected score after this patch:

```text
Customer POV impact:   96%
Reply trigger:         94%
CTA strength:          93%
Money clarity:         91%
Spam resistance:       95%
Soft-selling safety:   96%
```

---

## Final Instruction To Claude Code

Patch the outreach dashboard so the first WhatsApp DM uses the final Customer POV Softselling message above.

After patching, report:

1. File changed
2. Exact DM draft after patch
3. Exact CTA helper text after patch
4. Confirmation no approval/WhatsApp/server logic was changed
5. Confirmation no auto-send behavior was added
