import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['Product', 'product'],
  ['How It Works', 'workflow'],
  ['Channels', 'channels'],
  ['Mobile', 'mobile'],
  ['Why LeadHive', 'why'],
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()
  const homePath = window.location.pathname === '/'
  const sectionHref = (id: string) => `${homePath ? '' : '/'}#${id}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className={`navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        <a href={homePath ? '#home' : '/'} className="brand" aria-label="LeadHive AI home">
          <img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" />
        </a>

        <div className="desktop-nav">
          {links.map(([label, id]) => (
            <a key={id} href={sectionHref(id)}>{label}</a>
          ))}
        </div>

        <div className="nav-actions">
          <span className="nav-live-indicator" aria-label="LeadHive platform active">
            <span className="nav-live-dot" />
            <small>Live Engine</small>
          </span>
          <a href={sectionHref('contact')} className="button button-small nav-cta">
            Book a demo <ArrowUpRight />
          </a>
          <button 
            className="menu-button" 
            onClick={() => setMenuOpen((open) => !open)} 
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} 
            aria-expanded={menuOpen} 
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            id="mobile-navigation"
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(([label, id]) => (
              <a key={id} href={sectionHref(id)} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight />
              </a>
            ))}
            <a className="button" href={sectionHref('contact')} onClick={() => setMenuOpen(false)}>
              Book a demo <ArrowUpRight />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
