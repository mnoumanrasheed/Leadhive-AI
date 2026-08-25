import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['Product', 'product'],
  ['How It Works', 'workflow'],
  ['Channels', 'channels'],
  ['Why LeadHive', 'why'],
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        <a href="#home" className="brand" aria-label="LeadHive AI home">
          <img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" />
        </a>
        <div className="desktop-nav">
          {links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </div>
        <a href="#contact" className="button button-small nav-cta">Book a demo <ArrowUpRight /></a>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          >
            {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<span>↗</span></a>)}
            <a className="button" href="#contact" onClick={() => setMenuOpen(false)}>Book a demo <ArrowUpRight /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
