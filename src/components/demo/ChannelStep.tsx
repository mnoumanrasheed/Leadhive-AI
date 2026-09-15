import { Youtube } from './PlatformIcons'
import { Check, CircleCheck, LockKeyhole } from 'lucide-react'
import { demoService } from '../../services/demoService'
import { StepActions, StepHeading } from './DemoUI'

export function ChannelStep({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: boolean
  onSelect: () => void
  onBack: () => void
  onNext: () => void
}) {
  const { channel } = demoService.getSetup()
  return (
    <>
      <StepHeading title="Select Your Channel">
        Choose a channel to experience LeadHive’s AI engagement workflow.
      </StepHeading>
      <div className="td-channel-area">
        <div className="td-section-label">
          AVAILABLE CHANNEL <span>01</span>
        </div>
        <button
          className={'td-channel-card ' + (selected ? 'is-selected' : '')}
          onClick={onSelect}
          aria-pressed={selected}
        >
          <span className="td-channel-avatar">
            <span className="td-brand-mark">
              <img src="/LeadHive%20AI%20Logo.png" alt="" />
            </span>
          </span>
          <span className="td-channel-details">
            <strong>{channel.name}</strong>
            <span>
              <Youtube size={15} />
              YouTube · {channel.subscribers}
            </span>
          </span>
          <span className="td-badge td-badge-green">
            <CircleCheck size={12} />
            Connected
          </span>
          <span className="td-selection-check">{selected && <Check size={16} />}</span>
        </button>
        <div className="td-info-note">
          <LockKeyhole size={18} />
          <p>
            A workspace ready for you.
            <br />
            <span>
              Explore with our demo channel. No sign-in or access to your personal account is
              needed.
            </span>
          </p>
        </div>
      </div>
      <StepActions onBack={onBack} onNext={onNext} disabled={!selected} />
    </>
  )
}
