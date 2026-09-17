import { Building2, Globe2, Layers, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react'
import { ConnectionRequired, ScreenHeading, StepActions } from '../DemoUI'
import type { Profile, ScreenNavigation } from '../types'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'

export function PersonaSetup({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const update = (key: keyof Profile, value: string) => c.setProfile({ ...c.profile, [key]: value })
  return <section className="yi-persona-setup"><ScreenHeading eyebrow="AI configuration" title="Configure your AI persona">Define how LeadHive should represent your business on YouTube.</ScreenHeading>
    {!c.channel ? <ConnectionRequired /> : <form onSubmit={async event => { event.preventDefault(); if (await c.mutate('/profile', c.profile)) navigate('content') }}>
      <div className="td-persona-layout yi-persona-workspace"><div className="td-persona-form yi-persona-form"><div className="td-section-heading yi-persona-panel-heading"><div><p className="td-eyebrow">Configuration</p><h2>Business identity</h2></div><span>{c.channel.title}</span></div>
        <div className="td-fields yi-persona-fields">
          <label><span>Business / Brand Name</span><span className="yi-field-control"><Building2 size={15} aria-hidden="true" /><input required maxLength={250} value={c.profile.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Your business name" /></span></label>
          <label><span>Website URL</span><span className="yi-field-control"><Globe2 size={15} aria-hidden="true" /><input type="url" required value={c.profile.website} onChange={e => update('website', e.target.value)} placeholder="https://" /></span></label>
          <label className="td-field-wide"><span>Brand Tone</span><select required value={c.profile.brand_tone} onChange={e => update('brand_tone', e.target.value)}><option value="">Select a tone</option><option>Professional & Helpful</option><option>Casual & Friendly</option><option>Witty & Humorous</option></select></label>
          <label className="td-field-wide"><span>Core Services</span><textarea rows={3} required value={c.profile.services} onChange={e => update('services', e.target.value)} placeholder="Describe your services" /></label>
          <label className="td-field-wide"><span>Rules & Directives</span><textarea rows={4} required value={c.profile.ai_rules} onChange={e => update('ai_rules', e.target.value)} placeholder="Communication guidelines and boundaries" /></label>
        </div>
      </div><aside className="td-persona-architecture yi-persona-preview" aria-label="AI persona preview"><div className="yi-preview-header"><div><p className="td-eyebrow">AI preview</p><h2>Your business voice</h2></div><span className="yi-preview-status"><i /> Preview</span></div>
        <div className="yi-persona-core" aria-hidden="true"><span className="yi-persona-orbit yi-persona-orbit-one" /><span className="yi-persona-orbit yi-persona-orbit-two" /><span className="yi-persona-core-mark"><Sparkles size={22} /></span><strong>LeadHive AI</strong><small>Persona core</small></div>
        <div className="yi-preview-profile"><span className="yi-preview-label">Identity signal</span><strong>{c.profile.business_name || 'Your brand'}</strong><p>{c.profile.brand_tone || 'Select a tone to shape your AI voice'}</p></div>
        <ol>{[
          { label: 'Brand identity', icon: <Building2 size={15} /> },
          { label: 'Core services', icon: <Layers size={15} /> },
          { label: 'Brand tone', icon: <MessageSquareText size={15} /> },
          { label: 'Communication rules', icon: <ShieldCheck size={15} /> },
        ].map((item, i) => <li key={item.label}><span className="td-context-index">{String(i + 1).padStart(2, '0')}</span><span className="yi-preview-item-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span></li>)}</ol>
        <div className="td-persona-end"><Sparkles size={16} /><span><strong>Persona workspace</strong><small>Updates as you configure</small></span></div></aside></div>
      <StepActions back={() => navigate('channel')} submit busy={c.busy || c.loading} label="Save & Select Videos" />
    </form>}
  </section>
}
