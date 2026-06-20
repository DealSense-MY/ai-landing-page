require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const previewBuilder = require('./modules/previewBuilder');

const app = express();
const PORT = 3777;

// ── Security bootstrap ────────────────────────────────────────────────────────
const OPERATOR_PASSWORD = process.env.APEX_OPERATOR_PASSWORD || '';
const PROTECTED = !!OPERATOR_PASSWORD;

if (!PROTECTED) {
  console.warn('WARNING: APEX_OPERATOR_PASSWORD not set. Dashboard is unprotected.');
}

// In-memory session tokens (single-operator, no persistence needed)
const activeSessions = new Set();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function isLocalHost(req) {
  const host = req.hostname || req.headers.host || '';
  return host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:') || host.startsWith('127.0.0.1:');
}

function getSessionToken(req) {
  // Read from httpOnly cookie
  const raw = req.headers.cookie || '';
  const match = raw.match(/(?:^|;\s*)apex_session=([^;]+)/);
  return match ? match[1] : null;
}

function isAuthenticated(req) {
  if (!PROTECTED) return true;
  const token = getSessionToken(req);
  return token && activeSessions.has(token);
}

// Middleware: require operator auth for write/mutation routes
function requireAuth(req, res, next) {
  if (isAuthenticated(req)) return next();
  return res.status(401).json({ success: false, error: 'Unauthorized' });
}

// Middleware: block non-localhost access when no password is set
function remoteGuard(req, res, next) {
  if (PROTECTED) return next();
  if (!isLocalHost(req)) {
    return res.status(403).send('Operator password required before remote access.');
  }
  return next();
}
// ─────────────────────────────────────────────────────────────────────────────

const LEADS_FILE   = path.join(__dirname, 'data', 'leads.json');
const LOG_FILE     = path.join(__dirname, 'data', 'outreach-log.json');
const RUN_LOG_FILE = path.join(__dirname, 'data', 'run-log.json');
const DEMOS_BASE   = path.join(__dirname, '../../DEMOS');

app.use(express.json());
app.use(remoteGuard);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/previews', requireAuth, express.static(DEMOS_BASE));

// ── Backup helper (Patch E) ───────────────────────────────────────────────────
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  ensureBackupDir();
  const ts  = new Date().toISOString().replace(/[-:T]/g, match => match === 'T' ? '-' : match === ':' ? '' : match).slice(0, 15);
  const base = path.basename(filePath);
  const dest = path.join(BACKUP_DIR, `${ts}-${base}`);
  fs.copyFileSync(filePath, dest);
}

