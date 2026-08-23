import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  Layers3,
  Menu,
  MessageCircle,
  MessagesSquare,
  MousePointer2,
  Radio,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react'

const navLinks = [
  ['Product', 'product'],
  ['Channels', 'channels'],
  ['Mobile App', 'mobile'],
  ['Why LeadHive', 'why'],
] as const

const capabilities = [
  { icon: MessagesSquare, title: 'Massive conversation scale', text: 'Engage thousands of inquiries at once, without compromising response quality.' },
  { icon: Zap, title: 'Respond in seconds', text: 'Keep intent high with fast, always-on responses across every connected channel.' },
  { icon: BrainCircuit, title: 'Understand real intent', text: 'Interpret customer needs, urgency, context, requirements, and buying signals.' },
  { icon: Target, title: 'Qualify intelligently', text: 'Ask business-specific questions that separate curiosity from commercial potential.' },
  { icon: BarChart3, title: 'Prioritize automatically', text: 'Score every conversation as Hot, Warm, Cold, or No Lead for effortless focus.' },
  { icon: Bell, title: 'Act at the right moment', text: 'Send rich alerts and conversation summaries when high-value opportunities emerge.' },
]

const processSteps = [
  { number: '01', title: 'Connect', status: 'Channels unified', icon: Layers3, text: 'Bring Facebook, Instagram, WhatsApp Business, and your website into one intelligent layer.' },
  { number: '02', title: 'Engage', status: 'Instant response', icon: Zap, text: 'Respond instantly and manage every incoming conversation at scale.' },
  { number: '03', title: 'Understand', status: 'Intent detected', icon: BrainCircuit, text: 'Detect customer need, intent, urgency, requirements, and timeline.' },
  { number: '04', title: 'Qualify', status: 'Signals verified', icon: ScanSearch, text: 'Ask smart, business-specific questions to uncover genuine opportunities.' },
  { number: '05', title: 'Prioritize', status: 'Lead scored', icon: Target, text: 'Score each inquiry as Hot, Warm, Cold, or No Lead.' },
  { number: '06', title: 'Handover', status: 'Sales ready', icon: UserCheck, text: 'Give sales the right lead, with the right context, at the right time.' },
]

const benefits = [
  { icon: Layers3, title: 'One intelligent frontline', text: 'Every channel. One consistent, intelligent customer experience.' },
  { icon: Clock3, title: 'Always on', text: 'Qualify demand 24/7—even when your sales team is offline.' },
  { icon: Zap, title: 'Instant response', text: 'Keep momentum high with responses delivered in seconds.' },
  { icon: Users, title: 'Built for scale', text: 'Handle campaign spikes without adding operational headcount.' },
  { icon: ScanSearch, title: 'Smart qualification', text: 'Surface the signals that reveal commercial opportunity.' },
  { icon: ShieldCheck, title: 'Structured intelligence', text: 'Turn messy conversations into clean, usable sales context.' },
]

const channels = [
  { icon: MessagesSquare, name: 'Messenger', label: 'Facebook', className: 'facebook', text: 'Engage incoming inquiries and campaign responses automatically.' },
  { icon: Camera, name: 'Direct Messages', label: 'Instagram', className: 'instagram', text: 'Turn high-intent DMs into structured lead intelligence.' },
  { icon: MessageCircle, name: 'WhatsApp Business', label: 'WhatsApp', className: 'whatsapp', text: 'Understand and qualify customer demand at scale.' },
  { icon: Globe2, name: 'Your Website', label: 'Web', className: 'website', text: 'Capture, engage, and qualify visitors before they disappear.' },
]

