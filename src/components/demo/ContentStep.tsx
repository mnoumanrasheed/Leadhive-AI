import { Check, Play, Sparkles, Workflow, ArrowUpRight, MessageSquare } from 'lucide-react'
import { demoService } from '../../services/demoService'
import { StepActions, StepHeading } from './DemoUI'

export function ContentStep({
  selected,
  onChange,
  onBack,
  onNext,
}: {
  selected: string[]
  onChange: (ids: string[]) => void
  onBack: () => void
  onNext: () => void
}) {
  const { contents } = demoService.getSetup()
  const allSelected = selected.length === contents.length
  return (
    <>
      <StepHeading title="Choose Demo Content">
        Select the content where LeadHive should demonstrate AI-powered engagement.
      </StepHeading>
      <div className="td-content-toolbar">
        <span>
          <strong>{selected.length}</strong> of {contents.length} videos selected
        </span>
        <label className="td-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(node) => {
              if (node) node.indeterminate = selected.length > 0 && !allSelected
            }}
            onChange={() => onChange(allSelected ? [] : contents.map((item) => item.id))}
          />
          Select All
        </label>
      </div>
      <div className="td-content-grid">
        {contents.map((content, index) => (
          <label
            className={'td-content-card ' + (selected.includes(content.id) ? 'is-selected' : '')}
            key={content.id}
          >
            <input
              type="checkbox"
              checked={selected.includes(content.id)}
              onChange={() =>
                onChange(
                  selected.includes(content.id)
                    ? selected.filter((id) => id !== content.id)
                    : [...selected, content.id],
                )
              }
              aria-label={'Select ' + content.title}
            />
            <span className="td-content-check">
              {selected.includes(content.id) && <Check size={14} />}
            </span>
            <div className={'td-thumbnail td-thumbnail-' + index} aria-hidden="true">
              <span className="td-thumbnail-brand">
                <Sparkles size={12} /> LeadHive AI
              </span>
              <div className="td-thumbnail-art">
                {index === 0 ? (
                  <>
                    <span className="td-mini-sidebar" />
                    <div className="td-mini-dashboard">
                      <span />
                      <span />
                      <span />
                      <i />
                      <i />
                    </div>
                  </>
                ) : index === 1 ? (
                  <div className="td-mini-workflow">
                    <MessageSquare />
                    <span />
                    <Workflow />
                    <span />
                    <ArrowUpRight />
                  </div>
                ) : (
                  <div className="td-mini-orb">
                    <Sparkles size={34} />
                  </div>
                )}
              </div>
              <span className="td-thumbnail-caption">{content.category}</span>
              <span className="td-play">
                <Play size={16} fill="currentColor" />
              </span>
              <span className="td-duration">{content.duration}</span>
            </div>
            <div className="td-content-copy">
              <h2>{content.title}</h2>
              <p>
                {content.views}
                <span>·</span>
                {content.published}
              </p>
              <span className="td-content-source">
                <span />
                Demo channel · Sample content
              </span>
            </div>
          </label>
        ))}
      </div>
      <p className="td-content-hint" role="status">
        {selected.length
          ? 'Your AI will process sample conversations from the selected videos.'
          : 'Select at least one video to launch your demo.'}
      </p>
      <StepActions
        onBack={onBack}
        onNext={onNext}
        disabled={!selected.length}
        label="Launch AI Demo"
      />
    </>
  )
}