function backupBeforeWrite() {
  backupFile(LEADS_FILE);
  backupFile(LOG_FILE);
  backupFile(RUN_LOG_FILE);
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth API ─────────────────────────────────────────────────────────────────
app.get('/api/auth/status', (req, res) => {
  res.json({
    protected: PROTECTED,
    authenticated: isAuthenticated(req),
    localhost: isLocalHost(req)
  });
});

app.post('/api/operator-login', (req, res) => {
  if (!PROTECTED) {
    return res.json({ ok: true, message: 'No password set — open access on localhost' });
  }
  const { password } = req.body || {};
  if (!password || password !== OPERATOR_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Wrong password' });
  }
  const token = generateToken();
  activeSessions.add(token);
  res.setHeader('Set-Cookie', `apex_session=${token}; HttpOnly; Path=/; SameSite=Strict`);
  res.json({ ok: true });
});

app.post('/api/operator-logout', (req, res) => {
  const token = getSessionToken(req);
  if (token) activeSessions.delete(token);
  res.setHeader('Set-Cookie', 'apex_session=; HttpOnly; Path=/; Max-Age=0');
  res.json({ ok: true });
});
// ─────────────────────────────────────────────────────────────────────────────

// Serialize all file writes to prevent race conditions
let writeQueue = Promise.resolve();

function safeReadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeWriteJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function queueWrite(fn) {
  writeQueue = writeQueue.then(fn).catch(fn);
  return writeQueue;
}

function migrateLeadRecord(lead) {
  // Map old field names to new schema (preserve old fields for safety)
  if (lead.location   !== undefined && lead.lokasi   === undefined) lead.lokasi   = lead.location;
  if (lead.whatsappNumber !== undefined && lead.whatsapp === undefined) lead.whatsapp = lead.whatsappNumber;
  if (lead.weakness   !== undefined && lead.kelemahan === undefined) lead.kelemahan = lead.weakness;
  if (lead.offerAngle !== undefined && lead.offer     === undefined) lead.offer     = lead.offerAngle;
  if (lead.contactMethod !== undefined && lead.contact === undefined) lead.contact  = lead.contactMethod;

  // New fields with defaults
  if (!Array.isArray(lead.events))      lead.events      = [];
  if (lead.locked       === undefined)  lead.locked       = false;
  if (lead.lockedAt     === undefined)  lead.lockedAt     = '';
  if (lead.lockReason   === undefined)  lead.lockReason   = '';
  if (!Array.isArray(lead.amendments))  lead.amendments   = [];
  if (lead.previewSlug  === undefined)  lead.previewSlug  = '';
  if (lead.previewUrl   === undefined)  lead.previewUrl   = '';
  if (lead.trackedPreviewUrl === undefined) lead.trackedPreviewUrl = '';
  if (lead.previewClicked === undefined)   lead.previewClicked    = false;
  if (lead.previewClickCount === undefined) lead.previewClickCount = 0;
  if (lead.prospectStatus === undefined) lead.prospectStatus = lead.status || 'NEW';
  if (lead.dealStatus     === undefined) lead.dealStatus     = 'OPEN';
  if (lead.scheduleStatus === undefined) lead.scheduleStatus = 'NOT_SCHEDULED';
  if (lead.previewStatus  === undefined) lead.previewStatus  = 'NOT_BUILT';
  if (lead.replyStatus    === undefined) lead.replyStatus    = 'NO_REPLY';
  if (lead.humanDecision  === undefined) lead.humanDecision  = 'PENDING';
  if (lead.dateAdded      === undefined) lead.dateAdded      = lead.createdAt || '';
  if (lead.approvedAt     === undefined) lead.approvedAt     = '';
  if (lead.contactedAt    === undefined) lead.contactedAt    = '';
  if (lead.repliedAt      === undefined) lead.repliedAt      = '';
  if (lead.closedAt       === undefined) lead.closedAt       = '';
  if (lead.lastActionAt   === undefined) lead.lastActionAt   = lead.updatedAt || '';
  if (lead.agentRank      === undefined) lead.agentRank      = 0;
  if (lead.fitScore       === undefined) lead.fitScore       = 0;
  if (lead.priority       === undefined) lead.priority       = '';
  if (lead.dataConfidence === undefined) lead.dataConfidence = '';
  if (lead.sourceRunId    === undefined) lead.sourceRunId    = '';
  if (lead.usedInRealWorld === undefined) lead.usedInRealWorld = false;
  if (lead.kelemahan      === undefined) lead.kelemahan      = '';
  if (lead.offer          === undefined) lead.offer          = 'Page Booking WhatsApp / Mini Website Booking WhatsApp RM350';
  if (lead.followUpDraft  === undefined) lead.followUpDraft  = '';
  if (lead.replyText      === undefined) lead.replyText      = '';
  if (lead.responseNotes  === undefined) lead.responseNotes  = '';
  if (lead.editNotes      === undefined) lead.editNotes      = '';
  if (lead.screenshotPath === undefined) lead.screenshotPath = '';
  if (lead.firstPreviewClickedAt === undefined) lead.firstPreviewClickedAt = '';
  if (lead.lastPreviewClickedAt  === undefined) lead.lastPreviewClickedAt  = '';
  if (lead.dealValue        === undefined) lead.dealValue        = 0;
  if (lead.quotedAmount     === undefined) lead.quotedAmount     = 0;
  if (lead.paidAmount       === undefined) lead.paidAmount       = 0;
  if (lead.paymentStatus    === undefined) lead.paymentStatus    = 'UNPAID';
  if (lead.paymentProofNote === undefined) lead.paymentProofNote = '';
  if (lead.paidAt           === undefined) lead.paidAt           = null;
  if (lead.auditScore           === undefined) lead.auditScore           = 0;
  if (lead.previewReadinessScore === undefined) lead.previewReadinessScore = 0;
  if (!lead.audit || typeof lead.audit !== 'object') {
    lead.audit = {
      websiteScore: 0,
      mobileScore:  0,
      ctaScore:     0,
      socialScore:  0,
      reviewScore:  0,
      weakness:     [],
      opportunity:  [],
      missingFields: []
    };
  } else {
    if (lead.audit.websiteScore  === undefined) lead.audit.websiteScore  = 0;
    if (lead.audit.mobileScore   === undefined) lead.audit.mobileScore   = 0;
    if (lead.audit.ctaScore      === undefined) lead.audit.ctaScore      = 0;
    if (lead.audit.socialScore   === undefined) lead.audit.socialScore   = 0;
    if (lead.audit.reviewScore   === undefined) lead.audit.reviewScore   = 0;
    if (!Array.isArray(lead.audit.weakness))     lead.audit.weakness     = [];
    if (!Array.isArray(lead.audit.opportunity))  lead.audit.opportunity  = [];
    if (!Array.isArray(lead.audit.missingFields)) lead.audit.missingFields = [];
  }
  if (lead.landingPageEngineData === undefined) {
    lead.landingPageEngineData = {
      businessInfo: {
        productBusinessName: '', taglineSlogan: '', email: '',
        emailStatus: 'MISSING_PUBLIC', emailSource: '', phoneLandline: '',
        operatingHours: '', doctorOwnerName: '', doctorOwnerNameStatus: 'MISSING_PUBLIC',
        yearsInOperation: '', yearsInOperationStatus: 'MISSING_PUBLIC',
        googleRating: '', totalReviews: '', niche: '', tone: 'Warm Professional',
        brandColor: '', brandColorStatus: 'AI_SUGGESTED', outputLanguage: 'ms-MY'
      },
      content: {
        features: [], benefits: [], services: [], servicesFormatted: [],
        customerReviews: [], reviewTrustSummary: '', commonPraiseTheme: '',
        commonComplaintFrictionTheme: '', outreachAngle: ''
      },
      contactMedia: {
        imageUrl: '', logoUrl: '', galleryImages: [], beforeAfter: [],
        mediaNeedsManualUpload: true, whatsappNumber: lead.whatsapp || '',
        address: '', mapQuery: '', googleMapsLink: ''
      },
      sourceEvidence: {
        googleMapsLink: '', facebookPageLink: '', instagramLink: '', websiteLink: '',
        contactDataSource: '', emailDataSource: '', ratingDataSource: '',
        serviceDataSource: '', dataConfidence: '', evidenceNotes: ''
      },
      aiSuggested: {
        taglineSlogan: '', heroHeadline: '', heroSubheadline: '',
        ctaText: 'WhatsApp Untuk Booking', shortBusinessIntro: '',
        whyChooseSection: [], faq: [],
        bookingInstruction: 'Tekan button WhatsApp untuk tanya slot atau pakej terkini.'
      },
      manualFillNeeded: [],
      landingPageDataStatus: 'PARTIAL'
    };
  }
  return lead;
}

function migrateLeadsFile() {
  const leads = safeReadJSON(LEADS_FILE);
  let migrated = 0;
  const updated = leads.map(lead => {
    const before = JSON.stringify(lead);
    const migrated_lead = migrateLeadRecord({ ...lead });
    // Recompute scores on every migration pass so they stay fresh
    const auditScore           = calculateAuditScore(migrated_lead);
    const previewReadinessScore = calculatePreviewReadinessScore(migrated_lead);
    migrated_lead.auditScore           = auditScore;
    migrated_lead.previewReadinessScore = previewReadinessScore;
    migrated_lead.priority             = calculatePriority(auditScore);
    if (Array.isArray(migrated_lead.audit)) {
      // safety: audit should be object, not array
    } else if (migrated_lead.audit && typeof migrated_lead.audit === 'object') {
      migrated_lead.audit.missingFields = getMissingPreviewFields(migrated_lead);
    }
    const after = migrated_lead;
    if (before !== JSON.stringify(after)) migrated++;
    return after;
  });
  if (migrated > 0) {
    safeWriteJSON(LEADS_FILE, updated);
    console.log(`[Migration] ${migrated} record(s) migrated to new schema.`);
  }
}

function calculateAuditScore(lead) {
  const a = (lead && lead.audit && typeof lead.audit === 'object') ? lead.audit : {};
  const total = (Number(a.websiteScore) || 0)
              + (Number(a.mobileScore)  || 0)
              + (Number(a.ctaScore)     || 0)
              + (Number(a.socialScore)  || 0)
              + (Number(a.reviewScore)  || 0);
  const avg = Math.round(total / 5);
  return isNaN(avg) ? 0 : Math.min(100, Math.max(0, avg));
}

function calculatePriority(score) {
  if (score >= 80) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  return 'LOW';
}

function getMissingPreviewFields(lead) {
  const missing = [];
  if (!lead.businessName || !String(lead.businessName).trim()) missing.push('businessName');
  if (!lead.niche        || !String(lead.niche).trim())        missing.push('niche');
  if (!(lead.location || lead.lokasi))                         missing.push('location');
  if (!(lead.whatsapp || lead.whatsappNumber))                 missing.push('whatsapp');
  if (!lead.landingPageEngineData ||
      typeof lead.landingPageEngineData !== 'object')          missing.push('landingPageEngineData');
  const content = (lead.landingPageEngineData && lead.landingPageEngineData.content) || {};
  const hasServices = Array.isArray(content.services)  && content.services.length  > 0;
  const hasFeatures = Array.isArray(content.features)  && content.features.length  > 0;
  const hasBenefits = Array.isArray(content.benefits)  && content.benefits.length  > 0;
  if (!hasServices && !hasFeatures && !hasBenefits)            missing.push('services/content');
  const ai = (lead.landingPageEngineData && lead.landingPageEngineData.aiSuggested) || {};
  const hasCta = (ai.ctaText && ai.ctaText.trim()) || (lead.whatsapp || lead.whatsappNumber);
  if (!hasCta)                                                 missing.push('CTA/contact');
  return missing;
}

function calculatePreviewReadinessScore(lead) {
  let score = 0;
  if (lead.businessName && String(lead.businessName).trim()) score += 15;
  if (lead.niche        && String(lead.niche).trim())        score += 15;
  if (lead.location || lead.lokasi)                          score += 15;
  if (lead.whatsapp || lead.whatsappNumber)                  score += 20;
  if (lead.landingPageEngineData &&
      typeof lead.landingPageEngineData === 'object')        score += 15;
  const content = (lead.landingPageEngineData && lead.landingPageEngineData.content) || {};
  const hasContent = (Array.isArray(content.services)  && content.services.length  > 0)
                  || (Array.isArray(content.features)  && content.features.length  > 0)
                  || (Array.isArray(content.benefits)  && content.benefits.length  > 0);
  if (hasContent)                                            score += 10;
  const ai = (lead.landingPageEngineData && lead.landingPageEngineData.aiSuggested) || {};
  const hasCta = (ai.ctaText && ai.ctaText.trim()) || (lead.whatsapp || lead.whatsappNumber);
  if (hasCta)                                               score += 10;
  return Math.min(100, Math.max(0, score));
}

function ensureDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(LEADS_FILE))   safeWriteJSON(LEADS_FILE, []);
  if (!fs.existsSync(LOG_FILE))     safeWriteJSON(LOG_FILE, []);
  if (!fs.existsSync(RUN_LOG_FILE)) safeWriteJSON(RUN_LOG_FILE, []);
  migrateLeadsFile();
}

