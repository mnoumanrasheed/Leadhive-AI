import { Building2, Sparkles } from 'lucide-react'
import { ConnectionRequired, Panel, PanelHeader, ScreenHeading, StatusBadge, StepActions } from '../DemoUI'
import type { Profile, ScreenNavigation } from '../types'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'

export function PersonaSetup({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const update = (key: keyof Profile, value: Profile[keyof Profile]) =>
    c.setProfile(prev => ({ ...prev, [key]: value }))

  return (
    <section className="yi-persona-setup">
      <ScreenHeading eyebrow="AI Persona" title="Configure your AI persona">
        Define how LeadHive should represent your business in YouTube comment replies.
      </ScreenHeading>

      {!c.channel ? (
        <ConnectionRequired />
      ) : (
        <form
          onSubmit={async event => {
            event.preventDefault()
            if (await c.saveProfile(c.profile)) navigate('content')
          }}
        >
          <div className="yi-persona-workspace">
            <Panel className="yi-persona-form">
              <PanelHeader
                title="Persona identity & directives"
                action={<StatusBadge tone="accent">{c.channel.title}</StatusBadge>}
              >
                Set the communication style, core offerings, and behavioral guardrails for AI engagement.
              </PanelHeader>

              {c.error && <p className="td-error" role="alert">{c.error}</p>}

              <div className="yi-persona-fields">
                <label>
                  <span>Business / Brand Name</span>
                  <span className="yi-field-control">
                    <Building2 size={15} aria-hidden="true" />
                    <input
                      required
                      maxLength={200}
                      value={c.profile.business_name}
                      onChange={e => update('business_name', e.target.value)}
                      placeholder="e.g. Acme Studio"
                    />
                  </span>
                </label>

                <label className="yi-field-wide">
                  <span>Brand Tone / Voice</span>
                  <select
                    value={c.profile.tone}
                    onChange={e => update('tone', e.target.value)}
                  >
                    <option value="">Select a conversational tone</option>
                    <option value="Professional & Helpful">Professional & Helpful</option>
                    <option value="Casual & Friendly">Casual & Friendly</option>
                    <option value="Witty & Humorous">Witty & Humorous</option>
                    <option value="Authoritative & Expert">Authoritative & Expert</option>
                  </select>
                </label>

                <label className="yi-field-wide">
                  <span>Core Offer / Services Description</span>
                  <textarea
                    rows={4}
                    value={c.profile.offer}
                    onChange={e => update('offer', e.target.value)}
                    placeholder="Briefly describe what your business does and key solutions offered..."
                  />
                </label>
              </div>
            </Panel>

            <aside className="td-panel yi-persona-preview" aria-label="AI persona live preview">
              <div className="yi-preview-header">
                <div>
                  <span className="td-panel-kicker">Live Preview</span>
                  <h2>Persona snapshot</h2>
                </div>
                <StatusBadge tone="accent">
                  {c.profile.business_name ? 'Active Draft' : 'Draft'}
                </StatusBadge>
              </div>

              <div className="yi-persona-core">
                <span className="yi-persona-core-mark">
                  <Sparkles size={20} />
                </span>
                <strong>{c.profile.business_name || 'Your Brand'}</strong>
                <small>{c.profile.tone || 'Voice not selected'}</small>
              </div>

              <dl className="yi-preview-list">
                <div>
                  <dt>Channel</dt>
                  <dd>{c.channel.title}</dd>
                </div>
                <div>
                  <dt>Offer / Services</dt>
                  <dd>{c.profile.offer || 'Describe what LeadHive represents.'}</dd>
                </div>
                <div>
                  <dt>Tone</dt>
                  <dd>{c.profile.tone || 'Not selected'}</dd>
                </div>
              </dl>
            </aside>
          </div>

          <StepActions
            back={() => navigate('channel')}
            submit
            busy={c.isSavingProfile || c.isLoading}
            label="Save & Select Videos"
          />
        </form>
      )}
    </section>
  )
}
