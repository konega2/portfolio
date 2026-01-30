import InstallButton from './components/InstallButton'
import ProjectCard from './components/ProjectCard'
import SectionTitle from './components/SectionTitle'
import {
  FAQS,
  PROCESS_STEPS,
  PRESENTATION,
  PROJECTS,
  REAL_PROJECTS,
  SERVICES,
  TRUST_BADGES,
  TRUST_PILLARS
} from './content'
import { useCallback, useEffect, useRef, useState } from 'react'

const PHONE_E164 = '+34653265348'
const WHATSAPP_PREFILL = 'Hola buenas, me gustaría saber más sobre una web para mi negocio.'
// Ordenadas según aparecen en la página (de arriba a abajo)
const SECTION_IDS = ['confianza', 'servicios', 'proceso', 'proyectos', 'casos-reales', 'faq', 'contacto']

const BASE_TITLE = 'Esteban · Webs rápidas para negocios'
const BASE_DESCRIPTION = 'Portfolio de Esteban Garcia-España: webs rápidas para pequeños negocios, SEO y reservas online.'

const SEO_BY_SECTION: Record<string, { title: string; description: string }> = {
  confianza: {
    title: `${BASE_TITLE} · Confianza`,
    description: 'Cómo trabajo contigo: claridad, cercanía y entrega profesional. Demo gratuita sin compromiso.'
  },
  servicios: {
    title: `${BASE_TITLE} · Servicios`,
    description: 'Webs que convierten, SEO básico y sistemas de reservas/gestión para negocios locales.'
  },
  proceso: {
    title: `${BASE_TITLE} · Proceso`,
    description: 'Proceso simple en 4 pasos: brief, propuesta, diseño+contenido y entrega con mejoras.'
  },
  proyectos: {
    title: `${BASE_TITLE} · Proyectos`,
    description: 'Ejemplos de webs y funcionalidades: cafetería, belleza, entrenador personal, estudio creativo y más.'
  },
  'casos-reales': {
    title: `${BASE_TITLE} · Casos reales`,
    description: 'Casos con negocio real en producción: detalles, enfoque y enlaces al resultado.'
  },
  faq: {
    title: `${BASE_TITLE} · FAQ`,
    description: 'Dudas típicas respondidas: tiempos, revisiones, precios, hosting/dominio y demo gratuita.'
  },
  contacto: {
    title: `${BASE_TITLE} · Contacto`,
    description: 'Hablemos: cuéntame tu negocio y te envío una propuesta clara (con demo gratuita si quieres).'
  }
}

type RealProjectItem = (typeof REAL_PROJECTS)[number]

