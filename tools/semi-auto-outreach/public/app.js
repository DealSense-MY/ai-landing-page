// ── Phase 6 config ────────────────────────────────────────────
const WORKING_HOURS = { start: 9, end: 21 }; // 9AM–9PM local time
const OP_STATE_KEY  = 'dealsense_operation_state';

// ── Phase 7 config ────────────────────────────────────────────
const DAILY_TARGET = { outreach: 5, followUp: 3 };
const STALE_DAYS   = 5;   // days since lastActionAt before STALE badge shows
const OVERDUE_DAYS = 3;   // days since lastActionAt before follow-up overdue

let _smartPanelCollapsed = false;

const STATUSES = [
  'NEW','PREVIEW_READY','APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND',
  'SENT_MANUAL_CONFIRMATION_NEEDED','REPLIED','FOLLOW_UP_NEEDED',
  'REJECTED_NEEDS_REWORK','CLOSED_WON','CLOSED_LOST'
];

// Pipeline tab definitions — label, filter key, match values
// ARCHIVED is a special tab — fetches from server with ?archived=true
const PIPELINE_TABS = [
  { key: 'ALL',          label: 'All',           match: null },
  { key: 'NEW',          label: 'New',           match: ['NEW'] },
  { key: 'NEEDS_REVIEW', label: 'Needs Review',  match: ['REJECTED_NEEDS_REWORK'] },
  { key: 'APPROVED',     label: 'Approved',      match: ['APPROVED_TO_SEND','APPROVED_EDITED_TO_SEND'] },
  { key: 'CONTACTED',    label: 'Contacted',     match: ['SENT_MANUAL_CONFIRMATION_NEEDED','CONTACTED'] },
  { key: 'REPLIED',      label: 'Replied',       match: ['REPLIED'] },
  { key: 'FOLLOWUP',     label: 'Follow-Up',     match: ['FOLLOW_UP_NEEDED'] },
  { key: 'CLOSED_WON',   label: 'Closed Won',    match: ['CLOSED_WON'] },
  { key: 'CLOSED_LOST',  label: 'Closed Lost',   match: ['CLOSED_LOST'] },
  { key: 'ARCHIVED',     label: 'Archived',      match: null, archived: true },
];

let _activeTab      = 'ALL';
let _allLeads       = [];
let _archivedLeads  = [];
let _selectedId     = null;
let _searchQuery    = '';

function getStatus(l) {
  return l.prospectStatus || l.status || 'NEW';
}

// Returns canonical pipeline status — does NOT mutate lead
function getLeadStatus(lead) {
  const closedFields = [
    lead.prospectStatus, lead.status, lead.dealStatus,
    lead.pipelineStatus, lead.lockReason
  ];
  if (closedFields.some(f => f === 'CLOSED_WON'))  return 'CLOSED_WON';
  if (closedFields.some(f => f === 'CLOSED_LOST')) return 'CLOSED_LOST';

  const s = lead.prospectStatus || lead.status || '';
  if (s === 'REJECTED_NEEDS_REWORK') return 'NEEDS_DM_REWRITE';
  if (s === 'REPLIED' || s === 'REPLIED_UNHANDLED') return 'REPLIED';
  if (s === 'FOLLOW_UP_NEEDED') return 'FOLLOW_UP';
  if (
    s === 'SENT_MANUAL_CONFIRMATION_NEEDED' ||
    s === 'CONTACTED' ||
    s === 'APPROVED_TO_SEND' ||
    s === 'APPROVED_EDITED_TO_SEND'
  ) return 'CONTACTED';
  if (s === 'APPROVED_TO_SEND' || s === 'APPROVED_EDITED_TO_SEND') return 'APPROVED';
  if (s === 'PREVIEW_READY') return 'PREVIEW_READY';
  if (s === 'NEW' || !s) return 'NEW';
  // Payment-triggered deal status — surface via dealStatus field
  if (lead.dealStatus === 'PAID' || lead.paymentStatus === 'PAID') return 'PAID';
  return 'UNKNOWN';
}

// Returns human-readable next action for operator
function getNextAction(status) {
  const map = {
    NEW:             'Generate preview or prepare first outreach DM.',
    PREVIEW_READY:   'Review DM and approve outreach.',
    APPROVED:        'Open WhatsApp / confirm sent.',
    CONTACTED:       'Wait for reply or prepare follow-up.',
    REPLIED:         'Use ResponseOps / close path.',
    FOLLOW_UP:       'Prepare follow-up draft.',
    NEEDS_DM_REWRITE:'Rewrite DM and re-approve.',
    CLOSED_WON:      'View only.',
    CLOSED_LOST:     'View only.',
    PAID:            'Start delivery.',
    UNKNOWN:         'Review prospect manually.'
  };
  return map[status] || 'Review prospect manually.';
}

// Returns a readable label for display (no raw internal status codes)
function readableStatus(status) {
  const map = {
    NEW:                              'NEW',
    PREVIEW_READY:                    'PREVIEW READY',
    APPROVED_TO_SEND:                 'APPROVED',
    APPROVED_EDITED_TO_SEND:          'APPROVED (EDITED)',
    SENT_MANUAL_CONFIRMATION_NEEDED:  'CONTACTED',
    CONTACTED:                        'CONTACTED',
    REPLIED:                          'REPLIED',
    REPLIED_UNHANDLED:                'REPLIED',
    FOLLOW_UP_NEEDED:                 'FOLLOW-UP',
    REJECTED_NEEDS_REWORK:            'Needs DM Rewrite',
    NEEDS_DM_REWRITE:                 'Needs DM Rewrite',
    CLOSED_WON:                       'CLOSED WON',
    CLOSED_LOST:                      'CLOSED LOST',
    SCHEDULED:                        'SCHEDULED',
    PAID:                             'PAID',
    UNKNOWN:                          'UNKNOWN'
  };
  return map[status] || status || 'UNKNOWN';
}

function matchesTab(l, tab) {
  if (tab.archived) return false; // ARCHIVED tab is handled separately
  if (!tab.match) return true;
  const s = getStatus(l);
  return tab.match.includes(s);
}

function applySearch(leads) {
  if (!_searchQuery) return leads;
  const q = _searchQuery.toLowerCase();
  return leads.filter(l =>
    (l.businessName || '').toLowerCase().includes(q) ||
    (l.location || l.lokasi || '').toLowerCase().includes(q) ||
    (l.niche || '').toLowerCase().includes(q) ||
    (l.whatsappNumber || l.whatsapp || '').includes(q)
  );
}

function renderTabs(leads) {
  const container = document.getElementById('pipeline-tabs');
  container.innerHTML = PIPELINE_TABS.map(tab => {
    let count;
    if (tab.archived) {
      count = _archivedLeads.length;
    } else if (tab.match) {
      count = leads.filter(l => matchesTab(l, tab)).length;
    } else {
      count = leads.length;
    }
    const active = _activeTab === tab.key ? 'tab-active' : '';
    const needsReviewClass = tab.key === 'NEEDS_REVIEW' && count > 0 ? ' tab-needs-review' : '';
    const archivedClass = tab.key === 'ARCHIVED' ? ' tab-archived' : '';
    return `<button class="tab-btn ${active}${needsReviewClass}${archivedClass}" data-key="${safeClass(tab.key)}" onclick="switchTab('${safeClass(tab.key)}')">${esc(tab.label)}<span class="tab-count">${count}</span></button>`;
  }).join('');
}

function switchTab(key) {
  _activeTab = key;
  const tab = PIPELINE_TABS.find(t => t.key === key);
  if (tab && tab.archived) {
    renderTabs(_allLeads);
    const filtered = applySearch(_archivedLeads);
    if (_selectedId && !filtered.find(l => l.id === _selectedId)) _selectedId = null;
    renderTable(filtered);
    renderCards(filtered);
    return;
  }
  renderTabs(_allLeads);
  const filtered = applySearch(_allLeads.filter(l => matchesTab(l, tab)));
  if (_selectedId && !filtered.find(l => l.id === _selectedId)) _selectedId = null;
  renderTable(filtered);
  renderCards(filtered);
}

function renderTable(leads) {
  const tbody = document.getElementById('prospect-tbody');
  if (!leads.length) {
    tbody.innerHTML = `<tr class="table-empty-row"><td colspan="7">No prospects in this tab.</td></tr>`;
    return;
  }
  tbody.innerHTML = leads.map(l => {
    const s       = getStatus(l);
    const deal    = l.dealStatus || 'OPEN';
    const reply   = l.replyStatus || '—';
    const last    = l.lastActionAt || l.updatedAt || '';
    const lastFmt = last ? new Date(last).toLocaleDateString('en-MY') : '—';
    const score   = l.fitScore ? l.fitScore : (l.agentRank || '—');
    const active  = _selectedId === l.id ? 'table-row-active' : '';
    const staleStatuses = ['CONTACTED', 'APPROVED_TO_SEND', 'APPROVED_EDITED_TO_SEND'];
    const isStale = staleStatuses.includes(s) && deal === 'OPEN' && !l.locked
                    && daysSince(l.lastActionAt) !== null && daysSince(l.lastActionAt) >= STALE_DAYS;
    const staleBadge = isStale ? `<span class="stale-badge" title="No action in ${STALE_DAYS} days">STALE</span>` : '';
    return `<tr class="table-row ${active}" data-id="${safeClass(l.id)}" onclick="selectProspect('${safeClass(l.id)}')">
      <td><strong>${esc(l.businessName)}</strong></td>
      <td>${esc(l.lokasi || l.location || '—')}</td>
      <td><span class="table-status-pill pill-${safeClass(s)}">${esc(s)}</span>${staleBadge}</td>
      <td>${esc(reply)}</td>
      <td><span class="table-status-pill pill-${safeClass(deal)}">${esc(deal)}</span></td>
      <td>${lastFmt}</td>
      <td>${score}</td>
    </tr>`;
  }).join('');
}

function selectProspect(id) {
  openCardModal(id);
}

