import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { screenLabels, type DemoScreen } from './types'

const steps: DemoScreen[] = ['dashboard', 'channel', 'persona', 'content', 'command-center', 'analytics']
export function DemoShell({ screen, children }: { screen: DemoScreen; children: ReactNode }) {
  const reduced = useReducedMotion()
  const main = useRef<HTMLElement>(null)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [screen])
  return (
    <div className="td-workspace yi-workspace">
      <header className="td-header"><div className="td-header-inner">
        <a href="#platform" className="td-brand" aria-label="LeadHive YouTube Intelligence"><img src="/leadhive-logo.png" alt="LeadHive AI" /></a>
        <span className="td-header-divider" />
        <span className="yi-module-label">{screenLabels[screen]}</span>
        <nav className="yi-navigation" aria-label="YouTube Intelligence sections">
          {steps.map(target => <a key={target} href={'#' + target} aria-current={screen === target ? 'page' : undefined}>{screenLabels[target]}</a>)}
        </nav>
        <a href="/" className="td-exit">Exit Demo <ArrowUpRight size={16} /></a>
      </div></header>
      <div className="td-container">
        <main id="workspace-main" ref={main}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={screen} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: reduced ? 0 : .4 }}
              onAnimationComplete={() => main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="td-workspace-note"><span>LeadHive AI</span><span>YouTube Intelligence</span></div>
      </div>
    </div>
  )
}