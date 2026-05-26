import express from 'express'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { normalize } from './pipeline/normalize.js'
import { decide } from './pipeline/decide.js'
import { generate } from './pipeline/generate.js'
import { buildHTML } from './pipeline/buildHTML.js'
import { buildJSON } from './pipeline/buildJSON.js'
import { qa } from './pipeline/qa.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json({ limit: '1mb' }))

// Serve index.html dynamically so APP_API_KEY can be injected into the page.
// All other static files are served normally by express.static below.
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html')
  let html = readFileSync(indexPath, 'utf8')
  const keyScript = `<script>window._appApiKey='${process.env.APP_API_KEY || ''}'</script>`
  html = html.replace('<head>', `<head>\n  ${keyScript}`)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(html)
})

app.use(express.static(path.join(__dirname, 'public')))

// Ensure demo-storage directory exists
const demoStorageDir = path.join(__dirname, 'demo-storage')
if (!existsSync(demoStorageDir)) {
  mkdirSync(demoStorageDir, { recursive: true })
}

// x-api-key middleware — guards POST /generate
// If APP_API_KEY is set in env, the client must send it as x-api-key header.
function requireApiKey(req, res, next) {
  const appKey = process.env.APP_API_KEY
  if (!appKey) return next() // No key configured → open (dev mode)
  const clientKey = req.headers['x-api-key']
  if (!clientKey || clientKey !== appKey) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid x-api-key.' })
  }
  next()
}

app.post('/generate', requireApiKey, async (req, res) => {
  try {
    const normalized = normalize(req.body)
    const decisions = decide(normalized)
    const aiContent = await generate(normalized, decisions)
    const html = buildHTML(normalized, decisions, aiContent)
    const json = buildJSON(normalized, decisions, aiContent)
    const id = nanoid(10)

    // Save demo file — path is resolved inside demoStorageDir only
    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '')
    const demoPath = path.join(demoStorageDir, `${safeId}.html`)
    writeFileSync(demoPath, html, 'utf8')

    const warnings = qa(html)
    if (warnings.length) console.warn('QA warnings:', warnings)

    res.json({ html, json, id: safeId })
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/demo/:id', (req, res) => {
  // Sanitize: allow only alphanumeric, hyphen, underscore
  const id = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '')
  if (!id) return res.status(400).send('Invalid ID')

  const file = path.join(demoStorageDir, `${id}.html`)
  // Path traversal guard: resolved path must stay inside demoStorageDir
  const resolved = path.resolve(file)
  const safeBase = path.resolve(demoStorageDir)
  if (!resolved.startsWith(safeBase + path.sep) && resolved !== safeBase) {
    return res.status(400).send('Invalid ID')
  }

  if (existsSync(resolved)) {
    res.sendFile(resolved)
  } else {
    res.status(404).send('Demo not found')
  }
})

const PORT = process.env.PORT || 4200
app.listen(PORT, () => console.log(`AI Landing Page System v2 running on http://localhost:${PORT}`))