// GET all leads — excludes archived by default; ?archived=true returns only archived
app.get('/api/leads', requireAuth, (req, res) => {
  try {
    const all = safeReadJSON(LEADS_FILE);
    if (req.query.archived === 'true') {
      return res.json(all.filter(l => l.archived === true));
    }
    res.json(all.filter(l => !l.archived));
  } catch (e) {
    res.status(500).json({ error: 'Cannot read leads.json' });
  }
});

// POST archive a lead (soft hide — keeps data intact)
app.post('/api/leads/:id/archive', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const now = new Date().toISOString();
    leads[idx].archived   = true;
    leads[idx].archivedAt = now;
    leads[idx].lastActionAt = now;

    if (!Array.isArray(leads[idx].events)) leads[idx].events = [];
    leads[idx].events.push({
      id:        `ARCHIVED-${Date.now()}`,
      type:      'ARCHIVED',
      leadId:    req.params.id,
      leadName:  leads[idx].businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  {}
    });

    safeWriteJSON(LEADS_FILE, leads);
    res.json({ ok: true, lead: leads[idx] });
  });
});

// POST restore an archived lead
app.post('/api/leads/:id/restore', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const now = new Date().toISOString();
    leads[idx].archived   = false;
    leads[idx].archivedAt = '';
    leads[idx].lastActionAt = now;

    if (!Array.isArray(leads[idx].events)) leads[idx].events = [];
    leads[idx].events.push({
      id:        `RESTORED-${Date.now()}`,
      type:      'RESTORED',
      leadId:    req.params.id,
      leadName:  leads[idx].businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  {}
    });

    safeWriteJSON(LEADS_FILE, leads);
    res.json({ ok: true, lead: leads[idx] });
  });
});

