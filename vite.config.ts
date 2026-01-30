import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'redirect-proyectos-lowercase',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? ''
          if (!url.startsWith('/proyectos/')) return next()

          const [pathname, query = ''] = url.split('?')
          const parts = pathname.split('/').filter(Boolean)
          if (parts.length < 2) return next()

          const folder = parts[1]
          const lower = folder.toLowerCase()
          if (folder === lower) return next()

          const publicDir = server.config.publicDir
          const candidate = path.join(publicDir, 'proyectos', lower)
          if (!fs.existsSync(candidate)) return next()

          const redirectedPath = ['/proyectos', lower, ...parts.slice(2)].join('/')
          res.statusCode = 307
          res.setHeader('Location', redirectedPath + (query ? `?${query}` : ''))
          res.end()
        })
      }
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'robots.txt', 'sitemap.xml', 'og.svg'],
      manifest: {
        name: 'Esteban · Portfolio',
        short_name: 'Esteban',
        description: 'Webs rápidas para pequeños negocios. SEO y reservas online.',
        theme_color: '#fefdfb',
        background_color: '#fefdfb',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