const funnelData = [
  { value: '10,000', label: 'Incoming inquiries', width: '100%' },
  { value: '6,850', label: 'Meaningful conversations', width: '86%' },
  { value: '1,240', label: 'Potential prospects', width: '67%' },
  { value: '420', label: 'Qualified opportunities', width: '49%' },
  { value: '150', label: 'Hot leads', width: '31%' },
]

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ eyebrow, title, copy, centered = false }: { eyebrow: string; title: React.ReactNode; copy?: string; centered?: boolean }) {
  return (
    <Reveal className={`section-header ${centered ? 'centered' : ''}`}>
      <div className="eyebrow"><span />{eyebrow}</div>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </Reveal>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setIsLoading(false), 1650)
    return () => window.clearTimeout(loaderTimer)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || isLoading ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, isLoading])

  return (
    <div className="site-shell">
      <AnimatePresence>
        {isLoading && (
          <motion.div className="site-loader" role="status" aria-live="polite" aria-label="Loading LeadHive AI" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}>
            <div className="loader-grid" />
            <div className="loader-glow" />
            <motion.div className="loader-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .08 }}>
              <motion.img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .65, delay: .12 }} />
              <div className="loader-status"><span><BrainCircuit /></span><div><small>AI SALES INTELLIGENCE</small><b>Preparing your experience<i /><i /><i /></b></div></div>
              <div className="loader-progress"><span /></div>
              <div className="loader-steps"><span>Connect</span><i /><span>Understand</span><i /><span>Qualify</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`site-content ${isLoading ? 'is-preloading' : 'is-ready'}`} aria-hidden={isLoading}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className={`navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
        <nav className="navbar container" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="LeadHive AI home">
            <img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" />
          </a>
          <div className="desktop-nav">
            {navLinks.map(([label, href]) => <a key={href} href={`#${href}`}>{label}</a>)}
          </div>
          <a href="#contact" className="button button-sm nav-cta">Book a demo <ArrowUpRightIcon /></a>
          <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {navLinks.map(([label, href]) => <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)}>{label}<ChevronRight /></a>)}
              <a href="#contact" className="button" onClick={() => setMenuOpen(false)}>Book a demo <ArrowRight /></a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-grid container">
            <motion.div className="hero-copy" initial={false} animate={isLoading ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>
              <div className="hero-eyebrow"><Sparkles /> AI Sales Intelligence</div>
              <h1>
                <motion.span className="hero-title-line" initial={false} animate={isLoading ? { opacity: 0, y: 22, filter: 'blur(6px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .62, delay: .04 }}>Turn every</motion.span>
                <motion.span className="hero-title-line" initial={false} animate={isLoading ? { opacity: 0, y: 22, filter: 'blur(6px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .62, delay: .12 }}>conversation into a</motion.span>
                <motion.span className="hero-title-line gradient-text" initial={false} animate={isLoading ? { opacity: 0, y: 22, filter: 'blur(6px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .62, delay: .2 }}>qualified opportunity.</motion.span>
              </h1>
              <p className="hero-lead">LeadHive AI engages every inquiry, understands buying intent, and surfaces the opportunities your sales team should act on first.</p>
              <div className="hero-actions">
                <a href="#contact" className="button">Book a demo <ArrowRight /></a>
                <a href="#workflow" className="button button-ghost">See how it works <ArrowDownRight /></a>
              </div>
              <div className="hero-proof">
                <div><strong>10,000</strong><span>Messages</span></div>
                <i />
                <div><strong>150</strong><span>Hot leads</span></div>
                <i />
                <div><strong>0</strong><span>Guesswork</span></div>
              </div>
            </motion.div>

            <motion.div className="hero-visual" initial={false} animate={isLoading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }} whileHover={{ y: -5, rotateX: 1.2, rotateY: -1.2, transition: { duration: .35, delay: 0 } }} transition={{ duration: .78, delay: .12, ease: [0.22, 1, 0.36, 1] }}>
              <div className="demo-orbits" aria-hidden="true">
                <span className="demo-orbit orbit-alpha"><i /><i /></span>
                <span className="demo-orbit orbit-beta"><i /><i /></span>
                <span className="demo-orbit orbit-gamma"><i /></span>
              </div>
              <div className="product-demo">
                <div className="demo-toolbar"><div><i /><i /><i /></div><span><Radio /> LIVE QUALIFICATION</span><small>LeadHive AI</small></div>
                <div className="demo-body">
                  <div className="message-feed">
                    <div className="demo-label">Incoming conversations <span>4 live</span></div>
                    <div className="incoming-message message-facebook"><b>f</b><div><small>Facebook</small><p>Is this available for 3 offices?</p></div></div>
                    <div className="incoming-message message-instagram"><Camera /><div><small>Instagram</small><p>Can your team share pricing?</p></div></div>
                    <div className="incoming-message message-whatsapp"><MessageCircle /><div><small>WhatsApp</small><p>We need rollout in 2 weeks.</p></div></div>
                    <div className="typing-message"><Globe2 /><span><i /><i /><i /></span><small>Website visitor typing</small></div>
                  </div>

                  <div className="ai-route" aria-hidden="true"><span /><i><ArrowRight /></i></div>

                  <div className="qualification-output">
                    <div className="ai-engine"><span><BrainCircuit /></span><div><b>LeadHive AI</b><small>Understanding conversation</small></div><em><i /> Processing</em></div>
                    <div className="qualification-tags"><span><Check /> Intent detected</span><span><Check /> Budget confirmed</span><span><Check /> Timeline identified</span></div>
                    <div className="qualified-lead">
                      <div className="qualified-head"><span className="lead-avatar">SA</span><div><b>Sarah Ahmed</b><small>Enterprise Inquiry</small></div><span className="lead-state"><em className="warm-state">WARM</em><em className="hot-state">HOT LEAD</em></span></div>
                      <div className="lead-details"><div><span>Intent</span><b>High</b></div><div><span>Budget</span><b>Confirmed</b></div><div><span>Timeline</span><b>2 Weeks</b></div></div>
                      <div className="lead-score"><div><span>Lead score</span><strong>92%</strong></div><i><span /></i></div>
                    </div>
                    <div className="sales-notification"><Bell /><div><small>SALES HANDOVER</small><b>High-value opportunity sent to your team</b></div><Check /></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="channel-strip container">
            <span>Connected where your customers talk</span>
            <div><b>f</b> Messenger</div><div><Camera /> Instagram</div><div><MessageCircle /> WhatsApp</div><div><Globe2 /> Website</div>
          </div>
        </section>

        <section className="problem-section section">
          <div className="container problem-layout">
            <SectionHeader eyebrow="The problem" title={<>Your next customer could be <span className="gradient-text">lost in your inbox.</span></>} copy="More attention creates more messages—but not every conversation represents real buying intent. Your team shouldn't have to read them all to find out." />
            <Reveal className="inbox-panel">
              <div className="panel-top"><div><span className="status-dot" /> Unified inbox</div><span>1,284 unread</span></div>
              {[['Can you share the price?', '2m', 'warm'], ['Need this for 12 branches ASAP', '4m', 'hot'], ['Hello???', '6m', 'cold'], ['Do you deliver to Lahore?', '8m', 'warm'], ['Looking for a job', '12m', 'none']].map(([text, time, status], i) => (
                <motion.div className={`message-row ${status === 'hot' ? 'highlight' : ''}`} key={text} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1 - i * .12, x: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .15 + i * .09 }}>
                  <span className={`mini-avatar a${i}`}>{['S', 'A', 'M', 'H', 'R'][i]}</span>
                  <div><b>{text}</b><small>Incoming conversation</small></div>
                  <time>{time}</time>
                  <span className={`intent-dot ${status}`} />
                </motion.div>
              ))}
              <div className="inbox-fade" />
              <motion.div className="signal-callout" initial={{ opacity: 0, y: 14, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: .65, delay: .7 }}><Target /><div><small>HIGH-INTENT SIGNAL DETECTED</small><b>Commercial opportunity surfaced</b></div><ArrowRight /></motion.div>
            </Reveal>
          </div>
          <Reveal className="statement container">
            <span>THE REAL CHALLENGE</span>
            <p>The problem is not getting more leads. <strong>The problem is knowing which ones actually matter.</strong></p>
          </Reveal>
        </section>

        <section className="solution-section section" id="product">
          <div className="container">
            <SectionHeader centered eyebrow="The solution" title={<>Meet your AI-powered <span className="gradient-text">frontline sales agent.</span></>} copy="It does more than send automated replies. LeadHive listens, understands, engages, qualifies, scores, and prioritizes—around the clock." />
            <div className="capability-grid">
              {capabilities.map((item, i) => (
                <Reveal className="capability-card" delay={i * 0.05} key={item.title}>
                  <div className="card-index">0{i + 1}</div>
                  <span className="feature-icon"><item.icon /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="card-line" />
                </Reveal>
              ))}
            </div>
            <Reveal className="result-banner">
              <div className="result-icon"><UserCheck /></div>
              <p>Your sales team gets <strong>opportunities</strong>, not inbox chaos.</p>
              <a href="#contact">See LeadHive in action <ArrowRight /></a>
            </Reveal>
          </div>
        </section>

        <section className="process-section section" id="workflow">
          <div className="container">
            <SectionHeader eyebrow="How it works" title={<>From message to qualified opportunity. <span className="gradient-text">Automatically.</span></>} copy="A continuous intelligence layer that turns raw conversations into confident human action." />
            <div className="process-shell">
              <div className="process-beam" aria-hidden="true"><span /></div>
              <div className="process-track">
                {processSteps.map((step, i) => (
                  <Reveal className="process-step" delay={i * 0.08} key={step.number}>
                    <motion.div
                      className="step-marker"
                      whileInView={{ scale: [0.84, 1.08, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: .55, delay: .16 + i * .12 }}
                    >
                      <step.icon />
                      <span>{step.number}</span>
                    </motion.div>
                    <div className="step-status"><i />{step.status}</div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    <span className="step-corner" />
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal className="lead-legend">
              <span>Lead classification</span>
              <div><i className="hot" /> Hot <small>Ready for action</small></div>
              <div><i className="warm" /> Warm <small>Needs follow-up</small></div>
              <div><i className="cold" /> Cold <small>Low urgency</small></div>
              <div><i className="no-lead" /> No lead <small>Non-commercial</small></div>
            </Reveal>
          </div>
        </section>

        <section className="scale-section section">
          <div className="container scale-layout">
            <div>
              <SectionHeader eyebrow="Clarity at scale" title={<>This is what sales <span className="gradient-text">intelligence</span> looks like.</>} copy="Stop asking whether every message was answered. Start asking how quickly your team can close the opportunities that matter most." />
              <Reveal className="scale-quote"><span>“</span><p>Your team starts the day with clarity, not backlog.</p></Reveal>
            </div>
            <Reveal className="funnel-card">
              <div className="funnel-head"><div><span className="live-dot" /> LIVE FUNNEL</div><span>Last 30 days</span></div>
              <div className="funnel">
                {funnelData.map((row, i) => (
                  <motion.div className={`funnel-row ${i === funnelData.length - 1 ? 'final' : ''}`} key={row.label} initial={{ width: 0 }} whileInView={{ width: row.width }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.1 }}>
                    <span>{row.label}</span><strong>{row.value}</strong>
                  </motion.div>
                ))}
              </div>
              <div className="funnel-foot"><TrendingUp /><span><strong>3.6×</strong> better sales focus</span><small>Powered by LeadHive qualification</small></div>
            </Reveal>
          </div>
        </section>

        <section className="channels-section section" id="channels">
          <div className="container">
            <SectionHeader centered eyebrow="Unified channels" title={<>Built for where your customers <span className="gradient-text">already talk to you.</span></>} copy="Customers don't always fill out forms. They send messages. LeadHive turns those conversations into structured opportunities." />
            <div className="channel-grid">
              {channels.map((channel, i) => (
                <Reveal className={`channel-card ${channel.className}`} delay={i * 0.07} key={channel.label}>
                  <div className="channel-top"><span className="channel-icon"><channel.icon /></span><small>{channel.label}</small></div>
                  <h3>{channel.name}</h3><p>{channel.text}</p>
                  <a href="#contact">Connect channel <ArrowUpRightIcon /></a>
                </Reveal>
              ))}
            </div>
            <div className="connection-line"><span /><i /><i /><i /><i /><span /></div>
            <Reveal className="central-hive"><span><BrainCircuit /></span><div><small>ONE INTELLIGENT LAYER</small><b>LeadHive AI</b></div><div className="hive-tags"><em>Engage</em><em>Understand</em><em>Qualify</em><em>Prioritize</em></div></Reveal>
          </div>
        </section>

        <section className="mobile-section section" id="mobile">
          <div className="container mobile-layout">
            <div className="phone-stage">
              <div className="phone-glow" />
              <motion.div className="phone" initial={{ opacity: 0, y: 50, rotateY: -12 }} whileInView={{ opacity: 1, y: 0, rotateY: -6 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="app-header"><div><small>Good morning,</small><b>Sales overview</b></div><span>AK</span></div>
                  <div className="app-stat"><div><small>HOT LEADS TODAY</small><strong>24</strong><span><TrendingUp /> +18%</span></div><div className="radar"><i /><i /><i /><b>24</b></div></div>
                  <div className="app-section-title"><b>Needs your attention</b><small>View all</small></div>
                  <div className="mobile-lead hot-mobile"><span className="avatar">HA</span><div><b>Hassan Ali</b><small>Needs 12 branch licenses</small></div><em>HOT</em></div>
                  <div className="mobile-lead"><span className="avatar">SM</span><div><b>Sara Malik</b><small>Demo requested • Instagram</small></div><em>92%</em></div>
                  <div className="app-summary"><span><Sparkles /></span><div><small>AI SUMMARY</small><p>High purchase intent. Budget confirmed. Wants to begin this month.</p></div></div>
                  <div className="app-nav"><BarChart3 /><MessagesSquare /><span><Target /></span><Bell /><Users /></div>
                </div>
              </motion.div>
              <motion.div className="phone-alert" animate={{ y: [-4, 4, -4] }} transition={{ duration: 4.5, repeat: Infinity }}>
                <span><Bell /></span><div><small>NEW HOT LEAD</small><b>Action recommended now</b></div><em>94%</em>
              </motion.div>
            </div>
            <div className="mobile-copy">
              <SectionHeader eyebrow="LeadHive mobile" title={<>Your sales intelligence. <span className="gradient-text">In your pocket.</span></>} copy="Give your team immediate visibility into the opportunities that matter most—wherever the day takes them." />
              <div className="mobile-features">
                {[
                  [Bell, 'Hot lead alerts', 'Act the moment high-intent opportunities emerge.'],
                  [Sparkles, 'AI-generated summaries', 'Understand every conversation without reading every message.'],
                  [BarChart3, 'Channel performance', 'See demand, engagement, and quality across touchpoints.'],
                  [Radio, 'Live team visibility', 'Keep sales aligned with a real-time view of what needs action.'],
                ].map(([Icon, title, text], i) => (
                  <Reveal className="mobile-feature" delay={i * 0.05} key={title as string}>
                    <span><Icon /></span><div><h3>{title as string}</h3><p>{text as string}</p></div>
                  </Reveal>
                ))}
              </div>
              <Reveal><a href="#contact" className="text-link">Explore the mobile experience <ArrowRight /></a></Reveal>
            </div>
          </div>
        </section>

        <section className="why-section section" id="why">
          <div className="container">
            <SectionHeader centered eyebrow="Why LeadHive" title={<>Your sales team should sell—<span className="gradient-text">not sort messages.</span></>} copy="More attention should create more business, not more operational chaos. LeadHive turns unstructured conversations into prioritized opportunities." />
            <div className="benefit-grid">
              {benefits.map((item, i) => (
                <Reveal className="benefit-card" delay={i * 0.05} key={item.title}>
                  <span><item.icon /></span><div><h3>{item.title}</h3><p>{item.text}</p></div><Check className="benefit-check" />
                </Reveal>
              ))}
            </div>
            <Reveal className="strategy-line">
              <div><MousePointer2 /><span>Marketing</span><small>generates attention</small></div><ArrowRight />
              <div className="strategy-highlight"><BrainCircuit /><span>LeadHive AI</span><small>creates intelligence</small></div><ArrowRight />
              <div><UserCheck /><span>Your sales team</span><small>closes deals</small></div>
            </Reveal>
          </div>
        </section>

        <section className="intersection-section section">
          <div className="container intersection-layout">
            <SectionHeader eyebrow="Our difference" title={<>Built at the intersection of <span className="gradient-text">AI and marketing.</span></>} copy="Technology understands conversations. Marketing understands customers. LeadHive brings both together to produce better-qualified opportunities—not just more replies." />
            <Reveal className="venn-visual">
              <div className="venn venn-ai"><BrainCircuit /><b>AI</b><span>Product<br />Data<br />Engineering</span></div>
              <div className="venn venn-marketing"><Target /><b>Marketing</b><span>Intent<br />Engagement<br />Qualification</span></div>
              <div className="venn-center"><span>Sales<br />intelligence</span></div>
            </Reveal>
          </div>
        </section>

        <section className="cta-section section" id="contact">
          <div className="container cta-card">
            <div className="cta-grid" />
            <div className="cta-glow" />
            <Reveal className="cta-content">
              <div className="eyebrow"><span />Ready when you are</div>
              <h2>Your next best customer is <span className="gradient-text">already messaging you.</span></h2>
              <p>The question is whether your team will find them in time. Let LeadHive engage every inquiry and surface the leads that deserve attention.</p>
              <div className="hero-actions centered-actions"><a href="mailto:hello@m3hive.com?subject=Book%20a%20LeadHive%20Demo" className="button">Book a demo <ArrowRight /></a><a href="mailto:hello@m3hive.com?subject=Get%20Started%20with%20LeadHive" className="button button-ghost">Get started</a></div>
              <div className="cta-proof"><span><Check /> More conversations</span><span><Check /> Faster response</span><span><Check /> Better qualified leads</span><span><Check /> Same sales team</span></div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" /><p>Turning every customer conversation into clear, qualified sales opportunity.</p></div>
          <div><h4>Platform</h4><a href="#product">Product</a><a href="#channels">Channels</a><a href="#mobile">Mobile app</a></div>
          <div><h4>Company</h4><a href="#why">Why LeadHive</a><a href="#contact">Contact</a><a href="#contact">Book a demo</a></div>
          <div className="footer-contact"><h4>Start a conversation</h4><a href="mailto:hello@m3hive.com">hello@m3hive.com <ArrowUpRightIcon /></a><small>Built for ambitious sales teams.</small><a className="powered-button" href="https://m3hive.com" target="_blank" rel="noreferrer"><span>Powered by</span><strong>m3hive</strong><ArrowUpRightIcon /></a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 LeadHive AI. All rights reserved.</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
      </footer>
      </div>
    </div>
  )
}

function ArrowUpRightIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
}

export default App
