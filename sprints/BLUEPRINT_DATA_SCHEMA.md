# BLUEPRINT_DATA_SCHEMA.md
# DealSense — Final Data Schema Blueprint
# Dibaca oleh: Claude Code CLI + Alt (ChatGPT agent)
# Dibuat oleh: Ith (Claude.ai)

---

## 1. LEADS.JSON — FULL SCHEMA

Setiap prospect record dalam leads.json MESTI ikut schema ini.
Field lama dipreserve. Field baru ditambah dengan default.

```json
{
  "id": "",
  "businessName": "",
  "lokasi": "",
  "niche": "",
  "platform": "",
  "contact": "",
  "whatsapp": "",
  "profileUrl": "",
  "kelemahan": "",
  "offer": "Page Booking WhatsApp / Mini Website Booking WhatsApp RM350",
  "defaultDm": "",
  "followUpDraft": "",
  "replyText": "",
  "responseNotes": "",
  "editNotes": "",

  "previewPath": "",
  "previewSlug": "",
  "previewUrl": "",
  "trackedPreviewUrl": "",
  "screenshotPath": "",
  "previewStatus": "NOT_BUILT",
  "previewClicked": false,
  "previewClickCount": 0,
  "firstPreviewClickedAt": "",
  "lastPreviewClickedAt": "",

  "prospectStatus": "NEW",
  "dealStatus": "OPEN",
  "replyStatus": "NO_REPLY",
  "scheduleStatus": "NOT_SCHEDULED",
  "humanDecision": "PENDING",

  "dateAdded": "",
  "approvedAt": "",
  "contactedAt": "",
  "repliedAt": "",
  "closedAt": "",
  "lastActionAt": "",

  "agentRank": 0,
  "fitScore": 0,
  "priority": "",
  "dataConfidence": "",
  "sourceRunId": "",

  "events": [],
  "locked": false,
  "lockedAt": "",
  "lockReason": "",
  "amendments": [],
  "usedInRealWorld": false,

  "landingPageEngineData": {
    "businessInfo": {
      "productBusinessName": "",
      "taglineSlogan": "",
      "email": "",
      "emailStatus": "MISSING_PUBLIC",
      "emailSource": "",
      "phoneLandline": "",
      "operatingHours": "",
      "doctorOwnerName": "",
      "doctorOwnerNameStatus": "MISSING_PUBLIC",
      "yearsInOperation": "",
      "yearsInOperationStatus": "MISSING_PUBLIC",
      "googleRating": "",
      "totalReviews": "",
      "niche": "",
      "tone": "Warm Professional",
      "brandColor": "",
      "brandColorStatus": "AI_SUGGESTED",
      "outputLanguage": "ms-MY"
    },
    "content": {
      "features": [],
      "benefits": [],
      "services": [],
      "servicesFormatted": [],
      "customerReviews": [],
      "reviewTrustSummary": "",
      "commonPraiseTheme": "",
      "commonComplaintFrictionTheme": "",
      "outreachAngle": ""
    },
    "contactMedia": {
      "imageUrl": "",
      "logoUrl": "",
      "galleryImages": [],
      "beforeAfter": [],
      "mediaNeedsManualUpload": true,
      "whatsappNumber": "",
      "address": "",
      "mapQuery": "",
      "googleMapsLink": ""
    },
    "sourceEvidence": {
      "googleMapsLink": "",
      "facebookPageLink": "",
      "instagramLink": "",
      "websiteLink": "",
      "contactDataSource": "",
      "emailDataSource": "",
      "ratingDataSource": "",
      "serviceDataSource": "",
      "dataConfidence": "",
      "evidenceNotes": ""
    },
    "aiSuggested": {
      "taglineSlogan": "",
      "heroHeadline": "",
      "heroSubheadline": "",
      "ctaText": "WhatsApp Untuk Booking",
      "shortBusinessIntro": "",
      "whyChooseSection": [],
      "faq": [],
      "bookingInstruction": "Tekan button WhatsApp untuk tanya slot atau pakej terkini."
    },
    "manualFillNeeded": [],
    "landingPageDataStatus": "PARTIAL"
  }
}
```

---

## 2. STATUS MODEL

### prospectStatus (pipeline utama)
```
NEW → PREVIEW_READY → APPROVED → CONTACTED → REPLIED → CLOSED
```

### dealStatus
```
OPEN → WON / LOST
```

### previewStatus
```
NOT_BUILT → BUILDING → READY → SENT
```

### replyStatus
```
NO_REPLY → REPLIED → FOLLOW_UP_SENT
```

### humanDecision
```
PENDING → YES → NO → EDIT
```

---

## 3. EVENTS SCHEMA (AutoLog)

Setiap event dalam `events[]`:

```json
{
  "eventType": "LEAD_CREATED",
  "timestamp": "2026-06-13T00:00:00.000Z",
  "note": "",
  "metadata": {}
}
```

Event types yang digunakan:
```
LEAD_CREATED
LEAD_IMPORTED
DM_DRAFT_EDITED
PREVIEW_GENERATED
PREVIEW_LINK_CLICKED
CTA_APPROVED
WHATSAPP_OPENED
MANUAL_SEND_CONFIRMED
REPLY_RECEIVED
FOLLOW_UP_SENT
CLOSED_WON
CLOSED_LOST
AMENDMENT_ADDED
LOCKED
```

---

## 4. FIELD MAPPING — Agent JSON → Dashboard

Bila import dari Alt (ChatGPT agent):

```
agent.operatorLiteLeadData.id           → lead.id
agent.operatorLiteLeadData.businessName → lead.businessName
agent.operatorLiteLeadData.lokasi       → lead.lokasi
agent.operatorLiteLeadData.niche        → lead.niche
agent.operatorLiteLeadData.platform     → lead.platform
agent.operatorLiteLeadData.contact      → lead.contact
agent.operatorLiteLeadData.whatsapp     → lead.whatsapp
agent.operatorLiteLeadData.profileUrl   → lead.profileUrl
agent.operatorLiteLeadData.kelemahan    → lead.kelemahan
agent.operatorLiteLeadData.defaultDm    → lead.defaultDm
agent.landingPageEngineData             → lead.landingPageEngineData
agent.scoringData.fitScore              → lead.fitScore
agent.scoringData.priority              → lead.priority
```

Field yang ditambah semasa import (bukan dari agent):
```
lead.dateAdded    = import timestamp
lead.sourceRunId  = generated UUID
lead.events       = [{ eventType: "LEAD_IMPORTED", timestamp: now }]
lead.prospectStatus = "NEW"
lead.dealStatus     = "OPEN"
lead.previewStatus  = "NOT_BUILT"
lead.locked         = false
```

---

## 5. SERVICES FORMAT

Untuk Landing Page Engine:

Format dalam `servicesFormatted[]`:
```
"Facial Treatment | Tanya via WhatsApp"
"Hydra Facial | RM120"
"Consultation | Free"
```

Format dalam `services[]` (reference):
```json
{
  "name": "Facial Treatment",
  "price": "",
  "source": "Facebook public post",
  "confidence": "Medium"
}
```

---

## 6. DUPLICATE CHECK RULE

Semasa import, check duplicate berdasarkan:
1. `id` — exact match = duplicate
2. `whatsapp` + `businessName` — sama kedua-dua = probable duplicate

Jika duplicate ditemui:
- Jangan overwrite record lama
- Tunjuk warning dalam UI
- Biarkan operator decide: skip / merge / force import

