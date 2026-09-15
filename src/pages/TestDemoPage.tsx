import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { Check, ShieldCheck } from 'lucide-react'
import { defaultPersona, demoContents } from '../data/demoData'
import type { Persona, PlatformId } from '../types/demo'
import { DemoHeader } from '../components/demo/DemoHeader'
import { DemoProgress } from '../components/demo/DemoProgress'
import { PlatformStep } from '../components/demo/PlatformStep'
import { ChannelStep } from '../components/demo/ChannelStep'
import { PersonaStep } from '../components/demo/PersonaStep'
import { ContentStep } from '../components/demo/ContentStep'
import { CommandCenter } from '../components/demo/CommandCenter'
import '../styles/demo/base.css'
import '../styles/demo/onboarding.css'
import '../styles/demo/workspace.css'
import '../styles/demo/analytics.css'

export default function TestDemoPage() {
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<PlatformId | null>(null)
  const [channelSelected, setChannelSelected] = useState(false)
  const [persona, setPersona] = useState<Persona>({ ...defaultPersona })
  const [contentIds, setContentIds] = useState<string[]>(demoContents.map((content) => content.id))
  const [launched, setLaunched] = useState(false)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const title = document.title
    document.title = 'Test Demo | LeadHive AI'
    return () => {
      document.title = title
    }
  }, [])
  function focusHeading() {
    window.requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('[data-demo-heading]')?.focus({ preventScroll: true }),
    )
  }
  function goTo(nextStep: number) {
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className={'td-app ' + (launched ? 'td-app-dashboard' : '')}>
        <a className="td-skip-link" href="#td-main">
          Skip to demo
        </a>
        <DemoHeader />
        <main id="td-main">
          {launched ? (
            <CommandCenter
              persona={persona}
              contentIds={contentIds}
              onSetup={() => {
                setLaunched(false)
                goTo(3)
              }}
            />
          ) : (
            <div className="td-onboarding">
              <DemoProgress step={step} />
              <AnimatePresence mode="wait" initial={false} onExitComplete={focusHeading}>
                <motion.div
                  key={step}
                  className="td-step-content"
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  onAnimationComplete={focusHeading}
                >
                  {step === 1 && (
                    <PlatformStep
                      selected={platform}
                      onSelect={setPlatform}
                      onNext={() => {
                        if (platform === 'youtube') goTo(2)
                      }}
                    />
                  )}
                  {step === 2 && (
                    <ChannelStep
                      selected={channelSelected}
                      onSelect={() => setChannelSelected((value) => !value)}
                      onBack={() => goTo(1)}
                      onNext={() => {
                        if (channelSelected) goTo(3)
                      }}
                    />
                  )}
                  {step === 3 && (
                    <PersonaStep
                      persona={persona}
                      onChange={setPersona}
                      onBack={() => goTo(2)}
                      onNext={() => goTo(4)}
                    />
                  )}
                  {step === 4 && (
                    <ContentStep
                      selected={contentIds}
                      onChange={setContentIds}
                      onBack={() => goTo(3)}
                      onNext={() => {
                        if (contentIds.length) {
                          setLaunched(true)
                          window.scrollTo({ top: 0, behavior: 'instant' })
                          focusHeading()
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="td-onboarding-footer">
                <span>
                  <ShieldCheck size={13} />A safe space to explore what’s possible.
                </span>
                <span>
                  <Check size={13} />
                  No account. No commitment.
                </span>
              </div>
            </div>
          )}
        </main>
        <footer className="td-footer">
          <span>© {new Date().getFullYear()} LeadHive AI</span>
          <span>Intelligence behind every conversation.</span>
          <span>Interactive product demo</span>
        </footer>
      </div>
    </MotionConfig>
  )
}