// DELETE lead — soft-delete (marks deleted:true, never removes from file)
app.delete('/api/leads/:id', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    if (leads[idx].locked) {
      return res.status(403).json({ error: 'Lead is locked — cannot delete' });
    }

    const now = new Date().toISOString();
    leads[idx].deleted    = true;
    leads[idx].deletedAt  = now;
    leads[idx].archived   = true;
    leads[idx].archivedAt = now;
    leads[idx].lastActionAt = now;

    if (!Array.isArray(leads[idx].events)) leads[idx].events = [];
    leads[idx].events.push({
      id:        `SOFT_DELETED-${Date.now()}`,
      type:      'SOFT_DELETED',
      leadId:    req.params.id,
      leadName:  leads[idx].businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  {}
    });

    safeWriteJSON(LEADS_FILE, leads);
    res.json({ ok: true, deleted: true, lead: leads[idx] });
  });
});

// POST new lead
app.post('/api/leads', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const { businessName, location, niche, whatsappNumber, profileUrl,
            platform, contactMethod, weakness, offerAngle, defaultDm } = req.body;

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ error: 'businessName is required' });
    }

    const id = businessName.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      + '-' + Date.now();

    if (leads.find(l => l.id === id)) {
      return res.status(409).json({ error: 'Duplicate lead id' });
    }

    const now = new Date().toISOString();
    const lead = {
      id,
      businessName: businessName.trim(),
      location:      location      || '',
      niche:         niche         || '',
      platform:      platform      || 'UNKNOWN',
      contactMethod: contactMethod || 'UNKNOWN',
      whatsappNumber: whatsappNumber || '',
      profileUrl:    profileUrl    || '',
      weakness:      weakness      || '',
      offerAngle:    offerAngle    || '',
      previewPath:   '',
      screenshotPath: '',
      status:        'NEW',
      defaultDm:     defaultDm    || '',
      lastApprovedMessage: '',
      replyNotes:    '',
      followUpDate:  null,
      followUpCount: 0,
      lastContactDate: null,
      dealValue:        0,
      quotedAmount:     0,
      paidAmount:       0,
      paymentStatus:    'UNPAID',
      paymentProofNote: '',
      paidAt:           null,
      auditScore:            0,
      previewReadinessScore: 0,
      priority:              'LOW',
      audit: {
        websiteScore:  0,
        mobileScore:   0,
        ctaScore:      0,
        socialScore:   0,
        reviewScore:   0,
        weakness:      [],
        opportunity:   [],
        missingFields: []
      },
      createdAt:     now,
      updatedAt:     now
    };

    leads.push(lead);
    safeWriteJSON(LEADS_FILE, leads);
    res.json({ ok: true, lead });
  });
});

// PATCH lead status / reply / follow-up
app.patch('/api/leads/:id', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const log   = safeReadJSON(LOG_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    if (leads[idx].locked) return res.status(403).json({ error: 'Lead is locked (' + leads[idx].lockReason + ') — cannot edit' });

    const { status, approvedMessage, reply, followUpDate, scheduleStatus, scheduledAt } = req.body;
    const now = new Date().toISOString();

    if (status)                      leads[idx].status         = status;
    if (approvedMessage)             leads[idx].lastApprovedMessage = approvedMessage;
    if (reply != null)               leads[idx].replyNotes     = reply;
    if (followUpDate)                leads[idx].followUpDate   = followUpDate;
    if (scheduleStatus  !== undefined) leads[idx].scheduleStatus  = scheduleStatus;
    if (scheduledAt     !== undefined) leads[idx].scheduledAt    = scheduledAt;
    if (req.body.prospectStatus !== undefined) leads[idx].prospectStatus = req.body.prospectStatus;
    if (req.body.previewClicked !== undefined)        leads[idx].previewClicked        = req.body.previewClicked;
    if (req.body.previewClickCount !== undefined)     leads[idx].previewClickCount     = req.body.previewClickCount;
    if (req.body.lastPreviewClickedAt !== undefined)  leads[idx].lastPreviewClickedAt  = req.body.lastPreviewClickedAt;

    if (status === 'FOLLOW_UP_NEEDED') {
      leads[idx].followUpCount = (leads[idx].followUpCount || 0) + 1;
    }
    if (status && ['APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND'].includes(status)) {
      leads[idx].lastContactDate = now;
    }

    leads[idx].updatedAt = now;

    log.push({
      timestamp:    now,
      leadId:       req.params.id,
      businessName: leads[idx].businessName,
      action:       status || 'update',
      message:      approvedMessage || null,
      reply:        reply        || null,
      followUpDate: followUpDate || null
    });

    safeWriteJSON(LEADS_FILE, leads);
    safeWriteJSON(LOG_FILE, log);
    res.json({ ok: true, lead: leads[idx] });
  });
});