// ── Phase 6B: Card Modal ──────────────────────────────────────
function openCardModal(id) {
  const lead = _allLeads.find(l => l.id === id) || _archivedLeads.find(l => l.id === id);
  if (!lead) return;
  _selectedId = id;

  const content = document.getElementById('card-modal-content');
  // Step 1: inject HTML first so all element IDs exist in DOM
  content.innerHTML = buildLeadCard(lead);

  // Step 2: show modal immediately (avoid flicker)
  document.getElementById('card-modal-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Step 3: defer all DOM queries to next tick so browser parses innerHTML
  setTimeout(() => {
    populateLeadCard(lead, content);
    if (isLocked(lead.id)) applyLockedUI(lead, content);
    attachEvents(lead);
    // Sync char count after textarea is populated
    const ta = document.getElementById('dm-' + lead.id);
    const cc = document.getElementById('cc-' + lead.id);
    if (ta && cc) cc.textContent = ta.value.length + ' chars';
  }, 0);

  // Highlight selected row in table
  document.querySelectorAll('.prospect-table tbody tr').forEach(r => {
    r.classList.toggle('selected-row', r.dataset.id === id);
  });
}

function closeCardModal() {
  document.getElementById('card-modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
  _selectedId = null;
  document.querySelectorAll('.prospect-table tbody tr').forEach(r => {
    r.classList.remove('selected-row');
  });
}

function handleModalOverlayClick(e) {
  if (e.target.id === 'card-modal-overlay') closeCardModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCardModal();
});

function renderCards(leads) {
  const grid = document.getElementById('leads-grid');
  if (!leads.length) {
    grid.innerHTML = `<div class="empty-tab-cards">No prospect cards in this tab.</div>`;
    return;
  }
  grid.innerHTML = leads.map(lead => buildLeadCard(lead)).join('');
  leads.forEach(lead => { populateLeadCard(lead); attachEvents(lead); });
}

async function loadLeads() {
  try {
    const [res, resArchived] = await Promise.all([
      fetch('/api/leads'),
      fetch('/api/leads?archived=true')
    ]);
    const leads   = await res.json();
    const archived = await resArchived.json();
    _allLeads      = leads;
    _archivedLeads = archived;
    renderLeads(leads);
  } catch (e) {
    document.getElementById('leads-grid').innerHTML = `
      <div class="empty-state">
        <h2>⚠ Cannot connect to server</h2>
        <p>Make sure server is running: <strong>npm start</strong> in folder tools/semi-auto-outreach</p>
      </div>`;
  }
}

function renderLeads(leads) {
  renderTabs(leads);
  renderSmartPanel(leads);
  renderDailyTracker(leads);
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  if (tab && tab.archived) {
    const filtered = applySearch(_archivedLeads);
    renderTable(filtered);
    renderCards(filtered);
    return;
  }
  const filtered = applySearch(leads.filter(l => matchesTab(l, tab)));
  renderTable(filtered);
  renderCards(filtered);
}

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function safeHref(url) {
  try {
    const u = new URL(url, window.location.href);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '#';
  } catch (_) {
    return /^\/[^/]/.test(url) ? url : '#';
  }
}

function safeClass(str) {
  return String(str == null ? '' : str).replace(/[^A-Z0-9_-]/gi, '');
}

async function logEvent(leadId, type, metadata) {
  try {
    await fetch('/api/leads/' + leadId + '/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, metadata: metadata || {} })
    });
  } catch (e) {
    console.warn('[AutoLog] Failed to log event:', type, e);
  }
}

function metaItem(labelText, value, unknown) {
  return `<div class="meta-item"><label>${labelText}</label><span${unknown ? ' class="unknown"' : ''}>${esc(value)}</span></div>`;
}

function buildLeadCard(l) {
  const id = esc(l.id);
  const sc = 'status-' + esc(l.status);
  const hasFollowUp = l.followUpDate ? `<div class="followup-date">📅 Follow-up: ${new Date(l.followUpDate).toLocaleDateString('en-MY')}</div>` : '';
  return `
  <div class="lead-card" id="card-${id}">
    <div class="modal-pipeline-header" id="pipeline-header-${id}">
      <div class="modal-prospect-title" id="pipeline-title-${id}"></div>
      <div class="pipeline-header-row">
        <span class="pipeline-badge pipeline-status" id="pipeline-status-badge-${id}"></span>
        <span class="pipeline-badge pipeline-deal" id="pipeline-deal-badge-${id}"></span>
        <span class="pipeline-badge pipeline-lock" id="pipeline-lock-badge-${id}"></span>
      </div>
      <div class="pipeline-next-action" id="pipeline-next-action-${id}"></div>
      <div class="pipeline-lock-note pipeline-muted" id="pipeline-lock-note-${id}" style="display:none"></div>
    </div>
    <div class="lead-card-header">
      <h2><span data-field="businessName"></span></h2>
      <span class="status-badge ${sc}" id="badge-${id}" data-field="status"></span>
    </div>

    <div class="lead-meta">
      ${metaItem('Location', l.location || '—', false)}
      ${metaItem('Niche', l.niche || '—', false)}
      ${metaItem('Platform', l.platform || 'UNKNOWN', !l.platform || l.platform === 'UNKNOWN')}
      ${metaItem('Contact', l.contactMethod || 'UNKNOWN', !l.contactMethod || l.contactMethod === 'UNKNOWN')}
      ${metaItem('WhatsApp', l.whatsappNumber || 'Not set', !l.whatsappNumber)}
      ${metaItem('Profile URL', l.profileUrl || 'Not set', !l.profileUrl)}
      ${metaItem('Weakness', l.weakness || '—', false)}
      ${metaItem('Offer', l.offerAngle || '—', false)}
    </div>

    ${hasFollowUp}

    <div class="preview-engine-section" id="preview-section-${id}">
      <div class="preview-section-label">Landing Page Preview</div>
      <div class="preview-path-row">
        <strong>Preview:</strong> <span id="preview-link-${id}"></span> &nbsp;|&nbsp;
        <strong>Screenshot:</strong> <span data-field="screenshotPath"></span>
      </div>
      <div id="preview-btn-wrap-${id}"></div>
      <div id="preview-signal-${id}"></div>
    </div>

    <div class="dm-panel">
      <label>FIRST OUTREACH DM DRAFT</label>
      <p class="dm-helper">This is the first WhatsApp outreach message for this prospect. Review, edit if needed, then approve to open WhatsApp. The system does not send messages automatically.</p>
      <p class="dm-flow-hint">Flow: Review → Edit / Rewrite → Approve → WhatsApp opens → Human presses Send</p>
      <textarea class="dm-textarea" id="dm-${id}" readonly></textarea>
      <div class="char-count" id="cc-${id}"></div>
      <div class="dm-status-hint" id="dm-status-hint-${id}"></div>
    </div>

    <div class="action-bar">
      <button class="btn btn-yes" id="btn-approve-${id}" onclick="handleYes('${id}')">APPROVE &amp; OPEN WHATSAPP</button>
      <p class="dm-approve-helper">WhatsApp will open with the message pre-filled. You still need to press Send yourself.</p>
      <button class="btn btn-edit" onclick="handleEdit('${id}')">EDIT</button>
      <button class="btn btn-ok" id="btn-ok-${id}" onclick="handleOk('${id}')" style="display:none">SAVE EDIT</button>
      <button class="btn btn-no" onclick="handleNo('${id}')">REWRITE DM</button>
      <p class="dm-remake-helper">Rewrite DM = rewrite the outreach message. This does not reject the prospect.</p>
      <button class="btn btn-replied" onclick="handleReplied('${id}')">MARK REPLIED</button>
      <p class="dm-replied-helper">Use this only when the prospect has replied to your message.</p>
      <button class="btn btn-followup" onclick="handleFollowUp('${id}')">FOLLOW-UP DRAFT</button>
      <p class="dm-followup-helper">Use Follow-Up Draft after you have contacted the prospect but have not received a reply.</p>
      <button class="btn btn-won" onclick="handleClose('${id}','CLOSED_WON')">CLOSED WON ✓</button>
      <button class="btn btn-lost" onclick="handleClose('${id}','CLOSED_LOST')">CLOSED LOST</button>
      <div class="archive-row" id="archive-row-${id}">
        <button class="btn btn-archive" id="btn-archive-${id}" onclick="handleArchive('${id}')">⬇ ARCHIVE</button>
        <button class="btn btn-restore" id="btn-restore-${id}" onclick="handleRestore('${id}')" style="display:none">↑ RESTORE</button>
      </div>
    </div>

    <div class="feedback-box" id="fb-${id}"></div>

    <div class="confirm-sent-box" id="confirm-sent-box-${id}">
      <p class="confirm-sent-note">Click only after you manually pressed send in WhatsApp.</p>
      <button class="btn btn-confirm-sent" id="confirm-sent-${id}" onclick="handleConfirmSent('${id}')">Confirm Sent</button>
    </div>

    <div class="reply-input-box" id="reply-box-${id}">
      <label>Paste client reply:</label>
      <textarea id="reply-text-${id}" placeholder="Paste reply here..."></textarea>
      <button class="btn-save-reply" onclick="saveReply('${id}')">Save Reply</button>
    </div>

    <div class="followup-set-box" id="followup-box-${id}">
      <label>Set follow-up date:</label>
      <input type="date" id="followup-date-${id}" />
      <button class="btn-save-reply" onclick="saveFollowUp('${id}')">Save Date</button>
    </div>

    <div class="lock-banner" id="lock-banner-${id}" style="display:none">
      <span class="lock-badge">LOCKED</span>
      <span class="lock-meta" id="lock-meta-${id}"></span>
    </div>

    <div class="audit-section" id="audit-section-${id}">
      <div class="audit-header">📊 Audit Score & Preview Readiness</div>
      <div class="audit-scores-row">
        <div class="audit-score-block">
          <span class="audit-score-label">Audit Score</span>
          <span class="audit-score-value" id="audit-score-${id}">—</span>
        </div>
        <div class="audit-score-block">
          <span class="audit-score-label">Preview Readiness</span>
          <span class="audit-score-value" id="preview-readiness-${id}">—</span>
        </div>
        <div class="audit-score-block">
          <span class="audit-score-label">Priority</span>
          <span class="audit-score-value audit-priority" id="audit-priority-${id}">—</span>
        </div>
      </div>
      <div class="audit-missing" id="audit-missing-${id}" style="display:none">
        <span class="audit-missing-label">Missing Preview Fields:</span>
        <span class="audit-missing-list" id="audit-missing-list-${id}"></span>
      </div>
      <div class="audit-weakness" id="audit-weakness-${id}" style="display:none">
        <span class="audit-weakness-label">Weakness:</span>
        <span class="audit-weakness-list" id="audit-weakness-list-${id}"></span>
      </div>
      <div class="audit-opportunity" id="audit-opportunity-${id}" style="display:none">
        <span class="audit-opportunity-label">Opportunity:</span>
        <span class="audit-opportunity-list" id="audit-opportunity-list-${id}"></span>
      </div>
      <div class="audit-editor" id="audit-editor-${id}">
        <div class="audit-editor-label">Edit Audit</div>
        <div class="audit-editor-scores">
          <div class="audit-editor-field"><label>Website</label><input type="number" min="0" max="100" class="audit-input" id="ae-website-${id}" placeholder="0–100" /></div>
          <div class="audit-editor-field"><label>Mobile</label><input type="number" min="0" max="100" class="audit-input" id="ae-mobile-${id}" placeholder="0–100" /></div>
          <div class="audit-editor-field"><label>CTA</label><input type="number" min="0" max="100" class="audit-input" id="ae-cta-${id}" placeholder="0–100" /></div>
          <div class="audit-editor-field"><label>Social</label><input type="number" min="0" max="100" class="audit-input" id="ae-social-${id}" placeholder="0–100" /></div>
          <div class="audit-editor-field"><label>Review</label><input type="number" min="0" max="100" class="audit-input" id="ae-review-${id}" placeholder="0–100" /></div>
        </div>
        <div class="audit-editor-arrays">
          <div class="audit-editor-array-field">
            <label>Weakness <span class="audit-array-hint">(comma-separated)</span></label>
            <textarea class="audit-array-ta" id="ae-weakness-${id}" rows="2" placeholder="e.g. No WhatsApp button, No reviews shown"></textarea>
          </div>
          <div class="audit-editor-array-field">
            <label>Opportunity <span class="audit-array-hint">(comma-separated)</span></label>
            <textarea class="audit-array-ta" id="ae-opportunity-${id}" rows="2" placeholder="e.g. High Google rating, Active Instagram"></textarea>
          </div>
        </div>
        <button class="btn-save-audit" id="btn-save-audit-${id}" onclick="saveAudit('${id}')">Save Audit</button>
        <span class="audit-save-feedback" id="audit-save-fb-${id}"></span>
      </div>
    </div>

    <div class="payment-section" id="payment-section-${id}">
      <div class="payment-header">💰 Payment & Revenue</div>
      <div class="payment-fields" id="payment-fields-${id}"></div>
      <div class="payment-actions" id="payment-actions-${id}"></div>
    </div>

    <div class="runlog-section" id="runlog-section-${id}">
      <button class="runlog-toggle" id="runlog-toggle-${id}" onclick="toggleRunLog('${id}')">&#9658; Run Log (<span id="runlog-count-${id}">0</span> events)</button>
      <div class="runlog-list" id="runlog-list-${id}" style="display:none"></div>
    </div>

    <div class="amendments-section" id="amendments-section-${id}">
      <div class="amendments-label">Amendments</div>
      <div class="amendments-list" id="amendments-list-${id}"></div>
      <div class="amendment-input-box" id="amendment-input-box-${id}" style="display:none">
        <textarea class="amendment-ta" id="amend-ta-${id}" placeholder="Add correction note..."></textarea>
        <button class="btn-add-amendment" onclick="handleAddAmendment('${id}')">Add Amendment</button>
      </div>
    </div>
  </div>`;
}

