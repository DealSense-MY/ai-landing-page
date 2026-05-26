/**
 * editorController.js — Wires editor input fields to state and live preview.
 *
 * Rule: ALL edits → state.update() → previewRenderer.render() → iframe
 *       ZERO fetch() calls anywhere in this module.
 */

import { state } from './stateManager.js'
import { previewRenderer } from './previewRenderer.js'

// ── Field change handler ─────────────────────────────────────────────────────
export function onFieldChange(field, value) {
  const newEdited = { ...state.editedValues, [field]: value }
  state.update({ editedValues: newEdited })

  // Merge normalizedData with editedValues (editedValues takes priority)
  const merged = { ...state.normalizedData, ...newEdited }
  previewRenderer.render(merged)
}

// ── Share demo link ──────────────────────────────────────────────────────────
export function shareDemoLink() {
  if (!state.demoId) {
    showToast('No demo link yet. Generate first.', 'error')
    return
  }
  const url = `${window.location.origin}/demo/${state.demoId}`
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link disalin! ✓', 'success'))
      .catch(() => fallbackCopy(url))
  } else {
    fallbackCopy(url)
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    document.execCommand('copy')
    showToast('Link disalin! ✓', 'success')
  } catch (_) {
    showToast(`Demo URL: ${text}`, 'info')
  }
  document.body.removeChild(ta)
}

// ── Preview size toggle ──────────────────────────────────────────────────────
export function setPreviewView(view) {
  state.update({ activeView: view })
}

// ── Toast notification system ────────────────────────────────────────────────
let toastTimeout = null

export function showToast(message, type = 'success') {
  let toast = document.getElementById('toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'toast'
    document.body.appendChild(toast)
  }

  const bgMap = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#6366f1',
    warning: '#f59e0b',
  }

  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: ${bgMap[type] || bgMap.success};
    color: #fff;
    padding: 14px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    z-index: 9999;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s, transform 0.4s;
    pointer-events: none;
  `

  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(12px)'
  }, 3000)
}

// ── Init editor: bind all fields ─────────────────────────────────────────────
export function initEditor() {
  const fieldMap = {
    'edit-headline': 'headline',
    'edit-subheadline': 'subheadline',
    'edit-cta': 'ctaText',
    'edit-image': 'imageUrl',
    'edit-phone': 'phoneNumber',
    'edit-address': 'address',
  }

  Object.entries(fieldMap).forEach(([elId, field]) => {
    const el = document.getElementById(elId)
    if (!el) return
    el.addEventListener('input', () => onFieldChange(field, el.value))
  })

  // Desktop / Mobile toggle
  const btnDesktop = document.getElementById('btn-desktop')
  const btnMobile = document.getElementById('btn-mobile')
  const previewFrame = document.getElementById('preview-frame-wrap')

  if (btnDesktop) btnDesktop.addEventListener('click', () => {
    setPreviewView('desktop')
    updateViewButtons('desktop')
    if (previewFrame) previewFrame.classList.remove('mobile-view')
  })

  if (btnMobile) btnMobile.addEventListener('click', () => {
    setPreviewView('mobile')
    updateViewButtons('mobile')
    if (previewFrame) previewFrame.classList.add('mobile-view')
  })

  // Share link button
  const btnShare = document.getElementById('btn-share')
  if (btnShare) btnShare.addEventListener('click', shareDemoLink)

  // Export HTML button
  const btnExport = document.getElementById('btn-export')
  if (btnExport) btnExport.addEventListener('click', () => {
    previewRenderer.exportHTML()
    showToast('HTML exported! ✓', 'success')
  })
}

function updateViewButtons(activeView) {
  const btnDesktop = document.getElementById('btn-desktop')
  const btnMobile = document.getElementById('btn-mobile')
  if (btnDesktop) btnDesktop.classList.toggle('active', activeView === 'desktop')
  if (btnMobile) btnMobile.classList.toggle('active', activeView === 'mobile')
}

// ── Populate editor fields after generate ───────────────────────────────────
export function populateEditorFields(data) {
  const map = {
    'edit-headline': data.headline || '',
    'edit-subheadline': data.subheadline || '',
    'edit-cta': data.ctaText || '',
    'edit-image': data.imageUrl || '',
    'edit-phone': data.phoneNumber || '',
    'edit-address': data.address || '',
  }
  Object.entries(map).forEach(([elId, val]) => {
    const el = document.getElementById(elId)
    if (el) el.value = val
  })
}