// POST import prospects from ChatGPT agent JSON — Patch 5 upgrade
app.post('/api/leads/import', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const { leads: incoming } = req.body;
    if (!Array.isArray(incoming) || !incoming.length) {
      return res.status(400).json({ error: 'leads array required' });
    }

    const existing = safeReadJSON(LEADS_FILE);

    // Build dedupe sets — id, wa+name, website
    const existingIds     = new Set(existing.map(l => l.id));
    const existingWaName  = new Set(
      existing.map(l => (l.whatsapp || l.whatsappNumber || '') + '|' + (l.businessName || '').toLowerCase())
    );
    const existingWebsite = new Set(
      existing.map(l => (l.website || '').trim().toLowerCase()).filter(Boolean)
    );
    // Track which existing leads are closed so we can report "closed deal duplicate"
    const closedStatuses  = new Set(['CLOSED_WON', 'CLOSED_LOST']);
    const existingClosed  = new Map(); // id/key → businessName
    existing.forEach(l => {
      const isClosed = closedStatuses.has(l.prospectStatus) || closedStatuses.has(l.dealStatus)
                     || closedStatuses.has(l.status) || closedStatuses.has(l.lockReason);
      if (isClosed) existingClosed.set(l.id, l.businessName);
    });

    const now       = new Date().toISOString();
    const batchId   = `batch-${Date.now()}`;
    let imported    = 0;
    const errors    = [];       // validation errors per record
    const skipped   = [];       // duplicates
    const closedDuplicates = []; // closed-deal duplicates — never enter Top 10
    const importedLeads = [];   // track newly added leads for Top 10

    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
    if (!Array.isArray(runLog)) runLog = [];

    for (const raw of incoming) {
      // Normalise: Format A (operatorLiteLeadData nested) or Format B (flat)
      const src     = raw.operatorLiteLeadData || raw;
      const scoring = raw.scoringData || {};

      const businessName = (src.businessName || '').trim();
      const niche        = (src.niche        || '').trim();
      const location     = (src.location || src.lokasi || '').trim();
      const website      = (src.website      || '').trim().toLowerCase();

      // ── Required field validation ──
      const validationErrors = [];
      if (!businessName)  validationErrors.push('missing businessName');
      if (!niche)         validationErrors.push('missing niche');
      if (!location)      validationErrors.push('missing location');

      // At least one contact/source
      const wa       = (src.whatsapp || src.whatsappNumber || '').replace(/[^0-9+]/g, '');
      const phone    = (src.phone    || '').replace(/[^0-9+]/g, '');
      const facebook = (src.facebook  || src.facebookUrl  || '').trim();
      const instagram = (src.instagram || src.instagramUrl || '').trim();
      const gmapsUrl  = (src.googleMapsUrl || '').trim();
      const hasContact = wa || phone || facebook || instagram || website || gmapsUrl;
      if (!hasContact) validationErrors.push('missing contact (need whatsapp, phone, facebook, instagram, website, or googleMapsUrl)');

      if (validationErrors.length) {
        errors.push({ businessName: businessName || '(unknown)', reasons: validationErrors });
        continue;
      }

      // ── Generate stable id ──
      let id = (src.id || '').trim();
      if (!id) {
        id = (businessName + '-' + location).toLowerCase()
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
      }

      // ── Duplicate check ──
      const waNameKey = (wa || phone) + '|' + businessName.toLowerCase();

      // Closed-deal duplicate guard: skip + report separately, never enter Top 10
      const isIdClosed     = existingClosed.has(id);
      const isWaNameClosed = existing.some(l =>
        ((l.whatsapp || l.whatsappNumber || '') + '|' + (l.businessName || '').toLowerCase()) === waNameKey
        && (closedStatuses.has(l.prospectStatus) || closedStatuses.has(l.dealStatus)
            || closedStatuses.has(l.status)      || closedStatuses.has(l.lockReason))
      );
      const isWebClosed = website && existing.some(l =>
        (l.website || '').trim().toLowerCase() === website
        && (closedStatuses.has(l.prospectStatus) || closedStatuses.has(l.dealStatus)
            || closedStatuses.has(l.status)      || closedStatuses.has(l.lockReason))
      );
      if (isIdClosed || isWaNameClosed || isWebClosed) {
        closedDuplicates.push({ id, businessName, reason: 'closed deal duplicate (CLOSED_WON or CLOSED_LOST)' });
        continue;
      }

      // Regular duplicate check
      if (existingIds.has(id) || existingWaName.has(waNameKey) || (website && existingWebsite.has(website))) {
        skipped.push({ id, businessName, reason: 'duplicate' });
        continue;
      }

      // ── Build safe lead status — never use DISCOVERED ──
      const KNOWN_STATUSES = new Set([
        'NEW','PREVIEW_READY','APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND',
        'SENT_MANUAL_CONFIRMATION_NEEDED','REPLIED','FOLLOW_UP_NEEDED',
        'REJECTED_NEEDS_REWORK','CLOSED_WON','CLOSED_LOST'
      ]);
      const rawStatus = src.prospectStatus || src.status || '';
      const safeStatus = KNOWN_STATUSES.has(rawStatus) ? rawStatus : 'NEW';

      // ── Merge audit object from import ──
      const importedAudit = (raw.audit && typeof raw.audit === 'object') ? raw.audit : {};

      const lead = migrateLeadRecord({
        id,
        businessName,
        lokasi:         location,
        location:       location,
        niche:          niche,
        website:        website || src.website || '',
        platform:       src.platform    || 'UNKNOWN',
        contactMethod:  src.contact     || src.contactMethod || (wa ? 'WhatsApp' : 'UNKNOWN'),
        whatsappNumber: wa,
        whatsapp:       wa,
        phone:          phone,
        facebook:       facebook,
        instagram:      instagram,
        googleMapsUrl:  gmapsUrl,
        profileUrl:     src.profileUrl  || facebook || instagram || '',
        weakness:       src.kelemahan   || src.weakness || '',
        kelemahan:      src.kelemahan   || src.weakness || '',
        offerAngle:     src.offer       || src.offerAngle || '',
        offer:          src.offer       || src.offerAngle || '',
        followUpDraft:  src.followUpDraft || '',
        defaultDm:      src.defaultDm   || '',
        previewPath:    src.previewPath || '',
        screenshotPath: src.screenshotPath || '',
        status:         safeStatus,
        prospectStatus: safeStatus,
        humanDecision:  src.humanDecision  || 'PENDING',
        editNotes:      src.editNotes      || '',
        fitScore:       scoring.fitScore   || 0,
        priority:       scoring.priority   || '',
        agentRank:      raw.agentRank      || 0,
        dateAdded:      now,
        sourceRunId:    batchId,
        audit: {
          websiteScore:  Number(importedAudit.websiteScore)  || 0,
          mobileScore:   Number(importedAudit.mobileScore)   || 0,
          ctaScore:      Number(importedAudit.ctaScore)      || 0,
          socialScore:   Number(importedAudit.socialScore)   || 0,
          reviewScore:   Number(importedAudit.reviewScore)   || 0,
          weakness:      Array.isArray(importedAudit.weakness)     ? importedAudit.weakness     : [],
          opportunity:   Array.isArray(importedAudit.opportunity)  ? importedAudit.opportunity  : [],
          missingFields: []
        },
        events: [{
          id:        `BATCH_PROSPECT_IMPORTED-${Date.now()}-${imported}`,
          type:      'BATCH_PROSPECT_IMPORTED',
          leadId:    id,
          leadName:  businessName,
          timestamp: now,
          source:    'operator-import',
          actor:     'Aliff',
          metadata:  { batchId, source: 'batch-import', importedAt: now }
        }],
        amendments: [],
        locked: false
      });

      // Merge landingPageEngineData if present in raw
      if (raw.landingPageEngineData && typeof raw.landingPageEngineData === 'object') {
        lead.landingPageEngineData = Object.assign(lead.landingPageEngineData || {}, raw.landingPageEngineData);
      }

      // Compute scores after full merge
      lead.auditScore            = calculateAuditScore(lead);
      lead.previewReadinessScore = calculatePreviewReadinessScore(lead);
      lead.priority              = calculatePriority(lead.auditScore);
      if (lead.audit && typeof lead.audit === 'object') {
        lead.audit.missingFields = getMissingPreviewFields(lead);
      }

      existing.push(lead);
      existingIds.add(id);
      existingWaName.add(waNameKey);
      if (website) existingWebsite.add(website);
      runLog.push(lead.events[0]);
      importedLeads.push(lead);
      imported++;
    }

    safeWriteJSON(LEADS_FILE, existing);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    // ── Build Top 10 ranking (no closed-deal duplicates, sorted by score) ──
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const top10 = [...importedLeads]
      .sort((a, b) => {
        if (b.previewReadinessScore !== a.previewReadinessScore) return b.previewReadinessScore - a.previewReadinessScore;
        if (b.auditScore !== a.auditScore) return b.auditScore - a.auditScore;
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      })
      .slice(0, 10)
      .map(l => ({
        id:                   l.id,
        businessName:         l.businessName,
        niche:                l.niche,
        location:             l.location || l.lokasi,
        auditScore:           l.auditScore,
        previewReadinessScore: l.previewReadinessScore,
        priority:             l.priority,
        missingFields:        (l.audit && l.audit.missingFields) || []
      }));

    res.json({
      ok:               true,
      batchId,
      received:         incoming.length,
      imported,
      skipped:          skipped.length,
      duplicates:       skipped.length,
      closedDuplicates: closedDuplicates.length,
      errors,
      skippedList:      skipped,
      closedDuplicateList: closedDuplicates,
      top10
    });
  });
});