function renderPreviewSection(l) {
  const linkEl   = document.getElementById('preview-link-' + l.id);
  const btnWrap  = document.getElementById('preview-btn-wrap-' + l.id);
  if (!linkEl || !btnWrap) return;

  const status = l.previewStatus || 'NOT_BUILT';
  const resolvedPreviewUrl = l.previewUrl || l.previewPath || l.previewFile || l.preview || '';

  if (status === 'READY' && resolvedPreviewUrl) {
    linkEl.innerHTML = `<a href="${esc(safeHref(resolvedPreviewUrl))}" target="_blank" class="preview-link-ready">
      ${esc(resolvedPreviewUrl.split('/').pop())} ↗
    </a>`;
    if (!l.locked) {
      btnWrap.innerHTML = `<button class="btn-generate-preview" id="gen-prev-btn-${esc(l.id)}"
        onclick="generatePreview('${esc(l.id)}')">↺ Regenerate Preview</button>`;
    } else {
      btnWrap.innerHTML = '';
    }
  } else {
    linkEl.textContent = 'None';
    if (!l.locked) {
      btnWrap.innerHTML = `<button class="btn-generate-preview" id="gen-prev-btn-${esc(l.id)}"
        onclick="generatePreview('${esc(l.id)}')">🖼 Generate Preview</button>`;
    } else {
      btnWrap.innerHTML = '';
    }
  }
}

function renderPreviewSignal(l) {
  const el = document.getElementById('preview-signal-' + l.id);
  if (!el) return;
  if (l.previewStatus !== 'READY' || l.locked) { el.innerHTML = ''; return; }
  const count = l.previewClickCount || 0;
  const clickedText = l.previewClicked
    ? `<span>👁 Preview opened ${count}x</span>`
    : `<span style="color:var(--text-soft)">Preview not yet confirmed opened</span>`;
  const safeId = safeClass(l.id);
  el.innerHTML = `<div class="preview-click-signal">
    ${clickedText}
    <button class="btn-mark-preview-sent" onclick="markPreviewSent('${safeId}')">
      ${l.previewClicked ? '+ Mark lagi' : 'Mark Preview Sent'}
    </button>
  </div>`;
}

function populateLeadCard(l, root) {
  const card = root
    ? root.querySelector('#card-' + l.id)
    : document.getElementById('card-' + l.id);
  if (!card) return;
  card.querySelector('[data-field="businessName"]').textContent = l.businessName || '';

  // Status badge — show readable label, not raw internal code
  const canonicalStatus = getLeadStatus(l);
  const badgeEl = card.querySelector('[data-field="status"]');
  if (badgeEl) badgeEl.textContent = readableStatus(canonicalStatus);

  card.querySelector('[data-field="screenshotPath"]').textContent = l.screenshotPath || 'None';

  // Pipeline header — use card-scoped querySelector to avoid duplicate-ID collision
  // (same IDs exist in hidden grid AND modal simultaneously; getElementById returns first match)
  const titleEl      = card.querySelector('#pipeline-title-' + l.id);
  const statusBadge  = card.querySelector('#pipeline-status-badge-' + l.id);
  const dealBadge    = card.querySelector('#pipeline-deal-badge-' + l.id);
  const lockBadge    = card.querySelector('#pipeline-lock-badge-' + l.id);
  const nextActionEl = card.querySelector('#pipeline-next-action-' + l.id);
  const lockNoteEl   = card.querySelector('#pipeline-lock-note-' + l.id);

  if (titleEl)      titleEl.textContent      = l.businessName || '—';
  if (statusBadge) {
    statusBadge.textContent = 'Status: ' + readableStatus(canonicalStatus);
    statusBadge.className = 'pipeline-badge pipeline-status pipeline-status-' + canonicalStatus;
  }
  const dealState = l.dealStatus || (isLocked(l.id) ? canonicalStatus : 'OPEN');
  if (dealBadge) {
    dealBadge.textContent = 'Deal: ' + (dealState === 'OPEN' ? 'OPEN' : readableStatus(dealState));
    dealBadge.className = 'pipeline-badge pipeline-deal pipeline-deal-' + (dealState === 'OPEN' ? 'OPEN' : canonicalStatus);
  }
  const locked = isLocked(l.id);
  const lockLabel = locked
    ? (canonicalStatus === 'CLOSED_WON' ? 'CLOSED WON' : canonicalStatus === 'CLOSED_LOST' ? 'CLOSED LOST' : 'LOCKED')
    : 'No';
  if (lockBadge) {
    lockBadge.textContent = 'Lock: ' + lockLabel;
    lockBadge.className = 'pipeline-badge pipeline-lock' + (locked ? ' pipeline-lock-active' : '');
  }
  let nextActionText = getNextAction(canonicalStatus);
  if (canonicalStatus === 'NEW') {
    const prs = Number(l.previewReadinessScore) || 0;
    if (prs >= 70) nextActionText = 'Ready to generate preview.';
    else if (prs > 0) nextActionText = 'Complete missing preview data.';
  }
  if (nextActionEl) nextActionEl.textContent = 'Next action: ' + nextActionText;
  if (lockNoteEl) {
    if (locked && (canonicalStatus === 'CLOSED_WON' || canonicalStatus === 'CLOSED_LOST')) {
      lockNoteEl.textContent = 'Lead locked — view only. No outreach action available.';
      lockNoteEl.style.display = 'block';
    } else {
      lockNoteEl.style.display = 'none';
    }
  }

  // Preview section
  renderPreviewSection(l);
  renderPreviewSignal(l);

  const ta = document.getElementById('dm-' + l.id);
  const cc = document.getElementById('cc-' + l.id);
  if (ta) {
    let dmValue = l.defaultDm || l.lastApprovedMessage || l.approvedMessage || l.dmDraft || l.outreachMessage || l.message || '';
    // Auto-append preview link if READY and not already present
    if (l.previewStatus === 'READY' && l.trackedPreviewUrl) {
      const previewLine = '\n\nLink preview: ' + l.trackedPreviewUrl;
      if (!dmValue.includes(l.trackedPreviewUrl)) {
        dmValue += previewLine;
      }
    }
    ta.value = dmValue;
    if (!dmValue) {
      ta.placeholder = 'No DM draft yet. Use REWRITE DM or edit manually before approving.';
    }
  }
  if (cc) cc.textContent = (document.getElementById('dm-' + l.id) ? document.getElementById('dm-' + l.id).value.length : 0) + ' chars';

  // Status-based action hint — if DM is empty, override with empty-state warning
  const hintEl = document.getElementById('dm-status-hint-' + l.id);
  if (hintEl) {
    const dmEmpty = !document.getElementById('dm-' + l.id)?.value;
    const hintMap = {
      NEW:          'Next step: Generate preview or prepare first outreach DM.',
      PREVIEW_READY:'Next step: Review DM and approve outreach.',
      CONTACTED:    'Next step: Wait for reply or prepare follow-up.',
      REPLIED:      'Next step: Use ResponseOps / close path.',
      CLOSED_WON:   'Lead locked. View only.',
      CLOSED_LOST:  'Lead locked. View only.'
    };
    const hint = dmEmpty
      ? '⚠ DM draft is empty. Click EDIT to write manually, or REWRITE DM to regenerate.'
      : (hintMap[l.status] || '');
    hintEl.textContent = hint;
    hintEl.style.display = hint ? 'block' : 'none';
  }

  const replyStatuses = ['REPLIED','FOLLOW_UP_NEEDED','CLOSED_WON','CLOSED_LOST'];
  if (replyStatuses.includes(l.status) || l.replyNotes) {
    const replyBox = document.getElementById('reply-box-' + l.id);
    const replyTa = document.getElementById('reply-text-' + l.id);
    if (replyBox) replyBox.style.display = 'block';
    if (replyTa && l.replyNotes) replyTa.value = l.replyNotes;
  }

  const hasWaOpened = Array.isArray(l.events) && l.events.some(e => e.type === 'WHATSAPP_OPENED');
  const alreadyConfirmed = Array.isArray(l.events) && l.events.some(e => e.type === 'SENT_MANUAL_CONFIRMED');
  if (hasWaOpened) {
    const box = document.getElementById('confirm-sent-box-' + l.id);
    const btn = document.getElementById('confirm-sent-' + l.id);
    if (box) box.style.display = 'block';
    if (alreadyConfirmed && btn) { btn.disabled = true; btn.textContent = 'Sent Confirmed'; }
  }

  // Audit Score section
  renderAuditSection(l);
  populateAuditEditor(l);

  // Payment section
  renderPaymentSection(l);

  // Run Log Timeline
  renderRunLog(l);

  // Locked state — use strengthened isLocked() which checks status fields too
  if (isLocked(l.id)) {
    applyLockedUI(l);
  }

  // Amendments list (always render if any exist)
  renderAmendmentsList(l);

  // Archive / Restore button visibility
  const archiveBtn  = document.getElementById('btn-archive-' + l.id);
  const restoreBtn  = document.getElementById('btn-restore-' + l.id);
  if (archiveBtn && restoreBtn) {
    if (l.archived) {
      archiveBtn.style.display = 'none';
      restoreBtn.style.display = '';
    } else {
      archiveBtn.style.display = '';
      restoreBtn.style.display = 'none';
    }
  }
}

