import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { motion, useInView, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Mail, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { Reveal } from './Reveal'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        },
      ) => number
      reset: (widgetId?: number) => void
    }
  }
}

let recaptchaScriptPromise: Promise<void> | null = null

function loadRecaptchaScript() {
  if (window.grecaptcha) return Promise.resolve()

  if (!recaptchaScriptPromise) {
    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://www.google.com/recaptcha/api.js"]')

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Unable to load reCAPTCHA.')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Unable to load reCAPTCHA.'))
      document.head.appendChild(script)
    })
  }

  return recaptchaScriptPromise
}

const valueBullets = [
  'Capture leads across WhatsApp, Instagram, Facebook Messenger, and website chat',
  'Engage instantly with AI-powered responses',
  'Qualify serious prospects more efficiently',
  'Deliver cleaner handover to your sales team',
]

export function CTA() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const ref = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = useRef<number | null>(null)
  const inView = useInView(ref, { amount: 0.12 })
  const reducedMotion = useReducedMotion()
  const animate = inView && !reducedMotion

  // Subtle 3D Desktop Tilt on Panel
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 220 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, -1.2]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.2, 1.2]), springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 1024 || !panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  useEffect(() => {
    let cancelled = false

    if (!recaptchaSiteKey || recaptchaSiteKey === 'PASTE_RECAPTCHA_SITE_KEY_HERE') {
      return
    }

    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !recaptchaRef.current || recaptchaWidgetId.current !== null || !window.grecaptcha) return

        recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: recaptchaSiteKey,
          callback: (token: string) => {
            setCaptchaToken(token)
            setFeedback('')
            setStatus('idle')
          },
          'expired-callback': () => setCaptchaToken(''),
          'error-callback': () => {
            setCaptchaToken('')
            setStatus('error')
            setFeedback("We couldn't submit your request. Please try again.")
          },
        })
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
        setFeedback("We couldn't submit your request. Please try again.")
      })

    return () => {
      cancelled = true
    }
  }, [])

  const resetCaptcha = () => {
    setCaptchaToken('')
    if (recaptchaWidgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(recaptchaWidgetId.current)
    }
  }

  const submitDemoRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === 'submitting') return

    if (!captchaToken) {
      setStatus('error')
      setFeedback('Please complete the reCAPTCHA checkbox before submitting.')
      return
    }

    setStatus('submitting')
    setFeedback('')

    const formElement = event.currentTarget

    try {
      const form = new FormData(formElement)
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          company: form.get('company'),
          channels: form.get('channels'),
          volume: form.get('volume'),
          website: form.get('website'),
          recaptchaToken: captchaToken,
          captchaToken: captchaToken,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "We couldn't submit your request. Please try again.")
      }

      setStatus('success')
      setFeedback('Thank you. Your request has been received. Our team will contact you shortly.')
      formElement.reset()
      resetCaptcha()
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error && error.message.length < 150 ? error.message : "We couldn't submit your request. Please try again.")
    }
  }

  return (
    <section className="cta-section" id="contact" ref={ref}>
      <div className="cta-bg-gradient" aria-hidden="true" />
      <div className="cta-grid-pattern" aria-hidden="true" />
      
      {/* Ambient background glows */}
      <div className="cta-ambient-glow" aria-hidden="true">
        <motion.div
          className="glow-cyan"
          animate={animate ? { x: [0, 24, 0], y: [0, -16, 0], scale: [1, 1.05, 1] } : undefined}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="glow-blue"
          animate={animate ? { x: [0, -20, 0], y: [0, 18, 0], scale: [1, 1.04, 1] } : undefined}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container">
        <div className="cta-layout">
          {/* Left Side: Story, Headline & Compact Trust Points */}
          <div className="cta-left-content">
            <Reveal>
              <div className="cta-badge">
                <span className="cta-badge-dot" />
                <span>Book a Demo</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="cta-headline">
                Turn more conversations{' '}
                <span className="cta-headline-accent">into qualified sales opportunities.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="cta-description">
                LeadHive AI helps businesses capture customer conversations across channels, qualify leads intelligently, and route serious opportunities to the sales team faster.
              </p>
            </Reveal>

            {/* Compact Trust / Value Bullets */}
            <ul className="cta-value-bullets">
              {valueBullets.map((bullet, index) => (
                <Reveal delay={0.16 + index * 0.06} key={bullet}>
                  <li className="cta-bullet-item">
                    <ShieldCheck className="cta-bullet-icon" />
                    <span>{bullet}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.4}>
              <div className="cta-workflow-note">
                Tell us about your business workflow and we’ll tailor the demo around your channels and conversation volume.
              </div>
            </Reveal>
          </div>

          {/* Right Side: Premium Floating Demo Panel */}
          <Reveal className="cta-panel-container" delay={0.1}>
            <motion.div
              ref={panelRef}
              className="cta-panel-wrap"
              style={{
                rotateX: !reducedMotion ? rotateX : 0,
                rotateY: !reducedMotion ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="cta-panel-inner">
                <div className="cta-panel-header">
                  <h3 className="cta-panel-title">Book a tailored demo</h3>
                  <p className="cta-panel-subtitle">
                    Share your details and conversation workflow, and we’ll show you how LeadHive AI can support your team.
                  </p>
                </div>

                <form className="demo-form" onSubmit={submitDemoRequest} aria-busy={status === 'submitting'} aria-describedby="demo-form-note">
                  <div className="demo-form-grid">
                    {/* Row 1: Name + Email */}
                    <div className="demo-form-row">
                      <label>
                        <span>Name</span>
                        <input
                          name="name"
                          autoComplete="name"
                          required
                          placeholder="Amelia Carter"
                          disabled={status === 'submitting'}
                        />
                      </label>
                      <label>
                        <span>Work Email</span>
                        <input
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          required
                          placeholder="amelia@company.com"
                          disabled={status === 'submitting'}
                        />
                      </label>
                    </div>

                    {/* Row 2: Company */}
                    <label>
                      <span>Company</span>
                      <input
                        name="company"
                        autoComplete="organization"
                        required
                        placeholder="Northstar Retail"
                        disabled={status === 'submitting'}
                      />
                    </label>

                    {/* Row 3: Channels + Volume */}
                    <div className="demo-form-row">
                      <label>
                        <span>Primary Channels</span>
                        <select name="channels" required defaultValue="" disabled={status === 'submitting'}>
                          <option value="" disabled>Select channels</option>
                          <option>WhatsApp</option>
                          <option>Instagram</option>
                          <option>Facebook Messenger</option>
                          <option>Website chat</option>
                          <option>Multiple channels</option>
                        </select>
                      </label>
                      <label>
                        <span>Monthly Conversation Volume</span>
                        <select name="volume" required defaultValue="" disabled={status === 'submitting'}>
                          <option value="" disabled>Select volume</option>
                          <option>Under 1,000</option>
                          <option>1,000-5,000</option>
                          <option>5,000-20,000</option>
                          <option>20,000+</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Honeypot field for spam prevention */}
                  <label className="form-honeypot" aria-hidden="true">
                    <span>Website</span>
                    <input name="website" tabIndex={-1} autoComplete="off" disabled={status === 'submitting'} />
                  </label>

                  {/* reCAPTCHA v2 checkbox container */}
                  <div className="recaptcha-wrap" ref={recaptchaRef} />

                  {/* Submit Button */}
                  <button className="cta-submit-button" type="submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending request...' : 'Schedule My Demo'}
                    <ArrowRight />
                  </button>

                  {/* Microcopy note */}
                  <p className="form-note" id="demo-form-note">
                    <Mail /> Your details are secure and used only to arrange your LeadHive AI demo.
                  </p>

                  {/* Feedback message box (stable height, zero layout jumps) */}
                  <div
                    className={`form-feedback-box${feedback ? (status === 'success' ? ' is-success' : ' is-error') : ''}`}
                    role="status"
                    aria-live="polite"
                  >
                    {feedback && (
                      <>
                        {status === 'success' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0 }} />
                            {feedback}
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                            {feedback}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* Secondary Contact Option */}
        <Reveal className="cta-secondary-line" delay={0.2}>
          <span>Prefer email?</span>
          <a href="mailto:support@leadhive-ai.com?subject=LeadHive%20AI%20Demo">
            support@leadhive-ai.com <ArrowRight />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