// POST generate preview for a lead
app.post('/api/leads/:id/generate-preview', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const idx   = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const lead = leads[idx];
    let html;
    try {
      html = previewBuilder.buildPreviewHTML(lead);
    } catch (e) {
      return res.status(500).json({ error: 'Preview build failed: ' + e.message });
    }

    let saved;
    try {
      saved = previewBuilder.savePreview(lead, html);
    } catch (e) {
      return res.status(500).json({ error: 'Preview save failed: ' + e.message });
    }

    const now       = new Date().toISOString();
    const previewUrl = `/previews/${saved.slug}/${saved.filename}`;

    lead.previewSlug   = saved.slug;
    lead.previewPath   = saved.filepath;
    lead.previewUrl    = previewUrl;
    lead.trackedPreviewUrl = previewUrl;
    lead.previewStatus = 'READY';
    lead.lastActionAt  = now;

    if (!Array.isArray(lead.events)) lead.events = [];
    const event = {
      id:        `PREVIEW_GENERATED-${Date.now()}`,
      type:      'PREVIEW_GENERATED',
      leadId:    lead.id,
      leadName:  lead.businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  { previewUrl, slug: saved.slug }
    };
    lead.events.push(event);

    leads[idx] = lead;
    safeWriteJSON(LEADS_FILE, leads);

    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
    if (!Array.isArray(runLog)) runLog = [];
    runLog.push(event);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    res.json({ ok: true, previewPath: saved.filepath, previewUrl, lead: leads[idx] });
  });
});