function applyLockedUI(l, root) {
  const card = root
    ? root.querySelector('#card-' + l.id)
    : document.getElementById('card-' + l.id);
  if (!card) return;

  // Show lock banner
  const banner = card.querySelector('#lock-banner-' + l.id);
  const meta   = card.querySelector('#lock-meta-' + l.id);
  if (banner) banner.style.display = 'flex';
  if (meta) {
    const lockedDate = l.lockedAt ? new Date(l.lockedAt).toLocaleDateString('en-MY') : '';
    const reasonPart = l.lockReason || '';
    const datePart = lockedDate ? '  ·  ' + lockedDate : '';
    meta.textContent = 'Lead locked — no outreach action available.' + (reasonPart ? '  ·  ' + reasonPart : '') + datePart;
  }

  // Add locked class to card border + color variant
  card.classList.add('card-locked');
  if (l.lockReason === 'CLOSED_WON') {
    card.classList.add('closed-won-lock');
    if (banner) banner.classList.add('closed-won-lock');
    const badge = document.getElementById('lock-badge-' + l.id) || banner && banner.querySelector('.lock-badge');
    if (badge) badge.classList.add('closed-won-lock');
  } else if (l.lockReason === 'CLOSED_LOST') {
    card.classList.add('closed-lost-lock');
    if (banner) banner.classList.add('closed-lost-lock');
    const badge = banner && banner.querySelector('.lock-badge');
    if (badge) badge.classList.add('closed-lost-lock');
  }

  // Disable direct action buttons
  const disabledIds = [
    'btn-approve-' + l.id, 'btn-ok-' + l.id, 'confirm-sent-' + l.id
  ];
  const disabledSelectors = [
    '.btn-yes', '.btn-edit', '.btn-no', '.btn-replied',
    '.btn-followup', '.btn-won', '.btn-lost'
  ];
  disabledIds.forEach(btnId => {
    const b = card.querySelector('#' + btnId);
    if (b) { b.disabled = true; b.classList.add('btn-locked'); }
  });
  disabledSelectors.forEach(sel => {
    const b = card.querySelector(sel);
    if (b) { b.disabled = true; b.classList.add('btn-locked'); }
  });

  // Lock the DM textarea
  const ta = card.querySelector('#dm-' + l.id);
  if (ta) ta.setAttribute('readonly', true);

  // Show amendment input for locked record
  const amendBox = card.querySelector('#amendment-input-box-' + l.id);
  if (amendBox) amendBox.style.display = 'block';
}

function renderRunLog(l) {
  const countEl  = document.getElementById('runlog-count-' + l.id);
  const listEl   = document.getElementById('runlog-list-' + l.id);
  if (!countEl || !listEl) return;
  const events = Array.isArray(l.events) ? l.events : [];
  countEl.textContent = events.length;
  if (!events.length) {
    listEl.innerHTML = '<div class="runlog-empty">No events yet.</div>';
    return;
  }
  // Reverse chronological
  listEl.innerHTML = [...events].reverse().map(e => {
    const dt = e.timestamp ? new Date(e.timestamp).toLocaleString('en-MY') : '';
    const meta = e.metadata && Object.keys(e.metadata).length
      ? Object.entries(e.metadata).map(([k,v]) => `${esc(k)}: ${esc(String(v))}`).join(' · ')
      : '';
    return `<div class="runlog-row">
      <span class="runlog-type">${esc(e.type)}</span>
      <span class="runlog-dt">${esc(dt)}</span>
      ${e.actor ? `<span class="runlog-actor">${esc(e.actor)}</span>` : ''}
      ${meta ? `<span class="runlog-meta">${meta}</span>` : ''}
    </div>`;
  }).join('');
}

function toggleRunLog(id) {
  const listEl   = document.getElementById('runlog-list-' + id);
  const toggleEl = document.getElementById('runlog-toggle-' + id);
  if (!listEl || !toggleEl) return;
  const open = listEl.style.display !== 'none';
  listEl.style.display = open ? 'none' : 'block';
  const countEl = document.getElementById('runlog-count-' + id);
  const count = countEl ? countEl.textContent : '?';
  toggleEl.innerHTML = (open ? '&#9658;' : '&#9660;') + ` Run Log (<span id="runlog-count-${id}">${count}</span> events)`;
}

function renderAmendmentsList(l) {
  const list = document.getElementById('amendments-list-' + l.id);
  if (!list) return;
  const amends = Array.isArray(l.amendments) ? l.amendments : [];
  if (!amends.length) {
    list.innerHTML = '';
    return;
  }
  list.innerHTML = amends.map(a => {
    const dt = a.timestamp ? new Date(a.timestamp).toLocaleString('en-MY') : '';
    return `<div class="amendment-item">
      <span class="amendment-date">${esc(dt)}</span>
      <span class="amendment-note">${esc(a.note)}</span>
    </div>`;
  }).join('');
}

function attachEvents(lead) {
  const ta = document.getElementById('dm-' + lead.id);
  const cc = document.getElementById('cc-' + lead.id);
  if (ta && cc) {
    ta.addEventListener('input', () => { cc.textContent = ta.value.length + ' chars'; });
  }
}

function showFeedback(id, type, parts) {
  const fb = document.getElementById('fb-' + id);
  fb.className = 'feedback-box feedback-' + type;
  fb.textContent = '';
  if (typeof parts === 'string') {
    fb.textContent = parts;
  } else {
    parts.forEach(p => {
      if (p.bold) {
        const s = document.createElement('strong');
        s.textContent = p.text;
        fb.appendChild(s);
      } else {
        fb.appendChild(document.createTextNode(p.text));
      }
    });
  }
  fb.style.display = 'block';
}

async function patchLead(id, body) {
  const res = await fetch('/api/leads/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function openContact(id, message) {
  const res = await fetch('/api/leads');
  const leads = await res.json();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;

  const wa = lead.whatsappNumber;
  const url = lead.profileUrl;

  if (wa && wa.trim() !== '') {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${wa}?text=${encoded}`, '_blank');
    showFeedback(id, 'success', [
      { text: 'WhatsApp opened for ' }, { text: lead.businessName, bold: true }, { text: '. ' }, { text: 'You press Send.', bold: true }
    ]);
  } else if (url && url.trim() !== '') {
    try { await navigator.clipboard.writeText(message); } catch(e) {}
    window.open(url, '_blank');
    showFeedback(id, 'warning', [
      { text: 'No WA number. Message copied to clipboard. Profile/page opened — ' }, { text: 'paste and send manually.', bold: true }
    ]);
  } else {
    showFeedback(id, 'error', 'CONTACT UNKNOWN — HUMAN INPUT REQUIRED. Add whatsappNumber or profileUrl in leads.json first.');
  }
}

function isLocked(id) {
  const lead = _allLeads.find(l => l.id === id) || _archivedLeads.find(l => l.id === id);
  if (!lead) return false;
  if (lead.locked) return true;
  const closedValues = ['CLOSED_WON', 'CLOSED_LOST'];
  return [
    lead.prospectStatus, lead.status, lead.dealStatus,
    lead.pipelineStatus, lead.lockReason
  ].some(f => closedValues.includes(f));
}

async function handleYes(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  if (!isOperationOn()) { showFeedback(id, 'warning', 'Operation is OFF. Re-enable it first.'); return; }
  if (!await checkWorkingHours()) return;
  const msg = document.getElementById('dm-' + id).value;
  await patchLead(id, { status: 'APPROVED_TO_SEND', approvedMessage: msg });
  document.getElementById('badge-' + id).textContent = 'APPROVED_TO_SEND';
  document.getElementById('badge-' + id).className = 'status-badge status-APPROVED_TO_SEND';
  await logEvent(id, 'CTA_APPROVED', { messageLength: msg.length });
  await openContact(id, msg);
  await logEvent(id, 'WHATSAPP_OPENED', { via: 'wa.me' });
  showConfirmSent(id);
}

async function handleConfirmSent(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  await logEvent(id, 'SENT_MANUAL_CONFIRMED', {});
  document.getElementById('badge-' + id).textContent = 'CONTACTED';
  document.getElementById('badge-' + id).className = 'status-badge status-APPROVED_TO_SEND';
  const btn = document.getElementById('confirm-sent-' + id);
  if (btn) { btn.disabled = true; btn.textContent = 'Sent Confirmed'; }
  showFeedback(id, 'success', [
    { text: 'Manual send confirmed. ' }, { text: 'Record updated.', bold: true }
  ]);
}

function showConfirmSent(id) {
  const box = document.getElementById('confirm-sent-box-' + id);
  if (box) box.style.display = 'block';
}

function handleEdit(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  const ta = document.getElementById('dm-' + id);
  ta.removeAttribute('readonly');
  ta.focus();
  document.getElementById('btn-ok-' + id).style.display = 'inline-block';
  showFeedback(id, 'info', 'Edit mode active. Modify the message, then press APPROVE EDIT.');
}

async function handleOk(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  if (!isOperationOn()) { showFeedback(id, 'warning', 'Operation is OFF. Re-enable it first.'); return; }
  if (!await checkWorkingHours()) return;
  const msg = document.getElementById('dm-' + id).value;
  document.getElementById('dm-' + id).setAttribute('readonly', true);
  document.getElementById('btn-ok-' + id).style.display = 'none';
  await patchLead(id, { status: 'APPROVED_EDITED_TO_SEND', approvedMessage: msg });
  document.getElementById('badge-' + id).textContent = 'APPROVED_EDITED_TO_SEND';
  document.getElementById('badge-' + id).className = 'status-badge status-APPROVED_EDITED_TO_SEND';
  await logEvent(id, 'CTA_APPROVED', { messageLength: msg.length, edited: true });
  await openContact(id, msg);
  await logEvent(id, 'WHATSAPP_OPENED', { via: 'wa.me', edited: true });
  showConfirmSent(id);
}

async function handleNo(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  const lead = _allLeads.find(l => l.id === id);
  const oldStatus = lead ? (lead.prospectStatus || lead.status || 'UNKNOWN') : 'UNKNOWN';
  await patchLead(id, { status: 'REJECTED_NEEDS_REWORK', prospectStatus: 'REJECTED_NEEDS_REWORK' });
  await logEvent(id, 'DM_REWRITE_REQUESTED', {
    oldStatus,
    newStatus: 'REJECTED_NEEDS_REWORK',
    reason: 'Operator clicked REWRITE DM'
  });
  // Update local cache so Smart Panel + tabs refresh correctly
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) {
    _allLeads[idx].status = 'REJECTED_NEEDS_REWORK';
    _allLeads[idx].prospectStatus = 'REJECTED_NEEDS_REWORK';
  }
  document.getElementById('badge-' + id).textContent = 'Needs DM Rewrite';
  document.getElementById('badge-' + id).className = 'status-badge status-REJECTED_NEEDS_REWORK';
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  renderTabs(_allLeads);
  renderSmartPanel(_allLeads);
  renderTable(_allLeads.filter(l => matchesTab(l, tab)));
  showFeedback(id, 'warning', 'DM draft rejected. Lead queued for rewrite — edit the DM, then re-approve.');
}

async function handleReplied(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  await patchLead(id, { status: 'REPLIED' });
  document.getElementById('badge-' + id).textContent = 'REPLIED';
  document.getElementById('badge-' + id).className = 'status-badge status-REPLIED';
  document.getElementById('reply-box-' + id).style.display = 'block';
  showFeedback(id, 'success', 'Status changed to REPLIED. Paste client reply below.');
}

async function saveReply(id) {
  const reply = document.getElementById('reply-text-' + id).value;
  await patchLead(id, { reply });
  showFeedback(id, 'success', 'Reply saved to leads.json and outreach-log.json.');
}

async function handleFollowUp(id) {
  if (isLocked(id)) { showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.'); return; }
  const res = await fetch('/api/leads');
  const leads = await res.json();
  const lead = leads.find(l => l.id === id);
  const name = lead ? lead.businessName : 'business ini';
  const followUpMsg = `Hi, just following up on the WhatsApp booking preview page I built for ${name}. If you'd like to see it, I can share a screenshot.`;
  document.getElementById('dm-' + id).value = followUpMsg;
  document.getElementById('dm-' + id).removeAttribute('readonly');
  document.getElementById('btn-ok-' + id).style.display = 'inline-block';
  document.getElementById('cc-' + id).textContent = followUpMsg.length + ' chars';
  document.getElementById('followup-box-' + id).style.display = 'block';
  await patchLead(id, { status: 'FOLLOW_UP_NEEDED' });
  document.getElementById('badge-' + id).textContent = 'FOLLOW_UP_NEEDED';
  document.getElementById('badge-' + id).className = 'status-badge status-FOLLOW_UP_NEEDED';
  showFeedback(id, 'info', 'Follow-up draft ready. Set a follow-up date, edit if needed, then press APPROVE EDIT.');
}

async function saveFollowUp(id) {
  const date = document.getElementById('followup-date-' + id).value;
  if (!date) return;
  await patchLead(id, { followUpDate: new Date(date).toISOString() });
  document.getElementById('followup-box-' + id).style.display = 'none';
  showFeedback(id, 'success', 'Follow-up date saved.');
}

async function handleClose(id, status) {
  const lead = _allLeads.find(l => l.id === id);
  if (lead && lead.locked) {
    showFeedback(id, 'warning', 'Record is locked. Add an amendment instead.');
    return;
  }
  const res = await fetch('/api/leads/' + id + '/lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: status, dealStatus: status, prospectStatus: status })
  });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', data.error || 'Lock failed'); return; }

  // Update local cache and re-render this card + table
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) _allLeads[idx] = data.lead;

  const msg = status === 'CLOSED_WON' ? 'Deal CLOSED WON! Congratulations.' : 'Lead closed as LOST.';
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  renderTabs(_allLeads);
  renderTable(_allLeads.filter(l => matchesTab(l, tab)));
  // Re-open modal with updated lead data
  openCardModal(id);
  showFeedback(id, status === 'CLOSED_WON' ? 'success' : 'warning', msg);
}

