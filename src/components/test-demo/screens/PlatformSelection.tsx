import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Bot, Check, MessageCircle, Sparkles } from 'lucide-react'
import { ConnectButton } from '../DemoUI'
import type { ScreenNavigation } from '../types'

type PlatformMarkProps = { size?: number }
function YouTubeMark({ size = 18 }: PlatformMarkProps) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.58 7.19a2.92 2.92 0 0 0-2.05-2.07C17.72 4.64 12 4.64 12 4.64s-5.72 0-7.53.48A2.92 2.92 0 0 0 2.42 7.2C1.94 9.02 1.94 12 1.94 12s0 2.98.48 4.8a2.92 2.92 0 0 0 2.05 2.07c1.81.49 7.53.49 7.53.49s5.72 0 7.53-.49a2.92 2.92 0 0 0 2.05-2.07c.48-1.82.48-4.8.48-4.8s0-2.98-.48-4.81Z" stroke="currentColor" strokeWidth="1.7"/><path d="m10 15 5-3-5-3v6Z" fill="currentColor" /></svg> }
function InstagramMark({ size = 18 }: PlatformMarkProps) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7"/><circle cx="17.6" cy="6.6" r="1" fill="currentColor" /></svg> }
function FacebookMark({ size = 18 }: PlatformMarkProps) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6 21v-8h2.75l.42-3.12H13.6V7.9c0-.9.25-1.52 1.55-1.52h1.74V3.6a23 23 0 0 0-2.54-.13c-2.5 0-4.21 1.53-4.21 4.33v2.08H7.3V13h2.84v8h3.46Z" fill="currentColor" /></svg> }

const platforms = [
  { name: 'YouTube', icon: YouTubeMark, tone: 'youtube', active: true },
  { name: 'WhatsApp', icon: MessageCircle, tone: 'whatsapp', active: false },
  { name: 'Instagram', icon: InstagramMark, tone: 'instagram', active: false },
  { name: 'Facebook', icon: FacebookMark, tone: 'facebook', active: false },
] as const

export function PlatformSelection({ navigate }: ScreenNavigation) {
  const reduced = useReducedMotion()
  return (
    <section className="yi-landing yi-overview-hero">
      <div className="yi-ambient" aria-hidden="true"><motion.div animate={reduced ? undefined : { opacity: [.38, .72, .38], scale: [1, 1.04, 1] }} transition={{ duration: 14, repeat: Infinity }} /></div>
      <div className="yi-hero-copy">
        <p className="yi-premium-eyebrow"><Sparkles size={14} /> LeadHive AI · Omnichannel intelligence</p>
        <h1 tabIndex={-1}>AI-Powered<br />YouTube Intelligence</h1>
        <p>Give your team a calmer, clearer view of the conversations and content that move your business forward—starting with YouTube.</p>
        <div className="yi-hero-actions"><ConnectButton /><button className="td-button td-button-secondary" onClick={() => navigate('dashboard')}>Explore workspace <ArrowRight size={16} /></button></div>
        <div className="yi-trust-row"><span><Check size={14} /> Your Google connection stays in your control</span><span><Check size={14} /> Built for your channel, not generic metrics</span></div>
      </div>

      <div className="yi-ecosystem" aria-label="LeadHive AI ecosystem: YouTube active, WhatsApp, Instagram and Facebook coming soon">
        <div className="yi-ecosystem-orbit yi-orbit-one" aria-hidden="true" /><div className="yi-ecosystem-orbit yi-orbit-two" aria-hidden="true" />
        <div className="yi-core">
          <span className="yi-core-mark"><Bot size={25} /></span><span>LeadHive AI</span><small>Intelligence core</small>
        </div>
        {platforms.map((platform, index) => {
          const Icon = platform.icon
          return <motion.div key={platform.name} className={'yi-ecosystem-node yi-node-' + platform.tone} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .12 + index * .08, duration: reduced ? 0 : .42 }}>
            <span className="yi-node-icon"><Icon size={18} /></span><span><strong>{platform.name}</strong><small>{platform.active ? 'Active' : 'Coming soon'}</small></span><i aria-hidden="true" />
          </motion.div>
        })}
      </div>
    </section>
  )
}