function RealProjectCard({ project }: { project: RealProjectItem }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const images = project.images ?? []
  const total = images.length
  const hasImages = total > 0

  const goPrev = () => {
    if (!hasImages) return
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }

  const goNext = () => {
    if (!hasImages) return
    setActiveIndex((prev) => (prev + 1) % total)
  }

  useEffect(() => {
    if (!hasImages || isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [hasImages, isPaused, total])

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border-2 border-neutral-200 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-accent/50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/5 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      
      <div className="relative flex h-full flex-col">
        <div className="relative border-b-2 border-neutral-100 bg-gradient-to-br from-neutral-50 to-white px-7 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Proyecto real
              </div>
              <h3 className="mt-3 text-2xl font-bold text-neutral-900 title-underline">{project.title}</h3>
              <p className="mt-1 text-sm font-medium text-neutral-600">{project.client}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {project.links.map(link => (
                <a
                  key={link.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p-7">
          {hasImages ? (
            <div className="mb-6">
              <div
                className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-md transition-all duration-300 group-hover:shadow-xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative aspect-[16/9]">
                  {images.map((image, idx) => (
                    <div
                      key={image.src}
                      className={`absolute inset-0 grid place-items-center p-4 transition-opacity duration-700 ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full rounded-xl border border-neutral-200 bg-white object-contain shadow-xl"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  <button
                    type="button"
                    aria-label="Imagen anterior"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white/95 text-neutral-900 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Imagen siguiente"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white/95 text-neutral-900 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {images.map((image, idx) => (
                    <button
                      key={image.src}
                      type="button"
                      aria-label={`Ver imagen ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-accent' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                  <span>{activeIndex + 1} / {total}</span>
                  <span className="text-neutral-400">·</span>
                  <span className={isPaused ? 'text-neutral-500' : 'text-accent'}>{isPaused ? 'Pausado' : 'Auto'}</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5">
            <h4 className="text-sm font-bold text-neutral-900">Descripción</h4>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">{project.summary}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5">
            <h4 className="text-sm font-bold text-neutral-900">Características principales</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {project.highlights.map((item) => (
                <div key={item} className="group/item flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/10 transition-colors duration-200 group-hover/item:bg-accent">
                    <svg className="h-3.5 w-3.5 text-accent transition-colors duration-200 group-hover/item:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {project.note ? (
            <div className="mt-5 overflow-hidden rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">Nota importante</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700">{project.note}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const headerRef = useRef<HTMLElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [projectsCompleted, setProjectsCompleted] = useState(0)
  const [happyClients, setHappyClients] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pendingNavRef = useRef<{ id: string; until: number } | null>(null)

  useEffect(() => {
    const seo = activeSection ? SEO_BY_SECTION[activeSection] : undefined
    document.title = seo?.title ?? BASE_TITLE

    const description = seo?.description ?? BASE_DESCRIPTION
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [activeSection])

  const scrollToHash = useCallback(
    (hash: string, behavior: ScrollBehavior = 'smooth') => {
      const id = hash.replace(/^#/, '')
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12
      window.scrollTo({ top: Math.max(0, top), behavior })
    },
    []
  )

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const forceTop = () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    forceTop()
    let raf2 = 0
    const raf1 = window.requestAnimationFrame(() => {
      forceTop()
      raf2 = window.requestAnimationFrame(() => forceTop())
    })
    const timeout = window.setTimeout(forceTop, 120)
    const onLoad = () => forceTop()

    window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
      window.clearTimeout(timeout)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      event.preventDefault()
      history.pushState(null, '', href)
      const id = href.replace(/^#/, '')
      pendingNavRef.current = { id, until: performance.now() + 1200 }
      setActiveSection(id)
      scrollToHash(href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollToHash])

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) scrollToHash(window.location.hash, 'auto')
    }

    const t = window.setTimeout(onHashChange, 0)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [scrollToHash])

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const currentScroll = window.scrollY
      setScrollY(currentScroll)

      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const progress = total > 0 ? (currentScroll / total) * 100 : 0
      setScrollProgress(progress)

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0
      const marker = currentScroll + headerHeight + 24

      // Si el usuario ha hecho click en el nav, mantenemos el activo durante el scroll suave
      const pending = pendingNavRef.current
      if (pending && performance.now() < pending.until) {
        const target = document.getElementById(pending.id)
        if (target) {
          const targetTop = target.getBoundingClientRect().top + window.scrollY
          // Mientras no hayamos llegado a la sección, no re-evaluamos el activo (evita el parpadeo)
          if (marker < targetTop - 4) {
            setActiveSection((prev) => (prev !== pending.id ? pending.id : prev))
            return
          }
        }

        // Ya estamos en la zona objetivo (o no existe): liberamos el bloqueo
        pendingNavRef.current = null
      }

      let nextActive = ''
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= marker) nextActive = id
      }

      // Asegura que el último bloque (contacto) pueda activarse cerca del final
      const remaining = doc.scrollHeight - (currentScroll + window.innerHeight)
      if (remaining < 4) {
        const last = SECTION_IDS[SECTION_IDS.length - 1]
        if (last) nextActive = last
      }

      if (nextActive) {
        setActiveSection((prev) => (nextActive !== prev ? nextActive : prev))
      }
    }

    const onScrollOrResize = () => {
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    elements.forEach((el, index) => {
      if (!el.style.transitionDelay) {
        const delay = Math.min(index * 0.04, 0.4)
        el.style.setProperty('--reveal-delay', `${delay}s`)
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timer1 = setInterval(() => {
      setProjectsCompleted(prev => prev < 12 ? prev + 1 : 12)
    }, 100)
    const timer2 = setInterval(() => {
      setHappyClients(prev => prev < 8 ? prev + 1 : 8)
    }, 150)
    return () => {
      clearInterval(timer1)
      clearInterval(timer2)
    }
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setMobileMenuOpen(false)
    }

    onChange()
    // Safari/older
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMq = mq as any
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else if (anyMq.addListener) anyMq.addListener(onChange)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else if (anyMq.removeListener) anyMq.removeListener(onChange)
    }
  }, [])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((v) => !v), [])

  const MOBILE_NAV = [
    { href: '#confianza', label: 'Confianza', icon: '◆' },
    { href: '#servicios', label: 'Servicios', icon: '✦' },
    { href: '#proceso', label: 'Proceso', icon: '◇' },
    { href: '#proyectos', label: 'Proyectos', icon: '◈' },
    { href: '#casos-reales', label: 'Casos reales', icon: '◆' },
    { href: '#faq', label: 'FAQ', icon: '?' },
    { href: '#contacto', label: 'Contacto', icon: '→' }
  ]

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 subtle-grid opacity-40" />
        <div className="absolute inset-0 soft-wash" />
      </div>
      <div
        className="fixed left-0 top-0 z-50 h-0.5 bg-accent/70 transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <header 
        ref={headerRef}
        className="sticky top-0 z-20 border-b border-neutral-200/60 bg-cream/80 backdrop-blur-md shadow-sm"
        style={{ transform: `translateY(${Math.min(scrollY * 0.3, 10)}px)` }}
      >
        <div className="container-safe flex h-16 items-center justify-between">
          <a href="#top" className="group inline-flex items-center gap-2 focus-ring rounded-xl px-2 py-1.5">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark__ring" />
              <span className="brand-mark__shine" />
              <span className="brand-mark__letters">EG</span>
            </span>
            <span className="sr-only">Inicio</span>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              Esteban
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-3" aria-label="Navegación principal">
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] px-1.5 py-1.5">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center gap-0.5">
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#confianza"
                  data-active={activeSection === 'confianza'}
                >
                  <span className="nav-icon">◆</span>
                  <span>Confianza</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#servicios"
                  data-active={activeSection === 'servicios'}
                >
                  <span className="nav-icon">✦</span>
                  <span>Servicios</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#proceso"
                  data-active={activeSection === 'proceso'}
                >
                  <span className="nav-icon">◇</span>
                  <span>Proceso</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#proyectos"
                  data-active={activeSection === 'proyectos'}
                >
                  <span className="nav-icon">◈</span>
                  <span>Proyectos</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#casos-reales"
                  data-active={activeSection === 'casos-reales'}
                >
                  <span className="nav-icon">◆</span>
                  <span>Casos reales</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#faq"
                  data-active={activeSection === 'faq'}
                >
                  <span className="nav-icon">?</span>
                  <span>FAQ</span>
                </a>
                <span className="nav-separator" />
                <a
                  className="nav-link-v2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  href="#contacto"
                  data-active={activeSection === 'contacto'}
                >
                  <span className="nav-icon">→</span>
                  <span>Contacto</span>
                </a>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={toggleMobileMenu}
            >
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-neutral-900 transition-all duration-300 ${
                    mobileMenuOpen ? 'top-2.5 rotate-45 bg-accent' : 'rotate-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-neutral-900 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-neutral-900 transition-all duration-300 ${
                    mobileMenuOpen ? 'top-2.5 -rotate-45 bg-accent' : 'rotate-0'
                  }`}
                />
              </span>
            </button>
            <InstallButton />
            <a
              className="wa-btn focus-ring"
              href={`https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir WhatsApp"
              title="WhatsApp"
            >
              <span className="wa-pulse" aria-hidden="true" />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="wa-icon"
                focusable="false"
              >
                {/* WhatsApp mark (Simple Icons-style) */}
                <path
                  fill="currentColor"
                  d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.39 0 .02 5.38.02 12c0 2.12.55 4.18 1.6 6L0 24l6.2-1.6a11.98 11.98 0 0 0 5.81 1.48h.01c6.62 0 12-5.38 12-12a11.9 11.9 0 0 0-3.5-8.4Zm-8.5 18.36h-.01a10.3 10.3 0 0 1-5.25-1.44l-.38-.23-3.68.94.98-3.6-.25-.37A10.3 10.3 0 0 1 2.03 12c0-5.5 4.48-9.98 9.98-9.98 2.66 0 5.17 1.04 7.05 2.92A9.9 9.9 0 0 1 21.98 12c0 5.5-4.48 9.98-9.96 9.98Zm5.7-7.69c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.2.31-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.52-.91-.81-1.52-1.81-1.7-2.12-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.54.08-.82.39-.28.31-1.07 1.04-1.07 2.55 0 1.5 1.1 2.95 1.25 3.16.16.2 2.16 3.3 5.23 4.63.73.31 1.3.5 1.74.64.73.23 1.39.2 1.92.12.59-.09 1.83-.75 2.09-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.6-.36Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden transition ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className={`absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />

        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className={`absolute left-1/2 top-4 w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-3xl border-2 border-neutral-200 bg-cream/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-[0.98]'
          }`}
        >
          <div className="relative">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
              <a
                href="#top"
                className="group inline-flex items-center gap-2 focus-ring rounded-xl px-2 py-1.5"
                onClick={closeMobileMenu}
              >
                <span className="brand-mark" aria-hidden="true">
                  <span className="brand-mark__ring" />
                  <span className="brand-mark__shine" />
                  <span className="brand-mark__letters">EG</span>
                </span>
                <span className="text-sm font-semibold tracking-tight text-neutral-900">Esteban</span>
              </a>

              <button
                type="button"
                className="focus-ring grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 bg-white/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                onClick={closeMobileMenu}
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative px-5 py-5">
              <div className="grid gap-2">
                {MOBILE_NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    data-active={activeSection === item.href.replace('#', '')}
                    className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 data-[active=true]:border-accent/50 data-[active=true]:bg-accent/5"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    <span className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </a>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_E164}`}
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 active:translate-y-0"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar
                </a>
              </div>

              <p className="mt-4 text-center text-xs text-neutral-600">
                Me pillas en WhatsApp y te contesto rápido.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main id="top" className="relative">
        <section className="relative overflow-hidden">
          <div className="container-safe py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <div className="soft-pill reveal" data-reveal>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                  </span>
                  <span>Disponible para proyectos reales</span>
                </div>
                
                <h1 className="reveal mt-5 text-balance text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl font-display" data-reveal>
                  Haz que tu negocio destaque online
                </h1>
                <p className="reveal mt-4 max-w-xl text-pretty text-sm leading-relaxed text-neutral-700 md:text-base" data-reveal style={{ transitionDelay: '0.1s' }}>
                  Soy Esteban, estudiante de 18 años de DAM + DAW. Creo webs claras y fáciles de usar, ayudo a mejorar tu presencia online y a organizar tu negocio desde el móvil. Todo a un precio accesible, con resultados profesionales.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3 reveal" data-reveal style={{ transitionDelay: '0.2s' }}>
                  <div className="soft-card p-4 text-center">
                    <div className="text-3xl font-bold text-accent">{projectsCompleted}+</div>
                    <div className="text-sm text-neutral-600">Proyectos completados</div>
                  </div>
                  <div className="soft-card p-4 text-center">
                    <div className="text-3xl font-bold text-accent">{happyClients}+</div>
                    <div className="text-sm text-neutral-600">Clientes satisfechos</div>
                  </div>
                  <div className="soft-card p-4 text-center">
                    <div className="text-3xl font-bold text-accent">&lt;1h</div>
                    <div className="text-sm text-neutral-600">Tiempo de respuesta</div>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3 reveal" data-reveal style={{ transitionDelay: '0.3s' }}>
                  <a
                    className="group relative inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 btn-elevate cta-pulse"
                    href="#proyectos"
                  >
                    <span className="pointer-events-none absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-white/30 transition-transform duration-300 group-hover:scale-x-100" />
                    Ver proyectos
                  </a>
                  <a
                    className="group relative inline-flex items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 btn-elevate"
                    href="#contacto"
                  >
                    <span className="pointer-events-none absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-neutral-900/20 transition-transform duration-300 group-hover:scale-x-100" />
                    <svg className="h-4 w-4 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>Consulta tu presupuesto</span>
                  </a>
                </div>

                <p className="mt-3 text-sm text-neutral-600 reveal" data-reveal style={{ transitionDelay: '0.35s' }}>
                  También puedes llamarme: <a className="font-semibold text-neutral-900 hover:text-accent transition" href={`tel:${PHONE_E164}`}>{PHONE_E164}</a>
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div
                    className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 reveal"
                    data-reveal
                  >
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-900 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-neutral-900">Landing Page</p>
                    <p className="mt-1.5 text-sm text-neutral-600">Rápida y clara</p>
                  </div>

                  <div
                    className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 reveal"
                    data-reveal
                    style={{ transitionDelay: '0.1s' }}
                  >
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-900 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                        <circle cx="11" cy="11" r="7" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-neutral-900">SEO básico</p>
                    <p className="mt-1.5 text-sm text-neutral-600">Para Google</p>
                  </div>

                  <div
                    className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 reveal"
                    data-reveal
                    style={{ transitionDelay: '0.2s' }}
                  >
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-900 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 9h16M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-neutral-900">Reservas</p>
                    <p className="mt-1.5 text-sm text-neutral-600">Si lo necesitas</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="group rounded-2xl border border-neutral-200 bg-white p-7 transition-all duration-500 hover:shadow-2xl hover:border-accent relative overflow-hidden reveal" data-reveal>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent-light to-accent transition-all duration-500 group-hover:scale-110 group-hover:animate-glow" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">Esteban Garcia-España</p>
                        <p className="text-sm text-neutral-600">18 años · Estudiante</p>
                      </div>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-neutral-700">
                      Trabajo con proyectos reales para seguir aprendiendo y ampliar mi portfolio mientras financio mis estudios y certificaciones. Al mismo tiempo, tú ganas visibilidad, más clientes y una gestión más sencilla de tu negocio.
                    </p>

                    <div className="mt-6 space-y-2.5">
                      <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-0.5 text-neutral-400">·</span>
                        <p>Entrego rápido y muestro avances</p>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-0.5 text-neutral-400">·</span>
                        <p>Presupuesto claro y accesible</p>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-0.5 text-neutral-400">·</span>
                        <p>Respondo rápido por WhatsApp</p>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="confianza" className="border-t border-neutral-200 bg-cream-dark/30">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Confianza"
              title="Mi forma de trabajar contigo"
              subtitle="No soy una agencia. Soy estudiante y quiero crecer con proyectos reales (y seguir formándome) donde ambas partes ganamos."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {TRUST_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/50 reveal"
                  data-reveal
                  style={{ transitionDelay: `${idx * 0.08}s` }}
                >
                  <div className="absolute right-4 top-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-900/5 text-neutral-400 transition-all duration-300 group-hover:bg-accent/10 group-hover:text-accent">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white">{pillar.badge}</span>
                  <h3 className="mt-4 text-lg font-bold text-neutral-900 title-underline">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{pillar.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pillar.bullets.slice(0, 2).map((bullet) => (
                      <span key={bullet} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {bullet}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-accent/50 reveal" data-reveal>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {PRESENTATION.offer.title}
                  </div>
                  <div className="mt-5 space-y-3">
                    {PRESENTATION.offer.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-accent/50 reveal" data-reveal style={{ transitionDelay: '0.1s' }}>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {PRESENTATION.seek.title}
                  </div>
                  <div className="mt-5 space-y-3">
                    {PRESENTATION.seek.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="border-t border-neutral-200">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Lo que hago"
              title="Servicios pensados para pequeños negocios"
              subtitle="Poco texto, todo claro. Lo importante es que te contacten."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {SERVICES.map((s, idx) => {
                const icons = [
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>,
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>,
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 9h16M6 21h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ];
                return (
                  <div
                    key={s.title}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/50 reveal"
                    data-reveal
                    style={{ transitionDelay: `${idx * 0.1}s` }}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-neutral-900 p-4 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {icons[idx]}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 title-underline">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {s.bullets.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-700 transition-colors duration-200 group-hover:border-accent/30 group-hover:bg-accent/5"
                          >
                            <span className="h-1 w-1 rounded-full bg-accent" />
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="proceso" className="border-t border-neutral-200 bg-cream-dark/30">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Proceso simple"
              title="Así trabajamos paso a paso"
              subtitle="Un proceso simple, sin complicaciones, para que tengas claridad desde el inicio."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/50 reveal"
                  data-reveal
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-neutral-900 text-lg font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 title-underline">{step.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="proyectos" className="border-t border-neutral-200 bg-cream-dark/30">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Portfolio"
              title="Proyectos"
              subtitle="Ejemplos de estilos y funcionalidades que puedo hacer para ti."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 auto-rows-fr">
              {PROJECTS.map((p, idx) => (
                <div
                  key={p.title}
                  className="reveal h-full"
                  data-reveal
                  style={{ transitionDelay: `${idx * 0.08}s` }}
                >
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600">
              ¿Tienes ya una web? También puedo mejorar velocidad, SEO y tu perfil de empresa en Google.
            </p>
          </div>
        </section>

        <section id="casos-reales" className="border-t border-neutral-200">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Proyectos reales"
              title="Casos con negocio real"
              subtitle="Trabajo entregado a cliente. Detalles y enlaces al resultado en producción."
            />

            <div className="mt-10 grid gap-6">
              {REAL_PROJECTS.map((project, idx) => (
                <div key={project.title} className="reveal" data-reveal style={{ transitionDelay: `${idx * 0.08}s` }}>
                  <RealProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-neutral-200 bg-cream-dark/30">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Preguntas frecuentes"
              title="Dudas típicas, respuestas claras"
              subtitle="Si tienes otra duda, te respondo por WhatsApp rápido."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {FAQS.map((faq, idx) => (
                <div
                  key={faq.question}
                  className="group reveal relative overflow-hidden rounded-2xl border-2 border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-accent/40"
                  data-reveal
                  style={{ transitionDelay: `${idx * 0.05}s` }}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/5 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                      <svg className="h-5 w-5 text-accent transition-colors duration-300 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-neutral-900 leading-snug">{faq.question}</p>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="border-t border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
          <div className="container-safe py-16">
            <SectionTitle
              kicker="Contacto"
              title="Hablemos y te doy una propuesta simple"
              subtitle="Me dices tu negocio, tu ciudad y qué te gustaría conseguir. Yo te contesto con una idea clara."
            />

            <div className="mt-10 mx-auto max-w-4xl">
              <div className="group relative overflow-hidden rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-white p-8 shadow-xl transition-all duration-500 hover:border-accent hover:shadow-2xl reveal" data-reveal>
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
                <div className="relative">
                  <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Sin compromiso · 100% gratis
                      </div>
                      <h3 className="mt-3 text-2xl font-bold text-neutral-900 title-underline">
                        Creo una demo totalmente gratuita
                      </h3>
                      <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                        Si te gusta, seguimos adelante con el proyecto completo. Si no te convence, no hay problema y no pagas nada. Simple y claro.
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 transition-transform duration-300 group-hover:scale-110">
                        <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl border-2 border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-7 lg:col-span-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 hover:border-accent/40 reveal" data-reveal>
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-accent/5 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                        <svg className="h-5 w-5 text-accent transition-colors duration-300 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.95L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 title-underline">Hablemos de tu proyecto</h3>
                        <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                          Dime <span className="font-semibold text-neutral-800">negocio</span>, <span className="font-semibold text-neutral-800">ciudad</span> y <span className="font-semibold text-neutral-800">objetivo</span>.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-neutral-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Respuesta rápida
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-neutral-200">
                        <svg className="h-3.5 w-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        &lt; 2 horas
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      href={`https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                      <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">recomendado</span>
                    </a>
                    <a
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      href={`tel:${PHONE_E164}`}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Llamar
                      <span className="ml-1 text-xs font-medium text-neutral-500">{PHONE_E164}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border-2 border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-accent/50 reveal" data-reveal style={{ transitionDelay: '0.1s' }}>
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:bg-accent">
                      <svg className="h-5 w-5 text-accent transition-colors duration-300 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900">Lo que cuido</h3>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {[
                      { icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', text: 'Diseño limpio y profesional' },
                      { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', text: 'Rápida en móvil' },
                      { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', text: 'SEO básico incluido' },
                      { icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', text: 'Instalable (PWA)' }
                    ].map((item, idx) => (
                      <li key={idx} className="group/item flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/10 transition-colors duration-200 group-hover/item:bg-accent">
                          <svg className="h-3.5 w-3.5 text-accent transition-colors duration-200 group-hover/item:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-neutral-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-cream-dark/40">
        <div className="container-safe py-14">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <a href="#top" className="group inline-flex items-center gap-3 focus-ring rounded-xl px-2 py-1.5">
                <span className="brand-mark" aria-hidden="true">
                  <span className="brand-mark__ring" />
                  <span className="brand-mark__shine" />
                  <span className="brand-mark__letters">EG</span>
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Esteban</p>
                  <p className="text-xs text-neutral-600">Webs rápidas para negocios</p>
                </div>
              </a>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                Diseño claro, móvil y profesional. Si te interesa, puedo prepararte una demo gratuita y una propuesta simple.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#contacto"
                  className="btn-elevate inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent/90"
                >
                  Consulta tu presupuesto
                </a>
                <a
                  href={`https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-elevate inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:border-accent/40"
                >
                  WhatsApp directo
                </a>
              </div>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-sm font-bold text-neutral-900 title-underline">Secciones</h4>
              <ul className="mt-4 grid gap-2 text-sm text-neutral-600">
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#confianza">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    Confianza
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#servicios">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    Servicios
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#proyectos">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    Proyectos
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#proceso">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    Proceso
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#faq">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm font-bold text-neutral-900 title-underline">Contacto</h4>
              <div className="mt-4 grid gap-3 text-sm text-neutral-700">
                <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href={`tel:${PHONE_E164}`}>
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white shadow-sm">📞</span>
                  {PHONE_E164}
                </a>
                <a
                  className="inline-flex items-center gap-2 hover:text-neutral-900 transition"
                  href={`https://wa.me/${PHONE_E164.replace('+', '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white shadow-sm">💬</span>
                  Respuesta rápida
                </a>
                <a className="inline-flex items-center gap-2 hover:text-neutral-900 transition" href="#contacto">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white shadow-sm">⚡</span>
                  Demo gratuita
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200/60 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Esteban Garcia-España · Todos los derechos reservados.</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Disponible para proyectos
              </span>
              <a className="hover:text-neutral-900 transition" href="#top">Volver arriba ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