async function handleAddAmendment(id) {
  const ta = document.getElementById('amend-ta-' + id);
  if (!ta) return;
  const note = ta.value.trim();
  if (!note) { showFeedback(id, 'warning', 'Please fill in the amendment note.'); return; }

  const res = await fetch('/api/leads/' + id + '/amendments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', data.error || 'Amendment failed'); return; }

  // Update local cache and re-render
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) _allLeads[idx] = data.lead;
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  renderTabs(_allLeads);
  renderTable(_allLeads.filter(l => matchesTab(l, tab)));
  openCardModal(id);
  showFeedback(id, 'success', 'Amendment saved.');
}

async function handleArchive(id) {
  const res  = await fetch('/api/leads/' + id + '/archive', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', data.error || 'Archive failed'); return; }
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) _allLeads.splice(idx, 1);
  if (!_archivedLeads.find(l => l.id === id)) _archivedLeads.push(data.lead);
  renderTabs(_allLeads);
  closeCardModal();
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  const filtered = applySearch(tab && tab.archived ? _archivedLeads : _allLeads.filter(l => matchesTab(l, tab)));
  renderTable(filtered);
  renderCards(filtered);
}

async function handleRestore(id) {
  const res  = await fetch('/api/leads/' + id + '/restore', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', data.error || 'Restore failed'); return; }
  const aIdx = _archivedLeads.findIndex(l => l.id === id);
  if (aIdx !== -1) _archivedLeads.splice(aIdx, 1);
  if (!_allLeads.find(l => l.id === id)) _allLeads.push(data.lead);
  renderTabs(_allLeads);
  closeCardModal();
  const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
  const filtered = applySearch(tab && tab.archived ? _archivedLeads : _allLeads.filter(l => matchesTab(l, tab)));
  renderTable(filtered);
  renderCards(filtered);
}

// ── Phase 6: Operation Toggle ─────────────────────────────────
function isOperationOn() {
  return localStorage.getItem(OP_STATE_KEY) !== 'OFF';
}

function applyOperationState() {
  const on  = isOperationOn();
  const btn = document.getElementById('op-toggle');
  const banner = document.getElementById('op-paused-banner');
  if (btn) {
    btn.textContent = on ? '⚡ Operation: ON' : '⏸ Operation: OFF';
    btn.classList.toggle('op-off', !on);
  }
  if (banner) banner.classList.toggle('hidden', on);
  document.body.classList.toggle('operation-off', !on);
}

function toggleOperation() {
  const next = isOperationOn() ? 'OFF' : 'ON';
  localStorage.setItem(OP_STATE_KEY, next);
  applyOperationState();
}

// ── Phase 6: Working Hours Modal ──────────────────────────────
let _whResolve = null;

function withinWorkingHours() {
  const h = new Date().getHours();
  return h >= WORKING_HOURS.start && h < WORKING_HOURS.end;
}

function confirmOutsideHours() {
  return new Promise(resolve => {
    _whResolve = resolve;
    const overlay = document.getElementById('wh-modal-overlay');
    const confirmBtn = document.getElementById('wh-confirm-btn');
    if (overlay) overlay.classList.remove('hidden');
    if (confirmBtn) {
      confirmBtn.onclick = () => { whModalClose(true); };
    }
  });
}

function whModalCancel() { whModalClose(false); }

function whModalClose(proceed) {
  const overlay = document.getElementById('wh-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
  if (_whResolve) { _whResolve(proceed); _whResolve = null; }
}

async function checkWorkingHours() {
  if (withinWorkingHours()) return true;
  return confirmOutsideHours();
}

// ── Phase 6: Schedule Box ─────────────────────────────────────
function renderScheduleBox(l) {
  const box = document.getElementById('schedule-box-' + l.id);
  if (!box) return;
  if (l.locked) { box.innerHTML = ''; return; }

  const isScheduled = l.scheduleStatus === 'SCHEDULED' && l.scheduledAt;

  if (isScheduled) {
    const scheduledDate = new Date(l.scheduledAt);
    const overdue = scheduledDate < new Date();
    const dateStr = scheduledDate.toLocaleString('en-MY');
    box.innerHTML = `
      <div class="schedule-box-label">Scheduled</div>
      <div class="scheduled-info">
        📅 ${esc(dateStr)}
        ${overdue ? '<span class="scheduled-overdue">OVERDUE</span>' : ''}
      </div>
      <button type="button" class="btn-unschedule" onclick="handleUnschedule('${esc(l.id)}')">Remove from Schedule</button>`;

    // Update APPROVE button label
    const approveBtn = document.getElementById('btn-approve-' + l.id);
    if (approveBtn) approveBtn.textContent = `APPROVE (Scheduled ${esc(scheduledDate.toLocaleDateString('en-MY'))})`;
  } else {
    box.innerHTML = `
      <div class="schedule-box-label">Schedule</div>
      <div class="schedule-picker-row" id="schedule-picker-row-${esc(l.id)}" style="display:none">
        <input type="datetime-local" id="schedule-dt-${esc(l.id)}" />
        <button type="button" class="btn-schedule-confirm" onclick="handleConfirmSchedule('${esc(l.id)}')">Confirm Schedule</button>
      </div>
      <button type="button" class="btn-open-schedule" id="btn-open-sched-${esc(l.id)}"
        onclick="toggleSchedulePicker('${esc(l.id)}')">🗓 Schedule for Later</button>`;
  }
}

function toggleSchedulePicker(id) {
  const row = document.getElementById('schedule-picker-row-' + id);
  const btn = document.getElementById('btn-open-sched-' + id);
  if (!row) return;
  const open = row.style.display !== 'none';
  row.style.display = open ? 'none' : 'flex';
  if (btn) btn.classList.toggle('hidden', !open);
}

async function handleConfirmSchedule(id) {
  const dtInput = document.getElementById('schedule-dt-' + id);
  if (!dtInput || !dtInput.value) {
    showFeedback(id, 'warning', 'Please select a date and time first.');
    return;
  }
  const scheduledAt = new Date(dtInput.value).toISOString();
  const res = await fetch('/api/leads/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheduleStatus: 'SCHEDULED', scheduledAt, prospectStatus: 'SCHEDULED' })
  });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', 'Schedule failed: ' + (data.error || 'Unknown')); return; }
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) _allLeads[idx] = data.lead;
  const tabS = PIPELINE_TABS.find(t => t.key === _activeTab);
  renderTabs(_allLeads);
  renderTable(_allLeads.filter(l => matchesTab(l, tabS)));
  openCardModal(id);
  showFeedback(id, 'success', 'Lead scheduled. Can be approved early if needed.');
}

async function handleUnschedule(id) {
  const res = await fetch('/api/leads/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheduleStatus: 'NOT_SCHEDULED', scheduledAt: '', prospectStatus: 'NEW' })
  });
  const data = await res.json();
  if (!res.ok) { showFeedback(id, 'error', 'Unschedule failed: ' + (data.error || 'Unknown')); return; }
  const idx = _allLeads.findIndex(l => l.id === id);
  if (idx !== -1) _allLeads[idx] = data.lead;
  const tabU = PIPELINE_TABS.find(t => t.key === _activeTab);
  renderTabs(_allLeads);
  renderTable(_allLeads.filter(l => matchesTab(l, tabU)));
  openCardModal(id);
  showFeedback(id, 'success', 'Lead removed from schedule.');
}

// ── Generate Preview ──────────────────────────────────────────
async function generatePreview(id) {
  const btn = document.getElementById('gen-prev-btn-' + id);
  if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }

  try {
    const res  = await fetch('/api/leads/' + id + '/generate-preview', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      showFeedback(id, 'error', 'Preview failed: ' + (data.error || 'Unknown error'));
      if (btn) { btn.disabled = false; btn.textContent = '🖼 Generate Preview'; }
      return;
    }
    // Update local cache and re-render card
    const idx = _allLeads.findIndex(l => l.id === id);
    if (idx !== -1) _allLeads[idx] = data.lead;
    const tabP = PIPELINE_TABS.find(t => t.key === _activeTab);
    renderTabs(_allLeads);
    renderTable(_allLeads.filter(l => matchesTab(l, tabP)));
    openCardModal(id);
    showFeedback(id, 'success', 'Preview generated. Click the link to view.');
  } catch (e) {
    showFeedback(id, 'error', 'Preview request failed: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = '🖼 Generate Preview'; }
  }
}

