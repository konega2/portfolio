import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const app = express()
app.use(cors())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Sirve el build de Vite (dist/) como web app
const distPath = path.resolve(__dirname, '..', 'dist')
app.use(express.static(distPath))

// Sirve páginas estáticas de proyectos (sin que el SPA las "absorba")
app.use('/proyectos', (req, res, next) => {
  const requested = req.path.split('/').filter(Boolean)
  if (requested.length === 0) return next()

  const folder = requested[0]
  const lower = folder.toLowerCase()
  if (folder === lower) return next()

  const candidate = path.join(distPath, 'proyectos', lower)
  if (!fs.existsSync(candidate)) return next()

  const rest = requested.slice(1).join('/')
  const redirected = `/proyectos/${lower}${rest ? `/${rest}` : ''}`
  res.redirect(307, redirected)
})
app.use('/proyectos', express.static(path.join(distPath, 'proyectos')))

// Health check simple
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/proyectos/')) {
    res.status(404).end()
    return
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

const port = process.env.PORT || 5174
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