// POST event to a lead's events[] and run-log.json
app.post('/api/leads/:id/events', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const { type, metadata } = req.body;
    if (!type) return res.status(400).json({ error: 'event type required' });

    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const now = new Date().toISOString();
    const event = {
      id:        `${type}-${Date.now()}`,
      type,
      leadId:    req.params.id,
      leadName:  leads[idx].businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  metadata || {}
    };

    if (!Array.isArray(leads[idx].events)) leads[idx].events = [];
    leads[idx].events.push(event);

    if (type === 'SENT_MANUAL_CONFIRMED') {
      leads[idx].contactedAt   = now;
      leads[idx].lastActionAt  = now;
      leads[idx].humanDecision = 'SENT_MANUALLY_CONFIRMED';
      if (leads[idx].prospectStatus !== 'CLOSED_WON' && leads[idx].prospectStatus !== 'CLOSED_LOST') {
        leads[idx].prospectStatus = 'CONTACTED';
      }
    } else {
      leads[idx].lastActionAt = now;
    }

    safeWriteJSON(LEADS_FILE, leads);

    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) { /* recreate */ }
    if (!Array.isArray(runLog)) runLog = [];
    runLog.push(event);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    res.json({ ok: true, event, lead: leads[idx] });
  });
});

// POST lock a lead (Closed Won / Closed Lost)
app.post('/api/leads/:id/lock', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const { reason, dealStatus, prospectStatus } = req.body;
    if (!reason) return res.status(400).json({ error: 'lock reason required' });

    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const now = new Date().toISOString();
    const lead = leads[idx];

    if (!Array.isArray(lead.events)) lead.events = [];

    // Log close event (CLOSED_WON or CLOSED_LOST) — skip duplicate if already same
    const closeType = reason; // CLOSED_WON or CLOSED_LOST
    const closeEvent = {
      id: `${closeType}-${Date.now()}`,
      type: closeType,
      leadId: req.params.id,
      leadName: lead.businessName || '',
      timestamp: now,
      source: 'operator-ui',
      actor: 'Aliff',
      metadata: {}
    };
    lead.events.push(closeEvent);

    // Set deal / prospect status
    lead.dealStatus     = dealStatus || closeType;
    lead.prospectStatus = prospectStatus || closeType;
    lead.closedAt       = now;
    lead.lastActionAt   = now;

    // Lock
    lead.locked     = true;
    lead.lockedAt   = now;
    lead.lockReason = closeType;

    // Log LOCKED event
    const lockEvent = {
      id: `LOCKED-${Date.now() + 1}`,
      type: 'LOCKED',
      leadId: req.params.id,
      leadName: lead.businessName || '',
      timestamp: now,
      source: 'operator-ui',
      actor: 'Aliff',
      metadata: { lockReason: closeType }
    };
    lead.events.push(lockEvent);

    leads[idx] = lead;
    safeWriteJSON(LEADS_FILE, leads);

    // Dual-write to run-log
    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
    if (!Array.isArray(runLog)) runLog = [];
    runLog.push(closeEvent);
    runLog.push(lockEvent);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    res.json({ ok: true, lead: leads[idx] });
  });
});

// POST add amendment to a lead
app.post('/api/leads/:id/amendments', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const { note, reason } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ error: 'amendment note required' });

    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const now = new Date().toISOString();
    const lead = leads[idx];

    if (!Array.isArray(lead.amendments)) lead.amendments = [];
    if (!Array.isArray(lead.events))    lead.events    = [];

    const amendment = {
      id:        `amend-${Date.now()}`,
      timestamp: now,
      actor:     'Aliff',
      note:      note.trim(),
      reason:    reason ? reason.trim() : ''
    };
    lead.amendments.push(amendment);
    lead.lastActionAt = now;

    const event = {
      id:        `AMENDMENT_ADDED-${Date.now()}`,
      type:      'AMENDMENT_ADDED',
      leadId:    req.params.id,
      leadName:  lead.businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  { amendmentId: amendment.id, note: note.trim() }
    };
    lead.events.push(event);

    leads[idx] = lead;
    safeWriteJSON(LEADS_FILE, leads);

    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
    if (!Array.isArray(runLog)) runLog = [];
    runLog.push(event);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    res.json({ ok: true, amendment, lead: leads[idx] });
  });
});

