import { Check, ShieldCheck, Zap, Clock3 } from 'lucide-react'
import { demoService } from '../../services/demoService'
import type { PlatformId } from '../../types/demo'
import { PlatformIcon, StepActions, StepHeading } from './DemoUI'

export function PlatformStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: PlatformId | null
  onSelect: (platform: PlatformId) => void
  onNext: () => void
}) {
  return (
    <>
      <StepHeading badge="AI-Powered Lead Engagement" title="Experience LeadHive AI in Action">
        Connect a channel and discover how LeadHive understands conversations, identifies intent,
        qualifies prospects and responds automatically.
      </StepHeading>
      <div className="td-platform-grid" role="group" aria-label="Choose a platform">
        {demoService.getSetup().platforms.map((platform) => (
          <button
            key={platform.id}
            className={'td-platform-card ' + (selected === platform.id ? 'is-selected' : '')}
            disabled={!platform.available}
            aria-pressed={selected === platform.id}
            onClick={() => onSelect(platform.id)}
          >
            <div className="td-card-top">
              <span className={'td-platform-icon td-icon-' + platform.id}>
                <PlatformIcon platform={platform.id} />
              </span>
              <span
                className={
                  'td-badge ' + (platform.available ? 'td-badge-green' : 'td-badge-neutral')
                }
              >
                {platform.available ? 'Available' : 'Coming Soon'}
              </span>
            </div>
            <h2>{platform.name}</h2>
            <p>{platform.label}</p>
            <div className="td-platform-bottom">
              <span>{platform.available ? 'Explore the demo' : 'More ways to connect'}</span>
              {selected === platform.id ? <Check size={17} /> : <span className="td-radio-mark" />}
            </div>
          </button>
        ))}
      </div>
      <StepActions
        onNext={onNext}
        disabled={selected !== 'youtube'}
        note="Choose YouTube to get started."
      />
      <div className="td-trust-row">
        <span>
          <ShieldCheck />
          No account required
        </span>
        <span>
          <Zap />
          Ready in minutes
        </span>
        <span>
          <Clock3 />
          Explore at your pace
        </span>
      </div>
    </>
  )
}
