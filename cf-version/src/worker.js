/**
 * worker.js — Cloudflare Worker entry point.
 * Replaces Express server.js entirely.
 * Storage: Cloudflare KV (DEMO_STORE, HISTORY_STORE).
 * Static assets: Workers Sites (env.ASSETS) from ./public/
 * Doctrines preserved:
 *   - One AI call per generation (in generate.js)
 *   - No /regenerate endpoint
 *   - No backend /export
 *   - Response shape: { html, json, id }
 */

import { normalize } from './pipeline/normalize.js'
import { decide } from './pipeline/decide.js'
import { generate } from './pipeline/generate.js'
import { buildHTML } from './pipeline/buildHTML.js'
import { buildJSON } from './pipeline/buildJSON.js'
import { qa } from './pipeline/qa.js'
import { nanoid } from 'nanoid'

const DEMO_TTL_SECONDS = 60 * 60 * 24 * 90  // 90 days
const HISTORY_KEY = 'history:index'
const HISTORY_MAX = 500  // cap index to avoid unbounded KV value growth

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function requireApiKey(request, env) {
  const appKey = env.APP_API_KEY
  if (!appKey) return null  // no key configured → open (dev mode)
  const clientKey = request.headers.get('x-api-key')
  if (!clientKey || clientKey !== appKey) {
    return json({ error: 'Unauthorized: missing or invalid x-api-key.' }, 401)
  }
  return null
}

async function handleGenerate(request, env) {
  const authError = requireApiKey(request, env)
  if (authError) return authError

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const normalized = normalize(body)
  const decisions = decide(normalized)
  const aiContent = await generate(normalized, decisions, env)
  const html = buildHTML(normalized, decisions, aiContent)
  const jsonData = buildJSON(normalized, decisions, aiContent)

  const id = nanoid(10).replace(/[^a-zA-Z0-9_-]/g, '')

  // Store demo HTML in KV — key: demo:<id>, TTL: 90 days
  await env.DEMO_STORE.put(`demo:${id}`, html, { expirationTtl: DEMO_TTL_SECONDS })

  // Append to history index (stored as JSON array in KV)
  const historyEntry = {
    id,
    businessName: normalized.productName || '',
    niche: normalized.niche || '',
    outputLang: normalized.outputLang || 'en',
    demoUrl: `/demo/${id}`,
    createdAt: new Date().toISOString(),
  }
  let history = []
  const existing = await env.HISTORY_STORE.get(HISTORY_KEY, { type: 'json' })
  if (Array.isArray(existing)) history = existing
  history.unshift(historyEntry)
  if (history.length > HISTORY_MAX) history = history.slice(0, HISTORY_MAX)
  await env.HISTORY_STORE.put(HISTORY_KEY, JSON.stringify(history))

  const warnings = qa(html)
  if (warnings.length) console.warn('QA warnings:', warnings)

  return json({ html, json: jsonData, id })
}

async function handleGetDemo(id, env) {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '')
  if (!safeId) return new Response('Invalid ID', { status: 400 })

  const html = await env.DEMO_STORE.get(`demo:${safeId}`)
  if (!html) return new Response('Demo not found', { status: 404 })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

async function handleGetHistory(request, env) {
  const authError = requireApiKey(request, env)
  if (authError) return authError

  const history = await env.HISTORY_STORE.get(HISTORY_KEY, { type: 'json' })
  return json(Array.isArray(history) ? history : [])
}

async function handleDeleteHistory(id, request, env) {
  const authError = requireApiKey(request, env)
  if (authError) return authError

  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '')
  if (!safeId) return json({ error: 'Invalid ID' }, 400)

  // Remove from history index
  const existing = await env.HISTORY_STORE.get(HISTORY_KEY, { type: 'json' })
  if (Array.isArray(existing)) {
    const updated = existing.filter(e => e.id !== safeId)
    await env.HISTORY_STORE.put(HISTORY_KEY, JSON.stringify(updated))
  }

  // Delete demo from KV
  await env.DEMO_STORE.delete(`demo:${safeId}`)

  return json({ success: true })
}

/**
 * Serve static assets from Workers Sites (env.ASSETS).
 * For GET /, inject window._appApiKey into the HTML before </head>
 * so the frontend can auth POST /generate requests.
 */
async function handleStatic(request, env) {
  const assetResponse = await env.ASSETS.fetch(request)

  const url = new URL(request.url)
  const isRoot = url.pathname === '/' || url.pathname === '/index.html'

  // Only inject on the root HTML document, not JS/SVG assets
  if (isRoot && env.APP_API_KEY) {
    const originalText = await assetResponse.text()
    const injectedScript = `<script>window._appApiKey=${JSON.stringify(env.APP_API_KEY)}</script>`
    const injected = originalText.replace('</head>', injectedScript + '</head>')
    return new Response(injected, {
      status: assetResponse.status,
      headers: assetResponse.headers,
    })
  }

  return assetResponse
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname
    const method = request.method

    try {
      // POST /generate
      if (method === 'POST' && pathname === '/generate') {
        return await handleGenerate(request, env)
      }

      // GET /demo/:id
      const demoMatch = pathname.match(/^\/demo\/([^/]+)$/)
      if (method === 'GET' && demoMatch) {
        return await handleGetDemo(demoMatch[1], env)
      }

      // GET /history
      if (method === 'GET' && pathname === '/history') {
        return await handleGetHistory(request, env)
      }

      // DELETE /history/:id
      const deleteMatch = pathname.match(/^\/history\/([^/]+)$/)
      if (method === 'DELETE' && deleteMatch) {
        return await handleDeleteHistory(deleteMatch[1], request, env)
      }

      // Static assets — GET / and /js/* and /assets/*
      if (method === 'GET') {
        return await handleStatic(request, env)
      }

      return new Response('Not Found', { status: 404 })
    } catch (err) {
      console.error('Worker error:', err)
      return json({ error: err.message }, 500)
    }
  },
}