// PATCH audit sub-object — Patch 5A
app.patch('/api/leads/:id/audit', requireAuth, (req, res) => {
  queueWrite(() => {
    try {
      backupBeforeWrite();
      const leads = safeReadJSON(LEADS_FILE);
      const idx = leads.findIndex(l => l.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

      const lead = leads[idx];
      if (lead.locked) return res.status(403).json({ error: 'Lead is locked and cannot be edited' });

      lead.audit = lead.audit || {
        websiteScore: 0, mobileScore: 0, ctaScore: 0, socialScore: 0, reviewScore: 0,
        weakness: [], opportunity: [], missingFields: []
      };

      const numericFields = ['websiteScore', 'mobileScore', 'ctaScore', 'socialScore', 'reviewScore'];
      const arrayFields   = ['weakness', 'opportunity', 'missingFields'];

      numericFields.forEach(f => {
        if (req.body[f] !== undefined) {
          lead.audit[f] = Math.min(100, Math.max(0, Number(req.body[f]) || 0));
        }
      });
      arrayFields.forEach(f => {
        if (req.body[f] !== undefined) {
          lead.audit[f] = Array.isArray(req.body[f]) ? req.body[f] : [];
        }
      });

      lead.auditScore            = calculateAuditScore(lead);
      lead.previewReadinessScore = calculatePreviewReadinessScore(lead);
      lead.priority              = calculatePriority(lead.auditScore);
      lead.audit.missingFields   = getMissingPreviewFields(lead);

      const now = new Date().toISOString();
      lead.lastActionAt = now;

      if (!Array.isArray(lead.events)) lead.events = [];
      const event = {
        id:        `AUDIT_UPDATED-${Date.now()}`,
        type:      'AUDIT_UPDATED',
        leadId:    lead.id,
        leadName:  lead.businessName || '',
        timestamp: now,
        source:    'operator-ui',
        actor:     'Aliff',
        metadata:  {
          auditScore:            lead.auditScore,
          previewReadinessScore: lead.previewReadinessScore,
          priority:              lead.priority
        }
      };
      lead.events.push(event);
      leads[idx] = lead;
      safeWriteJSON(LEADS_FILE, leads);

      let runLog = [];
      try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
      if (!Array.isArray(runLog)) runLog = [];
      runLog.push(event);
      safeWriteJSON(RUN_LOG_FILE, runLog);

      res.json({ success: true, data: leads[idx] });
    } catch (e) {
      res.status(500).json({ error: 'Audit update failed: ' + e.message });
    }
  });
});

// GET run-log.json as JSON array
app.get('/api/logs', requireAuth, (req, res) => {
  try {
    let log = [];
    if (fs.existsSync(RUN_LOG_FILE)) {
      log = safeReadJSON(RUN_LOG_FILE);
      if (!Array.isArray(log)) log = [];
    }
    res.json(log);
  } catch (e) {
    res.json([]);
  }
});

// POST mark lead as paid
app.post('/api/leads/:id/mark-paid', requireAuth, (req, res) => {
  queueWrite(() => {
    backupBeforeWrite();
    const leads = safeReadJSON(LEADS_FILE);
    const idx = leads.findIndex(l => l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const lead = leads[idx];
    if (lead.locked) {
      return res.status(403).json({ error: 'Lead is locked (' + lead.lockReason + ') — cannot modify payment fields' });
    }

    const paidAmount  = Number(req.body.paidAmount)  || 0;
    const dealValue   = Number(req.body.dealValue)   || paidAmount;
    const proofNote   = req.body.paymentProofNote || lead.paymentProofNote || '';
    const now         = new Date().toISOString();

    lead.paidAmount       = paidAmount;
    lead.dealValue        = dealValue;
    lead.quotedAmount     = lead.quotedAmount || dealValue;
    lead.paymentProofNote = proofNote;
    lead.paymentStatus    = 'PAID';
    lead.paidAt           = now;
    lead.dealStatus       = 'PAID';
    lead.lastActionAt     = now;

    const event = {
      id:        `PAYMENT_RECEIVED-${Date.now()}`,
      type:      'PAYMENT_RECEIVED',
      leadId:    lead.id,
      leadName:  lead.businessName || '',
      timestamp: now,
      source:    'operator-ui',
      actor:     'Aliff',
      metadata:  { paidAmount, dealValue, paymentProofNote: proofNote, paidAt: now }
    };
    if (!Array.isArray(lead.events)) lead.events = [];
    lead.events.push(event);

    leads[idx] = lead;
    safeWriteJSON(LEADS_FILE, leads);

    let runLog = [];
    try { runLog = safeReadJSON(RUN_LOG_FILE); } catch (e) {}
    if (!Array.isArray(runLog)) runLog = [];
    runLog.push(event);
    safeWriteJSON(RUN_LOG_FILE, runLog);

    res.json({ ok: true, lead: leads[idx] });
  });
});

// GET export — full leads as JSON download
app.get('/api/export/json', requireAuth, (req, res) => {
  try {
    const leads = safeReadJSON(LEADS_FILE);
    res.setHeader('Content-Disposition', 'attachment; filename="leads-export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(leads, null, 2));
  } catch (e) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET export — CSV download
app.get('/api/export/csv', requireAuth, (req, res) => {
  try {
    const leads = safeReadJSON(LEADS_FILE);
    const cols = ['id','businessName','location','niche','platform','contactMethod',
                  'whatsappNumber','status','followUpDate','followUpCount',
                  'lastContactDate','replyNotes','offerAngle','createdAt'];
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const rows = [cols.join(','), ...leads.map(l => cols.map(c => esc(l[c])).join(','))];
    res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(rows.join('\r\n'));
  } catch (e) {
    res.status(500).json({ error: 'Export failed' });
  }
});

ensureDataFiles();
app.listen(PORT, () => {
  console.log(`\n✅ DealSense Approval Sender Lite`);
  console.log(`📋 Dashboard: http://localhost:${PORT}`);
  console.log(`⚠  Human approval required before any message is sent.\n`);
});
