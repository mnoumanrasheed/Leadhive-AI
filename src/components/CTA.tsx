import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Mail } from 'lucide-react'
import { Reveal } from './Reveal'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function buildDemoMailto(form: FormData) {
  const subject = `LeadHive demo request — ${form.get('company') || 'New enquiry'}`
  const body = [
    `Name: ${form.get('name')}`,
    `Work email: ${form.get('email')}`,
    `Company: ${form.get('company')}`,
    `Primary channels: ${form.get('channels')}`,
    `Monthly conversation volume: ${form.get('volume')}`,
  ].join('\n')

  return `mailto:hello@m3hive.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function CTA() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.18 })
  const reducedMotion = useReducedMotion()
  const animate = inView && !reducedMotion

  const prepareDemoEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')

    try {
      const mailto = buildDemoMailto(new FormData(event.currentTarget))
      setStatus('success')
      window.location.assign(mailto)
      window.setTimeout(() => setStatus('idle'), 1800)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="cta-section section-pad" id="contact" ref={ref}>
      <div className="cta-motion-field" aria-hidden="true">
        <motion.i animate={animate ? { x: [0, 12, 0], y: [0, -8, 0], scale: [1, 1.03, 1] } : { x: 0, y: 0, scale: 1 }} transition={{ duration: 22, repeat: animate ? Infinity : 0, ease: 'easeInOut' }} />
        <motion.b animate={animate ? { x: [0, -10, 0], y: [0, 7, 0] } : { x: 0, y: 0 }} transition={{ duration: 18, repeat: animate ? Infinity : 0, ease: 'easeInOut' }} />
      </div>
      <div className="container">
        <div className="cta-layout">
          <Reveal className="cta-heading">
            <p className="eyebrow light">Ready when you are</p>
            <h2>Your next best customer is already messaging you.</h2>
            <p>Tell us a little about your conversation volume and channels. We’ll use it to make the demo relevant to your team.</p>
            <div className="cta-proof">
              {['Channel-aware qualification', 'Clear Opportunity Scores', 'Human-ready Sales Handover'].map((item) => <span key={item}><Check /> {item}</span>)}
            </div>
          </Reveal>
          <Reveal className="demo-form-wrap" delay={0.08}>
            <form className="demo-form" onSubmit={prepareDemoEmail} aria-busy={status === 'submitting'} aria-describedby="demo-form-note">
              <div className="form-heading"><span>Book a Demo</span><small>All fields are required</small></div>
              <label><span>Name</span><input name="name" autoComplete="name" required placeholder="Amelia Carter" disabled={status === 'submitting'} /></label>
              <label><span>Work Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required placeholder="amelia@company.com" disabled={status === 'submitting'} /></label>
              <label><span>Company</span><input name="company" autoComplete="organization" required placeholder="Northstar Retail" disabled={status === 'submitting'} /></label>
              <div className="form-row">
                <label><span>Primary Channels</span><select name="channels" required defaultValue="" disabled={status === 'submitting'}><option value="" disabled>Select channels</option><option>WhatsApp</option><option>Instagram</option><option>Facebook Messenger</option><option>Website chat</option><option>Multiple channels</option></select></label>
                <label><span>Monthly Conversation Volume</span><select name="volume" required defaultValue="" disabled={status === 'submitting'}><option value="" disabled>Select volume</option><option>Under 1,000</option><option>1,000–5,000</option><option>5,000–20,000</option><option>20,000+</option></select></label>
              </div>
              <button className="button" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Preparing request…' : 'Schedule Demo'} <motion.span animate={animate ? { x: [0, 3, 0] } : { x: 0 }} transition={{ duration: 2.4, repeat: animate ? Infinity : 0, repeatDelay: 1.2 }}><ArrowRight /></motion.span>
              </button>
              <p className="form-note" id="demo-form-note"><Mail /> This prepares a complete request in your email app.</p>
              <p className={`form-feedback${status === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
                {status === 'success' && 'Your request is ready—complete it in your email app.'}
                {status === 'error' && 'We could not open your email app. Please use hello@m3hive.com instead.'}
              </p>
            </form>
          </Reveal>
        </div>
        <Reveal className="cta-contact-line">
          <span>Prefer email?</span>
          <a href="mailto:hello@m3hive.com?subject=LeadHive%20AI%20Demo">hello@m3hive.com <ArrowRight /></a>
        </Reveal>
      </div>
    </section>
  )
}
