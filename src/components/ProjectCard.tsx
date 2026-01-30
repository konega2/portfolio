import type { Project } from '../content'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function ProjectCard({ project }: { project: Project }) {
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [previewWidth, setPreviewWidth] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const el = previewRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 0
      setPreviewWidth(w)
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsSmallScreen(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const rawHref = project.cta?.href ?? project.links?.[0]?.href
  const isHashLink = typeof rawHref === 'string' && rawHref.startsWith('#')
  const isAbsoluteHttp = typeof rawHref === 'string' && /^https?:\/\//i.test(rawHref)
  const looksLikeDomain = typeof rawHref === 'string' && /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+/i.test(rawHref)

  const href = !rawHref
    ? undefined
    : isHashLink || isAbsoluteHttp
      ? rawHref
      : looksLikeDomain
        ? `https://${rawHref.replace(/^www\./i, 'www.')}`
        : rawHref

  const isExternal = typeof href === 'string' && !href.startsWith('#')
  const isInternalProjectPage = typeof href === 'string' && href.startsWith('/proyectos/')
  const isLocalPanel = typeof href === 'string' && href.startsWith('http://localhost:3000')
  const shouldPreviewIframe = isInternalProjectPage || isLocalPanel

  const previewViewport = useMemo(() => {
    // Desktop-ish preview on large screens, mobile-ish preview on small screens
    return isSmallScreen
      ? { width: 390, height: 844 }
      : { width: 1280, height: 720 }
  }, [isSmallScreen])

  const previewScale = useMemo(() => {
    if (!previewWidth) return 0
    return Math.min(1, previewWidth / previewViewport.width)
  }, [previewWidth, previewViewport.width])

  const previewHeight = useMemo(() => {
    if (!previewScale) return isSmallScreen ? 420 : 260
    const natural = previewViewport.height * previewScale
    const max = isSmallScreen ? 520 : 320
    const min = isSmallScreen ? 380 : 240
    return Math.max(min, Math.min(max, natural))
  }, [previewScale, previewViewport.height, isSmallScreen])

  return (
    <div className="group relative h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-500 hover:border-accent hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150" />
      <div className="relative flex h-full flex-col">
      <div ref={previewRef} className="mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        {shouldPreviewIframe ? (
          <div className="relative" style={{ height: `${previewHeight}px` }}>
            <iframe
              title={`Preview ${project.title}`}
              src={href}
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: `${previewViewport.width}px`,
                height: `${previewViewport.height}px`,
                transform: `scale(${previewScale || 1})`
              }}
              loading="lazy"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
          </div>
        ) : (
          <div className="flex w-full items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100" style={{ height: `${previewHeight}px` }}>
            <div className="text-center">
              <p className="text-xs font-medium text-neutral-500">Preview</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-neutral-900">{project.title}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-neutral-500">{project.niche}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-neutral-900">{project.title}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${t === 'Top'
                ? 'bg-accent text-white shadow-sm'
                : t === 'Destacado'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 group-hover:bg-accent group-hover:text-white'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">{project.summary}</p>

      <ul className="mt-4 space-y-2">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2 text-sm text-neutral-600 group-hover:translate-x-1 transition-transform duration-300">
            <span className="mt-0.5 text-neutral-400 group-hover:text-accent transition-colors">·</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {project.links && project.links.length > 0 ? (
        <div className="mt-auto pt-6 flex flex-wrap gap-2">
          {project.links.map((link, index) => {
            const raw = link.href
            const isHash = raw.startsWith('#')
            const isHttp = /^https?:\/\//i.test(raw)
            const isDomain = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+/i.test(raw)
            const finalHref = isHash || isHttp ? raw : isDomain ? `https://${raw.replace(/^www\./i, 'www.')}` : raw
            const external = typeof finalHref === 'string' && !finalHref.startsWith('#')
            const isPrimary = index === 0

            return (
              <a
                key={`${project.title}-${link.label}`}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  isPrimary
                    ? 'bg-accent text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                    : 'border border-neutral-300 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-accent hover:shadow-md active:translate-y-0'
                } group/link`}
                href={finalHref}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {link.label}
                <span className={`transition-transform duration-200 group-hover/link:translate-x-1 ${isPrimary ? 'text-white/80' : 'text-neutral-500'}`}>→</span>
              </a>
            )
          })}
        </div>
      ) : project.cta ? (
        <div className="mt-auto pt-6">
          <a
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 group/link"
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {project.cta.label}
            <span className="text-white/80 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </a>
        </div>
      ) : null}
      </div>
    </div>
  )
}