// ── Export Logs ────────────────────────────────────────────────
async function exportLogs() {
  try {
    const res = await fetch('/api/logs');
    const log = await res.json();
    const ts  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `run-log-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Export logs failed: ' + e.message);
  }
}

// ── Import Prospects ───────────────────────────────────────────
function toggleImportPanel() {
  openPanel('addLead');
  switchAddLeadTab('import');
  document.getElementById('import-result').style.display = 'none';
  document.getElementById('import-file-feedback').textContent = '';
}

function initImportDropzone() {
  const zone      = document.getElementById('import-dropzone');
  const fileInput = document.getElementById('import-file-input');
  const textarea  = document.getElementById('import-textarea');
  if (!zone || !fileInput || !textarea) return;
  if (zone._dropzoneReady) return;
  zone._dropzoneReady = true;

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) readImportFile(file);
  });
  zone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readImportFile(file);
    fileInput.value = '';
  });
}

function readImportFile(file) {
  const textarea = document.getElementById('import-textarea');
  const feedback = document.getElementById('import-file-feedback');
  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    if (feedback) { feedback.textContent = '⚠ File must be .json'; feedback.style.color = '#FCA5A5'; }
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      JSON.parse(content);
      if (textarea) textarea.value = content;
      if (feedback) { feedback.textContent = '✓ File loaded. Review content and click Import.'; feedback.style.color = '#9FE0BE'; }
    } catch (err) {
      if (feedback) { feedback.textContent = '⚠ File is not valid JSON.'; feedback.style.color = '#FCA5A5'; }
    }
  };
  reader.readAsText(file);
}

async function submitImport() {
  const ta  = document.getElementById('import-textarea');
  const raw = ta.value.trim();
  if (!raw) { alert('Paste a JSON array first.'); return; }

  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { alert('Invalid JSON: ' + e.message); return; }
  if (!Array.isArray(parsed)) { alert('Must be a JSON array. Example: [{...}, {...}]'); return; }

  const res  = await fetch('/api/leads/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leads: parsed })
  });
  const data = await res.json();
  if (!res.ok) { alert('Import failed: ' + (data.error || 'Unknown error')); return; }

  const resultEl = document.getElementById('import-result');

  // ── Summary line ──
  let summaryParts = [
    `<span class="import-stat-good">${data.imported} imported</span>`,
    `<span class="import-stat-skip">${data.skipped} skipped (duplicate)</span>`
  ];
  if ((data.closedDuplicates || 0) > 0) {
    summaryParts.push(`<span class="import-stat-warn">${data.closedDuplicates} closed-deal duplicate(s) — not imported</span>`);
  }
  if ((data.errors || []).length) {
    summaryParts.push(`<span class="import-stat-err">${data.errors.length} invalid record(s)</span>`);
  }
  if (data.batchId) {
    summaryParts.push(`<span class="import-stat-meta">Batch: ${esc(data.batchId)}</span>`);
  }

  let html = `<div class="import-summary-row">${summaryParts.join(' · ')}</div>`;

  // ── Validation errors ──
  if ((data.errors || []).length) {
    html += `<div class="import-errors-block"><strong>Rejected records:</strong><ul class="import-err-list">` +
      data.errors.map(e =>
        `<li>${esc(e.businessName)}: ${esc(e.reasons.join(', '))}</li>`
      ).join('') +
      `</ul></div>`;
  }

  // ── Closed-deal duplicates ──
  if ((data.closedDuplicateList || []).length) {
    html += `<div class="import-closed-dup-block"><strong>Closed-deal duplicates (skipped, not in Top 10):</strong><ul class="import-err-list">` +
      data.closedDuplicateList.map(e =>
        `<li>${esc(e.businessName)}: ${esc(e.reason)}</li>`
      ).join('') +
      `</ul></div>`;
  }

  // ── Top 10 ranking table ──
  if ((data.top10 || []).length) {
    html += `<div class="import-top10-block">
      <div class="import-top10-header">🏆 Top ${data.top10.length} by Score</div>
      <table class="import-top10-table">
        <thead><tr>
          <th>#</th><th>Business</th><th>Niche</th><th>Preview Ready</th><th>Audit</th><th>Priority</th><th>Missing</th>
        </tr></thead>
        <tbody>` +
      data.top10.map((l, i) => {
        const prs      = Number(l.previewReadinessScore) || 0;
        const audit    = Number(l.auditScore) || 0;
        const prsClass = prs >= 70 ? 'import-score-high' : prs >= 40 ? 'import-score-med' : 'import-score-low';
        // priority must be one of HIGH/MEDIUM/LOW — sanitise before class insertion
        const prioSafe  = ['HIGH','MEDIUM','LOW'].includes(l.priority) ? l.priority : 'LOW';
        const missing   = (l.missingFields || []).slice(0, 3).map(String).join(', ') || '—';
        return `<tr class="import-top10-row" onclick="openCardModal('${safeClass(l.id)}')">
          <td class="import-rank">${i + 1}</td>
          <td class="import-name">${esc(l.businessName)}</td>
          <td>${esc(l.niche || '—')}</td>
          <td class="${prsClass}">${prs}</td>
          <td>${audit}</td>
          <td class="import-prio-${prioSafe}">${prioSafe}</td>
          <td class="import-missing">${esc(missing)}</td>
        </tr>`;
      }).join('') +
      `</tbody></table></div>`;
  }

  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.className = 'import-result ' + (data.imported > 0 ? 'import-success' : 'import-warn');

  ta.value = '';
  await loadLeads();
}

function showImportSample() {
  const sample = [
    {
      operatorLiteLeadData: {
        businessName: 'Zara Beauty Studio',
        niche:        'beauty salon',
        location:     'Petaling Jaya, Selangor',
        whatsapp:     '60123456789',
        website:      'https://zarabeauty.com',
        facebook:     'https://facebook.com/zarabeauty',
        instagram:    'https://instagram.com/zarabeauty',
        googleMapsUrl:'https://maps.app.goo.gl/example',
        defaultDm:    'Hi Zara Beauty, saya ada buat mini website booking untuk bisnes macam awak...'
      },
      landingPageEngineData: {
        content: {
          services: ['Facial RM80', 'Eyebrow Threading RM25']
        }
      },
      audit: {
        websiteScore: 60,
        mobileScore:  50,
        ctaScore:     70,
        socialScore:  80,
        reviewScore:  40,
        weakness:     ['No WhatsApp button on website'],
        opportunity:  ['High Google rating — leverage for social proof']
      }
    },
    {
      operatorLiteLeadData: {
        businessName: 'Fresh Cuts Barbershop',
        niche:        'barbershop',
        location:     'Subang Jaya, Selangor',
        facebook:     'https://facebook.com/freshcuts'
      }
    },
    {
      operatorLiteLeadData: {
        niche:    'restaurant',
        location: 'KL'
      }
    }
  ];
  const overlay = document.getElementById('sample-json-overlay');
  const pre     = document.getElementById('sample-json-pre');
  if (!overlay || !pre) return;
  pre.textContent = JSON.stringify(sample, null, 2);
  overlay.style.display = 'flex';
}

function closeSampleJson() {
  const overlay = document.getElementById('sample-json-overlay');
  if (overlay) overlay.style.display = 'none';
}

function copySampleJson() {
  const pre = document.getElementById('sample-json-pre');
  if (!pre) return;
  const ta = document.getElementById('import-textarea');
  if (ta) {
    ta.value = pre.textContent;
    closeSampleJson();
  } else {
    navigator.clipboard.writeText(pre.textContent).catch(() => {});
    closeSampleJson();
  }
}

// ── Add Lead Form ──────────────────────────────────────────────
function toggleAddForm() {
  const panel = document.getElementById('add-lead-form');
  const isOpen = panel && panel.style.display !== 'none' && !panel.classList.contains('add-lead-form-hidden');
  if (isOpen) {
    closeAllPanels();
  } else {
    openPanel('addLead');
    switchAddLeadTab('add');
  }
}

function switchAddLeadTab(tab) {
  const addContent    = document.getElementById('add-lead-content');
  const importContent = document.getElementById('import-content');
  const tabs          = document.querySelectorAll('.add-lead-tab');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  if (addContent)    addContent.style.display    = tab === 'add'    ? '' : 'none';
  if (importContent) importContent.style.display = tab === 'import' ? '' : 'none';
  if (tab === 'import') initImportDropzone();
}

async function submitAddLead(e) {
  e.preventDefault();
  const f = e.target;
  const body = {
    businessName:  f.businessName.value.trim(),
    location:      f.location.value.trim(),
    niche:         f.niche.value.trim(),
    whatsappNumber: f.whatsappNumber.value.trim(),
    profileUrl:    f.profileUrl.value.trim(),
    weakness:      f.weakness.value.trim(),
    offerAngle:    f.offerAngle.value.trim(),
    defaultDm:     f.defaultDm.value.trim()
  };
  if (!body.businessName) {
    alert('Business name is required.');
    return;
  }
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) { alert('Error: ' + data.error); return; }
  f.reset();
  closeAllPanels();
  loadLeads();
}

// ── Mutual-exclusive panel manager ────────────────────────────
const PANELS = {
  addLead:       'add-lead-form',
  agentSchedule: 'agent-schedule-panel'
};

function closeAllPanels() {
  Object.values(PANELS).forEach(pid => {
    const el = document.getElementById(pid);
    if (el) {
      el.style.display = 'none';
      el.classList.add('add-lead-form-hidden');
    }
  });
}

function openPanel(panelKey) {
  closeAllPanels();
  const el = document.getElementById(PANELS[panelKey]);
  if (!el) return;
  el.style.display = 'block';
  el.classList.remove('add-lead-form-hidden');
}

// ── Phase 6B: Agent Schedule (header-level, localStorage) ─────
const AGENT_SCHEDULE_KEY = 'dealsense_agent_schedule';

function toggleAgentSchedule() {
  const panel = document.getElementById('agent-schedule-panel');
  const isOpen = panel && panel.style.display !== 'none' && !panel.classList.contains('add-lead-form-hidden');
  if (isOpen) {
    closeAllPanels();
  } else {
    openPanel('agentSchedule');
  }
}

function handleFindNow() {
  const niche    = document.getElementById('agent-run-niche').value || 'Beauty Spa';
  const location = document.getElementById('agent-run-location').value || 'Ipoh';
  const count    = document.getElementById('agent-run-count').value || '30';
  const prompt   = `You are DEALSENSE FAST PROSPECT JSON AGENT.\nFind ${count} prospects in ${location} for niche: ${niche}.\nOutput full JSON array with operatorLiteLeadData and landingPageEngineData.\nFollow all rules in your system prompt.`;
  navigator.clipboard.writeText(prompt).catch(() => {});
  document.getElementById('agent-prompt-output').value = prompt;
  document.getElementById('agent-prompt-row').style.display = 'flex';
  document.getElementById('agent-schedule-status').textContent = '✓ Prompt copied. Paste into ChatGPT agent.';
}

function saveAgentSchedule() {
  const schedule = {
    datetime:   document.getElementById('agent-run-datetime').value,
    niche:      document.getElementById('agent-run-niche').value,
    location:   document.getElementById('agent-run-location').value,
    count:      document.getElementById('agent-run-count').value,
    repeat:     document.getElementById('agent-run-repeat').checked,
    repeatDays: 7,
    savedAt:    new Date().toISOString()
  };
  localStorage.setItem(AGENT_SCHEDULE_KEY, JSON.stringify(schedule));
  document.getElementById('agent-schedule-status').textContent = '✓ Schedule saved.';
  const label = schedule.datetime ? schedule.datetime.replace('T', ' ') : 'ON';
  document.getElementById('btn-agent-schedule').textContent = `🗓 Agent Run: ${label}`;
}

function clearAgentSchedule() {
  localStorage.removeItem(AGENT_SCHEDULE_KEY);
  document.getElementById('agent-schedule-status').textContent = 'Schedule cleared.';
  document.getElementById('btn-agent-schedule').textContent = '🗓 Agent Run: OFF';
  document.getElementById('agent-run-datetime').value = '';
  document.getElementById('agent-run-repeat').checked = false;
}

function restoreAgentSchedule() {
  const raw = localStorage.getItem(AGENT_SCHEDULE_KEY);
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    if (s.datetime) document.getElementById('agent-run-datetime').value = s.datetime;
    if (s.niche)    document.getElementById('agent-run-niche').value    = s.niche;
    if (s.location) document.getElementById('agent-run-location').value = s.location;
    if (s.count)    document.getElementById('agent-run-count').value    = s.count;
    if (s.repeat != null) document.getElementById('agent-run-repeat').checked = s.repeat;
    const label = s.datetime ? s.datetime.replace('T', ' ') : 'ON';
    document.getElementById('btn-agent-schedule').textContent = `🗓 Agent Run: ${label}`;
  } catch (e) {}
}

// ── Phase 7: Smart Action Panel ──────────────────────────────

function daysSince(isoStr) {
  if (!isoStr) return null;
  return (Date.now() - new Date(isoStr).getTime()) / (1000 * 60 * 60 * 24);
}

function calcSmartActions(leads) {
  const actions = [];
  leads.forEach(l => {
    if (l.locked) return;
    const s    = getStatus(l);
    const deal = l.dealStatus || 'OPEN';
    const days = daysSince(l.lastActionAt);
    const daysLabel = days !== null ? (Math.floor(days) + 'd ago') : '—';

    // P1: replied but deal still open → close or follow up
    if (l.replyStatus === 'REPLIED' && deal === 'OPEN') {
      actions.push({ priority: 'P1', lead: l, reason: 'Client replied — awaiting decision', action: 'Close Won atau Follow Up', daysLabel });
      return;
    }
    // P1: audit score HIGH + preview readiness >= 70 → ready for outreach/preview
    if ((l.auditScore || 0) >= 80 && (l.previewReadinessScore || 0) >= 70 && s === 'NEW') {
      actions.push({ priority: 'P1', lead: l, reason: 'High audit score — ready for preview/outreach', action: 'Ready to generate preview.', daysLabel });
      return;
    }
    // P2: DM draft was rejected — needs rewrite before re-approval (Patch 3, keep label intact)
    if (s === 'REJECTED_NEEDS_REWORK') {
      actions.push({ priority: 'P2', lead: l, reason: 'DM draft rejected — needs rewrite', action: 'Rewrite DM and re-approve.', daysLabel });
      return;
    }
    // P2: contacted + no reply for 3+ days
    if (s === 'CONTACTED' && days !== null && days >= OVERDUE_DAYS && deal === 'OPEN') {
      actions.push({ priority: 'P2', lead: l, reason: 'Follow-up overdue', action: 'Send follow-up now', daysLabel });
      return;
    }
    // P3: preview readiness < 70 — missing data needed before preview can be generated
    if ((l.previewReadinessScore || 0) < 70 && s === 'NEW') {
      const missing = Array.isArray(l.audit && l.audit.missingFields) ? l.audit.missingFields : [];
      const missingText = missing.length ? missing.slice(0, 3).join(', ') : 'preview data';
      actions.push({ priority: 'P3', lead: l, reason: 'Missing Preview Data — ' + missingText, action: 'Complete missing preview data.', daysLabel });
      return;
    }
    // P3: preview not built and lead is new or preview-ready
    if ((l.previewStatus === 'NOT_BUILT' || !l.previewStatus) && (s === 'NEW' || s === 'PREVIEW_READY')) {
      actions.push({ priority: 'P3', lead: l, reason: 'Preview not yet generated', action: 'Generate preview', daysLabel });
      return;
    }
    // P4: scheduled and overdue (scheduledAt in past)
    if (l.scheduleStatus === 'SCHEDULED' && l.scheduledAt && new Date(l.scheduledAt) < new Date()) {
      actions.push({ priority: 'P4', lead: l, reason: 'Scheduled time passed', action: 'Approve and send now', daysLabel });
      return;
    }
    // P5: new lead waiting for review
    if (s === 'NEW' && (l.humanDecision === 'PENDING' || !l.humanDecision)) {
      actions.push({ priority: 'P5', lead: l, reason: 'New lead not yet reviewed', action: 'Review new lead', daysLabel });
    }
  });
  // Sort P1→P5
  const order = { P1: 1, P2: 2, P3: 3, P4: 4, P5: 5 };
  actions.sort((a, b) => order[a.priority] - order[b.priority]);
  return actions;
}

function renderSmartPanel(leads) {
  const body = document.getElementById('smart-panel-body');
  if (!body) return;
  if (_smartPanelCollapsed) { body.classList.add('collapsed'); return; }
  body.classList.remove('collapsed');

  const actions = calcSmartActions(leads);
  if (!actions.length) {
    body.innerHTML = '<div class="smart-panel-empty">✓ All prospects are up to date.</div>';
    return;
  }
  body.innerHTML = actions.map(a => {
    const id = safeClass(a.lead.id);
    return `<div class="smart-panel-item" onclick="openCardModal('${id}')">
      <span class="smart-panel-priority priority-${a.priority}">${esc(a.priority)}</span>
      <span class="smart-panel-lead">${esc(a.lead.businessName)}</span>
      <span class="smart-panel-reason">${esc(a.reason)}</span>
      <span class="smart-panel-action">${esc(a.action)}</span>
      <span class="smart-panel-days">${esc(a.daysLabel)}</span>
    </div>`;
  }).join('');
}

function toggleSmartPanel() {
  _smartPanelCollapsed = !_smartPanelCollapsed;
  const body   = document.getElementById('smart-panel-body');
  const toggle = document.getElementById('smart-panel-toggle');
  if (body)   body.classList.toggle('collapsed', _smartPanelCollapsed);
  if (toggle) toggle.textContent = _smartPanelCollapsed ? '▸ Show' : '▾ Hide';
}

// ── Phase 7: Daily Target Tracker ────────────────────────────

function calcDailyStats(leads) {
  const todayStr = new Date().toDateString();
  let sentToday = 0, followUpsToday = 0, repliesTotal = 0, previewsSent = 0, closedWon = 0, closedLost = 0;
  let totalPaidRevenue = 0, paidDeals = 0, unpaidApproved = 0;

  leads.forEach(l => {
    if (Array.isArray(l.events)) {
      l.events.forEach(e => {
        const eDay = new Date(e.timestamp).toDateString();
        if (eDay === todayStr) {
          if (e.type === 'SENT_MANUAL_CONFIRMED')  sentToday++;
          if (e.type === 'FOLLOW_UP_SENT')         followUpsToday++;
        }
        if (e.type === 'PREVIEW_CLICK_MARKED')     previewsSent++;
      });
    }
    if (l.replyStatus === 'REPLIED')           repliesTotal++;
    const s = getStatus(l);
    if (s === 'CLOSED_WON')                    closedWon++;
    if (s === 'CLOSED_LOST')                   closedLost++;
    if (l.paymentStatus === 'PAID') {
      paidDeals++;
      totalPaidRevenue += Number(l.paidAmount || 0);
    } else if (
      l.paymentStatus !== 'PAID' &&
      (l.prospectStatus === 'REPLIED' || l.prospectStatus === 'CONTACTED' ||
       l.dealStatus === 'OPEN') &&
      !l.locked
    ) {
      unpaidApproved++;
    }
  });
  return { sentToday, followUpsToday, repliesTotal, previewsSent, closedWon, closedLost, totalPaidRevenue, paidDeals, unpaidApproved };
}

function renderDailyTracker(leads) {
  const el = document.getElementById('daily-tracker');
  if (!el) return;
  const s = calcDailyStats(leads);
  const pct = Math.min(100, Math.round((s.sentToday / DAILY_TARGET.outreach) * 100));
  const fillClass = pct >= 100 ? 'daily-progress-fill full' : 'daily-progress-fill';

  el.innerHTML = `
    <span class="daily-tracker-label">Today</span>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.sentToday}</span>
      <span class="daily-stat-label">DM sent</span>
    </div>
    <div class="daily-progress-wrap">
      <div class="daily-progress-label">Outreach ${s.sentToday}/${DAILY_TARGET.outreach}</div>
      <div class="daily-progress-bar"><div class="${fillClass}" style="width:${pct}%"></div></div>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.followUpsToday}</span>
      <span class="daily-stat-label">Follow-ups / ${DAILY_TARGET.followUp} target</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.previewsSent}</span>
      <span class="daily-stat-label">Previews marked</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.repliesTotal}</span>
      <span class="daily-stat-label">Replies</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.closedWon}</span>
      <span class="daily-stat-label">Won</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.closedLost}</span>
      <span class="daily-stat-label">Lost</span>
    </div>
    <div class="daily-stat daily-stat-revenue">
      <span class="daily-stat-value revenue-value">RM ${s.totalPaidRevenue.toFixed(2)}</span>
      <span class="daily-stat-label">Total Paid Revenue</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.paidDeals}</span>
      <span class="daily-stat-label">Paid Deals</span>
    </div>
    <div class="daily-stat">
      <span class="daily-stat-value">${s.unpaidApproved}</span>
      <span class="daily-stat-label">Unpaid Active</span>
    </div>`;
}

// ── Phase 7: Mark Preview Sent ────────────────────────────────

async function markPreviewSent(id) {
  const lead = _allLeads.find(l => l.id === id);
  if (!lead || lead.locked) return;
  const newCount = (lead.previewClickCount || 0) + 1;
  const now = new Date().toISOString();
  await patchLead(id, { previewClicked: true, previewClickCount: newCount, lastPreviewClickedAt: now });
  await logEvent(id, 'PREVIEW_CLICK_MARKED', { count: newCount });
  // Refresh from server so modal shows updated state
  const res = await fetch('/api/leads');
  if (res.ok) {
    _allLeads = await res.json();
    renderLeads(_allLeads);
    openCardModal(id);
  }
}

// ── Audit Score Section ───────────────────────────────────────

function renderAuditSection(l) {
  const scoreEl    = document.getElementById('audit-score-' + l.id);
  const readyEl    = document.getElementById('preview-readiness-' + l.id);
  const prioEl     = document.getElementById('audit-priority-' + l.id);
  const missingEl  = document.getElementById('audit-missing-' + l.id);
  const missingLst = document.getElementById('audit-missing-list-' + l.id);
  const weakEl     = document.getElementById('audit-weakness-' + l.id);
  const weakLst    = document.getElementById('audit-weakness-list-' + l.id);
  const oppEl      = document.getElementById('audit-opportunity-' + l.id);
  const oppLst     = document.getElementById('audit-opportunity-list-' + l.id);
  if (!scoreEl) return;

  const auditScore           = Number(l.auditScore)           || 0;
  const previewReadinessScore = Number(l.previewReadinessScore) || 0;
  const priority             = l.priority                     || 'LOW';

  scoreEl.textContent = auditScore + ' / 100';
  scoreEl.className = 'audit-score-value audit-score-' + (auditScore >= 80 ? 'high' : auditScore >= 50 ? 'medium' : 'low');

  const readyLabel = previewReadinessScore >= 70 ? '✓ ' : '';
  readyEl.textContent = readyLabel + previewReadinessScore + ' / 100';
  readyEl.className = 'audit-score-value audit-ready-' + (previewReadinessScore >= 70 ? 'yes' : 'no');

  prioEl.textContent = priority;
  prioEl.className = 'audit-score-value audit-priority audit-priority-' + priority;

  const audit = (l.audit && typeof l.audit === 'object') ? l.audit : {};
  const missing = Array.isArray(audit.missingFields) ? audit.missingFields : [];
  if (missing.length && missingEl && missingLst) {
    missingLst.textContent = missing.join(', ');
    missingEl.style.display = 'block';
  } else if (missingEl) {
    missingEl.style.display = 'none';
  }

  const weakness = Array.isArray(audit.weakness) ? audit.weakness.filter(Boolean) : [];
  if (weakness.length && weakEl && weakLst) {
    weakLst.textContent = weakness.join(' · ');
    weakEl.style.display = 'block';
  } else if (weakEl) {
    weakEl.style.display = 'none';
  }

  const opportunity = Array.isArray(audit.opportunity) ? audit.opportunity.filter(Boolean) : [];
  if (opportunity.length && oppEl && oppLst) {
    oppLst.textContent = opportunity.join(' · ');
    oppEl.style.display = 'block';
  } else if (oppEl) {
    oppEl.style.display = 'none';
  }
}

function populateAuditEditor(l) {
  const audit = (l.audit && typeof l.audit === 'object') ? l.audit : {};
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('ae-website-'    + l.id, audit.websiteScore  || 0);
  setVal('ae-mobile-'     + l.id, audit.mobileScore   || 0);
  setVal('ae-cta-'        + l.id, audit.ctaScore      || 0);
  setVal('ae-social-'     + l.id, audit.socialScore   || 0);
  setVal('ae-review-'     + l.id, audit.reviewScore   || 0);
  setVal('ae-weakness-'   + l.id, Array.isArray(audit.weakness)   ? audit.weakness.filter(Boolean).join(', ')   : '');
  setVal('ae-opportunity-'+ l.id, Array.isArray(audit.opportunity)? audit.opportunity.filter(Boolean).join(', '): '');
  if (l.locked) {
    ['ae-website-','ae-mobile-','ae-cta-','ae-social-','ae-review-','ae-weakness-','ae-opportunity-'].forEach(prefix => {
      const el = document.getElementById(prefix + l.id);
      if (el) el.disabled = true;
    });
    const btn = document.getElementById('btn-save-audit-' + l.id);
    if (btn) { btn.disabled = true; btn.classList.add('btn-locked'); }
  }
}

async function saveAudit(id) {
  if (isLocked(id)) { return; }
  const getNum = (elId) => {
    const el = document.getElementById(elId);
    return el ? (Number(el.value) || 0) : 0;
  };
  const getArr = (elId) => {
    const el = document.getElementById(elId);
    if (!el || !el.value.trim()) return [];
    return el.value.split(',').map(s => s.trim()).filter(Boolean);
  };

  const body = {
    websiteScore:  getNum('ae-website-'     + id),
    mobileScore:   getNum('ae-mobile-'      + id),
    ctaScore:      getNum('ae-cta-'         + id),
    socialScore:   getNum('ae-social-'      + id),
    reviewScore:   getNum('ae-review-'      + id),
    weakness:      getArr('ae-weakness-'    + id),
    opportunity:   getArr('ae-opportunity-' + id)
  };

  const fbEl = document.getElementById('audit-save-fb-' + id);
  if (fbEl) { fbEl.textContent = 'Saving…'; fbEl.className = 'audit-save-feedback'; }

  try {
    const res  = await fetch('/api/leads/' + encodeURIComponent(id) + '/audit', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      if (fbEl) { fbEl.textContent = data.error || 'Save failed'; fbEl.className = 'audit-save-feedback audit-save-err'; }
      return;
    }
    // Update local cache
    const idx = _allLeads.findIndex(l => l.id === id);
    if (idx !== -1) _allLeads[idx] = data.data;

    // Refresh scores display without closing modal
    renderAuditSection(data.data);
    populateAuditEditor(data.data);

    const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
    renderTabs(_allLeads);
    renderSmartPanel(_allLeads);
    renderTable(_allLeads.filter(l => matchesTab(l, tab)));

    if (fbEl) { fbEl.textContent = '✓ Saved'; fbEl.className = 'audit-save-feedback audit-save-ok'; }
    setTimeout(() => { if (fbEl) fbEl.textContent = ''; }, 2500);
  } catch (e) {
    if (fbEl) { fbEl.textContent = 'Error: ' + e.message; fbEl.className = 'audit-save-feedback audit-save-err'; }
  }
}

// ── Payment Section ───────────────────────────────────────────

function renderPaymentSection(l) {
  const fieldsEl   = document.getElementById('payment-fields-' + l.id);
  const actionsEl  = document.getElementById('payment-actions-' + l.id);
  if (!fieldsEl || !actionsEl) return;

  const isPaid     = l.paymentStatus === 'PAID';
  const paidAt     = l.paidAt ? new Date(l.paidAt).toLocaleString('en-MY') : '—';
  const fmtRM      = v => 'RM ' + Number(v || 0).toFixed(2);

  fieldsEl.innerHTML = `
    <div class="payment-row"><span class="payment-label">Deal Value</span><span class="payment-value">${esc(fmtRM(l.dealValue))}</span></div>
    <div class="payment-row"><span class="payment-label">Quoted</span><span class="payment-value">${esc(fmtRM(l.quotedAmount))}</span></div>
    <div class="payment-row"><span class="payment-label">Paid Amount</span><span class="payment-value ${isPaid ? 'payment-paid-highlight' : ''}">${esc(fmtRM(l.paidAmount))}</span></div>
    <div class="payment-row"><span class="payment-label">Payment Status</span><span class="payment-value payment-status-pill payment-status-${esc(l.paymentStatus || 'UNPAID')}">${esc(l.paymentStatus || 'UNPAID')}</span></div>
    <div class="payment-row"><span class="payment-label">Proof Note</span><span class="payment-value">${esc(l.paymentProofNote || '—')}</span></div>
    <div class="payment-row"><span class="payment-label">Paid At</span><span class="payment-value">${esc(paidAt)}</span></div>`;

  if (!l.locked && !isPaid) {
    actionsEl.innerHTML = `<button class="btn btn-mark-paid" onclick="markPaid('${esc(l.id)}')">💳 Mark Paid</button>`;
  } else if (isPaid) {
    actionsEl.innerHTML = `<span class="payment-confirmed-label">✓ Payment recorded</span>`;
  } else {
    actionsEl.innerHTML = '';
  }
}

async function markPaid(id) {
  const lead = _allLeads.find(l => l.id === id);
  if (!lead) return;

  const amtStr = window.prompt('Paid amount (RM)?', lead.dealValue || 350);
  if (amtStr === null) return;
  const paidAmount = parseFloat(amtStr) || 0;
  if (paidAmount <= 0) { alert('Please enter a valid amount.'); return; }

  const note = window.prompt('Payment proof note (optional):', 'DuitNow QR confirmed') || '';

  const fb = document.getElementById('fb-' + id);
  if (fb) fb.textContent = 'Saving payment…';

  try {
    const res = await fetch('/api/leads/' + encodeURIComponent(id) + '/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paidAmount, dealValue: paidAmount, paymentProofNote: note })
    });
    const data = await res.json();
    if (!res.ok) { if (fb) fb.textContent = 'Error: ' + (data.error || res.status); return; }

    const fresh = await fetch('/api/leads');
    if (fresh.ok) {
      _allLeads = await fresh.json();
      renderLeads(_allLeads);
    }
    openCardModal(id);
    if (fb) fb.textContent = '✓ Payment of RM ' + paidAmount.toFixed(2) + ' recorded.';
  } catch (e) {
    if (fb) fb.textContent = 'Network error: ' + e.message;
  }
}

// ── Start Here helpers ────────────────────────────────────────

function reviewNextProspect() {
  const candidate = _allLeads.find(l =>
    !l.locked && (l.prospectStatus === 'NEW' || l.status === 'NEW')
  );
  if (candidate) {
    openCardModal(candidate.id);
  } else {
    alert('No new prospects to review. Import or add prospects first.');
  }
}

function toggleWorkflowPanel() {
  const panel = document.getElementById('workflow-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function initSearchBar() {
  const input = document.getElementById('prospect-search');
  if (!input) return;
  input.addEventListener('input', () => {
    _searchQuery = input.value.trim();
    const tab = PIPELINE_TABS.find(t => t.key === _activeTab);
    const pool = (tab && tab.archived) ? _archivedLeads : _allLeads.filter(l => matchesTab(l, tab));
    const filtered = applySearch(pool);
    renderTable(filtered);
    renderCards(filtered);
  });
}

// ── Security gate (Patch F) ──────────────────────────────────────────────────
async function initSecurityGate() {
  let status;
  try {
    const r = await fetch('/api/auth/status');
    status = await r.json();
  } catch (e) {
    status = { protected: false, authenticated: true, localhost: true };
  }

  const banner = document.getElementById('security-banner');
  if (banner) {
    if (status.protected && status.authenticated) {
      banner.textContent = '🔒 Operator Protected';
      banner.className = 'security-banner security-banner--ok';
      banner.style.display = '';
    } else if (!status.protected) {
      banner.textContent = '⚠ Local Mode: No Operator Password Set';
      banner.className = 'security-banner security-banner--warn';
      banner.style.display = '';
    }
  }

  if (status.protected && !status.authenticated) {
    showLoginGate();
    return false;
  }
  return true;
}

function showLoginGate() {
  document.body.replaceChildren();

  const gate = document.createElement('div');
  gate.className = 'login-gate';

  const box = document.createElement('div');
  box.className = 'login-box';

  const logo = document.createElement('div');
  logo.className = 'login-logo';
  logo.textContent = '🔒';

  const title = document.createElement('h2');
  title.textContent = 'ApexProspect';

  const sub = document.createElement('p');
  sub.className = 'login-sub';
  sub.textContent = 'Operator access required';

  const form = document.createElement('form');
  form.id = 'login-form';
  form.addEventListener('submit', submitLogin);

  const pw = document.createElement('input');
  pw.id = 'login-pw';
  pw.type = 'password';
  pw.placeholder = 'Operator password';
  pw.setAttribute('autofocus', '');
  pw.autocomplete = 'current-password';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Unlock Dashboard';

  const errDiv = document.createElement('div');
  errDiv.id = 'login-error';
  errDiv.className = 'login-error';
  errDiv.style.display = 'none';
  errDiv.textContent = 'Wrong password';

  form.append(pw, btn, errDiv);
  box.append(logo, title, sub, form);
  gate.appendChild(box);
  document.body.appendChild(gate);

  pw.focus();
}

async function submitLogin(e) {
  e.preventDefault();
  const pw = document.getElementById('login-pw').value;
  const err = document.getElementById('login-error');
  try {
    const r = await fetch('/api/operator-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    if (r.ok) {
      location.reload();
    } else {
      err.style.display = 'block';
      document.getElementById('login-pw').value = '';
      document.getElementById('login-pw').focus();
    }
  } catch (e) {
    err.textContent = 'Connection error';
    err.style.display = 'block';
  }
}

initSecurityGate().then(ok => {
  if (!ok) return;
  applyOperationState();
  restoreAgentSchedule();
  loadLeads();
});
initSearchBar();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
