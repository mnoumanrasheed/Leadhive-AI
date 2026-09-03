import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Mail } from 'lucide-react'
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

export function CTA() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const ref = useRef<HTMLElement>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = useRef<number | null>(null)
  const inView = useInView(ref, { amount: 0.18 })
  const reducedMotion = useReducedMotion()
  const animate = inView && !reducedMotion

  useEffect(() => {
    let cancelled = false

    if (!recaptchaSiteKey) {
      setStatus('error')
      setFeedback('reCAPTCHA is not configured yet. Add VITE_RECAPTCHA_SITE_KEY before production.')
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
            setFeedback('reCAPTCHA could not be verified. Please try again.')
          },
        })
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
        setFeedback('reCAPTCHA could not load. Please refresh and try again.')
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

    try {
      const form = new FormData(event.currentTarget)
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
          captchaToken,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'We could not send your request. Please try again.')
      }

      setStatus('success')
      setFeedback('Thanks. Your demo request has been sent and we will reply shortly.')
      event.currentTarget.reset()
      resetCaptcha()
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'We could not send your request. Please try again.')
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
            <p>Tell us a little about your conversation volume and channels. We'll use it to make the demo relevant to your team.</p>
            <div className="cta-proof">
              {['Channel-aware qualification', 'Clear Opportunity Scores', 'Human-ready Sales Handover'].map((item) => <span key={item}><Check /> {item}</span>)}
            </div>
          </Reveal>
          <Reveal className="demo-form-wrap" delay={0.08}>
            <form className="demo-form" onSubmit={submitDemoRequest} aria-busy={status === 'submitting'} aria-describedby="demo-form-note">
              <div className="form-heading"><span>Book a Demo</span><small>All fields are required</small></div>
              <label><span>Name</span><input name="name" autoComplete="name" required placeholder="Amelia Carter" disabled={status === 'submitting'} /></label>
              <label><span>Work Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required placeholder="amelia@company.com" disabled={status === 'submitting'} /></label>
              <label><span>Company</span><input name="company" autoComplete="organization" required placeholder="Northstar Retail" disabled={status === 'submitting'} /></label>
              <div className="form-row">
                <label><span>Primary Channels</span><select name="channels" required defaultValue="" disabled={status === 'submitting'}><option value="" disabled>Select channels</option><option>WhatsApp</option><option>Instagram</option><option>Facebook Messenger</option><option>Website chat</option><option>Multiple channels</option></select></label>
                <label><span>Monthly Conversation Volume</span><select name="volume" required defaultValue="" disabled={status === 'submitting'}><option value="" disabled>Select volume</option><option>Under 1,000</option><option>1,000-5,000</option><option>5,000-20,000</option><option>20,000+</option></select></label>
              </div>
              <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" disabled={status === 'submitting'} /></label>
              <div className="recaptcha-wrap" ref={recaptchaRef} />
              <button className="button" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending request...' : 'Schedule Demo'} <motion.span animate={animate ? { x: [0, 3, 0] } : { x: 0 }} transition={{ duration: 2.4, repeat: animate ? Infinity : 0, repeatDelay: 1.2 }}><ArrowRight /></motion.span>
              </button>
              <p className="form-note" id="demo-form-note"><Mail /> Your details are sent securely to the LeadHive team.</p>
              <p className={`form-feedback${status === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
                {feedback}
              </p>
            </form>
          </Reveal>
        </div>
        <Reveal className="cta-contact-line">
          <span>Prefer email?</span>
          <a href="mailto:support@leadhive-ai.com?subject=LeadHive%20AI%20Demo">support@leadhive-ai.com <ArrowRight /></a>
        </Reveal>
      </div>
    </section>
  )
}
